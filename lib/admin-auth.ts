import crypto from "node:crypto";

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
