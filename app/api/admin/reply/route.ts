import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  MAIL_ERROR_COOKIE,
  MAIL_ERROR_MAX_AGE,
  sessionValid,
} from "@/lib/admin-auth";
import { getEnquiry, recordReply, scrubSecrets } from "@/lib/db";
import { company } from "@/lib/company";
import { seeOther } from "@/lib/redirect";

export const runtime = "nodejs";

function withReason(response: NextResponse, reason: string): NextResponse {
  response.cookies.set(MAIL_ERROR_COOKIE, scrubSecrets(reason).slice(0, 300), {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: MAIL_ERROR_MAX_AGE,
  });
  return response;
}

/**
 * Answer an enquiry without leaving the panel.
 *
 * This is the whole reason the panel exists. Reading a message in an inbox is
 * easy; the friction is that answering it means opening a mail client, finding
 * the thread and writing there — so the reply is written here and sent from
 * here, and the archive records that it was sent.
 *
 * The mail goes out from the same verified sender the contact form uses, with
 * the company address as reply-to. So the customer sees a reply from Kestro,
 * and when they answer it, their answer arrives in the normal mailbox rather
 * than somewhere only this panel can see. The panel is for getting a reply
 * out, not for owning the conversation.
 */
export async function POST(request: Request) {
  if (!sessionValid(cookies().get(SESSION_COOKIE)?.value)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const body = String(form.get("body") ?? "").trim().slice(0, 10000);
  if (!id || !body) {
    return seeOther(`/admin/beskeder/${id}`);
  }

  const enquiry = await getEnquiry(id);
  if (!enquiry) return new NextResponse("not found", { status: 404 });

  const apiKey = process.env.RESEND_API_KEY;
  /* Same fallback as the contact form: the test sender is public and identical
     for everybody, so it is not worth a variable that has to be set before any
     mail can go at all. */
  const from = process.env.CONTACT_FROM || "Kestro <onboarding@resend.dev>";
  if (!apiKey) {
    return seeOther(`/admin/beskeder/${id}?fejl=mail`);
  }

  /* The original underneath the reply, quoted. Without it the customer is
     reading an answer to a message they sent days ago and no longer has in
     front of them. */
  const quoted = enquiry.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");

  const text = `${body}\n\n---\nDu skrev til os ${new Date(enquiry.created_at).toLocaleDateString(
    "da-DK",
    { dateStyle: "long", timeZone: "Europe/Copenhagen" },
  )}:\n\n${quoted}`;

  try {
    const response = await fetch(process.env.RESEND_ENDPOINT ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [enquiry.email],
        reply_to: process.env.CONTACT_TO ?? company.email,
        subject: `Sv: ${enquiry.subject || "Din henvendelse til Kestro"}`,
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      /*
       * The provider's own words, carried back.
       *
       * "Could not send" gives whoever is sitting here nothing to do next.
       * "The domain is not verified" or "you can only send to your own
       * address" names the exact thing to change. Scrubbed of anything
       * key-shaped, capped, and put in a cookie that expires in half a minute
       * — the page under this layout cannot read a query string reason of any
       * useful length without it sticking to the URL afterwards.
       */
      const detail = await response.text().catch(() => "");
      let reason = `HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(detail) as { message?: unknown };
        if (typeof parsed.message === "string") reason = parsed.message;
      } catch {
        if (detail) reason = detail.slice(0, 300);
      }
      console.error(`Admin reply: Resend returned ${response.status}`);
      return withReason(seeOther(`/admin/beskeder/${id}?fejl=send`), reason);
    }
  } catch {
    console.error("Admin reply: request failed");
    return withReason(
      seeOther(`/admin/beskeder/${id}?fejl=send`),
      "Kunne ikke få forbindelse til mailudbyderen.",
    );
  }

  /* Only after the send succeeded. Recording a reply that never left would be
     worse than not recording it: the message would look handled. */
  await recordReply(id, body);

  /* Say so. Every branch above already redirected with a reason, and the page
     now reads all of them — including this one, because "the form cleared and
     the page looks the same" is not the difference between sent and not
     sent that anybody should have to infer. */
  return seeOther(`/admin/beskeder/${id}?sendt=1`);
}
