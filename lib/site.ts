/**
 * The canonical origin, in one place.
 *
 * It has to match the host the site actually answers on, exactly, because
 * three separate things are checked against it and all three fail quietly when
 * it is wrong:
 *
 *   - Search Console rejects a sitemap whose <loc> values sit on a different
 *     host than the property it was submitted under. That is the usual cause
 *     of "Couldn't fetch" on a sitemap that is otherwise valid.
 *   - Every canonical on the site resolves against it, so a mismatch points
 *     the whole site at a host that redirects.
 *   - robots.txt advertises the sitemap at this origin.
 *
 * If www.kestro.dk is the address that answers and kestro.dk redirects to it,
 * put the www back — and change nothing else, because everything reads from
 * here.
 */
export const SITE_ORIGIN = "https://kestro.dk";

/** Absolute URL for a site-internal path. Root comes back without a trailing slash. */
export function absoluteUrl(path: string): string {
  return path === "/" || path === "" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}
