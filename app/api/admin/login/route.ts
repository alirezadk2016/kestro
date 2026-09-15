import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  FAILED_COOKIE,
  FAILED_MAX_AGE,
  issueSession,
  passwordMatches,
} from "@/lib/admin-auth";
import { seeOther } from "@/lib/redirect";
import { adminLockedOut, clearAdminFailures, noteAdminFailure } from "@/lib/db";
import { clientIp } from "@/lib/visits";
import { crossSitePost } from "@/lib/same-site";

export const runtime = "nodejs";

/**
 * Exchange the password for a session.
 *
 * A plain form post rather than fetch, so the login screen works before any
 * JavaScript has run and cannot be broken by a bundle that failed to load.
 */
export async function POST(request: Request) {
  /* A password typed into somebody else's page is not a login. This costs the
     attacker nothing to be refused at, but it means the only thing that can
     start a session is our own form. */
  if (crossSitePost(request)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  /*
   * How many guesses this address has left.
   *
   * There was no limit at all: one password, no lockout, no delay, so the
   * panel could be worked through a wordlist as fast as the network allowed.
   * Of everything in this codebase that is the likeliest way somebody actually
   * gets in — it needs no bug, just patience.
   *
   * Checked BEFORE the password is compared, so a locked address learns
   * nothing from the timing of the answer, and counted per address using the
   * same trustworthy hop the contact form settled on.
   */
  const ip = clientIp(request.headers);
  if (await adminLockedOut(ip)) {
    return new NextResponse("too many attempts", {
      status: 429,
      headers: { "retry-after": "900" },
    });
  }

  const form = await request.formData();
  const password = String(form.get("password") ?? "");

  /*
   * Whether to mark the session cookie Secure.
   *
   * This read request.url's protocol, and lib/redirect.ts already documents
   * why that is not safe to reason from: behind a proxy request.url can be the
   * internal address, and internally the hop is plain HTTP. A session cookie
   * that loses its Secure flag is one a browser will send over http — and
   * HSTS only covers browsers that have already seen the header once.
   *
   * x-forwarded-proto is what the proxy actually terminated, and production is
   * HTTPS-only regardless, so either answer being yes is enough. Local http
   * development still gets an unmarked cookie, which is the only case that
   * needs one.
   */
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const secure =
    forwardedProto === "https" ||
    new URL(request.url).protocol === "https:" ||
    process.env.NODE_ENV === "production";

  if (!passwordMatches(password)) {
    await noteAdminFailure(ip);
    /* No hint about which part was wrong, and no reason to distinguish "wrong
       password" from "no password configured" to whoever is typing. The
       redirect used to carry ?fejl=1 that nothing read, so a wrong password
       returned the same blank form with no explanation at all. */
    const response = seeOther("/admin");
    response.cookies.set(FAILED_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/admin",
      maxAge: FAILED_MAX_AGE,
    });
    return response;
  }

  /* A correct password clears the slate: a person who mistyped four times and
     then got it right should not be four from a lockout tomorrow. */
  await clearAdminFailures(ip);

  const session = issueSession();
  const response = seeOther("/admin");
  response.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: session.maxAge,
  });
  /* Whatever a previous attempt left behind: getting in is the answer to the
     question the message was asking. */
  response.cookies.set(FAILED_COOKIE, "", { path: "/admin", maxAge: 0 });
  return response;
}
