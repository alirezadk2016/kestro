import { NextResponse } from "next/server";
import { company } from "@/lib/company";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * The contact form's actual destination.
 *
 * The form used to hand the visitor a mailto: link, which asks them to have a
 * mail client configured and then to press send a second time in it. On a work
 * machine with webmail and no default client, the enquiry simply never
 * happens — and it is the enquiry the whole site exists to collect.
 *
 * This posts the message to Resend over their REST API. No SDK: it is one
 * fetch, and a dependency that sends mail is a dependency worth not having.
 *
 * Set CONTACT_WEBHOOK_URL and every enquiry is also posted as JSON to whatever
 * is on the other end — HubSpot, Pipedrive, Make, Zapier, a Google Sheet. That
 * is the CRM step, and it needs no code here because every one of those
 * accepts an inbound JSON hook. It runs alongside the mail and is never
 * allowed to fail the visitor's request: the inbox is the source of truth.
 *
 * Until RESEND_API_KEY and CONTACT_FROM are set the route answers 503, and the
 * form tells the visitor plainly and hands them the finished message to copy
 * or mail. It does not redirect the browser and it does not pretend the
 * message arrived.
 */

const RESEND_ENDPOINT = process.env.RESEND_ENDPOINT ?? "https://api.resend.com/emails";

/** Long enough for anything real, short enough to bound what we forward. */
const LIMITS = { name: 120, company: 160, email: 200, phone: 60, message: 5000 };

/* Comfortably above the sum of LIMITS, far below anything worth abusing. */
const MAX_BODY_BYTES = 64 * 1024;

/*
 * Rate limiting, such as it is.
 *
 * This is a per-instance map, and serverless gives no guarantee that two
 * requests reach the same instance, so it stops a naive flood rather than a
 * determined one. The honeypot below does more work. If the form ever starts
 * attracting real abuse, this is the line to replace with a shared store.
 */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const seen = new Map<string, number[]>();

/*
 * Whose address to count against.
 *
 * Not the left-most x-forwarded-for. That is the value the *client* sent, and
 * anything upstream only appends to it — so a caller who rotates the header
 * gets a fresh bucket on every request and the limit stops existing. Measured:
 * five requests from one spoofed address hit 429, and eight requests with the
 * header rotated all returned 200.
 *
 * Vercel sets x-vercel-forwarded-for itself and overwrites whatever arrived,
 * so it is the trustworthy one here. Failing that, the right hop is the
 * right-most entry — the one our own proxy appended — never the left-most.
 */
function clientKey(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel;

  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;

  const chain = request.headers.get("x-forwarded-for");
  if (chain) {
    const hops = chain
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  return "unknown";
}

function tooManyFrom(ip: string): boolean {
  const now = Date.now();
  const recent = (seen.get(ip) ?? []).filter((at) => now - at < RATE_LIMIT.windowMs);
  recent.push(now);
  seen.set(ip, recent);

  /* Keep the map from growing without bound on a long-lived instance. */
  if (seen.size > 500) {
    seen.forEach((times, key) => {
      if (times.every((at) => now - at >= RATE_LIMIT.windowMs)) seen.delete(key);
    });
  }

  return recent.length > RATE_LIMIT.max;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Deliberately loose. Rejecting valid addresses costs more than a bounce. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Header injection: a newline in the reply-to would let a sender add headers. */
function safeHeaderValue(value: string): string {
  return value.replace(/[\r\n]/g, " ");
}

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
function isSameSite(request: Request): boolean {
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

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !from) {
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  if (!isSameSite(request)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  /* Our own form always sends JSON. Anything else is a cross-site form post
     dressed up as one — see isSameSite above. */
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 415 });
  }

  if (tooManyFrom(clientKey(request))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  /*
   * Read the body with a ceiling on it.
   *
   * Nothing bounded the request before: an 8 MB body was read, parsed and
   * answered 200, and the fields were only truncated afterwards — so the
   * memory had already been spent. Every field this route keeps is capped in
   * LIMITS below and the largest is 5000 characters, so 64 KB is far more than
   * an honest submission needs and far less than a cheap way to make the
   * function work.
   */
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  /*
   * `null`, `[]` and `"string"` are all valid JSON, so parsing succeeding says
   * nothing about the shape. Reading .website off a parsed `null` threw, and
   * the request came back 500 — a 500 anyone could produce with four
   * characters, and one Google reads as the host being unwell.
   */
  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  /* A field no person sees and no person fills in. Bots fill in everything. */
  if (clean(payload.website, 200)) {
    return NextResponse.json({ ok: true, configured: true });
  }

  const name = clean(payload.name, LIMITS.name);
  const organisation = clean(payload.company, LIMITS.company);
  const email = clean(payload.email, LIMITS.email);
  const phone = clean(payload.phone, LIMITS.phone);
  const message = clean(payload.message, LIMITS.message);
  const subject = clean(payload.subject, 160) || "Henvendelse via kestro.dk";
  const page = clean(payload.page, 200);

  if (!name || !message || !looksLikeEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const lines = [
    `Navn: ${name}`,
    organisation ? `Virksomhed: ${organisation}` : null,
    `Email: ${email}`,
    phone ? `Telefon: ${phone}` : null,
    page ? `Side: ${page}` : null,
    "",
    message,
  ].filter((line): line is string => line !== null);

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [process.env.CONTACT_TO ?? company.email],
      /* So hitting reply in the inbox answers the customer, not ourselves. */
      reply_to: safeHeaderValue(`${name} <${email}>`),
      subject: safeHeaderValue(
        organisation ? `${subject} — ${organisation}` : `${subject} — ${name}`,
      ),
      text: lines.join("\n"),
    }),
  });

  if (!response.ok) {
    /* The body can carry the key back in an error echo, so it is not logged. */
    console.error(`Contact form: Resend returned ${response.status}`);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  await forwardToCrm({ name, organisation, email, phone, message, subject, page });

  return NextResponse.json({ ok: true, configured: true });
}

/**
 * The enquiry, also as JSON, for whatever holds the pipeline.
 *
 * Awaited rather than left dangling: a serverless function can be frozen the
 * moment it responds, and a fetch still in flight then never completes. A
 * failure here is logged and swallowed — the mail has already gone, and a CRM
 * being down is not a reason to tell a customer their message did not send.
 */
async function forwardToCrm(enquiry: Record<string, string>) {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return;

  try {
    const hook = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        ...enquiry,
        source: "kestro.dk",
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!hook.ok) console.error(`Contact form: webhook returned ${hook.status}`);
  } catch (error) {
    console.error("Contact form: webhook failed", error instanceof Error ? error.message : error);
  }
}
