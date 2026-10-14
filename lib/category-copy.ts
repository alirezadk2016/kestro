import type { FaqItem } from "@/components/Faq";
import type { Category } from "./categories";
import { countWord, type Lang } from "./i18n";
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

const PREPARED: Record<string, { da: string; en: string }> = {
  "baerbare-computere": {
    da: "Hver maskine funktionstestes, lagermediet slettes, og tastaturet skiftes til dansk eller norsk layout, før den sættes op. Stand og batteri står pr. enhed i tilbuddet.",
    en: "Each machine is function-tested, its storage is erased and the keyboard is swapped to a Danish or Norwegian layout before it is set up. Condition and battery are stated per unit in the quote.",
  },
  "stationaere-computere": {
    da: "Hver maskine funktionstestes, og lagermediet slettes, før den sættes op med Windows. Standen står pr. enhed i tilbuddet.",
    en: "Each machine is function-tested and its storage erased before it is set up with Windows. The condition is stated per unit in the quote.",
  },
  "mini-pc": {
    da: "Hver maskine funktionstestes, og lagermediet slettes, før den sættes op med Windows. Standen står pr. enhed i tilbuddet.",
    en: "Each machine is function-tested and its storage erased before it is set up with Windows. The condition is stated per unit in the quote.",
  },
  skaerme: {
    da: "Standen står pr. skærm i tilbuddet, og skærmene kan leveres sammen med maskiner og docks, så arbejdspladsen står komplet.",
    en: "The condition is stated per monitor in the quote, and the monitors can be delivered with the machines and docks, so the workstation is complete.",
  },
  dockingstationer: {
    da: "Standen står pr. enhed i tilbuddet, og kabler og tilbehør vælges, så de passer til maskinerne.",
    en: "The condition is stated per unit in the quote, and cables and accessories are chosen to fit the machines.",
  },
  tablets: {
    da: "Enhederne nulstilles, så de er klar til jeres MDM, og stand og batteritilstand oplyses pr. enhed, før I bestiller.",
    en: "The devices are reset, ready for your MDM, and condition and battery health are stated per unit before you order.",
  },
  smartphones: {
    da: "Telefonerne testes og nulstilles, og stand og batteri oplyses pr. enhed. De gamle telefoner kan hentes retur og slettes.",
    en: "The phones are tested and reset, and condition and battery are stated per unit. The old phones can be collected and erased.",
  },
};

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
        en: `Which models of ${name.en} have you described?`,
      },
      answer: {
        /* A sentence does not start with a digit, so the count is a word. */
        da: `${countWord(known.length, "da", true)} i detaljer: ${list(known, "og")}. ${known.length === 1 ? "Den" : "Hver"} har sin egen side med typisk konfiguration, hvad den er god til, og hvad man skal være opmærksom på.`,
        en: `${countWord(known.length, "en", true)} in detail: ${list(known, "and")}. ${known.length === 1 ? "It has" : "Each has"} its own page with the typical configuration, what it suits and what to watch for.`,
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

  /*
   * How the equipment is prepared and delivered. Mak rule 12: the category
   * pages' knowledge graph lacked the testing, erasure and delivery nodes,
   * though the service pages state them. Each sentence here is one those
   * pages already say (klargøring og test, nordisk tilpasning, levering), cut
   * to what applies: no battery on a monitor, no storage on a dock.
   */
  const prepared = PREPARED[category.slug];
  if (prepared) {
    items.push({
      question: {
        da: `Hvordan bliver ${name.da} klargjort og leveret?`,
        en: `How are the ${name.en} prepared and delivered?`,
      },
      answer: {
        da: `${prepared.da} Vi leverer til én eller flere adresser i Danmark og Norge med en tidsramme, I får på skrift, før I bestiller.`,
        en: `${prepared.en} We deliver to one or more addresses in Denmark and Norway, with a lead time you get in writing before you order.`,
      },
    });
  }

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
      da: "Nej. Vi skaffer udstyret til den enkelte ordre i stedet for at holde lager, så specifikationerne følger opgaven. Der er ingen minimumsordre.",
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
