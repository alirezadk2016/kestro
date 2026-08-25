import { NextResponse } from "next/server";
import { company } from "@/lib/company";

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

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !from) {
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (tooManyFrom(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
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
