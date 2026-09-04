import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionValid } from "@/lib/admin-auth";
import { getEnquiry, recordReply } from "@/lib/db";
import { company } from "@/lib/company";

export const runtime = "nodejs";

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
  const origin = new URL(request.url).origin;

  if (!sessionValid(cookies().get(SESSION_COOKIE)?.value)) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const body = String(form.get("body") ?? "").trim().slice(0, 10000);
  if (!id || !body) {
    return NextResponse.redirect(new URL(`/admin/beskeder/${id}`, origin), { status: 303 });
  }

  const enquiry = await getEnquiry(id);
  if (!enquiry) return new NextResponse("not found", { status: 404 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !from) {
    return NextResponse.redirect(new URL(`/admin/beskeder/${id}?fejl=mail`, origin), {
      status: 303,
    });
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
      /* Never the body: an error echo from the provider can carry the key. */
      console.error(`Admin reply: Resend returned ${response.status}`);
      return NextResponse.redirect(new URL(`/admin/beskeder/${id}?fejl=send`, origin), {
        status: 303,
      });
    }
  } catch {
    console.error("Admin reply: request failed");
    return NextResponse.redirect(new URL(`/admin/beskeder/${id}?fejl=send`, origin), {
      status: 303,
    });
  }

  /* Only after the send succeeded. Recording a reply that never left would be
     worse than not recording it: the message would look handled. */
  await recordReply(id, body);

  return NextResponse.redirect(new URL(`/admin/beskeder/${id}`, origin), { status: 303 });
}
