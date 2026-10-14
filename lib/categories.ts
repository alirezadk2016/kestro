import type { Localized } from "./i18n";

export type Category = {
  slug: string;
  name: Localized;
  /**
   * The page's heading, when it should carry the search phrase and the
   * short `name` (menus, cards, breadcrumbs) should not. Mak rule 5.
   */
  h1?: Localized;
  shortName: Localized;
  tagline: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  intro: Localized;
  /** Brand and product-line names — the same in both languages. */
  brands: string[];
  useCases: { title: Localized; description: Localized }[];
  specNote: Localized;
  /**
   * Slug of a model in lib/models that stands as a good example of what we
   * source in this category. Not stock — we buy per order.
   */
  exampleModel?: string;
  /**
   * Guides that answer a question this category's buyer actually asks.
   * Step 3's rule: the commercial page links to the guide that removes the
   * objection, and the guide links back.
   */
  guides?: { href: string; label: Localized }[];
};

export const categories: Category[] = [
  {
    slug: "baerbare-computere",
    name: { da: "Bærbare computere", en: "Business laptops" },
    h1: { da: "Brugte bærbare computere", en: "Refurbished business laptops" },
    shortName: { da: "Bærbare", en: "Laptops" },
    tagline: {
      da: "Renoverede erhvervsbærbare til kontor og hybridarbejde",
      en: "Refurbished business laptops for office and hybrid work",
    },
    metaTitle: {
      da: "Brugte bærbare computere – ThinkPad og EliteBook | Kestro",
      en: "Refurbished business laptops — ThinkPad, EliteBook | Kestro",
    },
    metaDescription: {
      da: "Brugte bærbare til erhverv: refurbished ThinkPad, EliteBook og Latitude med dansk eller norsk tastatur, målt batteri og skriftlige vilkår før bestilling.",
      en: "Refurbished ThinkPad, EliteBook and Latitude laptops for companies — Danish or Norwegian keyboard, measured battery and terms in writing.",
    },
    intro: {
      da: "Bærbare er det, vi oftest bliver bedt om at skaffe. Vi skaffer brugte erhvervsmaskiner – bygget til daglig kontorbrug frem for forbrugerbrug – funktionstester dem og klargør dem med dansk eller norsk tastatur, så de er klar til udlevering til medarbejderen.",
      en: "Laptops are what we are asked for most often. We source used business machines — built for daily office work rather than consumer use — function-test them and prepare them with a Danish or Norwegian keyboard, so they are ready to hand to the employee.",
    },
    brands: [
      "Lenovo ThinkPad",
      "Apple MacBook Air",
      "Apple MacBook Pro",
      "Dell Latitude",
      "Dell XPS",
      "HP EliteBook",
      "HP ProBook",
      "Lenovo ThinkBook",
      "Microsoft Surface Laptop",
      "ASUS ExpertBook",
      "Acer TravelMate",
      "Fujitsu Lifebook",
    ],
    useCases: [
      {
        title: { da: "Kontor og administration", en: "Office and administration" },
        description: {
          da: "Maskiner til Office, mail, browser og videomøder – hvor stabilitet og batteritid betyder mere end topydelse.",
          en: "Machines for Office, mail, browser and video calls — where reliability and battery life matter more than raw speed.",
        },
      },
      {
        title: { da: "Hybridarbejde", en: "Hybrid work" },
        description: {
          da: "Lette enheder til medarbejdere, der skifter mellem kontor og hjemmearbejdsplads.",
          en: "Light machines for people who move between the office and a desk at home.",
        },
      },
      {
        title: { da: "Udvikling og tungere arbejde", en: "Development and heavier work" },
        description: {
          da: "Modeller med mere RAM og stærkere CPU til udviklere, designere og analysearbejde.",
          en: "Models with more memory and a stronger processor, for developers, designers and analysis work.",
        },
      },
    ],
    specNote: {
      da: "RAM, SSD-størrelse, skærmstørrelse og CPU-generation tilpasses den enkelte ordre – fortæl os, hvad maskinerne skal bruges til, så finder vi det rette match.",
      en: "Memory, disk size, screen size and processor generation are matched to the individual order — tell us what the machines are for, and we will find the right fit.",
    },
    exampleModel: "lenovo-thinkpad-t480",
    guides: [
      {
        href: "/vejledninger/windows-11-paa-aeldre-maskine",
        label: {
          da: "Windows 11 på ældre maskiner",
          en: "Windows 11 on older machines",
        },
      },
      {
        href: "/vejledninger/tjek-brugt-baerbar-foer-koeb",
        label: {
          da: "Ti ting du skal tjekke på en brugt bærbar",
          en: "Ten things to check on a used laptop",
        },
      },
    ],
  },
  {
    slug: "stationaere-computere",
    name: { da: "Stationære computere", en: "Desktop computers" },
    h1: { da: "Brugte stationære computere", en: "Refurbished business desktops" },
    shortName: { da: "Stationære", en: "Desktops" },
    tagline: {
      da: "Renoverede stationære pc'er og workstations til faste arbejdspladser",
      en: "Refurbished desktops and workstations for fixed desks",
    },
    metaTitle: {
      da: "Brugte stationære computere – OptiPlex og EliteDesk | Kestro",
      en: "Refurbished business desktops and workstations | Kestro",
    },
    metaDescription: {
      da: "Refurbished stationære pc'er og workstations – OptiPlex, EliteDesk og ThinkCentre – i tårn, lille kabinet eller mini. Skaffet til ordren, stand på skrift.",
      en: "Refurbished business desktops and workstations — Dell OptiPlex, HP EliteDesk, Lenovo ThinkCentre and more. Function-tested and prepared.",
    },
    intro: {
      da: "Til faste arbejdspladser er en renoveret stationær ofte den mest økonomiske løsning. Stationære erhvervsmaskiner er bygget til lang levetid og er nemme at opgradere, hvilket gør dem velegnede til genbrug.",
      en: "For a desk that nobody carries anywhere, a refurbished desktop is usually the cheapest sensible answer. Business desktops are built to last and easy to upgrade, which is exactly what makes them worth buying second-hand.",
    },
    brands: [
      "Dell OptiPlex",
      "HP EliteDesk",
      "HP ProDesk",
      "Lenovo ThinkCentre",
      "Dell Precision",
      "HP Z Workstation",
      "Lenovo ThinkStation",
      "Apple iMac",
      "Apple Mac mini",
    ],
    useCases: [
      {
        title: { da: "Kontorarbejdspladser", en: "Office desks" },
        description: {
          da: "Standardmaskiner til faste skriveborde, hvor der ikke er behov for mobilitet.",
          en: "Standard machines for fixed desks, where nobody needs to carry anything around.",
        },
      },
      {
        title: { da: "Reception og fælles pc'er", en: "Reception and shared PCs" },
        description: {
          da: "Robuste maskiner til fælles brug, kantine, lager eller mødelokaler.",
          en: "Sturdy machines for shared use in reception, canteen, warehouse or meeting rooms.",
        },
      },
      {
        title: { da: "Workstations", en: "Workstations" },
        description: {
          da: "Kraftigere maskiner til CAD, video, 3D og andre opgaver, der kræver mere CPU, RAM og grafik.",
          en: "Stronger machines for CAD, video, 3D and other work that needs more processor, memory and graphics.",
        },
      },
    ],
    specNote: {
      da: "Vi tilpasser kabinettet (tårn, lille kabinet eller mini-pc), RAM, lagring og grafikkort efter jeres behov.",
      en: "We match the case (tower, small form factor or mini PC), memory, storage and graphics card to what you need.",
    },
    guides: [
      {
        href: "/vejledninger/reparere-eller-koebe-ny",
        label: { da: "Reparere eller købe ny?", en: "Repair or replace?" },
      },
    ],
  },
  {
    slug: "skaerme",
    name: { da: "Skærme", en: "Monitors" },
    h1: { da: "Brugte skærme til kontoret", en: "Refurbished monitors for the office" },
    shortName: { da: "Skærme", en: "Monitors" },
    tagline: {
      da: "Renoverede erhvervsskærme til faste arbejdspladser",
      en: "Refurbished business monitors for fixed desks",
    },
    metaTitle: {
      da: "Brugte skærme til kontoret – 22 til 27 tommer | Kestro",
      en: "Refurbished business monitors, 24 and 27 inch | Kestro",
    },
    metaDescription: {
      da: "Refurbished kontorskærme fra Dell, HP og Lenovo i 22 til 27 tommer, leveret sammen med maskiner og docks, så arbejdspladsen står komplet.",
      en: 'Refurbished business monitors from Dell, HP and Lenovo — 24" and 27", height-adjustable, with a USB hub. Sourced per order with your machines.',
    },
    intro: {
      da: "En skærm holder som regel længere end den computer, der står ved siden af, og derfor er det ofte her, der er mest at hente. Vi skaffer erhvervsskærme med matte paneler, højdejustering og de tilslutninger, jeres maskiner rent faktisk har – og de bliver tjekket for døde pixels og indbrændinger, inden de sendes af sted.",
      en: "A monitor usually outlives the computer standing next to it, which is why this is often where a company saves the most. We source business monitors with matte panels, height adjustment and the connectors your machines actually have — and they are checked for dead pixels and burn-in before they ship.",
    },
    brands: ["Dell", "HP", "Lenovo", "Philips", "AOC", "Samsung", "EIZO"],
    useCases: [
      {
        title: { da: "To skærme per arbejdsplads", en: "Two monitors per desk" },
        description: {
          da: 'Den billigste måde at gøre en arbejdsdag hurtigere på. To brugte 24"-skærme koster typisk mindre end én ny.',
          en: 'The cheapest way to make a working day faster. Two used 24" monitors normally cost less than one new one.',
        },
      },
      {
        title: { da: "Udskiftning af gamle skærme", en: "Replacing older monitors" },
        description: {
          da: 'Står der stadig 19"-skærme med tykke rammer rundt om i huset, kan de skiftes til moderne paneler uden at røre computerne.',
          en: 'If there are still 19" monitors with thick bezels around the building, they can be swapped for modern panels without touching the computers.',
        },
      },
      {
        title: { da: "Møde- og infoskærme", en: "Meeting and information screens" },
        description: {
          da: "Større paneler til mødelokaler, produktion og reception, hvor de bare skal vise noget hele dagen.",
          en: "Larger panels for meeting rooms, production and reception, where they simply have to display something all day.",
        },
      },
    ],
    specNote: {
      da: "Størrelse, opløsning, tilslutninger og fod aftales for den enkelte ordre – fortæl os, hvilke maskiner skærmene skal sidde på, så matcher vi stikkene.",
      en: "Size, resolution, connectors and stand are agreed per order — tell us which machines the monitors will sit on, and we will match the ports.",
    },
    guides: [
      {
        href: "/vejledninger/tjek-brugt-baerbar-foer-koeb",
        label: { da: "Sådan tjekker I brugt udstyr", en: "How to check used equipment" },
      },
    ],
  },
  {
    slug: "mini-pc",
    name: { da: "Mini-pc'er", en: "Mini PCs" },
    h1: { da: "Brugte mini-pc'er", en: "Refurbished mini PCs" },
    shortName: { da: "Mini-pc", en: "Mini PCs" },
    tagline: {
      da: "Kompakte maskiner til steder, hvor pladsen er trang",
      en: "Compact machines for desks with no room to spare",
    },
    metaTitle: {
      da: "Brugte mini-pc'er til erhverv – ThinkCentre Tiny m.fl. | Kestro",
      en: "Refurbished mini PCs for business — ThinkCentre Tiny | Kestro",
    },
    metaDescription: {
      da: "Brugte og refurbished mini-pc'er til reception, kasse og trange kontorpladser – fx Lenovo ThinkCentre Tiny og Dell OptiPlex Micro. Skaffet til ordren.",
      en: "Refurbished mini PCs — ThinkCentre Tiny, OptiPlex Micro, HP Mini — for receptions, tills, digital signage and small desks. Sourced per order.",
    },
    intro: {
      da: "Mini-pc'er giver samme ydelse som en almindelig stationær i et kabinet, der kan skjules bag skærmen eller monteres under bordet. De er populære, hvor der er begrænset plads, eller hvor et rent skrivebord er vigtigt.",
      en: "A mini PC gives you desktop performance in something that hides behind the monitor or mounts under the desk. They are popular where space is tight, or where a clear desk matters.",
    },
    brands: [
      "Lenovo ThinkCentre Tiny",
      "Dell OptiPlex Micro",
      "HP EliteDesk Mini",
      "HP ProDesk Mini",
      "Intel NUC",
      "Apple Mac mini",
      "ASUS Mini PC",
    ],
    useCases: [
      {
        title: { da: "Trange arbejdspladser", en: "Tight workspaces" },
        description: {
          da: "Kontorer, receptioner og butikker, hvor der ikke er plads til et almindeligt tårn.",
          en: "Offices, reception desks and shops where there is no room for a tower.",
        },
      },
      {
        title: { da: "Digital skiltning", en: "Digital signage" },
        description: {
          da: "Maskiner til infoskærme, menutavler og displays i butik eller kantine.",
          en: "Machines for information screens, menu boards and displays in a shop or canteen.",
        },
      },
      {
        title: { da: "Mødelokaler", en: "Meeting rooms" },
        description: {
          da: "Diskrete maskiner bag skærmen til præsentation og videomøder.",
          en: "Discreet machines behind the screen for presentations and video calls.",
        },
      },
    ],
    specNote: {
      da: "Mini-pc'er fås i flere ydelsesniveauer – fra let kontorarbejde til modeller, der kan måle sig med en almindelig stationær.",
      en: "Mini PCs come at several performance levels — from light office use to models that match an ordinary desktop.",
    },
  },
  {
    slug: "tablets",
    name: { da: "Tablets", en: "Tablets" },
    h1: { da: "Brugte tablets til erhverv", en: "Refurbished business tablets" },
    shortName: { da: "Tablets", en: "Tablets" },
    tagline: {
      da: "Renoverede tablets til feltarbejde, butik og præsentationer",
      en: "Refurbished tablets for field work, shops and presentations",
    },
    metaTitle: {
      da: "Brugte tablets til erhverv – iPad, Galaxy Tab, Surface | Kestro",
      en: "Refurbished business tablets — iPad, Galaxy, Surface | Kestro",
    },
    metaDescription: {
      da: "Brugte tablets til erhverv: iPad, Galaxy Tab og Surface til lager, service og møder. Skaffet per ordre, med stand og batteri oplyst, før I bestiller.",
      en: "Refurbished iPad, Galaxy Tab, Surface and Lenovo tablets for warehouse, service and meeting rooms. Condition and battery stated up front.",
    },
    intro: {
      da: "Tablets er velegnede til medarbejdere i marken, i butikken eller på lageret, hvor en bærbar er for tung og en telefon for lille. Vi klargør enhederne, så de er nulstillet og klar til jeres system til styring af enheder (MDM).",
      en: "Tablets suit people in the field, in the shop or in the warehouse, where a laptop is too heavy and a phone too small. We prepare the devices so they arrive reset and ready for your device management (MDM) setup.",
    },
    brands: [
      "Apple iPad",
      "Apple iPad Air",
      "Apple iPad Pro",
      "Samsung Galaxy Tab",
      "Microsoft Surface Pro",
      "Microsoft Surface Go",
      "Lenovo Tab",
    ],
    useCases: [
      {
        title: { da: "Feltarbejde og service", en: "Field work and service" },
        description: {
          da: "Registrering, dokumentation og ordrehåndtering ude hos kunden.",
          en: "Logging, documentation and order handling out at the customer.",
        },
      },
      {
        title: { da: "Butik og kundemøder", en: "Shops and customer meetings" },
        description: {
          da: "Salgsmateriale, katalog og underskrifter direkte på skærmen.",
          en: "Sales material, catalogue and signatures straight on the screen.",
        },
      },
      {
        title: { da: "Lager og produktion", en: "Warehouse and production" },
        description: {
          da: "Robuste enheder til scanning, opslag og statusregistrering.",
          en: "Sturdy devices for scanning, lookups and status logging.",
        },
      },
    ],
    specNote: {
      da: "Vi kan levere med eller uden mobildata (SIM), i forskellige skærmstørrelser og lagerstørrelser.",
      en: "We can supply with or without mobile data (SIM), in different screen and storage sizes.",
    },
  },
  {
    slug: "smartphones",
    name: { da: "Smartphones", en: "Smartphones" },
    h1: { da: "Brugte firmatelefoner og smartphones", en: "Refurbished company phones" },
    shortName: { da: "Smartphones", en: "Smartphones" },
    tagline: {
      da: "Renoverede telefoner og smartwatches til medarbejdere",
      en: "Refurbished phones and smartwatches for employees",
    },
    metaTitle: {
      da: "Brugte firmatelefoner – refurbished iPhone og Samsung | Kestro",
      en: "Refurbished business phones — iPhone and Samsung | Kestro",
    },
    metaDescription: {
      da: "Refurbished firmatelefoner skaffet til den enkelte ordre. Stand og batteri oplyses per enhed, og de gamle telefoner kan hentes retur og slettes.",
      en: "Refurbished company phones and smartwatches — iPhone, Galaxy, Pixel, Apple Watch. Tested, reset and ready; old phones collected and erased.",
    },
    intro: {
      da: "Firmatelefoner udskiftes ofte hyppigere end nødvendigt. Renoverede enheder giver samme funktionalitet til en markant lavere pris – særligt når der skal udstyres flere medarbejdere på én gang.",
      en: "Company phones get replaced more often than they need to be. Refurbished devices do the same job for a good deal less — especially when a whole team has to be equipped at once.",
    },
    brands: [
      "Apple iPhone",
      "Samsung Galaxy S",
      "Samsung Galaxy A",
      "Google Pixel",
      "Sony Xperia",
      "Nokia",
      "Apple Watch",
      "Samsung Galaxy Watch",
    ],
    useCases: [
      {
        title: { da: "Firmatelefoner", en: "Company phones" },
        description: {
          da: "Standardtelefoner til medarbejdere med behov for mail, kalender og opkald.",
          en: "Standard phones for staff who need mail, calendar and calls.",
        },
      },
      {
        title: { da: "Feltmedarbejdere", en: "Field staff" },
        description: {
          da: "Robuste enheder til teknikere, chauffører og servicepersonale.",
          en: "Sturdy devices for technicians, drivers and service staff.",
        },
      },
      {
        title: { da: "Udskiftningsenheder", en: "Loan devices" },
        description: {
          da: "Reserveenheder til udlån, når en medarbejders telefon er til reparation.",
          en: "Spare devices to lend out while someone's phone is being repaired.",
        },
      },
      {
        title: { da: "Smartwatches til teams", en: "Smartwatches for teams" },
        description: {
          da: "Til medarbejdere, der ikke altid kan have telefonen fremme. Vi kan skaffe Apple Watch og Galaxy Watch sammen med telefonerne.",
          en: "For staff who cannot always have a phone in their hand. We can source Apple Watch and Galaxy Watch alongside the phones.",
        },
      },
    ],
    specNote: {
      da: "Enhederne leveres nulstillet og fjernet fra tidligere ejeres konti, klar til jeres opsætning. Smartwatches fås med eller uden mobilforbindelse, og remme kan leveres nye.",
      en: "Devices arrive reset and released from previous accounts, ready for your setup. Smartwatches come with or without mobile connectivity, and straps can be supplied new.",
    },
  },
  {
    slug: "dockingstationer",
    name: { da: "Dockingstationer og tilbehør", en: "Docking stations and accessories" },
    h1: { da: "Dockingstationer til bærbare og tilbehør", en: "Docking stations for business laptops and accessories" },
    shortName: { da: "Docking", en: "Docking" },
    tagline: {
      da: "Docks, kabler og tilbehør, der gør arbejdspladsen komplet",
      en: "Docks, monitors and accessories for the desk",
    },
    metaTitle: {
      da: "Dockingstation til bærbar – brugte docks til erhverv | Kestro",
      en: "Docking stations for business laptops, refurbished | Kestro",
    },
    metaDescription: {
      da: "Brugte dockingstationer fra Lenovo, Dell og HP – plus kabler og tilbehør, der passer til maskinerne, så skærme og netværk virker fra første dag.",
      en: "Refurbished docking stations, monitors, keyboards and mice for business — ThinkPad Dock, Dell WD series, HP Thunderbolt Dock and more.",
    },
    intro: {
      da: "En komplet arbejdsplads er mere end maskinen. Vi leverer docking, skærme og tilbehør sammen med enhederne, så I kan sætte hele arbejdspladsen op i én leverance.",
      en: "A finished workstation is more than the machine. We supply docks, monitors and accessories alongside the computers, so a whole desk can be set up from one delivery.",
    },
    brands: [
      "Lenovo ThinkPad Dock",
      "Dell WD",
      "HP Thunderbolt Dock",
      "Dell Universal Dock",
      "HP USB-C Dock",
      "Anker",
      "Kensington",
    ],
    useCases: [
      {
        title: { da: "Fast skrivebordsopsætning", en: "Permanent desk setup" },
        description: {
          da: "Én kabelforbindelse til skærm, netværk, strøm og tilbehør.",
          en: "One cable for monitor, network, power and accessories.",
        },
      },
      {
        title: { da: "Delte skriveborde", en: "Hot-desking" },
        description: {
          da: "Medarbejderne sætter sig, hvor der er plads, og tilslutter deres egen bærbare med ét kabel.",
          en: "Shared desks where people plug in their own laptop.",
        },
      },
      {
        title: { da: "Skærme og tilbehør", en: "Monitors and accessories" },
        description: {
          da: "Renoverede erhvervsskærme, tastaturer med nordisk layout, mus og headsets.",
          en: "Refurbished business monitors, keyboards with a Danish or Norwegian layout, mice and headsets.",
        },
      },
    ],
    specNote: {
      da: "Docking skal matche maskinens porte (USB-C, Thunderbolt eller ældre stik, der kun passer til ét mærke) – vi sikrer, at det passer til jeres enheder.",
      en: "A dock has to match the machine's ports (USB-C, Thunderbolt or an older connector that only fits one brand) — we make sure it fits the machines you have.",
    },
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
