/**
 * Two languages: Danish is the primary market and keeps the bare URLs
 * (kestro.dk/produkter), English lives under /en. Middleware rewrites the
 * unprefixed paths to /da internally, so nothing that is already indexed
 * changes address.
 */

import { toDanishPath, toEnglishPath } from "./routes";

export const langs = ["da", "en"] as const;

export type Lang = (typeof langs)[number];

export const defaultLang: Lang = "da";

/** A string that exists in both languages. The type keeps them in step. */
export type Localized = Record<Lang, string>;

export function isLang(value: string): value is Lang {
  return (langs as readonly string[]).includes(value);
}

/**
 * Render a site-internal path in the given language.
 *
 * Callers always pass the Danish path — that is the page's identity, the name
 * of the route folder, and the key the sitemap uses. Danish returns it
 * unchanged; English returns the translated address from lib/routes.ts.
 *
 * This is the one funnel. Canonical, hreflang, og:url, the sitemap and every
 * link on the site resolve through here, so giving the English tree English
 * addresses is a change to this function and nothing else — all 106 call
 * sites keep passing exactly the Danish paths they always did.
 */
export function localePath(path: string, lang: Lang): string {
  const clean = path === "/" ? "" : path;
  if (lang === defaultLang) return clean || "/";
  return `/en${toEnglishPath(clean)}`;
}

/**
 * Strip the language prefix from a pathname, e.g. /en/produkter -> /produkter.
 *
 * Both prefixes have to be handled: on a Danish page the URL has no prefix,
 * but usePathname() reports the path the middleware rewrote to (/da/...), so
 * stripping only /en would build /en/da/... from the language switcher.
 */
export function stripLocale(pathname: string): string {
  for (const lang of langs) {
    if (pathname === `/${lang}`) return "/";
    if (pathname.startsWith(`/${lang}/`)) {
      const rest = pathname.slice(lang.length + 1);
      /* An English URL carries the English address, so turn it back into the
         Danish path before anything downstream looks it up or hands it to
         localePath — otherwise the language switcher on /en/products would
         build /en/products again instead of /produkter. */
      return lang === "en" ? toDanishPath(rest) : rest;
    }
  }
  return pathname;
}

export const htmlLang: Record<Lang, string> = {
  da: "da-DK",
  en: "en",
};

export const langLabel: Record<Lang, string> = {
  da: "Dansk",
  en: "English",
};

/**
 * Canonical plus hreflang alternates for one page. Next replaces the layout's
 * `alternates` wholesale when a page sets its own, so every page has to carry
 * the full language map — otherwise Google sees the two versions as duplicates.
 */
export function alternatesFor(path: string, lang: Lang) {
  const da = localePath(path, "da");
  const en = localePath(path, "en");

  /* "da", not "da-DK": the region subtag would target Danish speakers in
     Denmark only, and the same pages serve Norway. Has to stay in step with
     the hreflang written into app/sitemap.ts — Google cross-checks the two. */
  return {
    canonical: localePath(path, lang),
    languages: { da, en, "x-default": da },
  };
}

/**
 * The Open Graph block for one page.
 *
 * og:url was missing everywhere. A share that carries no URL leaves the
 * scraper to guess which address the card belongs to — and where a page can be
 * reached at more than one address, the guess is what gets attributed. It is
 * built from the same localePath() as the canonical, so the two cannot drift.
 *
 * No title, description or image here: Next fills og:title and og:description
 * from the page's own title and description, and the image comes from the
 * opengraph-image file convention. Repeating them would be two places to
 * change every time one of them is edited.
 */
/**
 * The Open Graph block for one page.
 *
 * og:url was missing everywhere. A share that carries no URL leaves the
 * scraper to guess which address the card belongs to — and where a page can be
 * reached at more than one address, the guess is what gets attributed. It is
 * built from the same localePath() as the canonical, so the two cannot drift.
 *
 * The image has to be named here even though app/opengraph-image.tsx already
 * generates it: a page that declares `openGraph` replaces the one Next
 * assembled from the file convention, so leaving it out silently drops
 * og:image and downgrades the Twitter card to the small one. Resolved against
 * metadataBase in the layout, so it comes out absolute on the canonical host.
 *
 * No title or description: Next fills those from the page's own metadata, and
 * repeating them would be two places to edit for one change.
 */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  type: "image/png",
};

export function openGraphFor(path: string, lang: Lang) {
  return {
    type: "website" as const,
    siteName: "Kestro",
    url: localePath(path, lang),
    locale: lang === "da" ? "da_DK" : "en_GB",
    alternateLocale: lang === "da" ? "en_GB" : "da_DK",
    images: [OG_IMAGE],
  };
}

/** Canonical, hreflang, Open Graph and the Twitter card for a page. */
export function metaFor(path: string, lang: Lang) {
  return {
    alternates: alternatesFor(path, lang),
    openGraph: openGraphFor(path, lang),
    twitter: {
      card: "summary_large_image" as const,
      images: [OG_IMAGE],
    },
  };
}
