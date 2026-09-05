import Link from "next/link";

import { decimal, flag } from "@/lib/format";
import type { Breakdown, Enquiry } from "@/lib/db";

/**
 * The panel's shared furniture.
 *
 * One definition of a card, a section heading, a figure and a ranked list, so
 * two pages cannot drift into two slightly different versions of the same
 * thing — which is the specific way an interface built a screen at a time ends
 * up looking assembled rather than designed.
 */

export function SectionHead({
  title,
  note,
  aside,
}: {
  title: string;
  note?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
        {note && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-paper/55">{note}</p>}
      </div>
      {aside}
    </div>
  );
}

/**
 * One figure.
 *
 * The hairline above it is the only ornament, and it earns its place: five of
 * these in a row on one flat surface read as a paragraph of numbers, and a
 * single line at the top of each turns them back into five separate things
 * without adding a box around every one.
 */
export function Figure({
  label,
  value,
  note,
  Icon,
  className = "",
}: {
  label: string;
  value: string;
  note?: string;
  Icon?: (props: { className?: string }) => JSX.Element;
  className?: string;
}) {
  return (
    <div className={`relative bg-brand-950 p-5 ${className}`}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-brand-400/30" />
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-paper/55">
        {Icon && <Icon className="h-4 w-4 flex-none text-paper/40" />}
        {label}
      </div>
      <p className="mt-3 font-display text-[2rem] font-extrabold leading-none tabular-nums tracking-tight">
        {value}
      </p>
      {note && <p className="mt-2 text-xs leading-5 text-paper/45">{note}</p>}
    </div>
  );
}

/**
 * A ranked breakdown, as bars behind the rows.
 *
 * Sorted descending with the value written on every row, because the ranking
 * is the whole insight and a bar whose only label is its own length cannot be
 * read by anyone who cannot see it. The bar is decoration over text that
 * already says everything — which is why it is hidden from the accessibility
 * tree rather than given a label of its own.
 */
export function Ranked({
  title,
  rows,
  Icon,
  empty,
  withFlags = false,
}: {
  title: string;
  rows: (Breakdown & { code?: string })[];
  Icon?: (props: { className?: string }) => JSX.Element;
  empty: string;
  withFlags?: boolean;
}) {
  const peak = Math.max(...rows.map((row) => row.visits), 1);
  const total = rows.reduce((sum, row) => sum + row.visits, 0);

  return (
    <div className="bg-brand-950 p-5">
      <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-paper/55">
        {Icon && <Icon className="h-4 w-4 flex-none text-paper/40" />}
        {title}
      </h3>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-paper/45">{empty}</p>
      ) : (
        <ul className="mt-4">
          {rows.map((row) => (
            <li key={row.name} className="relative flex items-baseline justify-between gap-3 py-2">
              <span
                aria-hidden="true"
                style={{ width: `${(row.visits / peak) * 100}%` }}
                className="absolute inset-y-0.5 left-0 bg-brand-500/[0.18]"
              />
              <span className="relative min-w-0 truncate text-sm text-paper/85">
                {withFlags && row.code && <span aria-hidden="true">{flag(row.code)} </span>}
                {row.name}
              </span>
              <span className="relative flex-none tabular-nums text-sm text-paper/60">
                {decimal(row.visits)}
                <span className="ml-2 text-xs text-paper/35">
                  {total > 0 ? `${Math.round((row.visits / total) * 100)} %` : ""}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Danish short date, in Copenhagen time rather than the server's. */
export const shortWhen = (iso: string) =>
  new Date(iso).toLocaleString("da-DK", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Copenhagen",
  });

const STATUS: Record<Enquiry["status"], { label: string; className: string } | null> = {
  new: { label: "Ny", className: "bg-brand-500/20 text-brand-200" },
  read: null,
  replied: { label: "Besvaret", className: "bg-emerald-400/15 text-emerald-200" },
  archived: { label: "Arkiveret", className: "bg-white/10 text-paper/50" },
};

/**
 * One row of the inbox.
 *
 * The status is a word, not only a colour: "new" and "replied" are the two
 * states worth acting on differently, and a reader who cannot separate a blue
 * dot from a green one would otherwise have no way to tell them apart.
 */
export function EnquiryRow({ enquiry }: { enquiry: Enquiry }) {
  const badge = STATUS[enquiry.status];
  const isNew = enquiry.status === "new";

  return (
    <li className="border-b border-white/[0.07]">
      <Link
        href={`/admin/beskeder/${enquiry.id}`}
        className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-4 py-4 transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:bg-white/[0.06]"
      >
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span
            className={`truncate transition-colors group-hover:text-brand-200 ${
              isNew ? "font-semibold text-paper" : "font-medium text-paper/75"
            }`}
          >
            {enquiry.name}
          </span>
          {enquiry.company && (
            <span className="truncate text-sm text-paper/45">{enquiry.company}</span>
          )}
          {badge && (
            <span
              className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${badge.className}`}
            >
              {badge.label}
            </span>
          )}
        </span>

        <span className="text-right text-xs tabular-nums text-paper/40">
          {shortWhen(enquiry.created_at)}
        </span>

        <span className="col-span-2 line-clamp-2 text-sm leading-6 text-paper/50">
          {enquiry.message}
        </span>
      </Link>
    </li>
  );
}
