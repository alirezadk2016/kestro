import Link from "next/link";
import { SectionHead } from "@/components/admin/parts";
import { InboxRow } from "@/components/admin/InboxRow";
import { CARD, EYEBROW, FIGURE } from "@/components/admin/tokens";
import {
  InboxIcon,
  ArrowLeftIcon,
  PulseIcon,
  PagesIcon,
  AlertIcon,
} from "@/components/admin/icons";
import { searchEnquiries } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { decimal } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();
  const queue = await searchEnquiries({ status: "active", pageSize: 5 });
  const mailReady = Boolean(process.env.RESEND_API_KEY);
  const pending = queue.counts.new + queue.counts.read;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className={EYEBROW}>Kestro · arbejdsdag</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Oversigt</h1>
          <p className="mt-2 text-sm leading-6 text-paper/70">
            Start med henvendelserne. Følg derefter op på sitet.
          </p>
        </div>
        <Link
          href="/admin/beskeder?status=new"
          className="inline-flex min-h-11 items-center gap-3 rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
        >
          <InboxIcon /> Åbn nye beskeder
        </Link>
      </header>

      {(!queue.available || !mailReady) && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-amber-300/25 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100"
        >
          <AlertIcon className="mt-1 h-4 w-4 shrink-0" />
          <div>
            <p>
              {!queue.available
                ? "Beskedarkivet er ikke tilgængeligt. Visningen kan ikke bruges som en tom indbakke."
                : "Mailafsendelse er ikke konfigureret. Beskeder kan læses, men svar kan ikke sendes herfra."}
            </p>
            <Link
              href="/admin/system"
              className="mt-1 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              Se systemstatus →
            </Link>
          </div>
        </div>
      )}

      <section aria-labelledby="work-title" className={`${CARD} overflow-hidden`}>
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 p-6">
          <div>
            <h2 id="work-title" className="text-lg font-bold">
              Din indbakke
            </h2>
            <p className="mt-1 text-sm text-paper/70">
              Overblik over nye, læste og besvarede henvendelser.
            </p>
          </div>
          <p className={`${FIGURE} text-4xl`}>
            {queue.available ? decimal(pending) : "—"}
            <span className="ml-2 text-sm font-normal tracking-normal text-paper/70">
              afventer svar
            </span>
          </p>
        </div>
        <dl className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { label: "Nye", value: queue.counts.new, href: "/admin/beskeder?status=new" },
            {
              label: "Læst · afventer svar",
              value: queue.counts.read,
              href: "/admin/beskeder?status=read",
            },
            {
              label: "Besvarede",
              value: queue.counts.replied,
              href: "/admin/beskeder?status=replied",
            },
          ].map((item) => (
            <div key={item.label} className="p-5">
              <dt className="text-xs text-paper/70">{item.label}</dt>
              <dd>
                <Link
                  href={item.href}
                  className="mt-1 inline-flex min-h-11 items-center gap-4 text-2xl font-bold tabular-nums hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                >
                  {queue.available ? decimal(item.value) : "—"}
                  <span aria-hidden="true" className="text-base text-paper/65">
                    ↗
                  </span>
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Seneste beskeder">
        <SectionHead
          title="Seneste beskeder"
          aside={
            <Link
              href="/admin/beskeder"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-200 hover:text-paper"
            >
              Alle beskeder <span aria-hidden="true">→</span>
            </Link>
          }
        />
        {!queue.available ? (
          <p className="py-8 text-sm text-paper/70">
            Kontrollér databaseforbindelsen under System.
          </p>
        ) : queue.items.length ? (
          <ul className={`${CARD} mt-4 overflow-hidden`}>
            {queue.items.map((enquiry) => (
              <InboxRow key={enquiry.id} enquiry={enquiry} />
            ))}
          </ul>
        ) : (
          <div className={`${CARD} mt-4 p-8`}>
            <InboxIcon className="h-6 w-6 text-brand-200" />
            <p className="mt-3 font-semibold">Ingen aktive beskeder</p>
            <p className="mt-2 text-sm text-paper/70">
              Nye henvendelser fra sitets formularer vises her.
            </p>
            <Link
              href="/admin/beskeder?status=archived"
              className="mt-3 inline-flex min-h-11 items-center text-sm text-brand-200 underline underline-offset-4"
            >
              Åbn arkivet
            </Link>
          </div>
        )}
      </section>

      <section aria-label="Genveje">
        <SectionHead title="Genveje" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            {
              href: "/admin/trafik",
              title: "Trafik og læsning",
              note: "Se besøg, kilder og læste sider i en valgt periode.",
              Icon: PulseIcon,
            },
            {
              href: "/admin/system",
              title: "System og adgang",
              note: "Kontrollér database, mailopsætning og din session.",
              Icon: PagesIcon,
            },
          ].map(({ href, title, note, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${CARD} group flex items-start gap-4 p-5 transition-colors hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300`}
            >
              <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-200" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-paper/70">{note}</p>
              </div>
              <ArrowLeftIcon className="mt-1 h-4 w-4 shrink-0 rotate-180 text-paper/65 group-hover:text-brand-200" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
