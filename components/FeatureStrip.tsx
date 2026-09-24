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
    /* relative, because the closing strapline is placed against its right
       edge the way the reference sets it — inside the bar, past the last
       item, with a rule between. */
    <div className="relative z-10 border-y border-white/10 bg-ink-950/70">
      <Container>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-5 py-7 sm:grid-cols-3 sm:gap-y-6 sm:py-8 lg:grid-cols-5 lg:gap-x-7 2xl:pr-44">
          {features.map((feature) => (
            <li key={feature.title.da} className="flex items-start gap-3">
              {/* The mark stands on the bar, not in a box.
                  It was in a bordered square plate, and five plates in a row
                  under a photograph read as five buttons — a second row of
                  chrome directly under the two real ones in the hero. The
                  drawing is the mark; the bar it sits on is the frame. */}
              <span className="flex-shrink-0 pt-0.5 text-paper/85">
                <CraftMark name={feature.mark} className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-5 text-paper">
                  {feature.title[lang]}
                </p>
                <p className="mt-0.5 text-xs leading-[1.35] text-paper/55">{feature.sub[lang]}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
      {/* The closing mark. English in both languages, like the rest of the
          editorial set: it is a strapline, not a sentence to translate. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-6 hidden items-center gap-5 2xl:flex"
      >
        <span className="h-12 w-px bg-white/10" />
        <p className="text-[11px] font-medium uppercase leading-[1.9] tracking-[0.3em] text-paper/55">
          Good IT
          <br />
          Goes further
        </p>
      </div>
    </div>
  );
}
