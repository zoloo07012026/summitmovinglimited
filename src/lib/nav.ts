/**
 * The navigation tree, used by both the desktop nav and the mobile drawer so
 * the two can no longer drift (they were duplicated string-for-string in
 * site-components.js).
 *
 * The old site computed hrefs at runtime with `homeHref()`, which sniffed
 * `window.location.pathname` to decide between `#quote` and `index.html#quote`.
 * Every href here is absolute instead, so nothing depends on which page is
 * rendering and the links work identically from any route.
 */

export type NavKey = 'home' | 'services' | 'guide' | 'blog' | 'company';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  /** Matches the `active` prop a page passes to <Header />. */
  key: NavKey;
  /** Present on "Company", which renders as a hover dropdown. */
  children?: NavLink[];
}

export const QUOTE_HREF = '/#quote';

export const navItems: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'services', label: 'Services', href: '/services/' },
  // Previously pointed at /#how, leaving moving-guide.html unreachable from
  // anywhere on the site. It is a real page now.
  { key: 'guide', label: 'Moving Guide', href: '/moving-guide/' },
  { key: 'blog', label: 'Blog', href: '/blog/' },
  {
    key: 'company',
    label: 'Company',
    href: '/#about',
    children: [
      { label: 'About Us', href: '/#about' },
      { label: 'FAQ', href: '/faq/' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
];

export const footerServiceLinks: NavLink[] = [
  { label: 'Local Moving', href: '/services/#local-moving' },
  { label: 'Long-Distance Moving', href: '/services/#long-distance' },
  { label: 'Packing Services', href: '/services/#packing' },
];

export const footerCompanyLinks: NavLink[] = [
  { label: 'About Us', href: '/#about' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
];

export const footerLegalLinks: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Terms of Service', href: '/terms/' },
];
