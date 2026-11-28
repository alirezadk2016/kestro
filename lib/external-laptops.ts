import type { Localized } from "./i18n";
import type { SourceId } from "./sources";

/** Editorial selections of exact third-party configurations, never Kestro stock. */
export type ExternalLaptopRecommendation = {
  id: string;
  name: string;
  useCase: Localized;
  configuration: Localized;
  condition: Localized;
  reason: Localized;
  caveat: Localized;
  seller: string;
  buyerLabel: Localized;
  source: SourceId;
  checkedOn: string;
  photo?: {
    src: string;
    width: number;
    height: number;
    alt: Localized;
    author: string;
    source: string;
    licence: string;
    licenceUrl: string;
  };
};

export const externalLaptops: ExternalLaptopRecommendation[] = [
  {
    id: "thinkpad-t14-g2",
    photo: {
      src: "/models/t14/gen2-intel-reference.webp",
      width: 1600,
      height: 1200,
      alt: {
        da: "Modelfoto af en åben Lenovo ThinkPad T14 Gen 2 Intel på et træbord",
        en: "Model photo of an open Lenovo ThinkPad T14 Gen 2 Intel on a wooden desk",
      },
      author: "Edvard10",
      source: "https://commons.wikimedia.org/wiki/File:ThinkPad_T14.jpg",
      licence: "CC0 1.0",
      licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
    name: "Lenovo ThinkPad T14 Gen 2",
    useCase: { da: "Kontor og hybridarbejde", en: "Office and hybrid work" },
    configuration: {
      da: "Core i5 · 16 GB RAM · 256 GB SSD · 14″ · Windows 11 Pro",
      en: "Core i5 · 16 GB RAM · 256 GB SSD · 14-inch · Windows 11 Pro",
    },
    condition: { da: "Meget god stand", en: "Very good condition" },
    reason: {
      da: "Til almindeligt kontorarbejde med dokumenter, mail og møder.",
      en: "For everyday office work with documents, email and meetings.",
    },
    caveat: {
      da: "256 GB SSD; få tastaturlayoutet bekræftet hos sælgeren.",
      en: "256 GB SSD; confirm the keyboard layout with the seller.",
    },
    seller: "Dustin",
    buyerLabel: { da: "Erhvervskøb", en: "Business purchase" },
    source: "externalBusinessT14",
    checkedOn: "2026-11-11",
  },
  {
    id: "elitebook-840-g8",
    photo: {
      src: "/models/elitebook/840-g8-reference.webp",
      width: 1280,
      height: 1182,
      alt: {
        da: "Modelfoto af en åben sølvfarvet HP EliteBook 840 G8 med sort skærm",
        en: "Model photo of an open silver HP EliteBook 840 G8 with a black screen",
      },
      author: "Infinatious",
      source: "https://commons.wikimedia.org/wiki/File:HP_EliteBook_840_G8.png",
      licence: "CC BY-SA 4.0",
      licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    name: "HP EliteBook 840 G8",
    useCase: { da: "Mere plads til arbejdsfiler", en: "More room for work files" },
    configuration: {
      da: "Core i5-1135G7 · 16 GB RAM · 512 GB SSD · 14″ · Windows 11 Pro · nordisk tastatur",
      en: "Core i5-1135G7 · 16 GB RAM · 512 GB SSD · 14-inch · Windows 11 Pro · Nordic keyboard",
    },
    condition: { da: "Meget god stand", en: "Very good condition" },
    reason: {
      da: "Til medarbejderen med mange arbejdsfiler gemt lokalt.",
      en: "For employees who keep many work files locally.",
    },
    caveat: {
      da: "Få batteritilstanden bekræftet før køb.",
      en: "Confirm the battery health before buying.",
    },
    seller: "Dustin",
    buyerLabel: { da: "Erhvervskøb", en: "Business purchase" },
    source: "externalBusinessEliteBook",
    checkedOn: "2026-11-11",
  },
  {
    id: "latitude-5420",
    name: "Dell Latitude 5420",
    useCase: { da: "Kontor og cloud", en: "Office and cloud" },
    configuration: {
      da: "Core i5-1145G7 · 16 GB RAM · 256 GB SSD · 14″ · Windows 11 Pro · nordisk tastatur",
      en: "Core i5-1145G7 · 16 GB RAM · 256 GB SSD · 14-inch · Windows 11 Pro · Nordic keyboard",
    },
    condition: { da: "Stand B", en: "Grade B" },
    reason: {
      da: "Til teams, der primært arbejder i browseren og virksomhedens cloudsystemer.",
      en: "For teams mainly working in the browser and the company’s cloud systems.",
    },
    caveat: {
      da: "Sælgeren angiver 70 % batterikapacitet og mulige skærmspor.",
      en: "The seller states 70% battery capacity and possible marks on the screen.",
    },
    seller: "Proshop",
    buyerLabel: { da: "Privat og erhverv", en: "Personal and business" },
    source: "externalBusinessLatitude",
    checkedOn: "2026-11-11",
  },
];
