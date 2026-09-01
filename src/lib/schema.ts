import { z } from 'astro/zod';

/**
 * Schemas for the JSON singletons in src/data/.
 *
 * These files are edited through the CMS, so a bad save has to fail the build
 * with a readable path rather than crash a template with `undefined`. Astro's
 * content collections cannot express "several files with different shapes"
 * without an awkward discriminated union, so the singletons are plain imports
 * validated here instead.
 *
 * Rule that must survive every future edit: any figure a person could invent
 * (move counts, ratings, years in business, on-time percentage) is an OPTIONAL
 * STRING. Never a number, never required. Components render an em-dash when it
 * is blank, which is how the site deliberately shows "we have no verified
 * figure for this yet".
 */

/** A headline figure. `value` blank on purpose renders as an em-dash. */
export const StatSchema = z.object({
  label: z.string(),
  value: z.string().optional(),
});

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
});

export const HoursRowSchema = z.object({
  label: z.string(),
  value: z.string(),
  closed: z.boolean().default(false),
});

export const SocialLinkSchema = z.object({
  network: z.enum(['facebook', 'instagram']),
  /** Blank means "not set up yet" -- the icon is hidden rather than linking to '#'. */
  url: z.string().default(''),
});

export const SiteSchema = z.object({
  businessName: z.string(),
  phone: z.string(),
  email: z.string(),
  address: AddressSchema,
  hours: z.array(HoursRowSchema),
  social: z.array(SocialLinkSchema).default([]),
  footerBlurb: z.string(),
  copyrightName: z.string(),
  serviceAreas: z.array(z.string()).default([]),
  popularServices: z.array(z.string()).default([]),
  blogCategories: z.array(z.string()).default([]),
  /**
   * Only ever set once there is a real, verifiable average. While empty, no
   * aggregateRating is emitted in JSON-LD -- inventing one risks a Google
   * manual action.
   */
  rating: z
    .object({
      value: z.string().optional(),
      count: z.number().optional(),
    })
    .default({}),
});

export type Site = z.infer<typeof SiteSchema>;
export type Stat = z.infer<typeof StatSchema>;

/* ------------------------------------------------------------------ *
 * Page copy (src/data/pages/*.json)
 * ------------------------------------------------------------------ */

export const SeoSchema = z.object({
  title: z.string(),
  /** Required, so no page can ship without a meta description. */
  description: z.string().min(1),
});

/** The eyebrow / h1 / lead block at the top of an interior page. */
export const PageHeroSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  lead: z.string().optional(),
});

/** The dark navy card beside a page hero. */
export const HeroPanelSchema = z.object({
  /** Omit to have the page compute it, e.g. "10 services" from the collection. */
  strong: z.string().optional(),
  text: z.string(),
  stats: z.array(StatSchema).default([]),
});

export const SectionHeadSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  text: z.string().optional(),
});

export const CtaSchema = z.object({
  heading: z.string(),
  text: z.string(),
  label: z.string(),
});

export const LinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const CardListSchema = z.object({
  heading: z.string(),
  text: z.string().optional(),
  items: z.array(z.string()).default([]),
});

export type PageHero = z.infer<typeof PageHeroSchema>;
export type HeroPanel = z.infer<typeof HeroPanelSchema>;
export type SectionHead = z.infer<typeof SectionHeadSchema>;
export type Cta = z.infer<typeof CtaSchema>;
export type Link = z.infer<typeof LinkSchema>;
export type CardList = z.infer<typeof CardListSchema>;

export const ServicesPageSchema = z.object({
  seo: SeoSchema,
  hero: PageHeroSchema,
  jumpLinks: z.array(LinkSchema).default([]),
  panel: HeroPanelSchema,
  coreHead: SectionHeadSchema,
  supportHead: SectionHeadSchema,
  cta: CtaSchema,
});

export const FaqPageSchema = z.object({
  seo: SeoSchema,
  hero: PageHeroSchema,
  panel: HeroPanelSchema,
  cta: CtaSchema,
});

/**
 * A trust-bar cell. Two of the four are figures rather than claims, so a blank
 * heading is a valid state and renders as an em-dash.
 */
export const TrustItemSchema = z.object({
  icon: z.string(),
  heading: z.string().default(''),
  text: z.string(),
});

export const WhyPointSchema = z.object({
  icon: z.string(),
  heading: z.string(),
  text: z.string(),
});

export const HomePageSchema = z.object({
  /** The home page keeps its original full <title> rather than the suffix form. */
  seo: SeoSchema.extend({ titleOverride: z.string().optional() }),
  hero: z.object({
    eyebrow: z.string(),
    /** The headline is two lines; the second is the blue half. */
    headingLead: z.string(),
    headingAccent: z.string(),
    sub: z.string(),
    ctaLabel: z.string(),
  }),
  trust: z.array(TrustItemSchema).default([]),
  servicesHead: SectionHeadSchema,
  /** The link at the foot of every service card. */
  servicesLinkLabel: z.string(),
  howHead: SectionHeadSchema,
  /** Only rendered once the testimonials collection has an entry. */
  testimonialsHead: SectionHeadSchema,
  howCtaLabel: z.string(),
  why: z.object({
    eyebrow: z.string(),
    /** Rendered one per line, so the break is content rather than markup. */
    headingLines: z.array(z.string()).default([]),
    lead: z.string(),
    points: z.array(WhyPointSchema).default([]),
    stats: z.array(StatSchema).default([]),
  }),
  cta: CtaSchema,
});

/**
 * The quote form. The endpoint and the phone number in the error message used
 * to be hardcoded in index.html's script, which meant changing either one was
 * a code edit.
 */
const FormFieldSchema = z.object({
  label: z.string(),
  placeholder: z.string().default(''),
});

export const FormsSchema = z.object({
  endpoint: z.string().url(),
  subject: z.string(),
  heading: z.string(),
  sub: z.string(),
  /** Three labels, one per step. The step count follows this array. */
  stepLabels: z.array(z.string()).default([]),
  nextLabel: z.string(),
  submitLabel: z.string(),
  sendingLabel: z.string(),
  secureNote: z.string(),
  successHeading: z.string(),
  successText: z.string(),
  /** `{phone}` is replaced with site.json's number at build time. */
  errorText: z.string(),
  /** Shown in the review for a field the customer left empty. */
  notProvided: z.string(),
  noneSelected: z.string(),
  /** Joins the two locations on the review's Route row. */
  routeJoiner: z.string(),
  moveTypes: z.array(z.string()).default([]),
  homeSizes: z.array(z.string()).default([]),
  additionalServices: z.array(z.string()).default([]),
  fields: z.record(FormFieldSchema),
  reviewLabels: z.record(z.string()),
});

/** The sidebar's fixed labels. The lists themselves come from site.json. */
export const BlogSidebarSchema = z.object({
  searchHeading: z.string(),
  searchPlaceholder: z.string(),
  areasHeading: z.string(),
  areasLinkLabel: z.string(),
  areasLinkHref: z.string(),
  ratingHeading: z.string(),
  ratingLabel: z.string(),
  popularHeading: z.string(),
  categoriesHeading: z.string(),
});

export type BlogSidebar = z.infer<typeof BlogSidebarSchema>;

export const BlogPageSchema = z.object({
  seo: SeoSchema,
  heading: z.object({
    eyebrow: z.string(),
    title: z.string(),
    text: z.string(),
  }),
  /**
   * Shown while every post is still a draft. This is a real state, not an
   * error: the seeded posts have no bodies until someone writes them.
   */
  empty: z.object({
    heading: z.string(),
    text: z.string(),
    label: z.string(),
    href: z.string(),
  }),
  sidebar: BlogSidebarSchema,
  /** Closes an individual post. */
  postCta: CtaSchema,
});

export const GuidePageSchema = z.object({
  seo: SeoSchema,
  hero: PageHeroSchema,
  panel: HeroPanelSchema,
  processHead: SectionHeadSchema,
  checklistHead: SectionHeadSchema,
  checklist: z.array(CardListSchema).default([]),
  tips: z.array(CardListSchema).default([]),
  cta: CtaSchema,
});
