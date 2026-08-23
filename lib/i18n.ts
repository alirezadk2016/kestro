/**
 * Two languages: Danish is the primary market and keeps the bare URLs
 * (kestro.dk/produkter), English lives under /en. Middleware rewrites the
 * unprefixed paths to /da internally, so nothing that is already indexed
 * changes address.
 */

export const langs = ["da", "en"] as const;

export type Lang = (typeof langs)[number];

export const defaultLang: Lang = "da";

/** A string that exists in both languages. The type keeps them in step. */
export type Localized = Record<Lang, string>;

export function isLang(value: string): value is Lang {
  return (langs as readonly string[]).includes(value);
}

/** Prefix a site-internal path for the given language. */
export function localePath(path: string, lang: Lang): string {
  const clean = path === "/" ? "" : path;
  return lang === defaultLang ? clean || "/" : `/en${clean}`;
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
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
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

  return {
    canonical: localePath(path, lang),
    languages: { "da-DK": da, en, "x-default": da },
  };
}
