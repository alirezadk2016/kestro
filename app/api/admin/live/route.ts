import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE, sessionValid } from "@/lib/admin-auth";
import { liveStats } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The live figures on their own, for the panel to poll.
 *
 * The panel used to stay current by calling router.refresh() every fifteen
 * seconds, which re-ran the whole page: the inbox query, three page-view
 * queries and six visit queries, ten round trips to answer a question about
 * one of them. On a database that suspends when idle, a single admin tab left
 * open was enough to keep it awake all day and burn the plan's compute hours
 * on numbers nobody was reading.
 *
 * This is the one query that actually changes minute to minute, so it is the
 * only one that gets polled, and the section updates itself instead of the
 * page being rebuilt around it.
 *
 * Behind the same session as the rest of the panel. It is a small amount of
 * data, but it is who is on the site right now, which is nobody else's.
 */
export async function GET() {
  if (!sessionValid(cookies().get(SESSION_COOKIE)?.value)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  return NextResponse.json(await liveStats(), {
    headers: { "cache-control": "no-store" },
  });
}
