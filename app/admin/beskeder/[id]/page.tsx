import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AlertIcon, ArchiveIcon, ArrowLeftIcon, CheckIcon, SendIcon } from "@/components/admin/icons";
import { MAIL_ERROR_COOKIE } from "@/lib/admin-auth";
import { getEnquiry, setEnquiryStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

const when = (iso: string) =>
  new Date(iso).toLocaleString("da-DK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  });

/*
 * What happened to the last attempt to reply.
 *
 * The reply route has always redirected back here with ?fejl=mail or
 * ?fejl=send when the send failed, and nothing ever read it. A failed reply
 * looked exactly like a successful one — same page, same message, no reply
 * recorded — so the only way to find out that a customer never heard back was
 * for them to ask again. That is the worst possible failure for this panel to
 * have, because it fails silently in the direction of losing the customer.
 */
const OUTCOMES = {
  sendt: {
    tone: "ok",
    text: "Svaret er sendt.",
  },
  mail: {
    tone: "fejl",
    text: "Kunne ikke sende: udbyderen er ikke sat op på denne deployment (RESEND_API_KEY eller CONTACT_FROM mangler). Svaret blev ikke sendt.",
  },
  send: {
    tone: "fejl",
    text: "Svaret blev ikke sendt.",
  },
} as const;

export default async function EnquiryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { fejl?: string; sendt?: string };
}) {
  const enquiry = await getEnquiry(params.id);
  if (!enquiry) notFound();

  /* Opening it is reading it. Only from "new", so a message that has already
     been replied to is not quietly demoted by being looked at again. */
  if (enquiry.status === "new") await setEnquiryStatus(enquiry.id, "read");

  const key =
    searchParams.sendt === "1"
      ? "sendt"
      : searchParams.fejl === "mail"
        ? "mail"
        : searchParams.fejl === "send"
          ? "send"
          : null;
  const outcome = key ? OUTCOMES[key] : null;
  /* What the provider said, if it said anything. Set by the reply route and
     expiring on its own — see MAIL_ERROR_COOKIE. */
  const reason = key === "send" ? cookies().get(MAIL_ERROR_COOKIE)?.value : undefined;

  const facts = [
    { label: "E-mail", value: enquiry.email },
    { label: "Telefon", value: enquiry.phone },
    { label: "Virksomhed", value: enquiry.company },
    { label: "Sendt fra", value: enquiry.page },
    { label: "Modtaget", value: when(enquiry.created_at) },
  ].filter((fact) => fact.value);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/beskeder"
        className="inline-flex items-center gap-2 text-sm text-paper/55 transition hover:text-paper"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Alle beskeder
      </Link>

      {outcome && (
        <p
          role="status"
          className={`mt-6 flex items-start gap-2.5 border-l-2 px-4 py-3 text-sm leading-6 ${
            outcome.tone === "ok"
              ? "border-emerald-400/80 bg-emerald-400/[0.08] text-emerald-100/90"
              : "border-red-400/80 bg-red-400/[0.08] text-red-100/90"
          }`}
        >
          {outcome.tone === "ok" ? (
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
          ) : (
            <AlertIcon className="mt-0.5 h-4 w-4 flex-none text-red-300" />
          )}
          <span>
            {outcome.text}
            {reason && <span className="mt-1 block text-red-50/80">{reason}</span>}
          </span>
        </p>
      )}

      <header className="mt-7">
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-tight">
          {enquiry.name}
        </h1>
        {enquiry.subject && <p className="mt-1.5 text-paper/60">{enquiry.subject}</p>}
      </header>

      <dl className="mt-7 grid grid-cols-1 gap-px border border-white/[0.09] bg-white/[0.09] sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-brand-950 px-4 py-3">
            <dt className="text-[11px] uppercase tracking-[0.16em] text-paper/45">{fact.label}</dt>
            <dd className="mt-1 truncate text-sm text-paper/85">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {enquiry.mail_error && (
        <p className="mt-7 flex items-start gap-2.5 border-l-2 border-amber-400/70 bg-amber-400/[0.07] px-4 py-3 text-sm leading-6 text-amber-100/90">
          <AlertIcon className="mt-0.5 h-4 w-4 flex-none text-amber-300" />
          <span>
            Beskeden er gemt her, men kopien til {process.env.CONTACT_TO ?? "kontakt@kestro.dk"}{" "}
            blev ikke sendt. Mailudbyderen svarede:{" "}
            <span className="text-amber-50">{enquiry.mail_error}</span>
          </span>
        </p>
      )}

      {/* whitespace-pre-wrap, because the visitor's line breaks are part of
          what they wrote and collapsing them rewrites their message. */}
      <div className="mt-7 whitespace-pre-wrap border-l-2 border-brand-400 bg-white/[0.04] p-6 text-[15px] leading-7 text-paper/90">
        {enquiry.message}
      </div>

      {enquiry.status === "replied" && enquiry.reply_body ? (
        <section className="mt-9">
          <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-emerald-300/80">
            <CheckIcon className="h-4 w-4" />
            Besvaret {enquiry.replied_at ? when(enquiry.replied_at) : ""}
          </h2>
          <div className="mt-3 whitespace-pre-wrap border border-white/[0.09] p-6 text-sm leading-7 text-paper/70">
            {enquiry.reply_body}
          </div>
          <p className="mt-3 text-sm text-paper/45">Skriv nedenfor igen, hvis der skal følges op.</p>
        </section>
      ) : null}

      <form action="/api/admin/reply" method="post" className="mt-10">
        <input type="hidden" name="id" value={enquiry.id} />
        <label htmlFor="body" className="mb-2 block text-sm font-medium text-paper/80">
          Svar til {enquiry.name}
        </label>
        <textarea
          id="body"
          name="body"
          rows={9}
          required
          placeholder={`Hej ${enquiry.name.split(" ")[0]},\n\n`}
          className="w-full border border-white/15 bg-white/[0.05] px-4 py-3.5 text-sm leading-7 text-paper transition placeholder:text-paper/25 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
        />
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <button className="inline-flex items-center gap-2 bg-brand-600 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300">
            <SendIcon className="h-4 w-4" />
            Send svar
          </button>
          {/* The reply goes from the site and lands in their inbox as coming
              from us, with our address as reply-to — so their answer to our
              answer arrives in the normal mailbox, not only here. */}
          <span className="text-xs leading-5 text-paper/45">
            Sendes til {enquiry.email} · svar lander i kontakt@kestro.dk
          </span>
        </div>
      </form>

      {enquiry.status !== "archived" && (
        <form
          action="/api/admin/archive"
          method="post"
          className="mt-12 border-t border-white/[0.09] pt-5"
        >
          <input type="hidden" name="id" value={enquiry.id} />
          <button className="inline-flex items-center gap-2 text-sm text-paper/45 transition hover:text-paper">
            <ArchiveIcon className="h-4 w-4" />
            Arkivér denne besked
          </button>
          <p className="mt-1.5 text-xs text-paper/35">
            Den forsvinder fra listen, men kan altid findes igen under Arkiverede.
          </p>
        </form>
      )}
    </div>
  );
}
