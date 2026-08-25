import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

const services = [
  {
    title: { da: "Sourcing & indkøb", en: "Sourcing and purchasing" },
    description: {
      da: "Vi udvælger brugte erhvervscomputere af høj kvalitet fra pålidelige leverandører i Sydeuropa.",
      en: "We pick good used business computers from reliable suppliers in southern Europe.",
    },
  },
  {
    title: { da: "Klargøring & test", en: "Preparation and testing" },
    description: {
      da: "Hver enhed funktionstestes, opgraderes med mere RAM og får styresystemet sat op fra bunden.",
      en: "Every machine goes through a full function test, gets more memory where needed and is reset to factory state.",
    },
  },
  {
    title: { da: "Nordisk tilpasning", en: "Nordic preparation" },
    description: {
      da: "Dansk/nordisk tastaturlayout, sprogopsætning og mærkning – klar til brug fra dag ét.",
      en: "Danish or Norwegian keyboard layout, language setup and labelling — ready to use from day one.",
    },
  },
  {
    title: { da: "Levering til virksomheder", en: "Delivery to companies" },
    description: {
      da: "Fleksible mængder og hurtig B2B-levering til virksomheder i Danmark og Norge.",
      en: "Flexible quantities and quick B2B delivery to companies in Denmark and Norway.",
    },
  },
];

const copy = {
  da: {
    eyebrow: "Processen",
    title: "Fra brugt til klar til brug",
    sub: "Fra maskinen står i Sydeuropa, til den er sat op på et skrivebord i Danmark eller Norge.",
    link: "Se hele processen",
  },
  en: {
    eyebrow: "The process",
    title: "From used to ready to use",
    sub: "From the machine sitting in southern Europe to it being set up on a desk in Denmark or Norway.",
    link: "See the whole process",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Services({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="border-b border-paper-edge bg-paper py-14 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <span className="eyebrow text-brand-600">{c.eyebrow}</span>
          <h2 className="mt-5 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-display text-ink-900">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-ink-600">{c.sub}</p>
        </div>

        <ol className="mt-12 grid grid-cols-1 border-t border-ink-900/12 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <li
              key={service.title.da}
              className="border-b border-ink-900/10 py-7 pr-8 sm:border-b-0 sm:border-r sm:border-ink-900/10 sm:pl-8 sm:first:pl-0 lg:last:border-r-0"
            >
              <span className="font-display text-3xl font-extrabold tabular-nums tracking-display text-ink-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink-900">
                {service.title[lang]}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-600">{service.description[lang]}</p>
            </li>
          ))}
        </ol>

        <Link
          href={localePath("/ydelser", lang)}
          className="group mt-10 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {c.link}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
      </Container>
    </section>
  );
}
