import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { AlertIcon, ArchiveIcon, ArrowLeftIcon, CheckIcon } from "@/components/admin/icons";
import { INBOX_SOURCE } from "@/components/admin/InboxRow";
import MessageReplyForm from "@/components/admin/MessageReplyForm";
import MessageNoteForm from "@/components/admin/MessageNoteForm";
import MessageReadReceipt from "@/components/admin/MessageReadReceipt";
import MessageFollowUpForm from "@/components/admin/MessageFollowUpForm";
import { BUTTON, CARD } from "@/components/admin/tokens";
import { MAIL_ERROR_COOKIE, requireAdmin } from "@/lib/admin-auth";
import { enquiryIdValid } from "@/lib/admin-form";
import { company } from "@/lib/company";
import {
  countNew,
  getEnquiry,
  listEnquiryEvents,
  setEnquiryStatus,
  type EnquiryStatus,
} from "@/lib/db";
import { looksLikeEmail } from "@/lib/mail-safe";

export const dynamic = "force-dynamic";

const when = (iso: string) =>
  new Date(iso).toLocaleString("da-DK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  });
const STATUS: Record<EnquiryStatus, string> = {
  new: "Ny",
  read: "Læst",
  replied: "Besvaret",
  archived: "Arkiveret",
};
const secondaryButton = `${BUTTON} w-full`;

export default async function EnquiryPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fejl?: string;
    sendt?: string;
    lagring?: string;
    result?: string;
    note?: string;
    handling?: string;
    followup?: string;
  }>;
}) {
  // The layout is not the boundary: RSC can ask for this segment directly.
  await requireAdmin();

  const params = await props.params;
  const searchParams = await props.searchParams;
  if (!enquiryIdValid(params.id)) notFound();
  const enquiry = await getEnquiry(params.id);
  if (!enquiry) notFound();

  // Looking at an existing reply or an archived message never changes its state.
  const readSaved = enquiry.status === "new" ? await setEnquiryStatus(enquiry.id, "read") : true;
  const unread = enquiry.status === "new" && readSaved ? await countNew() : undefined;
  const status = enquiry.status === "new" && readSaved ? "read" : enquiry.status;
  const events = await listEnquiryEvents(enquiry.id);
  const key =
    searchParams.sendt === "1"
      ? "sendt"
      : searchParams.fejl === "mail"
        ? "mail"
        : searchParams.fejl === "send"
          ? "send"
          : searchParams.fejl === "ukendt"
            ? "ukendt"
            : null;
  const reason =
    key === "send" || key === "ukendt"
      ? (await cookies()).get(MAIL_ERROR_COOKIE)?.value
      : undefined;
  const recordFailed = key === "sendt" && searchParams.lagring === "fejl";
  const mailReady = Boolean(process.env.RESEND_API_KEY);
  const replyTo = process.env.CONTACT_TO ?? company.email;
  const safePhone = enquiry.phone?.replace(/[^+\d]/g, "") ?? "";

  return (
    <div>
      <MessageReadReceipt unread={unread} />
      <Link
        href="/admin/beskeder"
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-paper/75 transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Alle beskeder
      </Link>

      {key && (
        <div
          role={key === "sendt" && !recordFailed ? "status" : "alert"}
          className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-4 text-sm leading-6 ${key === "sendt" && !recordFailed ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-100" : recordFailed || key === "ukendt" ? "border-amber-400/25 bg-amber-400/[0.07] text-amber-100" : "border-red-400/25 bg-red-400/[0.07] text-red-100"}`}
        >
          {key === "sendt" && !recordFailed ? (
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none" />
          ) : (
            <AlertIcon className="mt-0.5 h-4 w-4 flex-none" />
          )}
          <p>
            {recordFailed
              ? "Svaret er sendt som e-mail, men kunne ikke gemmes i beskedarkivet. Send ikke samme svar igen. Kontrollér databaseforbindelsen under System."
              : key === "sendt"
                ? "Svaret er sendt og gemt."
                : key === "ukendt"
                  ? "Afsendelsen kunne ikke bekræftes. Mailudbyderen kan have modtaget svaret. Kontrollér leveringen hos mailudbyderen, før du sender igen."
                  : key === "mail"
                    ? "Svaret blev ikke sendt. Mailafsendelse er ikke konfigureret på denne deployment."
                    : "Svaret blev ikke sendt."}
            {reason && <span className="mt-1 block">{reason}</span>}
          </p>
        </div>
      )}
      {searchParams.result === "restored" && (
        <p
          role="status"
          className="mt-5 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.07] p-4 text-sm text-emerald-100"
        >
          Beskeden er flyttet tilbage til aktive beskeder.
        </p>
      )}
      {searchParams.handling === "fejl" && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/[0.07] p-4 text-sm leading-6 text-amber-100"
        >
          Beskedens status kunne ikke gemmes. Prøv igen, eller kontrollér forbindelsen under System.
        </p>
      )}
      {!readSaved && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/[0.07] p-4 text-sm leading-6 text-amber-100"
        >
          Beskeden kunne ikke markeres som læst. Indholdet vises, men status er uændret.
        </p>
      )}

      <header className="mt-6 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-paper/75">
          <span className="rounded-md border border-white/15 px-2.5 py-1">
            {INBOX_SOURCE[enquiry.source] ?? "Kontakt"}
          </span>
          <span
            className={`rounded-md px-2.5 py-1 font-semibold ${status === "replied" ? "bg-emerald-400/15 text-emerald-200" : status === "new" ? "bg-brand-500/20 text-brand-200" : "bg-white/10 text-paper/80"}`}
          >
            {STATUS[status]}
          </span>
        </div>
        <h1 className="mt-3 break-words font-display text-[1.75rem] font-extrabold tracking-tight [overflow-wrap:anywhere]">
          {enquiry.name}
        </h1>
        {enquiry.subject && (
          <p className="mt-2 break-words text-base leading-6 text-paper/85 [overflow-wrap:anywhere]">
            {enquiry.subject}
          </p>
        )}
        <p className="mt-2 text-xs leading-5 text-paper/65">
          Modtaget <time dateTime={enquiry.created_at}>{when(enquiry.created_at)}</time>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="#reply-heading" className={`${BUTTON} text-sm`}>
            Skriv svar ↓
          </a>
          <Link
            href={`/admin/kontakter/${enquiry.id}`}
            prefetch={false}
            className={`${BUTTON} text-sm`}
          >
            Samlet kontakt
          </Link>
          <a href="#message-actions" className={`${BUTTON} text-sm xl:hidden`}>
            Kontakt og håndtering ↓
          </a>
        </div>
      </header>

      <div className="mt-7 grid min-w-0 items-start gap-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-7">
          <section aria-labelledby="message-heading" className={`${CARD} p-5 sm:p-6`}>
            <h2 id="message-heading" className="text-base font-semibold">
              Kundens besked
            </h2>
            <p className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-7 text-paper/90 [overflow-wrap:anywhere]">
              {enquiry.message}
            </p>
          </section>

          {enquiry.mail_error && (
            <p className="flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-5 text-sm leading-6 text-amber-100">
              <AlertIcon className="mt-0.5 h-4 w-4 flex-none text-amber-300" />
              <span>
                Beskeden er gemt her, men mailkopien til {replyTo} blev ikke sendt. Årsag:{" "}
                <span className="break-words">{enquiry.mail_error}</span>
              </span>
            </p>
          )}

          {enquiry.reply_body && (
            <section
              aria-labelledby="last-reply-heading"
              className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.035] p-5 sm:p-6"
            >
              <h2
                id="last-reply-heading"
                className="flex items-center gap-2 text-base font-semibold"
              >
                <CheckIcon className="h-4 w-4 text-emerald-200" />
                Seneste sendte svar
              </h2>
              {enquiry.replied_at && (
                <p className="mt-2 text-xs leading-5 text-paper/70">
                  <time dateTime={enquiry.replied_at}>{when(enquiry.replied_at)}</time>
                </p>
              )}
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-paper/85 [overflow-wrap:anywhere]">
                {enquiry.reply_body}
              </p>
            </section>
          )}

          <section aria-labelledby="reply-heading" className={`${CARD} p-5 sm:p-6`}>
            <h2 id="reply-heading" className="text-base font-semibold">
              {enquiry.reply_body ? "Følg op" : "Skriv et svar"}
            </h2>
            {!looksLikeEmail(enquiry.email) && (
              <p role="alert" className="mt-4 text-sm leading-6 text-amber-100">
                Den gemte e-mailadresse er ikke gyldig. Kontrollér kundens kontaktoplysninger, før
                du sender et svar.
              </p>
            )}
            <MessageReplyForm
              id={enquiry.id}
              name={enquiry.name}
              email={enquiry.email}
              mailReady={mailReady}
            />
            <p className="mt-4 break-words text-xs leading-5 text-paper/65">
              Kundens svar på din e-mail lander i {replyTo}. Panelet viser det senest sendte svar.
            </p>
          </section>

          <section aria-labelledby="history-heading" className={`${CARD} p-5 sm:p-6`}>
            <h2 id="history-heading" className="text-base font-semibold">
              Historik
            </h2>
            {!events.available ? (
              <p role="status" className="mt-3 text-sm leading-6 text-amber-100">
                Historikken kunne ikke hentes. Det betyder ikke, at der ingen ændringer er.
              </p>
            ) : events.items.length ? (
              <details className="mt-2">
                <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium text-brand-200">
                  Vis seneste hændelser ({events.items.length}) ↓
                </summary>
                <ol className="mt-3 space-y-4 border-l border-white/15 pl-4">
                  {events.items.map((event) => (
                    <li key={event.id}>
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                        <h3 className="text-sm font-semibold">
                          {
                            {
                              status: "Status",
                              note: "Intern note",
                              follow_up: "Opfølgning",
                              reply: "Sendt svar",
                            }[event.kind]
                          }
                        </h3>
                        <time dateTime={event.created_at} className="text-xs text-paper/65">
                          {when(event.created_at)}
                        </time>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-paper/80 [overflow-wrap:anywhere]">
                        {event.detail}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-xs leading-5 text-paper/65">
                  Op til 20 registrerede ændringer. Tidligere handlinger er ikke rekonstrueret.
                </p>
              </details>
            ) : (
              <p className="mt-3 text-sm leading-6 text-paper/70">
                Ingen registrerede ændringer endnu. Tidligere handlinger er ikke rekonstrueret.
              </p>
            )}
          </section>
        </div>

        <aside
          id="message-actions"
          className="min-w-0 scroll-mt-6 space-y-5"
          aria-label="Kontakt og håndtering"
        >
          <section className={`${CARD} p-5`}>
            <h2 className="text-base font-semibold">Kontakt</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-paper/65">E-mail</dt>
                <dd className="mt-1 break-words">
                  {looksLikeEmail(enquiry.email) ? (
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="inline-flex min-h-[44px] max-w-full items-center break-all text-brand-200 underline decoration-brand-300/40 underline-offset-4 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                    >
                      {enquiry.email}
                    </a>
                  ) : (
                    enquiry.email
                  )}
                </dd>
              </div>
              {enquiry.phone && (
                <div>
                  <dt className="text-xs text-paper/65">Telefon</dt>
                  <dd className="mt-1 break-words">
                    {safePhone ? (
                      <a
                        href={`tel:${safePhone}`}
                        className="inline-flex min-h-[44px] items-center text-paper/90 underline decoration-white/25 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                      >
                        {enquiry.phone}
                      </a>
                    ) : (
                      enquiry.phone
                    )}
                  </dd>
                </div>
              )}
              {enquiry.company && (
                <div>
                  <dt className="text-xs text-paper/65">Virksomhed</dt>
                  <dd className="mt-2 break-words text-paper/90 [overflow-wrap:anywhere]">
                    {enquiry.company}
                  </dd>
                </div>
              )}
              {enquiry.page && (
                <div>
                  <dt className="text-xs text-paper/65">Sendt fra</dt>
                  <dd className="mt-2 break-words text-paper/80 [overflow-wrap:anywhere]">
                    {enquiry.page}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className={`${CARD} p-5`}>
            <h2 className="text-base font-semibold">Opfølgning</h2>
            {status === "archived" && (
              <p className="mt-2 text-xs leading-5 text-paper/70">
                Beskeden er i arkiv og er udeladt af opfølgningskøen. Dato og prioritet bevares ved
                genåbning.
              </p>
            )}
            <MessageFollowUpForm
              id={enquiry.id}
              initialPriority={enquiry.priority}
              initialDate={enquiry.follow_up_on}
              outcome={
                searchParams.followup === "saved" || searchParams.followup === "error"
                  ? searchParams.followup
                  : undefined
              }
            />
          </section>

          <section className={`${CARD} p-5`}>
            <h2 className="text-base font-semibold">Håndtering</h2>
            {status === "archived" ? (
              <form action="/api/admin/status" method="post" className="mt-4">
                <input type="hidden" name="id" value={enquiry.id} />
                <input type="hidden" name="status" value="read" />
                <button className={secondaryButton}>Flyt til aktive</button>
                <p className="mt-3 text-xs leading-5 text-paper/65">
                  Beskeden og det seneste svar bevares.
                </p>
              </form>
            ) : (
              <div className="mt-4 space-y-2">
                <form action="/api/admin/status" method="post">
                  <input type="hidden" name="id" value={enquiry.id} />
                  <input type="hidden" name="status" value="new" />
                  <button className={secondaryButton}>Markér som ulæst</button>
                </form>
                <form action="/api/admin/archive" method="post">
                  <input type="hidden" name="id" value={enquiry.id} />
                  <button className={secondaryButton}>
                    <ArchiveIcon className="h-4 w-4" />
                    Arkivér besked
                  </button>
                </form>
                <p className="pt-1 text-xs leading-5 text-paper/65">
                  Arkiverede beskeder kan altid findes og genåbnes fra indbakken.
                </p>
              </div>
            )}
          </section>

          <section className={`${CARD} p-5`}>
            <h2 className="text-base font-semibold">Intern note</h2>
            <p id="note-help" className="mt-2 text-xs leading-5 text-paper/70">
              Kun til administrationen. Noten sendes ikke til kunden.
            </p>
            <MessageNoteForm
              id={enquiry.id}
              initialNote={enquiry.internal_note ?? ""}
              outcome={
                searchParams.note === "saved" || searchParams.note === "error"
                  ? searchParams.note
                  : undefined
              }
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
