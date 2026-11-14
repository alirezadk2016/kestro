import { NextResponse } from "next/server";

import { currentSalt, recordHit, touchVisit } from "@/lib/db";
import { crossSitePost } from "@/lib/same-site";
import { clientIp, deviceOf, isBot, resolveAttribution, visitorId } from "@/lib/visits";

export const runtime = "nodejs";

/**
 * One signal from an open page.
 *
 * Two kinds arrive here. A page load says which path is being read and where
 * the reader came from; a heartbeat says only that the tab is still open and
 * visible. The first is what the counts are built from, the second is what
 * makes "time on site" mean anything — without it every visit that reads one
 * page for ten minutes is recorded as lasting zero seconds.
 *
 * The visitor is identified by a hash computed here and thrown away with the
 * day's salt. This first-party counter writes no browser storage and runs
 * separately from the consent-gated Google tag. See lib/visits.ts and the
 * privacy policy for its data scope.
 *
 * Always answers 204, whatever happened. It is called on every page load, and
 * a counter that can make a page report an error is worse than a counter that
 * occasionally misses one.
 */
const NO_CONTENT = () => new NextResponse(null, { status: 204 });

export async function POST(request: Request) {
  /*
   * Only this site's own pages count.
   *
   * components/PageViewTracker.tsx calls this with a relative URL, so a real
   * page load arrives marked same-origin by the browser. Anything marked
   * cross-site is a script on somebody else's page writing rows into our visits
   * table — which costs us database compute on a plan that bills for it, and
   * costs the numbers their meaning. It is answered 204 like everything else
   * here: a counter that argues with a caller teaches the caller what to change.
   */
  if (crossSitePost(request)) return NO_CONTENT();

  try {
    const agent = request.headers.get("user-agent") ?? "";

    /* Obvious crawlers do not count. This is not a bot wall — it is keeping
       the number honest enough to reason about. */
    if (isBot(agent)) return NO_CONTENT();

    /* A page view is a path, a referring origin and allowed campaign labels: under a
       kilobyte. Without a cap the JSON parser would read whatever it was sent
       before any of the checks below ran, so an anonymous caller could make
       every request as expensive as the platform's own body limit. */
    if (Number(request.headers.get("content-length") ?? "0") > 4096) return NO_CONTENT();
    const raw = await request.text();
    if (raw.length > 4096) return NO_CONTENT();
    const body = JSON.parse(raw) as {
      path?: unknown;
      referrer?: unknown;
      attribution?: unknown;
      ping?: unknown;
    };

    const salt = await currentSalt();
    /* No database, no salt, nothing to identify a visit with — and nowhere to
       put it either. Nothing to do but answer. */
    if (!salt) return NO_CONTENT();

    const visitor = visitorId(clientIp(request.headers), agent, salt);

    if (body.ping === true) {
      await touchVisit(visitor);
      return NO_CONTENT();
    }

    if (typeof body.path !== "string") return NO_CONTENT();
    const path = body.path;

    /* Only paths this site could actually serve. Without the guard the table
       fills with any string a caller invents, and "most read pages" becomes
       whatever a bored visitor typed into the address bar. */
    if (!/^\/[a-z0-9\-/]*$/i.test(path) || path.length > 120) return NO_CONTENT();
    if (path.includes("//") || /^\/api(?:\/|$)/i.test(path)) return NO_CONTENT();
    /* The panel is not part of the site's traffic. */
    if (path.startsWith("/admin")) return NO_CONTENT();

    const attribution = resolveAttribution(
      body.attribution,
      body.referrer,
      new URL(request.url).hostname,
    );

    await recordHit({
      visitor,
      path,
      ...attribution,
      /* Set by Vercel's edge from the request's address. Two letters, derived
         and not stored on the way in — the address itself never reaches us. */
      country: request.headers.get("x-vercel-ip-country"),
      device: deviceOf(agent),
    });
  } catch {
    /* Malformed body, database asleep — either way the visitor sees nothing. */
  }
  return NO_CONTENT();
}
