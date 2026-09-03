import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
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
          <h2 className="mt-5 text-balance font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-paper/65">{c.sub}</p>
        </div>

        {/*
         * The gap between the columns is padding, not a grid gap.
         *
         * With gap-x-12 the rule across the top ran the full width while every
         * rule between the rows was cut in half by the gap — so the same table
         * was ruled two different ways, once continuously and three times
         * broken. Grid stretches both cells in a row to the same height, so
         * with the space moved inside the cells their bottom borders meet and
         * each rule runs unbroken like the one above them.
         *
         * No vertical rule between the columns on purpose: the 01-04 index
         * already separates the four, and a fence down the middle would do to
         * this section what it did to the process row.
         */}
        <ol className="mt-10 grid grid-cols-1 border-t border-paper/15 md:grid-cols-2">
          {situations.map((item, i) => (
            <li
              key={item.href}
              className="border-b border-paper/10 md:odd:pr-6 md:even:pl-6"
            >
              <Link
                href={localePath(item.href, lang)}
                className="group -mx-4 block rounded-xl px-4 py-5 transition-colors hover:bg-white/5 sm:py-7"
              >
                <div className="flex gap-5">
                  <span className="pt-1 font-display text-sm font-semibold tabular-nums text-paper/55 transition-colors group-hover:text-brand-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:text-xl">
                      {item.question[lang]}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-paper/65 sm:mt-3 sm:text-base sm:leading-7">
                      {item.answer[lang]}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                      {item.linkLabel[lang]}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        strokeWidth={2}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-2xl text-sm leading-7 text-paper/65">
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
