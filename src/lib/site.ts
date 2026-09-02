import raw from '../data/site.json';
import { SiteSchema, type Site } from './schema';

/**
 * The validated business data, imported by the header, footer, JSON-LD builders
 * and anywhere else that needs the phone number or address.
 *
 * Parsing at module scope means a malformed CMS save breaks `astro build` with
 * the offending field path, instead of shipping a page with "undefined" in the
 * footer.
 */
function load(): Site {
  const result = SiteSchema.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues
      .map((i) => `  src/data/site.json -> ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Site settings failed validation:\n${problems}`);
  }
  return result.data;
}

export const site: Site = load();

/** `(847) 370-5754` -> `tel:8473705754`. Derived so the number lives in one place. */
export const phoneHref = `tel:${site.phone.replace(/\D/g, '')}`;

/** "10350 Dearlove Rd, Glenview, IL 60025" */
export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

/** Renders a possibly-blank figure. Blank is a deliberate state, not a bug. */
export const stat = (value?: string) => (value && value.trim() !== '' ? value : '—');
