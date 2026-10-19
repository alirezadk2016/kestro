"use client";

import { useEffect, useId, useRef, useState } from "react";
import { buttonClass } from "@/components/Button";
import type { Lang } from "@/lib/i18n";

type Phase =
  | "idle"
  | "running"
  | "complete"
  | "stopped"
  | "background"
  | "timeout"
  | "unstable"
  | "unsupported"
  | "error";
type Reading = { phase: Phase; progress: number; rate?: number; checksum?: number };
type Clock = {
  now: () => number;
  later: (callback: () => void, delay: number) => number;
  clear: (timer: number) => void;
  hidden: () => boolean;
  supported: () => boolean;
};

const DURATION = 2000;
const INITIAL: Reading = { phase: "idle", progress: 0 };

/**
 * The site's CSP permits same-origin workers, but not Blob workers. Keep this
 * small check inside short, yielding tasks instead of weakening that policy.
 * Rate includes the pauses: compare only repeats of this exact browser check.
 * The injected clock also lets the cancellation paths be checked without a DOM.
 */
export function createBrowserCheck(clock: Clock, publish: (reading: Reading) => void) {
  let sequence = 0;
  let active = false;
  let disposed = false;
  let task: number | undefined;
  let deadline: number | undefined;

  function release() {
    sequence += 1;
    active = false;
    if (task !== undefined) clock.clear(task);
    if (deadline !== undefined) clock.clear(deadline);
    task = deadline = undefined;
  }

  function finish(reading: Reading) {
    release();
    if (!disposed) publish(reading);
  }

  function stop(reason: "stopped" | "background" = "stopped") {
    if (active) finish({ phase: reason, progress: 0 });
  }

  function start() {
    if (disposed || active) return;
    release();
    if (clock.hidden()) {
      publish({ phase: "background", progress: 0 });
      return;
    }
    if (!clock.supported()) {
      publish({ phase: "unsupported", progress: 0 });
      return;
    }

    const run = sequence;
    active = true;
    publish({ phase: "running", progress: 0 });
    deadline = clock.later(() => {
      if (active && run === sequence) finish({ phase: "timeout", progress: 0 });
    }, 8000);

    let x = 123456789;
    let count = 0;
    let measuredStart: number | undefined;
    let warmStart: number;
    try {
      warmStart = clock.now();
      if (!Number.isFinite(warmStart)) throw new Error("Clock unavailable");
    } catch {
      finish({ phase: "error", progress: 0 });
      return;
    }

    function chunk() {
      if (disposed || !active || run !== sequence) return;
      if (clock.hidden()) {
        stop("background");
        return;
      }
      try {
        const before = clock.now();
        let iterations = 0;
        // Bound both elapsed time and work, even if a browser clock stalls.
        for (let block = 0; block < 64; block += 1) {
          for (let i = 0; i < 10000; i += 1) {
            x = (Math.imul(x, 1664525) + 1013904223) | 0;
          }
          iterations += 10000;
          if (clock.now() - before >= 8) break;
        }
        const now = clock.now();
        if (!Number.isFinite(now) || now < before || now < warmStart) {
          finish({ phase: "unstable", progress: 0 });
          return;
        }
        if (measuredStart === undefined) {
          if (now - warmStart >= 150) measuredStart = now;
        } else {
          count += iterations;
          const elapsed = now - measuredStart;
          if (elapsed >= DURATION) {
            const rate = count / (elapsed / 1000);
            finish(
              elapsed <= 4500 && Number.isFinite(rate) && rate > 0
                ? { phase: "complete", progress: 100, rate, checksum: x }
                : { phase: "unstable", progress: 0 },
            );
            return;
          }
          publish({
            phase: "running",
            progress: Math.min(99, Math.round((elapsed / DURATION) * 100)),
          });
        }
        task = clock.later(chunk, 8);
      } catch {
        finish({ phase: "error", progress: 0 });
      }
    }
    task = clock.later(chunk, 0);
  }

  return {
    start,
    stop,
    dispose() {
      disposed = true;
      release();
    },
  };
}

const copy = {
  da: {
    label: "Browsercheck",
    lead: "Kør tjekket, lav én ændring – fx luk faner – og kør det igen. Så kan du se, om ændringen gjorde browseren hurtigere.",
    start: "Start browsercheck",
    again: "Prøv igen",
    running: "Testen kører…",
    stop: "Stop testen",
    progress: "Testens fremdrift",
    idle: "Klar, når du er.",
    idleHelp: "Cirka 2 sekunder · Kun på din enhed",
    runningHelp: "Hold fanen åben. Du kan stoppe undervejs.",
    unit: "iterationer pr. sekund",
    result: "Resultat i denne browseropgave",
    baseline: "Det er dit udgangspunkt. Lav én ændring, og kør tjekket igen.",
    faster: "hurtigere end første kørsel",
    slower: "langsommere end første kørsel",
    same: "Samme som første kørsel",
    reset: "Nyt udgangspunkt",
    compare:
      "Sammenlign kun kørsler i samme browser på samme computer. Små forskelle kan skyldes, at målingen svinger – kør gerne et par gange.",
    limit:
      "Måler kun, hvor hurtigt browseren regner lige nu – ikke processor, RAM eller computerens helbred.",
    stopped: "Testen er stoppet.",
    background: "Testen er stoppet. Hold denne fane i forgrunden, når du prøver igen.",
    timeout: "Testen tog for lang tid. Luk tunge opgaver, og prøv igen.",
    unstable: "Målingen var ustabil. Prøv igen med fanen i forgrunden.",
    unsupported: "Denne browser understøtter ikke testen. Brug Jobliste-guiden på siden i stedet.",
    error: "Testen kunne ikke afsluttes. Prøv igen, eller brug Jobliste-guiden på siden.",
    noScript: "Slå JavaScript til for at bruge testen. Jobliste-guiden virker uden.",
  },
  en: {
    label: "Browser check",
    lead: "Run the check, make one change — close some tabs, say — and run it again, to see whether the change made the browser faster.",
    start: "Start browser check",
    again: "Try again",
    running: "Check running…",
    stop: "Stop check",
    progress: "Check progress",
    idle: "Ready when you are.",
    idleHelp: "About 2 seconds · On your device only",
    runningHelp: "Keep this tab open. You can stop at any time.",
    unit: "iterations per second",
    result: "Result for this browser task",
    baseline: "This is your starting point. Make one change and run the check again.",
    faster: "faster than the first run",
    slower: "slower than the first run",
    same: "The same as the first run",
    reset: "New starting point",
    compare:
      "Only compare runs in the same browser on the same computer. Small differences can be the measurement varying — run it a few times.",
    limit:
      "Measures only how fast the browser calculates right now — not the processor, RAM or the computer's health.",
    stopped: "The check has stopped.",
    background: "The check has stopped. Keep this tab in the foreground when you try again.",
    timeout: "The check took too long. Close demanding apps and try again.",
    unstable: "The reading was unstable. Try again with this tab in the foreground.",
    unsupported:
      "This browser cannot run the check. Use the Task Manager guide on this page instead.",
    error: "The check could not finish. Try again or use the Task Manager guide on this page.",
    noScript: "Enable JavaScript to use the check. The Task Manager guide works without it.",
  },
} as const;

export default function BrowserCheck({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [reading, setReading] = useState<Reading>(INITIAL);
  const [ready, setReady] = useState(false);
  /* The first completed run is the starting point the next ones are compared
     with: the guide's last step is "try one change and compare", and a rate
     on its own says nothing anybody can act on. */
  const baselineRef = useRef<number | null>(null);
  const [baseline, setBaseline] = useState<number | null>(null);
  const [baselineRun, setBaselineRun] = useState(false);
  const controller = useRef<ReturnType<typeof createBrowserCheck> | null>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const stopButton = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const running = reading.phase === "running";
  const locale = lang === "da" ? "da-DK" : "en-GB";

  useEffect(() => {
    let mounted = true;
    const check = createBrowserCheck(
      {
        now: () => performance.now(),
        later: (callback, delay) => window.setTimeout(callback, delay),
        clear: (timer) => window.clearTimeout(timer),
        hidden: () => document.hidden,
        supported: () =>
          typeof performance !== "undefined" &&
          typeof performance.now === "function" &&
          typeof Math.imul === "function",
      },
      (next) => {
        if (!mounted) return;
        if (next.phase === "complete" && next.rate !== undefined) {
          const first = baselineRef.current === null;
          if (first) {
            baselineRef.current = next.rate;
            setBaseline(next.rate);
          }
          setBaselineRun(first);
        }
        setReading(next);
        if (next.phase !== "running" && document.activeElement === stopButton.current) {
          // Restore focus after React has enabled the start button again.
          window.requestAnimationFrame(() => {
            if (mounted) startButton.current?.focus();
          });
        }
      },
    );
    controller.current = check;
    setReady(true);
    const background = () => {
      if (document.hidden) check.stop("background");
    };
    const leave = () => check.stop("background");
    document.addEventListener("visibilitychange", background);
    window.addEventListener("pagehide", leave);
    return () => {
      mounted = false;
      check.dispose();
      controller.current = null;
      document.removeEventListener("visibilitychange", background);
      window.removeEventListener("pagehide", leave);
    };
  }, []);

  const status =
    reading.phase === "idle"
      ? t.idle
      : reading.phase === "running"
        ? t.running
        : reading.phase === "complete"
          ? t.result
          : t[reading.phase];

  return (
    <div className="plate p-5 text-paper sm:p-7" aria-labelledby={labelId}>
      <div className="grid gap-7 lg:grid-cols-2 lg:gap-10">
        <div>
          <p id={labelId} className="font-semibold text-paper">
            {t.label}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-paper/75">{t.lead}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              ref={startButton}
              type="button"
              disabled={!ready || running}
              onClick={() => controller.current?.start()}
              className={`${buttonClass()} disabled:cursor-wait disabled:opacity-70`}
            >
              {running ? t.running : reading.phase === "idle" ? t.start : t.again}
            </button>
            {!running && baseline !== null && (
              <button
                type="button"
                className={buttonClass("secondary")}
                onClick={() => {
                  baselineRef.current = null;
                  setBaseline(null);
                  setReading(INITIAL);
                }}
              >
                {t.reset}
              </button>
            )}
            {running && (
              <button
                ref={stopButton}
                type="button"
                className={buttonClass("secondary")}
                onClick={() => controller.current?.stop()}
              >
                {t.stop}
              </button>
            )}
          </div>
          <p className="mt-3 text-sm text-paper/75">{running ? t.runningHelp : t.idleHelp}</p>
          <noscript>
            <p className="mt-3 text-sm text-paper/75">{t.noScript}</p>
          </noscript>
        </div>
        <div className="min-w-0 rounded-xl bg-ink-950/50 p-5">
          <div role="status" aria-live="polite" aria-atomic="true">
            <p className="text-sm font-semibold text-paper">{status}</p>
            {reading.phase === "complete" && reading.rate !== undefined && (
              <>
                <p
                  className="mt-3 block break-words font-display text-3xl font-semibold tabular-nums tracking-tight text-paper sm:text-4xl"
                  data-checksum={reading.checksum}
                >
                  {Math.round(reading.rate).toLocaleString(locale)}
                </p>
                <p className="mt-1 text-sm text-paper/75">{t.unit}</p>
                {baselineRun || baseline === null ? (
                  <p className="mt-4 text-sm font-semibold text-paper">{t.baseline}</p>
                ) : (
                  <p className="mt-4 text-sm font-semibold text-paper">
                    {(() => {
                      const change = Math.round(((reading.rate - baseline) / baseline) * 100);
                      const first = Math.round(baseline).toLocaleString(locale);
                      return change === 0
                        ? `${t.same} (${first}).`
                        : `${Math.abs(change)}${lang === "da" ? " %" : "%"} ${change > 0 ? t.faster : t.slower} (${first}).`;
                    })()}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-paper/75">{t.compare}</p>
              </>
            )}
          </div>
          {running && (
            <progress
              className="mt-4 block h-2 w-full accent-brand-500"
              max={100}
              value={reading.progress}
              aria-label={t.progress}
            />
          )}
          <p className="mt-4 text-sm leading-relaxed text-paper/75">{t.limit}</p>
        </div>
      </div>
    </div>
  );
}
