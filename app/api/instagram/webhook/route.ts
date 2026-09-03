import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { company } from "@/lib/company";
import { classify, pickReply, replyLang } from "@/lib/instagram";

/**
 * Instagram comments, answered where it is safe to and forwarded where it is not.
 *
 * Meta calls this address when someone comments on the account's posts. What
 * happens next is decided in lib/instagram.ts: praise gets a thank-you,
 * everything else gets a person. This file is the transport and the safety
 * around it.
 *
 * Three things it has to get right, and each of them is a way this goes wrong
 * in public:
 *
 *  1. The reply is itself a comment. Post one without a guard and the account
 *     is notified of its own comment, answers that, is notified again, and
 *     runs until Meta rate-limits it — under a customer's post. Two guards
 *     below, and the structural one is that a reply carries `parent_id`, so
 *     anything that is already a reply is skipped and the bot can never reach
 *     its own output.
 *  2. Anyone who learns this URL can POST to it. Every payload is checked
 *     against an HMAC of the app secret before a single character of it is
 *     read as data.
 *  3. Meta re-delivers anything it did not get a prompt 200 for. So the answer
 *     is always 200 and always immediate, and the work happens before it is
 *     sent rather than being left dangling — a serverless function can be
 *     frozen the moment it responds.
 *
 * Runs on Node rather than the edge: the signature check needs node:crypto's
 * timing-safe comparison.
 */
export const runtime = "nodejs";

/* The Graph host and version differ between the two ways an account can be
   connected — Instagram Login talks to graph.instagram.com, a Facebook-Page
   linked account to graph.facebook.com. Configurable so a change of setup is a
   variable rather than a deploy. */
const GRAPH = process.env.IG_GRAPH_BASE ?? "https://graph.instagram.com/v21.0";

/** Comment text we will act on at all. Longer than any real comment worth
    answering, short enough that the classifier cannot be fed an essay. */
const MAX_TEXT = 2000;
const MAX_BODY_BYTES = 128 * 1024;

/*
 * Comment ids already handled.
 *
 * Per-instance, so it catches the common case — Meta's immediate retry landing
 * on the same warm function — and not the uncommon one. It is deliberately not
 * the only thing standing between a retry and a double reply: pickReply is
 * keyed on the comment id, so a duplicate that gets past this composes the
 * same sentence rather than a different one.
 */
const handled = new Map<string, number>();
const HANDLED_TTL = 60 * 60 * 1000;

function seenBefore(id: string): boolean {
  const now = Date.now();
  /* Array.from rather than iterating the Map directly: the project targets an
     ES version whose down-level iteration would need a compiler flag, and a
     flag is a worse trade than a copy of a map that holds an hour of ids. */
  for (const [key, at] of Array.from(handled.entries())) {
    if (now - at > HANDLED_TTL) handled.delete(key);
  }
  if (handled.has(id)) return true;
  handled.set(id, now);
  return false;
}

/** Constant-time string compare that does not leak length through throwing. */
function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * The subscription handshake.
 *
 * Meta calls this once with a challenge when the webhook is first pointed
 * here, and expects the challenge echoed back as plain text. The token is
 * compared in constant time and the challenge is never echoed unless it
 * matches — otherwise this endpoint would confirm a subscription for anybody
 * who guessed the URL.
 */
export function GET(request: Request) {
  const expected = process.env.IG_VERIFY_TOKEN;
  if (!expected) return new NextResponse("not configured", { status: 503 });

  const params = new URL(request.url).searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode !== "subscribe" || !token || !challenge || !sameSecret(token, expected)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  /* Plain text, and the challenge exactly as it arrived — Meta compares the
     body byte for byte and a JSON wrapper fails the subscription. */
  return new NextResponse(challenge, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

/** The payload shape, as much of it as this route reads. */
type CommentChange = {
  field?: string;
  value?: {
    id?: string;
    text?: string;
    parent_id?: string;
    from?: { id?: string; username?: string };
    media?: { id?: string };
  };
};

export async function POST(request: Request) {
  const appSecret = process.env.IG_APP_SECRET;
  const accessToken = process.env.IG_ACCESS_TOKEN;
  if (!appSecret || !accessToken) {
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return new NextResponse("too large", { status: 413 });

  /* Read as text, not JSON: the signature is over the exact bytes, and
     re-serialising a parsed object would not reproduce them. */
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new NextResponse("too large", { status: 413 });

  const signature = request.headers.get("x-hub-signature-256") ?? "";
  const expected = `sha256=${crypto.createHmac("sha256", appSecret).update(raw).digest("hex")}`;
  if (!sameSecret(signature, expected)) {
    return new NextResponse("bad signature", { status: 403 });
  }

  let payload: { entry?: { changes?: CommentChange[] }[] };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return new NextResponse("bad request", { status: 400 });
    }
    payload = parsed as typeof payload;
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }

  const changes = (payload.entry ?? []).flatMap((entry) => entry.changes ?? []);

  for (const change of changes) {
    if (change.field !== "comments") continue;
    const comment = change.value;
    const id = comment?.id;
    const text = (comment?.text ?? "").slice(0, MAX_TEXT);
    if (!id || !text.trim()) continue;

    /* Loop guard one, and the one that actually holds: a comment with a parent
       is a reply, and our own replies are the replies we would otherwise be
       answering. Nothing we post can ever come back through here. */
    if (comment?.parent_id) continue;

    /* Loop guard two, for the case where the account comments at top level
       itself — a human posting from the brand account should not be thanked
       by the brand account. */
    if (comment?.from?.id && comment.from.id === process.env.IG_ACCOUNT_ID) continue;

    if (seenBefore(id)) continue;

    const verdict = classify(text);

    if (verdict === "praise") {
      await reply(id, pickReply(id, replyLang(text)), accessToken);
      continue;
    }

    /* Everything else is a person's job. A question is a lead and an unhappy
       comment is urgent; both are worth an email and neither is worth a
       guess. */
    await forward({
      verdict,
      text,
      username: comment?.from?.username ?? "ukendt",
      commentId: id,
      mediaId: comment?.media?.id ?? "",
    });
  }

  /* Always 200. A non-200 makes Meta re-deliver the same batch, and a batch
     re-delivered is a reply re-sent. Anything that went wrong above is logged
     where it happened. */
  return NextResponse.json({ ok: true });
}

/** Post the reply under the comment. */
async function reply(commentId: string, message: string, accessToken: string) {
  try {
    const response = await fetch(`${GRAPH}/${encodeURIComponent(commentId)}/replies`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message, access_token: accessToken }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      /* Not the body: an error echo from Graph can carry the token back. */
      console.error(`Instagram reply: Graph returned ${response.status}`);
    }
  } catch {
    console.error("Instagram reply: request failed");
  }
}

/**
 * The comments a person has to see, by mail.
 *
 * Same sender as the contact form, so there is one place where mail is
 * configured. A failure here is logged and swallowed: the webhook must still
 * answer 200, or Meta re-delivers and the praise in the same batch is answered
 * twice.
 */
async function forward(item: {
  verdict: string;
  text: string;
  username: string;
  commentId: string;
  mediaId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !from) return;

  const label =
    item.verdict === "negative"
      ? "Utilfreds kommentar"
      : item.verdict === "question"
        ? "Spørgsmål"
        : "Kommentar";

  const lines = [
    `Fra: @${item.username}`,
    `Type: ${item.verdict}`,
    item.mediaId ? `Opslag: ${item.mediaId}` : null,
    "",
    item.text,
    "",
    "Der er ikke svaret automatisk på denne. Svar i appen.",
  ].filter((line): line is string => line !== null);

  try {
    await fetch(process.env.RESEND_ENDPOINT ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [process.env.CONTACT_TO ?? company.email],
        subject: `${label} på Instagram — @${item.username}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    console.error("Instagram forward: mail failed");
  }
}
