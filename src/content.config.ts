import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content collections. Repeating things live here; one-off page copy lives in
 * src/data/*.json and is validated by src/lib/schema.ts instead.
 *
 * Standing rule: any figure someone could invent -- move counts, ratings, years
 * in business, on-time percentage -- is an OPTIONAL STRING, never a number and
 * never required. Blank renders as an em-dash, which is how this site says
 * "no verified figure yet" rather than making one up.
 */

/**
 * The ten services, one file each. The filename becomes the anchor id on
 * /services/, so index.html's old deep links (#local-moving, #long-distance,
 * #packing) keep working -- which is why the CMS is configured not to create
 * or rename entries in this collection.
 *
 * One entry feeds three surfaces that used to disagree with each other:
 *   /services/ tile -> title      ("Local Residential Moving")
 *   home page card  -> shortTitle ("Local Moving")
 *   footer link     -> shortTitle ("Local Moving")
 */
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '*.json' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    group: z.enum(['core', 'support']),
    order: z.number().int(),
    tag: z.string(),
    summary: z.string(),
    featuredOnHome: z.boolean().default(false),
    homeOrder: z.number().int().optional(),
    homeSummary: z.string().optional(),
    homeFeatures: z.array(z.string()).default([]),
    icon: z.string().optional(),
    showInFooter: z.boolean().default(false),
    footerOrder: z.number().int().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ base: './src/content/faq', pattern: '*.json' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().int(),
    /** Reproduces the <details open> on the first question. */
    openByDefault: z.boolean().default(false),
  }),
});

/**
 * The four process steps, shared by the home page's "How It Works" and the
 * moving guide. Both wordings live on one entry so they can never drift into
 * contradiction the way the duplicated copies had started to.
 */
const steps = defineCollection({
  loader: glob({ base: './src/content/steps', pattern: '*.json' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      title: z.string(),
      description: z.string(),
      /** Falls back to title/description when blank. */
      guideTitle: z.string().optional(),
      guideDescription: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().default(''),
      /** Key into Icon.astro, shown on the home page card. */
      icon: z.string().optional(),
    }),
});

const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    lastUpdated: z.coerce.date(),
    seoDescription: z.string(),
  }),
});

export const collections = { services, faq, steps, legal };
