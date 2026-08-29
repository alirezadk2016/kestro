import { ShieldCheck, Keyboard, Briefcase, Leaf, Truck } from "lucide-react";
import Container from "./Container";
import type { Lang } from "@/lib/i18n";

/*
 * The five-second version of the argument, right under the hero: a row of
 * facts a buyer can scan before deciding whether to keep reading. Every
 * claim here is already written out in full somewhere else on the site
 * (Statement, WhyUs, the /ydelser pages) — this is not a fourth version of
 * the pitch, it is a index into the ones that already exist.
 */
const features = [
  {
    icon: ShieldCheck,
    title: { da: "Funktionstestet", en: "Function-tested" },
    sub: { da: "Hver enhed, før den sendes", en: "Every unit, before it ships" },
  },
  {
    icon: Keyboard,
    title: { da: "Nordisk klar", en: "Nordic ready" },
    sub: { da: "Dansk/norsk tastatur & sprog", en: "Danish/Norwegian keyboard & language" },
  },
  {
    icon: Briefcase,
    title: { da: "Erhvervsklasse", en: "Business grade" },
    sub: { da: "Ikke forbrugermodeller", en: "Not consumer models" },
  },
  {
    icon: Leaf,
    title: { da: "Bæredygtigt valg", en: "Sustainable choice" },
    sub: { da: "Færre nye enheder produceret", en: "Fewer new units manufactured" },
  },
  {
    icon: Truck,
    title: { da: "Levering i Norden", en: "Delivery across the Nordics" },
    sub: { da: "Til Danmark og Norge", en: "To Denmark and Norway" },
  },
] satisfies {
  icon: typeof ShieldCheck;
  title: Record<Lang, string>;
  sub: Record<Lang, string>;
}[];

export default function FeatureStrip({ lang }: { lang: Lang }) {
  return (
    <div className="relative z-10 border-y border-white/10 bg-ink-950/70">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-7 py-8 sm:grid-cols-3 sm:py-9 lg:grid-cols-5 lg:gap-x-8">
          {features.map((feature) => (
            <li key={feature.title.da} className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                <feature.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
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
