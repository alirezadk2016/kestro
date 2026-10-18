import type { ReactElement } from "react";

import { EYEBROW, FIGURE, HAIRLINE } from "@/components/admin/tokens";
import { decimal, flag } from "@/lib/format";
import type { Breakdown } from "@/lib/db";

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
    <div
      className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b pb-4 ${HAIRLINE}`}
    >
      <div>
        {/* A rule under every section heading, so the page has a structure the
            eye can follow at a glance instead of an even stack of blocks. */}
        <h2 className="font-display text-[1.0625rem] font-bold tracking-tight">{title}</h2>
        {note && <p className="mt-1.5 max-w-2xl text-sm leading-[1.6] text-paper/65">{note}</p>}
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
  Icon?: (props: { className?: string }) => ReactElement;
  className?: string;
}) {
  return (
    <div
      className={`group relative bg-brand-950 p-5 transition-colors hover:bg-white/[0.03] ${className}`}
    >
      <div className={`flex items-center gap-2 ${EYEBROW}`}>
        {Icon && <Icon className="h-4 w-4 flex-none text-paper/65" />}
        {label}
      </div>
      <p className={`mt-3.5 text-[2rem] leading-none ${FIGURE}`}>{value}</p>
      {note && <p className="mt-2 text-xs leading-[1.45] text-paper/65">{note}</p>}
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
  totalVisits,
}: {
  title: string;
  rows: (Breakdown & { code?: string })[];
  Icon?: (props: { className?: string }) => ReactElement;
  empty: string;
  withFlags?: boolean;
  totalVisits?: number;
}) {
  const peak = Math.max(...rows.map((row) => row.visits), 1);
  const total = totalVisits ?? rows.reduce((sum, row) => sum + row.visits, 0);

  return (
    <div className="bg-brand-950 p-5">
      <h3 className={`flex items-center gap-2 ${EYEBROW}`}>
        {Icon && <Icon className="h-4 w-4 flex-none text-paper/65" />}
        {title}
      </h3>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm leading-[1.6] text-paper/65">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-0.5">
          {rows.map((row) => (
            <li
              key={row.name}
              className="relative flex items-baseline justify-between gap-3 py-2 pl-2.5 pr-2"
            >
              {/* The bar sits behind the row with a lit left edge, so the
                  ranking is readable as a shape and the label is not printed
                  on top of a hard boundary. */}
              <span
                aria-hidden="true"
                style={{ width: `${(row.visits / peak) * 100}%` }}
                className="absolute inset-y-0 left-0 border-l-2 border-brand-400/60 bg-brand-500/[0.13]"
              />
              <span className="relative min-w-0 truncate text-sm text-paper/85">
                {withFlags && row.code && <span aria-hidden="true">{flag(row.code)} </span>}
                {row.name}
              </span>
              <span className="relative flex-none tabular-nums text-sm text-paper/70">
                {decimal(row.visits)}
                <span className="ml-2 text-xs text-paper/65">
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
