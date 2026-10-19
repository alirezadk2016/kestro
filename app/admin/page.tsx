import Link from "next/link";
import Image from "next/image";

import { AdminPageHeader, EmptyState, SectionHead } from "@/components/admin/parts";
import { InboxRow } from "@/components/admin/InboxRow";
import { CARD, EYEBROW, FIGURE, PRIMARY_BUTTON } from "@/components/admin/tokens";
import {
  AlertIcon,
  ClockIcon,
  DeviceIcon,
  ContactsIcon,
  InboxIcon,
  PulseIcon,
} from "@/components/admin/icons";
import { searchEnquiries, searchFollowUps } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { decimal } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();
  const [queue, followUps] = await Promise.all([
    searchEnquiries({ status: "active", pageSize: 5 }),
    searchFollowUps({ scope: "due", pageSize: 4 }),
  ]);
  const mailReady = Boolean(process.env.RESEND_API_KEY);
  const active = queue.counts.new + queue.counts.read + queue.counts.replied;
  const needsSetup = !queue.available || !followUps.available || !mailReady;
  const work = [
    {
      label: "Nye beskeder",
      value: queue.counts.new,
      available: queue.available,
      href: "/admin/beskeder?status=new",
    },
    {
      label: "Aktive beskeder",
      value: active,
      available: queue.available,
      href: "/admin/beskeder?status=active",
    },
    {
      label: "Til opfølgning",
      value: followUps.counts.due,
      available: followUps.available,
      href: "/admin/opfoelgning?scope=due",
    },
  ];

  return (
    <div className="space-y-7 sm:space-y-8">
      <AdminPageHeader
        eyebrow="Kestro · arbejdsrum"
        title="Oversigt"
        compactMobile
        description="Beskeder, opfølgning og dit websted. Start med det næste skridt."
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

      <section
        aria-label="Arbejdsstatus"
        className="rounded-xl bg-paper-dim px-4 py-4 text-ink-900 sm:px-6 sm:py-5"
      >
        <dl className="grid grid-cols-[1.1fr_1fr_1fr] divide-x divide-ink-900/15">
          {work.map((item, index) => (
            <div key={item.label} className={index === 0 ? "pr-3" : "px-3 sm:px-5"}>
              <dt className="text-xs font-medium leading-5 text-ink-600">{item.label}</dt>
              <dd>
                <Link
                  href={item.href}
                  className={`group mt-1 inline-flex min-h-11 min-w-11 items-center gap-3 rounded transition-colors hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${index === 0 ? "text-brand-700" : "text-ink-900"}`}
                >
                  <span
                    className={`${FIGURE} ${index === 0 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-[2.5rem]"}`}
                  >
                    {item.available ? decimal(item.value) : "—"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-lg text-ink-600 group-hover:text-brand-700 sm:inline"
                  >
                    ↗
                  </span>
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid min-w-0 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] 2xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="recent-title" className={`${CARD} overflow-hidden`}>
            <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <h2 id="recent-title" className="text-lg font-bold tracking-tight">
                  Seneste henvendelser
                </h2>
                <p className="mt-1 text-xs leading-5 text-paper/70">
                  De seneste aktive beskeder fra sitets formularer.
                </p>
              </div>
              <Link
                href="/admin/beskeder"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-200 hover:text-paper"
              >
                Alle beskeder{" "}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
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
                    <Link
                      href="/admin/system"
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-200 underline underline-offset-4"
                    >
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
                    <Link
                      href="/admin/beskeder?status=archived"
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-200 underline underline-offset-4"
                    >
                      Åbn arkivet
                    </Link>
                  }
                />
              </div>
            )}
          </section>

          <section aria-label="Planlagt opfølgning">
            <SectionHead
              title="Det skal følges op"
              note="Forfaldne og planlagte opfølgninger til og med i dag."
              aside={
                <Link
                  href="/admin/opfoelgning"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-200 hover:text-paper"
                >
                  Alle opfølgninger{" "}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              }
            />
            {!followUps.available ? (
              <div className="mt-4">
                <EmptyState
                  headingLevel={3}
                  Icon={ClockIcon}
                  title="Opfølgninger kunne ikke hentes"
                  description="Kontrollér forbindelsen under System, før du vurderer dagens opfølgninger."
                />
              </div>
            ) : followUps.items.length ? (
              <ul className="mt-3 grid">
                {followUps.items.map((enquiry) => {
                  const overdue = Boolean(
                    enquiry.follow_up_on && enquiry.follow_up_on < followUps.today,
                  );
                  const date =
                    enquiry.follow_up_on === followUps.today
                      ? "I dag"
                      : enquiry.follow_up_on
                        ? new Date(`${enquiry.follow_up_on}T12:00:00Z`).toLocaleDateString(
                            "da-DK",
                            { day: "numeric", month: "short", timeZone: "Europe/Copenhagen" },
                          )
                        : "Ingen dato";
                  return (
                    <li key={enquiry.id} className="border-b border-white/10 last:border-b-0">
                      <Link
                        href={`/admin/beskeder/${enquiry.id}`}
                        prefetch={false}
                        className="group grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 rounded-lg px-3 py-4 transition-colors hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                      >
                        <span className="min-w-0 break-words text-sm font-semibold text-paper group-hover:text-brand-200 [overflow-wrap:anywhere]">
                          {enquiry.name}
                        </span>
                        <span
                          className={`text-right text-xs font-medium tabular-nums ${overdue ? "text-amber-200" : "text-brand-200"}`}
                        >
                          <time dateTime={enquiry.follow_up_on ?? undefined}>{date}</time>
                          {overdue && <span className="mt-1 block">Forsinket</span>}
                        </span>
                        <span className="min-w-0 break-words text-xs leading-5 text-paper/70 [overflow-wrap:anywhere]">
                          {enquiry.company || enquiry.subject || "Henvendelse"}
                        </span>
                        {enquiry.priority === "high" && (
                          <span className="col-span-2 mt-1 text-xs font-medium text-amber-200">
                            Høj prioritet
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-4">
                <EmptyState
                  headingLevel={3}
                  Icon={ClockIcon}
                  title="Ingen opfølgninger til i dag"
                  description="Der er ingen registrerede opfølgninger, som er forfaldne eller planlagt til i dag."
                  action={
                    <Link
                      href="/admin/opfoelgning"
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-200 underline underline-offset-4"
                    >
                      Se kommende opfølgninger
                    </Link>
                  }
                />
              </div>
            )}
          </section>
        </div>

        <aside aria-label="Værktøjer og dit websted" className="min-w-0 space-y-7">
          {needsSetup && (
            <section
              className="rounded-xl border border-amber-300/25 bg-amber-300/[0.05] p-5"
              aria-labelledby="attention-title"
            >
              <div className="flex items-center gap-2 text-amber-100">
                <AlertIcon />
                <h2 id="attention-title" className="text-sm font-semibold">
                  Kræver opmærksomhed
                </h2>
              </div>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-amber-100">
                {!queue.available && <li>Beskedarkivet kan ikke læses.</li>}
                {!followUps.available && <li>Opfølgninger kunne ikke hentes.</li>}
                {!mailReady && <li>Mailafsendelse mangler opsætning.</li>}
              </ul>
              <Link
                href="/admin/system"
                className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-amber-100 underline underline-offset-4"
              >
                Kontrollér systemet →
              </Link>
            </section>
          )}

          <section
            aria-labelledby="website-title"
            className="overflow-hidden rounded-xl border border-white/[0.07] bg-[var(--admin-inset)]"
          >
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Åbn Kestros offentlige websted i en ny fane"
              className="group block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-300"
            >
              <Image
                src="/cards/cat-laptops.webp"
                alt="Åben bærbar computer på et mørkt skrivebord med udsigt over byen"
                width={1600}
                height={900}
                sizes="(min-width: 1536px) 320px, (min-width: 1280px) 288px, 100vw"
                className="aspect-[16/9] h-auto w-full object-cover"
              />
              <span className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 px-5 py-2 text-xs font-medium text-paper/85 group-hover:text-brand-200">
                Kestro.dk · Offentligt websted
                <span aria-hidden="true">↗</span>
              </span>
            </Link>
            <div className="px-5 pb-3 pt-5">
              <p className={EYEBROW}>Websted</p>
              <h2 id="website-title" className="mt-2 text-lg font-bold tracking-tight">
                Dit indhold. Dit overblik.
              </h2>
            </div>
            <div className="divide-y divide-white/10">
              {[
                {
                  href: "/admin/indhold",
                  title: "Indholdsoverblik",
                  note: "Find sider, guides og sprogversioner.",
                },
                {
                  href: "/admin/medier",
                  title: "Mediebibliotek",
                  note: "Se sitets billeder og deres oplysninger.",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-11 items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-300"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold group-hover:text-brand-200">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-paper/70">{item.note}</span>
                  </span>
                  <span aria-hidden="true" className="text-brand-200">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="shortcuts-title">
            <h2 id="shortcuts-title" className="text-sm font-semibold text-paper/85">
              Arbejd videre
            </h2>
            <ul className="mt-2 grid">
              {[
                {
                  href: "/admin/kontakter",
                  title: "Kontakter",
                  note: "Historik fra henvendelser",
                  Icon: ContactsIcon,
                },
                {
                  href: "/admin/trafik",
                  title: "Trafik og læsning",
                  note: "Besøg, kilder og læste sider",
                  Icon: PulseIcon,
                },
                {
                  href: "/admin/system",
                  title: "System og adgang",
                  note: "Forbindelser og din session",
                  Icon: DeviceIcon,
                },
              ].map(({ href, title, note, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex min-h-11 items-center gap-3 rounded-lg py-3 transition-colors hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                  >
                    <Icon className="ml-2 h-[18px] w-[18px] flex-none text-paper/65 group-hover:text-brand-200" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium group-hover:text-brand-200">
                        {title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-paper/65">{note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
