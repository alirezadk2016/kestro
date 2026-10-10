import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME, sessionValidEdge } from "@/lib/admin-session";

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

/*
 * The panel's outermost gate.
 *
 * Three layers now stand between an unauthenticated request and an enquiry,
 * and this is the first of them:
 *
 *   1. here, before the router has chosen anything at all;
 *   2. requireAdmin() at the top of every page and a session check at the top
 *      of every /api/admin handler (lib/admin-auth.ts);
 *   3. the read itself, in lib/db.ts, which refuses to run without a session.
 *
 * Three, because the bug that started this was the assumption that one place
 * was enough: the login wall lived in app/admin/layout.tsx, and a layout is not
 * a boundary — `RSC: 1` with a `Next-Router-State-Tree` asks Next for one
 * segment and it renders the page with every layout above it skipped. Layer 2
 * closed that. Layer 1 exists because middleware is the only code that runs
 * before the router makes that choice, so it cannot be routed around by asking
 * the router for something different. Layer 3 exists because layers 1 and 2 are
 * both things a future page has to remember to be under; the query is not.
 *
 * What is deliberately open:
 *
 *   /admin              the login screen itself, which has to render to be
 *                       typed into. Its page still calls requireAdmin() — the
 *                       layout shows the wall, the page shows nothing.
 *   /api/admin/login    where the password is exchanged for a session. Rate
 *                       limited per address in lib/db.ts.
 *   /api/admin/logout   giving up a session needs no session.
 *
 * And the one case this layer steps aside: no secret configured. In the edge
 * runtime process.env can be inlined at build time, so a missing value here
 * does not mean a missing value in the running app — it can just mean the build
 * did not see it. Rather than lock the owner out of their own panel over an
 * ambiguity, this layer passes and layers 2 and 3 answer. Both of them fail
 * closed with no password set (adminConfigured is false, so sessionValid always
 * returns false), which is why passing is safe: the request is not being let
 * in, it is being let through to something stricter.
 */
/**
 * The panel's paths, recognised through whatever encoding they arrive in.
 *
 * Returns the path in the form the gate reasons about, or null if this is not a
 * panel path at all.
 *
 * The decoding is not decoration. `/admin%2Fbeskeder` matched the matcher — Next
 * decodes the path before testing it — and then arrived here as
 * request.nextUrl.pathname, which does not decode, so a plain
 * startsWith("/admin/") said no, the request fell through to the language
 * rewrite, and Next answered 500 with "Attempted to handle request too many
 * times". Measured: that one URL, from anyone, with no cookie. It never reached
 * the panel, so it was not a way in — but a single request that costs the
 * server a render loop is a way to make the site stop answering, which is the
 * other half of the same question.
 *
 * Decoded repeatedly because %252F decodes to %2F decodes to /. Three rounds is
 * well past anything a router will collapse, and the loop stops as soon as a
 * round changes nothing. A round that throws on malformed input keeps the last
 * good form rather than giving up: half-decoded is still enough to recognise.
 */
function adminPath(pathname: string): string | null {
  let form = pathname;
  for (let round = 0; round < 4; round += 1) {
    if (form === "/admin" || form.startsWith("/admin/") || form.startsWith("/api/admin/")) {
      return form;
    }
    let next: string;
    try {
      next = decodeURIComponent(form);
    } catch {
      return null;
    }
    if (next === form) return null;
    form = next;
  }
  return form;
}

const ADMIN_PUBLIC = new Set(["/admin", "/api/admin/login", "/api/admin/logout"]);

async function adminGate(request: NextRequest, pathname: string) {
  if (ADMIN_PUBLIC.has(pathname)) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) return NextResponse.next();

  if (await sessionValidEdge(request.cookies.get(SESSION_COOKIE_NAME)?.value, secret)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return new NextResponse("forbidden", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  /* 404 rather than a redirect to the login screen, and the same answer
     requireAdmin() gives one layer down: a page somebody may not see should not
     confirm to them that it is there. */
  return new NextResponse("404", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Before anything else, and before any rewrite: the panel is not part of the
     site and never wants the language prefix. */
  const admin = adminPath(pathname);
  if (admin) return adminGate(request, admin);

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
     * `admin` used to be in that list, because the panel is not part of the
     * public site and has no language: it lives at /admin, not /da/admin, and
     * the rewrite would send it to a route that does not exist. It is out of
     * the list now and the rewrite is declined in code instead (adminPath
     * above), for two reasons.
     *
     * The gate needs to run there. That is the first one and the obvious one.
     *
     * The second was measured. A matcher is tested against the path as it
     * arrives, not as it resolves, so `/admin/:path*` — which is what was
     * written here first — does not match `/admin%2Fbeskeder`: no literal
     * slash. Next's own router then handled that URL, decoded it, matched
     * app/admin/beskeder, re-dispatched, and did it again until it gave up with
     * "Attempted to handle request too many times" and answered 500. Anyone
     * could send it, it cost them one request, and it cost the server a render
     * loop each time. Confirmed present before any of this work — a plain
     * `git checkout middleware.ts`, rebuild, same 500 — so it is not something
     * the gate introduced, and `/admin%2Fx`, which resolves to no route at all,
     * answers 404 like everything else.
     *
     * A pattern that excludes nothing gets the encoded form too, and then
     * adminPath decodes it and answers it here rather than leaving it to a
     * router that cannot.
     */
    "/((?!_next/|api/|icon|opengraph-image|logo|sitemap\\.xml|robots\\.txt).*)",
    /*
     * The endpoints as well: the pattern above still excludes `api/`, the pages
     * and the handlers behind them are separate trees, and an unauthenticated
     * POST goes to the second one without ever touching the first.
     */
    "/api/admin/:path*",
  ],
};
