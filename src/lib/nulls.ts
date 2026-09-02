/**
 * The CMS writes `null` for a field someone cleared, not `undefined` and not
 * the key's absence. Zod's `.default()` and `.optional()` only treat
 * `undefined` that way, so a cleared field fails validation and breaks the
 * build -- which is exactly what happened the first time the CMS was used:
 * `"rating": {}` came back as `"rating": null` and `astro build` stopped.
 *
 * Stripping nulls before validation turns "cleared in the CMS" into "absent",
 * which is what every schema in this project already knows how to handle. It
 * is applied at both entry points: the JSON singletons in src/lib/site.ts and
 * src/lib/pages.ts, and every content collection in src/content.config.ts.
 *
 * This is a general fix on purpose. Patching the one field that broke would
 * have left every other optional field waiting to break the same way the first
 * time it is emptied.
 */
export function stripNulls<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null).map(stripNulls) as unknown as T;
  }

  // Only plain objects are rebuilt. Frontmatter has already been parsed by the
  // time this runs, so an unquoted date is a Date instance -- recursing into
  // one would return an empty object and fail the schema with the unhelpful
  // "expected date, received object".
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (item !== null) out[key] = stripNulls(item);
    }
    return out as T;
  }

  return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
