"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Lang } from "@/lib/i18n";

/*
 * The band that closes the hero. Not decoration: it shows the thing we actually
 * do — a customer states a configuration, we go and find it. The values cycle
 * through three realistic enquiries so the band is alive without resorting to
 * an abstract animation that means nothing.
 *
 * Laid out across the page rather than as a tall panel in the corner, which is
 * what it used to be. A row of six short fields fits a phone in two columns,
 * so the content is on the small screen instead of hidden from it.
 *
 * Models are ones that exist in the catalogue, so it never shows a machine we
 * have not written a page about.
 */
const labels = {
  da: {
    title: "Jeres forespørgsel",
    live: "Eksempel",
    rows: ["Antal", "Model", "Hukommelse", "Lagring", "Tastatur", "Styresystem"],
    foot: "Vi finder maskinerne og vender tilbage med pris, stand og leveringstid.",
  },
  en: {
    title: "Your enquiry",
    live: "Example",
    rows: ["Quantity", "Model", "Memory", "Storage", "Keyboard", "Operating system"],
    foot: "We find the machines and come back with price, condition and lead time.",
  },
} satisfies Record<Lang, { title: string; live: string; rows: string[]; foot: string }>;

const enquiries = [
  {
    da: ["120 stk.", "ThinkPad T14", "16 GB", "512 GB SSD", "Dansk", "Windows 11"],
    en: ["120 units", "ThinkPad T14", "16 GB", "512 GB SSD", "Danish", "Windows 11"],
  },
  {
    da: ["40 stk.", "HP EliteBook 840", "32 GB", "1 TB SSD", "Norsk", "Windows 11"],
    en: ["40 units", "HP EliteBook 840", "32 GB", "1 TB SSD", "Norwegian", "Windows 11"],
  },
  {
    da: ["8 stk.", "HP ZBook 15", "64 GB", "1 TB SSD", "Dansk", "Windows 11 Pro"],
    en: ["8 units", "HP ZBook 15", "64 GB", "1 TB SSD", "Danish", "Windows 11 Pro"],
  },
] satisfies Record<Lang, string[]>[];

const CYCLE_MS = 5000;

export default function HeroSpec({ lang, className }: { lang: Lang; className?: string }) {
  const l = labels[lang];
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Someone who asked for less motion gets a static band, not a slower one.
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % enquiries.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const values = enquiries[index][lang];

  return (
    <div className={`border-t border-paper/15 pt-8 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-6">
        <span className="font-display text-sm font-bold tracking-tight text-paper">{l.title}</span>
        <span className="flex items-center gap-2 label text-brand-300">
          <span className="relative flex h-1.5 w-1.5">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
          </span>
          {l.live}
        </span>
      </div>

      {/* aria-live so a screen reader is told the values changed, rather than
          silently reading whichever enquiry happened to be showing. */}
      <dl
        aria-live="polite"
        className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6"
      >
        {l.rows.map((row, i) => (
          <div key={row} className="min-w-0">
            <dt className="label text-paper/55">{row}</dt>
            <dd className="mt-1.5">
              {/* Keyed on the enquiry, so React swaps the element and the CSS
                  animation runs again. The fields are staggered by hand rather
                  than by an animation library. */}
              <span
                key={index}
                style={{ animationDelay: `${i * 0.04}s` }}
                className="swap-in block truncate font-display text-base font-semibold tracking-tight text-paper"
              >
                {values[i]}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 max-w-2xl text-xs leading-6 text-paper/50">{l.foot}</p>
    </div>
  );
}
