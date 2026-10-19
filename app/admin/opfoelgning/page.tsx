import Link from "next/link";
import { InboxRow, followUpDate } from "@/components/admin/InboxRow";
import { BUTTON, CARD, EYEBROW, INPUT } from "@/components/admin/tokens";
import { requireAdmin } from "@/lib/admin-auth";
import { searchFollowUps, type FollowUpScope } from "@/lib/db";

export const dynamic = "force-dynamic";
type Query = Record<string, string | string[] | undefined>;
const scalar = (value: Query[string]) => (typeof value === "string" ? value : "");
const SCOPES = [
  { key: "due", label: "Til og med i dag" },
  { key: "overdue", label: "Overskredet" },
  { key: "upcoming", label: "Planlagt" },
  { key: "unscheduled", label: "Uden dato" },
  { key: "all", label: "Alle aktive" },
] as const;

export default async function FollowUpsPage({ searchParams }: { searchParams: Promise<Query> }) {
  await requireAdmin();
  const params = await searchParams;
  const requestedScope = scalar(params.scope);
  const scope = SCOPES.some((item) => item.key === requestedScope)
    ? (requestedScope as FollowUpScope)
    : "due";
  const q = scalar(params.q).trim().slice(0, 120);
  const priority = scalar(params.priority) === "high" ? "high" : "all";
  const rawPage = scalar(params.page);
  const page = /^\d{1,6}$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1;
  const queue = await searchFollowUps({ scope, q, priority, page, pageSize: 25 });

  function href(change: { scope?: string; page?: number; priority?: string } = {}) {
    const query = new URLSearchParams();
    const nextScope = change.scope ?? scope;
    const nextPriority = change.priority ?? priority;
    if (nextScope !== "due") query.set("scope", nextScope);
    if (q) query.set("q", q);
    if (nextPriority === "high") query.set("priority", "high");
    if (change.page && change.page > 1) query.set("page", String(change.page));
    return `/admin/opfoelgning${query.size ? `?${query}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={EYEBROW}>Arbejdsdag · næste skridt</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Opfølgning</h1>
          <p className="mt-2 text-sm leading-6 text-paper/70">
            Planlæg henvendelser efter dato og prioritet. Åbn en besked for at ændre planen.
          </p>
        </div>
        <p className="text-xs text-paper/70">
          I dag i København:{" "}
          <span className="font-semibold text-paper/90">{followUpDate(queue.today)}</span>
        </p>
      </header>
      <nav aria-label="Opfølgningsperiode" className="flex flex-wrap gap-2">
        {SCOPES.map((item) => (
          <Link
            key={item.key}
            href={href({ scope: item.key })}
            aria-current={scope === item.key ? "page" : undefined}
            className={`${BUTTON} ${scope === item.key ? "border-brand-400/60 bg-brand-500/15" : ""}`}
          >
            {item.label}
            {queue.available && (
              <span className="tabular-nums text-xs text-paper/70">
                {queue.counts[item.key].toLocaleString("da-DK")}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <form
        key={JSON.stringify([scope, q, priority])}
        role="search"
        aria-label="Søg i opfølgning"
        action="/admin/opfoelgning"
        method="get"
        className={`${CARD} p-4`}
      >
        <input type="hidden" name="scope" value={scope} />
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <label
              htmlFor="followup-search"
              className="mb-2 block text-xs font-medium text-paper/75"
            >
              Søg i henvendelser
            </label>
            <input
              id="followup-search"
              type="search"
              name="q"
              defaultValue={q}
              maxLength={120}
              placeholder="Navn, firma, e-mail eller besked"
              className={`${INPUT} w-full placeholder:text-paper/65`}
            />
          </div>
          <button className={`${BUTTON} w-full sm:w-auto`}>Søg og filtrér</button>
        </div>
        <details open={priority === "high"} className="mt-2">
          <summary className="flex min-h-11 cursor-pointer items-center text-xs font-medium text-paper/80">
            Prioritet{priority === "high" ? " · høj valgt" : ""} ↓
          </summary>
          <div className="border-t border-white/10 pt-3">
            <label htmlFor="followup-priority-filter" className="mb-2 block text-xs text-paper/75">
              Vis prioritet
            </label>
            <select
              id="followup-priority-filter"
              name="priority"
              defaultValue={priority}
              className={`${INPUT} w-full sm:w-auto`}
            >
              <option value="all">Alle prioriteter</option>
              <option value="high">Kun høj prioritet</option>
            </select>
          </div>
        </details>
      </form>
      {!queue.available ? (
        <section role="status" className={`${CARD} p-6`}>
          <h2 className="font-semibold">Opfølgninger kunne ikke hentes</h2>
          <p className="mt-2 text-sm text-paper/70">
            En manglende forbindelse betyder ikke, at der ingen opgaver er.
          </p>
          <Link href="/admin/system" className={`${BUTTON} mt-4`}>
            Se Systemstatus
          </Link>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm tabular-nums text-paper/80">
              {queue.total.toLocaleString("da-DK")}{" "}
              {queue.total === 1 ? "henvendelse" : "henvendelser"} i visningen
            </p>
            {(q || priority === "high") && (
              <Link
                href="/admin/opfoelgning"
                className="inline-flex min-h-11 items-center text-sm text-brand-200 underline underline-offset-4"
              >
                Nulstil filtre
              </Link>
            )}
          </div>
          {queue.items.length ? (
            <ul aria-label="Opfølgninger" className={`${CARD} overflow-hidden`}>
              {queue.items.map((item) => (
                <InboxRow key={item.id} enquiry={item} />
              ))}
            </ul>
          ) : (
            <section className={`${CARD} p-8`}>
              <h2 className="text-lg font-semibold">Ingen henvendelser i denne visning</h2>
              <p className="mt-2 text-sm leading-6 text-paper/70">
                Prøv en anden periode, eller åbn en besked og tilføj en opfølgningsdato.
              </p>
              <Link href="/admin/beskeder" className={`${BUTTON} mt-4`}>
                Åbn indbakken
              </Link>
            </section>
          )}
          {queue.pages > 1 && (
            <nav
              aria-label="Opfølgningssider"
              className="flex flex-wrap items-center justify-between gap-3"
            >
              {queue.page > 1 ? (
                <Link href={href({ page: queue.page - 1 })} className={BUTTON}>
                  Forrige
                </Link>
              ) : (
                <span className="text-sm text-paper/65">Forrige</span>
              )}
              <p className="text-sm tabular-nums text-paper/70">
                Side {queue.page} af {queue.pages}
              </p>
              {queue.page < queue.pages ? (
                <Link href={href({ page: queue.page + 1 })} className={BUTTON}>
                  Næste
                </Link>
              ) : (
                <span className="text-sm text-paper/65">Næste</span>
              )}
            </nav>
          )}
          <p className="text-xs leading-6 text-paper/65">
            Status-tallene viser hele den aktive kø. Listen følger dine filtre. Arkiverede beskeder
            er udeladt; genåbning bevarer deres opfølgningsdato. Datoen er en intern aftale, og der
            sendes ingen påmindelsesmail.
          </p>
        </>
      )}
    </div>
  );
}
