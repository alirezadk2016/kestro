import { ChevronDown } from "lucide-react";
import Container from "./Container";
import type { Lang, Localized } from "@/lib/i18n";

export type FaqItem = { question: Localized; answer: Localized };

const defaultTitle: Localized = {
  da: "Ofte stillede spørgsmål",
  en: "Frequently asked questions",
};

const defaultFaqs: FaqItem[] = [
  {
    question: { da: "Hvordan bestiller vi hos Kestro?", en: "How do we order from Kestro?" },
    answer: {
      da: "I kontakter os via formularen eller på info@kestro.dk og fortæller om jeres behov – antal enheder, specifikationer og tidsramme. Derefter finder vi de enheder, der matcher, og aftaler pris og levering direkte med jer.",
      en: "Contact us through the form or at info@kestro.dk and tell us what you need — number of devices, specifications and timing. We then find the machines that match and agree price and delivery directly with you.",
    },
  },
  {
    question: { da: "Hvor lang er leveringstiden?", en: "How long does delivery take?" },
    answer: {
      da: "Vi sourcer enheder per ordre i stedet for at holde fast lager, så leveringstiden afhænger af den konkrete bestilling. Vi oplyser en tidsramme, så snart vi kender omfanget.",
      en: "We source per order rather than holding stock, so delivery time depends on the specific order. We give you a time frame as soon as we know the scope.",
    },
  },
  {
    question: { da: "Hvilken garanti følger med?", en: "What warranty is included?" },
    answer: {
      da: "Garantivilkår aftaler vi ud fra bestillingens omfang og enhedstype – vi går igennem det, når vi har talt om jeres behov.",
      en: "Warranty terms are agreed based on the size of the order and the type of equipment — we go through it once we have talked about what you need.",
    },
  },
  {
    question: { da: "Er der et minimumsantal enheder?", en: "Is there a minimum order?" },
    answer: {
      da: "Nej. Vi tilpasser leverancen fra enkelte enheder til større indkøb til hele teams eller virksomheder.",
      en: "No. We scale the delivery from single machines up to larger purchases for whole teams or companies.",
    },
  },
  {
    question: {
      da: "Leverer I til hele Danmark og Norge?",
      en: "Do you deliver across Denmark and Norway?",
    },
    answer: {
      da: "Ja, vi leverer til virksomheder i hele Danmark og Norge.",
      en: "Yes, we deliver to companies throughout Denmark and Norway.",
    },
  },
];

export default function Faq({
  lang,
  items = defaultFaqs,
  title = defaultTitle,
}: {
  lang: Lang;
  items?: FaqItem[];
  title?: Localized;
}) {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title[lang]}
          </h2>
        </div>

        {/* Native <details> keeps this a server component: no JS, keyboard and
            screen-reader behaviour come for free. */}
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 border-y border-slate-200 sm:mt-12">
          {items.map((faq) => (
            <details key={faq.question.da} className="group">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold text-slate-900 transition-colors hover:text-brand-700 [&::-webkit-details-marker]:hidden">
                {faq.question[lang]}
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 pr-9 text-base leading-7 text-slate-600">{faq.answer[lang]}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
