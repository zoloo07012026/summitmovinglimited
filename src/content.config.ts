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

/**
 * Blog posts. Every seeded entry ships with `draft: true` and an empty body:
 * the ten cards on the old blog.html were headlines with nothing behind them
 * (each <a> pointed at "#"), so publishing them as-is would have shipped ten
 * empty pages. They are here as CMS starting points, to be written and
 * published one at a time.
 *
 * `image` is a plain path string, not the image() helper: blog images arrive
 * through the CMS into public/assets/uploads, which astro:assets cannot
 * process. .post-image fixes the box at 164px with object-fit:cover, so there
 * is no layout shift regardless of what gets uploaded.
 *
 * The view counts the old page showed (721, 310, 258, ...) are deliberately
 * absent. They were invented, and there is nothing to count them with.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Falls back to description when blank. */
    seoDescription: z.string().optional(),
    pubDate: z.coerce.date(),
    /** Should match one of site.json's blogCategories; drives the sidebar counts. */
    category: z.string(),
    /** Free text, e.g. "9 min". Blank simply omits it from the meta row. */
    readingTime: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    /** At most one. The newest wins if several are flagged. */
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

/**
 * Customer reviews. Intentionally empty.
 *
 * The home page used to carry a marquee of fabricated testimonials. They were
 * deleted, and what replaced them was a comment explaining how to put them
 * back plus a hundred lines of CSS and JS that nothing used. This collection
 * is that instruction made executable: add one entry through the CMS and the
 * section returns, styled, with the marquee working.
 */
const testimonials = defineCollection({
  loader: glob({ base: './src/content/testimonials', pattern: '*.json' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    /** Under the name, e.g. "Local move, Naperville IL". */
    detail: z.string(),
    /** Shown in the avatar circle. Falls back to the name's first letter. */
    initials: z.string().optional(),
    /** 1-5. Only ever set it to what the customer actually gave. */
    rating: z.number().int().min(1).max(5).default(5),
    order: z.number().int().default(0),
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

export const collections = { services, faq, steps, blog, testimonials, legal };
