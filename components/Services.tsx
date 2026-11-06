import Link from "next/link";
import MarkTile from "@/components/MarkTile";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { type CraftMarkName } from "./CraftMark";
import { localePath, type Lang } from "@/lib/i18n";

const services = [
  {
    title: { da: "Sourcing og indkøb", en: "Sourcing and purchasing" },
    description: {
      da: "Vi finder brugte erhvervscomputere i vores leverandørnetværk i Sydeuropa – valgt efter opgaven, ikke efter, hvad der står på et lager.",
      en: "We find used business computers through our supplier network in southern Europe — chosen for the job, not for what is in a warehouse.",
    },
  },
  {
    title: { da: "Klargøring og test", en: "Preparation and testing" },
    description: {
      da: "Enhederne funktionstestes og får styresystemet sat op fra bunden. Skal der mere RAM eller en større disk i, opgraderer vi maskinen.",
      en: "The machines are function-tested and have the operating system set up from scratch. If more memory or a larger disk is needed, we upgrade it.",
    },
  },
  {
    title: { da: "Nordisk tilpasning", en: "Nordic preparation" },
    description: {
      da: "Dansk eller norsk tastatur, fysisk skiftet, og Windows sat op på dansk eller norsk – klar til brug fra dag ét.",
      en: "A Danish or Norwegian keyboard, physically swapped, and Windows set up in Danish or Norwegian — ready to use from day one.",
    },
  },
  {
    title: { da: "Levering til virksomheder", en: "Delivery to companies" },
    description: {
      da: "Fra én maskine til hele flåden, til virksomheder i Danmark og Norge. Tidsrammen oplyser vi, før I bestiller.",
      en: "From one machine to the whole fleet, for companies in Denmark and Norway. We give you the timeframe before you order.",
    },
  },
];

const copy = {
  da: {
    title: "Fra brugt til klar til brug",
    sub: "Fra maskinen står i Sydeuropa, til den er sat op på et skrivebord i Danmark eller Norge.",
    link: "Se hele processen",
    step: "Trin",
  },
  en: {
    title: "From used to ready to use",
    sub: "From the machine sitting in southern Europe to it being set up on a desk in Denmark or Norway.",
    link: "See the whole process",
    step: "Step",
  },
} satisfies Record<Lang, Record<string, string>>;

/* One mark per station, in the order the steps run. Kept beside the component
   rather than in lib/services.ts: these four are the front page's summary of
   the process, not the service records themselves. */
const STEP_MARKS: CraftMarkName[] = ["network", "tested", "nordic", "delivery"];

export default function Services({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="stage py-12 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-[1.75] text-paper/75">{c.sub}</p>
        </div>

        {/*
         * One route, four stations, and the station is the mark.
         *
         * The first spine drew the route as a hairline with a 7px diamond at
         * each step, a tick dropping from it to a mark tile that floated
         * below the line, and a monospace "01" set beside the tile: three
         * markers for one step, none of them touching the line, so the line
         * read as a rule over four unrelated columns. Seen at 1920 the owner
         * called it amateur, and it was.
         *
         * Now the mark tile sits on the route itself: one line through the
         * middle of the four tiles, broken only where a tile stands on it,
         * brighter as it leaves a station and fading as it reaches the next.
         * The step number is a word, "Trin 1", in the label style the rest
         * of the site uses, over the step's name.
         *
         * Below lg the same route runs down the left edge of the stack.
         */}
        <ol className="mt-10 grid grid-cols-1 sm:mt-12 lg:grid-cols-4 lg:gap-x-8 xl:gap-x-12">
          {services.map((service, i) => {
            const last = i === services.length - 1;
            return (
              <li
                key={service.title.da}
                className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0"
              >
                <div aria-hidden="true" className="relative flex-none lg:mb-6">
                  <MarkTile name={STEP_MARKS[i] ?? "adjust"} size="lg" className="relative z-10" />
                  {!last && (
                    <>
                      {/* Down the stack, from under this tile to the next. */}
                      <span className="absolute left-7 top-[68px] h-[calc(100%-40px)] w-px -translate-x-1/2 bg-gradient-to-b from-brand-400/60 to-paper/10 lg:hidden" />
                      {/* Across the row, from this tile's edge to the next
                          one's, leaving 12px of air at both ends. */}
                      <span className="absolute left-[68px] top-7 hidden h-px w-[calc(100%+var(--gap)-80px)] bg-gradient-to-r from-brand-400/70 to-paper/15 lg:block [--gap:2rem] xl:[--gap:3rem]" />
                    </>
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-1 lg:pt-0">
                  <p className="eyebrow text-brand-300">
                    {c.step} {i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-paper">
                    {service.title[lang]}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.65] text-paper/75 lg:pr-2">
                    {service.description[lang]}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <Link
          href={localePath("/ydelser", lang)}
          className="group mt-10 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
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
