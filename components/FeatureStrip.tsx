import Container from "./Container";
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
  return (
    <div className="relative z-10 border-y border-white/10 bg-ink-950/70">
      <Container>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-5 py-7 sm:grid-cols-3 sm:gap-y-6 sm:py-8 lg:grid-cols-5 lg:gap-x-7">
          {features.map((feature) => (
            <li key={feature.title.da} className="flex items-center gap-3.5">
              {/* In the site's one mark tile. Bare on the bar, the five marks
                  were line drawings floating on a strip of navy — the row a
                  buyer sees first, reading as a system icon font. The tile is
                  lit from the top left and has no hard border, so five of
                  them read as a set of facts rather than as five buttons. */}
              <MarkTile name={feature.mark} size="md" />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-5 text-paper">
                  {feature.title[lang]}
                </p>
                <p className="mt-0.5 text-xs leading-[1.35] text-paper/70">{feature.sub[lang]}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
