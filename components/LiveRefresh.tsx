"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Often enough that "online now" is true, rarely enough that an open panel
    is not a load on the database. */
const EVERY_MS = 15_000;

/**
 * Keeps the panel current without a reload.
 *
 * router.refresh() re-runs the server components and swaps in the new markup
 * in place. Nothing is remounted, focus is not moved and the scroll position
 * is kept, so a number can change under the reader's eyes without the page
 * jumping — which is the difference between a live panel and one that fights
 * whoever is reading it.
 *
 * Paused while the tab is hidden: a panel nobody is looking at should not be
 * polling, and the first thing that happens on coming back is a refresh, so
 * what is on screen is never stale by more than the moment it took to look.
 */
export default function LiveRefresh() {
  const router = useRouter();
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;

    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = window.setInterval(tick, EVERY_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [live, router]);

  return (
    <button
      type="button"
      onClick={() => setLive((on) => !on)}
      /* Toggleable because content that updates itself has to be stoppable:
         somebody reading a row should be able to make it hold still. */
      aria-pressed={live}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-paper/60 transition hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50"
    >
      <span
        aria-hidden="true"
        className={
          live
            ? "h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.18)] motion-safe:animate-pulse"
            : "h-2 w-2 rounded-full bg-paper/30"
        }
      />
      {live ? "Live" : "Sat på pause"}
    </button>
  );
}
