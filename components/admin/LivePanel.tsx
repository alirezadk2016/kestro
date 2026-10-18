"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CARD, EYEBROW, FIGURE } from "@/components/admin/tokens";
import type { LiveStats } from "@/lib/db";
import { countryName, duration, flag } from "@/lib/format";

/** Only the small live endpoint is polled, and only while this tab is visible. */
const EVERY_MS = 12_000;
const TIMEOUT_MS = 8_000;
const STALE_MS = 90_000;

type Problem = "network" | "unavailable" | null;

/** Last confirmed values survive a failed refresh; a failed read is never zero. */
export default function LivePanel({ initial }: { initial: LiveStats }) {
  const [live, setLive] = useState(initial);
  const [running, setRunning] = useState(true);
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<Problem>(initial.available ? null : "unavailable");
  const [expired, setExpired] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const mounted = useRef(false);
  const sessionExpired = useRef(false);
  const request = useRef<AbortController | null>(null);

  const abort = useCallback((reason: string) => {
    const active = request.current;
    request.current = null;
    active?.abort(reason);
    if (mounted.current) setPending(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      abort("unmount");
    };
  }, [abort]);

  // A router refresh can bring a new server snapshot without remounting us.
  useEffect(() => {
    if (!initial.available) return;
    abort("new server snapshot");
    const time = Date.now();
    setLive(initial);
    setUpdatedAt(time);
    setNow(time);
    setProblem(null);
  }, [initial, abort]);

  const load = useCallback(async () => {
    if (
      !mounted.current ||
      document.visibilityState !== "visible" ||
      sessionExpired.current ||
      request.current
    )
      return;

    const active = new AbortController();
    request.current = active;
    setPending(true);
    const timeout = window.setTimeout(() => active.abort("timeout"), TIMEOUT_MS);
    const current = () => mounted.current && request.current === active;

    try {
      const response = await fetch("/api/admin/live", {
        cache: "no-store",
        signal: active.signal,
      });
      if (!current()) return;
      if (response.status === 403) {
        sessionExpired.current = true;
        setExpired(true);
        setProblem(null);
        return;
      }
      if (!response.ok) throw new Error("Live figures could not be read");
      const next = (await response.json()) as LiveStats;
      if (!current() || active.signal.aborted) return;
      if (!next.available || !Number.isFinite(next.online) || !Array.isArray(next.reading)) {
        setProblem("unavailable");
        return;
      }
      const time = Date.now();
      setLive(next);
      setUpdatedAt(time);
      setNow(time);
      setProblem(null);
    } catch {
      // Pause, navigation and visibility changes are cancellations, not failures.
      if (!current() || (active.signal.aborted && active.signal.reason !== "timeout")) return;
      setProblem("network");
    } finally {
      window.clearTimeout(timeout);
      if (current()) {
        request.current = null;
        setPending(false);
      }
    }
  }, []);

  useEffect(() => {
    if (running && !expired) void load();
    const timer = running && !expired ? window.setInterval(() => void load(), EVERY_MS) : null;
    const visibility = () => {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
        if (running && !expired) void load();
      } else abort("hidden");
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      if (timer !== null) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
      abort("pause");
    };
  }, [running, expired, load, abort]);

  useEffect(() => {
    if (updatedAt === null) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [updatedAt]);

  const hasData = live.available;
  const age = updatedAt === null ? 0 : Math.max(0, now - updatedAt);
  const stale = updatedAt !== null && age > STALE_MS;
  const fresh = hasData && running && !problem && !expired && !stale;
  const seconds = Math.floor(age / 1000);
  const elapsed = seconds < 60 ? `${seconds} sek.` : `${Math.floor(seconds / 60)} min.`;
  const freshness =
    updatedAt === null
      ? hasData
        ? "Bekræftet ved sideåbning"
        : "Ingen bekræftede besøgstal"
      : `Sidst bekræftet for ${elapsed} siden`;

  return (
    <section className={`${CARD} overflow-hidden`} aria-label="Besøgende på sitet">
      <header className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <p className={EYEBROW}>{fresh ? "På sitet lige nu" : "Senest registrerede besøg"}</p>
          <p role="status" aria-atomic="true" className="mt-3 flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 flex-none rounded-full ${fresh ? "bg-emerald-400" : "bg-paper/30"}`}
            />
            <span className={`${FIGURE} text-[2.5rem] leading-none`}>
              {hasData ? live.online : "—"}
            </span>
            <span className="sr-only">
              {hasData
                ? fresh
                  ? "besøgende på sitet lige nu"
                  : "besøgende ved seneste bekræftede måling"
                : "Besøgstal er ikke tilgængelige"}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setRunning((on) => !on)}
              disabled={expired}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs font-medium text-paper/80 transition-colors hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:text-paper/65"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${running && !expired ? "bg-brand-300" : "bg-paper/30"}`}
              />
              {running ? "Pause live" : "Genoptag live"}
            </button>
            <button
              type="button"
              onClick={() => void load()}
              disabled={pending || expired}
              aria-label="Opdater besøgstal"
              aria-busy={pending}
              className="inline-flex min-h-11 min-w-[88px] items-center justify-center rounded-lg border border-white/15 px-3 text-xs font-medium text-paper/80 transition-colors hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:text-paper/65"
            >
              {pending ? "Henter…" : "Opdater"}
            </button>
          </div>
          <p className="text-right text-[11px] leading-5 tabular-nums text-paper/65">
            {!running && !expired && (
              <span className="block">Automatisk opdatering er sat på pause</span>
            )}
            {stale && running && !expired && (
              <span className="block text-amber-200">Data er ikke længere live</span>
            )}
            {freshness}
          </p>
        </div>
      </header>

      {(problem || expired) && (
        <div
          role="status"
          className="mx-5 mt-5 rounded-lg border border-amber-300/20 bg-amber-300/[0.07] px-4 py-3 text-sm leading-6 text-amber-100 sm:mx-6"
        >
          {expired ? (
            <>
              <p>Sessionen er udløbet. Log ind igen for at hente nye besøgstal.</p>
              <form action="/admin" method="get">
                <button className="inline-flex min-h-11 items-center font-semibold underline decoration-amber-100/50 underline-offset-4">
                  Log ind igen
                </button>
              </form>
            </>
          ) : (
            <p>
              {problem === "network"
                ? "Forbindelsen kunne ikke opdateres."
                : "Besøgstal er midlertidigt utilgængelige."}
              {hasData ? " De senest bekræftede tal vises stadig." : " Prøv at opdatere igen."}
            </p>
          )}
        </div>
      )}

      {!hasData ? (
        <p className="px-5 pb-6 pt-5 text-sm leading-6 text-paper/70 sm:px-6">
          Der vises ingen besøgstal, før forbindelsen er bekræftet.
        </p>
      ) : live.reading.length === 0 ? (
        <p className="px-5 pb-6 pt-5 text-sm leading-6 text-paper/70 sm:px-6">
          {fresh
            ? "Ingen på sitet i øjeblikket."
            : "Ingen besøgende ved den seneste bekræftede måling."}
        </p>
      ) : (
        <div className="mt-6">
          <div
            aria-hidden="true"
            className={`hidden border-y border-white/10 px-6 py-3 sm:grid sm:grid-cols-[minmax(0,1fr)_9rem_13rem_4rem] sm:gap-x-4 ${EYEBROW}`}
          >
            <span>Side</span>
            <span>Land</span>
            <span>Enhed · kilde</span>
            <span className="text-right">Tid</span>
          </div>
          <ul className="grid divide-y divide-white/[0.07] border-t border-white/10 sm:border-t-0">
            {live.reading.map((reader, index) => (
              <li
                key={`${reader.path}-${index}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_9rem_13rem_4rem] sm:px-6"
              >
                <span className="truncate text-sm font-medium text-paper/90">
                  {reader.path ?? "—"}
                </span>
                <span className="order-3 truncate text-xs text-paper/70 sm:order-none sm:text-sm">
                  <span aria-hidden="true">{flag(reader.country)} </span>
                  {countryName(reader.country)}
                </span>
                <span className="order-4 truncate text-xs text-paper/70 sm:order-none sm:text-sm">
                  {reader.device ?? "—"} · {reader.source}
                </span>
                <span className="text-right text-sm tabular-nums text-paper/70">
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
