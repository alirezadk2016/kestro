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
/*
 * Files that are served from public/ rather than rendered.
 *
 * The matcher used to exclude every path containing a dot, which kept these
 * safe but also let /index.html and /wp-login.php through to the router — and
 * [lang] matches any single segment, so they arrived as lang="index.html".
 * app/[lang]/layout.tsx answered that with dynamicParams = false, which fixed
 * the 500 and, because segment config applies to the whole subtree, also
 * meant no unmatched URL anywhere on the site could reach a not-found
 * boundary: every 404 fell through to Next's built-in page.
 *
 * Naming the extensions instead draws the line where it actually is. A real
 * asset is passed through; anything else with a dot in it is a path like any
 * other and gets the language prefix, so [lang] is never handed something
 * that is not a language and the 404 is the site's own.
 */
const STATIC_FILE =
  /\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico|bmp|glb|gltf|woff2?|ttf|otf|eot|mp4|webm|mov|mp3|wav|ogg|xml|txt|json|csv|pdf|zip|js|mjs|css|map|webmanifest)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (STATIC_FILE.test(pathname)) return NextResponse.next();

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
     * The feed needs no entry: it is /vejledninger/feed.xml, and .xml is in
     * the STATIC_FILE list above, which is what now decides whether a path
     * with a dot in it is a file or just a path. That list replaced a
     * `.*\.` exclusion here — see the note on STATIC_FILE for why.
     */
    /*
     * `admin` is in the list because the panel is not part of the public site
     * and has no language: it lives at /admin, not /da/admin, and without the
     * exemption the rewrite sends it to a route that does not exist. It is
     * kept out of the index by a noindex header in next.config.mjs and by
     * never being linked to — not by being hidden, which is not a control.
     */
    "/((?!_next/|api/|admin|icon|opengraph-image|logo|sitemap\\.xml|robots\\.txt).*)",
  ],
};
