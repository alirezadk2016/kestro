import Link from "next/link";

import { shortWhen } from "@/components/admin/parts";
import type { Enquiry } from "@/lib/db";

const STATUS: Record<Enquiry["status"], { label: string; color: string }> = {
  new: { label: "Ny", color: "bg-brand-500/20 text-brand-200" },
  read: { label: "Læst", color: "bg-white/10 text-paper/75" },
  replied: { label: "Besvaret", color: "bg-emerald-400/15 text-emerald-200" },
  archived: { label: "Arkiveret", color: "bg-white/10 text-paper/75" },
};

export const INBOX_SOURCE = {
  contact: "Kontakt",
  quote: "Tilbud",
  instagram: "Instagram",
} as const;

/** One full-width target; secondary details remain readable on a narrow phone. */
export function InboxRow({ enquiry }: { enquiry: Enquiry }) {
  const badge = STATUS[enquiry.status];
  return (
    <li className="border-b border-white/[0.08] last:border-b-0">
      <Link
        href={`/admin/beskeder/${enquiry.id}`}
        prefetch={false}
        className={`group grid min-w-0 gap-2 border-l-2 px-4 py-5 transition-colors hover:bg-white/[0.035] focus-visible:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-300 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-5 ${enquiry.status === "new" ? "border-brand-400" : "border-transparent"}`}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={`min-w-0 break-words [overflow-wrap:anywhere] group-hover:text-brand-200 ${enquiry.status === "new" ? "font-semibold text-paper" : "font-medium text-paper/90"}`}
          >
            {enquiry.name}
          </span>
          <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${badge.color}`}>
            {badge.label}
          </span>
          {enquiry.mail_error && (
            <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
              Mailkopi fejlede
            </span>
          )}
        </div>
        <time
          dateTime={enquiry.created_at}
          className="text-xs tabular-nums text-paper/65 sm:text-right"
        >
          {shortWhen(enquiry.created_at)}
        </time>
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-paper/70 sm:col-span-2">
          {enquiry.company && (
            <span className="min-w-0 break-words font-medium text-paper/80 [overflow-wrap:anywhere]">
              {enquiry.company}
            </span>
          )}
          <span>{INBOX_SOURCE[enquiry.source] ?? "Kontakt"}</span>
          {enquiry.subject && (
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">{enquiry.subject}</span>
          )}
        </div>
        <p className="line-clamp-2 break-words text-sm leading-6 text-paper/75 [overflow-wrap:anywhere] sm:col-span-2">
          {enquiry.message}
        </p>
      </Link>
    </li>
  );
}
