export type Category = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  brands: string[];
  useCases: { title: string; description: string }[];
  specNote: string;
  /**
   * Optional example of a machine we often source. Not stock — we buy per
   * order — so this is illustrative of the type of hardware, not an offer.
   */
  example?: {
    model: string;
    note: string;
    images: { src: string; alt: string }[];
    /** A typical configuration for this model — illustrative, not an offer. */
    specs: { label: string; value: string }[];
    /** Why this machine family holds up in business use. */
    why: { title: string; description: string }[];
  };
};

export const categories: Category[] = [
  {
    slug: "baerbare-computere",
    name: "Bærbare computere",
    shortName: "Bærbare",
    tagline: "Renoverede erhvervsbærbare til kontor og hybridarbejde",
    metaTitle: "Renoverede bærbare computere til erhverv | Kestro",
    metaDescription:
      "Renoverede erhvervsbærbare fra ThinkPad, MacBook, Dell Latitude, HP EliteBook m.fl. – funktionstestet og klargjort med nordisk tastatur. Til virksomheder i DK og NO.",
    intro:
      "Bærbare er det, vi oftest bliver bedt om at skaffe. Vi sourcer brugte erhvervsmaskiner – bygget til daglig kontorbrug frem for forbrugerbrug – funktionstester dem og klargør dem med dansk/nordisk tastatur, så de er klar til udlevering til medarbejderen.",
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
        title: "Kontor og administration",
        description:
          "Maskiner til Office, mail, browser og videomøder – hvor stabilitet og batteritid betyder mere end topydelse.",
      },
      {
        title: "Hybridarbejde",
        description:
          "Lette enheder til medarbejdere, der skifter mellem kontor og hjemmearbejdsplads.",
      },
      {
        title: "Udvikling og tungere arbejde",
        description:
          "Modeller med mere RAM og stærkere CPU til udviklere, designere og analysearbejde.",
      },
    ],
    specNote:
      "RAM, SSD-størrelse, skærmstørrelse og CPU-generation tilpasses den enkelte ordre – fortæl os, hvad maskinerne skal bruges til, så finder vi det rette match.",
    example: {
      model: "Lenovo ThinkPad T480",
      note: "En 14\" erhvervsbærbar fra Lenovos T-serie – en af de modeller, vi oftest bliver bedt om at skaffe. Vi har den ikke på lager. Den står her, fordi den er et godt eksempel på, hvad en velvalgt brugt erhvervsmaskine kan, og hvorfor vi peger på den slags frem for en billig forbrugerbærbar.",
      images: [
        {
          src: "/thinkpad-t480-6.jpg",
          alt: "Lenovo ThinkPad T480 set forfra med Windows installeret og klar til brug",
        },
        {
          src: "/thinkpad-t480-7.jpg",
          alt: "Tastaturet på ThinkPad T480 set oppefra med trackpoint og fingeraftrykslæser",
        },
        {
          src: "/thinkpad-t480-4.jpg",
          alt: "ThinkPad T480 åbnet i vinkel med 14\" skærmen tændt",
        },
        {
          src: "/thinkpad-t480-8.jpg",
          alt: "Portene i siden af ThinkPad T480: hovedtelefonstik, USB-A, HDMI, netværk og kortlæser",
        },
        {
          src: "/thinkpad-t480-2.jpg",
          alt: "Bagsiden af ThinkPad T480 med ThinkPad-logo og porte i siden",
        },
        {
          src: "/thinkpad-t480-3.jpg",
          alt: "ThinkPad T480 set skråt oppefra med tastatur og trackpoint",
        },
        {
          src: "/thinkpad-t480-1.jpg",
          alt: "ThinkPad T480 set fra siden, næsten lukket, med portene synlige",
        },
      ],
      specs: [
        { label: "Model", value: "Lenovo ThinkPad T480 – 14\" erhvervsbærbar" },
        {
          label: "Processor",
          value:
            "Intel Core i5-8350U (8. generation) – 4 kerner / 8 tråde, 1,7–3,6 GHz, 6 MB cache",
        },
        { label: "Hukommelse", value: "8 GB DDR4 – kan udvides til 32 GB" },
        { label: "Lagring", value: "256 GB M.2 SSD – kan udskiftes eller gøres større" },
        { label: "Grafik", value: "Intel UHD Graphics 620 (integreret)" },
        {
          label: "Skærm",
          value: "14\" LED med antirefleks – HD (1366×768) eller Full HD (1920×1080)",
        },
        {
          label: "Porte",
          value:
            "2× USB 3.0, USB-C og Thunderbolt 3 (begge med opladning og skærmudgang), HDMI, dockstik, Gigabit-netværk, kortlæser og combo-jack",
        },
        { label: "Trådløst", value: "Wi-Fi og Bluetooth" },
        { label: "Kamera og lyd", value: "Webcam, højttalere og mikrofon" },
        {
          label: "Tastatur",
          value:
            "Fuldt tastatur med trackpoint og fingeraftrykslæser – baggrundslys som tilvalg, layout kan skiftes til dansk eller norsk",
        },
        { label: "Optisk drev", value: "Nej" },
        { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
      ],
      why: [
        {
          title: "Bygget til at blive slæbt rundt",
          description:
            "Kabinet, hængsler og tastatur er lavet til daglig transport. Det er den samme maskintype, mange virksomheder og offentlige arbejdspladser selv har kørt på i årevis.",
        },
        {
          title: "Reservedele er til at skaffe",
          description:
            "Lenovo udgiver servicemanualer til T-serien, og delene er stadig lette at få fat i. En defekt skærm, et batteri eller et tastatur bliver en reparation i stedet for en ny maskine.",
        },
        {
          title: "Kan opgraderes i stedet for udskiftes",
          description:
            "RAM og SSD sidder i sokler og er ikke loddet fast. Skal maskinen holde et par år mere, er mere hukommelse eller en større disk en billig opgradering.",
        },
        {
          title: "Tastaturet kan skiftes til nordisk layout",
          description:
            "Derfor kan vi levere sydeuropæiske maskiner med dansk eller norsk tastatur, uden at det ser eftermonteret ud.",
        },
        {
          title: "Én type dock til hele flåden",
          description:
            "Med Thunderbolt 3 og ThinkPads eget dockstik kan I køre den samme dockingstation på tværs af arbejdspladserne i stedet for en løsning per maskine.",
        },
        {
          title: "Batteriet kan skiftes på stedet",
          description:
            "T480 har både et internt og et eksternt batteri. Det eksterne kan skiftes uden værktøj, og et nyt batteri koster en brøkdel af en ny maskine.",
        },
      ],
    },
  },
  {
    slug: "stationaere-computere",
    name: "Stationære computere",
    shortName: "Stationære",
    tagline: "Renoverede desktops og workstations til faste arbejdspladser",
    metaTitle: "Renoverede stationære computere til erhverv | Kestro",
    metaDescription:
      "Renoverede stationære erhvervscomputere og workstations – Dell OptiPlex, HP EliteDesk, Lenovo ThinkCentre m.fl. Funktionstestet og klargjort til virksomheder i DK og NO.",
    intro:
      "Til faste arbejdspladser er en renoveret desktop ofte den mest økonomiske løsning. Erhvervsdesktops er bygget til lang levetid og er nemme at opgradere, hvilket gør dem velegnede til genbrug.",
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
        title: "Kontorarbejdspladser",
        description:
          "Standardmaskiner til faste skriveborde, hvor der ikke er behov for mobilitet.",
      },
      {
        title: "Reception og fælles PC'er",
        description: "Robuste maskiner til fælles brug, kantine, lager eller mødelokaler.",
      },
      {
        title: "Workstations",
        description:
          "Kraftigere maskiner til CAD, video, 3D og andre opgaver, der kræver mere CPU, RAM og grafik.",
      },
    ],
    specNote:
      "Vi tilpasser formfaktor (tower, SFF eller mini), RAM, lagring og grafikkort efter jeres behov.",
  },
  {
    slug: "mini-pc",
    name: "Mini-pc'er",
    shortName: "Mini-pc",
    tagline: "Kompakte maskiner, hvor pladsen er trang",
    metaTitle: "Renoverede mini-pc'er til erhverv | Kestro",
    metaDescription:
      "Renoverede mini-pc'er og tiny-desktops – Lenovo ThinkCentre Tiny, Dell OptiPlex Micro, HP Mini, Intel NUC. Til kontor, digital skiltning og trange arbejdspladser.",
    intro:
      "Mini-pc'er giver desktop-ydelse i en formfaktor, der kan skjules bag skærmen eller monteres under bordet. De er populære, hvor der er begrænset plads, eller hvor et rent skrivebord er vigtigt.",
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
        title: "Trange arbejdspladser",
        description: "Kontorer, receptioner og butikker, hvor der ikke er plads til en tower.",
      },
      {
        title: "Digital skiltning",
        description: "Maskiner til infoskærme, menutavler og displays i butik eller kantine.",
      },
      {
        title: "Mødelokaler",
        description: "Diskrete maskiner bag skærmen til præsentation og videomøder.",
      },
    ],
    specNote:
      "Mini-pc'er fås i flere ydelsesniveauer – fra letvægts kontorbrug til modeller, der matcher en almindelig desktop.",
  },
  {
    slug: "tablets",
    name: "Tablets",
    shortName: "Tablets",
    tagline: "Renoverede tablets til felt, butik og præsentation",
    metaTitle: "Renoverede tablets til erhverv | Kestro",
    metaDescription:
      "Renoverede tablets til virksomheder – iPad, Samsung Galaxy Tab, Microsoft Surface og Lenovo Tab. Testet og klargjort, leveret i Danmark og Norge.",
    intro:
      "Tablets er velegnede til medarbejdere i marken, i butikken eller på lageret, hvor en bærbar er for tung og en telefon for lille. Vi klargør enhederne, så de er nulstillet og klar til jeres MDM-opsætning.",
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
        title: "Feltarbejde og service",
        description: "Registrering, dokumentation og ordrehåndtering ude hos kunden.",
      },
      {
        title: "Butik og kundemøder",
        description: "Salgsmateriale, katalog og underskrifter direkte på skærmen.",
      },
      {
        title: "Lager og produktion",
        description: "Robuste enheder til scanning, opslag og statusregistrering.",
      },
    ],
    specNote:
      "Vi kan levere med eller uden mobildata (SIM), i forskellige skærmstørrelser og lagerstørrelser.",
  },
  {
    slug: "smartphones",
    name: "Smartphones",
    shortName: "Smartphones",
    tagline: "Renoverede erhvervstelefoner til medarbejdere",
    metaTitle: "Renoverede smartphones til erhverv | Kestro",
    metaDescription:
      "Renoverede erhvervstelefoner – iPhone, Samsung Galaxy, Google Pixel. Testet, nulstillet og klar til udlevering. Til virksomheder i Danmark og Norge.",
    intro:
      "Firmatelefoner udskiftes ofte hyppigere end nødvendigt. Renoverede enheder giver samme funktionalitet til en markant lavere pris – særligt når der skal udstyres flere medarbejdere på én gang.",
    brands: [
      "Apple iPhone",
      "Samsung Galaxy S-serien",
      "Samsung Galaxy A-serien",
      "Google Pixel",
      "Sony Xperia",
      "Nokia",
    ],
    useCases: [
      {
        title: "Firmatelefoner",
        description: "Standardtelefoner til medarbejdere med behov for mail, kalender og opkald.",
      },
      {
        title: "Feltmedarbejdere",
        description: "Robuste enheder til teknikere, chauffører og servicepersonale.",
      },
      {
        title: "Udskiftningsenheder",
        description: "Reserveenheder til udlån, når en medarbejders telefon er til reparation.",
      },
    ],
    specNote:
      "Alle enheder leveres nulstillet og afmeldt tidligere konti, klar til jeres opsætning.",
  },
  {
    slug: "smartwatches",
    name: "Smartwatches",
    shortName: "Smartwatches",
    tagline: "Renoverede smartwatches til medarbejdere og teams",
    metaTitle: "Renoverede smartwatches til erhverv | Kestro",
    metaDescription:
      "Renoverede smartwatches – Apple Watch, Samsung Galaxy Watch, Garmin. Testet og klargjort til virksomheder i Danmark og Norge.",
    intro:
      "Smartwatches bruges i stigende grad som arbejdsredskab – til notifikationer, opkald og sundhedsdata. Renoverede enheder gør det økonomisk overkommeligt at udstyre et helt team.",
    brands: [
      "Apple Watch",
      "Samsung Galaxy Watch",
      "Garmin",
      "Fitbit",
      "Huawei Watch",
    ],
    useCases: [
      {
        title: "Notifikationer på farten",
        description: "Medarbejdere, der ikke altid kan have telefonen fremme.",
      },
      {
        title: "Sundhed og trivsel",
        description: "Firmaordninger med fokus på bevægelse og medarbejdertrivsel.",
      },
      {
        title: "Personalegoder",
        description: "En overkommelig måde at give medarbejdere et gode uden nypris.",
      },
    ],
    specNote:
      "Fås i forskellige størrelser og med eller uden mobilforbindelse (LTE). Remme kan leveres nye.",
  },
  {
    slug: "dockingstationer",
    name: "Dockingstationer & tilbehør",
    shortName: "Docking",
    tagline: "Docking, skærme og tilbehør til arbejdspladsen",
    metaTitle: "Dockingstationer og tilbehør til erhverv | Kestro",
    metaDescription:
      "Renoverede dockingstationer, skærme, tastaturer og mus til erhverv – ThinkPad Dock, Dell WD-serien, HP Thunderbolt Dock m.fl.",
    intro:
      "En komplet arbejdsplads er mere end maskinen. Vi leverer docking, skærme og tilbehør sammen med enhederne, så I kan sætte hele arbejdspladsen op i én leverance.",
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
        title: "Fast skrivebordsopsætning",
        description: "Én kabelforbindelse til skærm, netværk, strøm og tilbehør.",
      },
      {
        title: "Hot-desking",
        description: "Delte arbejdspladser, hvor medarbejdere tilslutter deres egen bærbare.",
      },
      {
        title: "Skærme og tilbehør",
        description:
          "Renoverede erhvervsskærme, tastaturer med nordisk layout, mus og headsets.",
      },
    ],
    specNote:
      "Docking skal matche maskinens porte (USB-C, Thunderbolt eller ældre proprietære stik) – vi sikrer, at det passer til jeres enheder.",
  },
  {
    slug: "gaming",
    name: "Gaming-udstyr",
    shortName: "Gaming",
    tagline: "Gaming-pc'er og udstyr til private og virksomheder",
    metaTitle: "Renoveret gaming-udstyr og gaming-pc'er | Kestro",
    metaDescription:
      "Renoverede gaming-pc'er, gaming-bærbare og udstyr – ROG, Legion, Alienware, Predator. Til private, e-sport og virksomheder i Danmark og Norge.",
    intro:
      "Gaming-maskiner har typisk kraftig hardware, der holder i mange år. Renoverede enheder giver adgang til høj ydelse til en brøkdel af nyprisen – både til private, e-sportsmiljøer og virksomheder med tunge grafikopgaver.",
    brands: [
      "ASUS ROG",
      "Lenovo Legion",
      "Alienware",
      "Acer Predator",
      "MSI Gaming",
      "HP Omen",
      "Razer",
    ],
    useCases: [
      {
        title: "Gaming derhjemme",
        description: "Komplette maskiner til private, der vil have ydelse uden nyprisen.",
      },
      {
        title: "E-sport og gaming-lokaler",
        description: "Flere identiske maskiner til klubber, skoler og gaming-cafeer.",
      },
      {
        title: "Grafik og 3D-arbejde",
        description:
          "Kraftige grafikkort er også relevante til rendering, video og designarbejde i virksomheder.",
      },
    ],
    specNote:
      "Grafikkort, CPU, RAM og køling varierer meget på gaming-maskiner – fortæl os, hvilke spil eller programmer maskinen skal klare.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
