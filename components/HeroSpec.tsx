"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Lang } from "@/lib/i18n";

/*
 * The right half of the hero. Not decoration: it shows the thing we actually
 * do — a customer states a configuration, we go and find it. The values cycle
 * through three realistic enquiries so the panel is alive without resorting to
 * an abstract animation that means nothing.
 *
 * Models are ones that exist in the catalogue, so the panel never shows a
 * machine we have not written a page about.
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
    values: {
      da: ["120 stk.", "ThinkPad T14", "16 GB", "512 GB SSD", "Dansk", "Windows 11"],
      en: ["120 units", "ThinkPad T14", "16 GB", "512 GB SSD", "Danish", "Windows 11"],
    },
  },
  {
    values: {
      da: ["40 stk.", "HP EliteBook 840", "32 GB", "1 TB SSD", "Norsk", "Windows 11"],
      en: ["40 units", "HP EliteBook 840", "32 GB", "1 TB SSD", "Norwegian", "Windows 11"],
    },
  },
  {
    values: {
      da: ["8 stk.", "HP ZBook 15", "64 GB", "1 TB SSD", "Dansk", "Windows 11 Pro"],
      en: ["8 units", "HP ZBook 15", "64 GB", "1 TB SSD", "Danish", "Windows 11 Pro"],
    },
  },
];

export default function HeroSpec({ lang }: { lang: Lang }) {
  const l = labels[lang];
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Someone who asked for less motion gets a static panel, not a slower one.
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % enquiries.length), 4000);
    return () => clearInterval(id);
  }, [reduced]);

  const values = enquiries[index].values[lang];

  return (
    <div className="border border-paper/15 bg-paper/[0.04] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-paper/15 px-6 py-4">
        <span className="font-display text-sm font-bold tracking-tight text-paper">{l.title}</span>
        <span className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-brand-300">
          <span className="relative flex h-1.5 w-1.5">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
          </span>
          {l.live}
        </span>
      </div>

      <dl className="px-6 py-2">
        {l.rows.map((row, i) => (
          <div
            key={row}
            className="flex items-baseline justify-between gap-6 border-b border-paper/10 py-3.5 last:border-b-0"
          >
            <dt className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-paper/40">
              {row}
            </dt>
            <dd className="min-w-0 text-right">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`${index}-${i}`}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.04 }}
                  className="block font-display text-base font-semibold tracking-tight text-paper"
                >
                  {values[i]}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>

      <p className="border-t border-paper/15 px-6 py-4 text-xs leading-6 text-paper/50">{l.foot}</p>
    </div>
  );
}
