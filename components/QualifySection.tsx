import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "./Container";
import { type CraftMarkName } from "./CraftMark";
import { localePath, type Lang } from "@/lib/i18n";
import ForgedPanel from "@/components/ForgedPanel";
import MarkTile from "@/components/MarkTile";

const situations = [
  {
    question: {
      da: "Har I computere, der er blevet for langsomme?",
      en: "Have your computers become too slow?",
    },
    answer: {
      da: "Ofte er det batteriet, RAM eller disken. Vi opgraderer i stedet for at udskifte – når det kan betale sig.",
      en: "Often it is the battery, the memory or the disk. We upgrade instead of replacing — when it pays.",
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
      da: "Vi køber og henter brugte erhvervsmaskiner og sletter lagermedierne. I får en vurdering, før I beslutter jer.",
      en: "We buy and collect used business machines and erase the storage. You get a valuation before you decide.",
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
      da: "Fra ti maskiner til hele flåden. Samme konfiguration hele vejen rundt, de specifikationer, opgaven kræver, og mulighed for at bytte det gamle ind.",
      en: "From ten machines to the whole fleet. The same configuration throughout, the specifications the work actually needs, and the option to trade the old kit in.",
    },
    /* The same three things as the answer, set as the list they are, for
       the large panel where a sentence would leave half of it empty. */
    lead: { da: "Fra ti maskiner til hele flåden.", en: "From ten machines to the whole fleet." },
    points: [
      { da: "Samme konfiguration på hver maskine", en: "The same configuration on every machine" },
      {
        da: "De specifikationer, opgaven kræver",
        en: "The specifications the work actually needs",
      },
      { da: "Mulighed for at bytte det gamle ind", en: "The option to trade the old kit in" },
    ],
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
      da: "Udstyret valgt, klargjort og leveret samlet – klar til første arbejdsdag.",
      en: "Equipment chosen, prepared and delivered together — ready for the first day of work.",
    },
    mark: "delivery" as CraftMarkName,
    href: "/kontakt",
    linkLabel: { da: "Tal med os om opstart", en: "Talk to us about setup" },
  },
];

const copy = {
  da: {
    title: "Genkender I én af disse?",
    sub: "I beskriver situationen – vi skaffer, klargør og sender en pris.",
    footPre: "Passer ingen af dem?",
    footLink: "Skriv til os",
    footPost: "– et spørgsmål er nok til at starte.",
  },
  en: {
    title: "Recognise any of these?",
    sub: "You describe the situation — we source, prepare and send a price.",
    footPre: "None of them fit?",
    footLink: "Write to us",
    footPost: "— a question is enough to start.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function QualifySection({ lang }: { lang: Lang }) {
  const c = copy[lang];
  /* Buying for a team is the core of the business, so it leads. */
  const featured = situations.find((item) => item.href === "/flaadeloesninger") ?? situations[0];
  const rest = situations.filter((item) => item !== featured);

  return (
    <section className="border-y border-white/10 bg-ink-900 py-14 sm:py-28">
      <Container>
        <div className="max-w-3xl">
          <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-[1.75] text-paper/75">{c.sub}</p>
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
        {/*
         * One door large, three beside it.
         *
         * Four equal cards in a 2x2 with a mark on top and an ordinal in the
         * corner was the icon-tile grid every generated page ships, and the
         * ordinals numbered things that are not a sequence. The four are
         * parallel doors into the business, but they are not equal: buying
         * for a team is the core of what Kestro does, so that one is the
         * large panel and the other three sit beside it as compact rows with
         * the mark inline.
         */}
        <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {[featured].map((item) => (
            <li key={item.href} className="lg:col-span-5">
              <ForgedPanel
                href={localePath(item.href, lang)}
                faceClassName="h-full justify-between p-7 sm:p-9"
              >
                <div>
                  <MarkTile name={item.mark} size="lg" className="tile-z tile-z-near" />
                  <h3 className="mt-8 text-balance font-display text-2xl font-extrabold leading-tight tracking-display text-paper transition-colors group-hover:text-brand-100 sm:text-3xl">
                    {item.question[lang]}
                  </h3>
                  {item.points ? (
                    <>
                      <p className="mt-4 text-base leading-[1.75] text-paper/75">
                        {item.lead?.[lang]}
                      </p>
                      <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                        {item.points.map((point) => (
                          <li
                            key={point.da}
                            className="flex items-start gap-3 text-base leading-[1.6] text-paper/85"
                          >
                            <Check
                              aria-hidden="true"
                              className="mt-1 h-4 w-4 flex-none text-brand-300"
                              strokeWidth={2}
                            />
                            {point[lang]}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-4 text-base leading-[1.75] text-paper/75">
                      {item.answer[lang]}
                    </p>
                  )}
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                  {item.linkLabel[lang]}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </ForgedPanel>
            </li>
          ))}
          <li className="lg:col-span-7">
            <ul className="grid h-full grid-cols-1 gap-4">
              {rest.map((item) => (
                <li key={item.href}>
                  <ForgedPanel href={localePath(item.href, lang)} faceClassName="h-full p-5 sm:p-6">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <MarkTile
                        name={item.mark}
                        size="md"
                        className="tile-z tile-z-near flex-none"
                      />
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-100 sm:text-lg">
                          {item.question[lang]}
                        </h3>
                        <p className="mt-1.5 text-sm leading-[1.7] text-paper/75">
                          {item.answer[lang]}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                          {item.linkLabel[lang]}
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            strokeWidth={2}
                          />
                        </span>
                      </div>
                    </div>
                  </ForgedPanel>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <p className="mt-10 max-w-2xl text-sm leading-[1.6] text-paper/75">
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
