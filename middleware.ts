import { NextResponse, type NextRequest } from "next/server";

/**
 * Danish is the primary market, so it keeps the bare URLs: /produkter, not
 * /da/produkter. Every route actually lives under app/[lang], so anything
 * without a language prefix is rewritten to /da internally — the address bar
 * does not change, and the URLs that are already indexed keep working.
 *
 * /en/... is left alone and resolves to app/[lang] with lang="en".
 *
 * That is the whole job now. This file used to also send visitors outside
 * Scandinavia from / to /en by IP, with crawlers exempted. Two problems with
 * that, and they compound: Google asks you not to redirect by location because
 * it can stop it seeing every version of a site, and exempting Googlebot by
 * user-agent means the crawler is deliberately treated differently from a
 * visitor in the same country — which is the definition of cloaking, however
 * good the intent. The Danish front page is the most important page on the
 * site; it is not worth the bet. An English speaker is now offered the
 * English site by a banner instead (components/LanguageHint.tsx), which is
 * client-side, cacheable, and cannot cost the Danish index anything.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  return NextResponse.rewrite(new URL(`/da${pathname}`, request.url));
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals, the API routes (which have no language
     * and would be rewritten to /da/api/..., where nothing lives), the metadata
     * and image routes outside app/[lang] (icon, opengraph-image, logo,
     * sitemap, robots) and any path that looks like a file.
     *
     * `logo` is in that list for the same reason `icon` is: it is an image
     * route at the root, it has no language, and without the exemption it is
     * rewritten to /da/logo — where nothing lives, so the Organization schema
     * would cite a logo URL that answers 404.
     *
     * The feed needs no entry: it is /vejledninger/feed.xml, and the trailing
     * `.*\.` already excludes every path containing a dot.
     *
     * A path with a dot that gets past this is not an error: app/[lang] rejects
     * anything that is not a language (dynamicParams = false) and answers 404.
     */
    "/((?!_next/|api/|icon|opengraph-image|logo|sitemap\\.xml|robots\\.txt|.*\\.).*)",
  ],
};
