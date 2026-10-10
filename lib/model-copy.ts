import type { FaqItem } from "@/components/Faq";
import type { Lang, Localized } from "./i18n";
import type { Model } from "./models";
import type { SourceId } from "./sources";
import { whyUsed } from "./category-copy";

/*
 * The sentences a model page says about the model, built from its own specs.
 *
 * Generated rather than written per model for one reason: every figure in them
 * is a field in lib/models.ts, so the lead and the answers cannot drift from
 * the specification table on the same page. Nothing here adds a fact. If a
 * model lacks a field, the sentence that would use it is not written.
 *
 * The opening paragraph answers "what is this machine" with the numbers in it,
 * as CLAUDE.md asks of every page; the questions are the ones a buyer types
 * about a specific model, answered from the same table.
 */

const field = (model: Model, label: string, lang: Lang) =>
  model.specs.find((spec) => spec.label.da === label)?.value[lang];

/** The part before the first dash: "8 GB DDR4 – kan udvides…" → "8 GB DDR4". */
const head = (value: string) => value.split(/ [–—] /)[0].trim();

/** The part after the first dash, used for the model's own description. */
const tail = (value: string) =>
  value
    .split(/ [–—] /)
    .slice(1)
    .join(" – ")
    .trim();

/* "a USB-C dock", "a 14-inch laptop": no description here starts with a vowel
   sound except a/e/i/o, and "U" in USB is read "you". */
const article = (word: string) => (/^[aeio]/i.test(word) ? "an" : "a");

/** "Dockingstation" → "dockingstation", but "USB-C dock" stays as written. */
const lcFirst = (text: string) =>
  /^[A-ZÆØÅ][a-zæøå]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;

/* "tre" and "to" as digits in the lead only, so the answer-first sentence
   carries the figure; the spec table keeps the wording it was written in. */
const digits = (text: string) =>
  text
    .replace(/\btre\b/g, "3")
    .replace(/\bthree\b/g, "3")
    .replace(/^to skærme/, "2 skærme")
    .replace(/^two monitors/, "2 monitors");

export const isComputer = (model: Model) => model.group !== "skaerme" && model.group !== "docking";

export function modelLead(model: Model, lang: Lang): string {
  const da = lang === "da";
  const desc = tail(field(model, "Model", lang) ?? "") || model.format[lang].toLowerCase();

  if (isComputer(model)) {
    const proc = field(model, "Processor", lang);
    const ram = field(model, "Hukommelse", lang);
    const storage = field(model, "Lagring", lang);
    const first = da
      ? `${model.name} er en ${desc}${proc ? ` med ${head(proc)}` : ""}.`
      : `The ${model.name} is ${article(desc)} ${desc}${proc ? ` with ${head(proc)}` : ""}.`;
    const second =
      ram && storage
        ? da
          ? ` Hukommelsen er ${head(ram).replace(/, kan.*$/, "")}, og lagringen er ${head(storage)}.`
          : ` Memory is ${head(ram).replace(/, (usually )?expandable.*$/, "")}, and storage is ${head(storage)}.`
        : "";
    return first + second;
  }

  if (model.group === "skaerme") {
    const panel = head(field(model, "Panel", lang) ?? "");
    const resolution = field(model, "Opløsning", lang);
    const mount = field(model, "Ophæng", lang);
    return da
      ? `${model.name} er en ${desc}${resolution ? ` i ${resolution}` : ""}${panel ? ` med ${panel.replace(/^IPS med /, "IPS-panel og ")}` : ""}.${mount ? ` Ophænget er ${head(mount)}.` : ""}`
      : `The ${model.name} is ${article(desc)} ${desc}${resolution ? ` in ${resolution}` : ""}${panel ? ` with ${panel.replace(/^IPS with /, "an IPS panel and ")}` : ""}.${mount ? ` The mount is ${head(mount)}.` : ""}`;
  }

  const connection = field(model, "Tilslutning", lang) ?? "";
  const screens = field(model, "Skærme", lang);
  const format = lcFirst(model.format[lang]);
  const drives = screens ? digits(lcFirst(screens)) : "";
  return da
    ? `${model.name} er en ${format}, der tilsluttes via ${connection}.${drives ? ` Den kan køre ${drives}.` : ""}`
    : `The ${model.name} is ${article(format)} ${format} that connects through ${connection}.${drives ? ` It drives ${drives}.` : ""}`;
}

const stock: Localized = {
  da: "Nej. Vi sourcer den til den enkelte ordre i stedet for at holde lager – fortæl os antal og hvad maskinerne skal bruges til, så vender vi tilbage med pris og leveringstid.",
  en: "No. We source it per order rather than holding stock — tell us the quantity and what the machines are for, and we come back with price and lead time.",
};

const configNote: Localized = {
  da: "Brugt hardware findes i mange sammensætninger, så den præcise konfiguration aftaler vi for jeres ordre.",
  en: "Used hardware turns up in many configurations, so the exact one is agreed for your order.",
};

export function modelFaqs(model: Model): FaqItem[] {
  const n = model.name;
  const f = (label: string) => ({
    da: field(model, label, "da") ?? "",
    en: field(model, label, "en") ?? "",
  });
  const items: FaqItem[] = [];

  if (isComputer(model)) {
    items.push({
      question: { da: `Kan ${n} køre Windows 11?`, en: `Can the ${n} run Windows 11?` },
      answer: {
        da: "Ja. Den leveres med Windows 11 installeret med drivere. Ifølge Microsoft kræver Windows 11 blandt andet TPM 2.0 og Secure Boot, og supporten for Windows 10 sluttede 14. oktober 2025.",
        en: "Yes. It is delivered with Windows 11 installed with drivers. According to Microsoft, Windows 11 requires TPM 2.0 and Secure Boot among other things, and Windows 10 support ended on 14 October 2025.",
      },
    });
    const ram = f("Hukommelse");
    const storage = f("Lagring");
    if (ram.da && storage.da) {
      items.push({
        question: {
          da: `Hvor meget hukommelse og lagerplads har ${n}?`,
          en: `How much memory and storage does the ${n} have?`,
        },
        answer: {
          da: `Hukommelse: ${ram.da}. Lagring: ${storage.da}. ${configNote.da}`,
          en: `Memory: ${ram.en}. Storage: ${storage.en}. ${configNote.en}`,
        },
      });
    }
    const ports = f("Porte");
    const outputs = f("Skærmudgange");
    if (ports.da) {
      items.push({
        question: { da: `Hvilke porte har ${n}?`, en: `Which ports does the ${n} have?` },
        answer: {
          da: `${ports.da}.${outputs.da ? ` Skærmudgange: ${outputs.da}.` : ""}`,
          en: `${ports.en}.${outputs.en ? ` Display outputs: ${outputs.en}.` : ""}`,
        },
      });
    }
  } else if (model.group === "skaerme") {
    const panel = f("Panel");
    const resolution = f("Opløsning");
    items.push({
      question: {
        da: `Hvilket panel og hvilken opløsning har ${n}?`,
        en: `Which panel and resolution does the ${n} have?`,
      },
      answer: {
        da: `${panel.da}. Opløsningen er ${resolution.da}.`,
        en: `${panel.en}. The resolution is ${resolution.en}.`,
      },
    });
    const connections = f("Tilslutninger");
    items.push({
      question: {
        da: `Hvilke tilslutninger har ${n}?`,
        en: `Which connections does the ${n} have?`,
      },
      answer: { da: `${connections.da}.`, en: `${connections.en}.` },
    });
    const stand = f("Fod");
    const mount = f("Ophæng");
    items.push({
      question: {
        da: `Hvordan kan ${n} justeres og monteres?`,
        en: `How can the ${n} be adjusted and mounted?`,
      },
      answer: {
        da: `Foden: ${stand.da}. Ophæng: ${mount.da}.`,
        en: `Stand: ${stand.en}. Mount: ${mount.en}.`,
      },
    });
  } else {
    const connection = f("Tilslutning");
    const screens = f("Skærme");
    const ports = f("Porte");
    const power = f("Strøm");
    items.push({
      question: { da: `Hvordan tilsluttes ${n}?`, en: `How does the ${n} connect?` },
      answer: { da: `Via ${connection.da}.`, en: `Through ${connection.en}.` },
    });
    items.push({
      question: {
        da: `Hvor mange skærme kan ${n} køre?`,
        en: `How many monitors can the ${n} drive?`,
      },
      answer: { da: `${screens.da}.`, en: `${screens.en}.` },
    });
    items.push({
      question: { da: `Hvilke porte har ${n}?`, en: `Which ports does the ${n} have?` },
      answer: {
        da: `${ports.da}.${power.da ? ` ${power.da}.` : ""}`,
        en: `${ports.en}.${power.en ? ` ${power.en}.` : ""}`,
      },
    });
  }

  /* Monitors and docks have no Windows answer to cite; the reason to buy
     them used is the one source that applies to them. */
  if (!isComputer(model)) items.push(whyUsed);

  items.push({
    question: { da: `Har I ${n} på lager?`, en: `Do you have the ${n} in stock?` },
    answer: stock,
  });
  return items;
}

/** Only the documents a model's answers lean on: Windows for computers, e-waste for the rest. */
export const modelSources = (model: Model): SourceId[] =>
  isComputer(model) ? ["windows11Requirements", "windows10Eol"] : ["ewasteMonitor"];
