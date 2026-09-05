"use client";

import { useEffect, useState } from "react";

import { CARD, EYEBROW, FIGURE } from "@/components/admin/tokens";
import type { LiveStats } from "@/lib/db";
import { countryName, duration, flag } from "@/lib/format";

/** Often enough that "right now" is true; rarely enough that an open panel is
    not a standing load on a database that bills for being awake. */
const EVERY_MS = 12_000;

/** After this long without a good answer, the figures stop being described as
    live — a number that is quietly forty minutes old is worse than no number. */
const STALE_MS = 90_000;

/**
 * Who is on the site, updating itself.
 *
 * Rendered first on the server so the panel is complete on the first paint and
 * correct with JavaScript disabled, then kept current by polling one small
 * endpoint. Only this section refetches: the inbox and the thirty-day chart do
 * not change between two blinks, and re-running their queries every twelve
 * seconds was ten round trips to refresh one of them.
 *
 * It says when it last succeeded, and stops calling itself live once that is
 * old. Anything labelled live has to be able to admit when it is not, or the
 * label is decoration.
 *
 * Paused while the tab is hidden, and refreshed the moment it comes back. The
 * reader can stop it entirely — content that moves on its own has to be
 * stoppable by whoever is trying to read a row of it.
 */
export default function LivePanel({ initial }: { initial: LiveStats }) {
  const [live, setLive] = useState(initial);
  const [running, setRunning] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [age, setAge] = useState(0);

  useEffect(() => {
    if (!running) return;
    let cancelled = false;

    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/admin/live", { cache: "no-store" });
        if (!response.ok) throw new Error(String(response.status));
        const next = (await response.json()) as LiveStats;
        if (!cancelled) {
          setLive(next);
          setUpdatedAt(Date.now());
        }
      } catch {
        /* A dropped poll is not worth a dialog. Leaving the figures on screen
           labelled "live" would be — so updatedAt simply does not move, and
           the label below notices. */
      }
    };

    const timer = window.setInterval(load, EVERY_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, [running]);

  /* A second clock, so the age on screen counts up between polls rather than
     jumping twelve seconds at a time. */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setAge(updatedAt ? Date.now() - updatedAt : 0);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [updatedAt]);

  const stale = running && updatedAt !== null && age > STALE_MS;
  const seconds = Math.round(age / 1000);

  return (
    <section className={`${CARD} relative overflow-hidden`}>
      {/* One light source, from the corner the eye starts in. The only
          gradient in the panel: a second one would make it a texture. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_120%_at_0%_0%,rgba(59,130,246,0.16),transparent_58%)]"
      />

      <header className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-6 pt-6">
        <div>
          <p className={EYEBROW}>På sitet lige nu</p>
          {/*
           * A whole sentence in one status region, not a bare number in a live
           * region: a screen reader should say "2 besøgende på sitet lige nu",
           * not "2". It never takes focus — this updates on its own, and moving
           * focus under the reader would be intolerable.
           */}
          <p role="status" aria-atomic="true" className="mt-2.5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className={
                live.online > 0 && !stale
                  ? "h-2.5 w-2.5 flex-none rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)] motion-safe:animate-pulse"
                  : "h-2.5 w-2.5 flex-none rounded-full bg-paper/20"
              }
            />
            <span className={`${FIGURE} text-[2.5rem] leading-none`}>{live.online}</span>
            <span className="sr-only">besøgende på sitet lige nu</span>
          </p>
        </div>

        {/* Stacked and right-aligned: the control and the freshness of what it
            controls belong together, and a line of grey text floating beside a
            button reads as something that got left behind. */}
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setRunning((on) => !on)}
            aria-pressed={running}
            className="inline-flex items-center gap-2 border border-white/[0.12] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/60 transition hover:border-white/25 hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                !running ? "bg-paper/30" : stale ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            {running ? "Live" : "Pause"}
          </button>
          <p className={`text-[11px] tabular-nums ${stale ? "text-amber-300/90" : "text-paper/35"}`}>
            {!running
              ? "sat på pause"
              : updatedAt === null
                ? "henter…"
                : stale
                  ? `sidste svar for ${seconds} sek. siden`
                  : `opdateret for ${seconds} sek. siden`}
          </p>
        </div>
      </header>

      {live.reading.length === 0 ? (
        <p className="relative px-6 pb-7 pt-5 text-sm leading-6 text-paper/50">
          Ingen på sitet i øjeblikket. Listen fylder sig selv, så snart nogen åbner en side.
        </p>
      ) : (
        <div className="relative mt-6">
          {/* Column names, so "Mobil · Google" is not left to be worked out.
              Hidden on narrow screens, where the rows stack and the columns
              they would name do not exist. */}
          <div
            aria-hidden="true"
            className={`hidden border-y border-white/[0.07] px-6 py-2 sm:grid sm:grid-cols-[minmax(0,1fr)_9rem_13rem_4rem] sm:gap-x-4 ${EYEBROW}`}
          >
            <span>Side</span>
            <span>Land</span>
            <span>Enhed · kilde</span>
            <span className="text-right">Tid</span>
          </div>

          <ul className="divide-y divide-white/[0.05] border-t border-white/[0.07] sm:border-t-0">
            {live.reading.map((reader, index) => (
              <li
                key={`${reader.path}-${index}`}
                /* Fixed widths, not auto: every row is its own grid, so `auto`
                   columns size to that row's own content and the country of
                   one reader lands nowhere near the next one's. Equal
                   templates are what makes separate rows read as columns. */
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 px-6 py-3 sm:grid-cols-[minmax(0,1fr)_9rem_13rem_4rem]"
              >
                <span className="truncate text-sm font-medium text-paper/90">
                  {reader.path ?? "—"}
                </span>
                <span className="order-3 truncate text-xs text-paper/60 sm:order-none sm:text-sm">
                  <span aria-hidden="true">{flag(reader.country)} </span>
                  {countryName(reader.country)}
                </span>
                <span className="order-4 truncate text-xs text-paper/45 sm:order-none sm:text-sm">
                  {reader.device ?? "—"} · {reader.source}
                </span>
                <span className="text-right text-sm tabular-nums text-paper/60">
                  {duration(reader.seconds)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
