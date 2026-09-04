import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL("/admin", url.origin), { status: 303 });
  /* Expire rather than delete, so a browser that ignores one honours the other. */
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
