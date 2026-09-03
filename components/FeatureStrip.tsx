import Container from "./Container";
import CraftMark, { type CraftMarkName } from "./CraftMark";
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
  return (
    <div className="relative z-10 border-y border-white/10 bg-ink-950/70">
      <Container>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-5 py-8 sm:grid-cols-3 sm:gap-y-7 sm:py-9 lg:grid-cols-5 lg:gap-x-8">
          {features.map((feature) => (
            <li key={feature.title.da} className="flex items-start gap-3.5">
              {/* A square plate, not a rounded tile: the mark inside it is an
                  orthographic drawing, and a pill around a technical drawing
                  fights it. The hairline is what a drawing sits on. */}
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-white/10 bg-brand-500/[0.07] text-brand-300">
                <CraftMark name={feature.mark} className="h-7 w-7" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-paper">{feature.title[lang]}</p>
                <p className="mt-0.5 text-xs leading-5 text-paper/55">{feature.sub[lang]}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
