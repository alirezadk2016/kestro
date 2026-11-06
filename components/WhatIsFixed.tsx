import MarkTile from "@/components/MarkTile";
import type { Lang } from "@/lib/i18n";
import type { ModelGroup } from "@/lib/models";
import type { CraftMarkName } from "@/components/CraftMark";

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
type Column = { mark: CraftMarkName; heading: string; points: string[] };
type Kind = "laptop" | "desktop" | "monitor" | "dock";

/*
 * One set of lists per kind of equipment. The laptop set was shown on all
 * eighteen model pages, so a monitor and a dock were said to get their memory
 * upgraded, their keyboard swapped and their battery measured. Every point
 * below is either general to the kind or already stated in that model's own
 * notes in lib/models.ts (cables and power supplies missing on used units,
 * the USB hub needing its cable, matching a generation).
 */
const copy: Record<Lang, { title: string; kinds: Record<Kind, Column[]> }> = {
  da: {
    title: "Hvad er fast, og hvad afhænger af partiet?",
    kinds: {
      laptop: [
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
      desktop: [
        {
          mark: "adjust",
          heading: "Det tilpasser vi",
          points: [
            "Hukommelse og disk opgraderes efter behov.",
            "Windows installeres med drivere og sprogopsætning.",
            "Tastatur med dansk eller norsk layout kan følge med.",
            "Skærme og kabler kan følge med.",
          ],
        },
        {
          mark: "batch",
          heading: "Det afhænger af partiet",
          points: [
            "Kosmetisk stand.",
            "Præcis processorgeneration inden for modellen.",
            "Kabinetvariant og portudvalg.",
            "Hvor mange ens maskiner der kan skaffes samtidig.",
          ],
        },
        {
          mark: "written",
          heading: "Det står skriftligt, før I bestiller",
          points: [
            "Model, kabinet og den præcise specifikation, I får.",
            "Stand per enhed.",
            "Garantivilkår, og hvem I kontakter ved fejl.",
            "Pris per enhed og samlet, og en tidsramme.",
          ],
        },
      ],
      monitor: [
        {
          mark: "adjust",
          heading: "Det tilpasser vi",
          points: [
            "Kabler efter jeres maskiners udgange: DisplayPort eller HDMI.",
            "USB-kabel med, så skærmens USB-hub virker.",
            "Docks og tastaturer kan følge med.",
          ],
        },
        {
          mark: "batch",
          heading: "Det afhænger af partiet",
          points: [
            "Kosmetisk stand på ramme og fod.",
            "Generation og portudvalg inden for serien.",
            "Om kabler følger med fra leverandøren.",
            "Hvor mange ens skærme der kan skaffes samtidig.",
          ],
        },
        {
          mark: "written",
          heading: "Det står skriftligt, før I bestiller",
          points: [
            "Model, generation og hvilke kabler der følger med.",
            "Stand per skærm.",
            "Garantivilkår, og hvem I kontakter ved fejl.",
            "Pris per enhed og samlet, og en tidsramme.",
          ],
        },
      ],
      dock: [
        {
          mark: "adjust",
          heading: "Det tilpasser vi",
          points: [
            "Docken matches til jeres maskiners stik: USB-C, Thunderbolt eller dockstik.",
            "Skærme, kabler og tastaturer kan følge med.",
          ],
        },
        {
          mark: "batch",
          heading: "Det afhænger af partiet",
          points: [
            "Kosmetisk stand.",
            "Variant inden for modellen.",
            "Om strømforsyningen følger med fra leverandøren.",
            "Hvor mange ens docks der kan skaffes samtidig.",
          ],
        },
        {
          mark: "written",
          heading: "Det står skriftligt, før I bestiller",
          points: [
            "Model, variant og hvilke maskiner docken er til.",
            "Strømforsyning og dens effekt.",
            "Garantivilkår, og hvem I kontakter ved fejl.",
            "Pris per enhed og samlet, og en tidsramme.",
          ],
        },
      ],
    },
  },
  en: {
    title: "What is fixed, and what the batch decides",
    kinds: {
      laptop: [
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
      desktop: [
        {
          mark: "adjust",
          heading: "We set this",
          points: [
            "Memory and disk are upgraded where needed.",
            "Windows is installed with drivers and language settings.",
            "A keyboard with a Danish or Norwegian layout can come with it.",
            "Monitors and cables can come with it.",
          ],
        },
        {
          mark: "batch",
          heading: "The batch decides this",
          points: [
            "Cosmetic condition.",
            "The exact processor generation within the model.",
            "Chassis variant and port selection.",
            "How many identical machines can be sourced at once.",
          ],
        },
        {
          mark: "written",
          heading: "This is in writing before you order",
          points: [
            "The model, the chassis and the exact specification you get.",
            "Condition per unit.",
            "Warranty terms, and who to contact if something fails.",
            "Price per unit and in total, and a time frame.",
          ],
        },
      ],
      monitor: [
        {
          mark: "adjust",
          heading: "We set this",
          points: [
            "Cables to suit your machines' outputs: DisplayPort or HDMI.",
            "A USB cable, so the monitor's USB hub works.",
            "Docks and keyboards can come with it.",
          ],
        },
        {
          mark: "batch",
          heading: "The batch decides this",
          points: [
            "Cosmetic condition of the frame and stand.",
            "Generation and port selection within the series.",
            "Whether cables come with it from the supplier.",
            "How many identical monitors can be sourced at once.",
          ],
        },
        {
          mark: "written",
          heading: "This is in writing before you order",
          points: [
            "The model, the generation and which cables are included.",
            "Condition per monitor.",
            "Warranty terms, and who to contact if something fails.",
            "Price per unit and in total, and a time frame.",
          ],
        },
      ],
      dock: [
        {
          mark: "adjust",
          heading: "We set this",
          points: [
            "The dock is matched to your machines' connector: USB-C, Thunderbolt or a dock connector.",
            "Monitors, cables and keyboards can come with it.",
          ],
        },
        {
          mark: "batch",
          heading: "The batch decides this",
          points: [
            "Cosmetic condition.",
            "The variant within the model.",
            "Whether the power supply comes with it from the supplier.",
            "How many identical docks can be sourced at once.",
          ],
        },
        {
          mark: "written",
          heading: "This is in writing before you order",
          points: [
            "The model, the variant and which machines the dock is for.",
            "The power supply and its rating.",
            "Warranty terms, and who to contact if something fails.",
            "Price per unit and in total, and a time frame.",
          ],
        },
      ],
    },
  },
};

const kindOf = (group: ModelGroup): Kind =>
  group === "skaerme"
    ? "monitor"
    : group === "docking"
      ? "dock"
      : group === "stationaere"
        ? "desktop"
        : "laptop";

export default function WhatIsFixed({
  lang,
  group,
  className = "",
}: {
  lang: Lang;
  group: ModelGroup;
  className?: string;
}) {
  const c = copy[lang];
  const columns = c.kinds[kindOf(group)];

  return (
    <div className={className}>
      <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
        {c.title}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {columns.map((column) => (
          <div key={column.heading} className="plate p-5">
            {/* Mark and heading on one line, like the site's other cards. */}
            <div className="flex items-center gap-3">
              <MarkTile name={column.mark} size="sm" className="flex-none" />
              <h3 className="font-display t-h3 font-bold tracking-tight text-paper">
                {column.heading}
              </h3>
            </div>
            <ul className="mt-3 space-y-2">
              {column.points.map((point) => (
                <li key={point} className="flex gap-2 text-sm leading-6 text-paper/75">
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
