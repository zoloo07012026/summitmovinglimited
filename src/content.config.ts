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

const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    lastUpdated: z.coerce.date(),
    seoDescription: z.string(),
  }),
});

export const collections = { legal };
