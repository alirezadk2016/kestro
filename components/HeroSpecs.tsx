import Link from "next/link";
import {
  MemoryStick,
  HardDrive,
  Keyboard,
  BatteryCharging,
  ShieldCheck,
  FileText,
} from "lucide-react";
import SpecFigure, { type SpecKind } from "./SpecFigure";
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
 * Each line is now a link, and points somewhere the claim is backed up. Hover
 * or focus one on a wide screen and the part it names is drawn over the
 * machine: the module, the drive, the keys that actually change. That is done
 * entirely in CSS — the figure is a child of the link, and :hover and
 * :focus-within open it — so the list still costs no JavaScript and still
 * renders in full without any.
 *
 * On a narrow screen the figures never open. There is no hover to open them
 * with, and a tap should take you to the page rather than reveal a drawing.
 */
type Row = { icon: typeof MemoryStick; kind: SpecKind; value: string; note: string; href: string };

const rows = (lang: Lang): Row[] =>
  lang === "da"
    ? [
        {
          icon: MemoryStick,
          kind: "ram",
          value: "16 GB RAM",
          note: "Opgraderet efter behov",
          href: "/maskinen",
        },
        {
          icon: HardDrive,
          kind: "ssd",
          value: "512 GB NVMe SSD",
          note: "Skiftet hvis nødvendigt",
          href: "/maskinen",
        },
        {
          icon: Keyboard,
          kind: "keyboard",
          value: "Dansk tastatur",
          note: "Fysisk skiftet",
          href: "/ydelser/nordisk-tilpasning",
        },
        {
          icon: BatteryCharging,
          kind: "battery",
          value: "Batteri 87 %",
          note: "Målt kapacitet, per enhed",
          href: "/kvalitet",
        },
        {
          icon: ShieldCheck,
          kind: "tested",
          value: "Testet og klargjort",
          note: "Før den sendes til jer",
          href: "/ydelser/klargoering-og-test",
        },
        {
          icon: FileText,
          kind: "warranty",
          value: "Garanti på skrift",
          note: "Perioden står i tilbuddet",
          href: "/tilbud-eksempel",
        },
      ]
    : [
        {
          icon: MemoryStick,
          kind: "ram",
          value: "16 GB RAM",
          note: "Upgraded where needed",
          href: "/maskinen",
        },
        {
          icon: HardDrive,
          kind: "ssd",
          value: "512 GB NVMe SSD",
          note: "Replaced where needed",
          href: "/maskinen",
        },
        {
          icon: Keyboard,
          kind: "keyboard",
          value: "Danish keyboard",
          note: "Physically replaced",
          href: "/ydelser/nordisk-tilpasning",
        },
        {
          icon: BatteryCharging,
          kind: "battery",
          value: "Battery 87%",
          note: "Measured, per unit",
          href: "/kvalitet",
        },
        {
          icon: ShieldCheck,
          kind: "tested",
          value: "Tested and prepared",
          note: "Before it ships to you",
          href: "/ydelser/klargoering-og-test",
        },
        {
          icon: FileText,
          kind: "warranty",
          value: "Warranty in writing",
          note: "The period is in the quote",
          href: "/tilbud-eksempel",
        },
      ];

const copy = {
  da: { label: "Eksempel på en konfiguration", link: "Se hele tilbuddet" },
  en: { label: "An example configuration", link: "See the full quote" },
} satisfies Record<Lang, Record<string, string>>;

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
        {rows(lang).map((row) => (
          /* The row is the positioned ancestor, so the figure lands over the
             machine beside whichever line the pointer is on. <dt> and <dd>
             stay direct children of this div — wrapping them in the link
             would make the list invalid — so the link is stretched over the
             row with ::after instead. */
          <div key={row.value} className="spec-row relative flex items-center gap-3 py-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-brand-400/25 bg-brand-500/10 text-brand-300 transition-colors [.spec-row:hover_&]:border-brand-300/60 [.spec-row:hover_&]:bg-brand-500/20">
              <row.icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <dt className="text-sm font-semibold leading-snug text-paper transition-colors [.spec-row:hover_&]:text-brand-100">
                <Link
                  href={localePath(row.href, lang)}
                  className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  {row.value}
                </Link>
              </dt>
              <dd className="mt-0.5 text-xs leading-5 text-paper/55">{row.note}</dd>
            </div>

            <span className="pointer-events-none absolute right-full top-1/2 mr-6 hidden w-[26rem] -translate-y-1/2 drop-shadow-[0_24px_60px_rgba(0,0,0,0.65)] lg:block xl:w-[30rem]">
              <SpecFigure kind={row.kind} lang={lang} />
            </span>
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
