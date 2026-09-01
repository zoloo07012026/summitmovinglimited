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
