import Link from "next/link";
import LivePanel from "@/components/admin/LivePanel";
import { AdminPageHeader, Figure, Ranked, SectionHead } from "@/components/admin/parts";
import { CARD, INPUT, BUTTON } from "@/components/admin/tokens";
import { liveStats, viewStats } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { countryName, decimal, duration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TrafficPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  await requireAdmin();
  const requested = Number((await searchParams).days);
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  const [visits, views] = await Promise.all([liveStats(days), viewStats(days)]);
  const value = (n: number) => (visits.available ? decimal(n) : "—");
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Kestro · indsigt"
        title="Trafik"
        description="Sitets egne målinger. Et besøg og en sidevisning er forskellige ting."
        actions={
          <form method="get" action="/admin/trafik" className="flex flex-wrap items-end gap-2">
            <div>
              <label htmlFor="traffic-days" className="mb-2 block text-xs text-paper/70">
                Periode
              </label>
              <select id="traffic-days" name="days" defaultValue={days} className={INPUT}>
                {[7, 30, 90].map((n) => (
                  <option key={n} value={n}>
                    Seneste {n} dage
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={BUTTON}>
              Vis periode
            </button>
          </form>
        }
      />
      {(!visits.available || !views.available) && (
        <p
          role="status"
          className="rounded-lg border border-amber-300/25 p-4 text-sm leading-6 text-amber-100"
        >
          En eller flere målinger kunne ikke hentes. Manglende data vises som en streg.{" "}
          <Link
            href="/admin/system"
            className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
          >
            Se systemstatus →
          </Link>
        </p>
      )}
      <section aria-label={`Målinger over ${days} dage`}>
        <dl
          className={`${CARD} grid grid-cols-2 gap-px overflow-hidden bg-white/10 lg:grid-cols-4`}
        >
          <Figure
            label="Besøg"
            value={value(visits.visits30)}
            note={`seneste ${days} dage · inkl. i dag`}
          />
          <Figure
            label="Sidevisninger"
            value={views.available ? decimal(views.last30) : "—"}
            note={`samme ${days} kalenderdage`}
          />
          <Figure
            label="Gns. målt tid"
            value={visits.available && visits.avgBasis > 0 ? duration(visits.avgSeconds) : "—"}
            note={
              visits.available
                ? `på ${decimal(visits.avgBasis)} besøg over 5 sek.`
                : "målinger utilgængelige"
            }
          />
          <Figure
            label="Kun én side"
            value={visits.available && visits.bouncePct !== null ? `${visits.bouncePct} %` : "—"}
            note="andel af besøgene i perioden"
          />
        </dl>
        {views.available && <ViewChart daily={views.daily} days={days} />}
      </section>
      <section aria-label="Kilder og enheder">
        <SectionHead
          title="Hvor besøgene kommer fra"
          note={`Seneste ${days} kalenderdage, inkl. i dag. Kilden registreres ved besøgets start. Procenterne er af alle besøg i perioden.`}
        />
        <div className={`${CARD} mt-4 grid gap-px overflow-hidden bg-white/10 lg:grid-cols-3`}>
          <Ranked
            title="Kilde"
            rows={visits.sources}
            empty={visits.available ? "Ingen kilder i perioden." : "Kunne ikke hente kilder."}
            totalVisits={visits.visits30}
          />
          <Ranked
            title="Land"
            rows={visits.countries.map((row) => ({
              ...row,
              name: countryName(row.name),
              code: row.name,
            }))}
            withFlags
            empty={visits.available ? "Ingen lande i perioden." : "Kunne ikke hente lande."}
            totalVisits={visits.visits30}
          />
          <Ranked
            title="Enhed"
            rows={visits.devices}
            empty={visits.available ? "Ingen enheder i perioden." : "Kunne ikke hente enheder."}
            totalVisits={visits.visits30}
          />
        </div>
      </section>
      <section aria-label="Mest læste sider">
        <SectionHead
          title="Mest læste sider"
          note={`Op til 12 sider, seneste ${days} dage. Andel af alle sidevisninger i perioden.`}
        />
        <div className={`${CARD} mt-4 overflow-hidden`}>
          <Ranked
            title="Side · visninger"
            rows={views.topPages.map((row) => ({ name: row.path, visits: row.views }))}
            totalVisits={views.last30}
            empty={
              views.available
                ? "Ingen sidevisninger i perioden."
                : "Kunne ikke hente sidevisninger."
            }
          />
        </div>
      </section>
      <LivePanel initial={visits} />
      <p className="text-xs leading-6 text-paper/65">
        Perioder følger UTC, også når panelet åbnes i Danmark. Et besøg afsluttes efter 30 minutters
        inaktivitet. Tallene er målinger fra sitet og kan afvige fra eksterne analysetjenester.
      </p>
    </div>
  );
}

function ViewChart({ daily, days }: { daily: { day: string; views: number }[]; days: number }) {
  const byDay = new Map(daily.map((d) => [d.day, d.views]));
  const end = new Date();
  const rows = Array.from({ length: days }, (_, i) => {
    const date = new Date(end);
    date.setUTCDate(date.getUTCDate() - (days - 1 - i));
    const day = date.toISOString().slice(0, 10);
    return { day, views: byDay.get(day) || 0 };
  });
  const peak = Math.max(...rows.map((d) => d.views), 1);
  const label = (day: string) =>
    new Date(`${day}T00:00:00Z`).toLocaleDateString("da-DK", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  return (
    <figure className={`${CARD} mt-4 p-5 sm:p-6`}>
      <figcaption className="text-sm font-semibold">Sidevisninger pr. dag</figcaption>
      <div aria-hidden="true" className="mt-6 flex h-40 items-end gap-px border-b border-white/15">
        {rows.map((row) => (
          <div
            key={row.day}
            title={`${label(row.day)}: ${row.views}`}
            className={
              row.views ? "min-w-0 flex-1 bg-brand-400/80" : "h-px min-w-0 flex-1 bg-white/20"
            }
            style={row.views ? { height: `${(row.views / peak) * 100}%` } : undefined}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs tabular-nums text-paper/70">
        <span>{label(rows[0].day)}</span>
        <span>{label(rows[rows.length - 1].day)}</span>
      </div>
      <details className="mt-4">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium text-brand-200">
          Vis daglige tal ↓
        </summary>
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Daglige sidevisninger, UTC</caption>
            <thead>
              <tr>
                <th className="py-2 font-medium">Dato</th>
                <th className="py-2 text-right font-medium">Visninger</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.day} className="border-t border-white/10">
                  <th scope="row" className="py-2 font-normal text-paper/75">
                    {row.day}
                  </th>
                  <td className="py-2 text-right tabular-nums">{decimal(row.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
