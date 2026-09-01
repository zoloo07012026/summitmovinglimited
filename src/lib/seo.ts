import { site } from './site';

/**
 * Structured data builders. The old site emitted none at all.
 *
 * Everything is assembled into a single @graph per page with stable @ids, so
 * the WebSite, the business and the page-specific nodes reference each other
 * instead of repeating the business details on every page.
 *
 * The one rule that must survive: aggregateRating is emitted ONLY when
 * site.json carries a real value AND a real count. Marking up a rating that
 * does not exist is a Google manual action, not a shortcut.
 */

export type JsonLdNode = Record<string, unknown>;

export const businessId = (base: URL) => `${base.origin}/#business`;
export const websiteId = (base: URL) => `${base.origin}/#website`;

/* ---------------- opening hours ---------------- */

const DAY_NAMES: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/** "Mon - Fri" -> five days; "Saturday" -> one; anything else -> null. */
function daysFromLabel(label: string): string[] | null {
  const parts = label.split(/\s*-\s*/).map((p) => DAY_NAMES[p.trim().slice(0, 3).toLowerCase()]);
  if (parts.some((p) => !p)) return null;
  if (parts.length === 1) return [parts[0]!];
  if (parts.length !== 2) return null;
  const from = WEEK.indexOf(parts[0] as (typeof WEEK)[number]);
  const to = WEEK.indexOf(parts[1] as (typeof WEEK)[number]);
  if (from < 0 || to < 0 || to < from) return null;
  return WEEK.slice(from, to + 1) as unknown as string[];
}

/** "7:00 PM" -> "19:00". */
function to24h(value: string): string | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  const hour = (Number(m[1]) % 12) + (m[3]!.toUpperCase() === 'PM' ? 12 : 0);
  return `${String(hour).padStart(2, '0')}:${m[2]}`;
}

function timesFromValue(value: string) {
  const [from, to] = value.split(/\s*-\s*/);
  if (!from || !to) return null;
  const opens = to24h(from);
  const closes = to24h(to);
  return opens && closes ? { opens, closes } : null;
}

/**
 * Rows that do not describe a weekly window are skipped rather than guessed
 * at: "Sunday / Closed" carries no hours, and "Emergency / 24/7 Support" is a
 * service promise, not an opening time.
 */
export function openingHours() {
  return site.hours.flatMap((row) => {
    if (row.closed) return [];
    const dayOfWeek = daysFromLabel(row.label);
    const times = timesFromValue(row.value);
    if (!dayOfWeek || !times) return [];
    return [{ '@type': 'OpeningHoursSpecification', dayOfWeek, ...times }];
  });
}

/* ---------------- nodes ---------------- */

export function websiteNode(base: URL): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(base),
    url: `${base.origin}/`,
    name: site.businessName,
    publisher: { '@id': businessId(base) },
  };
}

/** MovingCompany is a LocalBusiness subtype and describes this business exactly. */
export function businessNode(base: URL): JsonLdNode {
  const node: JsonLdNode = {
    '@type': 'MovingCompany',
    '@id': businessId(base),
    name: site.businessName,
    url: `${base.origin}/`,
    telephone: site.phone,
    email: site.email,
    image: `${base.origin}/og.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: 'US',
    },
    areaServed: site.serviceAreas.map((name) => ({ '@type': 'Place', name })),
  };

  const hours = openingHours();
  if (hours.length) node.openingHoursSpecification = hours;

  const sameAs = site.social.map((s) => s.url).filter((url) => url !== '');
  if (sameAs.length) node.sameAs = sameAs;

  // Only with a verified figure. See the note at the top of this file.
  if (site.rating.value && site.rating.count) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
    };
  }

  return node;
}

/* ---------------- per-page nodes ---------------- */

export interface ServiceForSchema {
  id: string;
  title: string;
  summary: string;
  tag: string;
}

/** /services/ as a list of Service offerings, each anchored to its own tile. */
export function servicesListNode(
  base: URL,
  url: URL,
  services: ServiceForSchema[]
): JsonLdNode {
  return {
    '@type': 'ItemList',
    itemListElement: services.map((service, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.summary,
        serviceType: service.tag,
        url: `${url.href}#${service.id}`,
        provider: { '@id': businessId(base) },
      },
    })),
  };
}

export function faqPageNode(items: { question: string; answer: string }[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function howToNode(
  name: string,
  description: string,
  steps: { title: string; description: string }[]
): JsonLdNode {
  return {
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

export function blogPostingNode(
  base: URL,
  url: URL,
  post: { title: string; description: string; pubDate: Date; image?: string }
): JsonLdNode {
  return {
    '@type': 'BlogPosting',
    '@id': `${url.href}#post`,
    headline: post.title,
    description: post.description,
    datePublished: post.pubDate.toISOString(),
    mainEntityOfPage: url.href,
    // The business is the author: there are no bylines on this site.
    author: { '@id': businessId(base) },
    publisher: { '@id': businessId(base) },
    image: post.image ? new URL(post.image, base).href : `${base.origin}/og.png`,
  };
}

/** "moving-guide" -> "Moving Guide", for the intermediate crumbs. */
const titleCase = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/**
 * Derived from the path, with the current page's own title as the last crumb.
 * Returns null on the home page, where a one-item trail says nothing.
 */
export function breadcrumbNode(base: URL, url: URL, title: string): JsonLdNode | null {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const itemListElement = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${base.origin}/` },
  ];

  segments.forEach((segment, i) => {
    const isLast = i === segments.length - 1;
    itemListElement.push({
      '@type': 'ListItem',
      position: i + 2,
      name: isLast ? title : titleCase(segment),
      item: `${base.origin}/${segments.slice(0, i + 1).join('/')}/`,
    });
  });

  return { '@type': 'BreadcrumbList', itemListElement };
}
