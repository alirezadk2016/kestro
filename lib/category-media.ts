import type { CraftMarkName } from "@/components/CraftMark";
import type { Localized } from "./i18n";

type CategoryMedia = {
  kind: "photo" | "illustration";
  alt: Localized;
  src?: string;
  width?: number;
  height?: number;
  mark?: CraftMarkName;
  /** The source photo cuts the device at this edge; set it flush to the frame
      there so the cut reads as the frame's crop, not a damaged picture. */
  bleed?: "right";
  credit?: { subject: string; author: string; source: string; licence: string; licenceUrl: string };
};

/** Category references explain a type of equipment, never an available stock unit. */
export const categoryMedia: Record<string, CategoryMedia> = {
  /* A 2021 EliteBook 840 G8, screen off, on a white ground. The 2018 T480
     that stood here showed a Windows 10 start menu, and a buyer reads that
     as old stock on a page whose own FAQ says Windows 10 support has ended;
     most of the 59 laptops in the list are generations from 2020 on. */
  "baerbare-computere": {
    kind: "photo",
    src: "/models/elitebook/840-g8-reference.webp",
    width: 1280,
    height: 1182,
    bleed: "right",
    alt: {
      da: "Referencefoto: åben HP EliteBook 840 G8 som eksempel på en erhvervsbærbar",
      en: "Reference photo: an open HP EliteBook 840 G8 as an example of a business laptop",
    },
    credit: {
      subject: "HP EliteBook 840 G8",
      author: "Infinatious",
      source: "https://commons.wikimedia.org/wiki/File:HP_EliteBook_840_G8.png",
      licence: "CC BY-SA 4.0 (resized)",
      licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
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
      subject: "Dell WD19",
      author: "Raimond Spekking",
      source: "https://commons.wikimedia.org/wiki/File:Dell_WD19_(model_K20A)-5812.jpg",
      licence: "CC BY-SA 4.0 (resized)",
      licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
};

/* What tells one card from the next, in words a buyer compares: form factor
   and size, taken from the models' own specs in lib/models.ts. "Faste
   arbejdspladser" and "Små skriveborde" did not say why a mini PC is not a
   desktop, and "Skærme og tilbehør samlet" on the dock card read as monitors. */
export const categoryApplications: Record<string, Localized> = {
  "baerbare-computere": { da: "Kontor og arbejde på farten", en: "Office and work on the move" },
  "stationaere-computere": {
    da: "SFF og tower til faste arbejdspladser",
    en: "SFF and tower PCs for fixed desks",
  },
  skaerme: {
    da: "24-tommers kontorskærme med højdejustering",
    en: "24-inch office monitors with height adjustment",
  },
  "mini-pc": {
    da: "1-liters pc, der kan sidde bag skærmen",
    en: "One-litre PCs that can mount behind the monitor",
  },
  tablets: { da: "Lager, butik og service", en: "Warehouse, retail and service" },
  smartphones: { da: "Telefoner til medarbejdere", en: "Phones for your team" },
  dockingstationer: {
    da: "Skærme, net og tastatur i ét stik",
    en: "Monitors, network and keyboard in one connection",
  },
};
