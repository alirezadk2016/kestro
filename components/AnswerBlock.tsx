import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Container from "./Container";
import FaqSchema, { type FaqEntry } from "./FaqSchema";
import { localePath, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    title: "Hvad er refurbished erhvervs-IT?",
    body: "Brugt erhvervsudstyr, som er testet og klargjort til et nyt arbejdsliv. Modelnavnet er kun begyndelsen: den konkrete konfiguration, stand og batterikapacitet skal afklares for hver enhed.",
    evidence: "Forstå stand og test",
    faqTitle: "Før I sender en forespørgsel",
  },
  en: {
    title: "What is refurbished business IT?",
    body: "Used business equipment tested and prepared for another working life. The model name is only the beginning: the configuration, condition and battery capacity must be clarified for each unit.",
    evidence: "Understand condition and testing",
    faqTitle: "Before you send an enquiry",
  },
};

const questions: (FaqEntry & { href: string; link: Record<Lang, string> })[] = [
  {
    question: { da: "Er modellerne på lager?", en: "Are the models in stock?" },
    answer: {
      da: "Kataloget viser modelserier, vi kan undersøge mulighederne for at skaffe. Tilgængelighed, konkret konfiguration og tidsramme skal bekræftes for det udstyr, I søger.",
      en: "The catalogue shows model families we can investigate sourcing. Availability, the exact configuration and timing need to be confirmed for the equipment you need.",
    },
    href: "/produkter",
    link: { da: "Vælg en udstyrstype", en: "Choose an equipment type" },
  },
  {
    question: { da: "Hvordan får vi en præcis pris?", en: "How do we get an exact price?" },
    answer: {
      da: "Beskriv opgaven, antal og eventuelt budget. Pris, stand, tilbehør og levering skal derefter afklares skriftligt. Prissidens daterede detailreferencer er budgeteksempler fra andre forhandlere, ikke Kestros salgspriser.",
      en: "Describe the work, quantity and any budget. Price, condition, accessories and delivery must then be clarified in writing. Dated retail references on the pricing page are budget examples from other retailers, not Kestro selling prices.",
    },
    href: "/priser",
    link: { da: "Se budgeteksempler", en: "See budget examples" },
  },
  {
    question: { da: "Hvilken garanti følger med?", en: "What warranty is included?" },
    answer: {
      da: "Der er endnu ingen salgs- eller garantivilkår for leverancer fra projektet. Før et eventuelt salg skal den ansvarlige sælger, reklamation og eventuel garanti fremgå skriftligt. Vi lover derfor ikke en fast garantiperiode på forhånd.",
      en: "There are no sale or warranty terms for deliveries from the project yet. Before any sale, the responsible seller, complaint rights and any warranty must be stated in writing. We therefore do not promise a fixed warranty period in advance.",
    },
    href: "/handelsbetingelser",
    link: { da: "Læs vilkårene", en: "Read the terms" },
  },
];

export default function AnswerBlock({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="border-y border-ink-200 bg-paper-dim py-12 text-ink-900 sm:py-16">
      <FaqSchema lang={lang} items={questions} />
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
              {c.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-700">{c.body}</p>
            <Link
              href={localePath("/kvalitet", lang)}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-600"
            >
              {c.evidence}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <p className="mb-2 text-sm font-semibold text-ink-600">{c.faqTitle}</p>
            <div className="divide-y divide-ink-200 border-y border-ink-200">
              {questions.map((item) => (
                <details key={item.question.da} className="group">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                      {item.question[lang]}
                    </h3>
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-ink-600 transition-transform duration-150 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="pb-4 sm:pr-8">
                    <p className="text-sm leading-6 text-ink-700">{item.answer[lang]}</p>
                    <Link
                      href={localePath(item.href, lang)}
                      rel={item.href === "/handelsbetingelser" ? "terms-of-service" : undefined}
                      className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-600"
                    >
                      {item.link[lang]}
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
