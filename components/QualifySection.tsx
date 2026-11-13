import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

const routes = [
  {
    href: "/flaadeloesninger",
    title: { da: "Indkøb til et helt team", en: "Equipment for a whole team" },
    body: {
      da: "Sammenhæng i modeller, opsætning og budget.",
      en: "Consistency across models, setup and budget.",
    },
  },
  {
    href: "/reparation",
    title: { da: "Behold og opgrader", en: "Keep it and upgrade" },
    body: {
      da: "Undersøg, om jeres nuværende computer kan mere.",
      en: "Explore whether your current computer has more to give.",
    },
  },
  {
    href: "/saelg-til-os",
    title: { da: "Sælg jeres brugte udstyr", en: "Sell your used equipment" },
    body: {
      da: "Start med en vurdering af det, I skal af med.",
      en: "Start with an assessment of the equipment you are replacing.",
    },
  },
];

export default function QualifySection({ lang }: { lang: Lang }) {
  return (
    <section className="border-b border-white/10 py-10 sm:py-14">
      <Container>
        <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
          {lang === "da" ? "Har I allerede udstyr?" : "Already have equipment?"}
        </h2>
        <ul className="mt-5 grid gap-3 lg:grid-cols-3">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={localePath(route.href, lang)}
                className="plate plate-lift group flex h-full items-center justify-between gap-5 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
              >
                <span>
                  <span className="block text-base font-semibold leading-6 text-paper group-hover:text-brand-200">
                    {route.title[lang]}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-paper/70">
                    {route.body[lang]}
                  </span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-brand-300" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
