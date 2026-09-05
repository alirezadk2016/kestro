import {
  SESSION_COOKIE,
  FAILED_COOKIE,
  FAILED_MAX_AGE,
  issueSession,
  passwordMatches,
} from "@/lib/admin-auth";
import { seeOther } from "@/lib/redirect";

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
  const secure = url.protocol === "https:";

  if (!passwordMatches(password)) {
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
