import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getSearchConsoleReport } from "@/lib/db";
import { decimal } from "@/lib/format";
import { formatDate } from "@/lib/i18n";
import type { SearchConsoleReport, SearchMetric } from "@/lib/insights-types";
import {
  pacificToday,
  searchCtr,
  searchReviewSuggestions,
  searchSourceLabel,
  searchTypeLabel,
  SEARCH_CONSOLE_URL,
} from "@/lib/search-console";
import { searchConsoleSyncConfigured } from "@/lib/search-console-provider";
import { GrowthHeader, GrowthNav, GrowthPanel, GrowthEmpty } from "@/components/admin/GrowthParts";
import SearchConsoleImport from "@/components/admin/SearchConsoleImport";
import styles from "@/components/admin/growth.module.css";

export const dynamic = "force-dynamic";

type Params = { q?: string; kind?: string; sort?: string; page?: string };
const fraction = (value: number) =>
  new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format(value);
const ctr = (row: SearchMetric) => {
  const value = searchCtr(row);
  return value === null ? "—" : `${fraction(value)} %`;
};
const date = (value: string) => formatDate(value, "da");
const timestamp = (value: string) =>
  new Date(value).toLocaleString("da-DK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  });

export default async function SearchConsolePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  await requireAdmin();
  const [stored, params] = await Promise.all([getSearchConsoleReport(), searchParams]);
  const report = stored.report;
  const syncConfigured = searchConsoleSyncConfigured();
  const today = pacificToday();
  const day = new Date(`${today}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() - 1);
  const defaultTo = day.toISOString().slice(0, 10);
  day.setUTCDate(day.getUTCDate() - 27);
  const defaultFrom = day.toISOString().slice(0, 10);
  const query = (typeof params.q === "string" ? params.q : "").slice(0, 200).trim();
  const kind = params.kind === "pages" ? "pages" : "queries";
  const sort = ["clicks", "impressions", "position", "ctr"].includes(params.sort ?? "")
    ? params.sort!
    : "clicks";
  const allRows = report
    ? kind === "pages"
      ? report.pages.map((row) => ({ ...row, label: row.page, url: row.page }))
      : report.queries.map((row) => ({ ...row, label: row.query, url: null }))
    : [];
  const filtered = allRows
    .filter((row) =>
      row.label.toLocaleLowerCase("da-DK").includes(query.toLocaleLowerCase("da-DK")),
    )
    .sort((a, b) => {
      const difference =
        sort === "position"
          ? (a.position ?? Infinity) - (b.position ?? Infinity)
          : sort === "ctr"
            ? (searchCtr(b) ?? -1) - (searchCtr(a) ?? -1)
            : b[sort as "clicks" | "impressions"] - a[sort as "clicks" | "impressions"];
      return difference || b.impressions - a.impressions || a.label.localeCompare(b.label, "da-DK");
    });
  const pageCount = Math.max(1, Math.ceil(filtered.length / 20));
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), pageCount)
    : 1;
  const rows = filtered.slice((page - 1) * 20, page * 20);
  const href = (number: number) =>
    `/admin/seo?${new URLSearchParams({ kind, sort, ...(query ? { q: query } : {}), page: String(number) })}`;
  const visibleQueryClicks = report?.queries.reduce((sum, row) => sum + row.clicks, 0) ?? 0;

  return (
    <div className={styles.workspace}>
      <GrowthHeader
        title="Google & SEO"
        description="Se, hvad sitet bliver fundet på. Brug de rapporterede søgefraser og sider som grundlag for næste indholdsbeslutning."
        actions={
          <a
            href={SEARCH_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-200 underline underline-offset-4"
          >
            Åbn Search Console ↗
          </a>
        }
      />
      <GrowthNav active="seo" />
      {!stored.available && (
        <div className={styles.paper}>
          <p role="status" className={`${styles.notice} m-5`}>
            Den gemte rapport kunne ikke hentes. Det er manglende adgang til målinger, ikke
            dokumentation for nul trafik.{" "}
            <Link href="/admin/system" className={styles.textLink}>
              Se systemstatus →
            </Link>
          </p>
        </div>
      )}
      {report ? (
        <>
          <section className={styles.paper} aria-label="Rapportens samlede søgesynlighed">
            <div className={styles.reportTop}>
              <div className={styles.reportMeta}>
                <span className={styles.reportKicker}>{searchSourceLabel(report.source)}</span>
                <span>{searchTypeLabel(report.searchType)} · sc-domain:kestro.dk</span>
              </div>
              <p className={`${styles.sectionHeading} mt-3`}>
                {date(report.dateFrom)}–{date(report.dateTo)}
              </p>
              <dl className={`${styles.metricStrip} !grid-cols-2 lg:!grid-cols-4`}>
                <div className={`${styles.metric} ${styles.metricLead} !col-span-1`}>
                  <dt>Klik fra Google</dt>
                  <dd>{report.totals ? decimal(report.totals.clicks) : "—"}</dd>
                </div>
                <div className={styles.metric}>
                  <dt>Visninger i Google</dt>
                  <dd>{report.totals ? decimal(report.totals.impressions) : "—"}</dd>
                </div>
                <div className={styles.metric}>
                  <dt>Klikrate · CTR</dt>
                  <dd>{report.totals ? ctr(report.totals) : "—"}</dd>
                </div>
                <div className={styles.metric}>
                  <dt>Gns. position</dt>
                  <dd>{report.totals?.position ? fraction(report.totals.position) : "—"}</dd>
                </div>
              </dl>
              <p className={`${styles.metricNote} mt-5`}>
                {report.totals
                  ? "Ejendommens rapporttal. Klik er ikke det samme som besøg, unikke personer eller henvendelser."
                  : "Ingen samlet ejendomsmåling i denne fil. Summer af søgefraser eller sider bruges ikke som erstatning."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a href="#search-queries" className={`${styles.button} ${styles.primaryButton}`}>
                  Se søgefraser ↓
                </a>
                <p className={styles.metricNote}>
                  {report.daily.length
                    ? `Seneste dagsdata: ${date(report.daily[report.daily.length - 1].date)}.`
                    : "Ingen dagsrækker i rapporten."}
                </p>
              </div>
              <details className="mt-3">
                <summary className={styles.textLink}>Kilde & rapportoplysninger</summary>
                <div
                  className={`${styles.reportMeta} mt-3 border-t border-[color:var(--growth-line)] pt-4`}
                >
                  <span>
                    Eksporteret {timestamp(report.generatedAt)} · gemt{" "}
                    {stored.importedAt ? timestamp(stored.importedAt) : "ukendt tidspunkt"} · dansk
                    tid
                  </span>
                  <a href="/api/admin/search-console-export" download className={styles.textLink}>
                    Hent rapport ↓
                  </a>
                </div>
                <p className={styles.note}>
                  Datoerne i målingen følger Pacific-tid.{" "}
                  {report.daily.length
                    ? `Seneste rapporterede dag er ${date(report.daily[report.daily.length - 1].date)}.`
                    : "Filen indeholder ingen dagsrækker."}{" "}
                  Manglende eller endnu ikke rapporterede dage er ikke nul. Dette er et gemt
                  øjebliksbillede.
                </p>
              </details>
            </div>
          </section>
          <GrowthPanel
            id="search-queries"
            title="Søgefraser og sider"
            description="Forespørgslerne er aggregerede Google-målinger. De kan ikke knyttes til en bestemt besøgende eller en kontakt i indbakken."
          >
            <form
              action="/admin/seo"
              method="get"
              className={styles.filterForm}
              key={`${kind}:${sort}:${query}`}
            >
              <div className={styles.field}>
                <label htmlFor="seo-search">Find i rapporten</label>
                <input
                  id="seo-search"
                  name="q"
                  defaultValue={query}
                  maxLength={200}
                  placeholder="Søgefrase eller sideadresse"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="seo-kind">Vis</label>
                <select id="seo-kind" name="kind" defaultValue={kind} className={styles.input}>
                  <option value="queries">Søgefraser</option>
                  <option value="pages">Sider</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="seo-sort">Sortér efter</label>
                <select id="seo-sort" name="sort" defaultValue={sort} className={styles.input}>
                  <option value="clicks">Flest klik</option>
                  <option value="impressions">Flest visninger</option>
                  <option value="position">Bedste gns. position</option>
                  <option value="ctr">Højeste CTR</option>
                </select>
              </div>
              <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
                Vis rapport
              </button>
              {(query || kind !== "queries" || sort !== "clicks") && (
                <Link href="/admin/seo" prefetch={false} className={styles.textLink}>
                  Nulstil
                </Link>
              )}
            </form>
            <p className={styles.filterNote}>
              {decimal(filtered.length)} af {decimal(allRows.length)} importerede{" "}
              {kind === "queries" ? "søgefraser" : "sider"}. Filtre og sortering ændrer kun
              tabellen; ejendomstallene ovenfor gælder hele rapporten.
            </p>
            {rows.length ? (
              <div
                className={styles.tableScroll}
                tabIndex={0}
                role="region"
                aria-label={
                  kind === "queries"
                    ? "Søgefraser med Google-målinger"
                    : "Sider med Google-målinger"
                }
              >
                <table className={styles.table}>
                  <caption className="sr-only">
                    {kind === "queries" ? "Søgefraser" : "Sider"} · {date(report.dateFrom)}–
                    {date(report.dateTo)} · Pacific-tid
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">{kind === "queries" ? "Søgefrase" : "Side"}</th>
                      <th scope="col" className={styles.numeric}>
                        Klik
                      </th>
                      <th scope="col" className={styles.numeric}>
                        Visninger
                      </th>
                      <th scope="col" className={styles.numeric}>
                        CTR
                      </th>
                      <th scope="col" className={styles.numeric}>
                        Gns. position
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label}>
                        <td>
                          {row.url ? (
                            <a
                              href={row.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.tableLink}
                            >
                              {new URL(row.url).pathname} ↗
                            </a>
                          ) : (
                            <span className="break-words">{row.label}</span>
                          )}
                        </td>
                        <td className={styles.numeric}>{decimal(row.clicks)}</td>
                        <td className={styles.numeric}>{decimal(row.impressions)}</td>
                        <td className={styles.numeric}>{ctr(row)}</td>
                        <td className={styles.numeric}>
                          {row.position === null ? "—" : fraction(row.position)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <GrowthEmpty>
                {query
                  ? "Ingen importerede rækker matcher søgningen. Nulstil eller vælg en anden gruppering."
                  : `Rapporten indeholder ingen ${kind === "queries" ? "synlige søgefraser" : "sider"}. Det siger ikke i sig selv, at der ingen søgetrafik er.`}
              </GrowthEmpty>
            )}
            {pageCount > 1 && (
              <nav
                className={`${styles.panelBody} mt-5 flex flex-wrap items-center justify-between gap-3`}
                aria-label="Søgerapportens sider"
              >
                {page > 1 ? (
                  <Link href={href(page - 1)} prefetch={false} className={styles.button}>
                    ← Forrige
                  </Link>
                ) : (
                  <span />
                )}
                <span className={styles.sectionCopy}>
                  Side {page} af {pageCount} · 20 rækker pr. side
                </span>
                {page < pageCount ? (
                  <Link href={href(page + 1)} prefetch={false} className={styles.button}>
                    Næste →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </GrowthPanel>
          <div className={styles.panelGrid}>
            <GrowthPanel
              title="Hvad tabellen dækker"
              description={
                report.partial
                  ? "Denne rapport er markeret som delvis."
                  : "Synlige rækker er ikke nødvendigvis hele søgebilledet."
              }
            >
              <div className={styles.panelBody}>
                <dl className={styles.coverageList}>
                  <div>
                    <dt>Samlede klik i rapporten</dt>
                    <dd>{report.totals ? decimal(report.totals.clicks) : "—"}</dd>
                  </div>
                  <div>
                    <dt>Klik i synlige søgefraser</dt>
                    <dd>{decimal(visibleQueryClicks)}</dd>
                  </div>
                  <div>
                    <dt>Importerede fraser / sider</dt>
                    <dd>
                      {decimal(report.queries.length)} / {decimal(report.pages.length)}
                    </dd>
                  </div>
                </dl>
                <p className={`${styles.note} mt-6`}>
                  Google skjuler bl.a. sjældne forespørgsler af hensyn til privatliv.
                  Rækkebegrænsning og gruppering kan også skabe forskelle. Differencen er ikke et
                  præcist mål for anonymiserede søgninger. Sidevisninger i Google er ikke
                  markedsvolumen.
                </p>
                <a
                  href="https://support.google.com/webmasters/answer/17011259?hl=da"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.textLink} mt-3`}
                >
                  Googles forklaring på grupperinger ↗
                </a>
              </div>
            </GrowthPanel>
            <GrowthPanel
              title="Næste redaktionelle gennemgang"
              description="Forslag ud fra synlige målinger. Reglerne er arbejdsheuristikker, ikke en SEO-score eller en automatisk ændring."
            >
              <div className={styles.panelBody}>
                <ul className="grid gap-5">
                  {searchReviewSuggestions(report).map((item, index) => (
                    <li key={`${item.title}:${index}`}>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      {item.query && <p className="mt-2 break-words text-sm">“{item.query}”</p>}
                      {item.page && (
                        <a
                          href={item.page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.textLink}
                        >
                          {new URL(item.page).pathname} ↗
                        </a>
                      )}
                      <p className={styles.sectionCopy}>{item.detail}</p>
                    </li>
                  ))}
                </ul>
                <Link href="/admin/indhold" className={`${styles.textLink} mt-5`}>
                  Gennemse eksisterende indhold →
                </Link>
                <p className={styles.sectionCopy}>
                  Tekst og publicering styres i GitHub. Bevar sidens søgeintention og mål ændringer
                  i sammenlignelige perioder.
                </p>
              </div>
            </GrowthPanel>
          </div>
          {report.daily.length > 0 && <DailyReport report={report} />}
        </>
      ) : (
        stored.available && (
          <GrowthPanel
            title="Indlæs den første søgerapport"
            description="Search Console kan være forbundet i en anden tjeneste, uden at denne server har adgang. Der vises ingen prøve- eller gættede trafikdata."
          >
            <GrowthEmpty>
              Importér en rigtig rapport nedenfor. En samlet Kestro JSON-rapport kan indeholde
              ejendomstal, datoer, søgefraser og sider. En officiel CSV-tabel vises med sin egen
              begrænsede dækning.
            </GrowthEmpty>
          </GrowthPanel>
        )
      )}
      <details className={styles.details} id="search-console-import" open={!report}>
        <summary>
          <h2 className="inline text-sm font-semibold">Opdatér eller importér søgerapport</h2>
        </summary>
        <SearchConsoleImport
          dateFrom={report?.dateFrom ?? defaultFrom}
          dateTo={report?.dateTo ?? defaultTo}
          syncConfigured={syncConfigured}
        />
      </details>
      <p className={styles.footerNote}>
        Search Console måler synlighed og klik i Google. Sitets egne besøgstal og samtykkebaserede
        GA4-tal har andre definitioner og kan ikke lægges sammen. Søgetype, datoperiode og datakilde
        følger den importerede rapport.
      </p>
    </div>
  );
}

function DailyReport({ report }: { report: SearchConsoleReport }) {
  const byDate = new Map(report.daily.map((row) => [row.date, row]));
  const length =
    Math.round((Date.parse(report.dateTo) - Date.parse(report.dateFrom)) / 86_400_000) + 1;
  const days = Array.from({ length }, (_, index) => {
    const value = new Date(`${report.dateFrom}T00:00:00Z`);
    value.setUTCDate(value.getUTCDate() + index);
    const day = value.toISOString().slice(0, 10);
    return { date: day, row: byDate.get(day) ?? null };
  });
  const peak = Math.max(...report.daily.map((row) => row.clicks), 1);
  return (
    <GrowthPanel
      title="Klik over tid"
      description="Kun rapporterede dagsrækker er tal. En grå markering betyder, at dagen ikke findes i filen."
    >
      <div className={styles.panelBody}>
        <div className={styles.chart} aria-hidden="true">
          {days.map((day) => (
            <span
              key={day.date}
              title={`${date(day.date)}: ${day.row ? `${day.row.clicks} klik` : "ikke rapporteret"}`}
              className={`${styles.chartBar} ${!day.row || !day.row.clicks ? styles.chartZero : ""}`}
              style={
                day.row?.clicks
                  ? { height: `${Math.max(2, (day.row.clicks / peak) * 100)}%` }
                  : !day.row
                    ? { height: "10px", background: "#6c7c93" }
                    : undefined
              }
            />
          ))}
        </div>
        <div className={styles.chartLabels}>
          <span>{date(report.dateFrom)}</span>
          <span>{date(report.dateTo)}</span>
        </div>
        <details className="mt-5">
          <summary className={styles.textLink}>Vis daglige målinger ↓</summary>
          <div
            className={`${styles.tableScroll} max-h-80`}
            tabIndex={0}
            role="region"
            aria-label="Daglige Google-målinger"
          >
            <table className={styles.table}>
              <caption className="sr-only">Rapporterede datoer i Pacific-tid</caption>
              <thead>
                <tr>
                  <th scope="col">Dato</th>
                  <th scope="col" className={styles.numeric}>
                    Klik
                  </th>
                  <th scope="col" className={styles.numeric}>
                    Visninger
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day.date}>
                    <th scope="row">{date(day.date)}</th>
                    {day.row ? (
                      <>
                        <td className={styles.numeric}>{decimal(day.row.clicks)}</td>
                        <td className={styles.numeric}>{decimal(day.row.impressions)}</td>
                      </>
                    ) : (
                      <td colSpan={2}>Ikke rapporteret</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </GrowthPanel>
  );
}
