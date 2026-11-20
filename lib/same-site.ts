import { SITE_ORIGIN } from "@/lib/site";

/*
 * Is this our own form, or somebody else's page using a visitor's browser?
 *
 * Request.json() parses whatever it is given regardless of Content-Type, so a
 * third-party page could post a form with enctype="text/plain" whose body
 * happens to be valid JSON and have a visitor send a real enquiry without
 * knowing it. That is not an open relay — the recipient is pinned below and
 * cannot be chosen by the caller — but it is forged mail into the inbox the
 * business actually reads, attributed to real people's addresses.
 *
 * Three checks, in the order of how much they can be trusted:
 *
 *   1. Sec-Fetch-Site. Set by the browser itself and not settable from script,
 *      so where it exists it is the answer. Every browser released since 2020
 *      sends it on fetch(). "none" is a direct navigation, which cannot be a
 *      POST from our form.
 *   2. Content-Type. A cross-site form can only send form-encoded or plain
 *      text without tripping a CORS preflight, and our form sends JSON, so
 *      requiring JSON closes the enctype trick on anything older.
 *   3. Origin against the origin we are configured to be. Not against the
 *      Host header: a caller who sets Origin can set Host to match it, and the
 *      check passes itself. Measured — that combination returned 200 before
 *      this was pinned to SITE_ORIGIN. In development the host is localhost,
 *      so the loopback origins are accepted there and nowhere else.
 *
 * A same-origin submit from the site passes all three unchanged.
 */
export function isSameSite(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";

  const origin = request.headers.get("origin");
  if (!origin) {
    /* No Origin and no Sec-Fetch-Site: not a browser form post at all. */
    return true;
  }

  if (origin === SITE_ORIGIN) return true;

  if (process.env.NODE_ENV !== "production") {
    try {
      const { hostname } = new URL(origin);
      return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * The same question, asked of the panel's form posts.
 *
 * /admin's forms are plain HTML posts, not fetch, so the content-type half of
 * the contact form's argument does not apply — a cross-site form can send
 * exactly the encoding ours sends. What does apply is the first check:
 * Sec-Fetch-Site is set by the browser and cannot be written from script, so a
 * post from somebody else's page arrives marked cross-site and is refused here.
 *
 * The session cookie is already SameSite=Lax, which means a browser will not
 * attach it to a cross-site POST at all, so this closes nothing that was open
 * in any browser released this decade. It is here because Lax is one line in
 * one route handler and this is another, in a different file, for the same
 * property — and because "archive every message" and "send mail from Kestro to
 * an address of my choosing" are the two things in this codebase actually worth
 * forging a request for.
 */
export function crossSitePost(request: Request): boolean {
  return !isSameSite(request);
}
