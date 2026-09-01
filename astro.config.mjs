// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The one place the production origin is declared. Canonical URLs, the sitemap
// and every JSON-LD @id derive from Astro.site, so changing the domain is a
// one-line edit here.
const SITE = 'https://summitmovingltd.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Emits /services/index.html so routes are /services/ — the shape the
  // netlify.toml 301s from the old *.html URLs point at.
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // The CMS is an editing surface, never a search result.
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});
