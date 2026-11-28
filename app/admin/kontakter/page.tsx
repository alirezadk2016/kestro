import Link from "next/link";
import { BUTTON, CARD, INPUT, PAGE_TITLE, SEARCH_ROW } from "@/components/admin/tokens";
import { shortWhen } from "@/components/admin/parts";
import { requireAdmin } from "@/lib/admin-auth";
import { searchContacts } from "@/lib/db";

export const dynamic = "force-dynamic";
type Query = Record<string, string | string[] | undefined>;
const scalar = (value: Query[string]) => (typeof value === "string" ? value : "");

/** One or two letters for the avatar: first and last name, or the address. */
const initials = (name: string) => {
  const words = name
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);
  const letters =
    words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? "?").slice(0, 2);
  return letters.toLocaleUpperCase("da-DK");
};

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
        <h1 className={PAGE_TITLE}>Kontakter</h1>
        <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-paper/70 sm:block">
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
        className={`${SEARCH_ROW} ${q ? "grid-cols-[minmax(0,1fr)_auto_auto]" : ""}`}
      >
        <div className="min-w-0">
          <label htmlFor="contact-search" className="sr-only">
            Søg efter kontakt
          </label>
          <input
            id="contact-search"
            type="search"
            name="q"
            defaultValue={q}
            maxLength={120}
            placeholder="Navn, firma eller e-mail"
            className={`${INPUT} w-full placeholder:text-paper/65`}
          />
        </div>
        <button className={BUTTON}>Søg kontakter</button>
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
                  {/* A contact is a line in a list, with its initials as the
                      one mark: name and company, then the address; on the
                      right what waits and when they last wrote. */}
                  <Link
                    href={`/admin/kontakter/${contact.id}`}
                    prefetch={false}
                    className="group grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-3 transition-colors hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-300 sm:px-5"
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 place-items-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-200"
                    >
                      {initials(contact.name || contact.email)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="flex min-w-0 items-baseline gap-2 text-sm font-semibold group-hover:text-brand-200">
                        <span className="min-w-0 truncate">{contact.name || contact.email}</span>
                        {contact.company && (
                          <span className="hidden min-w-0 truncate font-normal text-paper/65 sm:inline">
                            {contact.company}
                          </span>
                        )}
                      </h2>
                      <p className="truncate text-xs leading-5 text-paper/70">
                        {contact.email}
                        <span className="sm:hidden">
                          {contact.company ? `, ${contact.company}` : ""}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-paper/70">
                      {contact.pendingCount > 0 ? (
                        <span className="rounded-md bg-brand-500/15 px-1.5 py-0.5 font-semibold tabular-nums text-brand-200">
                          {contact.pendingCount} afventer svar
                        </span>
                      ) : (
                        <span className="tabular-nums">
                          {contact.enquiryCount}{" "}
                          {contact.enquiryCount === 1 ? "henvendelse" : "henvendelser"}
                        </span>
                      )}
                      <span className="whitespace-nowrap tabular-nums">
                        <span className="sr-only">Senest </span>
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
