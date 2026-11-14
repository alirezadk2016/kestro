import type { Localized } from "./i18n";
import type { Model, ModelGroup } from "./models";

/*
 * Lenovo business laptops, one page per generation.
 *
 * Every figure below is read from that generation's Lenovo PSREF spec sheet;
 * the URL and the day it was read are listed per model in
 * docs/lenovo-models-sources.md. Where PSREF splits Intel and AMD into two
 * products, the page covers both and says where they differ. Nothing here is
 * stock or a price: these are reference models, and the exact configuration
 * is agreed per order, the same as the rest of lib/models.ts.
 *
 * The specs use the labels the other laptops use, plus "Batteri", so the
 * generated lead and answers in lib/model-copy.ts read them the same way.
 */

type Facts = {
  model: Localized;
  processor: Localized;
  memory: Localized;
  storage: Localized;
  graphics: Localized;
  display: Localized;
  ports: Localized;
  weight: Localized;
  battery: Localized;
  os: Localized;
};

type Entry = Omit<Model, "brand" | "category" | "group" | "specs"> & {
  group?: ModelGroup;
  facts: Facts;
};

const LABELS: [keyof Facts, Localized][] = [
  ["model", { da: "Model", en: "Model" }],
  ["processor", { da: "Processor", en: "Processor" }],
  ["memory", { da: "Hukommelse", en: "Memory" }],
  ["storage", { da: "Lagring", en: "Storage" }],
  ["graphics", { da: "Grafik", en: "Graphics" }],
  ["display", { da: "Skærm", en: "Display" }],
  ["ports", { da: "Porte", en: "Ports" }],
  ["weight", { da: "Vægt", en: "Weight" }],
  ["battery", { da: "Batteri", en: "Battery" }],
  ["os", { da: "Styresystem", en: "Operating system" }],
];

function laptop({ facts, group = "baerbare", ...entry }: Entry): Model {
  return {
    ...entry,
    brand: "Lenovo",
    group,
    category: "baerbare-computere",
    specs: LABELS.map(([key, label]) => ({ label, value: facts[key] })),
  };
}

/* What PSREF lists as factory installs. Older generations shipped with
   Windows 10 as well; the P series adds Linux on selected models. */
const OS_11: Localized = {
  da: "Windows 11 Pro eller Home fra fabrikken – version, licens og drivere efter aftale",
  en: "Windows 11 Pro or Home from the factory — version, licence and drivers as agreed",
};
const OS_10: Localized = {
  da: "Windows 10 eller 11 (Pro eller Home) fra fabrikken – version, licens og drivere efter aftale",
  en: "Windows 10 or 11 (Pro or Home) from the factory — version, licence and drivers as agreed",
};
const OS_P: Localized = {
  da: "Windows 11 Pro eller Home, på udvalgte modeller Linux fra fabrikken – version, licens og drivere efter aftale",
  en: "Windows 11 Pro or Home, Linux on selected models from the factory — version, licence and drivers as agreed",
};

export const lenovoBusinessModels: Model[] = [
  laptop({
    slug: "lenovo-thinkpad-t14-gen-3",
    name: "Lenovo ThinkPad T14 Gen 3",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "Den første T14 med 16:10-skærm – Intel 12. gen eller Ryzen PRO 6000.",
      en: "The first T14 with a 16:10 screen — Intel 12th gen or Ryzen PRO 6000.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14 Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T14 Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad T14 Gen 3: 14" med 16:10-skærm, netstik og Intel eller Ryzen PRO. Intel har en fri sokkel til RAM, AMD har alt loddet fast. Få tilbud.',
      en: 'Refurbished ThinkPad T14 Gen 3: a 14" with a 16:10 screen, Ethernet and Intel or Ryzen. Intel still has a free slot for RAM; on AMD it is all soldered.',
    },
    intro: {
      da: "Gen 3 er generationen, hvor T14 fik en 16:10-skærm på 1920×1200 i stedet for Full HD. Intel-udgaven har 12. generations Core med Thunderbolt 4 og én fri RAM-sokkel; AMD-udgaven har Ryzen PRO 6000 og al hukommelse loddet fast. Begge har netværksstik og HDMI i kabinettet.",
      en: "Gen 3 is the generation where the T14 moved to a 16:10 screen at 1920×1200 instead of Full HD. The Intel version has 12th-generation Core with Thunderbolt 4 and one free RAM slot; the AMD version has Ryzen PRO 6000 and all of its memory soldered. Both have Ethernet and HDMI built in.",
    },
    goodFor: [
      {
        da: "Kontorer, der vil have netværksstik og HDMI uden adaptere",
        en: "Offices that want Ethernet and HDMI without adapters",
      },
      {
        da: "Regneark og lange dokumenter, hvor 16:10 giver flere rækker",
        en: "Spreadsheets and long documents, where 16:10 shows more rows",
      },
      {
        da: "Flåder, der blander Intel- og AMD-maskiner",
        en: "Fleets that mix Intel and AMD machines",
      },
    ],
    notes: [
      {
        da: "På AMD-udgaven er 8, 16 eller 32 GB loddet fast og kan ikke udvides. Vælg mængden ved køb.",
        en: "On the AMD version, 8, 16 or 32 GB is soldered and cannot be expanded. Choose the amount when buying.",
      },
      {
        da: "Lenovo angiver, at Iris Xe-grafikken på Intel kræver dual-channel-RAM; med kun den loddede hukommelse kører den som UHD. Spørg til begge moduler.",
        en: "Lenovo states that Iris Xe graphics on Intel need dual-channel RAM; with only the soldered memory it runs as UHD. Ask about both modules.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T14 Gen 3 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad T14 Gen 3 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation) eller AMD Ryzen 5/7 PRO 6000 – U- og P-serie på Intel",
        en: "Intel Core i5/i7 (12th generation) or AMD Ryzen 5/7 PRO 6000 — U and P series on Intel",
      },
      memory: {
        da: "Op til 48 GB DDR4 (Intel) eller 8–32 GB LPDDR5 (AMD) – Intel har 8 eller 16 GB loddet plus én SO-DIMM-sokkel; AMD er loddet fast",
        en: "Up to 48 GB DDR4 (Intel) or 8–32 GB LPDDR5 (AMD) — Intel has 8 or 16 GB soldered plus one SO-DIMM slot; AMD is soldered",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA GeForce MX550 (2 GB); AMD Radeon 660M/680M",
        en: "Intel Iris Xe or NVIDIA GeForce MX550 (2 GB); AMD Radeon 660M/680M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K eller WQUXGA (3840×2400) på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K or WQUXGA (3840×2400) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: {
        da: "Fra 1,36 kg (Intel) og 1,41 kg (AMD)",
        en: "From 1.36 kg (Intel) and 1.41 kg (AMD)",
      },
      battery: { da: "39,3 eller 52,5 Wh, indbygget", en: "39.3 or 52.5 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t14-gen-4",
    name: "Lenovo ThinkPad T14 Gen 4",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "Intel 13. gen eller Ryzen PRO 7040 – og et OLED-panel som mulighed.",
      en: "Intel 13th gen or Ryzen PRO 7040 — with an OLED panel as an option.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14 Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T14 Gen 4: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad T14 Gen 4: Intel 13. gen eller Ryzen PRO, og OLED er et af skærmvalgene. RAM er i en fri sokkel eller er loddet, alt efter modellen.",
      en: "Refurbished ThinkPad T14 Gen 4: Intel 13th gen or Ryzen PRO, with OLED as one of the screens. Its RAM is in a free slot or is soldered, by variant.",
    },
    intro: {
      da: "T14 Gen 4 bygger på samme kabinet som Gen 3, men med Intel Core 13. generation eller AMD Ryzen PRO 7040 og Radeon 780M-grafik i topmodellen. Hukommelsen er det, der skal tjekkes: Lenovo byggede Intel-udgaven i tre varianter, fra én fri sokkel til alt loddet fast.",
      en: "The T14 Gen 4 keeps the Gen 3 chassis but moves to 13th-generation Intel Core or AMD Ryzen PRO 7040, with Radeon 780M graphics in the top model. Memory is what needs checking: Lenovo built the Intel version three ways, from one free slot to fully soldered.",
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have nyere processor end Gen 3 uden at miste netværksstikket",
        en: "Staff who want a newer processor than Gen 3 without losing the Ethernet port",
      },
      {
        da: "Billedarbejde på 2,8K OLED-skærmen",
        en: "Image work on the 2.8K OLED screen",
      },
    ],
    notes: [
      {
        da: "Intel-modeller findes med DDR4 og én sokkel (op til 40 GB), DDR5 og én sokkel (op til 32 GB) eller 16/32 GB loddet LPDDR5x. AMD-modellerne er altid loddet. Spørg til typen.",
        en: "Intel models come with DDR4 and one slot (up to 40 GB), DDR5 and one slot (up to 32 GB) or 16/32 GB soldered LPDDR5x. AMD models are always soldered. Ask which type it is.",
      },
      {
        da: "AMD-udgaven har én USB4- og én USB-C 3.2-port i stedet for to Thunderbolt 4. Tjek jeres dock, før I blander de to.",
        en: "The AMD version has one USB4 and one USB-C 3.2 port instead of two Thunderbolt 4. Check your dock before mixing the two.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T14 Gen 4 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad T14 Gen 4 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation) eller AMD Ryzen 5/7 PRO 7040 – U- og P-serie på Intel",
        en: "Intel Core i5/i7 (13th generation) or AMD Ryzen 5/7 PRO 7040 — U and P series on Intel",
      },
      memory: {
        da: "8–40 GB (Intel) eller 8–32 GB (AMD) – Intel med én sokkel eller loddet efter variant; AMD er loddet fast",
        en: "8–40 GB (Intel) or 8–32 GB (AMD) — Intel with one slot or soldered depending on variant; AMD is soldered",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA GeForce MX550 (4 GB); AMD Radeon 740M/780M",
        en: "Intel Iris Xe or NVIDIA GeForce MX550 (4 GB); AMD Radeon 740M/780M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K IPS eller 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K IPS or 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: {
        da: "Fra 1,32 kg (Intel) og 1,35 kg (AMD)",
        en: "From 1.32 kg (Intel) and 1.35 kg (AMD)",
      },
      battery: { da: "39,3 eller 52,5 Wh, indbygget", en: "39.3 or 52.5 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t14-gen-5",
    name: "Lenovo ThinkPad T14 Gen 5",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "To RAM-sokler igen – op til 64 GB DDR5 på både Intel og AMD.",
      en: "Two RAM slots again — up to 64 GB DDR5 on both Intel and AMD.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14 Gen 5: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T14 Gen 5: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad T14 Gen 5: to sokler til RAM på både Intel og AMD, så den kan få op til 64 GB, og den har stadig netstik. Få et skriftligt tilbud.",
      en: "Refurbished ThinkPad T14 Gen 5: two RAM slots on Intel and AMD alike, so it fits up to 64 GB, and it still has Ethernet built in. Get a written quote.",
    },
    intro: {
      da: "Gen 5 er den T14, der kan opgraderes igen: to DDR5-sokler op til 64 GB, både med Intel Core Ultra og AMD Ryzen PRO 8040. Begge platforme har to USB-C-porte med Thunderbolt 4/USB4, så Intel og AMD kan dele dockingstationer. Netværksstik og HDMI sidder stadig i kabinettet.",
      en: "Gen 5 is the T14 that can be upgraded again: two DDR5 slots up to 64 GB, with either Intel Core Ultra or AMD Ryzen PRO 8040. Both platforms have two USB-C ports with Thunderbolt 4/USB4, so Intel and AMD units can share docks. Ethernet and HDMI are still built in.",
    },
    goodFor: [
      {
        da: "Virksomheder, der vil kunne udvide RAM senere i maskinens levetid",
        en: "Companies that want to add RAM later in the machine's life",
      },
      {
        da: "Blandede Intel- og AMD-flåder på samme dockingstationer",
        en: "Mixed Intel and AMD fleets on the same docks",
      },
      {
        da: "Medarbejdere, der kører mange programmer og faner på én gang",
        en: "Staff who run many programs and tabs at once",
      },
    ],
    notes: [
      {
        da: "Intel Arc-grafik kræver ifølge Lenovo en H-serie-processor og mindst 16 GB i dual-channel; ellers kører den som Intel Graphics. Bed om to moduler, hvis grafikken betyder noget.",
        en: "Lenovo says Intel Arc graphics need an H-series processor and at least 16 GB in dual channel; otherwise they run as Intel Graphics. Ask for two modules if graphics matter.",
      },
      {
        da: "2,2K-skærmen findes kun på Intel-udgaven; begge platforme kan have 2,8K OLED. Angiv skærm, hvis I bestiller flere ens maskiner.",
        en: "The 2.2K screen exists only on the Intel version; both platforms can have 2.8K OLED. State the screen if you order several identical machines.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T14 Gen 5 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad T14 Gen 5 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) eller AMD Ryzen 5/7 PRO 8040 – U- og H-serie på Intel",
        en: "Intel Core Ultra 5/7 (Series 1) or AMD Ryzen 5/7 PRO 8040 — U and H series on Intel",
      },
      memory: {
        da: "Op til 64 GB DDR5-5600 – to SODIMM-sokler på begge platforme",
        en: "Up to 64 GB DDR5-5600 — two SODIMM slots on both platforms",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc; AMD Radeon 740M/780M",
        en: "Intel Graphics or Intel Arc; AMD Radeon 740M/780M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K IPS (Intel) eller 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K IPS (Intel) or 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× USB-C med Thunderbolt 4/USB4, HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× USB-C with Thunderbolt 4/USB4, HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,31 kg", en: "From 1.31 kg" },
      battery: { da: "39,3 eller 52,5 Wh, indbygget", en: "39.3 or 52.5 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t14s-gen-2",
    name: "Lenovo ThinkPad T14s Gen 2",
    format: { da: '14" let bærbar', en: '14" thin and light' },
    tagline: {
      da: "Den tynde T14 – Intel 11. gen eller Ryzen 5000, 57 Wh-batteri.",
      en: "The slim T14 — Intel 11th gen or Ryzen 5000, a 57 Wh battery.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14s Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T14s Gen 2: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad T14s Gen 2: den slanke T14 fra 1,28 kg med et større batteri og Intel eller Ryzen. RAM er loddet, så vælg nok fra start. Få tilbud.",
      en: "Refurbished ThinkPad T14s Gen 2: the slim T14 from 1.28 kg, with a bigger battery and Intel or Ryzen. Its RAM is soldered, so pick enough at first.",
    },
    intro: {
      da: 'T14s er den slanke udgave af T14: lettere, med et større batteri på 57 Wh og uden fuldt netværksstik. Gen 2 har Intel Core 11. generation med Thunderbolt 4 eller AMD Ryzen 5000 og en 14" Full HD-skærm. Hukommelsen er loddet fast på begge.',
      en: 'The T14s is the slim version of the T14: lighter, with a larger 57 Wh battery and no full-size Ethernet port. Gen 2 has 11th-generation Intel Core with Thunderbolt 4 or AMD Ryzen 5000, and a 14" Full HD screen. Memory is soldered on both.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der pendler, men vil have et fuldt tastatur",
        en: "Staff who commute but want a full keyboard",
      },
      {
        da: "Hybridarbejde med dock på kontoret og batteri hjemme",
        en: "Hybrid work with a dock at the office and battery at home",
      },
    ],
    notes: [
      {
        da: "8, 16 eller 32 GB LPDDR4x er loddet fast. Vælg 16 GB eller mere, hvis maskinen skal holde nogle år.",
        en: "8, 16 or 32 GB of LPDDR4x is soldered. Choose 16 GB or more if the machine has to last a few years.",
      },
      {
        da: "Kablet netværk kræver Lenovos adapter til det lille netværksstik eller en dock – det er kun på udvalgte modeller. Husk at bestille adapteren med.",
        en: "Wired networking needs Lenovo's adapter for the small Ethernet connector or a dock — and only on selected models. Remember to order the adapter too.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T14s Gen 2 (Intel og AMD) – 14" let erhvervsbærbar',
        en: 'Lenovo ThinkPad T14s Gen 2 (Intel and AMD) — 14" thin-and-light business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (11. generation) eller AMD Ryzen 3/5/7 5000 – PRO-varianter på AMD",
        en: "Intel Core i5/i7 (11th generation) or AMD Ryzen 3/5/7 5000 — PRO variants on AMD",
      },
      memory: {
        da: "8–32 GB LPDDR4x – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR4x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 NVMe SSD op til 2 TB – kan udskiftes",
        en: "One M.2 NVMe SSD up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller AMD Radeon (integreret)",
        en: "Intel Iris Xe or AMD Radeon (integrated)",
      },
      display: {
        da: '14" Full HD (1920×1080) IPS, også med berøring; 4K UHD på udvalgte modeller',
        en: '14" Full HD (1920×1080) IPS, also with touch; 4K UHD on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.0 og kombineret lydstik; netværk via mini-stik på udvalgte modeller",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.0 and headset jack; Ethernet through a mini connector on selected models",
      },
      weight: { da: "Fra 1,28 kg", en: "From 1.28 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_10,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t14s-gen-3",
    name: "Lenovo ThinkPad T14s Gen 3",
    format: { da: '14" let bærbar', en: '14" thin and light' },
    tagline: {
      da: "16:10-skærm og godt 1,2 kg – Intel 12. gen eller Ryzen PRO 6000.",
      en: "A 16:10 screen at just over 1.2 kg — Intel 12th gen or Ryzen PRO 6000.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14s Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T14s Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad T14s Gen 3: slank 14\" med 16:10-skærm og Intel eller Ryzen PRO. Let at bære, men RAM'en er loddet, intet netstik. Skriftligt tilbud.",
      en: 'Refurbished ThinkPad T14s Gen 3: a slim 14" with a 16:10 screen and Intel or Ryzen PRO. It is light to lift, but its RAM is soldered, with no Ethernet.',
    },
    intro: {
      da: "T14s Gen 3 skiftede til en 14\" 16:10-skærm og vejer fra 1,21 kg. Intel-udgaven har Core 12. generation og to Thunderbolt 4-porte; AMD-udgaven har Ryzen PRO 6000 med Radeon 680M i topmodellen. Batteriet er 57 Wh på begge, og RAM'en er loddet fast.",
      en: 'The T14s Gen 3 moved to a 14" 16:10 screen and weighs from 1.21 kg. The Intel version has 12th-generation Core and two Thunderbolt 4 ports; the AMD version has Ryzen PRO 6000 with Radeon 680M in the top model. The battery is 57 Wh on both, and RAM is soldered.',
    },
    goodFor: [
      {
        da: "Konsulenter og sælgere, der arbejder fra flere adresser",
        en: "Consultants and sales staff working from several addresses",
      },
      {
        da: "Kontorer, hvor maskinen står i en USB-C- eller Thunderbolt-dock",
        en: "Offices where the machine sits in a USB-C or Thunderbolt dock",
      },
    ],
    notes: [
      {
        da: "Der er ingen netværksport i kabinettet. Kablet netværk kræver en adapter eller en dock.",
        en: "There is no Ethernet port in the chassis. Wired networking needs an adapter or a dock.",
      },
      {
        da: "8, 16 eller 32 GB er loddet fast. Med 8 GB er der intet at opgradere senere.",
        en: "8, 16 or 32 GB is soldered. With 8 GB there is nothing to upgrade later.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T14s Gen 3 (Intel og AMD) – 14" let erhvervsbærbar',
        en: 'Lenovo ThinkPad T14s Gen 3 (Intel and AMD) — 14" thin-and-light business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation) eller AMD Ryzen 5/7 PRO 6000 – U- og P-serie på Intel",
        en: "Intel Core i5/i7 (12th generation) or AMD Ryzen 5/7 PRO 6000 — U and P series on Intel",
      },
      memory: {
        da: "8–32 GB LPDDR5 – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR5 — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller AMD Radeon 660M/680M",
        en: "Intel Iris Xe or AMD Radeon 660M/680M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K IPS eller 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K IPS or 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller USB4 + USB-C 3.2 (AMD), HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or USB4 + USB-C 3.2 (AMD), HDMI 2.1 and headset jack",
      },
      weight: {
        da: "Fra 1,21 kg (Intel) og 1,23 kg (AMD)",
        en: "From 1.21 kg (Intel) and 1.23 kg (AMD)",
      },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t14s-gen-4",
    name: "Lenovo ThinkPad T14s Gen 4",
    format: { da: '14" let bærbar', en: '14" thin and light' },
    tagline: {
      da: "Mindst 16 GB fra fabrikken – Intel 13. gen eller Ryzen PRO 7040.",
      en: "At least 16 GB from the factory — Intel 13th gen or Ryzen PRO 7040.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14s Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T14s Gen 4: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad T14s Gen 4: slank 14" med mindst 16 GB RAM, loddet fast, og Intel eller Ryzen PRO. Intet netstik, så husk en adapter. Få et tilbud.',
      en: 'Refurbished ThinkPad T14s Gen 4: slim 14" with at least 16 GB of RAM that is soldered in, and Intel or Ryzen PRO. It has no Ethernet port. Ask us.',
    },
    intro: {
      da: 'T14s Gen 4 kom kun med 16 eller 32 GB loddet RAM, så der findes ingen 8 GB-udgave at falde over. Intel-udgaven har Core 13. generation og to Thunderbolt 4-porte; AMD-udgaven har Ryzen PRO 7040 og to USB4-porte. Skærmen er 14" 16:10, også som 2,8K OLED.',
      en: 'The T14s Gen 4 only came with 16 or 32 GB of soldered RAM, so there is no 8 GB version to stumble on. The Intel version has 13th-generation Core and two Thunderbolt 4 ports; the AMD version has Ryzen PRO 7040 and two USB4 ports. The screen is 14" 16:10, also as 2.8K OLED.',
    },
    goodFor: [
      {
        da: "Ledelse og rådgivere, der vil have lav vægt og nok RAM fra start",
        en: "Management and advisers who want low weight and enough RAM from the start",
      },
      {
        da: "Videomøder hele dagen på batteri",
        en: "Video meetings all day on battery",
      },
    ],
    notes: [
      {
        da: "RAM'en er loddet fast og kan ikke udvides. 16 GB er bunden, 32 GB er loftet.",
        en: "RAM is soldered and cannot be expanded. 16 GB is the floor, 32 GB the ceiling.",
      },
      {
        da: "Ingen netværksport. Kablet netværk kræver en USB-C-adapter eller en dock.",
        en: "No Ethernet port. Wired networking needs a USB-C adapter or a dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T14s Gen 4 (Intel og AMD) – 14" let erhvervsbærbar',
        en: 'Lenovo ThinkPad T14s Gen 4 (Intel and AMD) — 14" thin-and-light business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation) eller AMD Ryzen 5/7 PRO 7040 – U- og P-serie på Intel",
        en: "Intel Core i5/i7 (13th generation) or AMD Ryzen 5/7 PRO 7040 — U and P series on Intel",
      },
      memory: {
        da: "16 eller 32 GB LPDDR5x – loddet fast, kan ikke udvides",
        en: "16 or 32 GB LPDDR5x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller AMD Radeon 740M/780M",
        en: "Intel Iris Xe or AMD Radeon 740M/780M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K IPS eller 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K IPS or 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB4 (AMD), HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB4 (AMD), HDMI 2.1 and headset jack",
      },
      weight: {
        da: "Fra 1,25 kg (Intel) og 1,26 kg (AMD)",
        en: "From 1.25 kg (Intel) and 1.26 kg (AMD)",
      },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t14s-gen-5",
    name: "Lenovo ThinkPad T14s Gen 5",
    format: { da: '14" let bærbar', en: '14" thin and light' },
    tagline: {
      da: "Core Ultra, op til 64 GB og 58 Wh – og USB-A er tilbage.",
      en: "Core Ultra, up to 64 GB and 58 Wh — with USB-A still on board.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14s Gen 5: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T14s Gen 5: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad T14s Gen 5: Core Ultra, op til 64 GB RAM loddet fast og et lidt større batteri i et slankt kabinet. Den fås kun med Intel, uden netstik.",
      en: "Refurbished ThinkPad T14s Gen 5: Core Ultra, up to 64 GB of soldered RAM and a little bigger battery in a slim chassis. It is Intel only, no Ethernet.",
    },
    intro: {
      da: "T14s Gen 5 har Intel Core Ultra (Serie 1) og 16, 32 eller 64 GB loddet LPDDR5X. Batteriet er vokset til 58 Wh, og vægten starter ved 1,24 kg. PSREF lister kun en Intel-udgave af Gen 5.",
      en: "The T14s Gen 5 has Intel Core Ultra (Series 1) and 16, 32 or 64 GB of soldered LPDDR5X. The battery grew to 58 Wh, and weight starts at 1.24 kg. PSREF lists only an Intel version of Gen 5.",
    },
    goodFor: [
      {
        da: "Medarbejdere, der rejser og vil have den nyeste T14s-platform",
        en: "Staff who travel and want the newest T14s platform",
      },
      {
        da: "Tunge browser- og Office-dage, hvor 32 eller 64 GB giver luft",
        en: "Heavy browser and Office days, where 32 or 64 GB gives headroom",
      },
    ],
    notes: [
      {
        da: "RAM'en er loddet fast. Valget mellem 16, 32 og 64 GB træffes ved køb og kan ikke ændres.",
        en: "RAM is soldered. The choice between 16, 32 and 64 GB is made when buying and cannot be changed.",
      },
      {
        da: "Ingen netværksport og kun Intel. Har I AMD-maskiner og docks til dem, så tjek kompatibiliteten først.",
        en: "No Ethernet port, and Intel only. If you have AMD machines and docks for them, check compatibility first.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T14s Gen 5 (Intel) – 14" let erhvervsbærbar',
        en: 'Lenovo ThinkPad T14s Gen 5 (Intel) — 14" thin-and-light business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) – U- og H-serie",
        en: "Intel Core Ultra 5/7 (Series 1) — U and H series",
      },
      memory: {
        da: "16, 32 eller 64 GB LPDDR5X – loddet fast, kan ikke udvides",
        en: "16, 32 or 64 GB LPDDR5X — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc (integreret)",
        en: "Intel Graphics or Intel Arc (integrated)",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,24 kg", en: "From 1.24 kg" },
      battery: { da: "58 Wh, indbygget", en: "58 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t16-gen-1",
    name: "Lenovo ThinkPad T16 Gen 1",
    format: { da: '16" bærbar', en: '16" laptop' },
    tagline: {
      da: 'Stor 16"-skærm og numerisk tastatur i en T-serie.',
      en: 'A large 16" screen and a numeric keypad in a T series.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T16 Gen 1: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T16 Gen 1: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad T16 Gen 1: stor 16"-skærm, taltastatur og netstik med Intel eller Ryzen PRO. Vælg det store batteri til lange dage. Skriftligt tilbud.',
      en: 'Refurbished ThinkPad T16 Gen 1: a big 16" screen, a keypad and Ethernet, with Intel or Ryzen PRO. Pick the larger battery if it is to last all day.',
    },
    intro: {
      da: 'T16 er T14 med en 16" 16:10-skærm og et numerisk tastatur. Gen 1 har Intel Core 12. generation eller AMD Ryzen PRO 6000, netværksstik, HDMI og et batteri på enten 52,5 eller 86 Wh. Den vejer fra 1,74 kg.',
      en: 'The T16 is a T14 with a 16" 16:10 screen and a numeric keypad. Gen 1 has 12th-generation Intel Core or AMD Ryzen PRO 6000, Ethernet, HDMI and a battery of either 52.5 or 86 Wh. It weighs from 1.74 kg.',
    },
    goodFor: [
      {
        da: "Bogholderi og økonomi, hvor taltastaturet bruges hele dagen",
        en: "Bookkeeping and finance, where the keypad is used all day",
      },
      {
        da: "Medarbejdere, der arbejder uden ekstern skærm",
        en: "Staff who work without an external monitor",
      },
    ],
    notes: [
      {
        da: "Batteriet findes i to størrelser. Spørg efter 86 Wh-udgaven, hvis maskinen skal klare en hel dag væk fra stikkontakten.",
        en: "The battery comes in two sizes. Ask for the 86 Wh version if the machine has to last a full day away from a socket.",
      },
      {
        da: "Som på T14 Gen 3 er AMD-udgavens RAM loddet fast, mens Intel har én fri sokkel.",
        en: "As on the T14 Gen 3, the AMD version's RAM is soldered while Intel has one free slot.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T16 Gen 1 (Intel og AMD) – 16" erhvervsbærbar',
        en: 'Lenovo ThinkPad T16 Gen 1 (Intel and AMD) — 16" business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation) eller AMD Ryzen 5/7 PRO 6000 – U- og P-serie på Intel",
        en: "Intel Core i5/i7 (12th generation) or AMD Ryzen 5/7 PRO 6000 — U and P series on Intel",
      },
      memory: {
        da: "Op til 48 GB DDR4 (Intel) eller 8–32 GB LPDDR5 (AMD) – Intel har 8 eller 16 GB loddet plus én SO-DIMM-sokkel; AMD er loddet fast",
        en: "Up to 48 GB DDR4 (Intel) or 8–32 GB LPDDR5 (AMD) — Intel has 8 or 16 GB soldered plus one SO-DIMM slot; AMD is soldered",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA GeForce MX550 (2 GB); AMD Radeon 660M/680M",
        en: "Intel Iris Xe or NVIDIA GeForce MX550 (2 GB); AMD Radeon 660M/680M",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQXGA (2560×1600) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQXGA (2560×1600) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: {
        da: "Fra 1,74 kg (AMD) og 1,77 kg (Intel)",
        en: "From 1.74 kg (AMD) and 1.77 kg (Intel)",
      },
      battery: { da: "52,5 eller 86 Wh, indbygget", en: "52.5 or 86 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t16-gen-2",
    name: "Lenovo ThinkPad T16 Gen 2",
    format: { da: '16" bærbar', en: '16" laptop' },
    tagline: {
      da: '16" med taltastatur – nu også med 4K OLED og Ryzen PRO 7040.',
      en: '16" with a keypad — now also with 4K OLED and Ryzen PRO 7040.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T16 Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T16 Gen 2: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad T16 Gen 2: 16" med taltastatur, netstik, Intel eller Ryzen PRO og OLED som tilvalg. Spørg til, hvilken slags RAM den har. Få tilbud.',
      en: 'Refurbished ThinkPad T16 Gen 2: a 16" with a keypad, Ethernet, Intel or Ryzen, with OLED as an option. Ask which RAM it is fitted with. Write to us.',
    },
    intro: {
      da: 'T16 Gen 2 har Intel Core 13. generation eller AMD Ryzen PRO 7040 og en 16"-skærm, som ud over WUXGA også fås som WQUXGA OLED (3840×2400). Den er lidt lettere end Gen 1 og vejer fra 1,68 kg. Netværksstik, HDMI og numerisk tastatur er der stadig.',
      en: 'The T16 Gen 2 has 13th-generation Intel Core or AMD Ryzen PRO 7040 and a 16" screen that, besides WUXGA, also comes as WQUXGA OLED (3840×2400). It is a little lighter than Gen 1, from 1.68 kg. Ethernet, HDMI and the numeric keypad are still there.',
    },
    goodFor: [
      {
        da: "Økonomi og administration med mange tal",
        en: "Finance and administration with a lot of figures",
      },
      {
        da: "Medarbejdere, der vil have stor skærm på farten",
        en: "Staff who want a big screen on the move",
      },
    ],
    notes: [
      {
        da: "Intel-udgaven findes med DDR4 og én sokkel, DDR5 og én sokkel eller helt loddet LPDDR5x; AMD er altid loddet (8–64 GB). Få RAM-typen bekræftet.",
        en: "The Intel version comes with DDR4 and one slot, DDR5 and one slot, or fully soldered LPDDR5x; AMD is always soldered (8–64 GB). Get the RAM type confirmed.",
      },
      {
        da: "AMD-udgaven har én USB4- og én USB-C 3.2-port, ikke to Thunderbolt 4.",
        en: "The AMD version has one USB4 and one USB-C 3.2 port, not two Thunderbolt 4.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T16 Gen 2 (Intel og AMD) – 16" erhvervsbærbar',
        en: 'Lenovo ThinkPad T16 Gen 2 (Intel and AMD) — 16" business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation) eller AMD Ryzen 5/7 PRO 7040 – U- og P-serie på Intel",
        en: "Intel Core i5/i7 (13th generation) or AMD Ryzen 5/7 PRO 7040 — U and P series on Intel",
      },
      memory: {
        da: "8–40 GB (Intel) eller 8–64 GB (AMD) – Intel med én sokkel eller loddet efter variant; AMD er loddet fast",
        en: "8–40 GB (Intel) or 8–64 GB (AMD) — Intel with one slot or soldered depending on variant; AMD is soldered",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA GeForce MX550 (4 GB); AMD Radeon 740M/780M",
        en: "Intel Iris Xe or NVIDIA GeForce MX550 (4 GB); AMD Radeon 740M/780M",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQUXGA OLED (3840×2400) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQUXGA OLED (3840×2400) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: {
        da: "Fra 1,68 kg (Intel) og 1,71 kg (AMD)",
        en: "From 1.68 kg (Intel) and 1.71 kg (AMD)",
      },
      battery: { da: "52,5 eller 86 Wh, indbygget", en: "52.5 or 86 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-t16-gen-3",
    name: "Lenovo ThinkPad T16 Gen 3",
    format: { da: '16" bærbar', en: '16" laptop' },
    tagline: {
      da: '16" Core Ultra med to DDR5-sokler og op til 86 Wh.',
      en: 'A 16" Core Ultra with two DDR5 slots and up to 86 Wh.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T16 Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad T16 Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad T16 Gen 3: Core Ultra og to sokler til RAM, taltastatur og netstik på en stor 16"-skærm. Den fås kun med Intel i denne generation.',
      en: 'Refurbished ThinkPad T16 Gen 3: Core Ultra, two RAM slots, a keypad and Ethernet on a big 16" screen. It is only built with Intel in this generation.',
    },
    intro: {
      da: "T16 Gen 3 har Intel Core Ultra og to DDR5-sokler, så hukommelsen kan udvides til 64 GB. Den har to Thunderbolt 4-porte, netværksstik og numerisk tastatur og vejer fra 1,66 kg. PSREF lister kun en Intel-udgave af Gen 3.",
      en: "The T16 Gen 3 has Intel Core Ultra and two DDR5 slots, so memory can be expanded to 64 GB. It has two Thunderbolt 4 ports, Ethernet and a numeric keypad, and weighs from 1.66 kg. PSREF lists only an Intel version of Gen 3.",
    },
    goodFor: [
      {
        da: "Store skærmbilleder og regneark uden ekstern skærm",
        en: "Large layouts and spreadsheets without an external monitor",
      },
      {
        da: "Virksomheder, der vil kunne opgradere RAM senere",
        en: "Companies that want to upgrade RAM later",
      },
    ],
    notes: [
      {
        da: "Kun Intel. Skal flåden være AMD, så se T16 Gen 2, som også findes med Ryzen PRO 7040.",
        en: "Intel only. If the fleet has to be AMD, look at the T16 Gen 2, which also comes with Ryzen PRO 7040.",
      },
      {
        da: "Med 86 Wh-batteriet stiger vægten. Vælg batteri efter, hvor meget maskinen skal bæres.",
        en: "The 86 Wh battery adds weight. Pick the battery by how much the machine is carried.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad T16 Gen 3 (Intel) – 16" erhvervsbærbar',
        en: 'Lenovo ThinkPad T16 Gen 3 (Intel) — 16" business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) – U- og H-serie",
        en: "Intel Core Ultra 5/7 (Series 1) — U and H series",
      },
      memory: {
        da: "Op til 64 GB DDR5-5600 – to SODIMM-sokler",
        en: "Up to 64 GB DDR5-5600 — two SODIMM slots",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc (integreret)",
        en: "Intel Graphics or Intel Arc (integrated)",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQUXGA OLED (3840×2400) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQUXGA OLED (3840×2400) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,66 kg", en: "From 1.66 kg" },
      battery: { da: "52,5 eller 86 Wh, indbygget", en: "52.5 or 86 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-carbon-gen-9",
    name: "Lenovo ThinkPad X1 Carbon Gen 9",
    format: { da: '14" ultralet', en: '14" ultralight' },
    tagline: {
      da: "Første X1 Carbon med 16:10 og Thunderbolt 4 – 1,13 kg.",
      en: "The first X1 Carbon with 16:10 and Thunderbolt 4 — 1.13 kg.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Carbon Gen 9: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Carbon Gen 9: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Carbon Gen 9: den første X1 Carbon med 16:10-skærm, på lidt over et kilo. RAM er loddet fast, så vælg nok, når I bestiller den.",
      en: "Refurbished ThinkPad X1 Carbon Gen 9: the first X1 Carbon with a 16:10 screen, at just over a kilo. Its RAM is soldered, so pick enough at first.",
    },
    intro: {
      da: 'Gen 9 er den X1 Carbon, der skiftede til en 14" 16:10-skærm. Den har Intel Core 11. generation, to Thunderbolt 4-porte og et 57 Wh-batteri og vejer fra 1,13 kg. Hukommelsen er 8, 16 eller 32 GB loddet fast.',
      en: 'Gen 9 is the X1 Carbon that moved to a 14" 16:10 screen. It has 11th-generation Intel Core, two Thunderbolt 4 ports and a 57 Wh battery, and weighs from 1.13 kg. Memory is 8, 16 or 32 GB, soldered.',
    },
    goodFor: [
      {
        da: "Ledelse og sælgere, der vil have en let maskine af en ældre generation",
        en: "Management and sales staff who want a light machine from an older generation",
      },
      {
        da: "Arbejdspladser med Thunderbolt-docks",
        en: "Desks with Thunderbolt docks",
      },
    ],
    notes: [
      {
        da: "RAM'en er loddet fast. En 8 GB-maskine forbliver 8 GB – vælg 16 GB, hvis den skal bruges i flere år.",
        en: "RAM is soldered. An 8 GB machine stays 8 GB — choose 16 GB if it has to be used for several years.",
      },
      {
        da: "Ingen netværksport. Kablet netværk kræver en adapter eller en dock.",
        en: "No Ethernet port. Wired networking needs an adapter or a dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Carbon Gen 9 – 14" ultralet erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Carbon Gen 9 — 14" ultralight business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (11. generation) – strømbesparende serie",
        en: "Intel Core i5/i7 (11th generation) — low-power series",
      },
      memory: {
        da: "8–32 GB LPDDR4x – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR4x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQUXGA (3840×2400) på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; WQUXGA (3840×2400) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.0 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.0 and headset jack",
      },
      weight: { da: "Fra 1,13 kg", en: "From 1.13 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_10,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-carbon-gen-10",
    name: "Lenovo ThinkPad X1 Carbon Gen 10",
    format: { da: '14" ultralet', en: '14" ultralight' },
    tagline: {
      da: "12. generation Intel og fire skærmvalg i 1,12 kg.",
      en: "12th-generation Intel and four screen choices at 1.12 kg.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Carbon Gen 10: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Carbon Gen 10: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Carbon Gen 10: Intel 12. gen på lidt over et kilo og fire skærmvalg op til OLED. RAM er loddet fast, og der er intet netstik i den.",
      en: "Refurbished ThinkPad X1 Carbon Gen 10: Intel 12th gen at just over a kilo, with four screens up to OLED. Its RAM is soldered; it has no Ethernet.",
    },
    intro: {
      da: "X1 Carbon Gen 10 har Intel Core 12. generation i både U- og P-serien og vejer fra 1,12 kg. Skærmen fås i fire udgaver, fra WUXGA over 2,2K og 2,8K OLED til WQUXGA. RAM'en er LPDDR5, loddet fast i 8, 16 eller 32 GB.",
      en: "The X1 Carbon Gen 10 has 12th-generation Intel Core in both U and P series and weighs from 1.12 kg. The screen comes in four versions, from WUXGA through 2.2K and 2.8K OLED to WQUXGA. RAM is LPDDR5, soldered at 8, 16 or 32 GB.",
    },
    goodFor: [
      {
        da: "Medarbejdere, der rejser ugentligt",
        en: "Staff who travel every week",
      },
      {
        da: "Præsentationer og video på OLED-skærmen",
        en: "Presentations and video on the OLED screen",
      },
    ],
    notes: [
      {
        da: "Ifølge Lenovo blev 8 GB-udgaven ikke solgt i EMEA, så danske maskiner har typisk 16 eller 32 GB. RAM'en kan ikke udvides.",
        en: "According to Lenovo, the 8 GB version was not sold in EMEA, so machines from this region usually have 16 or 32 GB. RAM cannot be expanded.",
      },
      {
        da: "Kun USB-C, USB-A og HDMI – ingen netværksport. Bestil en adapter eller dock til kablet netværk.",
        en: "USB-C, USB-A and HDMI only — no Ethernet port. Order an adapter or dock for wired networking.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Carbon Gen 10 – 14" ultralet erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Carbon Gen 10 — 14" ultralight business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation) – U- og P-serie",
        en: "Intel Core i5/i7 (12th generation) — U and P series",
      },
      memory: {
        da: "8–32 GB LPDDR5 – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR5 — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K IPS, 2,8K OLED eller WQUXGA (3840×2400) på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K IPS, 2.8K OLED or WQUXGA (3840×2400) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,12 kg", en: "From 1.12 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-carbon-gen-11",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    format: { da: '14" ultralet', en: '14" ultralight' },
    tagline: {
      da: "Mindst 16 GB og op til 64 GB i en X1 Carbon på 1,12 kg.",
      en: "At least 16 GB and up to 64 GB in a 1.12 kg X1 Carbon.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Carbon Gen 11: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Carbon Gen 11: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Carbon Gen 11: Intel 13. gen og mindst 16 GB RAM på lidt over et kilo. RAM'en er loddet fast, så vælg mængden, når I bestiller.",
      en: "Refurbished ThinkPad X1 Carbon Gen 11: Intel 13th gen and at least 16 GB of RAM at just over a kilo. It is all soldered, so pick the right amount.",
    },
    intro: {
      da: 'X1 Carbon Gen 11 har Intel Core 13. generation og kom kun med 16, 32 eller 64 GB RAM, så der er ingen 8 GB-udgaver. Kabinettet og vægten fra 1,12 kg er som Gen 10. Skærmen er 14" 16:10, også som 2,8K OLED.',
      en: 'The X1 Carbon Gen 11 has 13th-generation Intel Core and only came with 16, 32 or 64 GB of RAM, so there are no 8 GB versions. The chassis and the weight from 1.12 kg match Gen 10. The screen is 14" 16:10, also as 2.8K OLED.',
    },
    goodFor: [
      {
        da: "Medarbejdere med mange programmer åbne på farten",
        en: "Staff with many programs open on the move",
      },
      {
        da: "Rådgivning og salg, hvor maskinen bæres hver dag",
        en: "Advisory and sales work, where the machine is carried every day",
      },
    ],
    notes: [
      {
        da: "RAM'en er loddet fast. Vælg mængden ved køb – en større SSD ændrer ikke på RAM'en.",
        en: "RAM is soldered. Choose the amount when buying — a larger SSD does not change the RAM.",
      },
      {
        da: "Ingen netværksport. Kablet netværk kræver en adapter eller en dock.",
        en: "No Ethernet port. Wired networking needs an adapter or a dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Carbon Gen 11 – 14" ultralet erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Carbon Gen 11 — 14" ultralight business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation) – U- og P-serie",
        en: "Intel Core i5/i7 (13th generation) — U and P series",
      },
      memory: {
        da: "16, 32 eller 64 GB LPDDR5/5x – loddet fast, kan ikke udvides",
        en: "16, 32 or 64 GB LPDDR5/5x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K IPS eller 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K IPS or 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,12 kg", en: "From 1.12 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-carbon-gen-12",
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    format: { da: '14" ultralet', en: '14" ultralight' },
    tagline: {
      da: "Core Ultra på 1,08 kg – den letteste X1 Carbon, vi har beskrevet.",
      en: "Core Ultra at 1.08 kg — the lightest X1 Carbon we describe.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Carbon Gen 12: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Carbon Gen 12: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Carbon Gen 12: Core Ultra i den letteste X1 Carbon, vi har beskrevet. Op til 64 GB RAM, loddet fast, og der er intet netstik i den.",
      en: "Refurbished ThinkPad X1 Carbon Gen 12: Core Ultra in the lightest X1 Carbon we list. Up to 64 GB of RAM, all of it soldered and it has no Ethernet.",
    },
    intro: {
      da: "X1 Carbon Gen 12 har Intel Core Ultra (Serie 1) og vejer fra 1,08 kg. RAM'en er 16, 32 eller 64 GB LPDDR5X loddet fast, og de to USB-C-porte er Thunderbolt 4. Skærmen er 14\" WUXGA eller 2,8K OLED.",
      en: 'The X1 Carbon Gen 12 has Intel Core Ultra (Series 1) and weighs from 1.08 kg. RAM is 16, 32 or 64 GB of soldered LPDDR5X, and the two USB-C ports are Thunderbolt 4. The screen is 14" WUXGA or 2.8K OLED.',
    },
    goodFor: [
      {
        da: "Medarbejdere, hvor hvert gram i tasken tæller",
        en: "Staff for whom every gram in the bag counts",
      },
      {
        da: "Ledelse, der vil have den nyeste X1 Carbon-platform",
        en: "Management who want the newest X1 Carbon platform",
      },
    ],
    notes: [
      {
        da: "Intel Arc-grafik kræver ifølge Lenovo en H-serie-processor; på U-serien hedder grafikken Intel Graphics. Få processoren bekræftet, hvis grafikken betyder noget.",
        en: "Lenovo says Intel Arc graphics need an H-series processor; on the U series the graphics are Intel Graphics. Confirm the processor if graphics matter.",
      },
      {
        da: "RAM'en er loddet fast, og der er ingen netværksport. Vælg hukommelse ved køb, og bestil en adapter eller dock med.",
        en: "RAM is soldered and there is no Ethernet port. Choose memory when buying, and order an adapter or dock too.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Carbon Gen 12 – 14" ultralet erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Carbon Gen 12 — 14" ultralight business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) – U- og H-serie",
        en: "Intel Core Ultra 5/7 (Series 1) — U and H series",
      },
      memory: {
        da: "16, 32 eller 64 GB LPDDR5X – loddet fast, kan ikke udvides",
        en: "16, 32 or 64 GB LPDDR5X — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc (integreret)",
        en: "Intel Graphics or Intel Arc (integrated)",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,08 kg", en: "From 1.08 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-yoga-gen-6",
    name: "Lenovo ThinkPad X1 Yoga Gen 6",
    format: { da: '14" 2-i-1', en: '14" 2-in-1' },
    tagline: {
      da: "X1 med berøringsskærm, der kan foldes helt rundt, og pen i kabinettet.",
      en: "An X1 with a touchscreen that folds all the way round, and a pen in the chassis.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Yoga Gen 6: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Yoga Gen 6: pros and cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad X1 Yoga Gen 6: 14" skærm, der kan foldes til en tablet, med pen i kabinettet og Intel 11. gen. RAM er loddet, og der er intet netstik.',
      en: 'Refurbished ThinkPad X1 Yoga Gen 6: a 14" touchscreen that folds into a tablet, with a pen in its side. Its RAM is soldered and it has no Ethernet.',
    },
    intro: {
      da: 'X1 Yoga er X1-serien som 2-i-1: skærmen drejer 360 grader, så maskinen kan bruges som tablet, og pennen har sin egen holder i kabinettet. Gen 6 har Intel Core 11. generation, en 14" 16:10-berøringsskærm og 57 Wh-batteri. Den vejer fra 1,40 kg.',
      en: 'The X1 Yoga is the X1 line as a 2-in-1: the screen turns 360 degrees so the machine works as a tablet, and the pen has its own slot in the chassis. Gen 6 has 11th-generation Intel Core, a 14" 16:10 touchscreen and a 57 Wh battery. It weighs from 1.40 kg.',
    },
    goodFor: [
      {
        da: "Håndnoter og underskrifter direkte på skærmen",
        en: "Handwritten notes and signatures straight on the screen",
      },
      {
        da: "Kundemøder, hvor skærmen vendes mod kunden",
        en: "Client meetings where the screen is turned towards the client",
      },
    ],
    notes: [
      {
        da: "Den vejer fra 1,40 kg mod 1,13 kg for X1 Carbon Gen 9. Skal den bæres meget, er forskellen mærkbar.",
        en: "It weighs from 1.40 kg against 1.13 kg for the X1 Carbon Gen 9. If it is carried a lot, the difference shows.",
      },
      {
        da: "RAM'en er loddet fast (8–32 GB), og der er ingen netværksport. Tjek, at pennen følger med den konkrete maskine.",
        en: "RAM is soldered (8–32 GB), and there is no Ethernet port. Check that the pen comes with the actual unit.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Yoga Gen 6 – 14" 2-i-1-erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Yoga Gen 6 — 14" 2-in-1 business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (11. generation) – strømbesparende serie",
        en: "Intel Core i5/i7 (11th generation) — low-power series",
      },
      memory: {
        da: "8–32 GB LPDDR4x – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR4x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '14" 16:10 berøringsskærm, WUXGA (1920×1200) eller WQUXGA (3840×2400), med pen',
        en: '14" 16:10 touchscreen, WUXGA (1920×1200) or WQUXGA (3840×2400), with pen',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.0 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.0 and headset jack",
      },
      weight: { da: "Fra 1,40 kg", en: "From 1.40 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_10,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-yoga-gen-7",
    name: "Lenovo ThinkPad X1 Yoga Gen 7",
    format: { da: '14" 2-i-1', en: '14" 2-in-1' },
    tagline: {
      da: "2-i-1 med 12. generation Intel og WQUXGA OLED som mulighed.",
      en: "A 2-in-1 with 12th-generation Intel and WQUXGA OLED as an option.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Yoga Gen 7: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Yoga Gen 7: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Yoga Gen 7: 2-i-1 med pen i siden, Intel 12. gen og OLED som tilvalg. RAM er loddet fast, så vælg nok fra start af. Få et tilbud.",
      en: "Refurbished ThinkPad X1 Yoga Gen 7: a 2-in-1 with a pen in its side, Intel 12th gen and OLED as an option. Its RAM is soldered. Ask us for a quote.",
    },
    intro: {
      da: 'X1 Yoga Gen 7 har Intel Core 12. generation, LPDDR5-hukommelse og en 14" berøringsskærm, der også fås som WQUXGA OLED (3840×2400). Skærmen drejer 360 grader, og pennen sidder i kabinettet. Vægten starter ved 1,38 kg.',
      en: 'The X1 Yoga Gen 7 has 12th-generation Intel Core, LPDDR5 memory and a 14" touchscreen that also comes as WQUXGA OLED (3840×2400). The screen turns 360 degrees, and the pen sits in the chassis. Weight starts at 1.38 kg.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der skifter mellem tastatur og pen i løbet af dagen",
        en: "Staff who switch between keyboard and pen during the day",
      },
      {
        da: "Gennemsyn af tegninger og PDF'er i tabletform",
        en: "Reviewing drawings and PDFs in tablet form",
      },
    ],
    notes: [
      {
        da: "Lenovo solgte ikke 8 GB-udgaven i EMEA. RAM'en er loddet fast, så det er 16 eller 32 GB, der er at vælge imellem.",
        en: "Lenovo did not sell the 8 GB version in EMEA. RAM is soldered, so 16 or 32 GB is the choice.",
      },
      {
        da: "Ingen netværksport. Kablet netværk kræver en adapter eller en dock.",
        en: "No Ethernet port. Wired networking needs an adapter or a dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Yoga Gen 7 – 14" 2-i-1-erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Yoga Gen 7 — 14" 2-in-1 business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation) – U- og P-serie",
        en: "Intel Core i5/i7 (12th generation) — U and P series",
      },
      memory: {
        da: "8–32 GB LPDDR5 – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR5 — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '14" 16:10 berøringsskærm, WUXGA (1920×1200) IPS eller WQUXGA OLED (3840×2400), med pen',
        en: '14" 16:10 touchscreen, WUXGA (1920×1200) IPS or WQUXGA OLED (3840×2400), with pen',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,38 kg", en: "From 1.38 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-yoga-gen-8",
    name: "Lenovo ThinkPad X1 Yoga Gen 8",
    format: { da: '14" 2-i-1', en: '14" 2-in-1' },
    tagline: {
      da: "X1 Yoga med 13. generation Intel og mindst 16 GB.",
      en: "An X1 Yoga with 13th-generation Intel and at least 16 GB.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Yoga Gen 8: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Yoga Gen 8: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Yoga Gen 8: en 2-i-1 med pen, Intel 13. gen og mindst 16 GB RAM, loddet fast. Der er intet netstik, så planlæg en dock til den.",
      en: "Refurbished ThinkPad X1 Yoga Gen 8: a 2-in-1 with a pen, Intel 13th gen and at least 16 GB of soldered RAM. It has no Ethernet port. Get a quote.",
    },
    intro: {
      da: 'X1 Yoga Gen 8 har Intel Core 13. generation og kom med 16, 32 eller 64 GB loddet RAM. Kabinet, pen i holderen og 14" berøringsskærm er som Gen 7, og vægten starter også ved 1,38 kg.',
      en: 'The X1 Yoga Gen 8 has 13th-generation Intel Core and came with 16, 32 or 64 GB of soldered RAM. The chassis, the garaged pen and the 14" touchscreen match Gen 7, and weight also starts at 1.38 kg.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have 2-i-1 med nok RAM fra start",
        en: "Staff who want a 2-in-1 with enough RAM from the start",
      },
      {
        da: "Mødetunge dage med noter på skærmen",
        en: "Meeting-heavy days with notes on the screen",
      },
    ],
    notes: [
      {
        da: "RAM'en er loddet fast i 16, 32 eller 64 GB og kan ikke ændres.",
        en: "RAM is soldered at 16, 32 or 64 GB and cannot be changed.",
      },
      {
        da: "Ingen netværksport, og HDMI er den eneste skærmudgang ud over USB-C. Planlæg dock til faste arbejdspladser.",
        en: "No Ethernet port, and HDMI is the only display output besides USB-C. Plan a dock for fixed desks.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Yoga Gen 8 – 14" 2-i-1-erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Yoga Gen 8 — 14" 2-in-1 business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation) – U- og P-serie",
        en: "Intel Core i5/i7 (13th generation) — U and P series",
      },
      memory: {
        da: "16, 32 eller 64 GB LPDDR5/5x – loddet fast, kan ikke udvides",
        en: "16, 32 or 64 GB LPDDR5/5x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '14" 16:10 berøringsskærm, WUXGA (1920×1200) IPS eller WQUXGA OLED (3840×2400), med pen',
        en: '14" 16:10 touchscreen, WUXGA (1920×1200) IPS or WQUXGA OLED (3840×2400), with pen',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,38 kg", en: "From 1.38 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-2-in-1-gen-9",
    name: "Lenovo ThinkPad X1 2-in-1 Gen 9",
    format: { da: '14" 2-i-1', en: '14" 2-in-1' },
    tagline: {
      da: "X1 som 2-i-1 med Core Ultra og en pen, der hæfter magnetisk.",
      en: "The X1 as a 2-in-1 with Core Ultra and a pen that attaches magnetically.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 2-in-1 Gen 9: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 2-in-1 Gen 9: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 2-in-1 Gen 9: Core Ultra, en skærm op til OLED og en pen, der sidder fast med magnet. RAM'en er loddet og der er intet netstik.",
      en: "Refurbished ThinkPad X1 2-in-1 Gen 9: Core Ultra, a screen up to OLED and a pen that clips on. Its RAM is soldered, and there is no Ethernet port.",
    },
    intro: {
      da: 'X1 2-in-1 Gen 9 er X1-seriens 2-i-1 med Core Ultra. Den har Intel Core Ultra i U-serien, 16, 32 eller 64 GB loddet LPDDR5X og en 14" berøringsskærm i WUXGA eller 2,8K OLED. Pennen sidder ikke længere i kabinettet; Lenovos Slim Pen hæfter magnetisk på siden.',
      en: "The X1 2-in-1 Gen 9 is the X1 line's 2-in-1 with Core Ultra. It has U-series Intel Core Ultra, 16, 32 or 64 GB of soldered LPDDR5X and a 14\" touchscreen in WUXGA or 2.8K OLED. The pen no longer sits in the chassis; Lenovo's Slim Pen attaches magnetically to the side.",
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have den nyeste X1 som 2-i-1",
        en: "Staff who want the newest X1 as a 2-in-1",
      },
      {
        da: "Skitser og noter i møder",
        en: "Sketches and notes in meetings",
      },
    ],
    notes: [
      {
        da: "Kun U-seriens Core Ultra, så grafikken er Intel Graphics – ikke Arc. Den er til kontorbrug, ikke grafiktungt arbejde.",
        en: "U-series Core Ultra only, so the graphics are Intel Graphics — not Arc. It is for office use, not graphics-heavy work.",
      },
      {
        da: "Pennen er tilbehør, der kan mangle på en brugt maskine. Aftal, om den skal med.",
        en: "The pen is an accessory that may be missing from a used machine. Agree whether it should be included.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 2-in-1 Gen 9 – 14" 2-i-1-erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 2-in-1 Gen 9 — 14" 2-in-1 business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) – U-serie",
        en: "Intel Core Ultra 5/7 (Series 1) — U series",
      },
      memory: {
        da: "16, 32 eller 64 GB LPDDR5X – loddet fast, kan ikke udvides",
        en: "16, 32 or 64 GB LPDDR5X — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Graphics (integreret)", en: "Intel Graphics (integrated)" },
      display: {
        da: '14" 16:10 berøringsskærm, WUXGA (1920×1200) IPS eller 2,8K OLED, pen som tilbehør',
        en: '14" 16:10 touchscreen, WUXGA (1920×1200) IPS or 2.8K OLED, pen as an accessory',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,35 kg", en: "From 1.35 kg" },
      battery: { da: "57 Wh, indbygget", en: "57 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-nano-gen-1",
    name: "Lenovo ThinkPad X1 Nano Gen 1",
    format: { da: '13" ultralet', en: '13" ultralight' },
    tagline: {
      da: "Under et kilo – 907 gram, og kun to USB-C-porte.",
      en: "Under a kilo — 907 grams, and only two USB-C ports.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Nano Gen 1: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Nano Gen 1: pros and cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad X1 Nano Gen 1: under et kilo, med 13" 2K-skærm. Blot to USB-C-stik og RAM loddet, regn med en dock til den. Få et skriftligt tilbud.',
      en: 'Refurbished ThinkPad X1 Nano Gen 1: under a kilo, with a 13" 2K screen. It has just two USB-C ports and its RAM is soldered, so it will need a hub.',
    },
    intro: {
      da: 'X1 Nano er ThinkPad skåret ned til under et kilo: Gen 1 vejer fra 907 gram. Den har en 13" 2K-skærm (2160×1350), Intel Core 11. generation og 8 eller 16 GB loddet RAM. Portene er to Thunderbolt 4 og et lydstik – intet andet.',
      en: 'The X1 Nano is a ThinkPad cut down to under a kilo: Gen 1 weighs from 907 grams. It has a 13" 2K screen (2160×1350), 11th-generation Intel Core and 8 or 16 GB of soldered RAM. The ports are two Thunderbolt 4 and a headset jack — nothing else.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der flyver ofte og bærer maskinen hele dagen",
        en: "Staff who fly often and carry the machine all day",
      },
      {
        da: "Arbejdspladser, hvor alt alligevel går gennem én USB-C-dock",
        en: "Desks where everything goes through one USB-C dock anyway",
      },
    ],
    notes: [
      {
        da: "Ingen USB-A, ingen HDMI og intet netværksstik. Regn med en USB-C-hub eller dock til hver bruger.",
        en: "No USB-A, no HDMI and no Ethernet. Plan a USB-C hub or dock for every user.",
      },
      {
        da: "SSD'en er en kort M.2 2242 på PCIe 3.0, op til 1 TB. En almindelig 2280-disk passer ikke i soklen.",
        en: "The SSD is a short M.2 2242 on PCIe 3.0, up to 1 TB. A standard 2280 drive does not fit the slot.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Nano Gen 1 – 13" ultralet erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Nano Gen 1 — 13" ultralight business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (11. generation) – strømbesparende serie",
        en: "Intel Core i5/i7 (11th generation) — low-power series",
      },
      memory: {
        da: "8 eller 16 GB LPDDR4x – loddet fast, kan ikke udvides",
        en: "8 or 16 GB LPDDR4x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2242 NVMe SSD (PCIe 3.0) op til 1 TB – kan udskiftes",
        en: "One M.2 2242 NVMe SSD (PCIe 3.0) up to 1 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '13" 16:10 2K (2160×1350) IPS, også med berøring',
        en: '13" 16:10 2K (2160×1350) IPS, also with touch',
      },
      ports: {
        da: "2× Thunderbolt 4 og kombineret lydstik",
        en: "2× Thunderbolt 4 and headset jack",
      },
      weight: { da: "Fra 907 g", en: "From 907 g" },
      battery: { da: "48 Wh, indbygget", en: "48 Wh, built in" },
      os: OS_10,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-nano-gen-2",
    name: "Lenovo ThinkPad X1 Nano Gen 2",
    format: { da: '13" ultralet', en: '13" ultralight' },
    tagline: {
      da: "Under et kilo med 12. generation Intel og mindst 16 GB.",
      en: "Under a kilo with 12th-generation Intel and at least 16 GB.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Nano Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Nano Gen 2: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Nano Gen 2: under et kilo, med Intel 12. gen og mindst 16 GB RAM, loddet. Blot to USB-C-stik, regn med en hub. Skriftligt tilbud.",
      en: "Refurbished ThinkPad X1 Nano Gen 2: under a kilo, with Intel 12th gen and at least 16 GB of RAM that is soldered. It has just the two USB-C ports.",
    },
    intro: {
      da: 'X1 Nano Gen 2 har Intel Core 12. generation og 16 eller 32 GB loddet LPDDR5, så 8 GB-udgaven fra Gen 1 er væk. Batteriet er 49,5 Wh, og vægten starter ved 966,5 gram. Skærm og porte er som Gen 1: 13" 2K og to Thunderbolt 4.',
      en: "The X1 Nano Gen 2 has 12th-generation Intel Core and 16 or 32 GB of soldered LPDDR5, so Gen 1's 8 GB version is gone. The battery is 49.5 Wh, and weight starts at 966.5 grams. Screen and ports match Gen 1: 13\" 2K and two Thunderbolt 4.",
    },
    goodFor: [
      {
        da: "Rejsende medarbejdere, der vil have mere RAM end Gen 1",
        en: "Travelling staff who want more RAM than Gen 1",
      },
      {
        da: "Ledelse med maskinen i tasken hver dag",
        en: "Management with the machine in the bag every day",
      },
    ],
    notes: [
      {
        da: "Kun to USB-C-porte. Uden hub eller dock kan maskinen ikke tage en USB-A-mus og en HDMI-skærm på samme tid.",
        en: "Only two USB-C ports. Without a hub or dock it cannot take a USB-A mouse and an HDMI monitor at the same time.",
      },
      {
        da: "32 GB fandtes ifølge Lenovo kun med Core i7-1280P. RAM'en kan ikke udvides.",
        en: "According to Lenovo, 32 GB came only with the Core i7-1280P. RAM cannot be expanded.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Nano Gen 2 – 13" ultralet erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Nano Gen 2 — 13" ultralight business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation)",
        en: "Intel Core i5/i7 (12th generation)",
      },
      memory: {
        da: "16 eller 32 GB LPDDR5 – loddet fast, kan ikke udvides",
        en: "16 or 32 GB LPDDR5 — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2242 NVMe SSD (PCIe 4.0) op til 1 TB – kan udskiftes",
        en: "One M.2 2242 NVMe SSD (PCIe 4.0) up to 1 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '13" 16:10 2K (2160×1350) IPS, også med berøring',
        en: '13" 16:10 2K (2160×1350) IPS, also with touch',
      },
      ports: {
        da: "2× Thunderbolt 4 og kombineret lydstik",
        en: "2× Thunderbolt 4 and headset jack",
      },
      weight: { da: "Fra 966,5 g", en: "From 966.5 g" },
      battery: { da: "49,5 Wh, indbygget", en: "49.5 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x1-nano-gen-3",
    name: "Lenovo ThinkPad X1 Nano Gen 3",
    format: { da: '13" ultralet', en: '13" ultralight' },
    tagline: {
      da: "X1 Nano med 13. generation P-serie og fast 16 GB.",
      en: "An X1 Nano with 13th-generation P series and a fixed 16 GB.",
    },
    metaTitle: {
      da: "Brugt Lenovo X1 Nano Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X1 Nano Gen 3: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X1 Nano Gen 3: under et kilo, med Intel 13. gen og fast 16 GB RAM, loddet. Blot to USB-C-stik, regn med en hub til den. Skriv til os.",
      en: "Refurbished ThinkPad X1 Nano Gen 3: under a kilo, with Intel 13th gen and a fixed 16 GB of soldered RAM. It has just two USB-C ports. Write to us.",
    },
    intro: {
      da: 'X1 Nano Gen 3 har Intel Core 13. generation i P-serien og kom kun med 16 GB LPDDR5x loddet fast. Vægten starter ved 966,5 gram, og skærmen er den samme 13" 2K som Gen 1 og 2. Portene er stadig to Thunderbolt 4 og et lydstik.',
      en: 'The X1 Nano Gen 3 has 13th-generation P-series Intel Core and only came with 16 GB of soldered LPDDR5x. Weight starts at 966.5 grams, and the screen is the same 13" 2K as Gen 1 and 2. The ports are still two Thunderbolt 4 and a headset jack.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have den lettest mulige ThinkPad af nyere dato",
        en: "Staff who want the lightest possible recent ThinkPad",
      },
      {
        da: "Kontor- og mødearbejde, hvor 16 GB er nok",
        en: "Office and meeting work where 16 GB is enough",
      },
    ],
    notes: [
      {
        da: "16 GB er den eneste RAM-mulighed, og den kan ikke udvides. Kører I programmer, der bruger meget hukommelse, så vælg en anden model.",
        en: "16 GB is the only memory option, and it cannot be expanded. If you run memory-hungry software, choose another model.",
      },
      {
        da: "Ingen USB-A, HDMI eller netværk. Budgettér en USB-C-dock eller hub pr. bruger.",
        en: "No USB-A, HDMI or Ethernet. Budget a USB-C dock or hub per user.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X1 Nano Gen 3 – 13" ultralet erhvervsbærbar',
        en: 'Lenovo ThinkPad X1 Nano Gen 3 — 13" ultralight business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation) – P-serie",
        en: "Intel Core i5/i7 (13th generation) — P series",
      },
      memory: {
        da: "16 GB LPDDR5x – loddet fast, kan ikke udvides",
        en: "16 GB LPDDR5x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2242 NVMe SSD (PCIe 4.0) op til 1 TB – kan udskiftes",
        en: "One M.2 2242 NVMe SSD (PCIe 4.0) up to 1 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '13" 16:10 2K (2160×1350) IPS, også med berøring',
        en: '13" 16:10 2K (2160×1350) IPS, also with touch',
      },
      ports: {
        da: "2× Thunderbolt 4 og kombineret lydstik",
        en: "2× Thunderbolt 4 and headset jack",
      },
      weight: { da: "Fra 966,5 g", en: "From 966.5 g" },
      battery: { da: "49,5 Wh, indbygget", en: "49.5 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x13-gen-2",
    name: "Lenovo ThinkPad X13 Gen 2",
    format: { da: '13,3" bærbar', en: '13.3" laptop' },
    tagline: {
      da: 'Lille 13,3" med 16:10-skærm – Intel 11. gen eller Ryzen 5000.',
      en: 'A small 13.3" with a 16:10 screen — Intel 11th gen or Ryzen 5000.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad X13 Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad X13 Gen 2: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad X13 Gen 2: lille 13,3" med 16:10-skærm, USB-A og HDMI og Intel eller Ryzen. RAM er loddet og netstik kræver adapter. Skriv til os.',
      en: 'Refurbished ThinkPad X13 Gen 2: small 13.3" with a 16:10 screen, USB-A and HDMI, Intel or Ryzen. Its RAM is soldered in. Ask for a written quote.',
    },
    intro: {
      da: "X13 er ThinkPads 13,3\"-model til dem, der vil have en lille maskine med almindelige porte. Gen 2 har en 16:10-skærm, Intel Core 11. generation eller AMD Ryzen 5000 og vejer fra 1,19 kg. Den har stadig USB-A og HDMI, men RAM'en er loddet fast.",
      en: 'The X13 is the 13.3" ThinkPad for people who want a small machine with ordinary ports. Gen 2 has a 16:10 screen, 11th-generation Intel Core or AMD Ryzen 5000, and weighs from 1.19 kg. It still has USB-A and HDMI, but RAM is soldered.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have en lille maskine uden at leve med adaptere",
        en: "Staff who want a small machine without living with adapters",
      },
      {
        da: "Små skriveborde og delte arbejdspladser",
        en: "Small desks and shared workplaces",
      },
    ],
    notes: [
      {
        da: "Batteriet findes som 41 eller 54,7 Wh. Spørg efter det store, hvis maskinen bruges væk fra skrivebordet.",
        en: "The battery comes as 41 or 54.7 Wh. Ask for the larger one if the machine is used away from the desk.",
      },
      {
        da: "Netværk kræver Lenovos adapter til mini-stikket, og det stik findes kun på udvalgte modeller.",
        en: "Ethernet needs Lenovo's adapter for the mini connector, and that connector exists only on selected models.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X13 Gen 2 (Intel og AMD) – 13,3" erhvervsbærbar',
        en: 'Lenovo ThinkPad X13 Gen 2 (Intel and AMD) — 13.3" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (11. generation) eller AMD Ryzen 3/5/7 5000 – PRO-varianter på AMD",
        en: "Intel Core i3/i5/i7 (11th generation) or AMD Ryzen 3/5/7 5000 — PRO variants on AMD",
      },
      memory: {
        da: "8–32 GB LPDDR4x – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR4x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 NVMe SSD op til 2 TB – kan udskiftes",
        en: "One M.2 NVMe SSD up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller UHD; AMD Radeon (integreret)",
        en: "Intel Iris Xe or UHD; AMD Radeon (integrated)",
      },
      display: {
        da: '13,3" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQXGA (2560×1600) på udvalgte modeller',
        en: '13.3" 16:10 WUXGA (1920×1200) IPS, also with touch; WQXGA (2560×1600) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.0 og kombineret lydstik; netværk via mini-stik på udvalgte modeller",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.0 and headset jack; Ethernet through a mini connector on selected models",
      },
      weight: { da: "Fra 1,19 kg", en: "From 1.19 kg" },
      battery: { da: "41 eller 54,7 Wh, indbygget", en: "41 or 54.7 Wh, built in" },
      os: OS_10,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x13-gen-3",
    name: "Lenovo ThinkPad X13 Gen 3",
    format: { da: '13,3" bærbar', en: '13.3" laptop' },
    tagline: {
      da: '13,3" med Intel 12. gen eller Ryzen PRO 6000 og HDMI 2.1.',
      en: 'A 13.3" with Intel 12th gen or Ryzen PRO 6000 and HDMI 2.1.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad X13 Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad X13 Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad X13 Gen 3: en lille 13,3" med Intel 12. gen eller Ryzen PRO og de almindelige stik. RAM er loddet fast, og der er intet netstik i den.',
      en: 'Refurbished ThinkPad X13 Gen 3: a small 13.3" with Intel 12th gen or Ryzen PRO and its usual ports. Its RAM is soldered, and there is no Ethernet.',
    },
    intro: {
      da: 'X13 Gen 3 har Intel Core 12. generation eller AMD Ryzen PRO 6000 i et 13,3"-kabinet fra 1,19 kg. Hukommelsen er LPDDR5, loddet fast i 8, 16 eller 32 GB. Mini-netværksstikket fra Gen 2 er væk, men USB-A og HDMI 2.1 er der.',
      en: "The X13 Gen 3 has 12th-generation Intel Core or AMD Ryzen PRO 6000 in a 13.3\" chassis from 1.19 kg. Memory is LPDDR5, soldered at 8, 16 or 32 GB. Gen 2's mini Ethernet connector is gone, but USB-A and HDMI 2.1 remain.",
    },
    goodFor: [
      {
        da: "Pendlere, der vil have en kompakt maskine med nyere processor",
        en: "Commuters who want a compact machine with a newer processor",
      },
      {
        da: "Kontorer med USB-C-docks",
        en: "Offices with USB-C docks",
      },
    ],
    notes: [
      {
        da: "Ifølge Lenovo fandtes 32 GB i EMEA kun på i7-modeller. RAM'en kan ikke udvides.",
        en: "According to Lenovo, 32 GB was available in EMEA only on i7 models. RAM cannot be expanded.",
      },
      {
        da: "Ingen netværksport. Kablet netværk kræver en adapter eller en dock.",
        en: "No Ethernet port. Wired networking needs an adapter or a dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X13 Gen 3 (Intel og AMD) – 13,3" erhvervsbærbar',
        en: 'Lenovo ThinkPad X13 Gen 3 (Intel and AMD) — 13.3" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (12. generation) eller AMD Ryzen 5/7 PRO 6000 – U- og P-serie på Intel",
        en: "Intel Core i3/i5/i7 (12th generation) or AMD Ryzen 5/7 PRO 6000 — U and P series on Intel",
      },
      memory: {
        da: "8–32 GB LPDDR5 – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR5 — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller UHD; AMD Radeon 660M/680M",
        en: "Intel Iris Xe or UHD; AMD Radeon 660M/680M",
      },
      display: {
        da: '13,3" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQXGA (2560×1600) på udvalgte modeller',
        en: '13.3" 16:10 WUXGA (1920×1200) IPS, also with touch; WQXGA (2560×1600) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller USB4 + USB-C 3.2 (AMD), HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or USB4 + USB-C 3.2 (AMD), HDMI 2.1 and headset jack",
      },
      weight: {
        da: "Fra 1,19 kg (AMD) og 1,20 kg (Intel)",
        en: "From 1.19 kg (AMD) and 1.20 kg (Intel)",
      },
      battery: { da: "41 eller 54,7 Wh, indbygget", en: "41 or 54.7 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x13-gen-4",
    name: "Lenovo ThinkPad X13 Gen 4",
    format: { da: '13,3" bærbar', en: '13.3" laptop' },
    tagline: {
      da: "Ned til 1,09 kg – Intel 13. gen eller Ryzen PRO 7040.",
      en: "Down to 1.09 kg — Intel 13th gen or Ryzen PRO 7040.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad X13 Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad X13 Gen 4: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X13 Gen 4: lettere end Gen 3, med Intel eller Ryzen PRO og OLED som tilvalg på Intel. RAM er loddet, intet netstik. Skriftligt tilbud.",
      en: "Refurbished ThinkPad X13 Gen 4: lighter than Gen 3, with Intel or Ryzen PRO and OLED as an option on Intel. Its RAM is soldered. A written quote.",
    },
    intro: {
      da: "X13 Gen 4 er lettere end Gen 3: Intel-udgaven starter ved 1,09 kg. Den har Intel Core 13. generation med Thunderbolt 4 eller AMD Ryzen PRO 7040 med to USB4-porte. På Intel fås også en 2,8K OLED-skærm.",
      en: "The X13 Gen 4 is lighter than Gen 3: the Intel version starts at 1.09 kg. It has 13th-generation Intel Core with Thunderbolt 4 or AMD Ryzen PRO 7040 with two USB4 ports. Intel also offers a 2.8K OLED screen.",
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have X1-vægt i en mindre maskine",
        en: "Staff who want X1 weight in a smaller machine",
      },
      {
        da: "Rejser med håndbagage",
        en: "Travel with hand luggage only",
      },
    ],
    notes: [
      {
        da: "AMD-udgaven kom kun med 16 eller 32 GB; Intel også med 8 GB. RAM'en er loddet fast på begge.",
        en: "The AMD version came only with 16 or 32 GB; Intel also with 8 GB. RAM is soldered on both.",
      },
      {
        da: "Ingen netværksport. Planlæg adapter eller dock til kablet netværk.",
        en: "No Ethernet port. Plan an adapter or dock for wired networking.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X13 Gen 4 (Intel og AMD) – 13,3" erhvervsbærbar',
        en: 'Lenovo ThinkPad X13 Gen 4 (Intel and AMD) — 13.3" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (13. generation) eller AMD Ryzen 5/7 PRO 7040 – U- og P-serie på Intel",
        en: "Intel Core i3/i5/i7 (13th generation) or AMD Ryzen 5/7 PRO 7040 — U and P series on Intel",
      },
      memory: {
        da: "8–32 GB LPDDR5 (Intel) eller 16–32 GB LPDDR5X (AMD) – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR5 (Intel) or 16–32 GB LPDDR5X (AMD) — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller UHD; AMD Radeon 740M/780M",
        en: "Intel Iris Xe or UHD; AMD Radeon 740M/780M",
      },
      display: {
        da: '13,3" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,8K OLED på udvalgte Intel-modeller',
        en: '13.3" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.8K OLED on selected Intel models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB4 (AMD), HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB4 (AMD), HDMI 2.1 and headset jack",
      },
      weight: {
        da: "Fra 1,09 kg (Intel) og 1,14 kg (AMD)",
        en: "From 1.09 kg (Intel) and 1.14 kg (AMD)",
      },
      battery: { da: "41 eller 54,7 Wh, indbygget", en: "41 or 54.7 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x13-gen-5",
    name: "Lenovo ThinkPad X13 Gen 5",
    format: { da: '13,3" bærbar', en: '13.3" laptop' },
    tagline: {
      da: '13,3" med Core Ultra og op til 64 GB loddet RAM.',
      en: 'A 13.3" with Core Ultra and up to 64 GB of soldered RAM.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad X13 Gen 5: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad X13 Gen 5: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad X13 Gen 5: en lille 13,3" med Core Ultra og op til 64 GB RAM, loddet fast. Der er kun en skærm at vælge, kun Intel og intet netstik.',
      en: 'Refurbished ThinkPad X13 Gen 5: small 13.3" with Core Ultra and up to 64 GB of soldered RAM. There is just one screen to pick, and it is Intel only.',
    },
    intro: {
      da: 'X13 Gen 5 har Intel Core Ultra (Serie 1) og 16, 32 eller 64 GB LPDDR5X loddet fast. Den vejer fra 1,12 kg og har en 13,3" WUXGA-skærm, to Thunderbolt 4, to USB-A og HDMI 2.1. PSREF lister kun en Intel-udgave af Gen 5.',
      en: 'The X13 Gen 5 has Intel Core Ultra (Series 1) and 16, 32 or 64 GB of soldered LPDDR5X. It weighs from 1.12 kg and has a 13.3" WUXGA screen, two Thunderbolt 4, two USB-A and HDMI 2.1. PSREF lists only an Intel version of Gen 5.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have en lille maskine med meget RAM",
        en: "Staff who want a small machine with plenty of RAM",
      },
      {
        da: "Hybridarbejde med Thunderbolt-dock på kontoret",
        en: "Hybrid work with a Thunderbolt dock at the office",
      },
    ],
    notes: [
      {
        da: 'Der er kun én skærm at vælge: 13,3" WUXGA. Har I brug for højere opløsning, så se X13 Gen 4 Intel.',
        en: 'There is only one screen choice: 13.3" WUXGA. If you need a higher resolution, look at the X13 Gen 4 Intel.',
      },
      {
        da: "RAM'en er loddet fast, og der er ingen netværksport.",
        en: "RAM is soldered and there is no Ethernet port.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X13 Gen 5 (Intel) – 13,3" erhvervsbærbar',
        en: 'Lenovo ThinkPad X13 Gen 5 (Intel) — 13.3" business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) – U- og H-serie",
        en: "Intel Core Ultra 5/7 (Series 1) — U and H series",
      },
      memory: {
        da: "16, 32 eller 64 GB LPDDR5X – loddet fast, kan ikke udvides",
        en: "16, 32 or 64 GB LPDDR5X — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc (integreret)",
        en: "Intel Graphics or Intel Arc (integrated)",
      },
      display: {
        da: '13,3" 16:10 WUXGA (1920×1200) IPS, også med berøring',
        en: '13.3" 16:10 WUXGA (1920×1200) IPS, also with touch',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,12 kg", en: "From 1.12 kg" },
      battery: { da: "41 eller 54,7 Wh, indbygget", en: "41 or 54.7 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x13-yoga-gen-2",
    name: "Lenovo ThinkPad X13 Yoga Gen 2",
    format: { da: '13,3" 2-i-1', en: '13.3" 2-in-1' },
    tagline: {
      da: '13,3" berøringsskærm, der foldes til tablet – Intel 11. gen.',
      en: 'A 13.3" touchscreen that folds into a tablet — Intel 11th gen.',
    },
    metaTitle: {
      da: "Brugt Lenovo X13 Yoga Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X13 Yoga Gen 2: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X13 Yoga Gen 2: en lille 2-i-1, hvor skærmen kan foldes til en tablet, med Intel 11. gen. Pen på visse modeller, og RAM er loddet.",
      en: "Refurbished ThinkPad X13 Yoga Gen 2: small 2-in-1 whose screen folds into a tablet, with Intel 11th gen. A pen on some units; its RAM is soldered.",
    },
    intro: {
      da: 'X13 Yoga er X13 som 2-i-1: berøringsskærmen drejer 360 grader, og udvalgte modeller har en pen i kabinettet. Gen 2 har Intel Core 11. generation, en 13,3" 16:10-skærm og 52,8 Wh-batteri og vejer fra 1,20 kg. PSREF lister kun en Intel-udgave.',
      en: 'The X13 Yoga is the X13 as a 2-in-1: the touchscreen turns 360 degrees, and selected models have a pen in the chassis. Gen 2 has 11th-generation Intel Core, a 13.3" 16:10 screen and a 52.8 Wh battery, and weighs from 1.20 kg. PSREF lists only an Intel version.',
    },
    goodFor: [
      {
        da: "Undervisning, salg og service, hvor skærmen vises frem",
        en: "Teaching, sales and service work where the screen is shown to others",
      },
      {
        da: "Formularer og underskrifter på skærmen",
        en: "Forms and signatures on the screen",
      },
    ],
    notes: [
      {
        da: "Pennen sidder kun i udvalgte modeller. Tjek, at den konkrete maskine har pen, hvis I skal bruge den.",
        en: "The pen is only on selected models. Check that the actual unit has one if you need it.",
      },
      {
        da: "8–32 GB LPDDR4x er loddet fast, og der er ingen netværksport.",
        en: "8–32 GB of LPDDR4x is soldered, and there is no Ethernet port.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X13 Yoga Gen 2 (Intel) – 13,3" 2-i-1-erhvervsbærbar',
        en: 'Lenovo ThinkPad X13 Yoga Gen 2 (Intel) — 13.3" 2-in-1 business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (11. generation) – strømbesparende serie",
        en: "Intel Core i5/i7 (11th generation) — low-power series",
      },
      memory: {
        da: "8–32 GB LPDDR4x – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR4x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '13,3" 16:10 berøringsskærm, WUXGA (1920×1200) eller WQXGA (2560×1600) IPS',
        en: '13.3" 16:10 touchscreen, WUXGA (1920×1200) or WQXGA (2560×1600) IPS',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.0 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.0 and headset jack",
      },
      weight: { da: "Fra 1,20 kg", en: "From 1.20 kg" },
      battery: { da: "52,8 Wh, indbygget", en: "52.8 Wh, built in" },
      os: OS_10,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x13-yoga-gen-3",
    name: "Lenovo ThinkPad X13 Yoga Gen 3",
    format: { da: '13,3" 2-i-1', en: '13.3" 2-in-1' },
    tagline: {
      da: "2-i-1 med Intel 12. gen U-serie og HDMI 2.1.",
      en: "A 2-in-1 with Intel 12th gen U series and HDMI 2.1.",
    },
    metaTitle: {
      da: "Brugt Lenovo X13 Yoga Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X13 Yoga Gen 3: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X13 Yoga Gen 3: en lille 2-i-1 med touch og Intel 12. gen i U-serien. Til noter og møder, ikke til tunge beregninger, og RAM er loddet.",
      en: "Refurbished ThinkPad X13 Yoga Gen 3: a small 2-in-1 with touch and Intel 12th gen in the U series. It is for notes and meetings, not heavy lifting.",
    },
    intro: {
      da: 'X13 Yoga Gen 3 har Intel Core 12. generation i U-serien, LPDDR4x-hukommelse og samme 13,3" 16:10-berøringsskærm som Gen 2. HDMI-porten er opgraderet til 2.1, og vægten starter ved 1,19 kg. Batteriet er stadig 52,8 Wh.',
      en: 'The X13 Yoga Gen 3 has 12th-generation U-series Intel Core, LPDDR4x memory and the same 13.3" 16:10 touchscreen as Gen 2. The HDMI port moved to 2.1, and weight starts at 1.19 kg. The battery is still 52.8 Wh.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der tager noter med pen i møder",
        en: "Staff who take notes with a pen in meetings",
      },
      {
        da: "Kundevendt arbejde, hvor skærmen foldes som en tablet",
        en: "Client-facing work where the screen folds like a tablet",
      },
    ],
    notes: [
      {
        da: "Kun U-serieprocessorer. Til tunge beregninger er en T- eller P-serie et bedre valg.",
        en: "U-series processors only. For heavy computation a T or P series is a better choice.",
      },
      {
        da: "RAM'en er loddet fast (8–32 GB), og der er ingen netværksport.",
        en: "RAM is soldered (8–32 GB), and there is no Ethernet port.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X13 Yoga Gen 3 – 13,3" 2-i-1-erhvervsbærbar',
        en: 'Lenovo ThinkPad X13 Yoga Gen 3 — 13.3" 2-in-1 business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation) – U-serie",
        en: "Intel Core i5/i7 (12th generation) — U series",
      },
      memory: {
        da: "8–32 GB LPDDR4x – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR4x — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '13,3" 16:10 berøringsskærm, WUXGA (1920×1200) eller WQXGA (2560×1600) IPS',
        en: '13.3" 16:10 touchscreen, WUXGA (1920×1200) or WQXGA (2560×1600) IPS',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,19 kg", en: "From 1.19 kg" },
      battery: { da: "52,8 Wh, indbygget", en: "52.8 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-x13-yoga-gen-4",
    name: "Lenovo ThinkPad X13 Yoga Gen 4",
    format: { da: '13,3" 2-i-1', en: '13.3" 2-in-1' },
    tagline: {
      da: "2-i-1 med Intel 13. gen og to batterivalg.",
      en: "A 2-in-1 with Intel 13th gen and two battery choices.",
    },
    metaTitle: {
      da: "Brugt Lenovo X13 Yoga Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo X13 Yoga Gen 4: pros and cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad X13 Yoga Gen 4: lille 2-i-1 med touch og Intel 13. gen, nu med to batterier at vælge. Tag det store, hvis den skal bruges på farten.",
      en: "Refurbished ThinkPad X13 Yoga Gen 4: a small 2-in-1 with touch and Intel 13th gen, now with two batteries to pick. Take the larger if it will travel.",
    },
    intro: {
      da: 'X13 Yoga Gen 4 har Intel Core 13. generation, 8–32 GB LPDDR5 loddet fast og en 13,3" WUXGA-berøringsskærm. Batteriet fås nu i to størrelser, 41 eller 54,7 Wh, og vægten starter ved 1,21 kg. Pennen sidder i kabinettet på udvalgte modeller.',
      en: 'The X13 Yoga Gen 4 has 13th-generation Intel Core, 8–32 GB of soldered LPDDR5 and a 13.3" WUXGA touchscreen. The battery now comes in two sizes, 41 or 54.7 Wh, and weight starts at 1.21 kg. The pen sits in the chassis on selected models.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have en nyere lille 2-i-1",
        en: "Staff who want a newer small 2-in-1",
      },
      {
        da: "Mødenoter og markering af dokumenter med pen",
        en: "Meeting notes and marking up documents with a pen",
      },
    ],
    notes: [
      {
        da: "WQXGA-skærmen fra Gen 2 og 3 findes ikke længere; Gen 4 er kun WUXGA.",
        en: "The WQXGA screen from Gen 2 and 3 is gone; Gen 4 is WUXGA only.",
      },
      {
        da: "Spørg til batteriet: 41 Wh-udgaven giver kortere tid væk fra opladeren end 54,7 Wh.",
        en: "Ask about the battery: the 41 Wh version gives less time away from the charger than 54.7 Wh.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad X13 Yoga Gen 4 – 13,3" 2-i-1-erhvervsbærbar',
        en: 'Lenovo ThinkPad X13 Yoga Gen 4 — 13.3" 2-in-1 business laptop',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation) – U- og P-serie",
        en: "Intel Core i5/i7 (13th generation) — U and P series",
      },
      memory: {
        da: "8–32 GB LPDDR5 – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR5 — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: { da: "Intel Iris Xe (integreret)", en: "Intel Iris Xe (integrated)" },
      display: {
        da: '13,3" 16:10 berøringsskærm, WUXGA (1920×1200) IPS',
        en: '13.3" 16:10 touchscreen, WUXGA (1920×1200) IPS',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,21 kg", en: "From 1.21 kg" },
      battery: { da: "41 eller 54,7 Wh, indbygget", en: "41 or 54.7 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-l14-gen-3",
    name: "Lenovo ThinkPad L14 Gen 3",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "Budget-ThinkPad med to RAM-sokler og microSD-læser.",
      en: "A budget ThinkPad with two RAM slots and a microSD reader.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad L14 Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad L14 Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad L14 Gen 3: en ThinkPad til et lille budget, med to sokler til RAM, netstik og microSD, Intel eller Ryzen. Bed om Full HD, ikke HD.",
      en: "Refurbished ThinkPad L14 Gen 3: a budget model with two RAM slots, Ethernet and a microSD slot. Ask for Full HD, not the HD screen. Ask us first.",
    },
    intro: {
      da: 'L-serien er ThinkPads budgetlinje, og L14 Gen 3 har det, mange dyrere modeller har mistet: to almindelige DDR4-sokler op til 64 GB. Den har Intel Core 12. generation eller AMD Ryzen 5000, netværksstik, HDMI og en microSD-læser. Skærmen er 14" i 16:9.',
      en: "The L series is ThinkPad's budget line, and the L14 Gen 3 has what many pricier models lost: two ordinary DDR4 slots up to 64 GB. It has 12th-generation Intel Core or AMD Ryzen 5000, Ethernet, HDMI and a microSD reader. The screen is 14\" in 16:9.",
    },
    goodFor: [
      {
        da: "Kontorflåder, hvor RAM skal kunne opgraderes billigt",
        en: "Office fleets where RAM must be cheap to upgrade",
      },
      {
        da: "Skoler, kommuner og administration med netværk på kabel",
        en: "Schools, councils and administration on wired networks",
      },
    ],
    notes: [
      {
        da: "Den findes også med en HD-skærm (1366×768, TN). Bed om Full HD IPS, hvis maskinen skal bruges hele dagen.",
        en: "It also exists with an HD screen (1366×768, TN). Ask for Full HD IPS if the machine is used all day.",
      },
      {
        da: "SSD'en er en kort M.2 2242 op til 1 TB, og der er kun én plads.",
        en: "The SSD is a short M.2 2242 up to 1 TB, and there is only one slot.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad L14 Gen 3 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad L14 Gen 3 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (12. generation) eller AMD Ryzen 3/5/7 5000 – også Pentium og PRO-varianter",
        en: "Intel Core i3/i5/i7 (12th generation) or AMD Ryzen 3/5/7 5000 — also Pentium and PRO variants",
      },
      memory: {
        da: "Op til 64 GB DDR4-3200 – to SO-DIMM-sokler, kan udvides",
        en: "Up to 64 GB DDR4-3200 — two SO-DIMM slots, expandable",
      },
      storage: {
        da: "Én M.2 2242 NVMe SSD op til 1 TB – kan udskiftes",
        en: "One M.2 2242 NVMe SSD up to 1 TB — replaceable",
      },
      graphics: {
        da: "Intel UHD eller Iris Xe; AMD Radeon (integreret)",
        en: "Intel UHD or Iris Xe; AMD Radeon (integrated)",
      },
      display: {
        da: '14" Full HD (1920×1080) IPS, også med berøring; HD (1366×768) TN på de billigste modeller',
        en: '14" Full HD (1920×1080) IPS, also with touch; HD (1366×768) TN on the cheapest models',
      },
      ports: {
        da: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) eller 2× USB-C 3.2 (AMD), HDMI 2.1, Gigabit-netværk, microSD-læser og kombineret lydstik",
        en: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) or 2× USB-C 3.2 (AMD), HDMI 2.1, Gigabit Ethernet, microSD reader and headset jack",
      },
      weight: { da: "Fra 1,39 kg", en: "From 1.39 kg" },
      battery: { da: "42, 57 eller 63 Wh", en: "42, 57 or 63 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-l14-gen-4",
    name: "Lenovo ThinkPad L14 Gen 4",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "To RAM-sokler, netværksstik og SSD op til 2 TB.",
      en: "Two RAM slots, Ethernet and an SSD up to 2 TB.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad L14 Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad L14 Gen 4: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad L14 Gen 4: to sokler til RAM, netstik og plads til en større SSD, med Intel eller Ryzen PRO. Bed om Full HD i stedet for HD-skærm.",
      en: "Refurbished ThinkPad L14 Gen 4: two RAM slots, Ethernet and room for a bigger drive. Ask for the Full HD screen, not the HD one it can ship with.",
    },
    intro: {
      da: "L14 Gen 4 holder fast i det, der gør L-serien praktisk: to DDR4-sokler op til 64 GB, netværksstik, HDMI og microSD-læser. Processoren er Intel Core 13. generation eller AMD Ryzen PRO 7030, og SSD'en kan nu være op til 2 TB.",
      en: "The L14 Gen 4 keeps what makes the L series practical: two DDR4 slots up to 64 GB, Ethernet, HDMI and a microSD reader. The processor is 13th-generation Intel Core or AMD Ryzen PRO 7030, and the SSD can now be up to 2 TB.",
    },
    goodFor: [
      {
        da: "Store kontorflåder, hvor maskinerne skal holdes kørende i mange år",
        en: "Large office fleets where machines must keep running for many years",
      },
      {
        da: "Arbejdspladser med netværk på kabel og ældre skærme på HDMI",
        en: "Desks with wired networking and older monitors on HDMI",
      },
    ],
    notes: [
      {
        da: "Den billigste skærm er HD (1366×768, TN). Bed om Full HD IPS.",
        en: "The cheapest screen is HD (1366×768, TN). Ask for Full HD IPS.",
      },
      {
        da: "NVIDIA GeForce MX550 findes kun på udvalgte Intel-modeller. Spørg, hvis grafikken betyder noget for jeres programmer.",
        en: "NVIDIA GeForce MX550 exists only on selected Intel models. Ask if graphics matter for your software.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad L14 Gen 4 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad L14 Gen 4 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (13. generation) eller AMD Ryzen 3/5/7 PRO 7030 – U- og P-serie på Intel",
        en: "Intel Core i3/i5/i7 (13th generation) or AMD Ryzen 3/5/7 PRO 7030 — U and P series on Intel",
      },
      memory: {
        da: "Op til 64 GB DDR4-3200 – to SO-DIMM-sokler, kan udvides",
        en: "Up to 64 GB DDR4-3200 — two SO-DIMM slots, expandable",
      },
      storage: {
        da: "Én M.2 2242 NVMe SSD op til 2 TB – kan udskiftes",
        en: "One M.2 2242 NVMe SSD up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel UHD eller Iris Xe, NVIDIA GeForce MX550 som mulighed; AMD Radeon (integreret)",
        en: "Intel UHD or Iris Xe, NVIDIA GeForce MX550 as an option; AMD Radeon (integrated)",
      },
      display: {
        da: '14" Full HD (1920×1080) IPS, også med berøring; HD (1366×768) TN på de billigste modeller',
        en: '14" Full HD (1920×1080) IPS, also with touch; HD (1366×768) TN on the cheapest models',
      },
      ports: {
        da: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit-netværk, microSD-læser og kombineret lydstik",
        en: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit Ethernet, microSD reader and headset jack",
      },
      weight: { da: "Fra 1,40 kg", en: "From 1.40 kg" },
      battery: { da: "46,5, 57 eller 63 Wh", en: "46.5, 57 or 63 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-l14-gen-5",
    name: "Lenovo ThinkPad L14 Gen 5",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "16:10-skærm, DDR5 i to sokler og tre USB-A-porte.",
      en: "A 16:10 screen, DDR5 in two slots and three USB-A ports.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad L14 Gen 5: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad L14 Gen 5: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad L14 Gen 5: 16:10-skærm, to sokler til RAM, tre USB-A og netstik, så den sjældent kræver adapter. Core Ultra eller Ryzen. Få tilbud.",
      en: "Refurbished ThinkPad L14 Gen 5: a 16:10 screen, two RAM slots, three USB-A ports and Ethernet, so it will rarely need an adapter. A written quote.",
    },
    intro: {
      da: 'L14 Gen 5 skiftede til en 14" 16:10-skærm i WUXGA, og HD-panelet er væk. Den har Intel Core Ultra eller AMD Ryzen PRO 7035, to DDR5-sokler op til 64 GB og en almindelig M.2 2280-SSD. Med tre USB-A, to USB-C, HDMI og netværksstik er der sjældent brug for adaptere.',
      en: 'The L14 Gen 5 moved to a 14" 16:10 WUXGA screen, and the HD panel is gone. It has Intel Core Ultra or AMD Ryzen PRO 7035, two DDR5 slots up to 64 GB and a standard M.2 2280 SSD. With three USB-A, two USB-C, HDMI and Ethernet, adapters are rarely needed.',
    },
    goodFor: [
      {
        da: "Kontorer med mange USB-A-enheder som mus, scannere og headsets",
        en: "Offices with many USB-A devices such as mice, scanners and headsets",
      },
      {
        da: "Flåder, der skal kunne udvides med RAM",
        en: "Fleets that must be upgradable with RAM",
      },
    ],
    notes: [
      {
        da: "Én af de tre USB-A-porte er kun USB 2.0. Brug den til mus og tastatur, ikke til diske.",
        en: "One of the three USB-A ports is only USB 2.0. Use it for mouse and keyboard, not drives.",
      },
      {
        da: "AMD-udgaven har USB4 i stedet for Thunderbolt 4. Tjek dock-kompatibiliteten, hvis I blander platforme.",
        en: "The AMD version has USB4 instead of Thunderbolt 4. Check dock compatibility if you mix platforms.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad L14 Gen 5 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad L14 Gen 5 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) eller AMD Ryzen 3/5/7 PRO 7035 – U- og H-serie på Intel",
        en: "Intel Core Ultra 5/7 (Series 1) or AMD Ryzen 3/5/7 PRO 7035 — U and H series on Intel",
      },
      memory: {
        da: "Op til 64 GB DDR5 – to SODIMM-sokler, kan udvides",
        en: "Up to 64 GB DDR5 — two SODIMM slots, expandable",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc; AMD Radeon 660M/680M",
        en: "Intel Graphics or Intel Arc; AMD Radeon 660M/680M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch',
      },
      ports: {
        da: "3× USB-A (én USB 2.0), USB-C + Thunderbolt 4 (Intel) eller USB-C + USB4 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "3× USB-A (one USB 2.0), USB-C + Thunderbolt 4 (Intel) or USB-C + USB4 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,36 kg", en: "From 1.36 kg" },
      battery: { da: "46,5 eller 57 Wh", en: "46.5 or 57 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-l13-gen-3",
    name: "Lenovo ThinkPad L13 Gen 3",
    format: { da: '13,3" bærbar', en: '13.3" laptop' },
    tagline: {
      da: 'Den lille L-serie – 13,3" 16:10 og 1,25 kg.',
      en: 'The small L series — 13.3" 16:10 and 1.25 kg.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad L13 Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad L13 Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad L13 Gen 3: den lille L-serie med 13,3" 16:10-skærm og Intel eller Ryzen. Til forskel fra L14 er RAM loddet, og der er intet netstik.',
      en: 'Refurbished ThinkPad L13 Gen 3: the small L series with a 13.3" 16:10 screen. Unlike the L14, its RAM is soldered and it has no Ethernet port at all.',
    },
    intro: {
      da: "L13 er den mindste L-serie: en 13,3\" 16:10-skærm i WUXGA og en vægt fra 1,25 kg. Gen 3 har Intel Core 12. generation eller AMD Ryzen 5000 og et 46 Wh-batteri. I modsætning til L14 er RAM'en loddet fast, og der er intet netværksstik.",
      en: 'The L13 is the smallest L series: a 13.3" 16:10 WUXGA screen and a weight from 1.25 kg. Gen 3 has 12th-generation Intel Core or AMD Ryzen 5000 and a 46 Wh battery. Unlike the L14, RAM is soldered and there is no Ethernet port.',
    },
    goodFor: [
      {
        da: "Medarbejdere, der vil have en lille maskine til et lavere budget end X13",
        en: "Staff who want a small machine on a lower budget than the X13",
      },
      {
        da: "Kontorarbejde med dock på skrivebordet",
        en: "Office work with a dock on the desk",
      },
    ],
    notes: [
      {
        da: "8, 16 eller 32 GB DDR4 er loddet fast og kan ikke udvides.",
        en: "8, 16 or 32 GB of DDR4 is soldered and cannot be expanded.",
      },
      {
        da: "Ingen netværksport og kun ét batteri på 46 Wh. Kablet netværk kræver adapter eller dock.",
        en: "No Ethernet port and only one 46 Wh battery. Wired networking needs an adapter or dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad L13 Gen 3 (Intel og AMD) – 13,3" erhvervsbærbar',
        en: 'Lenovo ThinkPad L13 Gen 3 (Intel and AMD) — 13.3" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (12. generation) eller AMD Ryzen 3/5/7 5000 – U-serie, PRO-varianter på AMD",
        en: "Intel Core i3/i5/i7 (12th generation) or AMD Ryzen 3/5/7 5000 — U series, PRO variants on AMD",
      },
      memory: {
        da: "8–32 GB DDR4 – loddet fast, kan ikke udvides",
        en: "8–32 GB DDR4 — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2242 NVMe SSD op til 1 TB – kan udskiftes",
        en: "One M.2 2242 NVMe SSD up to 1 TB — replaceable",
      },
      graphics: {
        da: "Intel UHD eller Iris Xe; AMD Radeon (integreret)",
        en: "Intel UHD or Iris Xe; AMD Radeon (integrated)",
      },
      display: {
        da: '13,3" 16:10 WUXGA (1920×1200) IPS, også med berøring',
        en: '13.3" 16:10 WUXGA (1920×1200) IPS, also with touch',
      },
      ports: {
        da: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1 and headset jack",
      },
      weight: {
        da: "Fra 1,25 kg (AMD) og 1,26 kg (Intel)",
        en: "From 1.25 kg (AMD) and 1.26 kg (Intel)",
      },
      battery: { da: "46 Wh, indbygget", en: "46 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-l13-gen-4",
    name: "Lenovo ThinkPad L13 Gen 4",
    format: { da: '13,3" bærbar', en: '13.3" laptop' },
    tagline: {
      da: '13,3" L-serie med Intel 13. gen eller Ryzen 7030.',
      en: 'A 13.3" L series with Intel 13th gen or Ryzen 7030.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad L13 Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad L13 Gen 4: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad L13 Gen 4: en lille 13,3" L-serie med Intel eller Ryzen. RAM er loddet fast, så vælg mindst 16 GB, og der er intet netstik i siden.',
      en: 'Refurbished ThinkPad L13 Gen 4: a small 13.3" L series with Intel or Ryzen. Its RAM is soldered, so pick at least 16 GB, and it has no Ethernet port.',
    },
    intro: {
      da: 'L13 Gen 4 har Intel Core 13. generation i U-serien eller AMD Ryzen 7030 og samme 13,3" WUXGA-skærm som Gen 3. Vægten starter ved 1,26 kg, og batteriet er 46 Wh. Intel-udgaven har LPDDR5, AMD-udgaven DDR4 – begge loddet fast.',
      en: 'The L13 Gen 4 has 13th-generation U-series Intel Core or AMD Ryzen 7030 and the same 13.3" WUXGA screen as Gen 3. Weight starts at 1.26 kg, and the battery is 46 Wh. The Intel version has LPDDR5, the AMD version DDR4 — both soldered.',
    },
    goodFor: [
      {
        da: "Små kontorer, der vil have en kompakt ThinkPad",
        en: "Small offices that want a compact ThinkPad",
      },
      {
        da: "Medarbejdere, der mest arbejder i browser og Office",
        en: "Staff who mostly work in a browser and Office",
      },
    ],
    notes: [
      {
        da: "RAM'en er loddet fast i 8, 16 eller 32 GB. Vælg 16 GB som minimum.",
        en: "RAM is soldered at 8, 16 or 32 GB. Choose 16 GB as a minimum.",
      },
      {
        da: "Ingen netværksport, og SSD'en er en kort M.2 2242 op til 1 TB.",
        en: "No Ethernet port, and the SSD is a short M.2 2242 up to 1 TB.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad L13 Gen 4 (Intel og AMD) – 13,3" erhvervsbærbar',
        en: 'Lenovo ThinkPad L13 Gen 4 (Intel and AMD) — 13.3" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (13. generation) eller AMD Ryzen 3/5/7 7030 – U-serie, PRO-varianter på AMD",
        en: "Intel Core i3/i5/i7 (13th generation) or AMD Ryzen 3/5/7 7030 — U series, PRO variants on AMD",
      },
      memory: {
        da: "8–32 GB LPDDR5 (Intel) eller DDR4 (AMD) – loddet fast, kan ikke udvides",
        en: "8–32 GB LPDDR5 (Intel) or DDR4 (AMD) — soldered, cannot be expanded",
      },
      storage: {
        da: "Én M.2 2242 NVMe SSD op til 1 TB – kan udskiftes",
        en: "One M.2 2242 NVMe SSD up to 1 TB — replaceable",
      },
      graphics: {
        da: "Intel UHD eller Iris Xe; AMD Radeon (integreret)",
        en: "Intel UHD or Iris Xe; AMD Radeon (integrated)",
      },
      display: {
        da: '13,3" 16:10 WUXGA (1920×1200) IPS, også med berøring',
        en: '13.3" 16:10 WUXGA (1920×1200) IPS, also with touch',
      },
      ports: {
        da: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1 og kombineret lydstik",
        en: "2× USB-A 3.2, USB-C 3.2 + Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1 and headset jack",
      },
      weight: { da: "Fra 1,26 kg", en: "From 1.26 kg" },
      battery: { da: "46 Wh, indbygget", en: "46 Wh, built in" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-l16-gen-1",
    name: "Lenovo ThinkPad L16 Gen 1",
    format: { da: '16" bærbar', en: '16" laptop' },
    tagline: {
      da: '16" L-serie med taltastatur og to DDR5-sokler.',
      en: 'A 16" L series with a numeric keypad and two DDR5 slots.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad L16 Gen 1: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad L16 Gen 1: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad L16 Gen 1: 16"-skærm med taltastatur, to sokler til RAM og netstik, med Core Ultra eller Ryzen PRO. Til faste pladser. Få et tilbud.',
      en: 'Refurbished ThinkPad L16 Gen 1: a 16" with a keypad, two RAM slots and Ethernet, on Intel or AMD. It fits a fixed desk with a lot of figures to type.',
    },
    intro: {
      da: 'L16 Gen 1 er L14 Gen 5 med en 16" 16:10-skærm og numerisk tastatur. Den har Intel Core Ultra eller AMD Ryzen PRO 7035, to DDR5-sokler op til 64 GB, tre USB-A og netværksstik. Vægten starter ved 1,77 kg.',
      en: 'The L16 Gen 1 is the L14 Gen 5 with a 16" 16:10 screen and a numeric keypad. It has Intel Core Ultra or AMD Ryzen PRO 7035, two DDR5 slots up to 64 GB, three USB-A and Ethernet. Weight starts at 1.77 kg.',
    },
    goodFor: [
      {
        da: "Økonomi, lager og ordrebehandling med mange tal",
        en: "Finance, warehouse and order processing with lots of figures",
      },
      {
        da: "Faste arbejdspladser uden ekstern skærm",
        en: "Fixed desks without an external monitor",
      },
    ],
    notes: [
      {
        da: 'Kun én skærm: 16" WUXGA. Har I brug for højere opløsning, så se T16.',
        en: 'Only one screen: 16" WUXGA. If you need a higher resolution, look at the T16.',
      },
      {
        da: "Den vejer fra 1,77 kg. Til medarbejdere, der bærer maskinen dagligt, er L14 Gen 5 lettere.",
        en: "It weighs from 1.77 kg. For staff who carry the machine daily, the L14 Gen 5 is lighter.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad L16 Gen 1 (Intel og AMD) – 16" erhvervsbærbar',
        en: 'Lenovo ThinkPad L16 Gen 1 (Intel and AMD) — 16" business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) eller AMD Ryzen 3/5/7 PRO 7035 – U- og H-serie på Intel",
        en: "Intel Core Ultra 5/7 (Series 1) or AMD Ryzen 3/5/7 PRO 7035 — U and H series on Intel",
      },
      memory: {
        da: "Op til 64 GB DDR5 – to SODIMM-sokler, kan udvides",
        en: "Up to 64 GB DDR5 — two SODIMM slots, expandable",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc; AMD Radeon 660M/680M",
        en: "Intel Graphics or Intel Arc; AMD Radeon 660M/680M",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch',
      },
      ports: {
        da: "3× USB-A (én USB 2.0), USB-C + Thunderbolt 4 (Intel) eller USB-C + USB4 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "3× USB-A (one USB 2.0), USB-C + Thunderbolt 4 (Intel) or USB-C + USB4 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,77 kg", en: "From 1.77 kg" },
      battery: { da: "46,5 eller 57 Wh", en: "46.5 or 57 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-e14-gen-4",
    name: "Lenovo ThinkPad E14 Gen 4",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "ThinkPads indgangsmodel – to M.2-pladser og en RAM-sokkel.",
      en: "ThinkPad's entry model — two M.2 slots and one RAM slot.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad E14 Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad E14 Gen 4: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad E14 Gen 4: den billigste ThinkPad, med plads til to SSD'er og en fri sokkel til RAM, Intel eller Ryzen. Bed om IPS, ikke TN-panel.",
      en: "Refurbished ThinkPad E14 Gen 4: the entry model, with room for two drives and a free slot for RAM. Ask for the IPS, not the TN panel it may have.",
    },
    intro: {
      da: "E-serien er ThinkPads indgangsmodel til mindre virksomheder. E14 Gen 4 har Intel Core 12. generation eller AMD Ryzen 5000, en 14\" Full HD-skærm og to M.2-pladser, så der kan sidde to SSD'er. RAM'en er typisk 8 GB loddet plus én fri sokkel.",
      en: "The E series is ThinkPad's entry model for smaller businesses. The E14 Gen 4 has 12th-generation Intel Core or AMD Ryzen 5000, a 14\" Full HD screen and two M.2 slots, so it can hold two SSDs. RAM is typically 8 GB soldered plus one free slot.",
    },
    goodFor: [
      {
        da: "Mindre virksomheder, der vil have ThinkPad-tastatur til en lavere pris end T-serien",
        en: "Smaller businesses that want a ThinkPad keyboard at a lower price than the T series",
      },
      {
        da: "Kontorarbejde, hvor en ekstra SSD til data er praktisk",
        en: "Office work where a second SSD for data is useful",
      },
    ],
    notes: [
      {
        da: "Den billigste skærm er et TN-panel med smalle synsvinkler. Bed om IPS.",
        en: "The cheapest screen is a TN panel with narrow viewing angles. Ask for IPS.",
      },
      {
        da: "AMD-udgaven har HDMI 1.4b, USB-C 3.2 Gen 1 og netværksstik kun på udvalgte modeller. Intel-udgaven har Thunderbolt 4, HDMI 2.1 og netværk som standard.",
        en: "The AMD version has HDMI 1.4b, USB-C 3.2 Gen 1 and Ethernet only on selected models. The Intel version has Thunderbolt 4, HDMI 2.1 and Ethernet as standard.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad E14 Gen 4 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad E14 Gen 4 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (12. generation) eller AMD Ryzen 3/5/7 5000 – U- og P-serie på Intel",
        en: "Intel Core i3/i5/i7 (12th generation) or AMD Ryzen 3/5/7 5000 — U and P series on Intel",
      },
      memory: {
        da: "Op til 40 GB DDR4-3200 – 8 GB loddet plus én SO-DIMM-sokkel (enkelte Intel-modeller kun én sokkel, op til 32 GB)",
        en: "Up to 40 GB DDR4-3200 — 8 GB soldered plus one SO-DIMM slot (some Intel models only one slot, up to 32 GB)",
      },
      storage: {
        da: "To M.2 NVMe-pladser, op til 1 TB pr. disk – kan udskiftes",
        en: "Two M.2 NVMe slots, up to 1 TB per drive — replaceable",
      },
      graphics: {
        da: "Intel UHD eller Iris Xe, NVIDIA GeForce MX550 som mulighed; AMD Radeon (integreret)",
        en: "Intel UHD or Iris Xe, NVIDIA GeForce MX550 as an option; AMD Radeon (integrated)",
      },
      display: {
        da: '14" Full HD (1920×1080) IPS eller TN, også med berøring',
        en: '14" Full HD (1920×1080) IPS or TN, also with touch',
      },
      ports: {
        da: "USB-A 2.0, USB-A 3.2, Thunderbolt 4 (Intel) eller USB-C 3.2 (AMD), HDMI, Gigabit-netværk (AMD: udvalgte modeller) og kombineret lydstik",
        en: "USB-A 2.0, USB-A 3.2, Thunderbolt 4 (Intel) or USB-C 3.2 (AMD), HDMI, Gigabit Ethernet (AMD: selected models) and headset jack",
      },
      weight: { da: "Fra 1,59 kg", en: "From 1.59 kg" },
      battery: { da: "45 eller 57 Wh", en: "45 or 57 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-e14-gen-5",
    name: "Lenovo ThinkPad E14 Gen 5",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "E14 med 16:10-skærm, lettere kabinet og to SSD-pladser.",
      en: "The E14 with a 16:10 screen, a lighter chassis and two SSD slots.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad E14 Gen 5: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad E14 Gen 5: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad E14 Gen 5: en lettere E14 med 16:10-skærm, netstik og plads til to SSD'er, Intel eller Ryzen. Vælg Intel, hvis I bruger USB-C-docks.",
      en: "Refurbished ThinkPad E14 Gen 5: a lighter E14 with a 16:10 screen, Ethernet and room for two drives. Pick the Intel if it is to sit in a USB-C dock.",
    },
    intro: {
      da: "E14 Gen 5 skiftede til en 14\" 16:10-skærm og blev lettere: fra 1,41 kg mod 1,59 kg for Gen 4. Den har Intel Core 13. generation eller AMD Ryzen 7030, netværksstik på begge platforme og to M.2-pladser. RAM'en er 8 eller 16 GB loddet plus én fri sokkel.",
      en: 'The E14 Gen 5 moved to a 14" 16:10 screen and got lighter: from 1.41 kg against 1.59 kg for Gen 4. It has 13th-generation Intel Core or AMD Ryzen 7030, Ethernet on both platforms and two M.2 slots. RAM is 8 or 16 GB soldered plus one free slot.',
    },
    goodFor: [
      {
        da: "Mindre kontorer, der vil have netværksstik og en nyere processor",
        en: "Small offices that want Ethernet and a newer processor",
      },
      {
        da: "Medarbejdere, der vil have plads til to diske",
        en: "Staff who want room for two drives",
      },
    ],
    notes: [
      {
        da: "AMD-udgaven har HDMI 1.4b og ingen Thunderbolt. Skal skærme køre over USB-C-dock, så vælg Intel.",
        en: "The AMD version has HDMI 1.4b and no Thunderbolt. If monitors have to run through a USB-C dock, choose Intel.",
      },
      {
        da: "Max-RAM afhænger af den loddede del: op til 40 GB med 8 GB loddet, op til 48 GB med 16 GB loddet (Intel).",
        en: "Maximum RAM depends on the soldered part: up to 40 GB with 8 GB soldered, up to 48 GB with 16 GB soldered (Intel).",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad E14 Gen 5 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad E14 Gen 5 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (13. generation) eller AMD Ryzen 3/5/7 7030 – U- og P-serie på Intel",
        en: "Intel Core i3/i5/i7 (13th generation) or AMD Ryzen 3/5/7 7030 — U and P series on Intel",
      },
      memory: {
        da: "Op til 48 GB DDR4-3200 – 8 eller 16 GB loddet plus én SO-DIMM-sokkel",
        en: "Up to 48 GB DDR4-3200 — 8 or 16 GB soldered plus one SO-DIMM slot",
      },
      storage: {
        da: "To M.2 NVMe-pladser, op til 1 TB pr. disk – kan udskiftes",
        en: "Two M.2 NVMe slots, up to 1 TB per drive — replaceable",
      },
      graphics: {
        da: "Intel UHD eller Iris Xe, NVIDIA GeForce MX550 som mulighed; AMD Radeon (integreret)",
        en: "Intel UHD or Iris Xe, NVIDIA GeForce MX550 as an option; AMD Radeon (integrated)",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K on selected models',
      },
      ports: {
        da: "2× USB-A, 2× USB-C (Intel: én er Thunderbolt 4), HDMI 2.1 (Intel) eller 1.4b (AMD), Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A, 2× USB-C (Intel: one is Thunderbolt 4), HDMI 2.1 (Intel) or 1.4b (AMD), Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,41 kg", en: "From 1.41 kg" },
      battery: { da: "47 eller 57 Wh", en: "47 or 57 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-e14-gen-6",
    name: "Lenovo ThinkPad E14 Gen 6",
    format: { da: '14" bærbar', en: '14" laptop' },
    tagline: {
      da: "E14 med to DDR5-sokler – intet loddet RAM.",
      en: "The E14 with two DDR5 slots — no soldered RAM.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad E14 Gen 6: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad E14 Gen 6: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad E14 Gen 6: intet RAM loddet fast, men to sokler, to SSD-pladser og netstik. Core Ultra eller Ryzen, til et budget lige under T-serien.",
      en: "Refurbished ThinkPad E14 Gen 6: no RAM is soldered, but there are two RAM slots, two drive slots and Ethernet, at a level just below the T series.",
    },
    intro: {
      da: 'E14 Gen 6 har ingen loddet hukommelse: to DDR5-sokler op til 64 GB. Den har Intel Core Ultra eller AMD Ryzen 7035, to M.2-pladser og netværksstik og vejer fra 1,42 kg. Skærmen er 14" 16:10 i WUXGA eller 2,2K.',
      en: 'The E14 Gen 6 has no soldered memory: two DDR5 slots up to 64 GB. It has Intel Core Ultra or AMD Ryzen 7035, two M.2 slots and Ethernet, and weighs from 1.42 kg. The screen is 14" 16:10 in WUXGA or 2.2K.',
    },
    goodFor: [
      {
        da: "Virksomheder, der vil kunne skifte både RAM og SSD selv",
        en: "Companies that want to replace both RAM and SSD themselves",
      },
      {
        da: "Kontorarbejde til et budget under T-serien",
        en: "Office work on a budget below the T series",
      },
    ],
    notes: [
      {
        da: "AMD-udgaven har to almindelige USB-C-porte (5 og 10 Gbit/s), ikke USB4. Intel har én Thunderbolt 4.",
        en: "The AMD version has two plain USB-C ports (5 and 10 Gbit/s), not USB4. Intel has one Thunderbolt 4.",
      },
      {
        da: 'Skærmen findes i WUXGA og 2,2K, men ikke som OLED. Skal I bruge OLED i 14", så se T14 Gen 5.',
        en: 'The screen comes in WUXGA and 2.2K, but not as OLED. If you need a 14" OLED, look at the T14 Gen 5.',
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad E14 Gen 6 (Intel og AMD) – 14" erhvervsbærbar',
        en: 'Lenovo ThinkPad E14 Gen 6 (Intel and AMD) — 14" business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) eller AMD Ryzen 3/5/7 7035 – også Ryzen 5 150 og Ryzen 7 170",
        en: "Intel Core Ultra 5/7 (Series 1) or AMD Ryzen 3/5/7 7035 — also Ryzen 5 150 and Ryzen 7 170",
      },
      memory: {
        da: "Op til 64 GB DDR5 – to SODIMM-sokler, kan udvides",
        en: "Up to 64 GB DDR5 — two SODIMM slots, expandable",
      },
      storage: {
        da: "To M.2 NVMe-pladser (PCIe 4.0), op til 1 TB pr. disk – kan udskiftes",
        en: "Two M.2 NVMe slots (PCIe 4.0), up to 1 TB per drive — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc; AMD Radeon 660M/680M",
        en: "Intel Graphics or Intel Arc; AMD Radeon 660M/680M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K on selected models',
      },
      ports: {
        da: "2× USB-A, 2× USB-C (Intel: én er Thunderbolt 4), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A, 2× USB-C (Intel: one is Thunderbolt 4), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,42 kg", en: "From 1.42 kg" },
      battery: { da: "47 eller 57 Wh", en: "47 or 57 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-e16-gen-1",
    name: "Lenovo ThinkPad E16 Gen 1",
    format: { da: '16" bærbar', en: '16" laptop' },
    tagline: {
      da: '16" E-serie med taltastatur og to SSD-pladser.',
      en: 'A 16" E series with a numeric keypad and two SSD slots.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad E16 Gen 1: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad E16 Gen 1: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad E16 Gen 1: stor 16"-skærm med taltastatur, netstik og to SSD-pladser, Intel eller Ryzen. Til bogføring og til at taste tal hele dagen.',
      en: 'Refurbished ThinkPad E16 Gen 1: a big 16" screen with a keypad, Ethernet and two SSD slots, Intel or Ryzen. It fits bookkeeping and typing figures.',
    },
    intro: {
      da: 'E16 Gen 1 er E14 Gen 5 i 16": en 16:10-skærm i WUXGA eller WQXGA (2560×1600) og et numerisk tastatur. Den har Intel Core 13. generation eller AMD Ryzen 7030, to M.2-pladser og netværksstik og vejer fra 1,77 kg.',
      en: 'The E16 Gen 1 is the E14 Gen 5 at 16": a 16:10 screen in WUXGA or WQXGA (2560×1600) and a numeric keypad. It has 13th-generation Intel Core or AMD Ryzen 7030, two M.2 slots and Ethernet, and weighs from 1.77 kg.',
    },
    goodFor: [
      {
        da: "Bogføring og dataindtastning til en lavere pris end T16",
        en: "Bookkeeping and data entry at a lower price than the T16",
      },
      {
        da: "Faste arbejdspladser, hvor stor skærm vejer tungere end vægten",
        en: "Fixed desks where screen size matters more than weight",
      },
    ],
    notes: [
      {
        da: "8 eller 16 GB er loddet fast, og den ene sokkel giver op til 40 eller 48 GB i alt.",
        en: "8 or 16 GB is soldered, and the single slot gives up to 40 or 48 GB in total.",
      },
      {
        da: "AMD-udgaven har HDMI 1.4b og ingen Thunderbolt – samme forskel som på E14 Gen 5.",
        en: "The AMD version has HDMI 1.4b and no Thunderbolt — the same difference as on the E14 Gen 5.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad E16 Gen 1 (Intel og AMD) – 16" erhvervsbærbar',
        en: 'Lenovo ThinkPad E16 Gen 1 (Intel and AMD) — 16" business laptop',
      },
      processor: {
        da: "Intel Core i3/i5/i7 (13. generation) eller AMD Ryzen 3/5/7 7030 – U- og P-serie på Intel",
        en: "Intel Core i3/i5/i7 (13th generation) or AMD Ryzen 3/5/7 7030 — U and P series on Intel",
      },
      memory: {
        da: "Op til 48 GB DDR4-3200 – 8 eller 16 GB loddet plus én SO-DIMM-sokkel",
        en: "Up to 48 GB DDR4-3200 — 8 or 16 GB soldered plus one SO-DIMM slot",
      },
      storage: {
        da: "To M.2 NVMe-pladser, op til 1 TB pr. disk – kan udskiftes",
        en: "Two M.2 NVMe slots, up to 1 TB per drive — replaceable",
      },
      graphics: {
        da: "Intel UHD eller Iris Xe, NVIDIA GeForce MX550 som mulighed; AMD Radeon (integreret)",
        en: "Intel UHD or Iris Xe, NVIDIA GeForce MX550 as an option; AMD Radeon (integrated)",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQXGA (2560×1600) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQXGA (2560×1600) on selected models',
      },
      ports: {
        da: "2× USB-A, 2× USB-C (Intel: én er Thunderbolt 4), HDMI 2.1 (Intel) eller 1.4b (AMD), Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A, 2× USB-C (Intel: one is Thunderbolt 4), HDMI 2.1 (Intel) or 1.4b (AMD), Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,77 kg", en: "From 1.77 kg" },
      battery: { da: "47 eller 57 Wh", en: "47 or 57 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-e16-gen-2",
    name: "Lenovo ThinkPad E16 Gen 2",
    format: { da: '16" bærbar', en: '16" laptop' },
    tagline: {
      da: '16" med taltastatur og to DDR5-sokler op til 64 GB.',
      en: 'A 16" with a numeric keypad and two DDR5 slots up to 64 GB.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad E16 Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad E16 Gen 2: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad E16 Gen 2: 16\" med taltastatur, to sokler til RAM og plads til to SSD'er, Core Ultra eller Ryzen. RAM kan let udvides. Få et tilbud.",
      en: 'Refurbished ThinkPad E16 Gen 2: a 16" with a keypad, two RAM slots and space for two drives, on Intel or AMD. Its RAM is easy to fill up later on.',
    },
    intro: {
      da: "E16 Gen 2 har samme platform som E14 Gen 6 i et 16\"-kabinet med numerisk tastatur. Hukommelsen sidder i to DDR5-sokler op til 64 GB, og der er plads til to SSD'er. Processoren er Intel Core Ultra eller AMD Ryzen 7035.",
      en: 'The E16 Gen 2 has the same platform as the E14 Gen 6 in a 16" chassis with a numeric keypad. Memory sits in two DDR5 slots up to 64 GB, and there is room for two SSDs. The processor is Intel Core Ultra or AMD Ryzen 7035.',
    },
    goodFor: [
      {
        da: "Økonomi og administration, der vil kunne opgradere RAM",
        en: "Finance and administration that want to upgrade RAM",
      },
      {
        da: "Store regneark uden ekstern skærm",
        en: "Large spreadsheets without an external monitor",
      },
    ],
    notes: [
      {
        da: "AMD-udgaven har ingen USB4 eller Thunderbolt, kun to USB-C 3.2-porte. Tjek docken.",
        en: "The AMD version has no USB4 or Thunderbolt, only two USB-C 3.2 ports. Check the dock.",
      },
      {
        da: "Den vejer fra 1,78 kg. Til daglig transport er E14 Gen 6 et lettere valg.",
        en: "It weighs from 1.78 kg. For daily carrying, the E14 Gen 6 is a lighter choice.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad E16 Gen 2 (Intel og AMD) – 16" erhvervsbærbar',
        en: 'Lenovo ThinkPad E16 Gen 2 (Intel and AMD) — 16" business laptop',
      },
      processor: {
        da: "Intel Core Ultra 5/7 (Serie 1) eller AMD Ryzen 3/5/7 7035 – også Ryzen 5 150 og Ryzen 7 170",
        en: "Intel Core Ultra 5/7 (Series 1) or AMD Ryzen 3/5/7 7035 — also Ryzen 5 150 and Ryzen 7 170",
      },
      memory: {
        da: "Op til 64 GB DDR5 – to SODIMM-sokler, kan udvides",
        en: "Up to 64 GB DDR5 — two SODIMM slots, expandable",
      },
      storage: {
        da: "To M.2 NVMe-pladser (PCIe 4.0), op til 1 TB pr. disk – kan udskiftes",
        en: "Two M.2 NVMe slots (PCIe 4.0), up to 1 TB per drive — replaceable",
      },
      graphics: {
        da: "Intel Graphics eller Intel Arc; AMD Radeon 660M/680M",
        en: "Intel Graphics or Intel Arc; AMD Radeon 660M/680M",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQXGA (2560×1600) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQXGA (2560×1600) on selected models',
      },
      ports: {
        da: "2× USB-A, 2× USB-C (Intel: én er Thunderbolt 4), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A, 2× USB-C (Intel: one is Thunderbolt 4), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,78 kg", en: "From 1.78 kg" },
      battery: { da: "47 eller 57 Wh", en: "47 or 57 Wh" },
      os: OS_11,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p14s-gen-3",
    name: "Lenovo ThinkPad P14s Gen 3",
    format: { da: '14" mobil workstation', en: '14" mobile workstation' },
    group: "workstations",
    tagline: {
      da: "T14-kabinet med workstation-grafik – NVIDIA T550 på Intel.",
      en: "A T14 chassis with workstation graphics — NVIDIA T550 on Intel.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P14s Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P14s Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad P14s Gen 3: workstation på størrelse med en T14, med Intel og NVIDIA T550 eller Ryzen PRO. Til lettere CAD. Få et skriftligt tilbud.",
      en: "Refurbished ThinkPad P14s Gen 3: a workstation the size of a T14, with Intel and NVIDIA T550 or Ryzen. It is for lighter CAD; test your software.",
    },
    intro: {
      da: 'P14s er Lenovos letteste workstation-serie: et 14"-kabinet på størrelse med en T14, men med processorer og grafik til tegneprogrammer. Gen 3 har Intel Core 12. generation i P-serien med NVIDIA T550 (4 GB) som mulighed eller AMD Ryzen PRO 6000 med Radeon 680M. Netværksstik og HDMI 2.1 er indbygget.',
      en: "The P14s is Lenovo's lightest workstation series: a 14\" chassis the size of a T14, but with processors and graphics for design software. Gen 3 has 12th-generation P-series Intel Core with NVIDIA T550 (4 GB) as an option, or AMD Ryzen PRO 6000 with Radeon 680M. Ethernet and HDMI 2.1 are built in.",
    },
    goodFor: [
      {
        da: "Lettere CAD og 2D-tegning på farten",
        en: "Lighter CAD and 2D drawing on the move",
      },
      {
        da: "Ingeniører, der vil have en workstation i en almindelig taske",
        en: "Engineers who want a workstation in an ordinary bag",
      },
    ],
    notes: [
      {
        da: "T550 er et indgangskort med 4 GB. Test jeres eget program, før I bestiller mange – tunge 3D-modeller kræver en P1 eller P16.",
        en: "The T550 is an entry-level card with 4 GB. Test your own software before ordering many — heavy 3D models need a P1 or P16.",
      },
      {
        da: "AMD-udgaven har 16 eller 32 GB loddet fast og ingen dedikeret grafik. Intel har 8 eller 16 GB loddet plus én sokkel.",
        en: "The AMD version has 16 or 32 GB soldered and no dedicated graphics. Intel has 8 or 16 GB soldered plus one slot.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P14s Gen 3 (Intel og AMD) – 14" mobil workstation',
        en: 'Lenovo ThinkPad P14s Gen 3 (Intel and AMD) — 14" mobile workstation',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation, P-serie) eller AMD Ryzen 5/7 PRO 6000 – op til 14 kerner på Intel",
        en: "Intel Core i5/i7 (12th generation, P series) or AMD Ryzen 5/7 PRO 6000 — up to 14 cores on Intel",
      },
      memory: {
        da: "Op til 48 GB DDR4 (Intel) eller 16–32 GB LPDDR5 (AMD) – Intel har 8 eller 16 GB loddet plus én sokkel; AMD er loddet fast",
        en: "Up to 48 GB DDR4 (Intel) or 16–32 GB LPDDR5 (AMD) — Intel has 8 or 16 GB soldered plus one slot; AMD is soldered",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA T550 (4 GB, dedikeret); AMD Radeon 660M/680M",
        en: "Intel Iris Xe or NVIDIA T550 (4 GB, dedicated); AMD Radeon 660M/680M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K (Intel) eller WQUXGA (AMD) på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K (Intel) or WQUXGA (AMD) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: {
        da: "Fra 1,38 kg (Intel) og 1,40 kg (AMD)",
        en: "From 1.38 kg (Intel) and 1.40 kg (AMD)",
      },
      battery: { da: "39,3 eller 52,5 Wh, indbygget", en: "39.3 or 52.5 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p14s-gen-4",
    name: "Lenovo ThinkPad P14s Gen 4",
    format: { da: '14" mobil workstation', en: '14" mobile workstation' },
    group: "workstations",
    tagline: {
      da: '14" workstation med NVIDIA RTX A500 eller Radeon 780M.',
      en: 'A 14" workstation with NVIDIA RTX A500 or Radeon 780M.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P14s Gen 4: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P14s Gen 4: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad P14s Gen 4: let 14" workstation med NVIDIA på Intel eller Radeon på AMD. RAM er loddet fast på de fleste udgaver. Skriftligt tilbud.',
      en: 'Refurbished ThinkPad P14s Gen 4: a light 14" workstation, NVIDIA on Intel or Radeon on AMD. Its RAM is fixed on most units, so pick it at the start.',
    },
    intro: {
      da: "P14s Gen 4 har Intel Core 13. generation i P-serien med NVIDIA RTX A500 (4 GB) som mulighed eller AMD Ryzen PRO 7040 med Radeon 780M. Hukommelsen går op til 64 GB, men på de fleste varianter er den loddet fast. Den vejer fra 1,34 kg og har netværksstik.",
      en: "The P14s Gen 4 has 13th-generation P-series Intel Core with NVIDIA RTX A500 (4 GB) as an option, or AMD Ryzen PRO 7040 with Radeon 780M. Memory goes up to 64 GB, but on most variants it is soldered. It weighs from 1.34 kg and has Ethernet.",
    },
    goodFor: [
      {
        da: "Arkitekter og ingeniører, der arbejder ude hos kunden",
        en: "Architects and engineers who work at the client's site",
      },
      {
        da: "Lettere 3D og visualisering, hvor RTX A500 er nok",
        en: "Lighter 3D and visualisation, where the RTX A500 is enough",
      },
    ],
    notes: [
      {
        da: "Intel-udgaven findes med 16/32/64 GB loddet LPDDR5X eller med DDR5 og én sokkel op til 48 GB. AMD er altid loddet. Få varianten bekræftet.",
        en: "The Intel version comes with 16/32/64 GB soldered LPDDR5X or with DDR5 and one slot up to 48 GB. AMD is always soldered. Get the variant confirmed.",
      },
      {
        da: "RTX A500 har 4 GB grafikhukommelse. Kør en test med jeres største modeller først.",
        en: "The RTX A500 has 4 GB of graphics memory. Run a test with your largest models first.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P14s Gen 4 (Intel og AMD) – 14" mobil workstation',
        en: 'Lenovo ThinkPad P14s Gen 4 (Intel and AMD) — 14" mobile workstation',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation, P-serie) eller AMD Ryzen 5/7 PRO 7040 – op til 14 kerner på Intel",
        en: "Intel Core i5/i7 (13th generation, P series) or AMD Ryzen 5/7 PRO 7040 — up to 14 cores on Intel",
      },
      memory: {
        da: "16–64 GB – loddet LPDDR5X, eller DDR5 med én sokkel op til 48 GB (kun Intel)",
        en: "16–64 GB — soldered LPDDR5X, or DDR5 with one slot up to 48 GB (Intel only)",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA RTX A500 (4 GB, dedikeret); AMD Radeon 740M/780M",
        en: "Intel Iris Xe or NVIDIA RTX A500 (4 GB, dedicated); AMD Radeon 740M/780M",
      },
      display: {
        da: '14" 16:10 WUXGA (1920×1200) IPS, også med berøring; 2,2K IPS (Intel) eller 2,8K OLED på udvalgte modeller',
        en: '14" 16:10 WUXGA (1920×1200) IPS, also with touch; 2.2K IPS (Intel) or 2.8K OLED on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,34 kg", en: "From 1.34 kg" },
      battery: { da: "39,3 eller 52,5 Wh, indbygget", en: "39.3 or 52.5 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p14s-gen-5",
    name: "Lenovo ThinkPad P14s Gen 5",
    format: { da: '14,5" eller 14" mobil workstation', en: '14.5" or 14" mobile workstation' },
    group: "workstations",
    tagline: {
      da: 'To DDR5-sokler op til 96 GB – Intel med 14,5"-skærm, AMD med 14".',
      en: 'Two DDR5 slots up to 96 GB — Intel with a 14.5" screen, AMD with 14".',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P14s Gen 5: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P14s Gen 5: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad P14s Gen 5: to sokler til RAM op til 96 GB. Intel har den største skærm og NVIDIA, AMD er lettest. Sig, hvilken I vil have. Få tilbud.",
      en: "Refurbished ThinkPad P14s Gen 5: two RAM slots that fit up to 96 GB. The Intel has a bigger screen and NVIDIA; the AMD is the lighter of the two.",
    },
    intro: {
      da: 'I Gen 5 er P14s to forskellige maskiner. Intel-udgaven har Core Ultra H-serie, NVIDIA RTX 500 Ada (4 GB) som mulighed, en 14,5"-skærm og 57 eller 75 Wh og vejer fra 1,61 kg. AMD-udgaven har Ryzen PRO 8040HS, en 14"-skærm og vejer fra 1,31 kg. Begge har to DDR5-sokler op til 96 GB.',
      en: 'In Gen 5 the P14s is two different machines. The Intel version has H-series Core Ultra, NVIDIA RTX 500 Ada (4 GB) as an option, a 14.5" screen and 57 or 75 Wh, and weighs from 1.61 kg. The AMD version has Ryzen PRO 8040HS, a 14" screen and weighs from 1.31 kg. Both have two DDR5 slots up to 96 GB.',
    },
    goodFor: [
      {
        da: "Simulering og store datasæt, hvor 64–96 GB RAM gør en forskel",
        en: "Simulation and large datasets, where 64–96 GB of RAM makes a difference",
      },
      {
        da: "Workstation-brugere, der vil kunne opgradere RAM selv",
        en: "Workstation users who want to upgrade RAM themselves",
      },
    ],
    notes: [
      {
        da: "Intel og AMD er ikke samme kabinet: skærmstørrelse, batteri og vægt er forskellige. Angiv platform, når I bestiller.",
        en: "Intel and AMD are not the same chassis: screen size, battery and weight differ. State the platform when ordering.",
      },
      {
        da: "Kun Intel-udgaven kan få dedikeret NVIDIA-grafik. AMD-udgaven har integreret Radeon 760M/780M.",
        en: "Only the Intel version can have dedicated NVIDIA graphics. The AMD version has integrated Radeon 760M/780M.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P14s Gen 5 (Intel og AMD) – 14,5" eller 14" mobil workstation',
        en: 'Lenovo ThinkPad P14s Gen 5 (Intel and AMD) — 14.5" or 14" mobile workstation',
      },
      processor: {
        da: "Intel Core Ultra 5/7/9 (H-serie) eller AMD Ryzen 5/7 PRO 8040HS – op til 16 kerner på Intel",
        en: "Intel Core Ultra 5/7/9 (H series) or AMD Ryzen 5/7 PRO 8040HS — up to 16 cores on Intel",
      },
      memory: {
        da: "Op til 96 GB DDR5-5600 – to SODIMM-sokler, kan udvides",
        en: "Up to 96 GB DDR5-5600 — two SODIMM slots, expandable",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics/Arc eller NVIDIA RTX 500 Ada (4 GB, dedikeret); AMD Radeon 760M/780M",
        en: "Intel Graphics/Arc or NVIDIA RTX 500 Ada (4 GB, dedicated); AMD Radeon 760M/780M",
      },
      display: {
        da: 'Intel: 14,5" 16:10 WUXGA, WQXGA (2560×1600) eller 3K; AMD: 14" 16:10 WUXGA (1920×1200), også med berøring',
        en: 'Intel: 14.5" 16:10 WUXGA, WQXGA (2560×1600) or 3K; AMD: 14" 16:10 WUXGA (1920×1200), also with touch',
      },
      ports: {
        da: "2× USB-A 3.2, 2× USB-C med Thunderbolt 4/USB4, HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× USB-C with Thunderbolt 4/USB4, HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: {
        da: "Fra 1,31 kg (AMD) og 1,61 kg (Intel)",
        en: "From 1.31 kg (AMD) and 1.61 kg (Intel)",
      },
      battery: {
        da: "57 eller 75 Wh (Intel); 39,3 eller 52,5 Wh (AMD)",
        en: "57 or 75 Wh (Intel); 39.3 or 52.5 Wh (AMD)",
      },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p16s-gen-1",
    name: "Lenovo ThinkPad P16s Gen 1",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: '16" workstation til under 2 kg – NVIDIA T550 eller Ryzen PRO 6000.',
      en: 'A 16" workstation under 2 kg — NVIDIA T550 or Ryzen PRO 6000.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P16s Gen 1: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P16s Gen 1: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad P16s Gen 1: let 16" workstation under 2 kg med Intel og NVIDIA T550 eller Ryzen. Til tegning i 2D på en stor skærm. Skriftligt tilbud.',
      en: 'Refurbished ThinkPad P16s Gen 1: a light 16" workstation, under 2 kg, with Intel and NVIDIA T550 or Ryzen. It is fit for 2D drafting on a big screen.',
    },
    intro: {
      da: 'P16s er P14s med en 16" 16:10-skærm, numerisk tastatur og plads til et 86 Wh-batteri. Gen 1 har Intel Core 12. generation i P-serien med NVIDIA T550 (4 GB) som mulighed eller AMD Ryzen PRO 6000. Den vejer fra 1,80 kg – meget mindre end en klassisk 16" workstation.',
      en: 'The P16s is a P14s with a 16" 16:10 screen, a numeric keypad and room for an 86 Wh battery. Gen 1 has 12th-generation P-series Intel Core with NVIDIA T550 (4 GB) as an option, or AMD Ryzen PRO 6000. It weighs from 1.80 kg — far less than a classic 16" workstation.',
    },
    goodFor: [
      {
        da: "2D-CAD og tegninger, hvor en stor skærm hjælper",
        en: "2D CAD and drawings, where a big screen helps",
      },
      {
        da: "Ingeniører, der vil have workstation-skærm uden en tung maskine",
        en: "Engineers who want a workstation screen without a heavy machine",
      },
    ],
    notes: [
      {
        da: "T550 er et indgangskort. Til tunge 3D-modeller er P1 eller P16 det rigtige valg.",
        en: "The T550 is an entry-level card. For heavy 3D models, a P1 or P16 is the right choice.",
      },
      {
        da: "AMD-udgaven har 16 eller 32 GB loddet fast; Intel har 8 eller 16 GB loddet plus én sokkel op til 48 GB.",
        en: "The AMD version has 16 or 32 GB soldered; Intel has 8 or 16 GB soldered plus one slot up to 48 GB.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P16s Gen 1 (Intel og AMD) – 16" mobil workstation',
        en: 'Lenovo ThinkPad P16s Gen 1 (Intel and AMD) — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core i5/i7 (12. generation, P-serie) eller AMD Ryzen 5/7 PRO 6000 – op til 14 kerner på Intel",
        en: "Intel Core i5/i7 (12th generation, P series) or AMD Ryzen 5/7 PRO 6000 — up to 14 cores on Intel",
      },
      memory: {
        da: "Op til 48 GB DDR4 (Intel) eller 16–32 GB LPDDR5 (AMD) – Intel har én sokkel; AMD er loddet fast",
        en: "Up to 48 GB DDR4 (Intel) or 16–32 GB LPDDR5 (AMD) — Intel has one slot; AMD is soldered",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA T550 (4 GB, dedikeret); AMD Radeon 660M/680M",
        en: "Intel Iris Xe or NVIDIA T550 (4 GB, dedicated); AMD Radeon 660M/680M",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQXGA (2560×1600) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQXGA (2560×1600) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or 2× USB-C 3.2 Gen 2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,80 kg", en: "From 1.80 kg" },
      battery: { da: "52,5 eller 86 Wh, indbygget", en: "52.5 or 86 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p16s-gen-2",
    name: "Lenovo ThinkPad P16s Gen 2",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: '16" workstation fra 1,70 kg med RTX A500 eller Radeon 780M.',
      en: 'A 16" workstation from 1.70 kg with RTX A500 or Radeon 780M.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P16s Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P16s Gen 2: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad P16s Gen 2: lettere 16" workstation med NVIDIA på Intel eller Radeon på AMD og OLED som tilvalg. Spørg til RAM. Skriftligt tilbud.',
      en: 'Refurbished ThinkPad P16s Gen 2: a light 16" workstation with NVIDIA (Intel) or Radeon (AMD), OLED if you like. Ask what RAM it has, as it varies.',
    },
    intro: {
      da: 'P16s Gen 2 er lettere end Gen 1 og vejer fra 1,70 kg. Den har Intel Core 13. generation i P-serien med NVIDIA RTX A500 (4 GB) som mulighed eller AMD Ryzen PRO 7040 med Radeon 780M. Skærmen er 16" i WUXGA eller WQUXGA OLED (3840×2400).',
      en: 'The P16s Gen 2 is lighter than Gen 1, from 1.70 kg. It has 13th-generation P-series Intel Core with NVIDIA RTX A500 (4 GB) as an option, or AMD Ryzen PRO 7040 with Radeon 780M. The screen is 16" in WUXGA or WQUXGA OLED (3840×2400).',
    },
    goodFor: [
      {
        da: "Visualisering og billedarbejde på en stor OLED-skærm",
        en: "Visualisation and image work on a large OLED screen",
      },
      {
        da: "Tegnestuer, der vil have samme maskine til kontor og byggeplads",
        en: "Design offices that want the same machine for the office and the site",
      },
    ],
    notes: [
      {
        da: "Som på P14s Gen 4 findes Intel-udgaven både med loddet LPDDR5X og med DDR5 plus én sokkel. AMD er altid loddet (16–64 GB).",
        en: "As on the P14s Gen 4, the Intel version exists both with soldered LPDDR5X and with DDR5 plus one slot. AMD is always soldered (16–64 GB).",
      },
      {
        da: "AMD-udgaven har USB4 og USB-C 3.2 i stedet for to Thunderbolt 4.",
        en: "The AMD version has USB4 and USB-C 3.2 instead of two Thunderbolt 4.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P16s Gen 2 (Intel og AMD) – 16" mobil workstation',
        en: 'Lenovo ThinkPad P16s Gen 2 (Intel and AMD) — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core i5/i7 (13. generation, P-serie) eller AMD Ryzen 5/7 PRO 7040 – op til 14 kerner på Intel",
        en: "Intel Core i5/i7 (13th generation, P series) or AMD Ryzen 5/7 PRO 7040 — up to 14 cores on Intel",
      },
      memory: {
        da: "16–64 GB – loddet LPDDR5X, eller DDR5 med én sokkel op til 48 GB (kun Intel)",
        en: "16–64 GB — soldered LPDDR5X, or DDR5 with one slot up to 48 GB (Intel only)",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe eller NVIDIA RTX A500 (4 GB, dedikeret); AMD Radeon 740M/780M",
        en: "Intel Iris Xe or NVIDIA RTX A500 (4 GB, dedicated); AMD Radeon 740M/780M",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQUXGA OLED (3840×2400) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQUXGA OLED (3840×2400) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) eller USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4 (Intel) or USB4 + USB-C 3.2 (AMD), HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,70 kg", en: "From 1.70 kg" },
      battery: { da: "52,5 eller 86 Wh, indbygget", en: "52.5 or 86 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p16s-gen-3",
    name: "Lenovo ThinkPad P16s Gen 3",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: "Core Ultra H, RTX 500 Ada og to DDR5-sokler op til 96 GB.",
      en: "Core Ultra H, RTX 500 Ada and two DDR5 slots up to 96 GB.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P16s Gen 3: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P16s Gen 3: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad P16s Gen 3: Core Ultra, NVIDIA som tilvalg og to sokler til RAM op til 96 GB på 16"-skærm. Til tung analyse. Skriv til os for et tilbud.',
      en: 'Refurbished ThinkPad P16s Gen 3: Core Ultra, NVIDIA as an option and two RAM slots up to 96 GB on a 16" screen. It suits analysis of lots of data.',
    },
    intro: {
      da: 'P16s Gen 3 har Intel Core Ultra i H-serien, NVIDIA RTX 500 Ada (4 GB) som mulighed og to DDR5-sokler op til 96 GB. Skærmen er 16" i WUXGA eller WQUXGA OLED, og batteriet er 57 eller 75 Wh. PSREF lister kun en Intel-udgave af Gen 3.',
      en: 'The P16s Gen 3 has H-series Intel Core Ultra, NVIDIA RTX 500 Ada (4 GB) as an option and two DDR5 slots up to 96 GB. The screen is 16" in WUXGA or WQUXGA OLED, and the battery is 57 or 75 Wh. PSREF lists only an Intel version of Gen 3.',
    },
    goodFor: [
      {
        da: "Analyse og modellering, der kræver meget RAM",
        en: "Analysis and modelling that need a lot of RAM",
      },
      {
        da: "Virksomheder, der vil kunne opgradere workstation-RAM senere",
        en: "Companies that want to upgrade workstation RAM later",
      },
    ],
    notes: [
      {
        da: "Batteriet er 57 eller 75 Wh – mindre end 86 Wh-muligheden i Gen 1 og 2.",
        en: "The battery is 57 or 75 Wh — smaller than the 86 Wh option in Gen 1 and 2.",
      },
      {
        da: "RTX 500 Ada har 4 GB. Store 3D-samlinger kræver et større kort i P1 eller P16.",
        en: "The RTX 500 Ada has 4 GB. Large 3D assemblies need a bigger card in a P1 or P16.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P16s Gen 3 (Intel) – 16" mobil workstation',
        en: 'Lenovo ThinkPad P16s Gen 3 (Intel) — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core Ultra 5/7/9 (H-serie) – op til 16 kerner",
        en: "Intel Core Ultra 5/7/9 (H series) — up to 16 cores",
      },
      memory: {
        da: "Op til 96 GB DDR5-5600 – to SODIMM-sokler, kan udvides",
        en: "Up to 96 GB DDR5-5600 — two SODIMM slots, expandable",
      },
      storage: {
        da: "Én M.2 2280 NVMe SSD (PCIe 4.0) op til 2 TB – kan udskiftes",
        en: "One M.2 2280 NVMe SSD (PCIe 4.0) up to 2 TB — replaceable",
      },
      graphics: {
        da: "Intel Graphics/Arc eller NVIDIA RTX 500 Ada (4 GB, dedikeret)",
        en: "Intel Graphics/Arc or NVIDIA RTX 500 Ada (4 GB, dedicated)",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) IPS, også med berøring; WQUXGA OLED (3840×2400) på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) IPS, also with touch; WQUXGA OLED (3840×2400) on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, Gigabit-netværk og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, Gigabit Ethernet and headset jack",
      },
      weight: { da: "Fra 1,82 kg", en: "From 1.82 kg" },
      battery: { da: "57 eller 75 Wh, indbygget", en: "57 or 75 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p1-gen-5",
    name: "Lenovo ThinkPad P1 Gen 5",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: 'Tynd 16" workstation med op til NVIDIA RTX A5500.',
      en: 'A slim 16" workstation with up to NVIDIA RTX A5500.',
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P1 Gen 5: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P1 Gen 5: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad P1 Gen 5: tynd 16" workstation med Intel 12. gen og NVIDIA op til de største kort. Til 3D og rendering, der skal bæres. Få et tilbud.',
      en: 'Refurbished ThinkPad P1 Gen 5: a slim 16" workstation with Intel 12th gen and NVIDIA up to the largest cards. For 3D and rendering that will travel.',
    },
    intro: {
      da: "P1 er Lenovos tynde workstation med kraftige grafikkort. Gen 5 har Intel Core i7/i9 i 12. generations H-serie, to DDR5-sokler op til 64 GB og grafik fra Iris Xe op til NVIDIA RTX A5500 eller GeForce RTX 3080 Ti. Den vejer fra 1,81 kg og har et 90 Wh-batteri.",
      en: "The P1 is Lenovo's slim workstation with powerful graphics cards. Gen 5 has 12th-generation H-series Intel Core i7/i9, two DDR5 slots up to 64 GB and graphics from Iris Xe up to NVIDIA RTX A5500 or GeForce RTX 3080 Ti. It weighs from 1.81 kg and has a 90 Wh battery.",
    },
    goodFor: [
      {
        da: "3D, rendering og video, der skal kunne bæres",
        en: "3D, rendering and video that has to be portable",
      },
      {
        da: "Konsulenter, der viser modeller hos kunden",
        en: "Consultants who present models at the client",
      },
    ],
    notes: [
      {
        da: "Med de største grafikkort (RTX A3000 og op, GeForce) er der kun én SSD-plads; med integreret grafik, A1000 eller A2000 er der to.",
        en: "With the largest graphics cards (RTX A3000 and up, GeForce) there is only one SSD slot; with integrated graphics, A1000 or A2000 there are two.",
      },
      {
        da: "Ingen netværksport. Workstation-brug på kontoret kræver typisk en Thunderbolt-dock.",
        en: "No Ethernet port. Workstation use at the office usually needs a Thunderbolt dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P1 Gen 5 – 16" mobil workstation',
        en: 'Lenovo ThinkPad P1 Gen 5 — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core i7/i9 (12. generation, H-serie) – op til 14 kerner",
        en: "Intel Core i7/i9 (12th generation, H series) — up to 14 cores",
      },
      memory: {
        da: "Op til 64 GB DDR5-4800 – to SO-DIMM-sokler, kan udvides",
        en: "Up to 64 GB DDR5-4800 — two SO-DIMM slots, expandable",
      },
      storage: {
        da: "Én eller to M.2 2280 NVMe SSD'er (PCIe 4.0), op til 8 TB i alt med RAID 0/1 – kan udskiftes",
        en: "One or two M.2 2280 NVMe SSDs (PCIe 4.0), up to 8 TB in total with RAID 0/1 — replaceable",
      },
      graphics: {
        da: "Intel Iris Xe, NVIDIA RTX A1000/A2000/A3000/A4500/A5500 eller GeForce RTX 3070 Ti/3080 Ti",
        en: "Intel Iris Xe, NVIDIA RTX A1000/A2000/A3000/A4500/A5500 or GeForce RTX 3070 Ti/3080 Ti",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) eller WQXGA (2560×1600); WQUXGA (3840×2400) med berøring på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) or WQXGA (2560×1600); WQUXGA (3840×2400) with touch on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express-kortlæser og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express card reader and headset jack",
      },
      weight: { da: "Fra 1,81 kg", en: "From 1.81 kg" },
      battery: { da: "90 Wh, indbygget", en: "90 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p1-gen-6",
    name: "Lenovo ThinkPad P1 Gen 6",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: "RTX Ada eller GeForce RTX 40 og op til 96 GB DDR5.",
      en: "RTX Ada or GeForce RTX 40 and up to 96 GB DDR5.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P1 Gen 6: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P1 Gen 6: pros, cons | Kestro",
    },
    metaDescription: {
      da: 'Brugt ThinkPad P1 Gen 6: en tynd 16" workstation med Intel 13. gen, NVIDIA og op til 96 GB RAM. Få det præcise grafikkort bekræftet, før I køber.',
      en: 'Refurbished ThinkPad P1 Gen 6: slim 16" workstation with Intel 13th gen, NVIDIA and up to 96 GB of RAM. Confirm the exact card first. Write to us.',
    },
    intro: {
      da: "P1 Gen 6 har Intel Core i7/i9 i 13. generations H-serie og grafik fra NVIDIA RTX A1000 op til RTX 5000 Ada eller GeForce RTX 4060–4090. De to DDR5-sokler tager op til 96 GB, og skærmen fås op til WQUXGA OLED. Vægten starter ved 1,78 kg.",
      en: "The P1 Gen 6 has 13th-generation H-series Intel Core i7/i9 and graphics from NVIDIA RTX A1000 up to RTX 5000 Ada or GeForce RTX 4060–4090. The two DDR5 slots take up to 96 GB, and the screen comes up to WQUXGA OLED. Weight starts at 1.78 kg.",
    },
    goodFor: [
      {
        da: "Tung 3D, rendering og videoredigering på farten",
        en: "Heavy 3D, rendering and video editing on the move",
      },
      {
        da: "Medarbejdere, der vil have workstation-ydelse i en tynd maskine",
        en: "Staff who want workstation performance in a slim machine",
      },
    ],
    notes: [
      {
        da: "Kun modeller med RTX A1000 eller RTX 2000 Ada har to SSD-pladser; de større kort giver én plads op til 4 TB.",
        en: "Only models with RTX A1000 or RTX 2000 Ada have two SSD slots; the bigger cards leave one slot up to 4 TB.",
      },
      {
        da: "Grafikkortet afgør det meste af maskinen. Få det præcise kort bekræftet, og test det med jeres program.",
        en: "The graphics card decides most of the machine. Get the exact card confirmed and test it with your software.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P1 Gen 6 – 16" mobil workstation',
        en: 'Lenovo ThinkPad P1 Gen 6 — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core i7/i9 (13. generation, H-serie) – op til 14 kerner",
        en: "Intel Core i7/i9 (13th generation, H series) — up to 14 cores",
      },
      memory: {
        da: "Op til 96 GB DDR5 – to SODIMM-sokler, kan udvides",
        en: "Up to 96 GB DDR5 — two SODIMM slots, expandable",
      },
      storage: {
        da: "Én eller to M.2 2280 NVMe SSD'er (PCIe 4.0), op til 8 TB i alt – kan udskiftes",
        en: "One or two M.2 2280 NVMe SSDs (PCIe 4.0), up to 8 TB in total — replaceable",
      },
      graphics: {
        da: "NVIDIA RTX A1000, RTX 2000/3500/4000/5000 Ada eller GeForce RTX 4060/4080/4090",
        en: "NVIDIA RTX A1000, RTX 2000/3500/4000/5000 Ada or GeForce RTX 4060/4080/4090",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200), WQXGA (2560×1600) eller WQUXGA OLED (3840×2400), også med berøring',
        en: '16" 16:10 WUXGA (1920×1200), WQXGA (2560×1600) or WQUXGA OLED (3840×2400), also with touch',
      },
      ports: {
        da: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express-kortlæser og kombineret lydstik",
        en: "2× USB-A 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express card reader and headset jack",
      },
      weight: { da: "Fra 1,78 kg", en: "From 1.78 kg" },
      battery: { da: "90 Wh, indbygget", en: "90 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p1-gen-7",
    name: "Lenovo ThinkPad P1 Gen 7",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: "Core Ultra H og LPCAMM2 – udskiftelig LPDDR5X op til 64 GB.",
      en: "Core Ultra H and LPCAMM2 — replaceable LPDDR5X up to 64 GB.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P1 Gen 7: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P1 Gen 7: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad P1 Gen 7: Core Ultra, plads til to SSD'er og RAM i et nyt modul, der kan skiftes. En tynd 16\" workstation. Få et skriftligt tilbud.",
      en: 'Refurbished ThinkPad P1 Gen 7: Core Ultra in a slim 16" workstation, two drive slots, and its RAM in a new kind of module you can swap. Just ask.',
    },
    intro: {
      da: "P1 Gen 7 har Intel Core Ultra i H-serien og en ny type hukommelse: LPDDR5X i ét LPCAMM2-modul, der kan skiftes, op til 64 GB. Grafikken er Intel Arc eller NVIDIA RTX 1000–3000 Ada eller GeForce RTX 4060/4070, og alle modeller har to SSD-pladser. Den vejer fra 1,82 kg.",
      en: "The P1 Gen 7 has H-series Intel Core Ultra and a new type of memory: LPDDR5X in a single replaceable LPCAMM2 module, up to 64 GB. Graphics are Intel Arc, NVIDIA RTX 1000–3000 Ada or GeForce RTX 4060/4070, and every model has two SSD slots. It weighs from 1.82 kg.",
    },
    goodFor: [
      {
        da: "3D og video, hvor to diske og meget RAM er nødvendige",
        en: "3D and video work where two drives and plenty of RAM are needed",
      },
      {
        da: "Workstation-brugere, der rejser",
        en: "Workstation users who travel",
      },
    ],
    notes: [
      {
        da: "LPCAMM2 er ikke almindelige SO-DIMM-moduler. En opgradering kræver et LPCAMM2-modul, og det er en nyere modultype.",
        en: "LPCAMM2 is not an ordinary SO-DIMM module. An upgrade needs an LPCAMM2 module, which is a newer module type.",
      },
      {
        da: "Kun én USB-A-port og intet netværksstik. Planlæg dock eller adaptere.",
        en: "Only one USB-A port and no Ethernet. Plan a dock or adapters.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P1 Gen 7 – 16" mobil workstation',
        en: 'Lenovo ThinkPad P1 Gen 7 — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core Ultra 5/7/9 (H-serie) – op til 16 kerner",
        en: "Intel Core Ultra 5/7/9 (H series) — up to 16 cores",
      },
      memory: {
        da: "Op til 64 GB LPDDR5X – ét LPCAMM2-modul, kan udskiftes",
        en: "Up to 64 GB LPDDR5X — one LPCAMM2 module, replaceable",
      },
      storage: {
        da: "To M.2 2280 NVMe SSD'er (PCIe 4.0), op til 8 TB i alt med RAID 0/1 – kan udskiftes",
        en: "Two M.2 2280 NVMe SSDs (PCIe 4.0), up to 8 TB in total with RAID 0/1 — replaceable",
      },
      graphics: {
        da: "Intel Arc, NVIDIA RTX 1000/2000/3000 Ada eller GeForce RTX 4060/4070",
        en: "Intel Arc, NVIDIA RTX 1000/2000/3000 Ada or GeForce RTX 4060/4070",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200), WQXGA (2560×1600) eller WQUXGA OLED (3840×2400), også med berøring',
        en: '16" 16:10 WUXGA (1920×1200), WQXGA (2560×1600) or WQUXGA OLED (3840×2400), also with touch',
      },
      ports: {
        da: "1× USB-A 3.2, 1× USB-C 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express-kortlæser og kombineret lydstik",
        en: "1× USB-A 3.2, 1× USB-C 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express card reader and headset jack",
      },
      weight: { da: "Fra 1,82 kg", en: "From 1.82 kg" },
      battery: { da: "90 Wh, indbygget", en: "90 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p16-gen-1",
    name: "Lenovo ThinkPad P16 Gen 1",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: "Fuld workstation: HX-processor, fire RAM-sokler og op til 128 GB.",
      en: "A full workstation: HX processor, four RAM slots and up to 128 GB.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P16 Gen 1: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P16 Gen 1: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad P16 Gen 1: en fuld workstation med fire sokler til RAM, ECC som tilvalg og plads til to SSD'er. Intel HX og NVIDIA, til et skrivebord.",
      en: "Refurbished ThinkPad P16 Gen 1: a full workstation with four RAM slots, ECC as an option and room for two SSDs. It is built for a desk. Write to us.",
    },
    intro: {
      da: "P16 er den store workstation i serien: Intel Core i5/i7/i9 i 12. generations HX-serie, fire DDR5-sokler op til 128 GB med ECC som mulighed og to SSD-pladser med RAID. Grafikken går fra Intel Arc Pro A30M til NVIDIA RTX A5500. Den vejer fra 2,95 kg.",
      en: "The P16 is the big workstation in the series: 12th-generation HX-series Intel Core i5/i7/i9, four DDR5 slots up to 128 GB with ECC as an option, and two SSD slots with RAID. Graphics range from Intel Arc Pro A30M to NVIDIA RTX A5500. It weighs from 2.95 kg.",
    },
    goodFor: [
      {
        da: "Simulering, store BIM-modeller og rendering",
        en: "Simulation, large BIM models and rendering",
      },
      {
        da: "Arbejde, der kræver ECC-hukommelse",
        en: "Work that requires ECC memory",
      },
    ],
    notes: [
      {
        da: "Vejer fra 2,95 kg. Det er en maskine til skrivebord og bil, ikke til daglig pendling.",
        en: "Weighs from 2.95 kg. This is a machine for a desk and a car, not daily commuting.",
      },
      {
        da: "ECC kræver både ECC-moduler og en af de processorer, Lenovo angiver (i5-12600HX, i7-12850HX eller i9-12950HX). Ingen netværksport.",
        en: "ECC needs both ECC modules and one of the processors Lenovo lists (i5-12600HX, i7-12850HX or i9-12950HX). No Ethernet port.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P16 Gen 1 – 16" mobil workstation',
        en: 'Lenovo ThinkPad P16 Gen 1 — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core i5/i7/i9 (12. generation, HX-serie) – op til 16 kerner",
        en: "Intel Core i5/i7/i9 (12th generation, HX series) — up to 16 cores",
      },
      memory: {
        da: "Op til 128 GB DDR5-4800 – fire SO-DIMM-sokler, ECC som mulighed",
        en: "Up to 128 GB DDR5-4800 — four SO-DIMM slots, ECC as an option",
      },
      storage: {
        da: "To M.2 2280 NVMe SSD'er (PCIe 4.0), op til 8 TB i alt med RAID 0/1 – kan udskiftes",
        en: "Two M.2 2280 NVMe SSDs (PCIe 4.0), up to 8 TB in total with RAID 0/1 — replaceable",
      },
      graphics: {
        da: "Intel UHD, Intel Arc Pro A30M eller NVIDIA RTX A1000/A2000/A3000/A4500/A5500",
        en: "Intel UHD, Intel Arc Pro A30M or NVIDIA RTX A1000/A2000/A3000/A4500/A5500",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) eller WQXGA (2560×1600) IPS; WQUXGA OLED (3840×2400) med berøring på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) or WQXGA (2560×1600) IPS; WQUXGA OLED (3840×2400) with touch on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 1× USB-C 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express-kortlæser og kombineret lydstik",
        en: "2× USB-A 3.2, 1× USB-C 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express card reader and headset jack",
      },
      weight: { da: "Fra 2,95 kg", en: "From 2.95 kg" },
      battery: { da: "94 Wh, indbygget", en: "94 Wh, built in" },
      os: OS_P,
    },
  }),
  laptop({
    slug: "lenovo-thinkpad-p16-gen-2",
    name: "Lenovo ThinkPad P16 Gen 2",
    format: { da: '16" mobil workstation', en: '16" mobile workstation' },
    group: "workstations",
    tagline: {
      da: "Op til 192 GB RAM og NVIDIA RTX 5000 Ada i en bærbar.",
      en: "Up to 192 GB of RAM and NVIDIA RTX 5000 Ada in a laptop.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad P16 Gen 2: fordele og ulemper | Kestro",
      en: "Refurbished Lenovo ThinkPad P16 Gen 2: pros, cons | Kestro",
    },
    metaDescription: {
      da: "Brugt ThinkPad P16 Gen 2: op til 192 GB RAM i fire sokler, Intel HX og NVIDIA. Til simulering og store modeller ved et skrivebord. Skriftligt tilbud.",
      en: "Refurbished ThinkPad P16 Gen 2: up to 192 GB of RAM in four slots, Intel HX and NVIDIA. It is for simulation and big models at a desk with a dock.",
    },
    intro: {
      da: "P16 Gen 2 har Intel Core i5/i7/i9 i 13. generations HX-serie eller Core i7 i 14. generation med op til 24 kerner. Fire DDR5-sokler tager op til 192 GB (128 GB med ECC), og grafikken går op til NVIDIA RTX 5000 Ada. Den vejer fra 2,95 kg, som Gen 1.",
      en: "The P16 Gen 2 has 13th-generation HX-series Intel Core i5/i7/i9 or 14th-generation Core i7, with up to 24 cores. Four DDR5 slots take up to 192 GB (128 GB with ECC), and graphics go up to NVIDIA RTX 5000 Ada. It weighs from 2.95 kg, like Gen 1.",
    },
    goodFor: [
      {
        da: "Simulering og beregninger med meget store datasæt",
        en: "Simulation and computation with very large datasets",
      },
      {
        da: "Rendering og AI-arbejde, der kræver et stort grafikkort",
        en: "Rendering and AI work that needs a large graphics card",
      },
    ],
    notes: [
      {
        da: "Lenovo angiver, at DDR5-5600-modulerne kører med højst 4000 MT/s i denne maskine. Mere RAM giver plads, ikke højere hastighed.",
        en: "Lenovo states that the DDR5-5600 modules run at up to 4000 MT/s in this machine. More RAM gives room, not more speed.",
      },
      {
        da: "Vejer fra 2,95 kg og har intet netværksstik. Den hører til et skrivebord med dock.",
        en: "Weighs from 2.95 kg and has no Ethernet port. It belongs on a desk with a dock.",
      },
    ],
    facts: {
      model: {
        da: 'Lenovo ThinkPad P16 Gen 2 – 16" mobil workstation',
        en: 'Lenovo ThinkPad P16 Gen 2 — 16" mobile workstation',
      },
      processor: {
        da: "Intel Core i5/i7/i9 (13. generation, HX-serie) eller Core i7 (14. generation) – op til 24 kerner",
        en: "Intel Core i5/i7/i9 (13th generation, HX series) or Core i7 (14th generation) — up to 24 cores",
      },
      memory: {
        da: "Op til 192 GB DDR5 – fire SODIMM-sokler, op til 128 GB med ECC",
        en: "Up to 192 GB DDR5 — four SODIMM slots, up to 128 GB with ECC",
      },
      storage: {
        da: "To M.2 2280 NVMe SSD'er (PCIe 4.0), op til 8 TB i alt med RAID 0/1 – kan udskiftes",
        en: "Two M.2 2280 NVMe SSDs (PCIe 4.0), up to 8 TB in total with RAID 0/1 — replaceable",
      },
      graphics: {
        da: "Intel UHD, Intel Arc Pro A30M, NVIDIA RTX A1000 eller RTX 1000/2000/3500/4000/5000 Ada",
        en: "Intel UHD, Intel Arc Pro A30M, NVIDIA RTX A1000 or RTX 1000/2000/3500/4000/5000 Ada",
      },
      display: {
        da: '16" 16:10 WUXGA (1920×1200) eller WQXGA (2560×1600) IPS, berøring på udvalgte modeller',
        en: '16" 16:10 WUXGA (1920×1200) or WQXGA (2560×1600) IPS, touch on selected models',
      },
      ports: {
        da: "2× USB-A 3.2, 1× USB-C 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express-kortlæser og kombineret lydstik",
        en: "2× USB-A 3.2, 1× USB-C 3.2, 2× Thunderbolt 4, HDMI 2.1, SD Express card reader and headset jack",
      },
      weight: { da: "Fra 2,95 kg", en: "From 2.95 kg" },
      battery: { da: "94 Wh, indbygget", en: "94 Wh, built in" },
      os: OS_P,
    },
  }),
];

/*
 * Card chips for the models above: processor, memory, storage. Each figure is
 * the head of a sentence in that model's specs; scripts/verify/content.mjs
 * fails the build if a chip states a number its model does not.
 */
export const CARD_CHIPS_LENOVO_BUSINESS: Record<string, Localized[]> = {
  "lenovo-thinkpad-t14-gen-3": [
    { da: "i5/i7 12. gen el. Ryzen PRO", en: "i5/i7 12th gen or Ryzen PRO" },
    { da: "8–48 GB", en: "8–48 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t14-gen-4": [
    { da: "i5/i7 13. gen el. Ryzen PRO", en: "i5/i7 13th gen or Ryzen PRO" },
    { da: "8–40 GB", en: "8–40 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t14-gen-5": [
    { da: "Core Ultra el. Ryzen PRO", en: "Core Ultra or Ryzen PRO" },
    { da: "Op til 64 GB DDR5", en: "Up to 64 GB DDR5" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t14s-gen-2": [
    { da: "i5/i7 11. gen el. Ryzen", en: "i5/i7 11th gen or Ryzen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t14s-gen-3": [
    { da: "i5/i7 12. gen el. Ryzen PRO", en: "i5/i7 12th gen or Ryzen PRO" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t14s-gen-4": [
    { da: "i5/i7 13. gen el. Ryzen PRO", en: "i5/i7 13th gen or Ryzen PRO" },
    { da: "16 eller 32 GB loddet", en: "16 or 32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t14s-gen-5": [
    { da: "Intel Core Ultra 5/7", en: "Intel Core Ultra 5/7" },
    { da: "16–64 GB loddet", en: "16–64 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t16-gen-1": [
    { da: "i5/i7 12. gen el. Ryzen PRO", en: "i5/i7 12th gen or Ryzen PRO" },
    { da: "8–48 GB", en: "8–48 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t16-gen-2": [
    { da: "i5/i7 13. gen el. Ryzen PRO", en: "i5/i7 13th gen or Ryzen PRO" },
    { da: "8–64 GB", en: "8–64 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-t16-gen-3": [
    { da: "Intel Core Ultra 5/7", en: "Intel Core Ultra 5/7" },
    { da: "Op til 64 GB DDR5", en: "Up to 64 GB DDR5" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-carbon-gen-9": [
    { da: "Intel i5/i7 · 11. gen", en: "Intel i5/i7 · 11th gen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-carbon-gen-10": [
    { da: "Intel i5/i7 · 12. gen", en: "Intel i5/i7 · 12th gen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-carbon-gen-11": [
    { da: "Intel i5/i7 · 13. gen", en: "Intel i5/i7 · 13th gen" },
    { da: "16–64 GB loddet", en: "16–64 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-carbon-gen-12": [
    { da: "Intel Core Ultra 5/7", en: "Intel Core Ultra 5/7" },
    { da: "16–64 GB loddet", en: "16–64 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-yoga-gen-6": [
    { da: "Intel i5/i7 · 11. gen", en: "Intel i5/i7 · 11th gen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-yoga-gen-7": [
    { da: "Intel i5/i7 · 12. gen", en: "Intel i5/i7 · 12th gen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-yoga-gen-8": [
    { da: "Intel i5/i7 · 13. gen", en: "Intel i5/i7 · 13th gen" },
    { da: "16–64 GB loddet", en: "16–64 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-2-in-1-gen-9": [
    { da: "Intel Core Ultra 5/7", en: "Intel Core Ultra 5/7" },
    { da: "16–64 GB loddet", en: "16–64 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x1-nano-gen-1": [
    { da: "Intel i5/i7 · 11. gen", en: "Intel i5/i7 · 11th gen" },
    { da: "8 eller 16 GB loddet", en: "8 or 16 GB soldered" },
    { da: "NVMe SSD op til 1 TB", en: "NVMe SSD up to 1 TB" },
  ],
  "lenovo-thinkpad-x1-nano-gen-2": [
    { da: "Intel i5/i7 · 12. gen", en: "Intel i5/i7 · 12th gen" },
    { da: "16 eller 32 GB loddet", en: "16 or 32 GB soldered" },
    { da: "NVMe SSD op til 1 TB", en: "NVMe SSD up to 1 TB" },
  ],
  "lenovo-thinkpad-x1-nano-gen-3": [
    { da: "Intel i5/i7 · 13. gen", en: "Intel i5/i7 · 13th gen" },
    { da: "16 GB loddet", en: "16 GB soldered" },
    { da: "NVMe SSD op til 1 TB", en: "NVMe SSD up to 1 TB" },
  ],
  "lenovo-thinkpad-x13-gen-2": [
    { da: "i3–i7 11. gen el. Ryzen", en: "i3–i7 11th gen or Ryzen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x13-gen-3": [
    { da: "i3–i7 12. gen el. Ryzen PRO", en: "i3–i7 12th gen or Ryzen PRO" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x13-gen-4": [
    { da: "i3–i7 13. gen el. Ryzen PRO", en: "i3–i7 13th gen or Ryzen PRO" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x13-gen-5": [
    { da: "Intel Core Ultra 5/7", en: "Intel Core Ultra 5/7" },
    { da: "16–64 GB loddet", en: "16–64 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x13-yoga-gen-2": [
    { da: "Intel i5/i7 · 11. gen", en: "Intel i5/i7 · 11th gen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x13-yoga-gen-3": [
    { da: "Intel i5/i7 · 12. gen", en: "Intel i5/i7 · 12th gen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-x13-yoga-gen-4": [
    { da: "Intel i5/i7 · 13. gen", en: "Intel i5/i7 · 13th gen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-l14-gen-3": [
    { da: "i3–i7 12. gen el. Ryzen", en: "i3–i7 12th gen or Ryzen" },
    { da: "Op til 64 GB DDR4", en: "Up to 64 GB DDR4" },
    { da: "NVMe SSD op til 1 TB", en: "NVMe SSD up to 1 TB" },
  ],
  "lenovo-thinkpad-l14-gen-4": [
    { da: "i3–i7 13. gen el. Ryzen PRO", en: "i3–i7 13th gen or Ryzen PRO" },
    { da: "Op til 64 GB DDR4", en: "Up to 64 GB DDR4" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-l14-gen-5": [
    { da: "Core Ultra el. Ryzen PRO", en: "Core Ultra or Ryzen PRO" },
    { da: "Op til 64 GB DDR5", en: "Up to 64 GB DDR5" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-l13-gen-3": [
    { da: "i3–i7 12. gen el. Ryzen", en: "i3–i7 12th gen or Ryzen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 1 TB", en: "NVMe SSD up to 1 TB" },
  ],
  "lenovo-thinkpad-l13-gen-4": [
    { da: "i3–i7 13. gen el. Ryzen", en: "i3–i7 13th gen or Ryzen" },
    { da: "8–32 GB loddet", en: "8–32 GB soldered" },
    { da: "NVMe SSD op til 1 TB", en: "NVMe SSD up to 1 TB" },
  ],
  "lenovo-thinkpad-l16-gen-1": [
    { da: "Core Ultra el. Ryzen PRO", en: "Core Ultra or Ryzen PRO" },
    { da: "Op til 64 GB DDR5", en: "Up to 64 GB DDR5" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-e14-gen-4": [
    { da: "i3–i7 12. gen el. Ryzen", en: "i3–i7 12th gen or Ryzen" },
    { da: "Op til 40 GB DDR4", en: "Up to 40 GB DDR4" },
    { da: "2 M.2-pladser, 1 TB pr. disk", en: "2 M.2 slots, 1 TB per drive" },
  ],
  "lenovo-thinkpad-e14-gen-5": [
    { da: "i3–i7 13. gen el. Ryzen", en: "i3–i7 13th gen or Ryzen" },
    { da: "Op til 48 GB DDR4", en: "Up to 48 GB DDR4" },
    { da: "2 M.2-pladser, 1 TB pr. disk", en: "2 M.2 slots, 1 TB per drive" },
  ],
  "lenovo-thinkpad-e14-gen-6": [
    { da: "Core Ultra el. Ryzen", en: "Core Ultra or Ryzen" },
    { da: "Op til 64 GB DDR5", en: "Up to 64 GB DDR5" },
    { da: "2 M.2-pladser, 1 TB pr. disk", en: "2 M.2 slots, 1 TB per drive" },
  ],
  "lenovo-thinkpad-e16-gen-1": [
    { da: "i3–i7 13. gen el. Ryzen", en: "i3–i7 13th gen or Ryzen" },
    { da: "Op til 48 GB DDR4", en: "Up to 48 GB DDR4" },
    { da: "2 M.2-pladser, 1 TB pr. disk", en: "2 M.2 slots, 1 TB per drive" },
  ],
  "lenovo-thinkpad-e16-gen-2": [
    { da: "Core Ultra el. Ryzen", en: "Core Ultra or Ryzen" },
    { da: "Op til 64 GB DDR5", en: "Up to 64 GB DDR5" },
    { da: "2 M.2-pladser, 1 TB pr. disk", en: "2 M.2 slots, 1 TB per drive" },
  ],
  "lenovo-thinkpad-p14s-gen-3": [
    { da: "i5/i7 12. gen P el. Ryzen PRO", en: "i5/i7 12th gen P or Ryzen PRO" },
    { da: "Op til 48 GB", en: "Up to 48 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-p14s-gen-4": [
    { da: "i5/i7 13. gen P el. Ryzen PRO", en: "i5/i7 13th gen P or Ryzen PRO" },
    { da: "16–64 GB", en: "16–64 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-p14s-gen-5": [
    { da: "Core Ultra H el. Ryzen PRO", en: "Core Ultra H or Ryzen PRO" },
    { da: "Op til 96 GB DDR5", en: "Up to 96 GB DDR5" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-p16s-gen-1": [
    { da: "i5/i7 12. gen P el. Ryzen PRO", en: "i5/i7 12th gen P or Ryzen PRO" },
    { da: "Op til 48 GB", en: "Up to 48 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-p16s-gen-2": [
    { da: "i5/i7 13. gen P el. Ryzen PRO", en: "i5/i7 13th gen P or Ryzen PRO" },
    { da: "16–64 GB", en: "16–64 GB" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-p16s-gen-3": [
    { da: "Intel Core Ultra 5/7/9 H", en: "Intel Core Ultra 5/7/9 H" },
    { da: "Op til 96 GB DDR5", en: "Up to 96 GB DDR5" },
    { da: "NVMe SSD op til 2 TB", en: "NVMe SSD up to 2 TB" },
  ],
  "lenovo-thinkpad-p1-gen-5": [
    { da: "Intel i7/i9 · 12. gen H", en: "Intel i7/i9 · 12th gen H" },
    { da: "Op til 64 GB DDR5", en: "Up to 64 GB DDR5" },
    { da: "1–2 SSD'er, op til 8 TB", en: "1–2 SSDs, up to 8 TB" },
  ],
  "lenovo-thinkpad-p1-gen-6": [
    { da: "Intel i7/i9 · 13. gen H", en: "Intel i7/i9 · 13th gen H" },
    { da: "Op til 96 GB DDR5", en: "Up to 96 GB DDR5" },
    { da: "1–2 SSD'er, op til 8 TB", en: "1–2 SSDs, up to 8 TB" },
  ],
  "lenovo-thinkpad-p1-gen-7": [
    { da: "Intel Core Ultra 5/7/9 H", en: "Intel Core Ultra 5/7/9 H" },
    { da: "Op til 64 GB LPCAMM2", en: "Up to 64 GB LPCAMM2" },
    { da: "2 SSD'er, op til 8 TB", en: "2 SSDs, up to 8 TB" },
  ],
  "lenovo-thinkpad-p16-gen-1": [
    { da: "Intel i5/i7/i9 · 12. gen HX", en: "Intel i5/i7/i9 · 12th gen HX" },
    { da: "Op til 128 GB DDR5", en: "Up to 128 GB DDR5" },
    { da: "2 SSD'er, op til 8 TB", en: "2 SSDs, up to 8 TB" },
  ],
  "lenovo-thinkpad-p16-gen-2": [
    { da: "Intel i5–i9 · 13.–14. gen HX", en: "Intel i5–i9 · 13th–14th gen HX" },
    { da: "Op til 192 GB DDR5", en: "Up to 192 GB DDR5" },
    { da: "2 SSD'er, op til 8 TB", en: "2 SSDs, up to 8 TB" },
  ],
};
