/**
 * Inline SVG icons, collected from the ~50 duplicated <svg> blocks the old
 * hand-written pages carried (the phone icon alone appeared four times, the
 * arrow six).
 *
 * Every path is copied verbatim from the original markup so nothing shifts by
 * a pixel. Sizing is left to the caller's CSS, exactly as before -- the old
 * rules (.btn svg, .trust-icon svg, .how-icon svg, ...) still apply because
 * Icon.astro renders a plain <svg> into the light DOM.
 *
 * They live in a .ts file rather than inside the component so that content
 * files can be typed against the key set: an `icon` value that is not in here
 * fails the build with a readable message instead of rendering an empty box.
 *
 * Two conventions sit side by side, deliberately:
 *   - the original icons declare stroke AND stroke-width on each path;
 *   - the home page icons declare stroke only, and take their width from
 *     defaultStrokeWidth below, because several of them appear at 1.6, 1.8 and
 *     2 in different places. Baking a width in would have meant near-duplicate
 *     entries for the same shape.
 */

/* The service card and the "we pack & load" step draw the same house at
   different stroke widths, so the shape is defined once and aliased. */
const homeRoof =
  '<path d="M3 21V8l9-5 9 5v13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21v-7h6v7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>';

export const icons = {
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  chevron:
    '<path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  close: '<path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  mail: '<path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>',
  pin: '<path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>',
  facebook:
    '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  instagram:
    '<rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
  arrow:
    '<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',

  /* Blog sidebar. The originals set stroke on the <svg>; moving it onto the
     paths renders identically and keeps every icon in this map uniform. */
  search:
    '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2"/>',
  /* Not the same shape as `pin` above -- the sidebar drew its own. */
  'map-pin':
    '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>',
  diamond: '<path d="m20 12-8 8-8-8 8-8 8 8Z" stroke="currentColor" stroke-width="2"/>',

  /* ---- Home page. Width comes from defaultStrokeWidth. ---- */

  /* The trust bar and the "safe delivery" step show the shield with a tick
     inside it; the "licensed & insured" bullet shows the shield alone. */
  shield:
    '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" stroke="currentColor"/>',
  'shield-check':
    '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" stroke="currentColor"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  /* Two figures in the trust bar, one in the "trained crews" bullet. */
  users:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-linecap="round"/>',
  'users-solo':
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor"/>',
  star: '<path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 16.9 5.8 20.3l1.6-6.8L2.2 8.9l6.9-.6z" stroke="currentColor" stroke-linejoin="round"/>',
  clock:
    '<circle cx="12" cy="12" r="9" stroke="currentColor"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  home: homeRoof,
  'home-roof': homeRoof,
  chart:
    '<path d="M3 3v18h18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 14l4-4 3 3 5-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  box: '<rect x="3" y="7" width="18" height="13" rx="1" stroke="currentColor"/><path d="M3 11h18M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  /* The tick beside each service feature. The pale disc is a fill, not a
     stroke, so it is unaffected by the stroke width. */
  'check-circle':
    '<circle cx="12" cy="12" r="10" fill="#eaf1ff"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  'check-square':
    '<path d="M9 11l3 3L22 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-linecap="round"/>',
  'arrow-left':
    '<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor"/>',
  check: '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
} as const;

export type IconName = keyof typeof icons;

/**
 * The weight each home page icon was drawn at. Kept here rather than in the
 * content files: which shape wants 1.6 and which wants 2 is a property of the
 * drawing, not a question anyone should have to answer in the CMS.
 */
export const defaultStrokeWidth: Partial<Record<IconName, number>> = {
  shield: 2,
  'shield-check': 2,
  users: 2,
  'users-solo': 2,
  star: 1.6,
  clock: 2,
  home: 1.8,
  'home-roof': 2,
  chart: 1.8,
  box: 1.8,
  'check-circle': 2,
  'check-square': 2,
  calendar: 2,
  'arrow-left': 2,
  lock: 2,
  check: 2.5,
};

export const isIconName = (value: string): value is IconName => value in icons;
