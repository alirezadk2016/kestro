import Container from "./Container";
import MarkTile from "./MarkTile";
import SourceList from "./SourceList";
import FaqSchema, { type FaqEntry } from "./FaqSchema";
import { type CraftMarkName } from "./CraftMark";
import { sources, type SourceId } from "@/lib/sources";
import { pageUpdated } from "./PageSchema";
import { formatDate } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

/*
 * The direct answer, first.
 *
 * Everything above this on the front page is a sales argument: a headline, a
 * promise, a photograph of a machine. This is the paragraph that says, in one
 * breath, what the company sells and to whom — the shape a reader skims and
 * an answer engine quotes.
 *
 * It was set as text on flat navy: a column of prose that stopped halfway
 * down, beside three figures with a hairline each and a source list that
 * printed the same three facts a second time. Nothing on it was drawn. Now:
 *
 *   - the definition is drawn as what it describes, three steps on a spine;
 *   - the two follow-up questions are plates, because they are parallel;
 *   - the evidence is one panel: the e-waste figure as a stat with a meter
 *     for the share that is recycled, the two dates as a timeline, and the
 *     sources as links only, since the panel has already stated each claim.
 *
 * Every figure is an entry in lib/sources.ts, quoted as its source states it
 * and linked to that source. They are not Kestro's numbers and are not
 * presented as if they were.
 */

const STEPS: { mark: CraftMarkName; label: { da: string; en: string } }[] = [
  { mark: "tested", label: { da: "Testet", en: "Tested" } },
  { mark: "repair", label: { da: "Istandsat", en: "Repaired" } },
  { mark: "install", label: { da: "Sat op igen", en: "Set up again" } },
];

/* The share of 2022's e-waste documented as collected and recycled, from the
   ITU/UNITAR monitor. One ratio against a whole: a meter, not a pie. */
const RECYCLED = 22.3;

const DATES: {
  id: SourceId;
  iso: string;
  title: { da: string; en: string };
  note: { da: string; en: string };
}[] = [
  {
    id: "windows10Eol",
    iso: "2025-10-14",
    title: { da: "Windows 10-supporten sluttede", en: "Windows 10 support ended" },
    note: {
      da: "Microsoft leverer ikke længere sikkerhedsrettelser til den.",
      en: "Microsoft no longer ships security fixes for it.",
    },
  },
  {
    id: "repairDirective",
    iso: "2026-07-31",
    title: {
      da: "EU's reparationsdirektiv gælder",
      en: "The EU repair directive applies",
    },
    note: {
      da: "Producenter må ikke spærre for brugte og kompatible reservedele.",
      en: "Manufacturers may not block second-hand or compatible spare parts.",
    },
  },
];

const copy = {
  da: {
    eyebrow: "Kort fortalt",
    question: "Hvad er refurbished erhvervs-IT?",
    answer:
      "Refurbished erhvervs-IT er brugt udstyr fra virksomheder, der er testet, istandsat hvor det var nødvendigt og sat op igen, før det sælges videre. Kestro skaffer den slags maskiner til virksomheder i Danmark og Norge: I fortæller, hvad I skal bruge, og vi finder maskinerne og sender en pris på skrift.",
    stepsLabel: "Vejen fra brugt til klar",
    factsTitle: "Tre tal, der ligger bag",
    ewasteUnit: "mio. ton",
    ewasteCaption: "elektronikaffald på verdensplan i 2022",
    recycled: "dokumenteret indsamlet og genanvendt",
    meterLabel: `${String(RECYCLED).replace(".", ",")} % af verdens elektronikaffald i 2022 blev dokumenteret indsamlet og genanvendt`,
    percent: (n: number) => `${String(n).replace(".", ",")} %`,
    updated: "Opdateret",
    faqTitle: "To spørgsmål mere",
  },
  en: {
    eyebrow: "The short version",
    question: "What is refurbished business IT?",
    answer:
      "Refurbished business IT is used business equipment that has been tested, repaired where it needed repairing and set up again before it is resold. Kestro sources that equipment for companies in Denmark and Norway: you tell us what you need, we find the machines and send a written price.",
    stepsLabel: "From used to ready",
    factsTitle: "Three figures behind it",
    ewasteUnit: "million tonnes",
    ewasteCaption: "of e-waste worldwide in 2022",
    recycled: "documented as collected and recycled",
    meterLabel: `${RECYCLED}% of the world's e-waste in 2022 was documented as collected and recycled`,
    percent: (n: number) => `${n}%`,
    updated: "Updated",
    faqTitle: "Two more questions",
  },
};

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
  const ids: SourceId[] = ["ewasteMonitor", ...DATES.map((d) => d.id)];

  return (
    <section className="lit border-b border-white/10 bg-brand-950 py-12 sm:py-24" data-reveal>
      <FaqSchema lang={lang} items={faqs} />
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          <div className="lg:col-span-6">
            <span className="eyebrow text-brand-300">{c.eyebrow}</span>

            {/* The question as the heading and the answer as the first
                paragraph under it. In that order, on purpose. */}
            <h2 className="mt-4 text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.question}
            </h2>
            <p className="mt-5 text-base leading-[1.75] text-paper/80 sm:text-lg sm:leading-[1.7]">
              {c.answer}
            </p>

            {/* The definition, drawn: the three things that make used
                equipment refurbished, in the order they happen. A sequence,
                so a spine — the line runs through the tiles' centres. */}
            <div className="mt-10">
              <p className="label text-paper/55">{c.stepsLabel}</p>
              <ol className="relative mt-5 grid grid-cols-3 gap-3">
                <span
                  aria-hidden="true"
                  className="absolute left-[16.67%] right-[16.67%] top-[22px] h-px bg-gradient-to-r from-brand-400/70 via-brand-300/40 to-brand-400/70"
                />
                {STEPS.map((step, i) => (
                  <li key={step.mark} className="relative flex flex-col items-center text-center">
                    <MarkTile name={step.mark} size="md" className="bg-brand-950" />
                    <span className="mt-3 font-display text-xs font-bold tabular-nums text-brand-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 text-sm font-semibold text-paper">
                      {step.label[lang]}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="label mt-8 text-paper/55">
              {c.updated}{" "}
              <time dateTime={updated} className="tabular-nums text-paper/80">
                {formatDate(updated, lang)}
              </time>
            </p>

            {/* The first question is the heading above; its answer is the
                paragraph under it. The other two are parallel, so plates. */}
            <p className="label mt-10 text-brand-300">{c.faqTitle}</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {faqs.slice(1).map((faq) => (
                <div key={faq.question.da} className="plate p-5">
                  <h3 className="text-base font-semibold text-paper">{faq.question[lang]}</h3>
                  <p className="mt-2 text-sm leading-6 text-paper/70">{faq.answer[lang]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The evidence, as one panel. */}
          <div className="plate plate-edge p-6 sm:p-8 lg:col-span-6">
            <h3 className="label text-brand-300">{c.factsTitle}</h3>

            {/* The stat: a hero figure, then the meter for the share of it
                that was recycled. Fill in the accent, track a deeper step of
                the same ramp, the value labelled in text rather than left to
                the bar. Proportional figures at this size — tabular digits
                look loose in a standalone number. */}
            <div className="mt-6">
              <p className="flex items-baseline gap-2 font-display font-extrabold tracking-display text-paper">
                <span className="text-5xl sm:text-6xl">62</span>
                <span className="text-xl sm:text-2xl">{c.ewasteUnit}</span>
              </p>
              <p className="mt-1 text-sm leading-[1.6] text-paper/70">{c.ewasteCaption}</p>

              <div
                role="img"
                aria-label={c.meterLabel}
                className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-brand-900"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                  style={{ width: `${RECYCLED}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-[1.6] text-paper/70">
                <span className="font-semibold text-paper">{c.percent(RECYCLED)}</span> {c.recycled}
                <span className="text-paper/55"> — {sources.ewasteMonitor.publisher}</span>
              </p>
            </div>

            {/* Two dates in order: a timeline, so a spine. */}
            {/* One segment per gap, from the bottom of a dot to the top of
                the next: a single line behind the list started above the
                first dot and ran on past the last. The dot is 15px at 6px
                down, and the gap is space-y-6, so a segment starts at 21px
                and is the item's height plus 9px long. */}
            <ol className="mt-8 space-y-6 border-t border-white/10 pt-8">
              {DATES.map((date, i) => (
                <li key={date.id} className="relative flex gap-5">
                  {i < DATES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[7px] top-[21px] h-[calc(100%+9px)] w-px bg-gradient-to-b from-brand-400/70 to-brand-400/30"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="relative mt-1.5 h-[15px] w-[15px] flex-none rounded-full border-2 border-brand-300 bg-brand-950"
                  />
                  <div className="min-w-0">
                    <time
                      dateTime={date.iso}
                      className="font-display text-xl font-extrabold tracking-display text-paper sm:text-2xl"
                    >
                      {formatDate(date.iso, lang)}
                    </time>
                    <p className="mt-1 text-sm font-semibold text-paper">{date.title[lang]}</p>
                    <p className="mt-0.5 text-sm leading-[1.6] text-paper/70">
                      {date.note[lang]}
                      <span className="text-paper/55"> — {sources[date.id].publisher}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <SourceList
              lang={lang}
              ids={ids}
              compact
              className="mt-8 border-t border-white/10 pt-6"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
