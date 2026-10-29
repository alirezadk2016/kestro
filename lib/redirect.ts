import { NextResponse } from "next/server";

/**
 * A redirect that stays on the host the request actually came from.
 *
 * NextResponse.redirect needs an absolute URL, so every route here built one
 * out of `request.url` — and that is not always the address in the visitor's
 * address bar. Behind a proxy it can be the internal one, and a deployment
 * reached through an alias can produce a different host entirely. Sending the
 * browser to another origin loses every cookie set on this one, which is how a
 * wrong-password message set on 127.0.0.1 was never seen on localhost: the
 * cookie was set correctly, delivered to a host that then redirected somewhere
 * it did not apply.
 *
 * A relative Location has no host to get wrong. The browser resolves it
 * against the address it asked for, which is by definition the right one.
 *
 * 303 rather than 302: these all answer a form POST, and 303 is the status
 * that tells the browser to follow up with a GET. Without it a reload after
 * submitting re-sends the post — and the post in question sends an email.
 */
export function seeOther(path: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { location: path } });
}
