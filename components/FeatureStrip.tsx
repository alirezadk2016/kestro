import Container from "./Container";
import Ticker from "./Ticker";
import MarkTile from "@/components/MarkTile";
import { type CraftMarkName } from "./CraftMark";
import type { Lang } from "@/lib/i18n";

/*
 * The five-second version of the argument, right under the hero: a row of
 * facts a buyer can scan before deciding whether to keep reading. Every
 * claim here is already written out in full somewhere else on the site
 * (Statement, WhyUs, the /ydelser pages) — this is not a fourth version of
 * the pitch, it is a index into the ones that already exist.
 *
 * The marks are drawn for this site rather than picked from an icon set —
 * see components/CraftMark.tsx for why, and for the rules they share. This is
 * the first row below the hero, so it is where a visitor decides whether the
 * site was made or assembled.
 */
const features = [
  {
    mark: "tested",
    title: { da: "Funktionstestet", en: "Function-tested" },
    sub: { da: "Før maskinen sendes videre", en: "Before the machine ships" },
  },
  {
    mark: "nordic",
    title: { da: "Nordisk klar", en: "Nordic ready" },
    sub: { da: "Dansk/norsk tastatur & sprog", en: "Danish/Norwegian keyboard & language" },
  },
  {
    mark: "business",
    title: { da: "Erhvervsklasse", en: "Business grade" },
    sub: { da: "Ikke forbrugermodeller", en: "Not consumer models" },
  },
  {
    mark: "sustainable",
    title: { da: "Bæredygtigt valg", en: "Sustainable choice" },
    sub: { da: "Færre nye enheder produceret", en: "Fewer new units manufactured" },
  },
  {
    mark: "delivery",
    title: { da: "Levering i Norden", en: "Delivery across the Nordics" },
    sub: { da: "Til Danmark og Norge", en: "To Denmark and Norway" },
  },
] satisfies {
  mark: CraftMarkName;
  title: Record<Lang, string>;
  sub: Record<Lang, string>;
}[];

export default function FeatureStrip({ lang }: { lang: Lang }) {
  /*
   * On a phone, all five facts in one line that runs by itself and stops
   * under a finger (components/Ticker.tsx). They were two tiles stacked on
   * top of each other with the other three hidden, which read as a leftover
   * list rather than as the strip it is on a wide screen. Each fact sits on
   * the site's own plate there, so the row reads as five things passing
   * rather than as text sliding over a band.
   *
   * The second list is the same five again for the loop: hidden from
   * assistive technology, unreachable by keyboard, and not drawn at all from
   * md, where the first list is the grid it always was.
   */
  const items = features.map((feature) => (
    <li
      key={feature.title.da}
      className="flex items-center gap-3.5 max-md:plate max-md:mr-3 max-md:shrink-0 max-md:rounded-2xl max-md:py-2.5 max-md:pl-2.5 max-md:pr-5"
    >
      {/* In the site's one mark tile. Bare on the bar, the five marks
          were line drawings floating on a strip of navy — the row a
          buyer sees first, reading as a system icon font. The tile is
          lit from the top left and has no hard border, so five of
          them read as a set of facts rather than as five buttons. */}
      <MarkTile name={feature.mark} size="md" />
      <div className="min-w-0 max-md:whitespace-nowrap">
        <p className="text-[13px] font-semibold leading-5 text-paper">{feature.title[lang]}</p>
        <p className="mt-0.5 text-xs leading-[1.35] text-paper/75">{feature.sub[lang]}</p>
      </div>
    </li>
  ));

  return (
    <div className="relative z-10 border-y border-white/10 bg-ink-950/70">
      <Container className="max-md:px-0">
        <Ticker>
          <ul className="flex py-4 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-6 md:py-8 lg:grid-cols-5 lg:gap-x-7">
            {items}
          </ul>
          <ul aria-hidden="true" inert className="flex py-4 md:hidden">
            {items}
          </ul>
        </Ticker>
      </Container>
    </div>
  );
}
