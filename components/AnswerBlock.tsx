import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Container from "./Container";
import FaqSchema, { type FaqEntry } from "./FaqSchema";
import { pageUpdated } from "./PageSchema";
import { sources } from "@/lib/sources";
import { formatDate, localePath } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

/*
 * The direct answer, first — and the questions a buyer asks next.
 *
 * Everything above this on the front page is a sales argument: a headline, a
 * promise, a photograph of a machine. This is the paragraph that says, in one
 * breath, what the company sells and to whom — the shape a reader skims and
 * an answer engine quotes — followed by the eight things a procurement buyer
 * asks before writing: who they are actually buying from, the warranty, why
 * there are no prices, the keyboard, Windows, the minimum, delivery and the
 * old kit.
 *
 * It used to carry a three-step "from used to ready" spine and an evidence
 * panel (the e-waste tonnage, the Windows 10 date, the EU repair directive).
 * The spine was the first of three tellings of the process on this page, at
 * three different lengths, and the evidence was reading material rather than
 * a buyer's question. The process is told once now, in Services; the evidence
 * lives on /vejledninger, where every one of those sources is already cited.
 * The one fact a buyer here needs from it — that Windows 10 is out of support
 * — is in the Windows answer below, with its source.
 *
 * Light ground on purpose. Every section on the page was navy, so after two
 * screens they ran together; this and the written-quote section are the two
 * bands on the brand board's light neutral, which is what gives the page a
 * rhythm. Text here is ink-600 or darker: ink-500 on #F3F4F6 is 4.4:1.
 *
 * Every answer is something the site already states in full elsewhere —
 * the terms of sale, the service pages — and none carries a number that is
 * not in those documents.
 */

const copy = {
  da: {
    question: "Hvad er refurbished erhvervs-IT?",
    answer:
      "Refurbished erhvervs-IT er brugt udstyr fra virksomheder, der er testet, istandsat hvor det var nødvendigt og sat op igen, før det sælges videre. Kestro er under etablering med fokus på den slags maskiner til virksomheder i Danmark og Norge. I kan sende en uforpligtende forespørgsel om jeres behov.",
    who: "Kestro er endnu ikke en registreret virksomhed. Siden viser projektet og modeltyperne; den modtager ikke ordrer eller betaling. Skriv til os for en indledende afklaring.",
    terms: "Handelsbetingelserne",
    updated: "Opdateret",
    faqTitle: "Det spørger virksomheder også om",
  },
  en: {
    question: "What is refurbished business IT?",
    answer:
      "Refurbished business IT is used business equipment that has been tested, repaired where it needed repairing and set up again before it is resold. Kestro is in preparation with a focus on this equipment for companies in Denmark and Norway. You can send a non-binding enquiry about your requirements.",
    who: "Kestro is not yet a registered business. The site presents the project and model types; it does not accept orders or payment. Write to us for an initial discussion.",
    terms: "Terms of sale",
    updated: "Updated",
    faqTitle: "What companies also ask",
  },
};

const win10 = sources.windows10Eol;

const faqs: FaqEntry[] = [
  {
    question: { da: "Hvad er refurbished erhvervs-IT?", en: "What is refurbished business IT?" },
    answer: { da: copy.da.answer, en: copy.en.answer },
  },
  {
    question: {
      da: "Hvem køber vi af – Kestro eller en leverandør?",
      en: "Who are we buying from — Kestro or a supplier?",
    },
    answer: {
      da: copy.da.who,
      en: copy.en.who,
    },
  },
  {
    question: { da: "Hvor lang er garantien?", en: "How long is the warranty?" },
    answer: {
      da: "Der er endnu ingen salgs- eller garantivilkår for konkrete leverancer fra projektet. Før eventuelt salg skal reklamation, garanti og den ansvarlige sælger oplyses skriftligt. Private kunders ufravigelige rettigheder kan ikke erstattes af erhvervsvilkår.",
      en: "There are no sale or warranty terms for specific deliveries from the project yet. Before any sale, complaint rights, warranty and the responsible seller must be stated in writing. Private customers' mandatory rights cannot be replaced by business-only terms.",
    },
  },
  {
    question: {
      da: "Er priserne på siden bindende?",
      en: "Are the prices on the site binding?",
    },
    answer: {
      da: "Nej. På prissiden vises daterede, eksterne detailreferencer som omtrentlige budgeteksempler, ikke Kestros salgspriser eller bekræftet lager. Kontakt os om muligheder, tilgængelighed og en konkret pris. En forespørgsel er ikke en bestilling.",
      en: "No. The pricing page shows dated external retail references as approximate budget examples, not Kestro selling prices or confirmed stock. Contact us about options, availability and a specific price. An enquiry is not an order.",
    },
  },
  {
    question: { da: "Hvilket tastatur har maskinerne?", en: "What keyboard do the machines have?" },
    answer: {
      da: "Dansk eller norsk. Mange af maskinerne kommer fra Sydeuropa med spansk eller italiensk tastatur. Vi skifter det fysisk før levering, så æ, ø og å er trykt på tasterne – det er ikke bare en indstilling i Windows.",
      en: "Danish or Norwegian. Many of the machines come from southern Europe with a Spanish or Italian keyboard. We physically swap it before delivery, so æ, ø and å are printed on the keys — it is not just a Windows setting.",
    },
  },
  {
    question: { da: "Kører maskinerne Windows 11?", en: "Do the machines run Windows 11?" },
    answer: {
      da: `Udgangspunktet er Windows 11, men den konkrete konfiguration skal afklares. Den almindelige support til Windows 10 version 22H2 sluttede ${formatDate("2025-10-14", "da")}; ESU og LTSC har særskilte opdateringsvilkår.`,
      en: `Windows 11 is the intended starting point, but the actual configuration must be confirmed. General support for Windows 10 version 22H2 ended on ${formatDate("2025-10-14", "en")}; ESU and LTSC have separate update terms.`,
    },
  },
  {
    question: { da: "Er der et minimumsantal?", en: "Is there a minimum order?" },
    answer: {
      da: "Nej. Vi leverer alt fra en enkelt maskine til udstyr til hele teams og virksomheder.",
      en: "No. We deliver anything from a single machine to equipment for whole teams and companies.",
    },
  },
  {
    question: { da: "Hvor leverer I til?", en: "Where do you deliver?" },
    answer: {
      da: "Til virksomheder i Danmark og Norge.",
      en: "To companies in Denmark and Norway.",
    },
  },
  {
    question: {
      da: "Køber I også vores gamle udstyr?",
      en: "Do you also buy our old equipment?",
    },
    answer: {
      da: "Ja. Vi køber brugte erhvervsmaskiner og henter dem. Er der data på enhederne, sletter vi lagermedierne, før de får et nyt liv, og I får en vurdering, før I beslutter jer.",
      en: "Yes. We buy used business machines and collect them. If there is data on the units, we erase the storage media before they get a second life, and you get a valuation before you decide.",
    },
  },
];

/* Where an answer has a page that documents it in full, it links there. */
const more: Record<number, { href: string; label: { da: string; en: string } }> = {
  1: { href: "/handelsbetingelser", label: { da: "Handelsbetingelserne", en: "Terms of sale" } },
  2: {
    href: "/handelsbetingelser",
    label: { da: "Punkt 8 om reklamation", en: "Clause 8 on complaints" },
  },
  3: { href: "/priser", label: { da: "Sådan bliver prisen til", en: "How the price is set" } },
  4: {
    href: "/ydelser/nordisk-tilpasning",
    label: { da: "Nordisk tilpasning", en: "Nordic preparation" },
  },
  8: { href: "/saelg-til-os", label: { da: "Sælg jeres udstyr", en: "Sell your equipment" } },
};

export default function AnswerBlock({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const updated = pageUpdated("/");

  return (
    <section className="border-b border-ink-200 bg-paper-dim py-14 text-ink-900 sm:py-24">
      <FaqSchema lang={lang} items={faqs} />
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            {/* The question as the heading and the answer as the first
                paragraph under it. In that order, on purpose. */}
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
              {c.question}
            </h2>
            <p className="mt-5 text-base leading-[1.75] text-ink-700 sm:text-lg sm:leading-[1.7]">
              {c.answer}
            </p>

            {/* Who the buyer's contract is with. The site says "we source",
                "we hold no stock" and "we test" in different places, and a
                reader put those together as "a middleman — so whose warranty
                is it?". This is the sentence that answers it, before the
                question is even asked. */}
            <p className="mt-6 border-l-2 border-brand-600 pl-4 text-base font-semibold leading-[1.65] text-ink-900">
              {c.who}{" "}
              <Link
                href={localePath("/handelsbetingelser", lang)}
                rel="terms-of-service"
                className="font-semibold text-brand-700 underline decoration-brand-600/40 decoration-2 underline-offset-4 hover:text-brand-600"
              >
                {c.terms}
              </Link>
            </p>

            <p className="mt-6 text-sm text-ink-600">
              {c.updated}{" "}
              <time dateTime={updated} className="tabular-nums text-ink-800">
                {formatDate(updated, lang)}
              </time>
            </p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-ink-600">{c.faqTitle}</p>
            {/* Native <details>: no JavaScript, and keyboard and screen-reader
                behaviour for free. The question is an h3 inside the summary,
                so it is a heading in the outline and not only a control. */}
            <div className="mt-4 space-y-2.5">
              {faqs.slice(1).map((faq, i) => {
                const link = more[i + 1];
                const isWindows = faq.question.da.startsWith("Kører");
                return (
                  <details key={faq.question.da} className="sheet group px-5 sm:px-6">
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
                    <div className="pb-5 pr-2 sm:pr-9">
                      <p className="text-base leading-[1.7] text-ink-700">{faq.answer[lang]}</p>
                      {isWindows && (
                        <p className="mt-2 text-sm text-ink-600">
                          {lang === "da" ? "Kilde: " : "Source: "}
                          <a
                            href={win10.url}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="text-brand-700 underline decoration-brand-600/40 underline-offset-4 hover:text-brand-600"
                          >
                            <cite className="not-italic">{win10.publisher}</cite>
                          </a>
                        </p>
                      )}
                      {link && (
                        <Link
                          href={localePath(link.href, lang)}
                          rel={link.href === "/handelsbetingelser" ? "terms-of-service" : undefined}
                          className="mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-700 underline decoration-brand-600/40 decoration-2 underline-offset-4 hover:text-brand-600"
                        >
                          {link.label[lang]}
                        </Link>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
