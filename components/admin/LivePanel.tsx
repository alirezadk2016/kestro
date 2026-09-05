"use client";

import { useEffect, useState } from "react";

import type { LiveStats } from "@/lib/db";
import { countryName, duration, flag } from "@/lib/format";

/** Often enough that "right now" is true; rarely enough that an open panel is
    not a standing load on a database that bills for being awake. */
const EVERY_MS = 12_000;

/**
 * Who is on the site, updating itself.
 *
 * Rendered first on the server so the panel is complete on the first paint and
 * correct with JavaScript disabled, then kept current by polling one small
 * endpoint. Only this section refetches: the inbox and the thirty-day chart do
 * not change between two blinks, and re-running their queries every twelve
 * seconds was ten round trips to refresh one of them.
 *
 * Paused while the tab is hidden, and refreshed the moment it comes back, so
 * what is on screen is never stale by more than the glance it took to look.
 * The reader can stop it entirely — content that moves on its own has to be
 * stoppable by whoever is trying to read a row of it.
 */
export default function LivePanel({ initial }: { initial: LiveStats }) {
  const [live, setLive] = useState(initial);
  const [running, setRunning] = useState(true);
  const [failed, setFailed] = useState(false);

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
          setFailed(false);
        }
      } catch {
        /* A dropped poll is not worth a dialog, but silently showing numbers
           from ten minutes ago as though they were current is worse. */
        if (!cancelled) setFailed(true);
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

  return (
    <section className="relative overflow-hidden border border-white/[0.09] bg-[radial-gradient(120%_140%_at_0%_0%,rgba(37,99,235,0.16),transparent_60%)]">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 pt-6">
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className={
              live.online > 0
                ? "translate-y-[-4px] h-2.5 w-2.5 flex-none rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)] motion-safe:animate-pulse"
                : "translate-y-[-4px] h-2.5 w-2.5 flex-none rounded-full bg-paper/25"
            }
          />
          {/*
           * A whole sentence in one status region, not a bare number in a live
           * region: a screen reader should say "2 på sitet lige nu", not "2".
           * It never takes focus — this updates on its own, and moving focus
           * under the reader would be intolerable.
           */}
          <p role="status" aria-atomic="true" className="text-sm text-paper/70">
            <span className="font-display text-[2.75rem] font-extrabold leading-none tabular-nums tracking-tight text-paper">
              {live.online}
            </span>{" "}
            på sitet lige nu
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRunning((on) => !on)}
          aria-pressed={running}
          className="ml-auto inline-flex items-center gap-2 border border-white/12 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-paper/60 transition hover:border-white/25 hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50"
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${running ? "bg-emerald-400" : "bg-paper/30"}`}
          />
          {running ? "Live" : "Pause"}
        </button>
      </header>

      {failed && (
        <p className="mx-6 mt-4 border-l-2 border-amber-400/70 bg-amber-400/[0.07] px-4 py-2 text-xs text-amber-200/90">
          Kunne ikke hente de nyeste tal. Viser det sidste, der kom igennem.
        </p>
      )}

      {live.reading.length === 0 ? (
        <p className="px-6 pb-7 pt-4 text-sm leading-6 text-paper/50">
          Der er ingen på sitet i øjeblikket. Listen fylder sig selv, så snart nogen åbner en side.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-white/[0.06] border-t border-white/[0.09]">
          {live.reading.map((reader, index) => (
            <li
              key={`${reader.path}-${index}`}
              /* Fixed widths, not auto: every row is its own grid, so `auto`
                 columns size to that row's own content and the country and
                 source of one reader land nowhere near the next one's. Equal
                 templates are what makes separate rows read as columns. */
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 px-6 py-3 sm:grid-cols-[minmax(0,1fr)_9rem_13rem_3.5rem]"
            >
              <span className="truncate text-sm font-medium text-paper/90">
                {reader.path ?? "—"}
              </span>
              <span className="order-3 truncate text-xs text-paper/55 sm:order-none sm:text-sm">
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
      )}
    </section>
  );
}
