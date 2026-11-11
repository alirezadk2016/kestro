import type { Localized } from "./i18n";

export type BudgetMedia = {
  src: string;
  width: number;
  height: number;
  kind: "photo" | "illustration";
  category: Localized;
  alt: Localized;
};

/** Representative media, never evidence of a seller's individual unit or condition. */
export const pricingMedia: Record<string, BudgetMedia> = {
  "lenovo-thinkpad-t480": {
    src: "/thinkpad-t480-6.jpg",
    width: 1179,
    height: 1115,
    kind: "photo",
    category: { da: "14″ bærbar", en: "14-inch laptop" },
    alt: {
      da: "Modelfoto af en åben Lenovo ThinkPad T480 set forfra",
      en: "Model photo of an open Lenovo ThinkPad T480 viewed from the front",
    },
  },
  "lenovo-thinkpad-t14": {
    src: "/models/t14/gen2-intel-reference.webp",
    width: 1600,
    height: 1200,
    kind: "photo",
    category: { da: "14″ bærbar", en: "14-inch laptop" },
    alt: {
      da: "Modelfoto af en Lenovo ThinkPad T14 Gen 2 Intel på et træbord",
      en: "Model photo of a Lenovo ThinkPad T14 Gen 2 Intel on a wooden desk",
    },
  },
  "dell-optiplex-5060": {
    src: "/pricing/optiplex-5060-sff-illustration.svg",
    width: 1200,
    height: 900,
    kind: "illustration",
    category: { da: "Stationær · SFF", en: "Desktop · SFF" },
    alt: {
      da: "Skematisk illustration af OptiPlex 5060 SFF-formatet med smalt kabinet og frontporte",
      en: "Schematic illustration of the OptiPlex 5060 SFF format with a slim case and front ports",
    },
  },
  "dell-ultrasharp-u2419h": {
    src: "/pricing/ultrasharp-u2419h-illustration.svg",
    width: 1200,
    height: 900,
    kind: "illustration",
    category: { da: "23,8″ skærm", en: "23.8-inch monitor" },
    alt: {
      da: "Skematisk illustration af en UltraSharp U2419H-type med 16:9-skærm og sølvfarvet fod",
      en: "Schematic illustration of an UltraSharp U2419H type with a 16:9 screen and silver stand",
    },
  },
};
