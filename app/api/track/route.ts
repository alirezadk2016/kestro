import { NextResponse } from "next/server";
import { recordView } from "@/lib/db";

export const runtime = "nodejs";

/**
 * One page view, counted by the site itself.
 *
 * Vercel's panel already counts visits; this exists so the numbers are also in
 * our own panel, and so they survive changing host or plan. It stores a path
 * and a date and nothing else — no address, no identifier, nothing that
 * distinguishes one reader from another.
 *
 * Always answers 204, whatever happened. It is called from a beacon on every
 * page load, and a counter that can make a page report an error is worse than
 * a counter that occasionally misses one.
 */
export async function POST(request: Request) {
  try {
    const { path } = (await request.json()) as { path?: unknown };
    if (typeof path !== "string") return new NextResponse(null, { status: 204 });

    /* Only paths this site actually serves. Without the guard the table can be
       filled with any string a caller invents, and the "most read pages" list
       becomes whatever a bored visitor typed. */
    if (!/^\/[a-z0-9\-/]*$/i.test(path) || path.length > 120) {
      return new NextResponse(null, { status: 204 });
    }
    /* The panel is not part of the site's traffic. */
    if (path.startsWith("/admin")) return new NextResponse(null, { status: 204 });

    /* Obvious crawlers do not count. This is not a bot wall — it is keeping
       the number honest enough to reason about. */
    const agent = (request.headers.get("user-agent") ?? "").toLowerCase();
    if (/bot|crawl|spider|slurp|headless|preview|lighthouse/.test(agent)) {
      return new NextResponse(null, { status: 204 });
    }

    await recordView(path);
  } catch {
    /* Malformed body, database asleep — either way the visitor sees nothing. */
  }
  return new NextResponse(null, { status: 204 });
}
