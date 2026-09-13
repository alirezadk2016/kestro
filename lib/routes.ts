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

  /*
   * Stage two: the slugs.
   *
   * The sections above put English in the first segment, which left an English
   * reader looking at /en/knowledge/reparere-eller-koebe-ny — half a sentence
   * in their language and half in a language they do not read, with the two
   * Danish digraphs transliterated into noise. The URL is rendered in the
   * search result, so that string is doing work before anyone clicks.
   *
   * Written as whole paths rather than a separate slug map, because translate()
   * looks the full path up first and only falls back to swapping the leading
   * segment. One map, one lookup order, no second mechanism to keep in step.
   *
   * The English form is the query an English speaker types, not a translation
   * of the Danish: "windows-10-end-of-support", not "windows-10-support-ended".
   *
   * Danish URLs do not move. Every old English address keeps answering through
   * a 301 in next.config.mjs.
   */
  "/vejledninger/windows-10-support-slutter": "/knowledge/windows-10-end-of-support",
  "/vejledninger/refurbished-eller-brugt": "/knowledge/refurbished-or-used",
  "/vejledninger/reparere-eller-koebe-ny": "/knowledge/repair-or-replace",
  "/vejledninger/opgrader-ram-i-baerbar": "/knowledge/upgrade-laptop-memory",
  "/vejledninger/tjek-brugt-baerbar-foer-koeb": "/knowledge/check-a-used-laptop",
  "/vejledninger/samle-din-egen-pc": "/knowledge/build-your-own-pc",
  "/vejledninger/windows-11-paa-aeldre-maskine": "/knowledge/windows-11-on-older-hardware",
  "/vejledninger/slet-data-foer-du-saelger": "/knowledge/erase-data-before-selling",
  "/vejledninger/vaelg-erhvervsbaerbar": "/knowledge/thinkpad-vs-elitebook-vs-latitude",
  "/vejledninger/dock-og-skaerme-til-arbejdspladsen": "/knowledge/how-many-monitors-can-a-dock-run",
  "/vejledninger/standardiser-firmacomputere": "/knowledge/standardise-company-computers",
  "/produkter/baerbare-computere": "/products/business-laptops",
  "/produkter/stationaere-computere": "/products/desktop-computers",
  "/produkter/skaerme": "/products/monitors",
  "/produkter/dockingstationer": "/products/docking-stations",
  "/ydelser/sourcing-og-indkoeb": "/services/sourcing-and-purchasing",
  "/ydelser/klargoering-og-test": "/services/preparation-and-testing",
  "/ydelser/nordisk-tilpasning": "/services/nordic-preparation",
  "/ydelser/opstart-af-arbejdspladser": "/services/workstation-setup",
  "/ydelser/overskudslager-og-returvarer": "/services/overstock-and-returns",
  "/ydelser/levering": "/services/delivery",
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
