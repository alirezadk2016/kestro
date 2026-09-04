import Link from "next/link";
import {
  listEnquiries,
  viewStats,
  dbConfigured,
  databaseEnvNames,
  envNameSample,
  type Enquiry,
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

export default async function AdminHome() {
  const [enquiries, stats] = await Promise.all([listEnquiries(), viewStats()]);

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
    <div className="space-y-12">
      <section>
        <h1 className="font-display text-2xl font-bold tracking-tight">Besøg</h1>
        <p className="mt-2 text-sm text-paper/55">
          Sidevisninger målt af sitet selv. Tæller alle — ikke kun dem der siger ja til statistik.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
          {[
            { label: "I dag", value: stats.today },
            { label: "Seneste 30 dage", value: stats.last30 },
            { label: "I alt", value: stats.total },
          ].map((stat) => (
            <div key={stat.label} className="bg-brand-950 p-5">
              <dt className="text-xs uppercase tracking-[0.14em] text-paper/40">{stat.label}</dt>
              <dd className="mt-2 font-display text-3xl font-extrabold tabular-nums tracking-tight">
                {stat.value.toLocaleString("da-DK")}
              </dd>
            </div>
          ))}
        </dl>

        {stats.daily.length > 0 && <Chart daily={stats.daily} />}

        {stats.topPages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs uppercase tracking-[0.14em] text-paper/40">Mest læste sider</h2>
            <ul className="mt-3 border-t border-white/10">
              {stats.topPages.map((page) => (
                <li
                  key={page.path}
                  className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-2.5 text-sm"
                >
                  <span className="truncate text-paper/75">{page.path}</span>
                  <span className="tabular-nums text-paper/50">{page.views}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold tracking-tight">Beskeder</h2>
          <span className="text-sm text-paper/45">{enquiries.length} i indbakken</span>
        </div>

        {enquiries.length === 0 ? (
          <p className="mt-6 border border-dashed border-white/15 p-8 text-center text-sm text-paper/50">
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
    <div className="mt-8">
      <h2 className="text-xs uppercase tracking-[0.14em] text-paper/40">Seneste 30 dage</h2>
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
      <div className="mt-2 flex justify-between text-xs tabular-nums text-paper/35">
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
      <h2 className="text-xs uppercase tracking-[0.14em] text-paper/40">
        Hvad denne deployment kan se
      </h2>

      {usable.length > 0 ? (
        <p className="mt-3 text-sm leading-6 text-paper/70">
          Der findes en brugbar forbindelse ({usable.join(", ")}), men den var der ikke da
          processen startede. Kør Redeploy uden build-cache, så bygges siden med variablen på
          plads.
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
