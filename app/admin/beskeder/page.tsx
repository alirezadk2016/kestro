import Link from "next/link";

import { EnquiryRow, SectionHead } from "@/components/admin/parts";
import { listEnquiries, dbConfigured, type EnquiryStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

/*
 * The inbox, with the one filter that matters.
 *
 * Archived messages used to be unreachable: the list hid them and there was no
 * way to ask for them, so archiving was indistinguishable from deleting. That
 * is a bad thing to discover after archiving something you needed.
 *
 * The filter is links rather than a control, so each view has its own address
 * that can be bookmarked and reloaded, and it works with no JavaScript at all.
 */
const FILTERS = [
  { key: "", label: "Aktive" },
  { key: "new", label: "Nye" },
  { key: "replied", label: "Besvarede" },
  { key: "archived", label: "Arkiverede" },
] as const;

const isStatus = (value: string): value is EnquiryStatus =>
  value === "new" || value === "read" || value === "replied" || value === "archived";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const requested = searchParams.status ?? "";
  const status = isStatus(requested) ? requested : undefined;
  const enquiries = dbConfigured ? await listEnquiries(status) : [];

  return (
    <div>
      <SectionHead
        title="Beskeder"
        note="Alt der er sendt gennem formularerne på sitet. Svar sendes herfra som e-mail."
      />

      <nav aria-label="Filtrer" className="mt-6 flex flex-wrap gap-1.5">
        {FILTERS.map((filter) => {
          const active = requested === filter.key;
          return (
            <Link
              key={filter.key || "aktive"}
              href={filter.key ? `/admin/beskeder?status=${filter.key}` : "/admin/beskeder"}
              aria-current={active ? "page" : undefined}
              className={`border px-3.5 py-1.5 text-sm transition ${
                active
                  ? "border-brand-400/60 bg-brand-500/15 font-medium text-paper"
                  : "border-white/12 text-paper/60 hover:border-white/25 hover:text-paper"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      {enquiries.length === 0 ? (
        <p className="mt-8 border border-dashed border-white/12 p-10 text-center text-sm leading-6 text-paper/50">
          {requested === "archived"
            ? "Der er ikke arkiveret nogen beskeder."
            : "Ingen beskeder her. De lander i samme øjeblik nogen sender formularen."}
        </p>
      ) : (
        <>
          <p className="mt-8 text-xs uppercase tracking-[0.16em] text-paper/45">
            {enquiries.length} {enquiries.length === 1 ? "besked" : "beskeder"}
          </p>
          <ul className="mt-3 border-y border-white/[0.09]">
            {enquiries.map((enquiry) => (
              <EnquiryRow key={enquiry.id} enquiry={enquiry} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
