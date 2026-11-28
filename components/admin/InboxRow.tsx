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
export const followUpDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Copenhagen",
  });

/*
 * One enquiry, two lines, 2026-11-21: who and when, then what and its state.
 * It was four lines and about 120px, so 25 messages ran to 3,700px and the
 * list read as a stack of cards rather than an inbox. The message is one line
 * here; all of it is a click away. An unread message carries a dot as well as
 * its "Ny" label, so it is found by shape before it is read.
 */
const CHIP = "rounded-md px-1.5 py-0.5 text-xs font-medium";

export function InboxRow({
  enquiry,
  selectable = false,
}: {
  enquiry: Enquiry;
  selectable?: boolean;
}) {
  const badge = STATUS[enquiry.status];
  const unread = enquiry.status === "new";
  return (
    <li
      className={`border-b border-white/[0.07] last:border-b-0 ${selectable ? "grid grid-cols-[2.75rem_minmax(0,1fr)] items-center" : ""}`}
    >
      {selectable && (
        <label className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-md focus-within:outline focus-within:outline-2 focus-within:outline-brand-300">
          <input
            type="checkbox"
            name="ids"
            value={enquiry.id}
            className="h-4 w-4 accent-brand-400"
          />
          <span className="sr-only">Vælg besked fra {enquiry.name}</span>
        </label>
      )}
      <Link
        href={`/admin/beskeder/${enquiry.id}`}
        prefetch={false}
        className="group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 py-3.5 transition-colors hover:bg-white/[0.035] focus-visible:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-300 sm:py-3"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={`h-2 w-2 flex-none rounded-full ${unread ? "bg-brand-400" : "bg-transparent"}`}
          />
          <span
            className={`min-w-0 max-w-[65%] flex-none truncate group-hover:text-brand-200 ${unread ? "font-semibold text-paper" : "font-medium text-paper/90"}`}
          >
            {enquiry.name}
          </span>
          {enquiry.company && (
            <span className="min-w-0 truncate text-sm text-paper/65">{enquiry.company}</span>
          )}
        </span>
        <time
          dateTime={enquiry.created_at}
          className="justify-self-end whitespace-nowrap text-right text-xs tabular-nums text-paper/65"
        >
          {shortWhen(enquiry.created_at)}
        </time>
        <span className="col-span-2 min-w-0 truncate pl-[1.125rem] text-sm text-paper/70 lg:col-span-1">
          {enquiry.subject && <span className="text-paper/90">{enquiry.subject} </span>}
          {enquiry.message.replace(/\s+/g, " ")}
        </span>
        <span className="col-span-2 flex min-w-0 flex-wrap items-center gap-1.5 pl-[1.125rem] lg:col-span-1 lg:justify-end lg:pl-0">
          <span className={`${CHIP} ${badge.color}`}>{badge.label}</span>
          {enquiry.priority === "high" && (
            <span className={`${CHIP} bg-amber-400/15 text-amber-200`}>Høj prioritet</span>
          )}
          {enquiry.mail_error && (
            <span className={`${CHIP} bg-amber-400/15 text-amber-200`}>Mailkopi fejlede</span>
          )}
          {enquiry.follow_up_on && (
            <span className={`${CHIP} bg-brand-500/10 text-brand-200`}>
              Opfølgning {followUpDate(enquiry.follow_up_on)}
              {enquiry.status === "archived" ? ", i arkiv" : ""}
            </span>
          )}
          <span className="text-xs text-paper/65">{INBOX_SOURCE[enquiry.source] ?? "Kontakt"}</span>
        </span>
      </Link>
    </li>
  );
}
