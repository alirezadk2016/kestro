/**
 * The English address of every Danish page.
 *
 * Danish is the primary market and owns the canonical path — /produkter is
 * what the route folder is called, what the sitemap keys on and what every
 * link in the codebase passes around. This maps that identity to the address
 * an English speaker should see.
 *
 * It matters because the URL is rendered in the search result. Someone
 * searching "refurbished business laptops" was shown
 * kestro.dk/en/produkter/baerbare-computere — a string with no English in it
 * and two Danish digraphs transliterated into noise. The page can be perfect
 * and still look like the wrong country's site before anyone clicks.
 *
 * Everything reads from here:
 *
 *   - localePath() renders the English address, so all 106 call sites keep
 *     passing Danish paths and need no change at all;
 *   - canonical, hreflang, og:url and the sitemap all resolve through
 *     localePath, so they follow without being touched;
 *   - next.config.mjs rewrites the English address onto the Danish route
 *     folder, and 301s the old English address to the new one.
 *
 * Danish URLs never move. Only the /en tree changes address, and every old
 * one keeps answering through a permanent redirect.
 */

/** Danish path (the canonical identity) → the English path segment after /en. */
export const englishPath: Record<string, string> = {
  "/flaadeloesninger": "/fleet-solutions",
  "/produkter": "/products",
  "/modeller": "/models",
  "/maskinen": "/inside-the-machine",
  "/kvalitet": "/condition-and-quality",
  "/priser": "/pricing",
  "/tilbud-eksempel": "/sample-quote",
  "/vejledninger": "/knowledge",
  "/saelg-til-os": "/sell-to-us",
  "/reparation": "/repairs",
  "/ydelser": "/services",
  "/tilbud": "/get-a-quote",
  "/om-os": "/about-us",
  "/kontakt": "/contact",
  "/privatlivspolitik": "/privacy-policy",
  "/handelsbetingelser": "/terms-of-sale",
};

/** The same map inverted, for turning an English address back into the path
 *  the route folder actually uses. */
export const danishPath: Record<string, string> = Object.fromEntries(
  Object.entries(englishPath).map(([da, en]) => [en, da]),
);

/**
 * The English address for a Danish path, or the path itself when there is no
 * translation for it.
 *
 * Only the first segment is translated here. A path with a slug on it —
 * /produkter/baerbare-computere — keeps its slug for now and gets the English
 * section: /products/baerbare-computere. The slugs are the next stage, and
 * doing the sections first means every hub and every top-level page reads in
 * English immediately, while the pattern is proved on the pages that carry the
 * commercial intent.
 */
export function toEnglishPath(path: string): string {
  return translate(path, englishPath, "");
}

/** The Danish path for an English one, for the language switcher. */
export function toDanishPath(path: string): string {
  return translate(path, danishPath, "/");
}

/**
 * Swap the leading segment, leaving everything after it alone.
 *
 * The query string and the fragment are cut off first and put back after.
 * They have to be: several links carry one — /tilbud?model=Lenovo…,
 * /tilbud?antal=50%2B, /vejledninger#hukommelse — and without this the whole
 * string was looked up as a path, missed, and came back untranslated. The
 * result was a link to /en/tilbud, which now 301s to /en/get-a-quote: the
 * router prefetched it, followed the redirect and threw.
 */
function translate(path: string, map: Record<string, string>, whenRoot: string): string {
  if (path === "/" || path === "") return whenRoot;

  const mark = path.search(/[?#]/);
  const bare = mark === -1 ? path : path.slice(0, mark);
  const suffix = mark === -1 ? "" : path.slice(mark);

  const direct = map[bare];
  if (direct) return `${direct}${suffix}`;

  const cut = bare.indexOf("/", 1);
  if (cut === -1) return path;

  const head = map[bare.slice(0, cut)];
  return head ? `${head}${bare.slice(cut)}${suffix}` : path;
}
