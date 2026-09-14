import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import CraftMark, { type CraftMarkName } from "./CraftMark";
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

/* One mark per station, in the order the steps run. Kept beside the component
   rather than in lib/services.ts: these four are the front page's summary of
   the process, not the service records themselves. */
const STEP_MARKS: CraftMarkName[] = ["network", "tested", "nordic", "delivery"];

export default function Services({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="stage py-10 sm:py-20" data-reveal>
      <Container>
        <div className="max-w-3xl">
          <span className="eyebrow text-brand-300">{c.eyebrow}</span>
          <h2 className="mt-5 text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-[1.75] text-paper/70">{c.sub}</p>
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
        <ol className="mt-12 grid grid-cols-1 gap-x-6 lg:grid-cols-4 lg:gap-x-0 lg:border-t lg:border-paper/15">
          {services.map((service, i) => (
            <li
              key={service.title.da}
              className="relative flex gap-5 pb-9 last:pb-0 lg:block lg:gap-0 lg:py-9 lg:pb-9 lg:pl-8 lg:pr-8 lg:first:pl-0"
            >
              {/*
               * The rail, on the screens the spine used to skip.
               *
               * The horizontal version of this idea has existed since the
               * four columns were built, and it was drawn `hidden lg:flex` —
               * so the whole graphic argument of the section lived on the
               * desktop and a phone got four rows separated by hairlines,
               * which reads as a table. A stack is not automatically a
               * sequence; a rule between two rows says they are separate,
               * which is the opposite of what four steps are.
               *
               * Same idea, turned ninety degrees: one line running down
               * through all four, each step a station on it, the mark saying
               * what happens there. It stops at the last station rather than
               * running off the end, because the process does.
               */}
              <div aria-hidden="true" className="relative w-11 flex-none lg:hidden">
                {i < services.length - 1 && (
                  <span className="absolute left-1/2 top-12 h-[calc(100%-2.25rem)] w-px -translate-x-1/2 bg-gradient-to-b from-brand-400/50 via-paper/14 to-paper/5" />
                )}
                <span className="plate-sm relative flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/[0.12] text-paper/90">
                  <CraftMark name={STEP_MARKS[i] ?? "adjust"} className="h-6 w-6" />
                </span>
              </div>

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

              <div className="min-w-0 flex-1 lg:flex-none">
                {/*
                  The step drawn as well as numbered.

                  Four numerals over four paragraphs is a sequence a reader has
                  to take on trust: nothing about "02" says testing. The mark
                  says what happens at the station — the suppliers reached, the
                  lens over the work, the Nordic key, the van — so the route can
                  be read at a glance and the numeral goes back to doing what a
                  numeral is for, which is order.

                  Below lg the mark is the station on the rail, so it is not
                  drawn twice.
                */}
                <span className="plate-sm mb-5 hidden h-11 w-11 items-center justify-center rounded-lg bg-brand-500/[0.10] text-paper/90 lg:flex">
                  <CraftMark name={STEP_MARKS[i] ?? "adjust"} className="h-6 w-6" />
                </span>
                <span className="font-mono text-xs font-semibold tabular-nums tracking-[0.2em] text-brand-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-base font-bold tracking-tight text-paper lg:text-lg">
                  {service.title[lang]}
                </h3>
                <p className="mt-2 text-sm leading-[1.6] text-paper/65">
                  {service.description[lang]}
                </p>
              </div>
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
