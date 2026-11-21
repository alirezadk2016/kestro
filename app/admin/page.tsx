import Link from "next/link";

import { AdminPageHeader, EmptyState } from "@/components/admin/parts";
import { InboxRow } from "@/components/admin/InboxRow";
import { CARD, FIGURE, PRIMARY_BUTTON } from "@/components/admin/tokens";
import { AlertIcon, ClockIcon, InboxIcon } from "@/components/admin/icons";
import {
  adminDatabaseHealth,
  getAcquisitionStats,
  getSearchConsoleReport,
  searchEnquiries,
  searchFollowUps,
} from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { decimal } from "@/lib/format";

export const dynamic = "force-dynamic";

/*
 * The overview, 2026-11-21: what is waiting, then how the site is doing.
 *
 * The right column used to be the menu again: a photograph of the site, three
 * growth links, "Indhold" and "Medier", then "Kontakter" and "System" under
 * "Arbejd videre". Everything in it was one click away in the sidebar, and
 * none of it said anything. It now holds the three things a glance should
 * answer: visits this week, what Google has reported, and whether the
 * machinery works. Each figure comes from the same function its own page
 * uses, so the overview cannot disagree with the page it links to.
 */

const PANEL = `${CARD} overflow-hidden`;
const PANEL_HEAD =
  "flex min-h-14 items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-3";
const PANEL_TITLE = "text-sm font-semibold text-paper";
const PANEL_LINK =
  "inline-flex min-h-11 items-center text-sm font-medium text-brand-200 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300";

const dayLabel = (date: string, today: string) =>
  date === today
    ? "I dag"
    : new Date(`${date}T12:00:00Z`).toLocaleDateString("da-DK", {
        day: "numeric",
        month: "short",
        timeZone: "Europe/Copenhagen",
      });

export default async function AdminHome() {
  await requireAdmin();
  const [queue, followUps, traffic, database, search] = await Promise.all([
    searchEnquiries({ status: "active", pageSize: 6 }),
    searchFollowUps({ scope: "due", pageSize: 5 }),
    getAcquisitionStats({ days: 7 }),
    adminDatabaseHealth(),
    getSearchConsoleReport(),
  ]);
  const mailReady = Boolean(process.env.RESEND_API_KEY);
  const active = queue.counts.new + queue.counts.read + queue.counts.replied;
  const overdue = followUps.available ? followUps.counts.overdue : 0;

  const work = [
    {
      label: "Nye beskeder",
      value: queue.counts.new,
      available: queue.available,
      href: "/admin/beskeder?status=new",
      note: "Ikke åbnet endnu",
    },
    {
      label: "Aktive beskeder",
      value: active,
      available: queue.available,
      href: "/admin/beskeder?status=active",
      note: "Nye, læste og besvarede",
    },
    {
      label: "Til opfølgning",
      value: followUps.counts.due,
      available: followUps.available,
      href: "/admin/opfoelgning?scope=due",
      note: overdue > 0 ? `${decimal(overdue)} forsinkede` : "Til og med i dag",
    },
  ];

  const visits = traffic.totals.visits;
  const before = traffic.previousVisits;
  const change =
    traffic.available && before > 0 ? Math.round(((visits - before) / before) * 100) : null;
  const peak = Math.max(1, ...traffic.daily.map((day) => day.visits));
  const topSources = traffic.sources.slice(0, 3);
  const report = search.available ? search.report : null;
  const reportPeriod = report
    ? `${new Date(`${report.dateFrom}T12:00:00Z`).toLocaleDateString("da-DK", { day: "numeric", month: "short", timeZone: "UTC" })} – ${new Date(`${report.dateTo}T12:00:00Z`).toLocaleDateString("da-DK", { day: "numeric", month: "short", timeZone: "UTC" })}`
    : "";
  const checks = [
    { label: "Database", ok: database === "ready" },
    { label: "Mailafsendelse", ok: mailReady },
    { label: "Google-rapport", ok: Boolean(report) },
  ];
  const problems = checks.filter((check) => !check.ok).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Kestro · arbejdsrum"
        title="Oversigt"
        compactMobile
        description="Det, der venter på svar, og hvordan sitet har det."
        actions={
          <Link
            href="/admin/beskeder?status=new"
            className={PRIMARY_BUTTON}
            aria-label="Åbn nye beskeder"
          >
            <InboxIcon /> <span className="sm:hidden">Nye beskeder</span>
            <span className="hidden sm:inline">Åbn nye beskeder</span>
          </Link>
        }
      />

      {/* The work, as three figures on one surface. The first leads: an
          unopened message is the one thing on this page that costs a
          customer if it waits. */}
      <section aria-label="Arbejdsstatus" className={`${CARD} px-1`}>
        {/* On a phone the three are rows, the figure at the thumb's side;
            from sm they stand side by side. */}
        <dl className="grid divide-y divide-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {work.map((item, index) => (
            <div
              key={item.label}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-3 sm:block sm:px-5 sm:py-5"
            >
              <dt className="col-start-1 row-start-1 text-sm font-medium leading-5 text-paper/80 sm:text-paper/70">
                {item.label}
              </dt>
              <dd className="contents sm:block">
                <Link
                  href={item.href}
                  className={`col-start-2 row-span-2 row-start-1 inline-flex min-h-11 min-w-11 items-center justify-end rounded transition-colors hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 sm:mt-1 sm:justify-start ${index === 0 ? "text-brand-300" : "text-paper"}`}
                >
                  <span
                    className={`${FIGURE} leading-none ${index === 0 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}
                  >
                    {item.available ? decimal(item.value) : "—"}
                  </span>
                </Link>
                <span
                  className={`col-start-1 row-start-2 block text-xs leading-5 sm:mt-1 ${index === 2 && overdue > 0 ? "text-amber-200" : "text-paper/65"}`}
                >
                  {item.note}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid min-w-0 gap-6">
          <section aria-labelledby="recent-title" className={PANEL}>
            <div className={PANEL_HEAD}>
              <h2 id="recent-title" className={PANEL_TITLE}>
                Seneste henvendelser
              </h2>
              <Link href="/admin/beskeder" className={PANEL_LINK}>
                Alle beskeder
              </Link>
            </div>
            {!queue.available ? (
              <div className="p-5">
                <EmptyState
                  headingLevel={3}
                  Icon={AlertIcon}
                  title="Beskeder kunne ikke hentes"
                  description="Forbindelsen til arkivet skal kontrolleres. Dette er ikke en tom indbakke."
                  action={
                    <Link href="/admin/system" className={PANEL_LINK}>
                      Åbn Systemstatus
                    </Link>
                  }
                />
              </div>
            ) : queue.items.length ? (
              <ul>
                {queue.items.map((enquiry) => (
                  <InboxRow key={enquiry.id} enquiry={enquiry} />
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState
                  headingLevel={3}
                  Icon={InboxIcon}
                  title="Ingen aktive beskeder"
                  description="Nye henvendelser vises her. Tidligere beskeder kan findes i arkivet."
                  action={
                    <Link href="/admin/beskeder?status=archived" className={PANEL_LINK}>
                      Åbn arkivet
                    </Link>
                  }
                />
              </div>
            )}
          </section>
          <section aria-label="Planlagt opfølgning" className={PANEL}>
            <div className={PANEL_HEAD}>
              <h2 className={PANEL_TITLE}>Følg op i dag</h2>
              <Link href="/admin/opfoelgning" className={PANEL_LINK}>
                Alle opfølgninger
              </Link>
            </div>
            {!followUps.available ? (
              <div className="p-5">
                <EmptyState
                  headingLevel={3}
                  Icon={ClockIcon}
                  title="Opfølgninger kunne ikke hentes"
                  description="Kontrollér forbindelsen under System, før du vurderer dagens opfølgninger."
                />
              </div>
            ) : followUps.items.length ? (
              <ul>
                {followUps.items.map((enquiry) => {
                  const late = Boolean(
                    enquiry.follow_up_on && enquiry.follow_up_on < followUps.today,
                  );
                  return (
                    <li key={enquiry.id} className="border-b border-white/[0.07] last:border-b-0">
                      <Link
                        href={`/admin/beskeder/${enquiry.id}`}
                        prefetch={false}
                        className="group grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-5 py-3 transition-colors hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-paper group-hover:text-brand-200">
                            {enquiry.name}
                          </span>
                          <span className="block truncate text-xs leading-5 text-paper/65">
                            {enquiry.priority === "high" ? "Høj prioritet, " : ""}
                            {enquiry.company || enquiry.subject || "Henvendelse"}
                          </span>
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium tabular-nums ${late ? "bg-amber-400/15 text-amber-200" : "bg-brand-500/10 text-brand-200"}`}
                        >
                          <time dateTime={enquiry.follow_up_on ?? undefined}>
                            {enquiry.follow_up_on
                              ? dayLabel(enquiry.follow_up_on, followUps.today)
                              : "Ingen dato"}
                          </time>
                          {late && <span className="sr-only">, forsinket</span>}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm leading-6 text-paper/70">
                Intet at følge op i dag.{" "}
                <Link
                  href="/admin/opfoelgning?scope=planned"
                  className="text-brand-200 underline underline-offset-4"
                >
                  Se de kommende
                </Link>
              </p>
            )}
          </section>
        </div>

        <div className="grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-1">
          <section aria-labelledby="visits-title" className={PANEL}>
            <div className={PANEL_HEAD}>
              <h2 id="visits-title" className={PANEL_TITLE}>
                Besøg de seneste 7 dage
              </h2>
              <Link href="/admin/trafik?days=7" className={PANEL_LINK}>
                Trafik
              </Link>
            </div>
            {traffic.available ? (
              <div className="px-5 py-4">
                <div className="flex items-end justify-between gap-4">
                  <p>
                    <span className={`${FIGURE} block text-4xl leading-none`}>
                      {decimal(visits)}
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-paper/65">
                      {change === null
                        ? `${decimal(before)} ugen før`
                        : `${change > 0 ? "+" : ""}${change} % mod ugen før (${decimal(before)})`}
                    </span>
                  </p>
                  {/* Seven days as seven bars: the shape of the week, not a
                      chart to read. The numbers are on the traffic page. */}
                  <span aria-hidden="true" className="flex h-12 items-end gap-1">
                    {traffic.daily.map((day) => (
                      <span
                        key={day.day}
                        style={{ height: `${Math.max(6, (day.visits / peak) * 100)}%` }}
                        className="w-2.5 rounded-sm bg-brand-400/70"
                      />
                    ))}
                  </span>
                </div>
                {topSources.length > 0 && (
                  <ul className="mt-4 grid gap-1.5 border-t border-white/[0.07] pt-3 text-sm">
                    {topSources.map((source) => (
                      <li
                        key={`${source.source}-${source.medium}`}
                        className="flex justify-between gap-3"
                      >
                        <span className="min-w-0 truncate text-paper/80">{source.source}</span>
                        <span className="tabular-nums text-paper/65">{decimal(source.visits)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="px-5 py-6 text-sm leading-6 text-paper/70">
                Besøgstal kunne ikke hentes. Kontrollér databasen under System.
              </p>
            )}
          </section>

          <section aria-labelledby="google-title" className={PANEL}>
            <div className={PANEL_HEAD}>
              <h2 id="google-title" className={PANEL_TITLE}>
                Google
              </h2>
              <Link href="/admin/seo" className={PANEL_LINK}>
                Google &amp; SEO
              </Link>
            </div>
            {report?.totals ? (
              <dl className="grid grid-cols-2 gap-4 px-5 py-4">
                <div>
                  <dt className="text-xs text-paper/65">Klik</dt>
                  <dd className={`${FIGURE} mt-1 text-2xl`}>{decimal(report.totals.clicks)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-paper/65">Visninger</dt>
                  <dd className={`${FIGURE} mt-1 text-2xl`}>
                    {decimal(report.totals.impressions)}
                  </dd>
                </div>
                <p className="col-span-2 text-xs leading-5 text-paper/65">
                  Search Console, {reportPeriod}
                </p>
              </dl>
            ) : (
              <p className="px-5 py-6 text-sm leading-6 text-paper/70">
                {report
                  ? `Rapporten for ${reportPeriod} har ingen samlede tal.`
                  : "Ingen Search Console-rapport er indlæst endnu."}
              </p>
            )}
          </section>

          <section aria-labelledby="system-title" className={PANEL}>
            <div className={PANEL_HEAD}>
              <h2 id="system-title" className={PANEL_TITLE}>
                System
              </h2>
              <Link href="/admin/system" className={PANEL_LINK}>
                Systemstatus
              </Link>
            </div>
            <ul className="grid gap-2 px-5 py-4 text-sm">
              {checks.map((check) => (
                <li key={check.label} className="flex items-center justify-between gap-3">
                  <span className="text-paper/80">{check.label}</span>
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-medium ${check.ok ? "text-emerald-200" : "text-amber-200"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${check.ok ? "bg-emerald-300" : "bg-amber-300"}`}
                    />
                    {check.ok ? "I orden" : "Kræver opsætning"}
                  </span>
                </li>
              ))}
            </ul>
            {problems > 0 && (
              <p className="border-t border-white/[0.07] px-5 py-3 text-xs leading-5 text-amber-100">
                {problems === 1 ? "Ét punkt" : `${problems} punkter`} mangler. Systemstatus
                fortæller, hvad der skal gøres.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
