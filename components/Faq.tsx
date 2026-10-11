import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Container from "./Container";
import FaqSchema from "./FaqSchema";
import { company } from "@/lib/company";
import { localePath, type Lang, type Localized } from "@/lib/i18n";

export type FaqItem = { question: Localized; answer: Localized };

const defaultTitle: Localized = {
  da: "Ofte stillede spørgsmål",
  en: "Frequently asked questions",
};

const defaultFaqs: FaqItem[] = [
  {
    question: { da: "Hvordan bestiller vi hos Kestro?", en: "How do we order from Kestro?" },
    answer: {
      /* The address is interpolated rather than typed out: this answer is also
         published as FAQPage structured data, so a stale address here would be
         a wrong address in the search result as well as on the page. */
      da: `I kontakter os via formularen eller på ${company.email} og fortæller om jeres behov – antal enheder, specifikationer og tidsramme. Derefter finder vi de enheder, der matcher, og aftaler pris og levering direkte med jer.`,
      en: `Contact us through the form or at ${company.email} and tell us what you need — number of devices, specifications and timing. We then find the machines that match and agree price and delivery directly with you.`,
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
  contactLink = true,
}: {
  lang: Lang;
  items?: FaqItem[];
  title?: Localized;
  /** The "not here? write to us" line under the heading. Off on /kontakt,
      which is where it would send the reader. */
  contactLink?: boolean;
}) {
  return (
    /*
     * Answers live on paper.
     *
     * The front page sets its questions on the brand board's light neutral,
     * and every other page set them as dark plates on navy — the same
     * component doing two different things, and the reason an interior page
     * was eight navy bands in a row. Now every FAQ on the site is the same
     * light section: the heading on the left with a way out, the questions
     * on the right as sheets. A reader learns once what the paper band
     * means, and each long page gets the one change of ground it needed.
     *
     * Text here is ink-600 or darker; ink-500 on #F3F4F6 is 4.4:1.
     */
    <section className="border-y border-ink-200 bg-paper-dim py-14 text-ink-900 sm:py-20">
      {/* From the same array rendered below, so the questions Google reads are
          by construction the questions on the page. */}
      <FaqSchema lang={lang} items={items} />
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
              {title[lang]}
            </h2>
            {contactLink && (
              <p className="mt-4 text-base leading-[1.65] text-ink-700">
                {lang === "da" ? "Står jeres spørgsmål ikke her? " : "Is your question not here? "}
                <Link
                  href={localePath("/kontakt", lang)}
                  className="font-semibold text-brand-700 underline decoration-brand-600/40 decoration-2 underline-offset-4 hover:text-brand-600"
                >
                  {lang === "da" ? "Skriv til os" : "Write to us"}
                </Link>
              </p>
            )}
          </div>

          {/* Native <details> keeps this a server component: no JS, keyboard
              and screen-reader behaviour come for free. */}
          <div className="space-y-2.5 lg:col-span-8">
            {items.map((faq) => (
              <details key={faq.question.da} className="sheet group px-5 sm:px-6">
                {/*
                 * The question is a heading.
                 *
                 * It was bare text inside the <summary>, which is a control —
                 * so a page with five questions on it had five question-style
                 * headings as far as a reader was concerned and none at all as
                 * far as a parser was concerned. A heading inside a summary is
                 * valid and is what a well-formed FAQ does: the disclosure
                 * stays a disclosure, and the question joins the outline under
                 * the section's own h2.
                 */}
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3.5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold leading-snug text-ink-900 group-open:text-brand-700 group-hover:text-brand-700">
                    {faq.question[lang]}
                  </h3>
                  <ChevronDown
                    className="h-5 w-5 flex-none text-ink-600 transition-transform duration-200 group-open:rotate-180"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-5 pr-2 text-base leading-[1.7] text-ink-700 sm:pr-9">
                  {faq.answer[lang]}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
