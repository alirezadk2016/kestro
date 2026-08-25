import { NextResponse, type NextRequest } from "next/server";

/**
 * Danish is the primary market, so it keeps the bare URLs: /produkter, not
 * /da/produkter. Every route actually lives under app/[lang], so anything
 * without a language prefix is rewritten to /da internally — the address bar
 * does not change, and the URLs that are already indexed keep working.
 *
 * /en/... is left alone and resolves to app/[lang] with lang="en".
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(`/da${pathname}`, request.url));
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals, the API routes (which have no language
     * and would be rewritten to /da/api/..., where nothing lives), the metadata
     * routes outside app/[lang] (icon, opengraph-image, sitemap, robots) and
     * any path that looks like a file.
     */
    "/((?!_next/|api/|icon|opengraph-image|sitemap\\.xml|robots\\.txt|.*\\.).*)",
  ],
};
