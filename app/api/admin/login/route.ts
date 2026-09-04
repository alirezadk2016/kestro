import { NextResponse } from "next/server";
import { SESSION_COOKIE, issueSession, passwordMatches } from "@/lib/admin-auth";

export const runtime = "nodejs";

/**
 * Exchange the password for a session.
 *
 * A plain form post rather than fetch, so the login screen works before any
 * JavaScript has run and cannot be broken by a bundle that failed to load.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  const url = new URL(request.url);
  if (!passwordMatches(password)) {
    /* No hint about which part was wrong, and no reason to distinguish "wrong
       password" from "no password configured" to whoever is typing. */
    return NextResponse.redirect(new URL("/admin?fejl=1", url.origin), { status: 303 });
  }

  const session = issueSession();
  const response = NextResponse.redirect(new URL("/admin", url.origin), { status: 303 });
  response.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}
