import Link from "next/link";
import { BUTTON, CARD, EYEBROW, INPUT } from "@/components/admin/tokens";
import { shortWhen } from "@/components/admin/parts";
import { requireAdmin } from "@/lib/admin-auth";
import { searchContacts } from "@/lib/db";

export const dynamic = "force-dynamic";
type Query = Record<string, string | string[] | undefined>;
const scalar = (value: Query[string]) => (typeof value === "string" ? value : "");

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Query> }) {
  await requireAdmin();
  const params = await searchParams;
  const q = scalar(params.q).trim().slice(0, 120);
  const rawPage = scalar(params.page);
  const page = /^\d{1,6}$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1;
  const result = await searchContacts({ q, page, pageSize: 25 });
  function href(page: number) {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (page > 1) query.set("page", String(page));
    return `/admin/kontakter${query.size ? `?${query}` : ""}`;
  }
  return (
    <div className="space-y-6">
      <header>
        <p className={EYEBROW}>Relationer · samlet kontaktbillede</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Kontakter</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/70">
          Henvendelser samlet efter e-mailadresse. Åbn en kontakt for at se tidligere beskeder og
          udestående svar.
        </p>
      </header>
      <form
        key={q}
        role="search"
        aria-label="Søg i kontakter"
        method="get"
        action="/admin/kontakter"
        className={`${CARD} grid grid-cols-2 gap-3 p-4 sm:flex sm:flex-wrap sm:items-end`}
      >
        <div className="col-span-2 min-w-0 sm:flex-1 sm:basis-56">
          <label htmlFor="contact-search" className="mb-2 block text-xs font-medium text-paper/75">
            Søg efter kontakt
          </label>
          <input
            id="contact-search"
            type="search"
            name="q"
            defaultValue={q}
            maxLength={120}
            placeholder="Navn, virksomhed eller e-mail"
            className={`${INPUT} w-full placeholder:text-paper/65`}
          />
        </div>
        <button className={`${BUTTON} ${q ? "" : "col-span-2"}`}>Søg kontakter</button>
        {q && (
          <Link href="/admin/kontakter" className={BUTTON}>
            Nulstil
          </Link>
        )}
      </form>
      {!result.available ? (
        <section role="status" className={`${CARD} p-6`}>
          <h2 className="font-semibold">Kontaktoversigten kunne ikke hentes</h2>
          <p className="mt-2 text-sm text-paper/70">
            Kontrollér forbindelsen, før du bruger visningen som en tom kontaktliste.
          </p>
          <Link href="/admin/system" className={`${BUTTON} mt-4`}>
            Se Systemstatus
          </Link>
        </section>
      ) : (
        <>
          <p className="text-sm tabular-nums text-paper/75">
            {result.total.toLocaleString("da-DK")} {result.total === 1 ? "kontakt" : "kontakter"}
            {q ? ` for “${q}”` : ""}
          </p>
          {result.items.length ? (
            <ul aria-label="Kontakter" className={`${CARD} overflow-hidden`}>
              {result.items.map((contact) => (
                <li key={contact.id} className="border-b border-white/10 last:border-b-0">
                  <Link
                    href={`/admin/kontakter/${contact.id}`}
                    prefetch={false}
                    className="grid min-w-0 gap-3 p-5 transition-colors hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-300 sm:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div className="min-w-0">
                      <h2 className="break-words text-base font-semibold [overflow-wrap:anywhere]">
                        {contact.name || contact.email}
                      </h2>
                      {contact.company && (
                        <p className="mt-1 break-words text-sm text-paper/80 [overflow-wrap:anywhere]">
                          {contact.company}
                        </p>
                      )}
                      <p className="mt-2 break-all text-xs leading-5 text-paper/70">
                        {contact.email}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-paper/75 sm:flex-col sm:items-end">
                      <span className="tabular-nums">
                        {contact.enquiryCount}{" "}
                        {contact.enquiryCount === 1 ? "henvendelse" : "henvendelser"}
                      </span>
                      {contact.pendingCount > 0 && (
                        <span className="rounded-md bg-brand-500/15 px-2 py-1 font-semibold tabular-nums text-brand-200">
                          {contact.pendingCount} afventer svar
                        </span>
                      )}
                      <span>
                        Senest{" "}
                        <time dateTime={contact.lastSeen}>{shortWhen(contact.lastSeen)}</time>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <section className={`${CARD} p-8`}>
              <h2 className="text-lg font-semibold">
                {q ? "Ingen kontakter matcher søgningen" : "Ingen kontakter endnu"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-paper/70">
                Kontakter vises automatisk, når der er gemt henvendelser fra sitets formularer.
              </p>
            </section>
          )}
          {result.pages > 1 && (
            <nav
              aria-label="Kontaktsider"
              className="flex flex-wrap items-center justify-between gap-3"
            >
              {result.page > 1 ? (
                <Link href={href(result.page - 1)} className={BUTTON}>
                  Forrige
                </Link>
              ) : (
                <span className="text-sm text-paper/65">Forrige</span>
              )}
              <p className="text-sm tabular-nums text-paper/70">
                Side {result.page} af {result.pages}
              </p>
              {result.page < result.pages ? (
                <Link href={href(result.page + 1)} className={BUTTON}>
                  Næste
                </Link>
              ) : (
                <span className="text-sm text-paper/65">Næste</span>
              )}
            </nav>
          )}
          <p className="text-xs leading-6 text-paper/65">
            Oplysningerne er indsendt gennem formularerne og er ikke et register over bekræftede
            kunder. Forskellige e-mailadresser vises hver for sig; en delt postkasse vises samlet.
          </p>
        </>
      )}
    </div>
  );
}
