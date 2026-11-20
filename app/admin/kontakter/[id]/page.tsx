import Link from "next/link";
import { notFound } from "next/navigation";
import { InboxRow } from "@/components/admin/InboxRow";
import { BUTTON, CARD, EYEBROW } from "@/components/admin/tokens";
import { requireAdmin } from "@/lib/admin-auth";
import { enquiryIdValid } from "@/lib/admin-form";
import { getContact } from "@/lib/db";
import { looksLikeEmail } from "@/lib/mail-safe";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { id } = await params;
  if (!enquiryIdValid(id)) notFound();
  const query = await searchParams;
  const rawPage = typeof query.page === "string" ? query.page : "";
  const page = /^\d{1,6}$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1;
  const result = await getContact(id, { page });
  if (!result.available)
    return (
      <div>
        <p className={EYEBROW}>Kontakter</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Kontakt</h1>
        <section role="status" className={`${CARD} mt-6 p-6`}>
          <h2 className="font-semibold">Kontaktoplysninger kunne ikke hentes</h2>
          <p className="mt-2 text-sm text-paper/70">
            Prøv igen, eller kontrollér forbindelsen under System.
          </p>
          <Link href="/admin/system" className={`${BUTTON} mt-4`}>
            Se Systemstatus
          </Link>
        </section>
      </div>
    );
  const contact = result.contact;
  if (!contact) notFound();
  const phone = contact.phone?.replace(/[^+\d]/g, "");
  const when = new Date(contact.lastSeen).toLocaleString("da-DK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/kontakter"
        className="inline-flex min-h-11 items-center text-sm font-medium text-paper/75 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
      >
        ← Alle kontakter
      </Link>
      <header>
        <p className={EYEBROW}>Kontakt · historik fra formularerne</p>
        <h1 className="mt-2 break-words font-display text-3xl font-extrabold tracking-tight [overflow-wrap:anywhere]">
          {contact.name || contact.email}
        </h1>
        {contact.company && (
          <p className="mt-2 break-words text-base text-paper/85 [overflow-wrap:anywhere]">
            {contact.company}
          </p>
        )}
      </header>
      <section
        aria-label="Kontaktoplysninger"
        className={`${CARD} grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3`}
      >
        <div>
          <h2 className="text-xs font-medium text-paper/70">E-mail</h2>
          {looksLikeEmail(contact.email) ? (
            <a
              href={`mailto:${contact.email}`}
              className="mt-1 inline-flex min-h-11 items-center break-all text-sm text-brand-200 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
            >
              {contact.email}
            </a>
          ) : (
            <p className="mt-3 break-all text-sm">{contact.email}</p>
          )}
        </div>
        {contact.phone && (
          <div>
            <h2 className="text-xs font-medium text-paper/70">Telefon</h2>
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="mt-1 inline-flex min-h-11 max-w-full items-center break-all text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
              >
                {contact.phone}
              </a>
            ) : (
              <p className="mt-3 text-sm">{contact.phone}</p>
            )}
          </div>
        )}
        <div>
          <h2 className="text-xs font-medium text-paper/70">Seneste henvendelse</h2>
          <p className="mt-3 text-sm">
            <time dateTime={contact.lastSeen}>{when}</time>
          </p>
        </div>
      </section>
      <dl className="flex flex-wrap gap-x-8 gap-y-4">
        <div>
          <dt className="text-xs text-paper/70">Gemte henvendelser</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums">{contact.enquiryCount}</dd>
        </div>
        <div>
          <dt className="text-xs text-paper/70">Afventer svar</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-200">
            {contact.pendingCount}
          </dd>
        </div>
      </dl>
      <section aria-labelledby="contact-messages">
        <h2 id="contact-messages" className="text-lg font-semibold">
          Henvendelser
        </h2>
        <p className="mt-2 text-sm leading-6 text-paper/70">
          Inklusive arkiverede beskeder. Status ændres først, når du åbner den enkelte besked.
        </p>
        <ul aria-label="Kontaktens henvendelser" className={`${CARD} mt-4 overflow-hidden`}>
          {result.items.map((item) => (
            <InboxRow key={item.id} enquiry={item} />
          ))}
        </ul>
      </section>
      {result.pages > 1 && (
        <nav
          aria-label="Kontaktens beskedsider"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          {result.page > 1 ? (
            <Link href={`/admin/kontakter/${id}?page=${result.page - 1}`} className={BUTTON}>
              Forrige
            </Link>
          ) : (
            <span className="text-sm text-paper/65">Forrige</span>
          )}
          <p className="text-sm tabular-nums text-paper/70">
            Side {result.page} af {result.pages}
          </p>
          {result.page < result.pages ? (
            <Link href={`/admin/kontakter/${id}?page=${result.page + 1}`} className={BUTTON}>
              Næste
            </Link>
          ) : (
            <span className="text-sm text-paper/65">Næste</span>
          )}
        </nav>
      )}
      <p className="text-xs leading-6 text-paper/65">
        Samlet efter samme e-mailadresse. Navn, virksomhed og telefon viser de senest indsendte,
        udfyldte oplysninger; de er ikke verificeret særskilt.
      </p>
    </div>
  );
}
