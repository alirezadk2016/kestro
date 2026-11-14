import type { Localized } from "./i18n";

/*
 * Where a buyer can find each reference model while Kestro stocks none of
 * them. A link is kept only where the retailer's own search, loaded on
 * checkedOn, showed at least one result of that exact model line. How each
 * search was checked, and which retailers could not be checked, is in
 * docs/retail-links.md.
 */

export type Retailer = "proshop" | "dustin" | "elgiganten" | "amazon" | "refurbed";

export const retailers: Record<Retailer, { name: string; home: string }> = {
  proshop: { name: "Proshop", home: "https://www.proshop.dk" },
  dustin: { name: "Dustin", home: "https://www.dustin.dk" },
  elgiganten: { name: "Elgiganten", home: "https://www.elgiganten.dk" },
  amazon: { name: "Amazon.de", home: "https://www.amazon.de" },
  refurbed: { name: "refurbed", home: "https://www.refurbed.dk" },
};

/** A retailer's search for one model, kept only where the search showed that exact model. */
export type RetailLink = {
  retailer: Retailer;
  url: string; // the search URL for this model, exactly as you loaded it
  condition: "used" | "new" | "mixed"; // what the matching results were
  /** Short note for the buyer, e.g. "Brugte og refurbished, flere generationer" / "Used and refurbished, several generations". No prices, no counts, no "best". */
  note: Localized;
  checkedOn: string; // YYYY-MM-DD, today
};

/** Keyed by model slug from lib/models.ts. A model with no matching retailer gets an empty array. */
export const retailLinks: Record<string, RetailLink[]> = {
  "lenovo-thinkpad-t480": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Lenovo+ThinkPad+T480",
      condition: "used",
      note: {
        da: "Refurbished T480 i flere konfigurationer. T480s i samme søgning er en anden model",
        en: "Refurbished T480 in several configurations. The T480s in the same search is a different model",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "lenovo-thinkpad-t14": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Lenovo+ThinkPad+T14",
      condition: "used",
      note: {
        da: "Refurbished – Gen 1 og Gen 2 samt nyere generationer",
        en: "Refurbished — Gen 1 and Gen 2, plus newer generations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "lenovo-thinkpad-x1-carbon": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Lenovo+ThinkPad+X1+Carbon",
      condition: "used",
      note: {
        da: "Refurbished – Gen 6–8 samt nyere generationer",
        en: "Refurbished — Gen 6–8, plus newer generations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "lenovo-thinkpad-l14": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Lenovo+ThinkPad+L14",
      condition: "used",
      note: {
        da: "Refurbished – Gen 1 og Gen 2 samt nyere generationer",
        en: "Refurbished — Gen 1 and Gen 2, plus newer generations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "hp-elitebook-840": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=HP+EliteBook+840",
      condition: "used",
      note: {
        da: "Refurbished – G5 og G6 samt nyere generationer",
        en: "Refurbished — G5 and G6, plus newer generations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "hp-probook-450": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=HP+ProBook+450",
      condition: "used",
      note: {
        da: "Refurbished – G7 og G8 samt ældre og nyere generationer",
        en: "Refurbished — G7 and G8, plus older and newer generations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "dell-latitude-5410": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Dell+Latitude+5410",
      condition: "used",
      note: {
        da: "Refurbished 5410 i flere konfigurationer",
        en: "Refurbished 5410 in several configurations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "dell-latitude-7490": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Dell+Latitude+7490",
      condition: "used",
      note: {
        da: "Refurbished 7490 i flere konfigurationer",
        en: "Refurbished 7490 in several configurations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "hp-zbook-15": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=HP+ZBook+15",
      condition: "used",
      note: {
        da: "Refurbished – G5 og G6. ZBook Fury og Firefly i samme søgning er andre serier",
        en: "Refurbished — G5 and G6. The ZBook Fury and Firefly in the same search are other ranges",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "hp-elitedesk-800": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=HP+EliteDesk+800",
      condition: "used",
      note: {
        da: "Refurbished – G4 og G5 som SFF, Tower og Mini samt nyere generationer",
        en: "Refurbished — G4 and G5 as SFF, tower and mini, plus newer generations",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "lenovo-thinkcentre-m720q": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Lenovo+ThinkCentre+M720q+Tiny",
      condition: "used",
      note: {
        da: "Refurbished M720q Tiny",
        en: "Refurbished M720q Tiny",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "dell-optiplex-5060": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Dell+OptiPlex+5060",
      condition: "used",
      note: {
        da: "Refurbished 5060 som SFF. Søgningen viser også andre OptiPlex-modeller",
        en: "Refurbished 5060 as SFF. The search also shows other OptiPlex models",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "dell-ultrasharp-u2419h": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Dell+UltraSharp+U2419H",
      condition: "used",
      note: {
        da: "Refurbished U2419H. U2415H i samme søgning er en anden model",
        en: "Refurbished U2419H. The U2415H in the same search is a different model",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "hp-elitedisplay-e243": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=HP+EliteDisplay+E243",
      condition: "used",
      note: {
        da: "Refurbished E243 blandt andre EliteDisplay-modeller",
        en: "Refurbished E243 among other EliteDisplay models",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "lenovo-thinkvision-t24i": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Lenovo+ThinkVision+T24i",
      condition: "used",
      note: {
        da: "Refurbished – flere generationer: T24i-10, T24i-20 og T24i-2L",
        en: "Refurbished — several generations: T24i-10, T24i-20 and T24i-2L",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "lenovo-thinkpad-ultra-dock": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Lenovo+ThinkPad+Ultra+Dock",
      condition: "used",
      note: {
        da: "Refurbished – både 40A2, som passer til T480, og 40AJ",
        en: "Refurbished — both the 40A2, which fits the T480, and the 40AJ",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "dell-wd19": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=Dell+Dock+WD19",
      condition: "used",
      note: {
        da: "Refurbished WD19 samt varianterne WD19S, WD19TB og WD19DC",
        en: "Refurbished WD19, plus the WD19S, WD19TB and WD19DC variants",
      },
      checkedOn: "2026-11-12",
    },
  ],
  "hp-usb-c-dock-g5": [
    {
      retailer: "refurbed",
      url: "https://www.refurbed.dk/search/?query=HP+USB-C+Dock+G5",
      condition: "used",
      note: {
        da: "Refurbished USB-C Dock G5",
        en: "Refurbished USB-C Dock G5",
      },
      checkedOn: "2026-11-12",
    },
  ],
};
