import Container from "./Container";
import SourceList from "./SourceList";
import FaqSchema, { type FaqEntry } from "./FaqSchema";
import { sources, type SourceId } from "@/lib/sources";
import { pageUpdated } from "./PageSchema";
import { formatDate } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

/*
 * The direct answer, first.
 *
 * Everything above this on the front page is a sales argument: a headline, a
 * promise, a photograph of a machine. None of it says, in one sentence, what
 * the company sells and to whom — a reader who already knows gets it from
 * context, and a reader who does not has to assemble it from five sections.
 * A language model summarising the page has the same problem and resolves it
 * the same way: badly.
 *
 * So the page now states it plainly before it argues anything, and then gives
 * three figures that are checkable rather than three adjectives that are not.
 * Each figure is one of the entries in lib/sources.ts, quoted as its source
 * states it and linked to that source — the numbers are not ours and are not
 * presented as if they were.
 *
 * The three questions at the end are questions the site already answers
 * elsewhere, in the same words. Nothing here is a new promise.
 */
const FACTS: { id: SourceId; figure: string; note: { da: string; en: string } }[] = [
  {
    id: "ewasteMonitor",
    figure: "62 Mt",
    note: {
      da: "elektronikaffald på verdensplan i 2022. 22,3 % blev dokumenteret indsamlet og genanvendt.",
      en: "of e-waste worldwide in 2022. 22.3% was documented as formally collected and recycled.",
    },
  },
  {
    id: "windows10Eol",
    figure: "14.10.2025",
    note: {
      da: "sluttede supporten for Windows 10. Microsoft leverer ikke længere sikkerhedsrettelser til den.",
      en: "is when Windows 10 support ended. Microsoft no longer ships security fixes for it.",
    },
  },
  {
    id: "repairDirective",
    figure: "31.07.2026",
    note: {
      da: "gælder EU's reparationsdirektiv i medlemslandene. Producenter må ikke spærre for brugte og kompatible reservedele.",
      en: "is when the EU repair directive applies in the member states. Manufacturers may not block second-hand or compatible spare parts.",
    },
  },
];

const copy = {
  da: {
    eyebrow: "Kort fortalt",
    question: "Hvad er refurbished erhvervs-IT?",
    answer:
      "Refurbished erhvervs-IT er brugt udstyr fra virksomheder, der er testet, istandsat hvor det var nødvendigt og sat op igen, før det sælges videre. Kestro skaffer den slags maskiner til virksomheder i Danmark og Norge: I fortæller, hvad I skal bruge, og vi finder maskinerne og sender en pris på skrift.",
    factsTitle: "Tre tal, der ligger bag",
    updated: "Opdateret",
    faqTitle: "To spørgsmål mere",
  },
  en: {
    eyebrow: "The short version",
    question: "What is refurbished business IT?",
    answer:
      "Refurbished business IT is used business equipment that has been tested, repaired where it needed repairing and set up again before it is resold. Kestro sources that equipment for companies in Denmark and Norway: you tell us what you need, we find the machines and send a written price.",
    factsTitle: "Three figures behind it",
    updated: "Updated",
    faqTitle: "Two more questions",
  },
} satisfies Record<Lang, Record<string, string>>;

const faqs: FaqEntry[] = [
  {
    question: { da: "Hvad er refurbished erhvervs-IT?", en: "What is refurbished business IT?" },
    answer: {
      da: copy.da.answer,
      en: copy.en.answer,
    },
  },
  {
    question: { da: "Hvor leverer I til?", en: "Where do you deliver?" },
    answer: {
      da: "Vi leverer i Norden — i dag til Danmark og Norge.",
      en: "We deliver across the Nordics — today to Denmark and Norway.",
    },
  },
  {
    question: { da: "Følger der garanti med?", en: "Is there a warranty?" },
    answer: {
      da: "Ja. Garantiperioden står skriftligt i det tilbud, I får, før I bestiller.",
      en: "Yes. The warranty period is written into the quote you get, before you order.",
    },
  },
];

export default function AnswerBlock({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const updated = pageUpdated("/");
  const ids = FACTS.map((fact) => fact.id);

  return (
    <section className="border-b border-white/10 bg-brand-950 py-10 sm:py-20" data-reveal>
      <FaqSchema lang={lang} items={faqs} />
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <span className="eyebrow text-brand-300">{c.eyebrow}</span>

            {/* The question as the heading and the answer as the first
                paragraph under it. In that order, on purpose: it is the shape
                a reader skims and the shape an answer engine quotes. */}
            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-display text-paper sm:text-3xl">
              {c.question}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.75] text-paper/75">{c.answer}</p>

            <p className="mt-6 text-xs text-paper/45 leading-[1.45]">
              {c.updated}{" "}
              <time dateTime={updated} className="tabular-nums">
                {formatDate(updated, lang)}
              </time>
            </p>

            {/* The first question is the heading above, and its answer is the
                paragraph under it — printing it again here would be the same
                words twice on one screen. It stays in the markup because the
                page does answer it; what it must not do is claim an answer
                that is not on the page, and that one is. */}
            <h3 className="mt-10 label text-brand-300">{c.faqTitle}</h3>
            <dl className="mt-4 space-y-4">
              {faqs.slice(1).map((faq) => (
                <div key={faq.question.da} className="border-l-2 border-white/10 pl-4">
                  <dt className="text-sm font-semibold text-paper">{faq.question[lang]}</dt>
                  <dd className="mt-1 text-sm leading-6 text-paper/65">{faq.answer[lang]}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <h3 className="label text-brand-300">{c.factsTitle}</h3>
            <ul className="mt-4 space-y-5">
              {FACTS.map((fact) => (
                <li key={fact.id} className="border-l-2 border-brand-500/40 pl-4">
                  <p className="font-display text-2xl font-extrabold tracking-display text-paper tabular-nums">
                    {fact.figure}
                  </p>
                  <p className="mt-1 text-sm leading-[1.6] text-paper/65">
                    {fact.note[lang]}{" "}
                    <span className="text-paper/40">— {sources[fact.id].publisher}</span>
                  </p>
                </li>
              ))}
            </ul>

            <SourceList lang={lang} ids={ids} className="mt-10 border-t border-white/10 pt-8" />
          </div>
        </div>
      </Container>
    </section>
  );
}
