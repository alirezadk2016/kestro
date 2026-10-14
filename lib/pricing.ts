import type { Lang, Localized } from "./i18n";
import { sources, type SourceId } from "./sources";

// Historical retail references, not our stock, offers, margins or a market-wide survey.
export const budgetExamples: {
  model: string;
  name: string;
  configuration: Localized;
  observed: number;
  fee: number;
  source: SourceId;
}[] = [
  {
    model: "lenovo-thinkpad-t480",
    name: "Lenovo ThinkPad T480",
    configuration: {
      da: "i5-8250U · 16 GB · 256 GB SSD · nordisk tastatur",
      en: "i5-8250U · 16 GB · 256 GB SSD · Nordic keyboard",
    },
    observed: 2655,
    fee: 37,
    source: "budgetT480",
  },
  {
    model: "lenovo-thinkpad-t14",
    name: "Lenovo ThinkPad T14 G2",
    configuration: {
      da: "i5-1145G7 · 16 GB · 256 GB SSD · nordisk tastatur · stand God",
      en: "i5-1145G7 · 16 GB · 256 GB SSD · Nordic keyboard · Good condition",
    },
    observed: 2955,
    fee: 37,
    source: "budgetT14",
  },
  {
    model: "dell-optiplex-5060",
    name: "Dell OptiPlex 5060 SFF",
    configuration: {
      da: "i5-8400 · 8 GB · 256 GB SSD · stand Fremragende",
      en: "i5-8400 · 8 GB · 256 GB SSD · Excellent condition",
    },
    observed: 2029,
    fee: 30,
    source: "budgetOptiplex",
  },
  {
    model: "dell-ultrasharp-u2419h",
    name: "Dell UltraSharp U2419H",
    configuration: {
      da: "23,8″ · Full HD · fod medfølger · stand God",
      en: "23.8-inch · Full HD · stand included · Good condition",
    },
    observed: 1185,
    fee: 15,
    source: "budgetMonitor",
  },
];

// Round the documented consumer total upwards to the nearest DKK 100 for budgeting.
/* The day the retail references were read. Shown beside the figures and in
   the price page's opening line. */
export const budgetReadOn = "2026-10-14";

export const budgetAmount = (item: (typeof budgetExamples)[number]) =>
  Math.ceil((item.observed + item.fee) / 100) * 100;

export const formatDkk = (amount: number, lang: Lang) =>
  `${new Intl.NumberFormat(lang === "da" ? "da-DK" : "en-GB").format(amount)} DKK`;

export const budgetSource = (item: (typeof budgetExamples)[number]) => sources[item.source];
