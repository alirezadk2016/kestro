import Link from "next/link";

import LivePanel from "@/components/admin/LivePanel";
import { Figure, Ranked, SectionHead, EnquiryRow } from "@/components/admin/parts";
import {
  ClockIcon,
  DeviceIcon,
  ExitIcon,
  GlobeIcon,
  InboxIcon,
  PagesIcon,
  PulseIcon,
} from "@/components/admin/icons";
import {
  listEnquiries,
  viewStats,
  liveStats,
  dbConfigured,
  dbMisconfigured,
  databaseEnvNames,
  envNameSample,
} from "@/lib/db";
import { countryName, decimal, duration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!dbConfigured) return <NoDatabase />;

  const [enquiries, stats, live] = await Promise.all([listEnquiries(), viewStats(), liveStats()]);
  const newest = enquiries.slice(0, 5);

  return (
    <div className="space-y-14">
      <header>
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-tight">Oversigt</h1>
        <p className="mt-1.5 text-sm text-paper/55">
          Trafik og henvendelser på kestro.dk. Tallene er sitets egne.
        </p>
      </header>

      <LivePanel initial={live} />

      <section>
        {/* Two columns or five, and nothing between: three columns leaves the
            fifth figure alone on a row beside an empty cell that reads as a
            missing card. The fifth spans the pair below lg so the grid is
            always full. */}
        <dl className="grid grid-cols-2 gap-px border border-white/[0.09] bg-white/[0.09] lg:grid-cols-5">
          <Figure label="Besøg i dag" value={decimal(live.visitsToday)} Icon={PulseIcon} />
          <Figure label="Besøg / 30 dage" value={decimal(live.visits30)} Icon={PulseIcon} />
          <Figure
            label="Sidevisninger"
            value={decimal(stats.total)}
            note="i alt, siden starten"
            Icon={PagesIcon}
          />
          <Figure
            label="Gns. tid"
            value={live.avgBasis > 0 ? duration(live.avgSeconds) : "—"}
            note={
              live.avgBasis > 0
                ? `målt på ${live.avgBasis} besøg over 5 sek.`
                : "ingen besøg med målbar længde endnu"
            }
            Icon={ClockIcon}
          />
          <Figure
            label="Kun én side"
            value={live.bouncePct === null ? "—" : `${live.bouncePct} %`}
            note={live.bouncePct === null ? "ingen besøg endnu" : "af besøgene på 30 dage"}
            Icon={ExitIcon}
            className="col-span-2 lg:col-span-1"
          />
        </dl>

        {stats.daily.length > 0 && <Chart daily={stats.daily} />}
      </section>

      <section>
        <SectionHead
          title="Hvor de kommer fra"
          note="Besøg de seneste 30 dage. Et besøg tælles der, hvor det startede — går man videre inde på sitet, bliver kilden ikke skrevet om."
        />
        <div className="mt-6 grid gap-px border border-white/[0.09] bg-white/[0.09] lg:grid-cols-3">
          <Ranked
            title="Kilde"
            rows={live.sources}
            Icon={PulseIcon}
            empty="Ingen besøg registreret endnu."
          />
          <Ranked
            title="Land"
            rows={live.countries.map((row) => ({
              name: countryName(row.name),
              visits: row.visits,
              code: row.name,
            }))}
            Icon={GlobeIcon}
            withFlags
            empty="Intet land registreret endnu."
          />
          <Ranked
            title="Enhed"
            rows={live.devices}
            Icon={DeviceIcon}
            empty="Ingen enheder registreret endnu."
          />
        </div>
      </section>

      {stats.topPages.length > 0 && (
        <section>
          <SectionHead title="Mest læste sider" />
          <Ranked
            title="Sidevisninger i alt"
            rows={stats.topPages.map((page) => ({ name: page.path, visits: page.views }))}
            empty=""
          />
        </section>
      )}

      <section>
        <SectionHead
          title="Seneste beskeder"
          aside={
            <Link
              href="/admin/beskeder"
              className="inline-flex items-center gap-2 border border-white/12 px-3.5 py-2 text-sm text-paper/70 transition hover:border-white/25 hover:text-paper"
            >
              <InboxIcon className="h-4 w-4" />
              Alle beskeder
            </Link>
          }
        />

        {newest.length === 0 ? (
          <p className="mt-6 border border-dashed border-white/12 p-10 text-center text-sm leading-6 text-paper/50">
            Ingen beskeder endnu. De lander her i samme øjeblik nogen sender formularen.
          </p>
        ) : (
          <ul className="mt-6 border-y border-white/[0.09]">
            {newest.map((enquiry) => (
              <EnquiryRow key={enquiry.id} enquiry={enquiry} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/**
 * Thirty days of views.
 *
 * Bars drawn with div heights rather than a charting library: one series of at
 * most thirty numbers, and a dependency for that would cost more in bundle
 * than the whole panel.
 *
 * The window is built here rather than taken from the rows, because a day with
 * no visits has no row — and drawing only the days that exist makes one day of
 * data fill the full width as a solid block with the same date at both ends.
 * That reads as a month of steady traffic and means the opposite. Thirty slots
 * always, most of them empty at the start.
 */
const WINDOW_DAYS = 30;

/* UTC, to match the database: page_views keys on CURRENT_DATE and Neon runs in
   UTC. Deriving the window in another zone would offset every bar by one. */
const isoDay = (date: Date) => date.toISOString().slice(0, 10);

const shortDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

function Chart({ daily }: { daily: { day: string; views: number }[] }) {
  const byDay = new Map(daily.map((d) => [d.day, d.views]));

  /* Normally today. The comparison is for the hour where the server has rolled
     over to a new date and the database has not, or the reverse. */
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
    <figure className="mt-10 border border-white/[0.09] p-6">
      <figcaption className="text-[11px] uppercase tracking-[0.16em] text-paper/55">
        Sidevisninger pr. dag, seneste 30 dage
      </figcaption>
      <div className="mt-5 flex h-36 items-end gap-[3px] border-b border-white/12">
        {days.map((day) => (
          <div
            key={day.day}
            title={`${shortDay(day.day)}: ${day.views}`}
            style={{ height: day.views > 0 ? `${(day.views / peak) * 100}%` : undefined }}
            /* A day with no visits is a hairline on the axis, not a short bar:
               a bar with a floor height claims traffic that was not there. */
            className={
              day.views > 0
                ? "min-w-[3px] flex-1 bg-gradient-to-t from-brand-600/70 to-brand-400/90 transition-colors hover:from-brand-400 hover:to-brand-300"
                : "h-px min-w-[3px] flex-1 bg-white/12"
            }
          />
        ))}
      </div>
      <div className="mt-2.5 flex justify-between text-xs tabular-nums text-paper/45">
        <span>{shortDay(days[0].day)}</span>
        <span>højeste dag: {peak}</span>
        <span>{shortDay(days[days.length - 1].day)}</span>
      </div>
    </figure>
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
function NoDatabase() {
  const usable = databaseEnvNames();
  const related = envNameSample();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-[1.75rem] font-extrabold tracking-tight">Ingen database</h1>
      <p className="mt-4 text-sm leading-6 text-paper/65">
        Panelet virker, men der er ingen database at læse fra, så der er hverken beskeder eller
        besøgstal at vise. Formularerne sender stadig e-mail som altid — det er kun arkivet der
        mangler.
      </p>
      <p className="mt-4 text-sm leading-6 text-paper/65">
        Opret databasen under Storage i Vercel og forbind den til dette projekt. Enhver variabel der
        ender på <code className="bg-white/10 px-1.5 py-0.5 text-brand-200">_URL</code> og
        indeholder en Postgres-forbindelse bliver brugt — navnet er lige meget. Tabellerne oprettes
        selv ved første besked.
      </p>

      <div className="mt-8 border border-white/[0.09] bg-white/[0.03] p-5">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-paper/55">
          Hvad denne deployment kan se
        </h2>

        {dbMisconfigured ? (
          <p className="mt-3 text-sm leading-6 text-paper/70">
            Der er sat en forbindelse, men den kunne ikke bruges — strengen har ikke den form
            driveren kræver (
            <code className="bg-white/10 px-1 py-0.5 text-brand-200">
              postgresql://bruger:kode@vært/database
            </code>
            ). Ret variablen i Vercel og kør Redeploy. Resten af sitet kører videre imens;
            formularerne sender stadig e-mail.
          </p>
        ) : usable.length > 0 ? (
          <p className="mt-3 text-sm leading-6 text-paper/70">
            Der findes en brugbar forbindelse ({usable.join(", ")}), men den var der ikke da
            processen startede. Kør Redeploy uden build-cache, så bygges siden med variablen på
            plads.
          </p>
        ) : related.length > 0 ? (
          <>
            <p className="mt-3 text-sm leading-6 text-paper/70">
              Ingen af variablerne herunder indeholder en Postgres-forbindelse. Databasen er
              sandsynligvis oprettet, men ikke forbundet til dette projekt — eller denne deployment
              er bygget før den blev det.
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
            Der er ingen database-variabler overhovedet i dette miljø. Integrationen er ikke
            forbundet til projektet: Vercel → Storage → databasen → Connect to Project → vælg dette
            projekt, og kør derefter Redeploy.
          </p>
        )}
      </div>
    </div>
  );
}
