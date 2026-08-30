import Link from "next/link";
import {
  MemoryStick,
  HardDrive,
  Keyboard,
  BatteryCharging,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * The spec card beside the machine.
 *
 * Every figure here is the same example configuration written out in full on
 * /tilbud-eksempel, and it is labelled as an example for the same reason that
 * page is: we hold no stock, so a spec list presented as a product would be
 * describing a machine that does not exist. What it does show is the shape of
 * what a buyer gets told — a measured battery percentage rather than "OK", a
 * keyboard that was physically changed, a warranty period that is written down
 * rather than promised in advance.
 *
 * Server-rendered, no state, no motion: it is a list of facts.
 */
const copy = {
  da: {
    label: "Eksempel på en konfiguration",
    link: "Se hele tilbuddet",
    rows: [
      { icon: MemoryStick, value: "16 GB RAM", note: "Opgraderet efter behov" },
      { icon: HardDrive, value: "512 GB NVMe SSD", note: "Skiftet hvis nødvendigt" },
      { icon: Keyboard, value: "Dansk tastatur", note: "Fysisk skiftet" },
      { icon: BatteryCharging, value: "Batteri 87 %", note: "Målt kapacitet, per enhed" },
      { icon: ShieldCheck, value: "Testet og klargjort", note: "Før den sendes til jer" },
      { icon: FileText, value: "Garanti på skrift", note: "Perioden står i tilbuddet" },
    ],
  },
  en: {
    label: "An example configuration",
    link: "See the full quote",
    rows: [
      { icon: MemoryStick, value: "16 GB RAM", note: "Upgraded where needed" },
      { icon: HardDrive, value: "512 GB NVMe SSD", note: "Replaced where needed" },
      { icon: Keyboard, value: "Danish keyboard", note: "Physically replaced" },
      { icon: BatteryCharging, value: "Battery 87%", note: "Measured, per unit" },
      { icon: ShieldCheck, value: "Tested and prepared", note: "Before it ships to you" },
      { icon: FileText, value: "Warranty in writing", note: "The period is in the quote" },
    ],
  },
} satisfies Record<
  Lang,
  {
    label: string;
    link: string;
    rows: { icon: typeof MemoryStick; value: string; note: string }[];
  }
>;

export default function HeroSpecs({ lang, className }: { lang: Lang; className?: string }) {
  const c = copy[lang];

  return (
    <div className={className}>
      {/* brand-200 rather than 300: this label sits over the machine's glow
          rather than on the flat page, and 300 measured 3.84:1 against it. */}
      <p className="label text-brand-200">{c.label}</p>

      {/* Rows on hairlines rather than in a boxed panel: a card here reads as
          a second surface floating over the hero, and the list is stronger
          when the machine's own light is what it sits in. */}
      <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
        {c.rows.map((row) => (
          <div key={row.value} className="flex items-center gap-3 py-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-brand-400/25 bg-brand-500/10 text-brand-300">
              <row.icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <dt className="text-sm font-semibold leading-snug text-paper">{row.value}</dt>
              <dd className="mt-0.5 text-xs leading-5 text-paper/55">{row.note}</dd>
            </div>
          </div>
        ))}
      </dl>

      <Link
        href={localePath("/tilbud-eksempel", lang)}
        className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-300 transition hover:text-paper"
      >
        {c.link}
      </Link>
    </div>
  );
}
