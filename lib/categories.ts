import type { Localized } from "./i18n";

export type Category = {
  slug: string;
  name: Localized;
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
    shortName: { da: "Bærbare", en: "Laptops" },
    tagline: {
      da: "Renoverede erhvervsbærbare til kontor og hybridarbejde",
      en: "Refurbished business laptops for office and hybrid work",
    },
    metaTitle: {
      da: "Brugte bærbare computere til erhverv | Kestro",
      en: "Refurbished business laptops for companies | Kestro",
    },
    metaDescription: {
      da: "Refurbished erhvervsbærbare fra ThinkPad-, EliteBook- og Latitude-serierne. Funktionstestet, nordisk tastatur og skriftlige vilkår før bestilling.",
      en: "Refurbished business laptops — ThinkPad, MacBook, Latitude, EliteBook and more. Function-tested, with a Nordic keyboard.",
    },
    intro: {
      da: "Bærbare er det, vi oftest bliver bedt om at skaffe. Vi sourcer brugte erhvervsmaskiner – bygget til daglig kontorbrug frem for forbrugerbrug – funktionstester dem og klargør dem med dansk/nordisk tastatur, så de er klar til udlevering til medarbejderen.",
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
          da: "Kommer maskinen med over til Windows 11?",
          en: "Will the machine make the jump to Windows 11?",
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
    shortName: { da: "Stationære", en: "Desktops" },
    tagline: {
      da: "Renoverede desktops og workstations til faste arbejdspladser",
      en: "Refurbished desktops and workstations for fixed desks",
    },
    metaTitle: {
      da: "Brugte stationære computere til erhverv | Kestro",
      en: "Refurbished business desktop computers | Kestro",
    },
    metaDescription: {
      da: "Refurbished stationære erhvervsmaskiner og små formfaktorer til kontoret. Vi sourcer til den enkelte ordre og oplyser stand skriftligt.",
      en: "Refurbished business desktops and workstations — OptiPlex, EliteDesk, ThinkCentre and more. Function-tested and prepared.",
    },
    intro: {
      da: "Til faste arbejdspladser er en renoveret desktop ofte den mest økonomiske løsning. Erhvervsdesktops er bygget til lang levetid og er nemme at opgradere, hvilket gør dem velegnede til genbrug.",
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
        title: { da: "Reception og fælles PC'er", en: "Reception and shared PCs" },
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
      da: "Vi tilpasser formfaktor (tower, SFF eller mini), RAM, lagring og grafikkort efter jeres behov.",
      en: "We match the form factor (tower, SFF or mini), memory, storage and graphics card to what you need.",
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
    shortName: { da: "Skærme", en: "Monitors" },
    tagline: {
      da: "Renoverede erhvervsskærme til faste arbejdspladser",
      en: "Refurbished business monitors for fixed desks",
    },
    metaTitle: {
      da: "Brugte skærme til kontor og erhverv | Kestro",
      en: "Used and refurbished business monitors | Kestro",
    },
    metaDescription: {
      da: "Refurbished kontorskærme fra Dell, HP og Lenovo i 22 til 27 tommer, leveret sammen med maskiner og docking, så en arbejdsplads står komplet.",
      en: 'Refurbished business monitors from Dell, HP and Lenovo — 24" and 27" with height adjustment and a USB hub. Sourced per order.',
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
    shortName: { da: "Mini-pc", en: "Mini PCs" },
    tagline: {
      da: "Kompakte maskiner, hvor pladsen er trang",
      en: "Compact machines for desks with no room to spare",
    },
    metaTitle: {
      da: "Brugte mini-pc'er til erhverv | Kestro",
      en: "Refurbished mini PCs for business | Kestro",
    },
    metaDescription: {
      da: "Refurbished mini-pc'er og små formfaktorer til receptioner, kasseborde og kontorpladser med lidt plads. Sourcet per ordre, testet før levering.",
      en: "Refurbished mini PCs and tiny desktops — Lenovo ThinkCentre Tiny, Dell OptiPlex Micro, HP Mini, Intel NUC. For offices, digital signage and tight workspaces.",
    },
    intro: {
      da: "Mini-pc'er giver desktop-ydelse i en formfaktor, der kan skjules bag skærmen eller monteres under bordet. De er populære, hvor der er begrænset plads, eller hvor et rent skrivebord er vigtigt.",
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
          da: "Kontorer, receptioner og butikker, hvor der ikke er plads til en tower.",
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
      da: "Mini-pc'er fås i flere ydelsesniveauer – fra letvægts kontorbrug til modeller, der matcher en almindelig desktop.",
      en: "Mini PCs come at several performance levels — from light office use to models that match an ordinary desktop.",
    },
  },
  {
    slug: "tablets",
    name: { da: "Tablets", en: "Tablets" },
    shortName: { da: "Tablets", en: "Tablets" },
    tagline: {
      da: "Renoverede tablets til felt, butik og præsentation",
      en: "Refurbished tablets for field work, shops and presentations",
    },
    metaTitle: {
      da: "Brugte tablets til erhverv | Kestro",
      en: "Refurbished business tablets | Kestro",
    },
    metaDescription: {
      da: "Refurbished tablets til lager, service og mødelokaler. Vi skaffer dem per ordre og oplyser stand og batteritilstand, før I bestiller.",
      en: "Refurbished tablets for companies — iPad, Samsung Galaxy Tab, Microsoft Surface and Lenovo Tab. Tested and prepared, delivered in Denmark and Norway.",
    },
    intro: {
      da: "Tablets er velegnede til medarbejdere i marken, i butikken eller på lageret, hvor en bærbar er for tung og en telefon for lille. Vi klargør enhederne, så de er nulstillet og klar til jeres MDM-opsætning.",
      en: "Tablets suit people in the field, in the shop or in the warehouse, where a laptop is too heavy and a phone too small. We prepare the devices so they arrive reset and ready for your MDM setup.",
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
    shortName: { da: "Smartphones", en: "Smartphones" },
    tagline: {
      da: "Renoverede telefoner og smartwatches til medarbejdere",
      en: "Refurbished phones and smartwatches for employees",
    },
    metaTitle: {
      da: "Refurbished mobiltelefoner til virksomheder | Kestro",
      en: "Refurbished business smartphones | Kestro",
    },
    metaDescription: {
      da: "Brugte firmatelefoner sourcet per ordre. Stand og batteritilstand oplyses per enhed, og gamle telefoner kan hentes retur med datasletning.",
      en: "Refurbished company phones and smartwatches — iPhone, Samsung Galaxy, Pixel, Apple Watch. Tested, reset and ready to hand out.",
    },
    intro: {
      da: "Firmatelefoner udskiftes ofte hyppigere end nødvendigt. Renoverede enheder giver samme funktionalitet til en markant lavere pris – særligt når der skal udstyres flere medarbejdere på én gang.",
      en: "Company phones get replaced more often than they need to be. Refurbished devices do the same job for a good deal less — especially when a whole team has to be equipped at once.",
    },
    brands: [
      "Apple iPhone",
      "Samsung Galaxy S-serien",
      "Samsung Galaxy A-serien",
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
      da: "Enhederne leveres nulstillet og afmeldt tidligere konti, klar til jeres opsætning. Smartwatches fås med eller uden mobilforbindelse, og remme kan leveres nye.",
      en: "Devices arrive reset and released from previous accounts, ready for your setup. Smartwatches come with or without mobile connectivity, and straps can be supplied new.",
    },
  },
  {
    slug: "dockingstationer",
    name: { da: "Dockingstationer & tilbehør", en: "Docking stations & accessories" },
    shortName: { da: "Docking", en: "Docking" },
    tagline: {
      da: "Docking, skærme og tilbehør til arbejdspladsen",
      en: "Docks, monitors and accessories for the desk",
    },
    metaTitle: {
      da: "Dockingstationer til erhvervsbærbare | Kestro",
      en: "Business docking stations and accessories | Kestro",
    },
    metaDescription: {
      da: "Brugte dockingstationer, kabler og tilbehør, der passer til de maskiner vi leverer – så skærme og netværk virker uden at nogen skal fejlfinde.",
      en: "Refurbished docking stations, monitors, keyboards and mice for business — ThinkPad Dock, Dell WD series, HP Thunderbolt Dock and more.",
    },
    intro: {
      da: "En komplet arbejdsplads er mere end maskinen. Vi leverer docking, skærme og tilbehør sammen med enhederne, så I kan sætte hele arbejdspladsen op i én leverance.",
      en: "A finished workstation is more than the machine. We supply docks, monitors and accessories alongside the computers, so a whole desk can be set up from one delivery.",
    },
    brands: [
      "Lenovo ThinkPad Dock",
      "Dell WD-serien",
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
        title: { da: "Hot-desking", en: "Hot-desking" },
        description: {
          da: "Delte arbejdspladser, hvor medarbejdere tilslutter deres egen bærbare.",
          en: "Shared desks where people plug in their own laptop.",
        },
      },
      {
        title: { da: "Skærme og tilbehør", en: "Monitors and accessories" },
        description: {
          da: "Renoverede erhvervsskærme, tastaturer med nordisk layout, mus og headsets.",
          en: "Refurbished business monitors, keyboards with Nordic layout, mice and headsets.",
        },
      },
    ],
    specNote: {
      da: "Docking skal matche maskinens porte (USB-C, Thunderbolt eller ældre proprietære stik) – vi sikrer, at det passer til jeres enheder.",
      en: "A dock has to match the machine's ports (USB-C, Thunderbolt or an older proprietary connector) — we make sure it fits the machines you have.",
    },
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
