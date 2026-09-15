import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/admin-auth";
import { crossSitePost } from "@/lib/same-site";
import { seeOther } from "@/lib/redirect";

export const runtime = "nodejs";

export async function POST(request: Request) {
  /* Not a breach if it succeeds — somebody else's page signing us out is a
     nuisance, not a disclosure — but it is the same one line as the rest. */
  if (crossSitePost(request)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const response = seeOther("/admin");
  /* Expire rather than delete, so a browser that ignores one honours the other. */
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
