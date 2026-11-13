import type { CraftMarkName } from "@/components/CraftMark";
import type { Localized } from "./i18n";

type CategoryMedia = {
  kind: "photo" | "illustration";
  alt: Localized;
  src?: string;
  width?: number;
  height?: number;
  mark?: CraftMarkName;
  credit?: { author: string; source: string; licence: string; licenceUrl: string };
};

/** Category references explain a type of equipment, never an available stock unit. */
export const categoryMedia: Record<string, CategoryMedia> = {
  "baerbare-computere": {
    kind: "photo",
    src: "/thinkpad-t480-6.jpg",
    width: 1179,
    height: 1115,
    alt: {
      da: "Referencefoto: åben Lenovo ThinkPad T480 som eksempel på en erhvervsbærbar",
      en: "Reference photo: an open Lenovo ThinkPad T480 as an example of a business laptop",
    },
  },
  "stationaere-computere": {
    kind: "illustration",
    src: "/pricing/optiplex-5060-sff-illustration.svg",
    width: 1200,
    height: 900,
    alt: {
      da: "Illustration af en stationær computer i et kompakt, stående SFF-kabinet",
      en: "Illustration of a desktop computer in a compact, upright SFF case",
    },
  },
  skaerme: {
    kind: "illustration",
    src: "/pricing/ultrasharp-u2419h-illustration.svg",
    width: 1200,
    height: 900,
    alt: {
      da: "Illustration af en kontorskærm med højdejusterbar fod",
      en: "Illustration of an office monitor on a height-adjustable stand",
    },
  },
  "mini-pc": {
    kind: "illustration",
    src: "/products/lenovo-thinkcentre-m720q.svg",
    width: 1200,
    height: 900,
    alt: {
      da: "Illustration af en kompakt mini-pc i et fladt kabinet",
      en: "Illustration of a compact mini PC in a flat case",
    },
  },
  tablets: {
    kind: "illustration",
    mark: "tablet",
    alt: { da: "Illustration af tablet-formatet", en: "Illustration of the tablet format" },
  },
  smartphones: {
    kind: "illustration",
    mark: "phone",
    alt: { da: "Illustration af smartphone-formatet", en: "Illustration of the smartphone format" },
  },
  dockingstationer: {
    kind: "photo",
    src: "/models/dell-wd19/front-reference.webp",
    width: 1600,
    height: 900,
    alt: {
      da: "Referencefoto: Dell WD19 USB-C-dock set forfra som eksempel på en dockingstation",
      en: "Reference photo: a Dell WD19 USB-C dock viewed from the front as an example of a docking station",
    },
    credit: {
      author: "Raimond Spekking",
      source: "https://commons.wikimedia.org/wiki/File:Dell_WD19_(model_K20A)-5812.jpg",
      licence: "CC BY-SA 4.0 (resized)",
      licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
};

export const categoryApplications: Record<string, Localized> = {
  "baerbare-computere": { da: "Kontor og arbejde på farten", en: "Office and work on the move" },
  "stationaere-computere": { da: "Faste arbejdspladser", en: "Fixed workstations" },
  skaerme: { da: "Mere plads til arbejdet", en: "More room for your work" },
  "mini-pc": { da: "Små skriveborde og reception", en: "Small desks and reception" },
  tablets: { da: "Lager, butik og service", en: "Warehouse, retail and service" },
  smartphones: { da: "Telefoner til medarbejdere", en: "Phones for your team" },
  dockingstationer: { da: "Skærme og tilbehør samlet", en: "Connect your desk equipment" },
};
