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
