import Link from "next/link";

import { AlertIcon, InboxIcon } from "@/components/admin/icons";
import { InboxRow } from "@/components/admin/InboxRow";
import { INPUT } from "@/components/admin/tokens";
import { requireAdmin } from "@/lib/admin-auth";
import { searchEnquiries, type EnquirySource, type EnquiryStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = [
  { key: "active", label: "Aktive" },
  { key: "new", label: "Nye" },
  { key: "read", label: "Læste" },
  { key: "replied", label: "Besvarede" },
  { key: "archived", label: "Arkiverede" },
  { key: "all", label: "Alle" },
] as const;

const SOURCES: { key: EnquirySource; label: string }[] = [
  { key: "contact", label: "Kontakt" },
  { key: "quote", label: "Tilbud" },
  { key: "instagram", label: "Instagram" },
];

type Query = Record<string, string | string[] | undefined>;
const scalar = (value: Query[string]) => (typeof value === "string" ? value : "");
const fieldClass = `${INPUT} w-full`;

export default async function InboxPage(props: { searchParams: Promise<Query> }) {
  // A segment request can skip the layout. The page checks before every read.
  await requireAdmin();

  const params = await props.searchParams;
  const requested = scalar(params.status);
  const status = STATUS_FILTERS.some((filter) => filter.key === requested)
    ? (requested as EnquiryStatus | "active" | "all")
    : "active";
  const requestedSource = scalar(params.source);
  const source = SOURCES.find((item) => item.key === requestedSource)?.key;
  const q = scalar(params.q).trim().slice(0, 120);
  const sort = scalar(params.sort) === "oldest" ? "oldest" : "newest";
  const rawPage = scalar(params.page);
  const page = /^\d{1,6}$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1;
  const result = await searchEnquiries({ status, source, q, sort, page, pageSize: 25 });
  const pages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const hasFilters = Boolean(q || source || sort !== "newest" || status !== "active");

  function href(change: { status?: string; page?: number } = {}) {
    const query = new URLSearchParams();
    const nextStatus = change.status ?? status;
    if (nextStatus !== "active") query.set("status", nextStatus);
    if (q) query.set("q", q);
    if (source) query.set("source", source);
    if (sort !== "newest") query.set("sort", sort);
    if (change.page && change.page > 1) query.set("page", String(change.page));
    return `/admin/beskeder${query.size ? `?${query}` : ""}`;
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
            Indbakke
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] font-extrabold tracking-tight">
            Beskeder
          </h1>
          <p className="mt-2 text-sm leading-6 text-paper/70">
            Find en henvendelse, svar kunden og hold styr på det næste skridt.
          </p>
        </div>
        <a
          href={href({ page: result.page })}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-white/15 px-4 text-sm font-medium text-paper/80 transition hover:border-white/30 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
        >
          Opdatér indbakken
        </a>
      </header>

      {["unread", "archived"].includes(scalar(params.result)) && (
        <p
          role="status"
          className="mt-5 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.07] p-4 text-sm text-emerald-100"
        >
          {scalar(params.result) === "unread"
            ? "Beskeden er markeret som ulæst."
            : "Beskeden er arkiveret. Den kan genåbnes under Arkiverede."}
        </p>
      )}

      <nav aria-label="Beskedstatus" className="mt-7 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.key}
            href={href({ status: filter.key })}
            aria-current={status === filter.key ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-3.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300 ${status === filter.key ? "border-brand-400/60 bg-brand-500/15 font-semibold text-paper" : "border-white/10 text-paper/70 hover:border-white/25 hover:text-paper"}`}
          >
            {filter.label}
            {result.available && (
              <span
                className={`tabular-nums text-xs ${status === filter.key ? "text-brand-200" : "text-paper/65"}`}
              >
                {result.counts[filter.key].toLocaleString("da-DK")}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <form
        key={JSON.stringify([status, source, q, sort])}
        role="search"
        aria-label="Søg i beskeder"
        action="/admin/beskeder"
        method="get"
        className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]"
      >
        <input type="hidden" name="status" value={status} />
        <div className="min-w-0 sm:col-span-2 xl:col-span-1">
          <label htmlFor="inbox-search" className="mb-2 block text-xs font-medium text-paper/75">
            Søg
          </label>
          <input
            id="inbox-search"
            name="q"
            type="search"
            defaultValue={q}
            maxLength={120}
            placeholder="Navn, firma, e-mail eller besked"
            className={`${fieldClass} placeholder:text-paper/65`}
          />
        </div>
        <div>
          <label htmlFor="inbox-source" className="mb-2 block text-xs font-medium text-paper/75">
            Type
          </label>
          <select
            id="inbox-source"
            name="source"
            defaultValue={source ?? ""}
            className={fieldClass}
          >
            <option value="">Alle typer</option>
            {SOURCES.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="inbox-sort" className="mb-2 block text-xs font-medium text-paper/75">
            Sortering
          </label>
          <select id="inbox-sort" name="sort" defaultValue={sort} className={fieldClass}>
            <option value="newest">Nyeste først</option>
            <option value="oldest">Ældste først</option>
          </select>
        </div>
        <button className="inline-flex min-h-[44px] items-center justify-center self-end rounded-lg bg-brand-600 px-5 text-sm font-semibold text-paper transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300 sm:col-span-2 xl:col-span-1">
          Søg og filtrér
        </button>
      </form>

      {!result.available ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-5 text-sm leading-6 text-amber-100"
        >
          <AlertIcon className="mt-0.5 h-5 w-5 flex-none text-amber-300" />
          <div>
            <h2 className="font-semibold">Indbakken er ikke tilgængelig</h2>
            <p className="mt-1">
              Forbindelsen til beskedarkivet mangler eller kunne ikke oprettes.
            </p>
            <Link
              href="/admin/system"
              className="inline-flex min-h-[44px] items-center font-medium underline underline-offset-4"
            >
              Se Systemstatus
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-paper/75" aria-live="polite">
              {result.total > 0 ? (
                <>
                  <span className="font-semibold tabular-nums text-paper">
                    {((result.page - 1) * result.pageSize + 1).toLocaleString("da-DK")}–
                    {Math.min(result.page * result.pageSize, result.total).toLocaleString("da-DK")}
                  </span>{" "}
                  af {result.total.toLocaleString("da-DK")}{" "}
                  {result.total === 1 ? "besked" : "beskeder"}
                </>
              ) : (
                "0 beskeder"
              )}
              {q && <span> for “{q}”</span>}
            </p>
            {hasFilters && (
              <Link
                href="/admin/beskeder"
                className="inline-flex min-h-[44px] items-center text-brand-200 underline decoration-brand-300/40 underline-offset-4 hover:text-paper"
              >
                Nulstil filtre
              </Link>
            )}
          </div>

          {result.items.length === 0 ? (
            <section className="mt-3 rounded-xl border border-dashed border-white/15 px-5 py-12 text-center">
              <InboxIcon className="mx-auto h-8 w-8 text-brand-200" />
              <h2 className="mt-4 text-base font-semibold">
                {hasFilters ? "Ingen beskeder matcher" : "Ingen aktive beskeder"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-paper/70">
                {hasFilters
                  ? "Prøv et andet søgeord, vælg en anden type, eller nulstil filtrene."
                  : "Nye henvendelser fra sitets formularer lander her. Arkiverede beskeder findes under Arkiverede."}
              </p>
            </section>
          ) : (
            <ul
              aria-label="Henvendelser"
              className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.015]"
            >
              {result.items.map((enquiry) => (
                <InboxRow key={enquiry.id} enquiry={enquiry} />
              ))}
            </ul>
          )}

          {pages > 1 && (
            <nav
              aria-label="Beskedsider"
              className="mt-5 flex flex-wrap items-center justify-between gap-3"
            >
              {result.page > 1 ? (
                <Link
                  href={href({ page: result.page - 1 })}
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-white/15 px-4 text-sm text-paper/80 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                >
                  Forrige
                </Link>
              ) : (
                <span
                  className="inline-flex min-h-[44px] items-center px-4 text-sm text-paper/65"
                  aria-disabled="true"
                >
                  Forrige
                </span>
              )}
              <p className="text-sm tabular-nums text-paper/70">
                Side {result.page.toLocaleString("da-DK")} af {pages.toLocaleString("da-DK")}
              </p>
              {result.page < pages ? (
                <Link
                  href={href({ page: result.page + 1 })}
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-white/15 px-4 text-sm text-paper/80 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                >
                  Næste
                </Link>
              ) : (
                <span
                  className="inline-flex min-h-[44px] items-center px-4 text-sm text-paper/65"
                  aria-disabled="true"
                >
                  Næste
                </span>
              )}
            </nav>
          )}
          <p className="mt-4 text-xs leading-5 text-paper/65">
            Tallene ved status viser hele indbakken. Listen følger dine valgte filtre.
          </p>
        </>
      )}
    </div>
  );
}
