import { z } from 'astro/zod';

import rawServices from '../data/pages/services.json';
import rawFaq from '../data/pages/faq.json';
import rawGuide from '../data/pages/guide.json';

import { ServicesPageSchema, FaqPageSchema, GuidePageSchema } from './schema';

/**
 * The one-off page copy in src/data/pages/, validated the same way site.ts
 * validates site.json: at module scope, so a bad CMS save fails `astro build`
 * with the offending field path instead of rendering `undefined` into a heading.
 */
function parse<S extends z.ZodTypeAny>(schema: S, raw: unknown, file: string): z.infer<S> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues
      .map((i) => `  ${file} -> ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Page copy failed validation:\n${problems}`);
  }
  return result.data;
}

export const servicesPage = parse(ServicesPageSchema, rawServices, 'src/data/pages/services.json');
export const faqPage = parse(FaqPageSchema, rawFaq, 'src/data/pages/faq.json');
export const guidePage = parse(GuidePageSchema, rawGuide, 'src/data/pages/guide.json');
