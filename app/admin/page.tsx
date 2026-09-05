import Link from "next/link";

import LiveRefresh from "@/components/LiveRefresh";
import {
  listEnquiries,
  viewStats,
  liveStats,
  dbConfigured,
  databaseEnvNames,
  envNameSample,
  type Breakdown,
  type Enquiry,
  type LiveStats,
} from "@/lib/db";

export const dynamic = "force-dynamic";

/** Danish short date, in Copenhagen time rather than the server's. */
const when = (iso: string) =>
  new Date(iso).toLocaleString("da-DK", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Copenhagen",
  });

/** Seconds as something a person reads at a glance: 0:47, 3:12, 1:04:30. */
function duration(seconds: number): string {
  if (seconds < 1) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/*
 * A country code as a name, and as a flag.
 *
 * Intl rather than a table of countries maintained by hand: the runtime
 * already ships every name in Danish, and a hand-written list would be both
 * incomplete on the day it was written and wrong a few years later. It is
 * wrapped because a runtime built without full ICU has the class but not the
 * data, and a missing country name should show the code rather than crash the
 * panel.
 */
let names: Intl.DisplayNames | null = null;
try {
  names = new Intl.DisplayNames(["da"], { type: "region" });
} catch {
  names = null;
}

function countryName(code: string): string {
  if (code === "??") return "Ukendt";
  try {
    return names?.of(code) ?? code;
  } catch {
    return code;
  }
}

/** The two letters as the regional-indicator pair that renders as a flag. */
function flag(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(127397 + code.charCodeAt(0), 127397 + code.charCodeAt(1));
}

export default async function AdminHome() {
  const [enquiries, stats, live] = await Promise.all([listEnquiries(), viewStats(), liveStats()]);

  if (!dbConfigured) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold tracking-tight">Ingen database</h1>
        <p className="mt-4 text-sm leading-6 text-paper/65">
          Panelet virker, men der er ingen database at læse fra, så der er hverken beskeder eller
          besøgstal at vise. Formularerne sender stadig e-mail som altid — det er kun arkivet der
          mangler.
        </p>
        <p className="mt-4 text-sm leading-6 text-paper/65">
          Opret databasen under Storage i Vercel og forbind den til dette projekt. Enhver variabel
          der ender på <code className="bg-white/10 px-1.5 py-0.5 text-brand-200">_URL</code> og
          indeholder en Postgres-forbindelse bliver brugt — navnet er lige meget. Tabellerne
          oprettes selv ved første besked.
        </p>

        <Diagnosis />
      </div>
    );
  }

  return (
    <div className="space-y-14">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold tracking-tight">Besøg</h1>
          <LiveRefresh />
        </div>

        <Now live={live} />

        <dl className="mt-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Besøg i dag" value={live.visitsToday.toLocaleString("da-DK")} />
          <Stat label="Besøg / 30 dage" value={live.visits30.toLocaleString("da-DK")} />
          <Stat label="Sidevisninger i alt" value={stats.total.toLocaleString("da-DK")} />
          <Stat
            label="Gns. tid på sitet"
            value={live.avgBasis > 0 ? duration(live.avgSeconds) : "—"}
            note={
              live.avgBasis > 0
                ? `målt på ${live.avgBasis} besøg`
                : "ingen besøg med mere end ét signal endnu"
            }
          />
          <Stat
            label="Læste kun én side"
            value={live.bouncePct === null ? "—" : `${live.bouncePct} %`}
            note={live.bouncePct === null ? "ingen besøg endnu" : "af besøgene på 30 dage"}
          />
        </dl>

        {stats.daily.length > 0 && <Chart daily={stats.daily} />}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold tracking-tight">Hvor de kommer fra</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/55">
          Besøg de seneste 30 dage. Et besøg tælles der, hvor det startede — går man videre inde på
          sitet, bliver kilden ikke overskrevet.
        </p>

        <div className="mt-6 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
          <Ranked title="Kilde" rows={live.sources} empty="Ingen besøg registreret endnu." />
          <Ranked
            title="Land"
            rows={live.countries.map((row) => ({ ...row, name: countryName(row.name) }))}
            flags={live.countries.map((row) => row.name)}
            empty="Intet land registreret endnu."
          />
          <Ranked title="Enhed" rows={live.devices} empty="Ingen enheder registreret endnu." />
        </div>
      </section>

      {stats.topPages.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">Mest læste sider</h2>
          <ul className="mt-5 border-t border-white/10">
            {stats.topPages.map((page) => (
              <li
                key={page.path}
                className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-2.5 text-sm"
              >
                <span className="truncate text-paper/75">{page.path}</span>
                <span className="tabular-nums text-paper/55">
                  {page.views.toLocaleString("da-DK")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold tracking-tight">Beskeder</h2>
          <span className="text-sm text-paper/55">{enquiries.length} i indbakken</span>
        </div>

        {enquiries.length === 0 ? (
          <p className="mt-6 border border-dashed border-white/15 p-8 text-center text-sm text-paper/55">
            Ingen beskeder endnu. De lander her i samme øjeblik nogen sender formularen.
          </p>
        ) : (
          <ul className="mt-6 border-t border-white/10">
            {enquiries.map((enquiry) => (
              <Row key={enquiry.id} enquiry={enquiry} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/**
 * Who is on the site at this moment.
 *
 * The count is a full sentence in a status region rather than a bare number,
 * so a screen reader announces "2 læser sitet lige nu" when it changes instead
 * of reading out "2" with no idea what it belongs to. It never takes focus:
 * this updates itself every fifteen seconds, and stealing focus from whoever
 * is reading the page would be intolerable.
 */
function Now({ live }: { live: LiveStats }) {
  return (
    <div className="mt-6 border border-white/10 bg-gradient-to-br from-brand-900/40 to-transparent">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 pt-6">
        <span
          aria-hidden="true"
          className={
            live.online > 0
              ? "h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.16)] motion-safe:animate-pulse"
              : "h-2.5 w-2.5 rounded-full bg-paper/25"
          }
        />
        <p role="status" aria-atomic="true" className="text-sm text-paper/70">
          <span className="font-display text-4xl font-extrabold tabular-nums text-paper">
            {live.online}
          </span>{" "}
          {live.online === 1 ? "person læser sitet lige nu" : "personer læser sitet lige nu"}
        </p>
      </div>

      {live.reading.length === 0 ? (
        <p className="px-6 pb-6 pt-3 text-sm text-paper/50">
          Der er ingen på sitet i øjeblikket. Listen fylder sig selv, så snart nogen åbner en side.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-white/[0.07] border-t border-white/10">
          {live.reading.map((reader, index) => (
            <li
              key={`${reader.path}-${index}`}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-6 py-3 text-sm"
            >
              <span className="truncate font-medium text-paper/85">{reader.path ?? "—"}</span>
              <span className="text-paper/55">
                {reader.country ? (
                  <>
                    <span aria-hidden="true">{flag(reader.country)} </span>
                    {countryName(reader.country)}
                  </>
                ) : (
                  "Ukendt land"
                )}
              </span>
              <span className="text-paper/45">{reader.device ?? "—"}</span>
              <span className="text-paper/45">via {reader.source}</span>
              <span className="ml-auto tabular-nums text-paper/55">{duration(reader.seconds)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-brand-950 p-5">
      <dt className="text-xs uppercase tracking-[0.14em] text-paper/55">{label}</dt>
      <dd className="mt-2 font-display text-3xl font-extrabold tabular-nums tracking-tight">
        {value}
      </dd>
      {note && <p className="mt-1.5 text-xs leading-5 text-paper/45">{note}</p>}
    </div>
  );
}

/**
 * A ranked breakdown, as bars behind the rows.
 *
 * Sorted descending with the value written on every row, because ranking is
 * the whole insight and a bar whose only label is its own length cannot be
 * read by anyone who cannot see it. The bar is decoration on top of text that
 * already says everything — which is also why it is hidden from the
 * accessibility tree rather than given a label of its own.
 */
function Ranked({
  title,
  rows,
  flags,
  empty,
}: {
  title: string;
  rows: Breakdown[];
  flags?: string[];
  empty: string;
}) {
  const peak = Math.max(...rows.map((row) => row.visits), 1);

  return (
    <div className="bg-brand-950 p-5">
      <h3 className="text-xs uppercase tracking-[0.14em] text-paper/55">{title}</h3>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-paper/45">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-1">
          {rows.map((row, index) => (
            <li key={row.name} className="relative flex items-baseline justify-between gap-3 py-1.5">
              <span
                aria-hidden="true"
                style={{ width: `${(row.visits / peak) * 100}%` }}
                className="absolute inset-y-0 left-0 bg-brand-500/20"
              />
              <span className="relative truncate text-sm text-paper/80">
                {flags?.[index] && <span aria-hidden="true">{flag(flags[index])} </span>}
                {row.name}
              </span>
              <span className="relative tabular-nums text-sm text-paper/60">
                {row.visits.toLocaleString("da-DK")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Row({ enquiry }: { enquiry: Enquiry }) {
  const isNew = enquiry.status === "new";
  return (
    <li className="border-b border-white/[0.08]">
      <Link
        href={`/admin/beskeder/${enquiry.id}`}
        className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4 transition-colors hover:bg-white/[0.04]"
      >
        {/* One dot, and only for what has not been read. A row per status
            colour turns an inbox into a legend to memorise. */}
        <span
          aria-hidden="true"
          className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 ${isNew ? "bg-brand-300" : "bg-transparent"}`}
        />
        <span
          className={`font-semibold transition-colors group-hover:text-brand-300 ${isNew ? "text-paper" : "text-paper/70"}`}
        >
          {enquiry.name}
        </span>
        {enquiry.company && <span className="text-sm text-paper/45">{enquiry.company}</span>}
        {enquiry.status === "replied" && (
          <span className="text-xs uppercase tracking-wider text-brand-300/70">Besvaret</span>
        )}
        <span className="ml-auto text-xs tabular-nums text-paper/35">
          {when(enquiry.created_at)}
        </span>
        <span className="w-full truncate text-sm text-paper/50">{enquiry.message}</span>
      </Link>
    </li>
  );
}

/**
 * Thirty days of views.
 *
 * Bars drawn with div heights rather than a charting library: it is one series
 * of at most thirty numbers, and a dependency for that would cost more in
 * bundle than the whole panel. The scale is written on the tallest bar so the
 * chart is readable without an axis.
 *
 * The window is built here rather than taken from the rows, because a day with
 * no visits has no row — and drawing only the days that exist makes one day of
 * data fill the full width as a solid block, with the same date at both ends.
 * That reads as "traffic every day for a month" when it means the opposite.
 * Thirty slots always, most of them empty at the start.
 */
const WINDOW_DAYS = 30;

/* UTC, to match the database: page_views keys on CURRENT_DATE, and Neon runs
   in UTC. Deriving the window in another zone would offset every bar by one. */
const isoDay = (date: Date) => date.toISOString().slice(0, 10);

const shortDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

function Chart({ daily }: { daily: { day: string; views: number }[] }) {
  const byDay = new Map(daily.map((d) => [d.day, d.views]));

  /* Normally today. The comparison is for the hour where the server has
     rolled over to a new date and the database has not, or the reverse. */
  const latest = daily.at(-1)?.day ?? "";
  const today = isoDay(new Date());
  const end = new Date(`${latest > today ? latest : today}T00:00:00Z`);

  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const date = new Date(end);
    date.setUTCDate(date.getUTCDate() - (WINDOW_DAYS - 1 - i));
    const day = isoDay(date);
    return { day, views: byDay.get(day) ?? 0 };
  });

  const peak = Math.max(...days.map((d) => d.views), 1);

  return (
    <div className="mt-10">
      <h2 className="text-xs uppercase tracking-[0.14em] text-paper/55">
        Sidevisninger, seneste 30 dage
      </h2>
      <div className="mt-3 flex h-32 items-end gap-1 border-b border-white/10">
        {days.map((day) => (
          <div
            key={day.day}
            title={`${shortDay(day.day)}: ${day.views}`}
            style={{ height: day.views > 0 ? `${(day.views / peak) * 100}%` : undefined }}
            /* A day with no visits is a hairline on the axis, not a short bar:
               a bar with a floor height claims traffic that was not there. */
            className={
              day.views > 0
                ? "min-w-[3px] flex-1 bg-brand-500/60 transition-colors hover:bg-brand-300"
                : "h-px min-w-[3px] flex-1 bg-white/15"
            }
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-paper/50">
        <span>{shortDay(days[0].day)}</span>
        <span>højeste dag: {peak}</span>
        <span>{shortDay(days[days.length - 1].day)}</span>
      </div>
    </div>
  );
}

/**
 * What the deployment can actually see.
 *
 * "No database" has two causes that look identical from here — the integration
 * was never connected to this project, or it was connected after the last
 * build and the running deployment predates it — and telling them apart from
 * the outside is guesswork that costs a redeploy per guess. Listing the
 * variable names settles it in one look.
 *
 * Names, never values. A Postgres URL contains the password; this panel is
 * behind a password, not behind a firewall, and the difference matters enough
 * that the value never leaves the server. Nothing here is secret on its own:
 * PGHOST existing is not a credential.
 */
function Diagnosis() {
  const usable = databaseEnvNames();
  const related = envNameSample();

  return (
    <div className="mt-8 border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-xs uppercase tracking-[0.14em] text-paper/55">
        Hvad denne deployment kan se
      </h2>

      {usable.length > 0 ? (
        <p className="mt-3 text-sm leading-6 text-paper/70">
          Der findes en brugbar forbindelse ({usable.join(", ")}), men den var der ikke da processen
          startede. Kør Redeploy uden build-cache, så bygges siden med variablen på plads.
        </p>
      ) : related.length > 0 ? (
        <>
          <p className="mt-3 text-sm leading-6 text-paper/70">
            Ingen af variablerne herunder indeholder en Postgres-forbindelse. Databasen er
            sandsynligvis oprettet, men ikke forbundet til dette projekt — eller denne deployment er
            bygget før den blev det.
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {related.map((name) => (
              <li key={name} className="bg-white/10 px-2 py-1 font-mono text-xs text-paper/60">
                {name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-3 text-sm leading-6 text-paper/70">
          Der er ingen database-variabler overhovedet i dette miljø. Integrationen er ikke forbundet
          til projektet: Vercel → Storage → databasen → Connect to Project → vælg dette projekt, og
          kør derefter Redeploy.
        </p>
      )}
    </div>
  );
}
