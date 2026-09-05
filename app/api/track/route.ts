import { NextResponse } from "next/server";

import { currentSalt, recordHit, touchVisit } from "@/lib/db";
import {
  campaignSource,
  classifySource,
  clientIp,
  deviceOf,
  isBot,
  visitorId,
} from "@/lib/visits";

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
 * day's salt. Nothing is written to the browser, so this needs no consent
 * banner and the privacy policy's claim that we store nothing on your device
 * stays literally true. See lib/visits.ts.
 *
 * Always answers 204, whatever happened. It is called on every page load, and
 * a counter that can make a page report an error is worse than a counter that
 * occasionally misses one.
 */
const NO_CONTENT = () => new NextResponse(null, { status: 204 });

export async function POST(request: Request) {
  try {
    const agent = request.headers.get("user-agent") ?? "";

    /* Obvious crawlers do not count. This is not a bot wall — it is keeping
       the number honest enough to reason about. */
    if (isBot(agent)) return NO_CONTENT();

    const body = (await request.json()) as {
      path?: unknown;
      referrer?: unknown;
      search?: unknown;
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
    /* The panel is not part of the site's traffic. */
    if (path.startsWith("/admin")) return NO_CONTENT();

    const referrer = typeof body.referrer === "string" && body.referrer ? body.referrer : null;
    /* The page's own query string, sent by the client: a campaign tag lives on
       the address the visitor opened, and the request to this endpoint has
       none of its own. Capped so a long address cannot be used to make the
       body arbitrarily large. */
    const search = typeof body.search === "string" ? body.search.slice(0, 300) : "";

    await recordHit({
      visitor,
      path,
      /* The campaign's own claim wins over the referring host: a link tapped
         in an Instagram story usually arrives with no referrer at all, and
         then utm_source is the only thing that knows where it came from. */
      source: campaignSource(search) ?? classifySource(referrer, new URL(request.url).hostname),
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
