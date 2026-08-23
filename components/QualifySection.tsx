import Link from "next/link";
import { ArrowRight, Gauge, Recycle, Building2, Rocket } from "lucide-react";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

const situations = [
  {
    icon: Gauge,
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
    icon: Recycle,
    question: {
      da: "Står I med udstyr, I skal af med?",
      en: "Are you sitting on equipment you need to get rid of?",
    },
    answer: {
      da: "Vi køber brugte erhvervsmaskiner, henter dem og sletter alle data, før de får et nyt liv. I får en vurdering, før I beslutter jer.",
      en: "We buy used business machines, collect them and erase all data before they get a second life. You get a valuation before you decide.",
    },
    href: "/saelg-til-os",
    linkLabel: { da: "Få en vurdering", en: "Get a valuation" },
  },
  {
    icon: Building2,
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
    icon: Rocket,
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
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {c.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {c.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            {c.sub}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2">
          {situations.map((item) => (
            <Link
              key={item.href}
              href={localePath(item.href, lang)}
              className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md sm:block sm:p-8"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 sm:h-11 sm:w-11">
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>

              <div className="flex flex-1 flex-col">
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-700 sm:mt-5 sm:text-lg">
                  {item.question[lang]}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600 sm:mt-2">
                  {item.answer[lang]}
                </p>

                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 sm:mt-5">
                  {item.linkLabel[lang]}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-slate-500">
          {c.footPre}{" "}
          <Link
            href={localePath("/kontakt", lang)}
            className="inline-flex min-h-[44px] items-center font-semibold text-brand-700 hover:text-brand-800"
          >
            {c.footLink}
          </Link>{" "}
          {c.footPost}
        </p>
      </Container>
    </section>
  );
}
