import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { localePath, metaFor, type Lang } from "@/lib/i18n";

/*
 * The quote, as its own page.
 *
 * Every "Få et tilbud" on the site used to land on /kontakt, which is a name,
 * an email and a blank box. A buyer who wants twenty machines has to invent a
 * specification from memory, and what arrives is usually "hvad koster en brugt
 * bærbar?" — a question no one can answer without knowing quantity, memory,
 * disk and keyboard, so the first reply is a list of questions and the quote is
 * a day later than it needed to be.
 *
 * This page asks those four things up front, with "ved ikke endnu" as a real
 * answer on every one of them, and says what happens after send. /kontakt stays
 * what it is: a way to reach a person about anything else.
 */

const copy = {
  da: {
    metaTitle: "Få et tilbud på brugt erhvervs-IT | Kestro",
    metaDescription:
      "Fortæl os antal, specifikation og hvornår det skal stå klar, så vender vi tilbage med pris per enhed, stand og leveringstid. Uforpligtende.",
    title: "Få et tilbud",
    lead: "Prisen afhænger af konfiguration, stand og antal, så den bliver regnet på jeres konkrete behov frem for på en liste. Udfyld det, I ved – resten kan stå som “ved ikke endnu”.",
    formTitle: "Jeres forespørgsel",
    nextTitle: "Hvad sker der, når I sender",
    nextSteps: [
      "Vi læser forespørgslen og spørger ind, hvis noget mangler.",
      "Vi finder maskinerne i leverandørnetværket og sender et tilbud med pris per enhed, stand, antal og leveringstid.",
      "I godkender – eller siger nej. Der er ingen binding i at spørge.",
    ],
    speedTitle: "Det gør svaret hurtigere",
    speedPoints: [
      "Antal, og om der skal skærme, docks eller kabler med.",
      "Hvad maskinerne skal bruges til – kontorarbejde, konstruktion, billedarbejde.",
      "Hvornår udstyret skal stå klar hos jer.",
      "Om I samtidig skal af med ældre maskiner.",
    ],
    trustTitle: "Inden I skriver",
    trustLinks: [
      { href: "/tilbud-eksempel", label: "Se et eksempel på et tilbud" },
      { href: "/priser", label: "Hvad afgør prisen" },
      { href: "/kvalitet", label: "Sådan vurderer vi stand og kvalitet" },
    ],
    otherTitle: "Noget helt andet?",
    otherBody: "Skal I ikke bruge et tilbud, men have fat i et menneske, er kontaktsiden vejen.",
    otherLink: "Kontakt os",
  },
  en: {
    metaTitle: "Get a quote on used business IT | Kestro",
    metaDescription:
      "Tell us the quantity, the specification and when it has to be ready, and we come back with price per unit, condition and lead time. No obligation.",
    title: "Get a quote",
    lead: "The price depends on configuration, condition and quantity, so it is worked out against what you actually need rather than read off a list. Fill in what you know — the rest can stay at “not sure yet”.",
    formTitle: "Your request",
    nextTitle: "What happens when you send it",
    nextSteps: [
      "We read the request and ask if anything is missing.",
      "We find the machines in our supplier network and send a quote with price per unit, condition, quantity and lead time.",
      "You approve — or you say no. Asking commits you to nothing.",
    ],
    speedTitle: "This makes the answer faster",
    speedPoints: [
      "Quantity, and whether monitors, docks or cables go with it.",
      "What the machines are for — office work, engineering, image work.",
      "When the equipment has to be ready at your end.",
      "Whether you are also getting rid of older machines.",
    ],
    trustTitle: "Before you write",
    trustLinks: [
      { href: "/tilbud-eksempel", label: "See an example quote" },
      { href: "/priser", label: "What decides the price" },
      { href: "/kvalitet", label: "How we assess condition and quality" },
    ],
    otherTitle: "Something else entirely?",
    otherBody:
      "If you do not need a quote but want to reach a person, the contact page is the way.",
    otherLink: "Contact us",
  },
} as const;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/tilbud", params.lang),
  };
}

export default function QuotePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const c = copy[lang];

  return (
    <section className="lit lit-paper py-10 sm:py-24">
      <Container>
        <div className="mx-auto max-w-5xl">
          <h1 className="max-w-3xl text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-paper">
            {c.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8 text-paper/70">{c.lead}</p>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="border border-white/10 bg-white/[0.04] p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-lg font-bold tracking-tight text-paper">
                {c.formTitle}
              </h2>
              <div className="mt-6">
                {/* The form reads ?model= and ?antal= itself, so this page
                    stays prerendered. */}
                <ContactForm lang={lang} quote />
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-l-2 border-brand-400 bg-white/5 p-6">
                <h2 className="font-display text-base font-bold tracking-tight text-paper">
                  {c.nextTitle}
                </h2>
                <ol className="mt-4 space-y-3">
                  {c.nextSteps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm leading-6 text-paper/70">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600/25 text-xs font-bold text-brand-200"
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="font-display text-base font-bold tracking-tight text-paper">
                  {c.speedTitle}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {c.speedPoints.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-6 text-paper/65">
                      <Check
                        className="mt-1 h-4 w-4 flex-shrink-0 text-brand-300"
                        strokeWidth={2.5}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="font-display text-base font-bold tracking-tight text-paper">
                  {c.trustTitle}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {c.trustLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={localePath(link.href, lang)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-paper"
                      >
                        {link.label}
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="font-display text-base font-bold tracking-tight text-paper">
                  {c.otherTitle}
                </h2>
                <p className="mt-3 text-sm leading-6 text-paper/65">{c.otherBody}</p>
                <Link
                  href={localePath("/kontakt", lang)}
                  className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-paper"
                >
                  {c.otherLink}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
