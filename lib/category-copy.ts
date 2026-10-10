import type { FaqItem } from "@/components/Faq";
import type { Category } from "./categories";
import type { Lang } from "./i18n";
import { models } from "./models";
import type { SourceId } from "./sources";

/*
 * What a category page answers, built from lib/categories.ts and lib/models.ts.
 *
 * Same reasoning as lib/model-copy.ts: generated from the data the page
 * already renders, so the questions and the brand list cannot disagree with
 * the table further down. The one figure in the lead is the count of the list
 * on the page.
 */

/** Categories whose machines run Windows, and so the only ones that cite it. */
const COMPUTERS = new Set(["baerbare-computere", "stationaere-computere", "mini-pc"]);

const lc = (text: string) =>
  /^[A-ZÆØÅ][a-zæøå]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;

const list = (items: string[], and: string) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;

export function categoryLead(category: Category, lang: Lang): string {
  const n = category.brands.length;
  const some = list(category.brands.slice(0, 3), lang === "da" ? "og" : "and");
  /* A definition, then the count: "X from Kestro are <tagline>." */
  return lang === "da"
    ? `${category.name.da} fra Kestro er ${lc(category.tagline.da)}. Vi skaffer fra ${n} mærker og serier, blandt andet ${some}.`
    : `${category.name.en} from Kestro are ${lc(category.tagline.en)}. We source from ${n} brands and ranges, including ${some}.`;
}

export function categoryFaqs(category: Category): FaqItem[] {
  const name = { da: lc(category.name.da), en: lc(category.name.en) };
  const known = models.filter((m) => m.category === category.slug).map((m) => m.name);
  const items: FaqItem[] = [
    {
      question: {
        da: `Hvilke mærker af ${name.da} skaffer I?`,
        en: `Which brands of ${name.en} do you source?`,
      },
      answer: {
        da: `Blandt andre disse ${category.brands.length}: ${list(category.brands, "og")}. Står jeres mærke ikke på listen, så spørg.`,
        en: `These ${category.brands.length} among others: ${list(category.brands, "and")}. If yours is not on the list, ask.`,
      },
    },
  ];

  if (known.length) {
    items.push({
      question: {
        da: `Hvilke modeller af ${name.da} har I beskrevet?`,
        en: `Which ${name.en} models have you described?`,
      },
      answer: {
        da: `${known.length === 1 ? "Én" : known.length} i detaljer: ${list(known, "og")}. Hver har sin egen side med typisk konfiguration, hvad den er god til, og hvad man skal være opmærksom på.`,
        en: `${known.length === 1 ? "One" : known.length} in detail: ${list(known, "and")}. Each has its own page with the typical configuration, what it suits and what to watch for.`,
      },
    });
  }

  items.push({
    question: {
      da: `Hvad skal vi oplyse for at få et tilbud på ${name.da}?`,
      en: `What should we tell you to get a quote on ${name.en}?`,
    },
    answer: {
      da: `Antal, hvad udstyret skal bruges til, og hvornår I skal bruge det. ${category.specNote.da}`,
      en: `Quantity, what the equipment is for, and when you need it. ${category.specNote.en}`,
    },
  });

  if (COMPUTERS.has(category.slug)) {
    items.push({
      question: {
        da: "Hvilken Windows-version kommer maskinerne med?",
        en: "Which version of Windows do the machines come with?",
      },
      answer: {
        da: "Windows 11, installeret med drivere. Ifølge Microsoft sluttede supporten for Windows 10 den 14. oktober 2025, og Windows 11 kræver blandt andet TPM 2.0 og Secure Boot.",
        en: "Windows 11, installed with drivers. According to Microsoft, Windows 10 support ended on 14 October 2025, and Windows 11 requires TPM 2.0 and Secure Boot among other things.",
      },
    });
  }

  items.push(whyUsed);

  items.push({
    question: { da: `Har I ${name.da} på lager?`, en: `Do you have ${name.en} in stock?` },
    answer: {
      da: "Nej. Vi sourcer til den enkelte ordre i stedet for at holde lager, så specifikationerne følger opgaven. Der er ingen minimumsordre.",
      en: "No. We source per order rather than holding stock, so the specification follows the job. There is no minimum order.",
    },
  });

  return items;
}

export const categorySources = (category: Category): SourceId[] =>
  COMPUTERS.has(category.slug)
    ? ["windows11Requirements", "windows10Eol", "ewasteMonitor"]
    : ["ewasteMonitor"];

/** Why used rather than new, without claiming anything about the equipment itself. */
export const whyUsed: FaqItem = {
  question: { da: "Hvorfor brugt frem for nyt?", en: "Why used rather than new?" },
  answer: {
    da: "Fordi udstyr, der stadig kan det, opgaven kræver, gør mere gavn i brug end som affald. Ifølge ITU og UNITAR producerede verden 62 mio. ton elektronikaffald i 2022, og 22,3 % af det blev dokumenteret indsamlet og genanvendt.",
    en: "Because equipment that can still do what the job needs does more good in use than as waste. According to ITU and UNITAR, the world generated 62 million tonnes of e-waste in 2022, and 22.3% of it was documented as collected and recycled.",
  },
};
