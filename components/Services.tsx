import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

const services = [
  {
    title: { da: "Sourcing & indkøb", en: "Sourcing and purchasing" },
    description: {
      da: "Vi finder brugte erhvervscomputere i vores leverandørnetværk i Sydeuropa – valgt efter opgaven, ikke efter hvad der står på et lager.",
      en: "We find used business computers through our supplier network in southern Europe — chosen for the job, not for what is in a warehouse.",
    },
  },
  {
    title: { da: "Klargøring & test", en: "Preparation and testing" },
    description: {
      da: "Enhederne funktionstestes og får styresystemet sat op fra bunden. Skal der mere RAM eller en større disk i, opgraderer vi maskinen.",
      en: "The machines are function-tested and have the operating system set up from scratch. If more memory or a larger disk is needed, we upgrade it.",
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
      da: "Fleksible mængder til virksomheder i Danmark og Norge. Tidsrammen oplyser vi, før I bestiller.",
      en: "Flexible quantities for companies in Denmark and Norway. We give you the timeframe before you order.",
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
    <section className="stage py-12 sm:py-24" data-reveal>
      <Container>
        <div className="max-w-3xl">
          <span className="eyebrow text-brand-300">{c.eyebrow}</span>
          <h2 className="mt-5 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-paper/70">{c.sub}</p>
        </div>

        {/*
         * A spine with a station at each step, not four columns in a fence.
         *
         * This used to divide the four steps with vertical rules. Two things
         * were wrong with that. A rule between two things says they are
         * separate, and these are the opposite — they are one sequence, and
         * the only thing saying so was the numerals. And because the four
         * texts are different lengths, the rules ran on past the shortest
         * column and the row ended ragged.
         *
         * So the rules are gone and the line that was already across the top
         * does the work: it runs unbroken through all four, and each step
         * marks its place on it with a node and a drop tick. The eye reads
         * left to right along a route, which is what the section is about.
         *
         * Below lg the steps stack, and a stack is already a sequence — there
         * the horizontal dividers stay and the nodes are not drawn.
         */}
        <ol className="mt-12 grid grid-cols-1 gap-x-6 border-t border-paper/15 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
          {services.map((service, i) => (
            <li
              key={service.title.da}
              className="relative border-b border-paper/12 py-6 lg:border-b-0 lg:py-9 lg:pl-8 lg:pr-8 lg:first:pl-0"
            >
              <span
                aria-hidden="true"
                /* Unfilled, so the spine shows through it rather than being
                   painted over with a background that would have to match a
                   gradient. */
                className={`pointer-events-none absolute top-0 hidden flex-col items-start lg:flex ${
                  i === 0 ? "left-0" : "left-8"
                }`}
              >
                <span className="-mt-[4px] h-[7px] w-[7px] rotate-45 border border-brand-300" />
                <span className="ml-[3px] h-5 w-px bg-gradient-to-b from-paper/25 to-transparent" />
              </span>
              <span className="font-display text-2xl font-extrabold tabular-nums tracking-display text-brand-300 lg:text-3xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-base font-bold tracking-tight text-paper lg:mt-4 lg:text-lg">
                {service.title[lang]}
              </h3>
              <p className="mt-2 text-sm leading-6 text-paper/65">{service.description[lang]}</p>
            </li>
          ))}
        </ol>

        <Link
          href={localePath("/ydelser", lang)}
          className="group mt-12 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
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
