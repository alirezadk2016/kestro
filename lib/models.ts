import type { Localized } from "./i18n";

/**
 * Machine models we are most often asked to source.
 *
 * This is a reference catalogue, not stock and not a shop: no prices, no
 * availability, no basket. We buy per order, so a model here means "this is
 * the kind of machine we can get hold of and know well" — nothing more.
 *
 * Every description is written by us. Specifications are given as the ranges
 * these machines are actually built in, because used hardware turns up in
 * many configurations; the exact one is agreed per order.
 */

export type ModelGroup = "baerbare" | "workstations" | "stationaere" | "skaerme" | "docking";

export type Model = {
  slug: string;
  /** Product name — the same in both languages. */
  name: string;
  brand: string;
  /** Form factor shown on cards, e.g. '14" bærbar'. */
  format: Localized;
  group: ModelGroup;
  /** Category slug in lib/categories that this model belongs to. */
  category: string;
  tagline: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  intro: Localized;
  goodFor: Localized[];
  specs: { label: Localized; value: Localized }[];
  /** Honest caveats — what a buyer should know before picking this one. */
  notes: Localized[];
  /** Longer argument for the model. Only where we have something to add. */
  why?: { title: Localized; description: Localized }[];
  images?: { src: string; alt: Localized }[];
};

export const modelGroups: { id: ModelGroup; name: Localized; description: Localized }[] = [
  {
    id: "baerbare",
    name: { da: "Bærbare computere", en: "Laptops" },
    description: {
      da: "Erhvervsserier bygget til daglig transport – ikke forbrugermodeller.",
      en: "Business ranges built to be carried every day — not consumer models.",
    },
  },
  {
    id: "workstations",
    name: { da: "Workstations", en: "Workstations" },
    description: {
      da: "Til CAD, 3D, video og andet arbejde, der kræver dedikeret grafik.",
      en: "For CAD, 3D, video and other work that needs a dedicated graphics card.",
    },
  },
  {
    id: "stationaere",
    name: { da: "Stationære og mini-pc'er", en: "Desktops and mini PCs" },
    description: {
      da: "Faste arbejdspladser, hvor skærm og tastatur alligevel bliver stående.",
      en: "Fixed desks, where the monitor and keyboard stay put anyway.",
    },
  },
  {
    id: "skaerme",
    name: { da: "Skærme", en: "Monitors" },
    description: {
      da: "Erhvervsskærme med matte paneler, højdejustering og rigtige tilslutninger.",
      en: "Business monitors with matte panels, height adjustment and proper connectors.",
    },
  },
  {
    id: "docking",
    name: { da: "Dockingstationer", en: "Docking stations" },
    description: {
      da: "Ét kabel til skærme, netværk og strøm – vælg den, der passer til jeres maskiner.",
      en: "One cable for monitors, network and power — pick the one that fits your machines.",
    },
  },
];

export const models: Model[] = [
  {
    slug: "lenovo-thinkpad-t480",
    name: "Lenovo ThinkPad T480",
    brand: "Lenovo",
    format: { da: '14" bærbar', en: '14" laptop' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "Arbejdshesten i T-serien – robust, reparerbar og nem at opgradere.",
      en: "The workhorse of the T series — sturdy, repairable and easy to upgrade.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T480 til erhverv | Kestro",
      en: "Used Lenovo ThinkPad T480 for business | Kestro",
    },
    metaDescription: {
      da: "ThinkPad T480 som brugt erhvervsbærbar: specifikationer, hvad den egner sig til, og hvad man skal være opmærksom på. Vi sourcer den til den enkelte ordre.",
      en: "The ThinkPad T480 as a used business laptop: specifications, what it suits, and what to watch out for. We source it per order.",
    },
    intro: {
      da: "T480 er den model, vi oftest bliver spurgt om, og med god grund. Den er bygget til at blive slæbt rundt hver dag, delene er lette at skaffe, og den kan udvides i stedet for at blive skiftet ud. For almindeligt kontorarbejde er den stadig rigeligt hurtig mange år efter, den kom på markedet.",
      en: "The T480 is the model we get asked about most, and for good reason. It is built to be carried every day, parts are easy to get hold of, and it can be expanded instead of replaced. For ordinary office work it is still plenty fast, years after it was released.",
    },
    goodFor: [
      { da: "Kontor, administration og sagsbehandling", en: "Office, administration and casework" },
      {
        da: "Medarbejdere, der pendler med maskinen hver dag",
        en: "Staff who commute with the machine every day",
      },
      {
        da: "Flåder, hvor alle skal have præcis den samme maskine",
        en: "Fleets where everyone needs exactly the same machine",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Lenovo ThinkPad T480 – 14" erhvervsbærbar',
          en: 'Lenovo ThinkPad T480 — 14" business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5-8350U eller i7-8650U (8. generation) – 4 kerner / 8 tråde, 1,7–3,6 GHz, 6 MB cache",
          en: "Intel Core i5-8350U or i7-8650U (8th generation) — 4 cores / 8 threads, 1.7–3.6 GHz, 6 MB cache",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "8 GB DDR4 – kan udvides til 32 GB", en: "8 GB DDR4 — expandable to 32 GB" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256 GB M.2 SSD – kan udskiftes eller gøres større",
          en: "256 GB M.2 SSD — replaceable or upgradable",
        },
      },
      {
        label: { da: "Grafik", en: "Graphics" },
        value: {
          da: "Intel UHD Graphics 620 (integreret)",
          en: "Intel UHD Graphics 620 (integrated)",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: {
          da: '14" LED med antirefleks – HD (1366×768) eller Full HD (1920×1080)',
          en: '14" anti-glare LED — HD (1366×768) or Full HD (1920×1080)',
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "2× USB 3.0, USB-C og Thunderbolt 3 (begge med opladning og skærmudgang), HDMI, dockstik, Gigabit-netværk, kortlæser og combo-jack",
          en: "2× USB 3.0, USB-C and Thunderbolt 3 (both with charging and display output), HDMI, dock connector, Gigabit Ethernet, card reader and combo jack",
        },
      },
      {
        label: { da: "Trådløst", en: "Wireless" },
        value: { da: "Wi-Fi og Bluetooth", en: "Wi-Fi and Bluetooth" },
      },
      {
        label: { da: "Kamera og lyd", en: "Camera and audio" },
        value: {
          da: "Webcam, højttalere og mikrofon",
          en: "Webcam, speakers and microphone",
        },
      },
      {
        label: { da: "Tastatur", en: "Keyboard" },
        value: {
          da: "Fuldt tastatur med trackpoint og fingeraftrykslæser – baggrundslys som tilvalg, layout kan skiftes til dansk eller norsk",
          en: "Full keyboard with TrackPoint and fingerprint reader — backlight optional, layout can be changed to Danish or Norwegian",
        },
      },
      {
        label: { da: "Optisk drev", en: "Optical drive" },
        value: { da: "Nej", en: "No" },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Skærmen findes både som HD og Full HD. Skal maskinen bruges hele dagen, så bed om Full HD – forskellen mærkes.",
        en: "The screen comes as both HD and Full HD. If the machine is used all day, ask for Full HD — the difference is noticeable.",
      },
      {
        da: "8. generation er rigelig til kontorarbejde, men ikke til tung billed- eller videoredigering. Til det peger vi på en workstation.",
        en: "An 8th-generation processor is plenty for office work, but not for heavy photo or video editing. For that we point at a workstation.",
      },
    ],
    why: [
      {
        title: { da: "Bygget til at blive slæbt rundt", en: "Built to be carried around" },
        description: {
          da: "Kabinet, hængsler og tastatur er lavet til daglig transport. Det er den samme maskintype, mange virksomheder og offentlige arbejdspladser selv har kørt på i årevis.",
          en: "Chassis, hinges and keyboard are made for daily transport. It is the same class of machine many companies and public workplaces ran on themselves for years.",
        },
      },
      {
        title: { da: "Reservedele er til at skaffe", en: "Spare parts are easy to find" },
        description: {
          da: "Lenovo udgiver servicemanualer til T-serien, og delene er stadig lette at få fat i. En defekt skærm, et batteri eller et tastatur bliver en reparation i stedet for en ny maskine.",
          en: "Lenovo publishes service manuals for the T series, and the parts are still easy to get. A broken screen, a battery or a keyboard becomes a repair instead of a new machine.",
        },
      },
      {
        title: {
          da: "Kan opgraderes i stedet for udskiftes",
          en: "Upgradable instead of replaceable",
        },
        description: {
          da: "Maskinen kan udvides med mere hukommelse, og SSD'en kan skiftes eller gøres større. Skal den holde et par år mere, er det en billig opgradering frem for et nyt indkøb.",
          en: "The machine takes more memory, and the SSD can be swapped or made larger. If it has to last another couple of years, that is a cheap upgrade rather than a new purchase.",
        },
      },
      {
        title: {
          da: "Tastaturet kan skiftes til nordisk layout",
          en: "The keyboard can be changed to a Nordic layout",
        },
        description: {
          da: "Derfor kan vi levere sydeuropæiske maskiner med dansk eller norsk tastatur, uden at det ser eftermonteret ud.",
          en: "That is how we can deliver southern European machines with a Danish or Norwegian keyboard without it looking retrofitted.",
        },
      },
      {
        title: { da: "Én type dock til hele flåden", en: "One dock for the whole fleet" },
        description: {
          da: "Med Thunderbolt 3 og ThinkPads eget dockstik kan I køre den samme dockingstation på tværs af arbejdspladserne i stedet for en løsning per maskine.",
          en: "With Thunderbolt 3 and ThinkPad's own dock connector you can run the same docking station across every desk instead of one solution per machine.",
        },
      },
      {
        title: {
          da: "Batteriet kan skiftes på stedet",
          en: "The battery can be swapped on the spot",
        },
        description: {
          da: "T480 har både et internt og et eksternt batteri. Det eksterne kan skiftes uden værktøj, og batteriet er en billig del at skifte.",
          en: "The T480 has both an internal and an external battery. The external one can be changed without tools, and the battery is a cheap part to replace.",
        },
      },
    ],
    images: [
      {
        src: "/thinkpad-t480-6.jpg",
        alt: {
          da: "Lenovo ThinkPad T480 set forfra med Windows installeret og klar til brug",
          en: "Lenovo ThinkPad T480 seen from the front with Windows installed and ready to use",
        },
      },
      {
        src: "/thinkpad-t480-7.jpg",
        alt: {
          da: "Tastaturet på ThinkPad T480 set oppefra med trackpoint og fingeraftrykslæser",
          en: "The ThinkPad T480 keyboard from above, with TrackPoint and fingerprint reader",
        },
      },
      {
        src: "/thinkpad-t480-4.jpg",
        alt: {
          da: 'ThinkPad T480 åbnet i vinkel med 14" skærmen tændt',
          en: 'ThinkPad T480 open at an angle with the 14" screen switched on',
        },
      },
      {
        src: "/thinkpad-t480-8.jpg",
        alt: {
          da: "Portene i siden af ThinkPad T480: hovedtelefonstik, USB-A, HDMI, netværk og kortlæser",
          en: "The ports along the side of the ThinkPad T480: headphone jack, USB-A, HDMI, Ethernet and card reader",
        },
      },
      {
        src: "/thinkpad-t480-2.jpg",
        alt: {
          da: "Bagsiden af ThinkPad T480 med ThinkPad-logo og porte i siden",
          en: "The back of the ThinkPad T480 with the ThinkPad logo and the side ports",
        },
      },
      {
        src: "/thinkpad-t480-3.jpg",
        alt: {
          da: "ThinkPad T480 set skråt oppefra med tastatur og trackpoint",
          en: "ThinkPad T480 from above at an angle, showing keyboard and TrackPoint",
        },
      },
      {
        src: "/thinkpad-t480-1.jpg",
        alt: {
          da: "ThinkPad T480 set fra siden, næsten lukket, med portene synlige",
          en: "ThinkPad T480 from the side, almost closed, with the ports visible",
        },
      },
    ],
  },
  {
    slug: "lenovo-thinkpad-t14",
    name: "Lenovo ThinkPad T14",
    brand: "Lenovo",
    format: { da: '14" bærbar', en: '14" laptop' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "Efterfølgeren til T480 – nyere processor, samme robusthed.",
      en: "The successor to the T480 — newer processor, same sturdiness.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad T14 til erhverv | Kestro",
      en: "Used Lenovo ThinkPad T14 for business | Kestro",
    },
    metaDescription: {
      da: "ThinkPad T14 (Gen 1 og 2) som brugt erhvervsbærbar: specifikationer, forskellen på Intel og AMD, og hvad den egner sig til. Sourcet til jeres ordre.",
      en: "The ThinkPad T14 (Gen 1 and 2) as a used business laptop: specifications, the difference between Intel and AMD, and what it suits. Sourced for your order.",
    },
    intro: {
      da: "T14 er det, T480 blev til. Samme grundidé – erhvervskabinet, godt tastatur, dele der kan skaffes – men med nyere processorer og en tyndere maskine. Den findes både med Intel og med AMD Ryzen PRO, og de to varianter er ikke helt ens.",
      en: "The T14 is what the T480 turned into. Same idea — business chassis, good keyboard, parts you can get — but with newer processors in a thinner machine. It comes with either Intel or AMD Ryzen PRO, and the two are not quite the same.",
    },
    goodFor: [
      {
        da: "Virksomheder, der vil et par generationer nyere end T480",
        en: "Companies that want a couple of generations newer than the T480",
      },
      {
        da: "Blandet brug: kontor, møder og lettere billedarbejde",
        en: "Mixed use: office, meetings and lighter image work",
      },
      {
        da: "Arbejdspladser med Windows 11 som krav",
        en: "Workplaces where Windows 11 is a requirement",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Lenovo ThinkPad T14 (Gen 1 og Gen 2) – 14" erhvervsbærbar',
          en: 'Lenovo ThinkPad T14 (Gen 1 and Gen 2) — 14" business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5/i7 (10. eller 11. generation) eller AMD Ryzen 5/7 PRO – 4 til 8 kerner",
          en: "Intel Core i5/i7 (10th or 11th generation) or AMD Ryzen 5/7 PRO — 4 to 8 cores",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: {
          da: "8–16 GB DDR4 fra start, kan typisk udvides",
          en: "8–16 GB DDR4 to begin with, usually expandable",
        },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB NVMe SSD – kan udskiftes",
          en: "256–512 GB NVMe SSD — replaceable",
        },
      },
      {
        label: { da: "Grafik", en: "Graphics" },
        value: {
          da: "Integreret (Intel Iris Xe / UHD eller AMD Radeon)",
          en: "Integrated (Intel Iris Xe / UHD or AMD Radeon)",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: {
          da: '14" Full HD med antirefleks, enkelte med berøringsskærm',
          en: '14" anti-glare Full HD, some with a touchscreen',
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "USB-C, 2× USB-A, HDMI, Gigabit-netværk, kortlæser og combo-jack",
          en: "USB-C, 2× USB-A, HDMI, Gigabit Ethernet, card reader and combo jack",
        },
      },
      {
        label: { da: "Vægt", en: "Weight" },
        value: { da: "Omkring 1,5 kg", en: "Around 1.5 kg" },
      },
      {
        label: { da: "Tastatur", en: "Keyboard" },
        value: {
          da: "Fuldt tastatur med trackpoint og fingeraftrykslæser – layout kan skiftes til nordisk",
          en: "Full keyboard with TrackPoint and fingerprint reader — layout can be changed to Nordic",
        },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 11 installeret med drivere",
          en: "Windows 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "AMD-modellerne giver flere kerner for pengene. Intel-modellerne har Thunderbolt og dermed flere dockingmuligheder – vælg efter hvilke docks I allerede har.",
        en: "The AMD models give you more cores for the money. The Intel models have Thunderbolt and therefore more docking options — choose based on the docks you already own.",
      },
      {
        da: "Gen 1 og Gen 2 ligner hinanden udvendigt. Skal maskinerne kunne mere end kontorarbejde, så bed om Gen 2 med Iris Xe-grafik.",
        en: "Gen 1 and Gen 2 look alike from the outside. If the machines need to do more than office work, ask for Gen 2 with Iris Xe graphics.",
      },
    ],
  },
  {
    slug: "lenovo-thinkpad-x1-carbon",
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    format: { da: '14" ultralet', en: '14" ultralight' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "Godt et kilo – til dem, der rejser med maskinen.",
      en: "Just over a kilo — for people who travel with the machine.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad X1 Carbon til erhverv | Kestro",
      en: "Used Lenovo ThinkPad X1 Carbon for business | Kestro",
    },
    metaDescription: {
      da: "ThinkPad X1 Carbon som brugt erhvervsbærbar: let kabinet, kraftig skærm og hvad man skal vide om loddet hukommelse. Sourcet til jeres ordre.",
      en: "The ThinkPad X1 Carbon as a used business laptop: light chassis, strong screen, and what to know about soldered memory. Sourced for your order.",
    },
    intro: {
      da: "X1 Carbon er ThinkPad-serien skåret ned til godt et kilo uden at give køb på tastatur eller skærm. Den er til sælgere, konsulenter og ledelse – dem der har maskinen i tasken hver uge. Til gengæld er den mindre fleksibel end T-serien, og det skal med i beslutningen.",
      en: "The X1 Carbon is the ThinkPad line cut down to just over a kilo without giving up the keyboard or the screen. It is for sales people, consultants and management — those who have the machine in a bag every week. In return it is less flexible than the T series, and that belongs in the decision.",
    },
    goodFor: [
      {
        da: "Medarbejdere, der rejser eller pendler meget",
        en: "Staff who travel or commute a lot",
      },
      { da: "Salg, rådgivning og ledelse", en: "Sales, advisory work and management" },
      {
        da: "Arbejdspladser, hvor maskinen mest kører i en dock",
        en: "Desks where the machine mostly sits in a dock",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Lenovo ThinkPad X1 Carbon (Gen 6–8) – 14" ultralet erhvervsbærbar',
          en: 'Lenovo ThinkPad X1 Carbon (Gen 6–8) — 14" ultralight business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5/i7 (8.–10. generation), strømbesparende U-serie",
          en: "Intel Core i5/i7 (8th–10th generation), low-power U series",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: {
          da: "8 eller 16 GB – loddet fast fra fabrikken",
          en: "8 or 16 GB — soldered at the factory",
        },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256 GB–1 TB NVMe SSD – kan udskiftes",
          en: "256 GB–1 TB NVMe SSD — replaceable",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: {
          da: '14" Full HD eller WQHD med antirefleks',
          en: '14" anti-glare Full HD or WQHD',
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "2× Thunderbolt 3, 2× USB-A, HDMI og combo-jack",
          en: "2× Thunderbolt 3, 2× USB-A, HDMI and combo jack",
        },
      },
      {
        label: { da: "Vægt", en: "Weight" },
        value: { da: "Omkring 1,1–1,2 kg", en: "Around 1.1–1.2 kg" },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Hukommelsen er loddet fast og kan ikke udvides senere. Vælg 16 GB fra start, hvis maskinen skal holde nogle år.",
        en: "The memory is soldered and cannot be expanded later. Choose 16 GB from the start if the machine has to last a few years.",
      },
      {
        da: "Der er ikke netværksstik i maskinen. Skal den på kabel, kræver det den medfølgende adapter eller en dock – husk at bestille dem med.",
        en: "There is no Ethernet port on the machine. Wired networking needs the supplied adapter or a dock — remember to order them too.",
      },
    ],
  },
  {
    slug: "lenovo-thinkpad-l14",
    name: "Lenovo ThinkPad L14",
    brand: "Lenovo",
    format: { da: '14" bærbar', en: '14" laptop' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "Erhvervsmaskine til det stramme budget.",
      en: "A business machine for a tight budget.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad L14 til erhverv | Kestro",
      en: "Used Lenovo ThinkPad L14 for business | Kestro",
    },
    metaDescription: {
      da: "ThinkPad L14 som brugt erhvervsbærbar: samme tastatur og porte som T-serien til en lavere pris. Sourcet til den enkelte ordre.",
      en: "The ThinkPad L14 as a used business laptop: the same keyboard and ports as the T series at a lower price. Sourced per order.",
    },
    intro: {
      da: "L-serien er ThinkPad uden det dyre kabinet. Tastatur, porte og opgraderingsmuligheder følger stort set T-serien, men chassiset er enklere, og prisen ligger under. Skal I have mange maskiner ud på én gang, er det ofte her, regnestykket går op.",
      en: "The L series is a ThinkPad without the expensive chassis. Keyboard, ports and upgrade options largely follow the T series, but the shell is simpler and the price is lower. When many machines have to go out at once, this is often where the maths works.",
    },
    goodFor: [
      {
        da: "Store leverancer, hvor prisen per arbejdsplads afgør",
        en: "Large deliveries where the price per desk decides",
      },
      {
        da: "Faste arbejdspladser og skiftende brugere",
        en: "Fixed desks and rotating users",
      },
      { da: "Uddannelse, produktion og lager", en: "Education, production and warehousing" },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Lenovo ThinkPad L14 – 14" erhvervsbærbar',
          en: 'Lenovo ThinkPad L14 — 14" business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5/i7 (10. eller 11. generation) eller AMD Ryzen PRO",
          en: "Intel Core i5/i7 (10th or 11th generation) or AMD Ryzen PRO",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "8–16 GB DDR4, kan udvides", en: "8–16 GB DDR4, expandable" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB NVMe SSD – kan udskiftes",
          en: "256–512 GB NVMe SSD — replaceable",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: { da: '14" Full HD med antirefleks', en: '14" anti-glare Full HD' },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "USB-C, 2× USB-A, HDMI, Gigabit-netværk og combo-jack",
          en: "USB-C, 2× USB-A, HDMI, Gigabit Ethernet and combo jack",
        },
      },
      {
        label: { da: "Tastatur", en: "Keyboard" },
        value: {
          da: "Fuldt ThinkPad-tastatur med trackpoint – layout kan skiftes til nordisk",
          en: "Full ThinkPad keyboard with TrackPoint — layout can be changed to Nordic",
        },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Kabinettet er plast frem for magnesium som i T-serien. Den tåler almindelig kontorbrug fint, men er ikke bygget til det samme slid.",
        en: "The shell is plastic rather than the magnesium used in the T series. It handles normal office use fine, but it is not built for the same wear.",
      },
      {
        da: "Lidt tungere end en T14 – mærkes hvis maskinen skal med i tasken hver dag.",
        en: "A little heavier than a T14 — noticeable if the machine goes in a bag every day.",
      },
    ],
  },
  {
    slug: "hp-elitebook-840",
    name: "HP EliteBook 840",
    brand: "HP",
    format: { da: '14" bærbar', en: '14" laptop' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "HP's svar på T-serien – tynd, udbredt og nem at få dele til.",
      en: "HP's answer to the T series — thin, common and easy to get parts for.",
    },
    metaTitle: {
      da: "Brugt HP EliteBook 840 til erhverv | Kestro",
      en: "Used HP EliteBook 840 for business | Kestro",
    },
    metaDescription: {
      da: "HP EliteBook 840 (G5 og G6) som brugt erhvervsbærbar: specifikationer, hukommelse i to sokler og hvad Sure View betyder. Sourcet til jeres ordre.",
      en: "The HP EliteBook 840 (G5 and G6) as a used business laptop: specifications, memory in two slots, and what Sure View means. Sourced for your order.",
    },
    intro: {
      da: "EliteBook 840 er en af de mest udbredte erhvervsbærbare i Europa, og netop derfor er den nem at skaffe i antal og til en fornuftig pris. Den har to hukommelsessokler, hvilket gør den billig at opgradere, og et fladt kabinet der fylder lidt mindre i tasken end T-serien.",
      en: "The EliteBook 840 is one of the most common business laptops in Europe, which is exactly why it is easy to source in numbers at a sensible price. It has two memory slots, which makes it cheap to upgrade, and a flat chassis that takes slightly less room in a bag than the T series.",
    },
    goodFor: [
      {
        da: "Kontor og administration i alle størrelser",
        en: "Office and administration at any size",
      },
      {
        da: "Leverancer, hvor mange ens maskiner skal skaffes hurtigt",
        en: "Deliveries where many identical machines are needed quickly",
      },
      { da: "Arbejdspladser med HP-docks i forvejen", en: "Workplaces that already have HP docks" },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'HP EliteBook 840 (G5 og G6) – 14" erhvervsbærbar',
          en: 'HP EliteBook 840 (G5 and G6) — 14" business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5 eller i7 (8. generation), 4 kerner / 8 tråde",
          en: "Intel Core i5 or i7 (8th generation), 4 cores / 8 threads",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: {
          da: "8–32 GB DDR4 i to sokler – nem at udvide",
          en: "8–32 GB DDR4 across two slots — easy to expand",
        },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB NVMe SSD – kan udskiftes",
          en: "256–512 GB NVMe SSD — replaceable",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: {
          da: '14" Full HD med antirefleks – findes også med berøringsskærm eller Sure View',
          en: '14" anti-glare Full HD — also available with a touchscreen or Sure View',
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "2× USB-A, USB-C, HDMI, Gigabit-netværk og combo-jack",
          en: "2× USB-A, USB-C, HDMI, Gigabit Ethernet and combo jack",
        },
      },
      {
        label: { da: "Vægt", en: "Weight" },
        value: { da: "Omkring 1,5 kg", en: "Around 1.5 kg" },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Nogle modeller har Sure View, et indbygget privatlivsfilter. Det er godt i toget, men gør skærmen mørkere på kontoret – vælg bevidst.",
        en: "Some models have Sure View, a built-in privacy filter. Good on a train, but it makes the screen darker in the office — choose deliberately.",
      },
      {
        da: "Tastaturet har ikke trackpoint. Kommer medarbejderne fra ThinkPad, er det den største omvænning.",
        en: "The keyboard has no TrackPoint. If your staff are coming from ThinkPads, that is the biggest adjustment.",
      },
    ],
  },
  {
    slug: "hp-probook-450",
    name: "HP ProBook 450",
    brand: "HP",
    format: { da: '15,6" bærbar', en: '15.6" laptop' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "Stor skærm og numerisk tastatur til skrivebordet.",
      en: "A big screen and a number pad, for the desk.",
    },
    metaTitle: {
      da: "Brugt HP ProBook 450 til erhverv | Kestro",
      en: "Used HP ProBook 450 for business | Kestro",
    },
    metaDescription: {
      da: 'HP ProBook 450 som brugt erhvervsbærbar: 15,6" skærm, numerisk tastatur og plads til udvidelser. Sourcet til den enkelte ordre.',
      en: 'The HP ProBook 450 as a used business laptop: 15.6" screen, number pad and room to expand. Sourced per order.',
    },
    intro: {
      da: 'ProBook 450 er den store bærbare til dem, der arbejder i regneark og systemer hele dagen. 15,6" skærm og numerisk tastatur gør en mærkbar forskel i bogholderi, ordrestyring og support – og prisen ligger under en tilsvarende EliteBook.',
      en: 'The ProBook 450 is the big laptop for people who live in spreadsheets and back-office systems all day. A 15.6" screen and a number pad make a real difference in bookkeeping, order handling and support — and the price sits below a comparable EliteBook.',
    },
    goodFor: [
      { da: "Bogholderi, løn og ordrestyring", en: "Bookkeeping, payroll and order handling" },
      {
        da: "Support og back office med faste arbejdspladser",
        en: "Support and back office at fixed desks",
      },
      {
        da: "Brugere, der har brug for numerisk tastatur",
        en: "People who need a number pad",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'HP ProBook 450 (G7 og G8) – 15,6" erhvervsbærbar',
          en: 'HP ProBook 450 (G7 and G8) — 15.6" business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5 eller i7 (10. eller 11. generation)",
          en: "Intel Core i5 or i7 (10th or 11th generation)",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "8–32 GB DDR4 i to sokler", en: "8–32 GB DDR4 across two slots" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB NVMe SSD – kan udskiftes",
          en: "256–512 GB NVMe SSD — replaceable",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: { da: '15,6" Full HD med antirefleks', en: '15.6" anti-glare Full HD' },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "USB-C, 2× USB-A, HDMI, Gigabit-netværk og combo-jack",
          en: "USB-C, 2× USB-A, HDMI, Gigabit Ethernet and combo jack",
        },
      },
      {
        label: { da: "Tastatur", en: "Keyboard" },
        value: {
          da: "Fuldt tastatur med numerisk del – layout kan skiftes til nordisk",
          en: "Full keyboard with number pad — layout can be changed to Nordic",
        },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: 'Tungere end en 14" og bygget lidt enklere end EliteBook. Bedst til en fast arbejdsplads frem for daglig pendling.',
        en: 'Heavier than a 14" and built a little more simply than an EliteBook. Best at a fixed desk rather than commuting daily.',
      },
      {
        da: "Batteritiden er kortere end på de små modeller – regn med en strømforsyning ved skrivebordet.",
        en: "Battery life is shorter than on the smaller models — count on a power supply staying at the desk.",
      },
    ],
  },
  {
    slug: "dell-latitude-5410",
    name: "Dell Latitude 5410",
    brand: "Dell",
    format: { da: '14" bærbar', en: '14" laptop' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "Dells arbejdsmaskine – to hukommelsessokler og alle porte i behold.",
      en: "Dell's workhorse — two memory slots and every port still there.",
    },
    metaTitle: {
      da: "Brugt Dell Latitude 5410 til erhverv | Kestro",
      en: "Used Dell Latitude 5410 for business | Kestro",
    },
    metaDescription: {
      da: "Dell Latitude 5410 og 5420 som brugt erhvervsbærbar: specifikationer, hukommelse i to sokler og fuldt portudvalg. Sourcet til jeres ordre.",
      en: "The Dell Latitude 5410 and 5420 as used business laptops: specifications, memory in two slots and a full set of ports. Sourced for your order.",
    },
    intro: {
      da: 'Latitude 5000-serien er Dells svar på T-serien og EliteBook: en 14" erhvervsmaskine, der er lavet til at blive serviceret. To hukommelsessokler, netværksstik, HDMI og USB-C – den kan sættes ind i næsten enhver opsætning uden adaptere.',
      en: "The Latitude 5000 series is Dell's answer to the T series and the EliteBook: a 14\" business machine made to be serviced. Two memory slots, Ethernet, HDMI and USB-C — it drops into almost any setup without adapters.",
    },
    goodFor: [
      { da: "Kontor og administration", en: "Office and administration" },
      {
        da: "Virksomheder med Dell-udstyr i forvejen",
        en: "Companies that already run Dell hardware",
      },
      {
        da: "Arbejdspladser, hvor maskinen skal kunne opgraderes undervejs",
        en: "Workplaces where the machine has to be upgradable along the way",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Dell Latitude 5410 og 5420 – 14" erhvervsbærbar',
          en: 'Dell Latitude 5410 and 5420 — 14" business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5 eller i7 (10. eller 11. generation)",
          en: "Intel Core i5 or i7 (10th or 11th generation)",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "8–64 GB DDR4 i to sokler", en: "8–64 GB DDR4 across two slots" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB NVMe SSD – kan udskiftes",
          en: "256–512 GB NVMe SSD — replaceable",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: { da: '14" Full HD med antirefleks', en: '14" anti-glare Full HD' },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "USB-C, 2× USB-A, HDMI, Gigabit-netværk, combo-jack – smartkortlæser på nogle modeller",
          en: "USB-C, 2× USB-A, HDMI, Gigabit Ethernet, combo jack — smart card reader on some models",
        },
      },
      {
        label: { da: "Vægt", en: "Weight" },
        value: { da: "Omkring 1,5 kg", en: "Around 1.5 kg" },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Skal maskinerne bruge smartkort eller kortlæser til medarbejderkort, skal det bestilles bevidst – ikke alle modeller har det.",
        en: "If the machines need a smart card reader for staff cards, it has to be ordered deliberately — not every model has one.",
      },
      {
        da: "Dells docks bruger USB-C. Har I ældre E-Port-docks fra Dell, passer de ikke til denne generation.",
        en: "Dell's docks use USB-C. Older Dell E-Port docks do not fit this generation.",
      },
    ],
  },
  {
    slug: "dell-latitude-7490",
    name: "Dell Latitude 7490",
    brand: "Dell",
    format: { da: '14" bærbar', en: '14" laptop' },
    group: "baerbare",
    category: "baerbare-computere",
    tagline: {
      da: "Den lette Latitude – premium-kabinet, fuldt portudvalg.",
      en: "The light Latitude — premium chassis, full set of ports.",
    },
    metaTitle: {
      da: "Brugt Dell Latitude 7490 til erhverv | Kestro",
      en: "Used Dell Latitude 7490 for business | Kestro",
    },
    metaDescription: {
      da: "Dell Latitude 7490 som brugt erhvervsbærbar: let kabinet, lang batteritid og alle porte i behold. Sourcet til den enkelte ordre.",
      en: "The Dell Latitude 7490 as a used business laptop: light chassis, long battery life and every port still there. Sourced per order.",
    },
    intro: {
      da: "7000-serien er Latitude i den pæne udgave: lettere kabinet, bedre skærm og længere batteritid end 5000-serien, men stadig med netværksstik og HDMI direkte i maskinen. Et godt kompromis mellem en X1 Carbon og en almindelig arbejdsbærbar.",
      en: "The 7000 series is the smarter Latitude: lighter chassis, better screen and longer battery life than the 5000 series, but still with Ethernet and HDMI on the machine itself. A good middle ground between an X1 Carbon and an ordinary work laptop.",
    },
    goodFor: [
      {
        da: "Medarbejdere, der både sidder ved skrivebordet og er ude",
        en: "Staff who are both at a desk and out of the office",
      },
      {
        da: "Salg og rådgivning uden behov for det letteste kabinet",
        en: "Sales and advisory work that does not need the very lightest chassis",
      },
      { da: "Flåder, hvor batteritid vejer tungt", en: "Fleets where battery life matters a lot" },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Dell Latitude 7490 – 14" erhvervsbærbar',
          en: 'Dell Latitude 7490 — 14" business laptop',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5 eller i7 (8. generation), 4 kerner / 8 tråde",
          en: "Intel Core i5 or i7 (8th generation), 4 cores / 8 threads",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "8–32 GB DDR4 i to sokler", en: "8–32 GB DDR4 across two slots" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB NVMe SSD – kan udskiftes",
          en: "256–512 GB NVMe SSD — replaceable",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: { da: '14" Full HD med antirefleks', en: '14" anti-glare Full HD' },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "USB-C/Thunderbolt, 2× USB-A, HDMI, Gigabit-netværk og combo-jack",
          en: "USB-C/Thunderbolt, 2× USB-A, HDMI, Gigabit Ethernet and combo jack",
        },
      },
      {
        label: { da: "Vægt", en: "Weight" },
        value: { da: "Omkring 1,4 kg", en: "Around 1.4 kg" },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "8. generation er stadig fin til kontorarbejde, men skal maskinerne holde længe, er en 5420 eller T14 et par år nyere.",
        en: "An 8th-generation processor is still fine for office work, but if the machines have to last, a 5420 or a T14 is a couple of years newer.",
      },
      {
        da: "Findes med både berøringsskærm og almindelig skærm – berøringsskærmen spejler mere i lyse lokaler.",
        en: "Available with both a touchscreen and a normal screen — the touchscreen reflects more in bright rooms.",
      },
    ],
  },
  {
    slug: "hp-zbook-15",
    name: "HP ZBook 15",
    brand: "HP",
    format: { da: '15,6" mobil workstation', en: '15.6" mobile workstation' },
    group: "workstations",
    category: "baerbare-computere",
    tagline: {
      da: "Til CAD, 3D og videoredigering ude hos kunden.",
      en: "For CAD, 3D and video editing out at the client.",
    },
    metaTitle: {
      da: "Brugt HP ZBook 15 mobil workstation til erhverv | Kestro",
      en: "Used HP ZBook 15 mobile workstation for business | Kestro",
    },
    metaDescription: {
      da: "HP ZBook 15 som brugt mobil workstation: dedikeret Quadro-grafik, mange kerner og plads til flere diske. Sourcet til den enkelte ordre.",
      en: "The HP ZBook 15 as a used mobile workstation: dedicated Quadro graphics, plenty of cores and room for several drives. Sourced per order.",
    },
    intro: {
      da: "ZBook er ikke en kontormaskine, og det skal den heller ikke være. Den har dedikeret grafik, processorer med flere kerner og plads til flere diske – til tegnestuer, ingeniører og produktionsvirksomheder, hvor programmerne stiller reelle krav.",
      en: "The ZBook is not an office machine, and it is not meant to be. It has dedicated graphics, processors with more cores and room for several drives — for design studios, engineers and manufacturers whose software makes real demands.",
    },
    goodFor: [
      { da: "CAD, BIM og 3D-modellering", en: "CAD, BIM and 3D modelling" },
      { da: "Video- og billedredigering", en: "Video and image editing" },
      {
        da: "Ingeniør- og analysearbejde med tunge datasæt",
        en: "Engineering and analysis work with heavy datasets",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'HP ZBook 15 (G5 og G6) – 15,6" mobil workstation',
          en: 'HP ZBook 15 (G5 and G6) — 15.6" mobile workstation',
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i7 (6 kerner) eller Xeon – H-serie med højere ydelse end kontormodeller",
          en: "Intel Core i7 (6 cores) or Xeon — H series, faster than office models",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "16–64 GB DDR4 i flere sokler", en: "16–64 GB DDR4 across several slots" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "512 GB–2 TB NVMe SSD – plads til flere diske",
          en: "512 GB–2 TB NVMe SSD — room for several drives",
        },
      },
      {
        label: { da: "Grafik", en: "Graphics" },
        value: {
          da: "NVIDIA Quadro P1000 eller P2000 (dedikeret)",
          en: "NVIDIA Quadro P1000 or P2000 (dedicated)",
        },
      },
      {
        label: { da: "Skærm", en: "Display" },
        value: { da: '15,6" Full HD eller 4K', en: '15.6" Full HD or 4K' },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "Thunderbolt 3, USB-A, HDMI, Gigabit-netværk og kortlæser",
          en: "Thunderbolt 3, USB-A, HDMI, Gigabit Ethernet and card reader",
        },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Vejer over 2,5 kg og har en stor strømforsyning. Det er en maskine til et skrivebord og en bil – ikke til toget.",
        en: "It weighs over 2.5 kg and comes with a large power supply. This is a machine for a desk and a car — not for the train.",
      },
      {
        da: "Kør en test med jeres eget program, før I bestiller mange. Licenskrav og grafikcertificering varierer mellem CAD-programmer.",
        en: "Test one with your own software before ordering many. Licence requirements and graphics certification vary between CAD packages.",
      },
    ],
  },
  {
    slug: "hp-elitedesk-800",
    name: "HP EliteDesk 800",
    brand: "HP",
    format: { da: "Stationær (SFF)", en: "Desktop (SFF)" },
    group: "stationaere",
    category: "stationaere-computere",
    tagline: {
      da: "Klassisk kontor-pc med plads til at vokse.",
      en: "A classic office PC with room to grow.",
    },
    metaTitle: {
      da: "Brugt HP EliteDesk 800 til erhverv | Kestro",
      en: "Used HP EliteDesk 800 for business | Kestro",
    },
    metaDescription: {
      da: "HP EliteDesk 800 som brugt stationær erhvervs-pc: desktop-processor, fire hukommelsessokler og plads til udvidelser. Sourcet til jeres ordre.",
      en: "The HP EliteDesk 800 as a used business desktop: a desktop processor, four memory slots and room to expand. Sourced for your order.",
    },
    intro: {
      da: "EliteDesk 800 er den faste arbejdsplads, hvor der ikke skal spares på ydelsen. Den bruger rigtige desktop-processorer frem for bærbar-varianter, har fire hukommelsessokler og plads til både SSD og harddisk. Skal maskinen holde længe, er det den nemmeste at udvide.",
      en: "The EliteDesk 800 is for the fixed desk where performance should not be the compromise. It uses real desktop processors rather than laptop parts, has four memory slots and room for both an SSD and a hard drive. If the machine has to last, this is the easiest one to expand.",
    },
    goodFor: [
      { da: "Faste kontorarbejdspladser", en: "Fixed office desks" },
      {
        da: "Receptioner, kasser og produktionslokaler",
        en: "Reception desks, tills and production areas",
      },
      { da: "Arbejdspladser med to eller tre skærme", en: "Desks running two or three monitors" },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: "HP EliteDesk 800 (G4 og G5) – stationær i SFF-kabinet",
          en: "HP EliteDesk 800 (G4 and G5) — desktop in an SFF case",
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5-8500 eller i7-8700 (8. generation) – 6 kerner, desktop-udgave",
          en: "Intel Core i5-8500 or i7-8700 (8th generation) — 6 cores, desktop version",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "8–64 GB DDR4 i fire sokler", en: "8–64 GB DDR4 across four slots" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB SSD – plads til ekstra disk",
          en: "256–512 GB SSD — room for an extra drive",
        },
      },
      {
        label: { da: "Grafik", en: "Graphics" },
        value: {
          da: "Integreret – kan udvides med grafikkort i SFF-kabinettet",
          en: "Integrated — a graphics card can be added in the SFF case",
        },
      },
      {
        label: { da: "Skærmudgange", en: "Display outputs" },
        value: {
          da: "DisplayPort og HDMI – understøtter flere skærme",
          en: "DisplayPort and HDMI — supports multiple monitors",
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "Flere USB-A og USB-C, Gigabit-netværk og lydudgange",
          en: "Several USB-A and USB-C, Gigabit Ethernet and audio outputs",
        },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "SFF-kabinettet er mindre end et almindeligt tårn. Grafikkort skal være i lavprofil-udgave – tjek det, hvis der skal sættes et i.",
        en: "The SFF case is smaller than an ordinary tower. A graphics card has to be a low-profile version — check that if one is going in.",
      },
      {
        da: "Skærme, tastatur og mus følger ikke med som standard. Skal arbejdspladsen være komplet, skal det med i tilbuddet.",
        en: "Monitors, keyboard and mouse are not included as standard. If the desk has to be complete, it has to be in the quote.",
      },
    ],
  },
  {
    slug: "lenovo-thinkcentre-m720q",
    name: "Lenovo ThinkCentre M720q Tiny",
    brand: "Lenovo",
    format: { da: "Mini-pc (1 liter)", en: "Mini PC (1 litre)" },
    group: "stationaere",
    category: "mini-pc",
    tagline: {
      da: "På størrelse med en bog – kan sidde bag skærmen.",
      en: "The size of a book — it can sit behind the monitor.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkCentre M720q Tiny mini-pc | Kestro",
      en: "Used Lenovo ThinkCentre M720q Tiny mini PC | Kestro",
    },
    metaDescription: {
      da: "ThinkCentre M720q Tiny som brugt mini-pc til erhverv: 1 liters kabinet, VESA-beslag og lavt strømforbrug. Sourcet til den enkelte ordre.",
      en: "The ThinkCentre M720q Tiny as a used business mini PC: a 1-litre case, VESA mount and low power draw. Sourced per order.",
    },
    intro: {
      da: "M720q fylder omkring en liter og kan monteres bag skærmen med et VESA-beslag. Den giver en ryddelig arbejdsplads, bruger lidt strøm og støjer næsten ikke – og til almindeligt kontorarbejde mærker man ikke, at den er lille.",
      en: "The M720q takes up about a litre and can be mounted behind the monitor with a VESA bracket. It gives you a tidy desk, uses little power and is almost silent — and for ordinary office work you never notice how small it is.",
    },
    goodFor: [
      {
        da: "Åbne kontorlandskaber og rene skriveborde",
        en: "Open-plan offices and clear desks",
      },
      {
        da: "Receptioner, mødelokaler og infoskærme",
        en: "Reception desks, meeting rooms and information screens",
      },
      {
        da: "Arbejdspladser, hvor støj og strømforbrug tæller",
        en: "Desks where noise and power consumption count",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: "Lenovo ThinkCentre M720q og M920q Tiny – mini-pc",
          en: "Lenovo ThinkCentre M720q and M920q Tiny — mini PC",
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i3, i5 eller i7 (8. eller 9. generation)",
          en: "Intel Core i3, i5 or i7 (8th or 9th generation)",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: { da: "8–32 GB DDR4 i to sokler", en: "8–32 GB DDR4 across two slots" },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: { da: "256–512 GB NVMe SSD", en: "256–512 GB NVMe SSD" },
      },
      {
        label: { da: "Skærmudgange", en: "Display outputs" },
        value: {
          da: "DisplayPort og HDMI – to skærme som standard",
          en: "DisplayPort and HDMI — two monitors as standard",
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "Flere USB-A, USB-C på nogle modeller, Gigabit-netværk",
          en: "Several USB-A, USB-C on some models, Gigabit Ethernet",
        },
      },
      {
        label: { da: "Montering", en: "Mounting" },
        value: {
          da: "VESA-beslag, så den kan sidde bag skærmen",
          en: "VESA bracket, so it can sit behind the monitor",
        },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Den bruger processorer fra bærbare. Det gør den stille og sparsom, men den er ikke til tunge beregninger eller 3D.",
        en: "It uses laptop processors. That makes it quiet and frugal, but it is not for heavy computation or 3D.",
      },
      {
        da: "VESA-beslag og strømforsyning mangler tit på brugte enheder – husk at få det med i aftalen.",
        en: "The VESA bracket and power supply are often missing from used units — make sure they are in the agreement.",
      },
    ],
  },
  {
    slug: "dell-optiplex-5060",
    name: "Dell OptiPlex 5060",
    brand: "Dell",
    format: { da: "Stationær (SFF og Micro)", en: "Desktop (SFF and Micro)" },
    group: "stationaere",
    category: "stationaere-computere",
    tagline: {
      da: "Samme maskine – vælg selv, om den skal fylde noget.",
      en: "The same machine — you decide how much room it takes.",
    },
    metaTitle: {
      da: "Brugt Dell OptiPlex 5060 til erhverv | Kestro",
      en: "Used Dell OptiPlex 5060 for business | Kestro",
    },
    metaDescription: {
      da: "Dell OptiPlex 5060 og 5070 som brugt stationær erhvervs-pc: fås som SFF og Micro med samme indmad. Sourcet til jeres ordre.",
      en: "The Dell OptiPlex 5060 and 5070 as used business desktops: available as SFF and Micro with the same internals. Sourced for your order.",
    },
    intro: {
      da: "OptiPlex 5000-serien findes i flere kabinetstørrelser med stort set samme indmad. Skal maskinen kunne udvides, tager man SFF-udgaven; skal den bare fylde mindst muligt, tager man Micro. Det gør det nemt at give hele huset samme maskine i forskellige former.",
      en: "The OptiPlex 5000 series comes in several case sizes with much the same internals. If the machine has to be expandable, take the SFF; if it just has to take up as little room as possible, take the Micro. That makes it easy to give the whole building the same machine in different shapes.",
    },
    goodFor: [
      {
        da: "Blandede arbejdspladser i samme virksomhed",
        en: "Mixed desk setups within the same company",
      },
      {
        da: "Udskiftning af ældre stationære uden at ændre opsætning",
        en: "Replacing older desktops without changing the setup",
      },
      {
        da: "Kontorer, der vil holde sig til én producent",
        en: "Offices that want to stay with one manufacturer",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: "Dell OptiPlex 5060 og 5070 – stationær i SFF eller Micro",
          en: "Dell OptiPlex 5060 and 5070 — desktop in SFF or Micro",
        },
      },
      {
        label: { da: "Processor", en: "Processor" },
        value: {
          da: "Intel Core i5 eller i7 (8. eller 9. generation), desktop-udgave",
          en: "Intel Core i5 or i7 (8th or 9th generation), desktop version",
        },
      },
      {
        label: { da: "Hukommelse", en: "Memory" },
        value: {
          da: "8–32 GB DDR4 – flere sokler i SFF-udgaven",
          en: "8–32 GB DDR4 — more slots in the SFF version",
        },
      },
      {
        label: { da: "Lagring", en: "Storage" },
        value: {
          da: "256–512 GB SSD – plads til ekstra disk i SFF",
          en: "256–512 GB SSD — room for an extra drive in the SFF",
        },
      },
      {
        label: { da: "Skærmudgange", en: "Display outputs" },
        value: {
          da: "DisplayPort og HDMI – understøtter flere skærme",
          en: "DisplayPort and HDMI — supports multiple monitors",
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "Flere USB-A, USB-C på nogle modeller, Gigabit-netværk",
          en: "Several USB-A, USB-C on some models, Gigabit Ethernet",
        },
      },
      {
        label: { da: "Styresystem", en: "Operating system" },
        value: {
          da: "Windows 10 eller 11 installeret med drivere",
          en: "Windows 10 or 11 installed with drivers",
        },
      },
    ],
    notes: [
      {
        da: "Micro-udgaven har færre udvidelsesmuligheder end SFF. Skal der senere i grafikkort eller ekstra diske, så vælg SFF fra start.",
        en: "The Micro has fewer expansion options than the SFF. If a graphics card or extra drives might be needed later, choose SFF from the start.",
      },
      {
        da: "Kabinetterne ligner hinanden på papiret – sig hvilken variant I vil have, så der ikke kommer en Micro, hvor der skulle stå en SFF.",
        en: "The cases look alike on paper — say which variant you want, so a Micro does not turn up where an SFF was meant to be.",
      },
    ],
  },
  {
    slug: "dell-ultrasharp-u2419h",
    name: "Dell UltraSharp U2419H",
    brand: "Dell",
    format: { da: '24" skærm', en: '24" monitor' },
    group: "skaerme",
    category: "skaerme",
    tagline: {
      da: "Kontorskærmen, der er nem at skaffe mange ens af.",
      en: "The office monitor that is easy to source many identical units of.",
    },
    metaTitle: {
      da: "Brugt Dell UltraSharp U2419H skærm til erhverv | Kestro",
      en: "Used Dell UltraSharp U2419H business monitor | Kestro",
    },
    metaDescription: {
      da: 'Dell UltraSharp U2419H som brugt erhvervsskærm: 24" IPS, tynd ramme, højdejustering og USB-hub. Sourcet til den enkelte ordre.',
      en: 'The Dell UltraSharp U2419H as a used business monitor: 24" IPS, thin bezel, height adjustment and a USB hub. Sourced per order.',
    },
    intro: {
      da: "UltraSharp er Dells erhvervsserie, og netop U2419H sad på tusindvis af arbejdspladser, før den blev udskiftet. Det betyder, at den er let at skaffe i antal – og at man kan give hele kontoret den samme skærm uden at betale nypris.",
      en: "UltraSharp is Dell's business range, and the U2419H in particular sat on thousands of desks before it was replaced. That makes it easy to source in numbers — and lets you give a whole office the same monitor without paying new prices.",
    },
    goodFor: [
      { da: "To skærme per arbejdsplads", en: "Two monitors per desk" },
      {
        da: "Kontor, administration og sagsbehandling",
        en: "Office, administration and casework",
      },
      {
        da: "Udskiftning af ældre skærme uden at røre computerne",
        en: "Replacing older monitors without touching the computers",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Dell UltraSharp U2419H – 23,8" erhvervsskærm',
          en: 'Dell UltraSharp U2419H — 23.8" business monitor',
        },
      },
      {
        label: { da: "Panel", en: "Panel" },
        value: {
          da: "IPS med mat overflade – brede synsvinkler",
          en: "IPS with a matte finish — wide viewing angles",
        },
      },
      {
        label: { da: "Opløsning", en: "Resolution" },
        value: { da: "Full HD (1920×1080)", en: "Full HD (1920×1080)" },
      },
      {
        label: { da: "Tilslutninger", en: "Connections" },
        value: {
          da: "DisplayPort, HDMI og indbygget USB-hub",
          en: "DisplayPort, HDMI and a built-in USB hub",
        },
      },
      {
        label: { da: "Fod", en: "Stand" },
        value: {
          da: "Højdejustering, tilt, drej og pivot (kan stilles på højkant)",
          en: "Height, tilt, swivel and pivot (can be turned portrait)",
        },
      },
      {
        label: { da: "Ophæng", en: "Mounting" },
        value: {
          da: "VESA 100×100 – kan sidde på arm eller bag en Tiny-pc",
          en: "VESA 100×100 — fits an arm, or behind a Tiny PC",
        },
      },
    ],
    notes: [
      {
        da: 'Full HD er standard på 24". Skal der arbejdes i store regneark eller tegninger, giver en 27" i QHD mere plads – spørg efter U2719D i stedet.',
        en: 'Full HD is standard at 24". For large spreadsheets or drawings, a 27" at QHD gives more room — ask for the U2719D instead.',
      },
      {
        da: "Kabler mangler ofte på brugte skærme. Aftal på forhånd, om DisplayPort- eller HDMI-kabel skal følge med.",
        en: "Cables are often missing from used monitors. Agree up front whether a DisplayPort or HDMI cable is included.",
      },
    ],
  },
  {
    slug: "hp-elitedisplay-e243",
    name: "HP EliteDisplay E243",
    brand: "HP",
    format: { da: '24" skærm', en: '24" monitor' },
    group: "skaerme",
    category: "skaerme",
    tagline: {
      da: "HP's kontorskærm – samme klasse, ofte lidt billigere.",
      en: "HP's office monitor — same class, usually a little cheaper.",
    },
    metaTitle: {
      da: "Brugt HP EliteDisplay E243 skærm til erhverv | Kestro",
      en: "Used HP EliteDisplay E243 business monitor | Kestro",
    },
    metaDescription: {
      da: 'HP EliteDisplay E243 som brugt erhvervsskærm: 24" IPS med højdejustering, USB-hub og flere indgange. Sourcet til jeres ordre.',
      en: 'The HP EliteDisplay E243 as a used business monitor: 24" IPS with height adjustment, a USB hub and several inputs. Sourced for your order.',
    },
    intro: {
      da: "EliteDisplay E-serien er HP's svar på UltraSharp og findes i store mængder på det brugte marked. Den har de samme grundting – mat IPS-panel, højdejustering og USB-hub – og ligger typisk lidt under Dell i pris.",
      en: "The EliteDisplay E series is HP's answer to UltraSharp, and it turns up in large numbers on the used market. It has the same basics — matte IPS panel, height adjustment and a USB hub — and usually sits slightly below Dell on price.",
    },
    goodFor: [
      { da: "Kontorarbejdspladser i alle størrelser", en: "Office desks at any scale" },
      {
        da: "Virksomheder med HP-udstyr i forvejen",
        en: "Companies that already run HP hardware",
      },
      {
        da: "Leverancer, hvor mange ens skærme skal skaffes hurtigt",
        en: "Deliveries where many identical monitors are needed quickly",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'HP EliteDisplay E243 – 23,8" erhvervsskærm',
          en: 'HP EliteDisplay E243 — 23.8" business monitor',
        },
      },
      {
        label: { da: "Panel", en: "Panel" },
        value: { da: "IPS med mat overflade", en: "IPS with a matte finish" },
      },
      {
        label: { da: "Opløsning", en: "Resolution" },
        value: { da: "Full HD (1920×1080)", en: "Full HD (1920×1080)" },
      },
      {
        label: { da: "Tilslutninger", en: "Connections" },
        value: {
          da: "DisplayPort, HDMI, VGA og USB-hub",
          en: "DisplayPort, HDMI, VGA and a USB hub",
        },
      },
      {
        label: { da: "Fod", en: "Stand" },
        value: {
          da: "Højdejustering, tilt, drej og pivot",
          en: "Height, tilt, swivel and pivot",
        },
      },
      {
        label: { da: "Ophæng", en: "Mounting" },
        value: { da: "VESA 100×100", en: "VESA 100×100" },
      },
    ],
    notes: [
      {
        da: "Enkelte varianter i serien har VGA som eneste ekstra indgang. Tjek, at jeres maskiner har DisplayPort eller HDMI, før I bestiller mange.",
        en: "A few variants in the series have VGA as their only extra input. Check that your machines have DisplayPort or HDMI before ordering many.",
      },
      {
        da: 'Serien findes også som E273 i 27". Skal skærmene bruges til to vinduer side om side, er det ofte pengene værd.',
        en: 'The series also comes as the E273 at 27". If the monitors are used for two windows side by side, that is often worth the money.',
      },
    ],
  },
  {
    slug: "lenovo-thinkvision-t24i",
    name: "Lenovo ThinkVision T24i",
    brand: "Lenovo",
    format: { da: '24" skærm', en: '24" monitor' },
    group: "skaerme",
    category: "skaerme",
    tagline: {
      da: "Matcher ThinkPad-flåden – både i udseende og i pris.",
      en: "Matches a ThinkPad fleet — in looks and in price.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkVision T24i skærm til erhverv | Kestro",
      en: "Used Lenovo ThinkVision T24i business monitor | Kestro",
    },
    metaDescription: {
      da: 'Lenovo ThinkVision T24i som brugt erhvervsskærm: 24" IPS, tynde rammer og fuld foddjustering. Sourcet til den enkelte ordre.',
      en: 'The Lenovo ThinkVision T24i as a used business monitor: 24" IPS, thin bezels and a fully adjustable stand. Sourced per order.',
    },
    intro: {
      da: "ThinkVision T-serien er Lenovos erhvervsskærme og den naturlige makker til en ThinkPad-flåde. Tynde rammer gør, at to skærme ved siden af hinanden ikke får en tyk streg ned i midten.",
      en: "The ThinkVision T series is Lenovo's business monitor line and the natural partner to a ThinkPad fleet. Thin bezels mean two monitors side by side do not leave a thick bar down the middle.",
    },
    goodFor: [
      { da: "Arbejdspladser med ThinkPad-maskiner", en: "Desks running ThinkPad machines" },
      {
        da: "Opstillinger med to skærme ved siden af hinanden",
        en: "Setups with two monitors side by side",
      },
      {
        da: "Kontorer, der vil holde sig til én producent",
        en: "Offices that want to stay with one manufacturer",
      },
    ],
    specs: [
      {
        label: { da: "Model", en: "Model" },
        value: {
          da: 'Lenovo ThinkVision T24i – 23,8" erhvervsskærm',
          en: 'Lenovo ThinkVision T24i — 23.8" business monitor',
        },
      },
      {
        label: { da: "Panel", en: "Panel" },
        value: { da: "IPS med mat overflade", en: "IPS with a matte finish" },
      },
      {
        label: { da: "Opløsning", en: "Resolution" },
        value: { da: "Full HD (1920×1080)", en: "Full HD (1920×1080)" },
      },
      {
        label: { da: "Tilslutninger", en: "Connections" },
        value: {
          da: "DisplayPort, HDMI, VGA og USB-hub",
          en: "DisplayPort, HDMI, VGA and a USB hub",
        },
      },
      {
        label: { da: "Fod", en: "Stand" },
        value: { da: "Højdejustering, tilt, drej og pivot", en: "Height, tilt, swivel and pivot" },
      },
      {
        label: { da: "Ophæng", en: "Mounting" },
        value: { da: "VESA 100×100", en: "VESA 100×100" },
      },
    ],
    notes: [
      {
        da: "T-serien findes i flere generationer, der ligner hinanden. Sig, om skærmene skal matche nogle, I har i forvejen, så vi finder samme generation.",
        en: "The T series spans several generations that look alike. Tell us if the monitors have to match ones you already own, and we will find the same generation.",
      },
      {
        da: "USB-hubben virker kun, hvis der også er et USB-kabel mellem skærm og maskine – det mangler tit på brugte enheder.",
        en: "The USB hub only works if there is also a USB cable between monitor and machine — that is often missing from used units.",
      },
    ],
  },
  {
    slug: "lenovo-thinkpad-ultra-dock",
    name: "Lenovo ThinkPad Ultra Dock",
    brand: "Lenovo",
    format: { da: "Dockingstation", en: "Docking station" },
    group: "docking",
    category: "dockingstationer",
    tagline: {
      da: "Mekanisk dock, der klikker fast under maskinen.",
      en: "A mechanical dock that clicks onto the bottom of the machine.",
    },
    metaTitle: {
      da: "Brugt Lenovo ThinkPad Ultra Dock til erhverv | Kestro",
      en: "Used Lenovo ThinkPad Ultra Dock for business | Kestro",
    },
    metaDescription: {
      da: "ThinkPad Ultra Dock som brugt dockingstation: mekanisk dockstik, flere skærme og netværk i én forbindelse. Sourcet til jeres ordre.",
      en: "The ThinkPad Ultra Dock as a used docking station: a mechanical dock connector, multiple monitors and network in one connection. Sourced for your order.",
    },
    intro: {
      da: "Ultra Dock klikker fast i bunden af maskinen i stedet for at sidde i et kabel. Det giver en fast forbindelse, der ikke ryger ud, når nogen flytter på maskinen, og medarbejderen skal kun gøre én ting, når hun sætter sig ved skrivebordet.",
      en: "The Ultra Dock clicks onto the bottom of the machine instead of hanging off a cable. That gives a solid connection that does not fall out when somebody nudges the laptop, and it leaves the employee with one thing to do when they sit down.",
    },
    goodFor: [
      {
        da: "Faste arbejdspladser til ThinkPad-flåder",
        en: "Fixed desks for ThinkPad fleets",
      },
      {
        da: "Skrivebordspladser med to eller tre skærme",
        en: "Desks running two or three monitors",
      },
      {
        da: "Kontorer med skiftende brugere ved samme plads",
        en: "Offices where different people use the same desk",
      },
    ],
    specs: [
      {
        label: { da: "Tilslutning", en: "Connection" },
        value: {
          da: "ThinkPads mekaniske dockstik i bunden af maskinen",
          en: "ThinkPad's mechanical dock connector on the underside of the machine",
        },
      },
      {
        label: { da: "Skærme", en: "Monitors" },
        value: {
          da: "Op til tre skærme samtidig via DisplayPort, DVI og VGA",
          en: "Up to three monitors at once via DisplayPort, DVI and VGA",
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "Flere USB-A, Gigabit-netværk og lydudgange",
          en: "Several USB-A, Gigabit Ethernet and audio outputs",
        },
      },
      {
        label: { da: "Strøm", en: "Power" },
        value: {
          da: "Egen strømforsyning, der også oplader maskinen",
          en: "Its own power supply, which also charges the machine",
        },
      },
      {
        label: { da: "Lås", en: "Lock" },
        value: {
          da: "Nøglelås, så docken kan låses til bordet",
          en: "Key lock, so the dock can be secured to the desk",
        },
      },
    ],
    notes: [
      {
        da: "Ultra Dock passer kun til bestemte ThinkPad-generationer. T480 og maskiner fra samme periode bruger 40A2-typen – fortæl os, hvilke maskiner I har, så vi matcher den rigtige.",
        en: "The Ultra Dock only fits certain ThinkPad generations. The T480 and machines from the same period use the 40A2 type — tell us which machines you have, and we will match the right one.",
      },
      {
        da: "Strømforsyningen mangler ofte på brugte docks, og docken virker ikke uden. Få den skrevet ind i aftalen.",
        en: "The power supply is often missing from used docks, and the dock will not work without it. Get it written into the agreement.",
      },
    ],
  },
  {
    slug: "dell-wd19",
    name: "Dell WD19",
    brand: "Dell",
    format: { da: "USB-C dock", en: "USB-C dock" },
    group: "docking",
    category: "dockingstationer",
    tagline: {
      da: "Ét USB-C-kabel – virker også på andre mærker.",
      en: "One USB-C cable — and it works on other brands too.",
    },
    metaTitle: {
      da: "Brugt Dell WD19 dockingstation til erhverv | Kestro",
      en: "Used Dell WD19 docking station for business | Kestro",
    },
    metaDescription: {
      da: "Dell WD19 som brugt USB-C dockingstation: flere skærme, netværk og strøm i ét kabel. Sourcet til den enkelte ordre.",
      en: "The Dell WD19 as a used USB-C docking station: multiple monitors, network and power over one cable. Sourced per order.",
    },
    intro: {
      da: "WD19 kobles til med ét USB-C-kabel og giver skærme, netværk, USB og strøm på én gang. Fordi den bruger almindelig USB-C frem for et mærkespecifikt stik, kan den også bruges på maskiner fra andre producenter – praktisk hvis I har en blandet flåde.",
      en: "The WD19 connects with a single USB-C cable and delivers monitors, network, USB and power at once. Because it uses ordinary USB-C rather than a brand-specific connector, it also works on machines from other manufacturers — handy with a mixed fleet.",
    },
    goodFor: [
      { da: "Blandede flåder med USB-C-maskiner", en: "Mixed fleets of USB-C machines" },
      {
        da: "Arbejdspladser med to eller tre skærme",
        en: "Desks running two or three monitors",
      },
      {
        da: "Medarbejdere, der skifter mellem plads og møde",
        en: "Staff who move between a desk and meetings",
      },
    ],
    specs: [
      {
        label: { da: "Tilslutning", en: "Connection" },
        value: {
          da: "USB-C – ét kabel til data, skærm og strøm",
          en: "USB-C — one cable for data, display and power",
        },
      },
      {
        label: { da: "Skærme", en: "Monitors" },
        value: {
          da: "Op til tre skærme afhængigt af variant",
          en: "Up to three monitors depending on the variant",
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "USB-A, USB-C, Gigabit-netværk og lyd",
          en: "USB-A, USB-C, Gigabit Ethernet and audio",
        },
      },
      {
        label: { da: "Strøm", en: "Power" },
        value: {
          da: "Leveres med 130 W eller 180 W strømforsyning",
          en: "Supplied with a 130 W or 180 W power adapter",
        },
      },
    ],
    notes: [
      {
        da: "WD19 findes som WD19, WD19S og WD19TB. Thunderbolt-udgaven kræver, at maskinen selv har Thunderbolt – ellers falder den ned på færre skærme.",
        en: "The WD19 comes as WD19, WD19S and WD19TB. The Thunderbolt version needs the machine to have Thunderbolt itself — otherwise it drops to fewer monitors.",
      },
      {
        da: "Strømforsyningens størrelse skal passe til maskinen. En 130 W-dock oplader ikke en workstation ordentligt.",
        en: "The adapter size has to match the machine. A 130 W dock will not charge a workstation properly.",
      },
    ],
  },
  {
    slug: "hp-usb-c-dock-g5",
    name: "HP USB-C Dock G5",
    brand: "HP",
    format: { da: "USB-C dock", en: "USB-C dock" },
    group: "docking",
    category: "dockingstationer",
    tagline: {
      da: "HP's universaldock til maskiner med USB-C.",
      en: "HP's universal dock for machines with USB-C.",
    },
    metaTitle: {
      da: "Brugt HP USB-C Dock G5 til erhverv | Kestro",
      en: "Used HP USB-C Dock G5 for business | Kestro",
    },
    metaDescription: {
      da: "HP USB-C Dock G5 som brugt dockingstation: skærme, netværk og strøm gennem ét USB-C-kabel. Sourcet til jeres ordre.",
      en: "The HP USB-C Dock G5 as a used docking station: monitors, network and power over a single USB-C cable. Sourced for your order.",
    },
    intro: {
      da: "G5-docken er HP's bud på det samme: ét USB-C-kabel til skærme, netværk og opladning. Den er billig at skaffe brugt, fordi den fulgte med rigtig mange EliteBook-leverancer.",
      en: "The G5 dock is HP's take on the same thing: one USB-C cable for monitors, network and charging. It is cheap to source second-hand, because it shipped with a great many EliteBook deliveries.",
    },
    goodFor: [
      { da: "Arbejdspladser med HP-maskiner", en: "Desks running HP machines" },
      {
        da: "Kontorer, der vil have samme dock på alle pladser",
        en: "Offices that want the same dock at every desk",
      },
      { da: "Opsætninger med to skærme", en: "Two-monitor setups" },
    ],
    specs: [
      {
        label: { da: "Tilslutning", en: "Connection" },
        value: {
          da: "USB-C – ét kabel til data, skærm og strøm",
          en: "USB-C — one cable for data, display and power",
        },
      },
      {
        label: { da: "Skærme", en: "Monitors" },
        value: {
          da: "To skærme via DisplayPort og HDMI",
          en: "Two monitors via DisplayPort and HDMI",
        },
      },
      {
        label: { da: "Porte", en: "Ports" },
        value: {
          da: "USB-A, USB-C, Gigabit-netværk og lyd",
          en: "USB-A, USB-C, Gigabit Ethernet and audio",
        },
      },
      {
        label: { da: "Strøm", en: "Power" },
        value: {
          da: "Egen strømforsyning, der oplader maskinen",
          en: "Its own power supply, which charges the machine",
        },
      },
    ],
    notes: [
      {
        da: "Den virker på de fleste USB-C-maskiner, men HP's egne funktioner som tænd/sluk fra docken virker kun sammen med HP.",
        en: "It works on most USB-C machines, but HP's own features, such as powering the machine on from the dock, only work with HP.",
      },
      {
        da: "Ældre HP UltraSlim-docks bruger et fladt stik i siden af maskinen og passer ikke til nyere modeller. Sig hvilke maskiner I har.",
        en: "Older HP UltraSlim docks use a flat connector on the side of the machine and do not fit newer models. Tell us which machines you have.",
      },
    ],
  },
];

export function getModel(slug: string): Model | undefined {
  return models.find((model) => model.slug === slug);
}

export function getModelsForCategory(categorySlug: string): Model[] {
  return models.filter((model) => model.category === categorySlug);
}
