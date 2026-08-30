import { NextResponse, type NextRequest } from "next/server";

/**
 * Danish is the primary market, so it keeps the bare URLs: /produkter, not
 * /da/produkter. Every route actually lives under app/[lang], so anything
 * without a language prefix is rewritten to /da internally — the address bar
 * does not change, and the URLs that are already indexed keep working.
 *
 * /en/... is left alone and resolves to app/[lang] with lang="en".
 *
 * On top of that, a visitor arriving at the front door from outside
 * Scandinavia is sent to the English site once. The rules that keep that from
 * costing us the Danish index are in the notes on chooseLanguage below — they
 * are load-bearing, not caution.
 */

const COOKIE = "kestro-lang";
const YEAR = 60 * 60 * 24 * 365;

/*
 * Scandinavia proper. Danish, Norwegian and Swedish readers can all use the
 * Danish site; Finnish and Icelandic readers cannot, so they get English along
 * with everyone else. Add a country here only if Danish actually serves it.
 */
const SCANDINAVIA = new Set(["DK", "NO", "SE"]);

/*
 * Crawlers are never redirected.
 *
 * Googlebot crawls from the United States. Sending it to /en at the front door
 * would mean the Danish homepage — the most important page on a site whose
 * market is Denmark — is reached by a redirect on every crawl, and Google's own
 * guidance on multi-regional sites is that automatic locale redirects can stop
 * it seeing all versions of a site. The bare Danish URLs stay directly
 * reachable for anything that identifies as a crawler.
 */
const CRAWLER = /bot|crawl|spider|slurp|bingpreview|duckduckgo|baidu|yandex|facebookexternalhit|embedly|quora|pinterest|slackbot|vkshare|w3c_validator|whatsapp|telegram|discord|lighthouse|headlesschrome/i;

/** Two-letter country for the request, from whichever host is in front of us. */
function country(request: NextRequest): string | undefined {
  const headers = request.headers;
  const value =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-geo-country") ??
    headers.get("x-country-code") ??
    /* Present on some platforms' NextRequest; typed loosely because it is not
       part of the stable signature. */
    (request as NextRequest & { geo?: { country?: string } }).geo?.country;

  return value ? value.toUpperCase() : undefined;
}

/**
 * Which language this request should get, or undefined to leave it alone.
 *
 * Only ever answers for the bare root. A deep link is never redirected: an
 * indexed URL that bounces is an indexed URL Google has to re-resolve, and a
 * Danish page shared to a colleague abroad should open as the page that was
 * shared, not as an English homepage.
 */
function chooseLanguage(request: NextRequest): "en" | undefined {
  if (request.nextUrl.pathname !== "/") return undefined;

  const agent = request.headers.get("user-agent") ?? "";
  if (CRAWLER.test(agent)) return undefined;

  /* An explicit choice wins over geography, always. */
  const chosen = request.cookies.get(COOKIE)?.value;
  if (chosen === "da") return undefined;
  if (chosen === "en") return "en";

  const code = country(request);
  /* Unknown country stays on Danish: the site's own market is the safer
     default when the host tells us nothing. */
  if (!code) return undefined;

  return SCANDINAVIA.has(code) ? undefined : "en";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const target = chooseLanguage(request);
  if (target === "en") {
    const url = request.nextUrl.clone();
    url.pathname = "/en";
    /* 307, not 308: the right answer depends on who is asking, so it must not
       be cached as a permanent property of the URL. */
    const redirect = NextResponse.redirect(url, 307);
    redirect.headers.set("Vary", "Cookie, User-Agent");
    return redirect;
  }

  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const response = isEnglish
    ? NextResponse.next()
    : NextResponse.rewrite(new URL(`/da${pathname}`, request.url));

  /*
   * Remember the language actually being read, so the front door stops
   * guessing after the first visit and the language switcher sticks: clicking
   * through to a Danish page is itself the choice, and so is clicking through
   * to an English one.
   */
  const reading = isEnglish ? "en" : "da";
  if (request.cookies.get(COOKIE)?.value !== reading) {
    response.cookies.set(COOKIE, reading, {
      path: "/",
      maxAge: YEAR,
      sameSite: "lax",
      httpOnly: false,
    });
  }

  /*
   * The front door answers two ways, so it must not be stored as one.
   *
   * Next marks the generated page s-maxage=31536000, which invites a shared
   * cache to keep one visitor's Danish homepage for a year and hand it to
   * every visitor after them — the redirect above would simply never run.
   * Vary would be the polite fix, but Next writes its own onto the rewritten
   * response and drops this one, so the cache-control is what actually holds.
   * Only "/" pays for it; every other page keeps its year at the edge.
   */
  if (pathname === "/") {
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
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
