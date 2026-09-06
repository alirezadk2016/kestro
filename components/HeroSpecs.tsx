import Link from "next/link";
import SpecFigure, { SpecFigureDefs, type SpecKind } from "./SpecFigure";
import { SpecMark } from "./CraftMark";
import LiveBatteryValue from "./LiveBatteryValue";
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
 * The list sits in a lit panel with its label cut into the top edge, and each
 * line is a link that points somewhere the claim is backed up. Point at one on
 * a wide screen and three things happen at once: the line is ringed, a lead
 * runs left out of it, and the part it names is drawn over the machine at the
 * other end of that lead. The footer line under the list changes with it, so
 * the panel reads as an instrument showing one part at a time rather than as
 * six drawings that happen to share a column.
 *
 * All of it is CSS — the figure, the ring and the lead are children of the
 * row, the footer swaps on :has() — so the list still costs no JavaScript and
 * still renders in full without any.
 *
 * On a narrow screen there is no pointer to do any of that with, so the press
 * is what opens it: hold a line and the part appears over the panel, lift and
 * the tap follows the link as it always did. The ring comes with it; the lead
 * and the footer line do not, because neither has anywhere to point on a
 * phone.
 */
type Row = {
  kind: SpecKind;
  value: string;
  /*
   * The label a live figure is appended to.
   *
   * `value` stays as the row's stable identity — it is the React key and the
   * fallback the server renders — and where this is set the number after it is
   * replaced by one that moves with the drawing. Only the battery has it: the
   * other five state a fixed part of the example configuration and there is
   * nothing about them to animate.
   */
  live?: string;
  note: string;
  href: string;
  /*
   * The line under the list while this row is pointed at. Context for the
   * part, not a promise about it — each item either names something the
   * drawing shows (a form factor, an interface, the three Nordic keys) or
   * repeats something the site already states elsewhere and can back. Nothing
   * here may become a guarantee we cannot stand behind.
   */
  stats: string[];
};

const rows = (lang: Lang): Row[] =>
  lang === "da"
    ? [
        {
          kind: "ram",
          value: "16 GB RAM",
          note: "Opgraderet efter behov",
          href: "/maskinen",
          stats: ["SO-DIMM", "DDR4 / DDR5"],
        },
        {
          kind: "ssd",
          value: "512 GB NVMe SSD",
          note: "Skiftet hvis nødvendigt",
          href: "/maskinen",
          stats: ["M.2 2280", "NVMe", "PCIe"],
        },
        {
          kind: "keyboard",
          value: "Dansk tastatur",
          note: "Fysisk skiftet",
          href: "/ydelser/nordisk-tilpasning",
          stats: ["Nordisk layout", "Æ Ø Å"],
        },
        {
          kind: "battery",
          value: "Batteri 87 %",
          live: "Batteri",
          note: "Målt kapacitet, per enhed",
          href: "/kvalitet",
          stats: ["Kapacitet i %", "Målt per enhed"],
        },
        {
          kind: "tested",
          value: "Testet og klargjort",
          note: "Før den sendes til jer",
          href: "/ydelser/klargoering-og-test",
          stats: ["Skærm og tastatur", "Porte", "Hængsler"],
        },
        {
          kind: "warranty",
          value: "Garanti på skrift",
          note: "Perioden står i tilbuddet",
          href: "/tilbud-eksempel",
          stats: ["På skrift", "Periode i tilbuddet"],
        },
      ]
    : [
        {
          kind: "ram",
          value: "16 GB RAM",
          note: "Upgraded where needed",
          href: "/maskinen",
          stats: ["SO-DIMM", "DDR4 / DDR5"],
        },
        {
          kind: "ssd",
          value: "512 GB NVMe SSD",
          note: "Replaced where needed",
          href: "/maskinen",
          stats: ["M.2 2280", "NVMe", "PCIe"],
        },
        {
          kind: "keyboard",
          value: "Danish keyboard",
          note: "Physically replaced",
          href: "/ydelser/nordisk-tilpasning",
          stats: ["Nordic layout", "Æ Ø Å"],
        },
        {
          kind: "battery",
          value: "Battery 87%",
          live: "Battery",
          note: "Measured, per unit",
          href: "/kvalitet",
          stats: ["Capacity in %", "Measured per unit"],
        },
        {
          kind: "tested",
          value: "Tested and prepared",
          note: "Before it ships to you",
          href: "/ydelser/klargoering-og-test",
          stats: ["Screen and keyboard", "Ports", "Hinges"],
        },
        {
          kind: "warranty",
          value: "Warranty in writing",
          note: "The period is in the quote",
          href: "/tilbud-eksempel",
          stats: ["In writing", "Period in the quote"],
        },
      ];

const copy = {
  da: {
    label: "Eksempel på en konfiguration",
    link: "Se hele tilbuddet",
    rest: "Peg på en linje for at se delen",
  },
  en: {
    label: "An example configuration",
    link: "See the full quote",
    rest: "Point at a line to see the part",
  },
} satisfies Record<Lang, Record<string, string>>;

function Stats({ items, kind }: { items: string[]; kind: string }) {
  return (
    <span
      data-stat={kind}
      aria-hidden="true"
      className="spec-stat absolute inset-x-0 top-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium leading-4 text-paper/70"
    >
      {items.map((item, i) => (
        /* The separator trails the item it follows rather than leading the
           next one. The column is narrow enough that this line can wrap, and
           a wrapped line must not start with a stray dot. */
        <span key={item} className="flex items-center gap-2">
          {item}
          {i < items.length - 1 && <span className="h-1 w-1 rounded-full bg-brand-400/60" />}
        </span>
      ))}
    </span>
  );
}

export default function HeroSpecs({ lang, className }: { lang: Lang; className?: string }) {
  const c = copy[lang];
  const list = rows(lang);

  return (
    <div className={className}>
      {/* The gradients and the shadow every figure paints with, defined once
          for the six of them rather than copied into each. */}
      <SpecFigureDefs />
      {/* Opaque, and in the page's own surface colour rather than a darker one
          of its own. Opaque because the label chip needs something solid to cut
          the top border against and because the lines need a stable ground to
          be measured on; brand-950 because anything darker reads as a black
          card dropped on a lit scene instead of a panel that belongs to it.
          The border and the glow are what separate it from the field, not a
          second shade of navy. */}
      <div className="spec-panel relative rounded-2xl border border-brand-400/30 bg-brand-950 px-4 pb-3 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_0_28px_-6px_rgba(60,110,255,0.35),0_24px_70px_-30px_rgba(0,0,0,0.9)] sm:px-5 xl:pt-5">
        {/* The label cut into the top border, from xl only. It is 28
            characters of tracked uppercase and the column is three of twelve:
            below that width it wraps, and a wrapped label cannot cut a border
            cleanly, so there it simply sits inside the panel above the list.
            brand-200 rather than 300: at 300 it measured 3.84:1 here. */}
        <p className="label mb-3 text-brand-200 xl:absolute xl:-top-[7px] xl:left-5 xl:mb-0 xl:whitespace-nowrap xl:bg-brand-950 xl:px-2 xl:leading-[14px]">
          {c.label}
        </p>

        <dl className="divide-y divide-white/10">
          {list.map((row) => (
            /* The row is the positioned ancestor, so the ring, the lead and
               the figure all land against this line. <dt> and <dd> stay
               direct children of this div — wrapping them in the link would
               make the list invalid — so the link is stretched over the row
               with ::after instead. */
            <div
              key={row.value}
              data-kind={row.kind}
              className="spec-row relative flex items-center gap-3 py-2.5 lg:py-3"
            >
              {/* The ring. Inset outwards so it reads as the row lighting up
                  rather than as a box drawn inside it. */}
              <span
                aria-hidden="true"
                className="spec-ring pointer-events-none absolute -inset-x-2 inset-y-0.5 rounded-lg border border-brand-300/70 bg-brand-500/[0.07] shadow-[0_0_18px_-2px_rgba(60,110,255,0.55),inset_0_0_18px_-8px_rgba(147,174,251,0.9)]"
              />

              {/* The lead running left out of the row, to the figure. */}
              <span
                aria-hidden="true"
                className="spec-lead pointer-events-none absolute right-full top-1/2 hidden h-px w-8 -translate-y-1/2 bg-gradient-to-l from-brand-300 to-brand-300/0 lg:block"
              >
                <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-200 shadow-[0_0_10px_2px_rgba(147,174,251,0.7)]" />
              </span>

              <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-brand-400/25 bg-brand-500/10 text-brand-300 transition-colors [.spec-row:hover_&]:border-brand-300/60 [.spec-row:hover_&]:bg-brand-500/20">
                <SpecMark name={row.kind} className="h-5 w-5" />
              </span>
              <div className="relative min-w-0">
                <dt className="text-sm font-semibold leading-snug text-paper transition-colors [.spec-row:hover_&]:text-brand-100">
                  <Link
                    href={localePath(row.href, lang)}
                    className="rounded-sm after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                  >
                    {row.live ? <LiveBatteryValue label={row.live} /> : row.value}
                  </Link>
                </dt>
                <dd className="mt-0.5 text-xs leading-5 text-paper/55">{row.note}</dd>
              </div>

              {/* Placed entirely from globals.css: beside the machine on a
                  wide screen, over the panel while the line is held on a
                  narrow one. A translate utility here would be overwritten by
                  the transform the open state animates. */}
              <SpecFigure kind={row.kind} lang={lang} />
            </div>
          ))}
        </dl>

        {/* The footer line. All seven states are stacked in the same box so
            the panel never changes height, and only the resting one is in the
            accessibility tree — the six others say the same thing the row
            above them already says. Hidden below lg, where the row it belongs
            to can never be pointed at. */}
        <div className="relative mt-3 hidden h-10 border-t border-white/10 pt-3 lg:block">
          <span
            data-stat="rest"
            className="spec-stat spec-stat-rest absolute inset-x-0 top-3 text-[11px] font-medium leading-4 text-paper/70"
          >
            {c.rest}
          </span>
          <div className="absolute inset-x-0 top-3">
            {list.map((row) => (
              <Stats key={row.kind} kind={row.kind} items={row.stats} />
            ))}
          </div>
        </div>
      </div>

      <Link
        href={localePath("/tilbud-eksempel", lang)}
        className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-300 transition hover:text-paper"
      >
        {c.link}
      </Link>
    </div>
  );
}
