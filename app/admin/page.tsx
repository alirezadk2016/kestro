import Link from "next/link";
import { listEnquiries, viewStats, dbConfigured, type Enquiry } from "@/lib/db";

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
          Opret en Neon-database under Storage i Vercel. Forbindelsen bliver sat som{" "}
          <code className="bg-white/10 px-1.5 py-0.5 text-brand-200">DATABASE_URL</code> automatisk,
          og tabellerne oprettes selv ved første besked.
        </p>
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
 */
function Chart({ daily }: { daily: { day: string; views: number }[] }) {
  const peak = Math.max(...daily.map((d) => d.views), 1);

  return (
    <div className="mt-8">
      <h2 className="text-xs uppercase tracking-[0.14em] text-paper/40">Seneste 30 dage</h2>
      <div className="mt-3 flex h-32 items-end gap-1 border-b border-white/10">
        {daily.map((day) => (
          <div
            key={day.day}
            title={`${day.day}: ${day.views}`}
            style={{ height: `${Math.max((day.views / peak) * 100, 2)}%` }}
            className="min-w-[3px] flex-1 bg-brand-500/60 transition-colors hover:bg-brand-300"
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-paper/35">
        <span>{daily[0]?.day}</span>
        <span>højeste dag: {peak}</span>
        <span>{daily.at(-1)?.day}</span>
      </div>
    </div>
  );
}
