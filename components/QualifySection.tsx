import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import CraftMark, { type CraftMarkName } from "./CraftMark";
import { localePath, type Lang } from "@/lib/i18n";

const situations = [
  {
    question: {
      da: "Har I computere, der er blevet for langsomme?",
      en: "Have your computers become too slow?",
    },
    answer: {
      da: "Ofte er det ét batteri, for lidt RAM eller en langsom disk. Vi opgraderer i stedet for at udskifte – og siger det ærligt, hvis det ikke kan betale sig.",
      en: "Often it is one battery, too little memory or a slow disk. We upgrade instead of replacing — and say so honestly when it is not worth it.",
    },
    mark: "adjust" as CraftMarkName,
    href: "/reparation",
    linkLabel: { da: "Se opgradering", en: "See upgrades" },
  },
  {
    question: {
      da: "Står I med udstyr, I skal af med?",
      en: "Are you sitting on equipment you need to get rid of?",
    },
    answer: {
      da: "Vi køber brugte erhvervsmaskiner og henter dem. Er der data på enhederne, sletter vi lagermedierne, før de får et nyt liv. I får en vurdering, før I beslutter jer.",
      en: "We buy used business machines and collect them. If there is data on the units, we erase the storage media before they get a second life. You get a valuation before you decide.",
    },
    mark: "sustainable" as CraftMarkName,
    href: "/saelg-til-os",
    linkLabel: { da: "Få en vurdering", en: "Get a valuation" },
  },
  {
    question: {
      da: "Skal I købe ind til flere medarbejdere?",
      en: "Do you need to buy for several employees?",
    },
    answer: {
      da: "Fra ti maskiner til hele flåden. Samme konfiguration hele vejen rundt, de specifikationer opgaven kræver, og mulighed for at bytte det gamle ind.",
      en: "From ten machines to the whole fleet. The same configuration throughout, the specifications the work actually needs, and the option to trade the old kit in.",
    },
    mark: "batch" as CraftMarkName,
    href: "/flaadeloesninger",
    linkLabel: { da: "Se flådeløsninger", en: "See fleet solutions" },
  },
  {
    question: {
      da: "Skal en ny virksomhed sættes op fra bunden?",
      en: "Are you setting up a new company from scratch?",
    },
    answer: {
      da: "Skal arbejdspladserne stå klar til første arbejdsdag, hjælper vi med at vælge udstyret, klargøre det og få det leveret samlet.",
      en: "If the desks have to be ready for the first day of work, we help choose the equipment, prepare it and deliver it all at once.",
    },
    mark: "delivery" as CraftMarkName,
    href: "/kontakt",
    linkLabel: { da: "Tal med os om opstart", en: "Talk to us about setup" },
  },
];

const copy = {
  da: {
    eyebrow: "Hvor står I?",
    title: "Genkender I én af disse?",
    sub: "Vi er specialister i at koble virksomheder sammen med de rigtige leverandører – dem der leverer professionel kvalitet til en fornuftig pris. I slipper for at lede, forhandle og vurdere. Det er vores arbejde.",
    footPre: "Passer jeres situation ikke helt ind i én af kasserne?",
    footLink: "Skriv til os",
    footPost: "– de fleste henvendelser starter med et spørgsmål, ikke en bestilling.",
  },
  en: {
    eyebrow: "Where are you?",
    title: "Recognise any of these?",
    sub: "What we are good at is connecting companies with the right suppliers — the ones that deliver professional quality at a sensible price. You avoid the searching, the negotiating and the judging. That is our job.",
    footPre: "Does your situation not quite fit one of the boxes?",
    footLink: "Write to us",
    footPost: "— most enquiries start with a question, not an order.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function QualifySection({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <section className="border-y border-white/10 bg-ink-900 py-10 sm:py-20" data-reveal>
      <Container>
        <div className="max-w-3xl">
          <span className="eyebrow text-brand-300">{c.eyebrow}</span>
          <h2 className="mt-5 text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-[1.75] text-paper/65">{c.sub}</p>
        </div>

        {/*
         * Cards, not ruled rows.
         *
         * This was four entries in a two-column table separated by hairlines,
         * and on a page that is already mostly hairlines and type it read as
         * the terms and conditions rather than as the four doors into the
         * business — which is what this section is. These are the highest
         * intent moments on the front page: a visitor who recognises their own
         * situation here is the one who writes to us.
         *
         * Each carries the mark of what happens next — the values we change,
         * the second life, the lot, the delivery — so the four are told apart
         * by a picture before a word of them is read. A surface and a border
         * that both answer to hover give the row something to be pressed,
         * which a rule between two paragraphs never does.
         */}
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {situations.map((item, i) => (
            <li key={item.href}>
              <Link
                href={localePath(item.href, lang)}
                className="group relative flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6 transition duration-200 hover:border-brand-400/40 hover:bg-white/[0.06] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center plate-sm rounded-lg bg-brand-500/[0.10] text-paper/90 transition-colors group-hover:text-brand-200">
                    <CraftMark name={item.mark} className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-paper/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-100 sm:text-xl">
                  {item.question[lang]}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-[1.75] text-paper/65 sm:text-base sm:leading-[1.75]">
                  {item.answer[lang]}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                  {item.linkLabel[lang]}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-2xl text-sm leading-[1.6] text-paper/65">
          {c.footPre}{" "}
          <Link
            href={localePath("/kontakt", lang)}
            className="font-semibold text-brand-300 underline decoration-brand-400/60 decoration-2 underline-offset-4 hover:text-paper"
          >
            {c.footLink}
          </Link>{" "}
          {c.footPost}
        </p>
      </Container>
    </section>
  );
}
