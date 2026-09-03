import CraftMark from "./CraftMark";
import type { Lang } from "@/lib/i18n";

/*
 * Which parts of a used machine are a choice, and which are a finding.
 *
 * A model page reads like a product page, and a product page implies that
 * what it describes is what arrives. On sourced hardware that is only half
 * true: memory, disk, keyboard and software are ours to set, while cosmetic
 * grade, battery health and the exact processor generation are whatever the
 * batch turns out to hold. A buyer who learns that at delivery has been
 * misled by omission, even where every individual sentence was accurate.
 *
 * So the three are separated: what we change, what the batch decides, and
 * what is settled in writing before anyone commits. The third column is the
 * one that makes the second column safe to admit.
 */
const copy = {
  da: {
    title: "Hvad er fast, og hvad afhænger af partiet",
    columns: [
      {
        mark: "adjust",
        heading: "Det tilpasser vi",
        points: [
          "Hukommelse og disk opgraderes efter behov.",
          "Tastaturet skiftes til dansk eller norsk layout.",
          "Windows installeres med drivere og sprogopsætning.",
          "Dockingstationer, skærme og kabler kan følge med.",
        ],
      },
      {
        mark: "batch",
        heading: "Det afhænger af partiet",
        points: [
          "Kosmetisk stand og batteriets tilstand.",
          "Præcis processorgeneration inden for modellen.",
          "Kabinetvariant, farve og portudvalg.",
          "Hvor mange ens maskiner der kan skaffes samtidig.",
        ],
      },
      {
        mark: "written",
        heading: "Det står skriftligt, før I bestiller",
        points: [
          "Model og den præcise specifikation, I får.",
          "Stand og batteritilstand per enhed.",
          "Garantivilkår, og hvem I kontakter ved fejl.",
          "Pris per enhed og samlet, og en tidsramme.",
        ],
      },
    ],
  },
  en: {
    title: "What is fixed, and what the batch decides",
    columns: [
      {
        mark: "adjust",
        heading: "We set this",
        points: [
          "Memory and disk are upgraded where needed.",
          "The keyboard is changed to a Danish or Norwegian layout.",
          "Windows is installed with drivers and language settings.",
          "Docking stations, monitors and cables can come with it.",
        ],
      },
      {
        mark: "batch",
        heading: "The batch decides this",
        points: [
          "Cosmetic condition and battery health.",
          "The exact processor generation within the model.",
          "Chassis variant, colour and port selection.",
          "How many identical machines can be sourced at once.",
        ],
      },
      {
        mark: "written",
        heading: "This is in writing before you order",
        points: [
          "The model and the exact specification you get.",
          "Condition and battery health per unit.",
          "Warranty terms, and who to contact if something fails.",
          "Price per unit and in total, and a time frame.",
        ],
      },
    ],
  },
} as const;

export default function WhatIsFixed({ lang, className = "" }: { lang: Lang; className?: string }) {
  const c = copy[lang];

  return (
    <div className={className}>
      <h2 className="text-xl font-bold tracking-tight text-paper sm:text-2xl">{c.title}</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {c.columns.map((column) => (
          <div key={column.heading} className="border border-white/10 bg-white/[0.04] p-5">
            <CraftMark name={column.mark} className="h-7 w-7 text-brand-300" />
            <h3 className="mt-3 text-sm font-semibold text-paper">{column.heading}</h3>
            <ul className="mt-3 space-y-2">
              {column.points.map((point) => (
                <li key={point} className="flex gap-2 text-sm leading-6 text-paper/65">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-3 flex-shrink-0 bg-brand-400/70"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
