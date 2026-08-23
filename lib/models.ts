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

export type ModelGroup = "baerbare" | "workstations" | "stationaere";

export type Model = {
  slug: string;
  name: string;
  brand: string;
  /** Form factor shown on cards, e.g. '14" bærbar'. */
  format: string;
  group: ModelGroup;
  /** Category slug in lib/categories that this model belongs to. */
  category: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  goodFor: string[];
  specs: { label: string; value: string }[];
  /** Honest caveats — what a buyer should know before picking this one. */
  notes: string[];
  /** Longer argument for the model. Only where we have something to add. */
  why?: { title: string; description: string }[];
  images?: { src: string; alt: string }[];
};

export const modelGroups: { id: ModelGroup; name: string; description: string }[] = [
  {
    id: "baerbare",
    name: "Bærbare computere",
    description: "Erhvervsserier bygget til daglig transport – ikke forbrugermodeller.",
  },
  {
    id: "workstations",
    name: "Workstations",
    description: "Til CAD, 3D, video og andet arbejde, der kræver dedikeret grafik.",
  },
  {
    id: "stationaere",
    name: "Stationære og mini-pc'er",
    description: "Faste arbejdspladser, hvor skærm og tastatur alligevel bliver stående.",
  },
];

export const models: Model[] = [
  {
    slug: "lenovo-thinkpad-t480",
    name: "Lenovo ThinkPad T480",
    brand: "Lenovo",
    format: '14" bærbar',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "Arbejdshesten i T-serien – robust, reparerbar og nem at opgradere.",
    metaTitle: "Brugt Lenovo ThinkPad T480 til erhverv | Kestro",
    metaDescription:
      "ThinkPad T480 som brugt erhvervsbærbar: specifikationer, hvad den egner sig til, og hvad man skal være opmærksom på. Vi sourcer den til den enkelte ordre.",
    intro:
      "T480 er den model, vi oftest bliver spurgt om, og med god grund. Den er bygget til at blive slæbt rundt hver dag, delene er lette at skaffe, og den kan udvides i stedet for at blive skiftet ud. For almindeligt kontorarbejde er den stadig rigeligt hurtig mange år efter, den kom på markedet.",
    goodFor: [
      "Kontor, administration og sagsbehandling",
      "Medarbejdere, der pendler med maskinen hver dag",
      "Flåder, hvor alle skal have præcis den samme maskine",
    ],
    specs: [
      { label: "Model", value: 'Lenovo ThinkPad T480 – 14" erhvervsbærbar' },
      {
        label: "Processor",
        value:
          "Intel Core i5-8350U eller i7-8650U (8. generation) – 4 kerner / 8 tråde, 1,7–3,6 GHz, 6 MB cache",
      },
      { label: "Hukommelse", value: "8 GB DDR4 – kan udvides til 32 GB" },
      { label: "Lagring", value: "256 GB M.2 SSD – kan udskiftes eller gøres større" },
      { label: "Grafik", value: "Intel UHD Graphics 620 (integreret)" },
      {
        label: "Skærm",
        value: '14" LED med antirefleks – HD (1366×768) eller Full HD (1920×1080)',
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
    notes: [
      "Skærmen findes både som HD og Full HD. Skal maskinen bruges hele dagen, så bed om Full HD – forskellen mærkes.",
      "8. generation er rigelig til kontorarbejde, men ikke til tung billed- eller videoredigering. Til det peger vi på en workstation.",
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
          "Maskinen kan udvides med mere hukommelse, og SSD'en kan skiftes eller gøres større. Skal den holde et par år mere, er det en billig opgradering frem for et nyt indkøb.",
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
    images: [
      {
        src: "/thinkpad-t480-6.jpg",
        alt: "Lenovo ThinkPad T480 set forfra med Windows installeret og klar til brug",
      },
      {
        src: "/thinkpad-t480-7.jpg",
        alt: "Tastaturet på ThinkPad T480 set oppefra med trackpoint og fingeraftrykslæser",
      },
      { src: "/thinkpad-t480-4.jpg", alt: 'ThinkPad T480 åbnet i vinkel med 14" skærmen tændt' },
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
  },
  {
    slug: "lenovo-thinkpad-t14",
    name: "Lenovo ThinkPad T14",
    brand: "Lenovo",
    format: '14" bærbar',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "Efterfølgeren til T480 – nyere processor, samme robusthed.",
    metaTitle: "Brugt Lenovo ThinkPad T14 til erhverv | Kestro",
    metaDescription:
      "ThinkPad T14 (Gen 1 og 2) som brugt erhvervsbærbar: specifikationer, forskellen på Intel og AMD, og hvad den egner sig til. Sourcet til jeres ordre.",
    intro:
      "T14 er det, T480 blev til. Samme grundidé – erhvervskabinet, godt tastatur, dele der kan skaffes – men med nyere processorer og en tyndere maskine. Den findes både med Intel og med AMD Ryzen PRO, og de to varianter er ikke helt ens.",
    goodFor: [
      "Virksomheder, der vil et par generationer nyere end T480",
      "Blandet brug: kontor, møder og lettere billedarbejde",
      "Arbejdspladser med Windows 11 som krav",
    ],
    specs: [
      { label: "Model", value: 'Lenovo ThinkPad T14 (Gen 1 og Gen 2) – 14" erhvervsbærbar' },
      {
        label: "Processor",
        value:
          "Intel Core i5/i7 (10. eller 11. generation) eller AMD Ryzen 5/7 PRO – 4 til 8 kerner",
      },
      { label: "Hukommelse", value: "8–16 GB DDR4 fra start, kan typisk udvides" },
      { label: "Lagring", value: "256–512 GB NVMe SSD – kan udskiftes" },
      { label: "Grafik", value: "Integreret (Intel Iris Xe / UHD eller AMD Radeon)" },
      { label: "Skærm", value: '14" Full HD med antirefleks, enkelte med berøringsskærm' },
      {
        label: "Porte",
        value: "USB-C, 2× USB-A, HDMI, Gigabit-netværk, kortlæser og combo-jack",
      },
      { label: "Vægt", value: "Omkring 1,5 kg" },
      {
        label: "Tastatur",
        value: "Fuldt tastatur med trackpoint og fingeraftrykslæser – layout kan skiftes til nordisk",
      },
      { label: "Styresystem", value: "Windows 11 installeret med drivere" },
    ],
    notes: [
      "AMD-modellerne giver flere kerner for pengene. Intel-modellerne har Thunderbolt og dermed flere dockingmuligheder – vælg efter hvilke docks I allerede har.",
      "Gen 1 og Gen 2 ligner hinanden udvendigt. Skal maskinerne kunne mere end kontorarbejde, så bed om Gen 2 med Iris Xe-grafik.",
    ],
  },
  {
    slug: "lenovo-thinkpad-x1-carbon",
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    format: '14" ultralet',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "Godt et kilo – til dem, der rejser med maskinen.",
    metaTitle: "Brugt Lenovo ThinkPad X1 Carbon til erhverv | Kestro",
    metaDescription:
      "ThinkPad X1 Carbon som brugt erhvervsbærbar: let kabinet, kraftig skærm og hvad man skal vide om loddet hukommelse. Sourcet til jeres ordre.",
    intro:
      "X1 Carbon er ThinkPad-serien skåret ned til godt et kilo uden at give køb på tastatur eller skærm. Den er til sælgere, konsulenter og ledelse – dem der har maskinen i tasken hver uge. Til gengæld er den mindre fleksibel end T-serien, og det skal med i beslutningen.",
    goodFor: [
      "Medarbejdere, der rejser eller pendler meget",
      "Salg, rådgivning og ledelse",
      "Arbejdspladser, hvor maskinen mest kører i en dock",
    ],
    specs: [
      { label: "Model", value: 'Lenovo ThinkPad X1 Carbon (Gen 6–8) – 14" ultralet erhvervsbærbar' },
      { label: "Processor", value: "Intel Core i5/i7 (8.–10. generation), strømbesparende U-serie" },
      { label: "Hukommelse", value: "8 eller 16 GB – loddet fast fra fabrikken" },
      { label: "Lagring", value: "256 GB–1 TB NVMe SSD – kan udskiftes" },
      { label: "Skærm", value: '14" Full HD eller WQHD med antirefleks' },
      { label: "Porte", value: "2× Thunderbolt 3, 2× USB-A, HDMI og combo-jack" },
      { label: "Vægt", value: "Omkring 1,1–1,2 kg" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Hukommelsen er loddet fast og kan ikke udvides senere. Vælg 16 GB fra start, hvis maskinen skal holde nogle år.",
      "Der er ikke netværksstik i maskinen. Skal den på kabel, kræver det den medfølgende adapter eller en dock – husk at bestille dem med.",
    ],
  },
  {
    slug: "lenovo-thinkpad-l14",
    name: "Lenovo ThinkPad L14",
    brand: "Lenovo",
    format: '14" bærbar',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "Erhvervsmaskine til det stramme budget.",
    metaTitle: "Brugt Lenovo ThinkPad L14 til erhverv | Kestro",
    metaDescription:
      "ThinkPad L14 som brugt erhvervsbærbar: samme tastatur og porte som T-serien til en lavere pris. Sourcet til den enkelte ordre.",
    intro:
      "L-serien er ThinkPad uden det dyre kabinet. Tastatur, porte og opgraderingsmuligheder følger stort set T-serien, men chassiset er enklere, og prisen ligger under. Skal I have mange maskiner ud på én gang, er det ofte her, regnestykket går op.",
    goodFor: [
      "Store leverancer, hvor prisen per arbejdsplads afgør",
      "Faste arbejdspladser og skiftende brugere",
      "Uddannelse, produktion og lager",
    ],
    specs: [
      { label: "Model", value: 'Lenovo ThinkPad L14 – 14" erhvervsbærbar' },
      { label: "Processor", value: "Intel Core i5/i7 (10. eller 11. generation) eller AMD Ryzen PRO" },
      { label: "Hukommelse", value: "8–16 GB DDR4, kan udvides" },
      { label: "Lagring", value: "256–512 GB NVMe SSD – kan udskiftes" },
      { label: "Skærm", value: '14" Full HD med antirefleks' },
      { label: "Porte", value: "USB-C, 2× USB-A, HDMI, Gigabit-netværk og combo-jack" },
      {
        label: "Tastatur",
        value: "Fuldt ThinkPad-tastatur med trackpoint – layout kan skiftes til nordisk",
      },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Kabinettet er plast frem for magnesium som i T-serien. Den tåler almindelig kontorbrug fint, men er ikke bygget til det samme slid.",
      "Lidt tungere end en T14 – mærkes hvis maskinen skal med i tasken hver dag.",
    ],
  },
  {
    slug: "hp-elitebook-840",
    name: "HP EliteBook 840",
    brand: "HP",
    format: '14" bærbar',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "HP's svar på T-serien – tynd, udbredt og nem at få dele til.",
    metaTitle: "Brugt HP EliteBook 840 til erhverv | Kestro",
    metaDescription:
      "HP EliteBook 840 (G5 og G6) som brugt erhvervsbærbar: specifikationer, hukommelse i to sokler og hvad Sure View betyder. Sourcet til jeres ordre.",
    intro:
      "EliteBook 840 er en af de mest udbredte erhvervsbærbare i Europa, og netop derfor er den nem at skaffe i antal og til en fornuftig pris. Den har to hukommelsessokler, hvilket gør den billig at opgradere, og et fladt kabinet der fylder lidt mindre i tasken end T-serien.",
    goodFor: [
      "Kontor og administration i alle størrelser",
      "Leverancer, hvor mange ens maskiner skal skaffes hurtigt",
      "Arbejdspladser med HP-docks i forvejen",
    ],
    specs: [
      { label: "Model", value: 'HP EliteBook 840 (G5 og G6) – 14" erhvervsbærbar' },
      { label: "Processor", value: "Intel Core i5 eller i7 (8. generation), 4 kerner / 8 tråde" },
      { label: "Hukommelse", value: "8–32 GB DDR4 i to sokler – nem at udvide" },
      { label: "Lagring", value: "256–512 GB NVMe SSD – kan udskiftes" },
      {
        label: "Skærm",
        value: '14" Full HD med antirefleks – findes også med berøringsskærm eller Sure View',
      },
      { label: "Porte", value: "2× USB-A, USB-C, HDMI, Gigabit-netværk og combo-jack" },
      { label: "Vægt", value: "Omkring 1,5 kg" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Nogle modeller har Sure View, et indbygget privatlivsfilter. Det er godt i toget, men gør skærmen mørkere på kontoret – vælg bevidst.",
      "Tastaturet har ikke trackpoint. Kommer medarbejderne fra ThinkPad, er det den største omvænning.",
    ],
  },
  {
    slug: "hp-probook-450",
    name: "HP ProBook 450",
    brand: "HP",
    format: '15,6" bærbar',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "Stor skærm og numerisk tastatur til skrivebordet.",
    metaTitle: "Brugt HP ProBook 450 til erhverv | Kestro",
    metaDescription:
      "HP ProBook 450 som brugt erhvervsbærbar: 15,6\" skærm, numerisk tastatur og plads til udvidelser. Sourcet til den enkelte ordre.",
    intro:
      "ProBook 450 er den store bærbare til dem, der arbejder i regneark og systemer hele dagen. 15,6\" skærm og numerisk tastatur gør en mærkbar forskel i bogholderi, ordrestyring og support – og prisen ligger under en tilsvarende EliteBook.",
    goodFor: [
      "Bogholderi, løn og ordrestyring",
      "Support og back office med faste arbejdspladser",
      "Brugere, der har brug for numerisk tastatur",
    ],
    specs: [
      { label: "Model", value: 'HP ProBook 450 (G7 og G8) – 15,6" erhvervsbærbar' },
      { label: "Processor", value: "Intel Core i5 eller i7 (10. eller 11. generation)" },
      { label: "Hukommelse", value: "8–32 GB DDR4 i to sokler" },
      { label: "Lagring", value: "256–512 GB NVMe SSD – kan udskiftes" },
      { label: "Skærm", value: '15,6" Full HD med antirefleks' },
      { label: "Porte", value: "USB-C, 2× USB-A, HDMI, Gigabit-netværk og combo-jack" },
      { label: "Tastatur", value: "Fuldt tastatur med numerisk del – layout kan skiftes til nordisk" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Tungere end en 14\" og bygget lidt enklere end EliteBook. Bedst til en fast arbejdsplads frem for daglig pendling.",
      "Batteritiden er kortere end på de små modeller – regn med en strømforsyning ved skrivebordet.",
    ],
  },
  {
    slug: "dell-latitude-5410",
    name: "Dell Latitude 5410",
    brand: "Dell",
    format: '14" bærbar',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "Dells arbejdsmaskine – to hukommelsessokler og alle porte i behold.",
    metaTitle: "Brugt Dell Latitude 5410 til erhverv | Kestro",
    metaDescription:
      "Dell Latitude 5410 og 5420 som brugt erhvervsbærbar: specifikationer, hukommelse i to sokler og fuldt portudvalg. Sourcet til jeres ordre.",
    intro:
      "Latitude 5000-serien er Dells svar på T-serien og EliteBook: en 14\" erhvervsmaskine, der er lavet til at blive serviceret. To hukommelsessokler, netværksstik, HDMI og USB-C – den kan sættes ind i næsten enhver opsætning uden adaptere.",
    goodFor: [
      "Kontor og administration",
      "Virksomheder med Dell-udstyr i forvejen",
      "Arbejdspladser, hvor maskinen skal kunne opgraderes undervejs",
    ],
    specs: [
      { label: "Model", value: 'Dell Latitude 5410 og 5420 – 14" erhvervsbærbar' },
      { label: "Processor", value: "Intel Core i5 eller i7 (10. eller 11. generation)" },
      { label: "Hukommelse", value: "8–64 GB DDR4 i to sokler" },
      { label: "Lagring", value: "256–512 GB NVMe SSD – kan udskiftes" },
      { label: "Skærm", value: '14" Full HD med antirefleks' },
      {
        label: "Porte",
        value: "USB-C, 2× USB-A, HDMI, Gigabit-netværk, combo-jack – smartkortlæser på nogle modeller",
      },
      { label: "Vægt", value: "Omkring 1,5 kg" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Skal maskinerne bruge smartkort eller kortlæser til medarbejderkort, skal det bestilles bevidst – ikke alle modeller har det.",
      "Dells docks bruger USB-C. Har I ældre E-Port-docks fra Dell, passer de ikke til denne generation.",
    ],
  },
  {
    slug: "dell-latitude-7490",
    name: "Dell Latitude 7490",
    brand: "Dell",
    format: '14" bærbar',
    group: "baerbare",
    category: "baerbare-computere",
    tagline: "Den lette Latitude – premium-kabinet, fuldt portudvalg.",
    metaTitle: "Brugt Dell Latitude 7490 til erhverv | Kestro",
    metaDescription:
      "Dell Latitude 7490 som brugt erhvervsbærbar: let kabinet, lang batteritid og alle porte i behold. Sourcet til den enkelte ordre.",
    intro:
      "7000-serien er Latitude i den pæne udgave: lettere kabinet, bedre skærm og længere batteritid end 5000-serien, men stadig med netværksstik og HDMI direkte i maskinen. Et godt kompromis mellem en X1 Carbon og en almindelig arbejdsbærbar.",
    goodFor: [
      "Medarbejdere, der både sidder ved skrivebordet og er ude",
      "Salg og rådgivning uden behov for det letteste kabinet",
      "Flåder, hvor batteritid vejer tungt",
    ],
    specs: [
      { label: "Model", value: 'Dell Latitude 7490 – 14" erhvervsbærbar' },
      { label: "Processor", value: "Intel Core i5 eller i7 (8. generation), 4 kerner / 8 tråde" },
      { label: "Hukommelse", value: "8–32 GB DDR4 i to sokler" },
      { label: "Lagring", value: "256–512 GB NVMe SSD – kan udskiftes" },
      { label: "Skærm", value: '14" Full HD med antirefleks' },
      { label: "Porte", value: "USB-C/Thunderbolt, 2× USB-A, HDMI, Gigabit-netværk og combo-jack" },
      { label: "Vægt", value: "Omkring 1,4 kg" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "8. generation er stadig fin til kontorarbejde, men skal maskinerne holde længe, er en 5420 eller T14 et par år nyere.",
      "Findes med både berøringsskærm og almindelig skærm – berøringsskærmen spejler mere i lyse lokaler.",
    ],
  },
  {
    slug: "hp-zbook-15",
    name: "HP ZBook 15",
    brand: "HP",
    format: '15,6" mobil workstation',
    group: "workstations",
    category: "baerbare-computere",
    tagline: "Til CAD, 3D og videoredigering ude hos kunden.",
    metaTitle: "Brugt HP ZBook 15 mobil workstation til erhverv | Kestro",
    metaDescription:
      "HP ZBook 15 som brugt mobil workstation: dedikeret Quadro-grafik, mange kerner og plads til flere diske. Sourcet til den enkelte ordre.",
    intro:
      "ZBook er ikke en kontormaskine, og det skal den heller ikke være. Den har dedikeret grafik, processorer med flere kerner og plads til flere diske – til tegnestuer, ingeniører og produktionsvirksomheder, hvor programmerne stiller reelle krav.",
    goodFor: [
      "CAD, BIM og 3D-modellering",
      "Video- og billedredigering",
      "Ingeniør- og analysearbejde med tunge datasæt",
    ],
    specs: [
      { label: "Model", value: 'HP ZBook 15 (G5 og G6) – 15,6" mobil workstation' },
      {
        label: "Processor",
        value: "Intel Core i7 (6 kerner) eller Xeon – H-serie med højere ydelse end kontormodeller",
      },
      { label: "Hukommelse", value: "16–64 GB DDR4 i flere sokler" },
      { label: "Lagring", value: "512 GB–2 TB NVMe SSD – plads til flere diske" },
      { label: "Grafik", value: "NVIDIA Quadro P1000 eller P2000 (dedikeret)" },
      { label: "Skærm", value: '15,6" Full HD eller 4K' },
      { label: "Porte", value: "Thunderbolt 3, USB-A, HDMI, Gigabit-netværk og kortlæser" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Vejer over 2,5 kg og har en stor strømforsyning. Det er en maskine til et skrivebord og en bil – ikke til toget.",
      "Kør en test med jeres eget program, før I bestiller mange. Licenskrav og grafikcertificering varierer mellem CAD-programmer.",
    ],
  },
  {
    slug: "hp-elitedesk-800",
    name: "HP EliteDesk 800",
    brand: "HP",
    format: "Stationær (SFF)",
    group: "stationaere",
    category: "stationaere-computere",
    tagline: "Klassisk kontor-pc med plads til at vokse.",
    metaTitle: "Brugt HP EliteDesk 800 til erhverv | Kestro",
    metaDescription:
      "HP EliteDesk 800 som brugt stationær erhvervs-pc: desktop-processor, fire hukommelsessokler og plads til udvidelser. Sourcet til jeres ordre.",
    intro:
      "EliteDesk 800 er den faste arbejdsplads, hvor der ikke skal spares på ydelsen. Den bruger rigtige desktop-processorer frem for bærbar-varianter, har fire hukommelsessokler og plads til både SSD og harddisk. Skal maskinen holde længe, er det den nemmeste at udvide.",
    goodFor: [
      "Faste kontorarbejdspladser",
      "Receptioner, kasser og produktionslokaler",
      "Arbejdspladser med to eller tre skærme",
    ],
    specs: [
      { label: "Model", value: "HP EliteDesk 800 (G4 og G5) – stationær i SFF-kabinet" },
      {
        label: "Processor",
        value: "Intel Core i5-8500 eller i7-8700 (8. generation) – 6 kerner, desktop-udgave",
      },
      { label: "Hukommelse", value: "8–64 GB DDR4 i fire sokler" },
      { label: "Lagring", value: "256–512 GB SSD – plads til ekstra disk" },
      { label: "Grafik", value: "Integreret – kan udvides med grafikkort i SFF-kabinettet" },
      { label: "Skærmudgange", value: "DisplayPort og HDMI – understøtter flere skærme" },
      { label: "Porte", value: "Flere USB-A og USB-C, Gigabit-netværk og lydudgange" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "SFF-kabinettet er mindre end et almindeligt tårn. Grafikkort skal være i lavprofil-udgave – tjek det, hvis der skal sættes et i.",
      "Skærme, tastatur og mus følger ikke med som standard. Skal arbejdspladsen være komplet, skal det med i tilbuddet.",
    ],
  },
  {
    slug: "lenovo-thinkcentre-m720q",
    name: "Lenovo ThinkCentre M720q Tiny",
    brand: "Lenovo",
    format: "Mini-pc (1 liter)",
    group: "stationaere",
    category: "mini-pc",
    tagline: "På størrelse med en bog – kan sidde bag skærmen.",
    metaTitle: "Brugt Lenovo ThinkCentre M720q Tiny mini-pc til erhverv | Kestro",
    metaDescription:
      "ThinkCentre M720q Tiny som brugt mini-pc til erhverv: 1 liters kabinet, VESA-beslag og lavt strømforbrug. Sourcet til den enkelte ordre.",
    intro:
      "M720q fylder omkring en liter og kan monteres bag skærmen med et VESA-beslag. Den giver en ryddelig arbejdsplads, bruger lidt strøm og støjer næsten ikke – og til almindeligt kontorarbejde mærker man ikke, at den er lille.",
    goodFor: [
      "Åbne kontorlandskaber og rene skriveborde",
      "Receptioner, mødelokaler og infoskærme",
      "Arbejdspladser, hvor støj og strømforbrug tæller",
    ],
    specs: [
      { label: "Model", value: "Lenovo ThinkCentre M720q og M920q Tiny – mini-pc" },
      { label: "Processor", value: "Intel Core i3, i5 eller i7 (8. eller 9. generation)" },
      { label: "Hukommelse", value: "8–32 GB DDR4 i to sokler" },
      { label: "Lagring", value: "256–512 GB NVMe SSD" },
      { label: "Skærmudgange", value: "DisplayPort og HDMI – to skærme som standard" },
      { label: "Porte", value: "Flere USB-A, USB-C på nogle modeller, Gigabit-netværk" },
      { label: "Montering", value: "VESA-beslag, så den kan sidde bag skærmen" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Den bruger processorer fra bærbare. Det gør den stille og sparsom, men den er ikke til tunge beregninger eller 3D.",
      "VESA-beslag og strømforsyning mangler tit på brugte enheder – husk at få det med i aftalen.",
    ],
  },
  {
    slug: "dell-optiplex-5060",
    name: "Dell OptiPlex 5060",
    brand: "Dell",
    format: "Stationær (SFF og Micro)",
    group: "stationaere",
    category: "stationaere-computere",
    tagline: "Samme maskine – vælg selv, om den skal fylde noget.",
    metaTitle: "Brugt Dell OptiPlex 5060 til erhverv | Kestro",
    metaDescription:
      "Dell OptiPlex 5060 og 5070 som brugt stationær erhvervs-pc: fås som SFF og Micro med samme indmad. Sourcet til jeres ordre.",
    intro:
      "OptiPlex 5000-serien findes i flere kabinetstørrelser med stort set samme indmad. Skal maskinen kunne udvides, tager man SFF-udgaven; skal den bare fylde mindst muligt, tager man Micro. Det gør det nemt at give hele huset samme maskine i forskellige former.",
    goodFor: [
      "Blandede arbejdspladser i samme virksomhed",
      "Udskiftning af ældre stationære uden at ændre opsætning",
      "Kontorer, der vil holde sig til én producent",
    ],
    specs: [
      { label: "Model", value: "Dell OptiPlex 5060 og 5070 – stationær i SFF eller Micro" },
      { label: "Processor", value: "Intel Core i5 eller i7 (8. eller 9. generation), desktop-udgave" },
      { label: "Hukommelse", value: "8–32 GB DDR4 – flere sokler i SFF-udgaven" },
      { label: "Lagring", value: "256–512 GB SSD – plads til ekstra disk i SFF" },
      { label: "Skærmudgange", value: "DisplayPort og HDMI – understøtter flere skærme" },
      { label: "Porte", value: "Flere USB-A, USB-C på nogle modeller, Gigabit-netværk" },
      { label: "Styresystem", value: "Windows 10 eller 11 installeret med drivere" },
    ],
    notes: [
      "Micro-udgaven har færre udvidelsesmuligheder end SFF. Skal der senere i grafikkort eller ekstra diske, så vælg SFF fra start.",
      "Kabinetterne ligner hinanden på papiret – sig hvilken variant I vil have, så der ikke kommer en Micro, hvor der skulle stå en SFF.",
    ],
  },
];

export function getModel(slug: string): Model | undefined {
  return models.find((model) => model.slug === slug);
}

export function getModelsForCategory(categorySlug: string): Model[] {
  return models.filter((model) => model.category === categorySlug);
}
