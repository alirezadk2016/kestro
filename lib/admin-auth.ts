import crypto from "node:crypto";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

/**
 * Who is allowed into the panel.
 *
 * One password in an environment variable, and a signed cookie so it is typed
 * once rather than on every request. That is the right size for a panel one or
 * two people open: a user table with hashes and resets is a system to maintain,
 * and it protects the same single account.
 *
 * What it must not be is the password itself in the cookie. A cookie is stored
 * on disk, syncs between devices, and is handed to every request — so the
 * cookie carries an expiry and a signature over it instead, and the password
 * never leaves the server after the one comparison below.
 */

const PASSWORD = process.env.ADMIN_PASSWORD ?? "";

/*
 * The signing key.
 *
 * Its own variable where one is set, because a secret that signs sessions and
 * a secret a person types are different things with different lifetimes —
 * changing the password should not have to invalidate every session, and it
 * should be possible to invalidate every session without changing the
 * password. Where only the password exists, it is derived from it, so the
 * panel works with one variable set and gets better with two.
 */
const SECRET = process.env.ADMIN_SESSION_SECRET || PASSWORD;

export const adminConfigured = PASSWORD.length > 0;

export const SESSION_COOKIE = "kestro_admin";

/**
 * A wrong password, carried back to the login screen.
 *
 * The screen is rendered by the layout, and a layout cannot read the query
 * string — it wraps every page under /admin, so ?fejl=1 would follow the
 * reader from the login screen onto whatever they opened next. A cookie with a
 * ten-second life is read once and then gone, without anything having to clear
 * it. It holds no secret: it says that somebody typed the wrong password just
 * now, which the person reading the screen already knows.
 */
export const FAILED_COOKIE = "kestro_admin_fejl";
export const FAILED_MAX_AGE = 10;

/**
 * Why a reply could not be sent, on its way back to the page.
 *
 * Same reason as above: the message page is rendered under a layout, and a
 * reason long enough to be useful would otherwise have to ride in the query
 * string and stay in the address bar afterwards. Thirty seconds is long enough
 * to survive one redirect and short enough that it can never be read as
 * current on a page opened later.
 */
export const MAIL_ERROR_COOKIE = "kestro_admin_mailfejl";
export const MAIL_ERROR_MAX_AGE = 30;

/** How long a session lasts before the password is asked for again. */
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

/** Compare without leaking, through timing, how much of the input was right. */
function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * Is this the password?
 *
 * False whenever no password is configured, so a deployment that forgot the
 * variable is locked rather than wide open. That is the failure direction that
 * matters: an admin who cannot get in files a bug, an open panel does not.
 */
export function passwordMatches(input: string): boolean {
  if (!adminConfigured) return false;
  return sameSecret(input, PASSWORD);
}

const sign = (value: string) =>
  crypto.createHmac("sha256", SECRET).update(value).digest("base64url");

/** A cookie value that proves a password was given, and when it stops proving it. */
export function issueSession(): { value: string; maxAge: number } {
  const expires = Date.now() + SESSION_MS;
  const payload = String(expires);
  return { value: `${payload}.${sign(payload)}`, maxAge: Math.floor(SESSION_MS / 1000) };
}

/**
 * Whether a cookie is one we issued and has not expired.
 *
 * The signature is checked before the expiry is read, because until the
 * signature holds the expiry is just a number the visitor chose.
 */
export function sessionValid(cookie: string | undefined): boolean {
  if (!adminConfigured || !cookie) return false;
  const cut = cookie.lastIndexOf(".");
  if (cut < 1) return false;

  const payload = cookie.slice(0, cut);
  const signature = cookie.slice(cut + 1);
  if (!sameSecret(signature, sign(payload))) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

/** Whether the request carries a session this server issued. */
export function adminAuthed(): boolean {
  return sessionValid(cookies().get(SESSION_COOKIE)?.value);
}

/**
 * The gate, on the page rather than only on the layout around it.
 *
 * app/admin/layout.tsx renders a login wall instead of its children when there
 * is no session, and for a normal browser request that is the whole story. It
 * is NOT the whole story for the App Router.
 *
 * A layout does not re-render on every request. The client router can ask for
 * one segment on its own by sending `RSC: 1` with a `Next-Router-State-Tree`
 * that says which layouts it already has — and Next then renders only the
 * page, skipping every layout above it. That is the mechanism behind
 * client-side navigation and it is available to anyone with curl:
 *
 *   curl -H 'RSC: 1' -H 'Next-Router-State-Tree: <tree naming the layout>' \
 *        https://…/admin/beskeder
 *
 * Measured against this codebase before the fix: 3203 bytes of the inbox
 * page's own payload, no login wall in it, no session cookie sent. With a
 * database attached that payload is every enquiry — names, companies, email
 * addresses, phone numbers and message bodies — handed to an unauthenticated
 * request.
 *
 * So the check goes where the data is read. Every page under /admin calls this
 * first, and it is cheap: an HMAC over a short string.
 *
 * notFound() rather than a redirect or a rendered wall: a page that a visitor
 * may not see should not confirm that it exists, and the layout already shows
 * the wall on any request that actually renders it.
 */
export function requireAdmin(): void {
  if (!adminAuthed()) notFound();
}
