import Link from "next/link";
import LivePanel from "@/components/admin/LivePanel";
import {
  GrowthEmpty,
  GrowthHeader,
  GrowthNav,
  GrowthPanel,
  channelLabel,
  growthPercent,
} from "@/components/admin/GrowthParts";
import styles from "@/components/admin/growth.module.css";
import { requireAdmin } from "@/lib/admin-auth";
import { contentEntries, publicContentPath } from "@/lib/admin-catalogue";
import { getAcquisitionStats, liveStats, viewStats } from "@/lib/db";
import { countryName, decimal, duration } from "@/lib/format";
import type { AcquisitionFilters, AcquisitionStats } from "@/lib/insights-types";

export const dynamic = "force-dynamic";
type Query = { days?: string; source?: string; channel?: string; campaign?: string };

function reportUrl(filters: AcquisitionFilters, change: Partial<AcquisitionFilters> = {}) {
  const next = { ...filters, ...change };
  const query = new URLSearchParams({ days: String(next.days) });
  for (const key of ["source", "channel", "campaign"] as const)
    if (next[key]) query.set(key, next[key]!);
  return `/admin/trafik?${query}`;
}

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

export default async function TrafficPage({ searchParams }: { searchParams: Promise<Query> }) {
  await requireAdmin();
  const params = await searchParams;
  const requested = Number(params.days);
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  const [report, visits, views] = await Promise.all([
    getAcquisitionStats({
      days,
      source: typeof params.source === "string" ? params.source.slice(0, 253) : undefined,
      channel: typeof params.channel === "string" ? params.channel.slice(0, 40) : undefined,
      campaign: typeof params.campaign === "string" ? params.campaign.slice(0, 80) : undefined,
    }),
    liveStats(days),
    viewStats(days),
  ]);
  const filters = { days, ...report.filters };
  const filtered = Boolean(filters.source || filters.channel || filters.campaign);
  const total = report.totals.visits;
  const display = (value: number) => (report.available ? decimal(value) : "—");
  const exportHref = reportUrl(filters).replace("/admin/trafik", "/api/admin/acquisition-export");

  return (
    <div className={styles.workspace}>
      <GrowthHeader
        title="Trafik"
        description="Se, hvor Kestro bliver fundet — fra første kilde til den side, besøget starter på."
      />
      <GrowthNav active="traffic" />
      <div className={styles.paper}>
        <div className={styles.reportTop}>
          <div className={styles.reportMeta}>
            <p className={styles.reportKicker}>Besøgenes oprindelse</p>
            <p>
              {shortDate(report.range.from)} – {shortDate(report.range.to)} · UTC
            </p>
          </div>
          <dl className={styles.metricStrip}>
            <div className={`${styles.metric} ${styles.metricLead}`}>
              <dt>{filtered ? "Besøg i udvalget" : "Besøg"}</dt>
              <dd>{display(total)}</dd>
            </div>
            <div className={styles.metric}>
              <dt>Registreret kilde</dt>
              <dd>{report.available ? growthPercent(report.totals.attributed, total) : "—"}</dd>
            </div>
            <div className={styles.metric}>
              <dt>Forrige {days} dage</dt>
              <dd>{display(report.previousVisits)}</dd>
            </div>
          </dl>
          <p className={styles.metricNote}>
            {filtered
              ? `${display(total)} af ${display(report.allVisits)} registrerede besøg. Samme filtre i begge perioder.`
              : "Sessioner, ikke unikke personer. I dag er med."}
          </p>
        </div>
        <form
          key={`${days}-${filters.source}-${filters.channel}-${filters.campaign}`}
          method="get"
          action="/admin/trafik"
          className={styles.filterForm}
        >
          <div className={styles.field}>
            <label htmlFor="traffic-days">Periode</label>
            <select id="traffic-days" name="days" defaultValue={days} className={styles.input}>
              {[7, 30, 90].map((value) => (
                <option key={value} value={value}>
                  Seneste {value} dage
                </option>
              ))}
            </select>
          </div>
          <details className={styles.filterDetails} open={filtered || undefined}>
            <summary>Filtrér kilder{filtered ? " · aktivt udvalg" : ""}</summary>
            <div className={styles.filterFields}>
              <div className={styles.field}>
                <label htmlFor="traffic-source">Kilde</label>
                <select
                  id="traffic-source"
                  name="source"
                  defaultValue={filters.source}
                  className={styles.input}
                >
                  <option value="">Alle kilder</option>
                  {filters.source && !report.options.sources.includes(filters.source) && (
                    <option value={filters.source}>{filters.source} · valgt filter</option>
                  )}
                  {report.options.sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="traffic-channel">Kanal</label>
                <select
                  id="traffic-channel"
                  name="channel"
                  defaultValue={filters.channel}
                  className={styles.input}
                >
                  <option value="">Alle kanaler</option>
                  {filters.channel && !report.options.channels.includes(filters.channel) && (
                    <option value={filters.channel}>
                      {channelLabel(filters.channel)} · valgt filter
                    </option>
                  )}
                  {report.options.channels.map((channel) => (
                    <option key={channel} value={channel}>
                      {channelLabel(channel)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="traffic-campaign">Kampagne</label>
                <select
                  id="traffic-campaign"
                  name="campaign"
                  defaultValue={filters.campaign}
                  className={styles.input}
                >
                  <option value="">Alle kampagner</option>
                  {filters.campaign && !report.options.campaigns.includes(filters.campaign) && (
                    <option value={filters.campaign}>{filters.campaign} · valgt filter</option>
                  )}
                  {report.options.campaigns.map((campaign) => (
                    <option key={campaign} value={campaign}>
                      {campaign}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </details>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
            Vis periode
          </button>
          {filtered && (
            <Link href={`/admin/trafik?days=${days}`} className={styles.textLink}>
              Nulstil filtre
            </Link>
          )}
          {report.available && (
            <a href={exportHref} download className={styles.textLink}>
              Eksportér CSV
            </a>
          )}
        </form>
        {!report.available && (
          <p role="status" className={styles.notice}>
            Trafikkilder kunne ikke hentes. Manglende målinger vises som en streg.{" "}
            <Link href="/admin/system" className={styles.textLink}>
              Se systemstatus
            </Link>
          </p>
        )}
        <div className={styles.reportGrid}>
          <section className={styles.primaryReport} aria-labelledby="sources-title">
            <div className={styles.tableHead}>
              <h2 id="sources-title" className={styles.sectionHeading}>
                Hvor bliver du fundet?
              </h2>
              <p className={styles.sectionCopy}>
                Vælg en kilde for at se dens kampagner og indgangssider.
              </p>
            </div>
            {!report.available ? (
              <GrowthEmpty>Kilder er midlertidigt utilgængelige.</GrowthEmpty>
            ) : !report.sources.length ? (
              <GrowthEmpty>
                Ingen registrerede besøg i dette udvalg. Prøv en anden periode eller nulstil
                filtrene.
              </GrowthEmpty>
            ) : (
              <div
                className={styles.tableScroll}
                role="region"
                tabIndex={0}
                aria-label="Trafikkilder, rul vandret ved behov"
              >
                <table className={styles.table}>
                  <caption className="sr-only">
                    Trafikkilder med antal besøg og andel af det valgte udvalg
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Kilde · dokumentation</th>
                      <th scope="col" className={styles.numeric}>
                        Besøg
                      </th>
                      <th scope="col" className={styles.numeric}>
                        Andel
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.sources.map((row) => (
                      <tr key={`${row.source}-${row.channel}-${row.medium}`}>
                        <td>
                          <Link
                            href={reportUrl(filters, { source: row.source })}
                            className={styles.tableLink}
                          >
                            {row.source === "Direkte" ? "Direkte (historisk)" : row.source}
                          </Link>
                          <small>
                            {channelLabel(row.channel)}
                            {row.medium ? ` · ${row.medium}` : ""}
                          </small>
                          <div className={styles.evidence}>
                            {row.tagged > 0 && (
                              <span className={styles.badge}>UTM · {decimal(row.tagged)}</span>
                            )}
                            {row.referred > 0 && (
                              <span className={styles.badge}>
                                Henviser · {decimal(row.referred)}
                              </span>
                            )}
                            {row.legacy > 0 && (
                              <span className={styles.badge}>
                                Historisk · {decimal(row.legacy)}
                              </span>
                            )}
                            {row.tagged + row.referred + row.legacy === 0 && (
                              <span className={styles.badge}>Uden kildesignal</span>
                            )}
                          </div>
                        </td>
                        <td className={styles.numeric}>{decimal(row.visits)}</td>
                        <td className={styles.numeric}>{growthPercent(row.visits, total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {report.available && report.otherSourceVisits > 0 && (
              <p className={styles.filterNote}>
                {decimal(report.otherSourceVisits)} besøg fra øvrige kilder er med i totalen.
                Eksporten viser det valgte udvalg.
              </p>
            )}
          </section>
          <aside className={styles.coverage} aria-labelledby="coverage-title">
            <h2 id="coverage-title" className={styles.sectionHeading}>
              Hvor sikkert ved vi det?
            </h2>
            <p className={styles.sectionCopy}>
              Et registreret kildesignal fortæller mere end et gæt.
            </p>
            <p className={styles.coverageTotal}>
              {report.available ? growthPercent(report.totals.attributed, total) : "—"}
            </p>
            <p className={styles.metricNote}>med en navngiven kilde, inklusive historiske labels</p>
            {report.available && total > 0 && (
              <div className={styles.coverageBar} aria-hidden="true">
                <span
                  className={styles.knownSegment}
                  style={{ width: `${(report.totals.attributed / total) * 100}%` }}
                />
              </div>
            )}
            <dl className={styles.coverageList}>
              <div>
                <dt>Registreret kilde</dt>
                <dd>{display(report.totals.attributed)}</dd>
              </div>
              <div>
                <dt>Direkte / ukendt</dt>
                <dd>{display(report.totals.unknown)}</dd>
              </div>
              <div>
                <dt>Heraf historiske besøg*</dt>
                <dd>{display(report.totals.legacy)}</dd>
              </div>
            </dl>
            <p className={styles.metricNote}>
              *Historiske besøg indgår i tallene ovenfor. Kildemetoden blev ikke gemt dengang.
            </p>
            <p className={`${styles.note} mt-6`}>
              Manglende henviser kan være en app, en privat deling eller en indtastet adresse.
              Instagram alene beviser ikke Explore, story eller profil.
            </p>
            <Link href="/admin/kampagner" className={styles.textLink}>
              Mærk dine næste links →
            </Link>
          </aside>
        </div>
        <p className={styles.filterNote}>
          Kilde gemmes ved besøgets start. UTM er linkets eget mærke; henviser er browserens
          kildesignal. Historiske labels har ikke denne opdeling.
        </p>
      </div>

      <div className={styles.panelGrid}>
        <GrowthPanel
          title="Indgangssider"
          description="Her starter besøgene i det valgte udvalg. Andele er af samme besøgstal som ovenfor."
        >
          {!report.available || !report.landingPages.length ? (
            <GrowthEmpty>
              {report.available
                ? "Ingen indgangssider i udvalget."
                : "Indgangssider kunne ikke hentes."}
            </GrowthEmpty>
          ) : (
            <div
              className={styles.tableScroll}
              role="region"
              tabIndex={0}
              aria-label="Indgangssider, rul vandret ved behov"
            >
              <table className={styles.table}>
                <caption className="sr-only">Indgangssider i udvalget</caption>
                <thead>
                  <tr>
                    <th scope="col">Side</th>
                    <th scope="col" className={styles.numeric}>
                      Besøg
                    </th>
                    <th scope="col" className={styles.numeric}>
                      Andel
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.landingPages.map((row) => {
                    const entry = contentEntries.find(
                      (entry) =>
                        publicContentPath(entry, "da") === row.path ||
                        publicContentPath(entry, "en") === row.path,
                    );
                    return (
                      <tr key={row.path}>
                        <td>
                          {/^\/[a-z0-9/-]*$/i.test(row.path) &&
                          !row.path.includes("//") &&
                          !/^\/(admin|api)(\/|$)/i.test(row.path) ? (
                            <a
                              href={row.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.tableLink}
                            >
                              {row.path}
                            </a>
                          ) : (
                            <span>{row.path}</span>
                          )}
                          {entry && (
                            <small>
                              <Link
                                href={`/admin/indhold/${entry.slug}`}
                                className={styles.textLink}
                              >
                                Gennemse indhold →
                              </Link>
                            </small>
                          )}
                        </td>
                        <td className={styles.numeric}>{decimal(row.visits)}</td>
                        <td className={styles.numeric}>{growthPercent(row.visits, total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GrowthPanel>
        <GrowthPanel
          title="Kampagner & placeringer"
          description="Mærker fra dine links. En placering er det navn, linkets afsender har valgt."
        >
          {!report.available || !report.campaigns.length ? (
            <GrowthEmpty>
              {report.available ? (
                <>
                  Ingen kampagnemærker i dette udvalg.{" "}
                  <Link href="/admin/kampagner" className={styles.textLink}>
                    Opret et mærket link →
                  </Link>
                </>
              ) : (
                "Kampagner kunne ikke hentes."
              )}
            </GrowthEmpty>
          ) : (
            <div
              className={styles.tableScroll}
              role="region"
              tabIndex={0}
              aria-label="Kampagner, rul vandret ved behov"
            >
              <table className={styles.table}>
                <caption className="sr-only">Registrerede kampagner og placeringer</caption>
                <thead>
                  <tr>
                    <th scope="col">Kampagne</th>
                    <th scope="col">Kilde · placering</th>
                    <th scope="col" className={styles.numeric}>
                      Besøg
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.campaigns.map((row, i) => (
                    <tr key={`${row.source}-${row.campaign}-${row.content}-${i}`}>
                      <td>
                        <Link
                          href={reportUrl(filters, { campaign: row.campaign })}
                          className={styles.tableLink}
                        >
                          {row.campaign}
                        </Link>
                      </td>
                      <td>
                        {row.source}
                        <small>
                          {row.medium ?? "Medie ikke oplyst"}
                          {row.content ? ` · ${row.content}` : ""}
                        </small>
                      </td>
                      <td className={styles.numeric}>{decimal(row.visits)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GrowthPanel>
      </div>
      <DailyChart report={report} />
      <details className={styles.details}>
        <summary>Enheder, lande & øvrige målinger</summary>
        <p className={`${styles.sectionCopy} px-5 pb-5`}>
          Disse målinger gælder alle besøg i de seneste {days} dage. Kilde- og kampagnefiltre gælder
          ikke denne del.
        </p>
        <div className={styles.secondaryGrid}>
          <section>
            <h2 className={styles.sectionHeading}>Enheder</h2>
            <Breakdown rows={visits.devices} available={visits.available} />
          </section>
          <section>
            <h2 className={styles.sectionHeading}>Lande</h2>
            <Breakdown
              rows={visits.countries.map((row) => ({ ...row, name: countryName(row.name) }))}
              available={visits.available}
            />
          </section>
          <section>
            <h2 className={styles.sectionHeading}>Øvrige målinger</h2>
            <dl className={styles.coverageList}>
              <div>
                <dt>Sidevisninger</dt>
                <dd>{views.available ? decimal(views.last30) : "—"}</dd>
              </div>
              <div>
                <dt>Gns. målt tid</dt>
                <dd>
                  {visits.available && visits.avgBasis > 0 ? duration(visits.avgSeconds) : "—"}
                </dd>
              </div>
              <div>
                <dt>Kun én side</dt>
                <dd>
                  {visits.available && visits.bouncePct !== null ? `${visits.bouncePct} %` : "—"}
                </dd>
              </div>
            </dl>
            <p className={styles.sectionCopy}>
              Målt tid bygger på {visits.available ? decimal(visits.avgBasis) : "—"} besøg over fem
              sekunder. Sidevisninger er ikke det samme som besøg.
            </p>
          </section>
        </div>
      </details>
      <details className={styles.details}>
        <summary>På sitet lige nu</summary>
        <div className={styles.secondaryDark}>
          <LivePanel initial={visits} />
        </div>
      </details>
      <p className={styles.footerNote}>
        Perioder følger UTC og inkluderer i dag. Et nyt besøg begynder efter 30 minutters
        inaktivitet. Sammenligningen viser den foregående periode med samme antal kalenderdage; i
        dag er endnu ikke afsluttet. Besøgsmålingen kan afvige fra samtykkebaserede
        analysetjenester.
      </p>
    </div>
  );
}

function Breakdown({
  rows,
  available,
}: {
  rows: { name: string; visits: number }[];
  available: boolean;
}) {
  if (!available || !rows.length)
    return (
      <p className={styles.sectionCopy}>
        {available ? "Ingen målinger i perioden." : "Målinger kunne ikke hentes."}
      </p>
    );
  return (
    <ul className={styles.compactList}>
      {rows.map((row) => (
        <li key={row.name}>
          <span>{row.name}</span>
          <strong>{decimal(row.visits)}</strong>
        </li>
      ))}
    </ul>
  );
}

function DailyChart({ report }: { report: AcquisitionStats }) {
  const peak = Math.max(1, ...report.daily.map((row) => row.visits));
  return (
    <GrowthPanel
      title="Besøg over tid"
      description="Udviklingen i det samme udvalg. Dagens søjle er foreløbig."
    >
      {!report.available || !report.daily.length ? (
        <GrowthEmpty>
          {report.available
            ? "Ingen daglige målinger i udvalget."
            : "Daglige målinger kunne ikke hentes."}
        </GrowthEmpty>
      ) : (
        <div className={styles.panelBody}>
          <div className={styles.chart} aria-hidden="true">
            {report.daily.map((row) => (
              <div
                key={row.day}
                title={`${shortDate(row.day)}: ${decimal(row.visits)}`}
                className={`${styles.chartBar} ${row.visits ? "" : styles.chartZero}`}
                style={row.visits ? { height: `${(row.visits / peak) * 100}%` } : undefined}
              />
            ))}
          </div>
          <div className={styles.chartLabels}>
            <span>{shortDate(report.range.from)}</span>
            <span>{shortDate(report.range.to)}</span>
          </div>
          <details className={styles.dailyDetails}>
            <summary>Vis daglige tal</summary>
            <div
              className={styles.tableScroll}
              role="region"
              tabIndex={0}
              aria-label="Daglige besøg, rul vandret ved behov"
            >
              <table className={styles.table}>
                <caption className="sr-only">Daglige besøg, UTC</caption>
                <thead>
                  <tr>
                    <th scope="col">Dato</th>
                    <th scope="col" className={styles.numeric}>
                      Besøg
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.daily.map((row) => (
                    <tr key={row.day}>
                      <th scope="row">{shortDate(row.day)}</th>
                      <td className={styles.numeric}>{decimal(row.visits)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </GrowthPanel>
  );
}
