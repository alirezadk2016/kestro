import type { Localized } from "./i18n";
import { guideSource } from "@/lib/sources";

/**
 * The guide section.
 *
 * Separate from the B2B pages on purpose: a procurement manager and someone
 * who wants to put more memory in their own laptop are not the same reader,
 * and mixing them weakens both. These pages exist to answer a question well
 * enough that the reader does not need us — which is exactly why the ones who
 * would rather not do it themselves call.
 *
 * Every guide targets a question people actually type. Nothing here is a
 * teaser for a paid course; if courses arrive later, they get their own type.
 */

/*
 * The taxonomy Viden is organised by.
 *
 * Held in data rather than in the URL. Step 3 made the same call for model
 * pages: a hierarchy expressed in a path costs a redirect the day an article
 * changes cluster, and buys nothing Google cannot already read from
 * breadcrumbs and internal links. It also means the section can one day move
 * to /viden by renaming one path segment, with the structure already built.
 *
 * Four working clusters, each with a commercial page waiting at the bottom,
 * plus an honest bucket for the one guide that belongs to none. Step 3 decided
 * samle-din-egen-pc was the wrong audience and should be kept but not built
 * on; filing it under a cluster it does not belong to would quietly reverse
 * that decision.
 */
export type Cluster =
  "memory-storage" | "lifecycle" | "workplace-hardware" | "buying-condition" | "uden-klynge";

/** What kind of question the article answers. Drives nothing but the label. */
export type ArticleType = "grundviden" | "beslutning" | "erhvervs-it" | "praktisk";

/**
 * How close the reader is to buying — and therefore how loud the page is
 * allowed to be about it. The template reads this; a designer never decides
 * CTA weight per article.
 */
export type Intent =
  "informational" | "informational-commercial" | "commercial-education" | "high-commercial";

export type ClusterMeta = {
  id: Cluster;
  /** Anchor on the hub. Part of a URL the moment anyone links to it. */
  anchor: string;
  name: Localized;
  description: Localized;
};

export const clusters: ClusterMeta[] = [
  {
    id: "lifecycle",
    anchor: "levetid-og-udskiftning",
    name: { da: "Levetid og udskiftning", en: "Lifecycle and replacement" },
    description: {
      da: "Hvornår en maskine har gjort sit, hvad supportdatoer betyder for en flåde, og hvordan man skifter uden at skifte alt.",
      en: "When a machine has done its job, what support dates mean for a fleet, and how to replace without replacing everything.",
    },
  },
  {
    id: "buying-condition",
    anchor: "koeb-stand-og-afhaendelse",
    name: { da: "Køb, stand og afhændelse", en: "Buying, condition and disposal" },
    description: {
      da: "Hvad man skal se efter, før man køber brugt – og hvad der skal ske med udstyret, når det skal videre.",
      en: "What to look for before buying used — and what has to happen to the equipment when it moves on.",
    },
  },
  {
    id: "memory-storage",
    anchor: "hukommelse-og-lagring",
    name: { da: "Hukommelse og lagring", en: "Memory and storage" },
    description: {
      da: "RAM og lagerplads: hvor meget der skal til, hvad der kan opgraderes, og hvornår det kan betale sig.",
      en: "Memory and storage: how much is needed, what can be upgraded, and when it is worth doing.",
    },
  },
  {
    id: "workplace-hardware",
    anchor: "arbejdspladsen",
    name: { da: "Arbejdspladsen", en: "The workplace" },
    description: {
      da: "Skærme, dockingstationer og alt det, der gør en maskine til en arbejdsplads.",
      en: "Monitors, docking stations and everything that turns a machine into a workplace.",
    },
  },
  {
    id: "uden-klynge",
    anchor: "oevrige",
    name: { da: "Øvrige vejledninger", en: "Other guides" },
    description: {
      da: "Vejledninger, der ikke hører under et af de tre emner ovenfor.",
      en: "Guides that do not belong under one of the three topics above.",
    },
  },
];

export const getCluster = (id: Cluster): ClusterMeta =>
  clusters.find((cluster) => cluster.id === id) ?? clusters[clusters.length - 1];

export type GuideSection = {
  heading: Localized;
  body: Localized[];
  /** Optional list — used where steps or checks read better than prose. */
  list?: Localized[];
  /**
   * Optional comparison, rendered as a real <table>.
   *
   * Where two things differ along several axes, a table says it in a glance
   * and prose does not. It is semantic HTML rather than a styled grid on
   * purpose: a crawler, a screen reader and a language model all read a table
   * as a table, and the comparison is usually the part worth quoting.
   */
  table?: { caption: Localized; head: Localized[]; rows: Localized[][] };
};

export type Guide = {
  slug: string;
  /** Which cluster the article belongs to. Exactly one. */
  cluster: Cluster;
  type: ArticleType;
  intent: Intent;
  /**
   * The one search this article is written to own. Checked against every other
   * article and against docs/seo-keyword-map.csv — two pages may never claim
   * the same primary. Empty string means deliberately none, which is a
   * decision, not an omission.
   */
  primaryKeyword: string;
  /** Team member id from lib/company.ts. Never a name typed in here. */
  author: string;
  title: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  summary: Localized;
  /** Who the guide is written for, so a reader can self-select on the hub. */
  audience: Localized;
  readingMinutes: number;
  /** ISO date. Shown, and used for the article schema. */
  updated: string;
  published?: string;
  /**
   * The answer, before the reader scrolls. 40-60 words.
   *
   * Separate from `summary`, which is a teaser written for the hub. This one
   * has to be usable on its own: someone who reads this and leaves should have
   * got what they came for.
   */
  tldr: Localized;
  intro: Localized;
  sections: GuideSection[];
  /** What to do if you would rather not do it yourself. */
  closing: Localized;
  /**
   * The page that resolves what the guide raised.
   *
   * A guide that answers a question and then stops leaves the reader to find
   * the commercial page on their own — and leaves the commercial page without
   * the link. One or two, always to somewhere that already exists.
   */
  related: { href: string; label: Localized }[];
  /**
   * Questions the guide raises but does not answer in the body.
   *
   * Optional, and only where a reader genuinely has a question left — a guide
   * that ends with four invented questions is padding. Same shape as <Faq>
   * takes, and the page marks it up from this array, so what a reader sees and
   * what Google reads cannot drift apart.
   */
  faqs?: { question: Localized; answer: Localized }[];
  /**
   * Where a claim on the page can be checked.
   *
   * A guide that states dates and requirements and cites nobody asks to be
   * taken on trust. The href is localised because the authoritative page often
   * exists in Danish too, and a Danish reader should land on the Danish one.
   * Only real, reachable pages belong here — a dead citation is worse than
   * none.
   */
  sources?: { href: Localized; label: Localized }[];
};

export const guides: Guide[] = [
  {
    slug: "hvorfor-er-ram-blevet-dyrere",
    cluster: "memory-storage",
    type: "grundviden",
    intent: "informational",
    primaryKeyword: "hvorfor er ram blevet dyrere",
    author: "alireza",
    title: {
      da: "Hvorfor er RAM blevet dyrere, og hvad betyder det for din bærbare?",
      en: "Why has RAM become more expensive, and what does it mean for your laptop?",
    },
    metaTitle: {
      da: "Hvorfor er RAM blevet dyrere? Priser i 2026 | Kestro",
      en: "Why is RAM more expensive? Memory prices in 2026 | Kestro",
    },
    metaDescription: {
      da: "Hvorfor er RAM dyrere? Se, hvad der presser prisen, og få hjælp til at vælge mere RAM, en brugt pc eller nyt. Med daterede kilder og råd før køb.",
      en: "RAM prices in 2026: AI, chip supply and retail prices explained. Is it still wise to upgrade? Get tips for comparing a used laptop with a new PC.",
    },
    summary: {
      da: "AI, servere og begrænset udbud presser hukommelsesmarkedet. Men en chipprognose er ikke en dansk butikspris.",
      en: "AI, servers and limited supply put pressure on memory. But a chip forecast is not a local retail price.",
    },
    audience: {
      da: "Dig, der sammenligner køb og opgradering",
      en: "Anyone comparing a purchase with an upgrade",
    },
    readingMinutes: 6,
    published: "2026-10-16",
    updated: "2026-10-19",
    tldr: {
      da: "Producenterne flytter kapacitet mod server- og AI-hukommelse, og udbuddet af RAM til pc'er er stramt. TrendForces resuméer fra september 2026 beskriver stabile kontraktpriser lige nu, men pres fremover – ikke ens stigninger på alle varer. Køb derfor RAM, når en måling viser, at du mangler hukommelse, ikke fordi en prognose varsler dyrere chips.",
      en: "Manufacturers are moving capacity towards server and AI memory, and the supply of PC RAM is tight. TrendForce's September 2026 summaries describe stable contract prices for now but pressure ahead — not the same rise on every product. So buy RAM when a measurement shows you are short of memory, not because a forecast predicts dearer chips.",
    },
    intro: {
      da: "Prisstatus undersøgt 16. oktober 2026 ud fra TrendForces offentlige resuméer. Prognoserne er deres; rådene om køb er vores.",
      en: "Price context checked on 16 October 2026 against TrendForce's public summaries. The forecasts are theirs; the buying advice is ours.",
    },
    sections: [
      {
        heading: {
          da: "Hvad ved vi faktisk om priserne?",
          en: "What do we actually know about prices?",
        },
        body: [
          {
            da: "TrendForces resumé af DRAM Contract Price fra 30. september 2026 beskriver stabile kontraktpriser i perioden, samtidig med et stramt PC DRAM-udbud og producentkapacitet flyttet mod servere. Stabile priser i én periode og risiko for senere stigninger kan altså godt optræde samtidig.",
            en: "TrendForce's September 30, 2026 DRAM Contract Price summary describes stable contract prices during that period, alongside constrained PC DRAM supply and manufacturing capacity shifting to servers. Stable prices in one period and a risk of later increases can coexist.",
          },
          {
            da: "I prognoseresuméet fra 24. september for fjerde kvartal peger TrendForce på AI- og serverefterspørgsel, men forskellige forløb for server- og forbrugerprodukter. Det er en forventning, ikke dokumentation for, at din næste RAM-klods eller alle bærbare er steget med en bestemt procent.",
            en: "In its September 24 fourth-quarter forecast summary, TrendForce points to AI and server demand but different trends for server and consumer products. This is an outlook, not proof that your next memory module or every laptop has increased by a particular percentage.",
          },
        ],
      },
      {
        heading: {
          da: "Hvorfor spiller AI og servere en rolle?",
          en: "Why do AI and servers matter?",
        },
        body: [
          {
            da: "HBM til AI, server-RAM og hukommelse til almindelige pc'er er ikke samme produkt. TrendForces resuméer beskriver, at kapacitet prioriteres mod serverprodukter. Det kan begrænse udbuddet til pc'er; det betyder ikke, at et HBM-modul kan sættes i din bærbare.",
            en: "HBM for AI, server RAM and ordinary PC memory are not the same product. TrendForce's summaries describe capacity being prioritised towards server products. This can constrain PC supply; it does not mean an HBM module can be installed in your laptop.",
          },
          {
            da: "DDR4, DDR5 og fastloddet LPDDR skal vurderes hver for sig. En gammel standard er ikke automatisk billigere eller et bedre køb. Brug kun den type, producenten angiver til din præcise computer.",
            en: "DDR4, DDR5 and soldered LPDDR must be assessed separately. An older standard is not automatically cheaper or a better purchase. Use only the type specified for your exact computer.",
          },
        ],
      },
      {
        heading: {
          da: "Chippris, modulpris og computerpris er tre ting",
          en: "Chip, module and computer prices are different",
        },
        body: [
          {
            da: "En færdig RAM-klods har flere omkostninger end chips alene. Og en computer indeholder langt mere end RAM. Tabellen er en sammenligningshjælp, ikke en prisprognose.",
            en: "A finished memory module has costs beyond the chips. A computer contains much more than RAM. This table helps you compare; it is not a price forecast.",
          },
        ],
        table: {
          caption: { da: "Hvad prisen faktisk beskriver", en: "What each price describes" },
          head: [
            { da: "Prisniveau", en: "Price level" },
            { da: "Hvad du kan bruge det til", en: "How to use it" },
          ],
          rows: [
            [
              { da: "DRAM-kontraktpris", en: "DRAM contract price" },
              {
                da: "Markedsretning ved større aftaler; ikke en pris på et SO-DIMM i Danmark.",
                en: "Market direction for large contracts; not a Danish SO-DIMM retail price.",
              },
            ],
            [
              { da: "RAM-modul i en butik", en: "Retail memory module" },
              {
                da: "Sammenlign samme varenummer, kapacitet, type, fragt og dato.",
                en: "Compare the same part number, capacity, type, shipping and date.",
              },
            ],
            [
              { da: "Færdig bærbar", en: "Complete laptop" },
              {
                da: "Sammenlign CPU, RAM, SSD, skærm, batteri, tastatur, stand og aftalevilkår.",
                en: "Compare CPU, RAM, SSD, screen, battery, keyboard, condition and terms.",
              },
            ],
          ],
        },
      },
      {
        heading: {
          da: "Hvorfor kan en bærbar blive dyrere?",
          en: "Why might a laptop become more expensive?",
        },
        body: [
          {
            da: "Dyrere komponenter kan lægge pres på en ny computers samlede pris. Vores vurdering er, at lager, kampagner, modelskifte, valutakurser og sælgerens vilkår også skal med i en konkret sammenligning. Et lavere RAM-niveau kan desuden skjule en ændring i værdi, selv når prisskiltet er uændret.",
            en: "More expensive components can put pressure on a new computer's total price. In our assessment, stock, promotions, model changes, exchange rates and seller terms also belong in an actual comparison. A lower memory specification can hide a change in value even when the price tag stays the same.",
          },
          {
            da: "Vi dokumenterer ikke, at alle bærbare stiger i pris. Bed om et dateret tilbud på den konfiguration, du skal bruge, og undersøg et refurbished alternativ med samme opgavekrav. En brugt maskine er heller ikke garanteret billigst, når nyt batteri, opgradering og opsætning lægges til.",
            en: "We are not documenting a price increase for every laptop. Ask for a dated quote for the configuration you need and examine a refurbished alternative with the same workload requirements. A used machine is not guaranteed to be cheapest after battery replacement, upgrading and setup.",
          },
        ],
      },
      {
        heading: { da: "Sådan undgår du et panikkøb", en: "How to avoid a panic purchase" },
        body: [
          {
            da: "Tag beslutningen ud fra behov og samlet pris, ikke en overskrift om mangel. Denne rækkefølge kan bruges af både en privat køber og en virksomhed:",
            en: "Decide using your needs and total cost, not a shortage headline. Individuals and companies can use the same sequence:",
          },
        ],
        list: [
          {
            da: "Mål hukommelse, CPU og disk under dit normale arbejde. Mere RAM hjælper kun, hvis hukommelsen er en del af problemet.",
            en: "Measure memory, CPU and disk during your normal work. More RAM helps only if memory is part of the problem.",
          },
          {
            da: "Kontrollér sokler og producentens kompatibilitetsliste, før du bestiller. En billig DDR5-klods hjælper ikke en DDR4-maskine.",
            en: "Check slots and manufacturer compatibility before ordering. A cheap DDR5 module does not help a DDR4 machine.",
          },
          {
            da: "Sammenlign opgradering, refurbished og nyt med samme nødvendige specifikationer, levering og vilkår.",
            en: "Compare upgrading, refurbished and new with the same necessary specifications, delivery and terms.",
          },
          {
            da: "Få prisens gyldighed og eventuelle alternativer oplyst. Til en virksomhed: afprøv en repræsentativ konfiguration før et større indkøb.",
            en: "Ask how long the price is valid and which alternatives exist. For a company: trial a representative configuration before a larger purchase.",
          },
        ],
      },
    ],
    closing: {
      da: "Send model, nuværende RAM og arbejdsopgaver, hvis du vil sammenligne mulighederne. En forespørgsel er uforpligtende; aktuel pris og tilgængelighed skal bekræftes.",
      en: "Send your model, current memory and workloads to compare the options. An enquiry is non-binding; current price and availability need confirmation.",
    },
    related: [
      {
        href: "/vejledninger/opgrader-ram-i-baerbar",
        label: { da: "Kan du selv opgradere RAM?", en: "Can you upgrade memory yourself?" },
      },
      {
        href: "/vejledninger/refurbished-eller-ny-baerbar",
        label: { da: "Refurbished eller ny bærbar?", en: "Refurbished or new laptop?" },
      },
      {
        href: "/priser",
        label: { da: "Sammenlign konfiguration og pris", en: "Compare configuration and price" },
      },
    ],
    sources: [guideSource("memoryMarketSeptember2026"), guideSource("memoryOutlookQ42026")],
    faqs: [
      {
        question: {
          da: "Betyder dyrere chips, at alle bærbare bliver dyrere?",
          en: "Do higher chip prices make every laptop more expensive?",
        },
        answer: {
          da: "Nej. Det kan give prispres, men en konkret pris afhænger også af konfiguration, lager, kampagner og vilkår. Sammenlign aktuelle tilbud på samme specifikationer; en global prognose er ikke et dansk detailprisindeks.",
          en: "No. It can create price pressure, but an actual price also depends on configuration, stock, promotions and terms. Compare current quotes for equivalent specifications; a global forecast is not a Danish retail price index.",
        },
      },
      {
        question: {
          da: "Skal jeg købe RAM nu, før det bliver dyrere?",
          en: "Should I buy RAM now before it becomes more expensive?",
        },
        answer: {
          da: "Kun hvis der er et dokumenteret behov, delen er kompatibel, og den samlede opgradering giver mening. Vi kan ikke love et fremtidigt prisniveau. Unødvendig RAM er stadig en udgift, også på tilbud.",
          en: "Only if there is a demonstrated need, the part is compatible and the total upgrade makes sense. We cannot promise a future price level. Unnecessary memory still costs money, even on sale.",
        },
      },
    ],
  },
  {
    slug: "refurbished-eller-ny-baerbar",
    cluster: "buying-condition",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "refurbished eller ny bærbar",
    author: "alireza",
    title: {
      da: "Refurbished eller ny bærbar: hvad er det bedste køb?",
      en: "Refurbished or new laptop: which is the better purchase?",
    },
    metaTitle: {
      da: "Refurbished eller ny bærbar? Sammenlign før køb | Kestro",
      en: "Refurbished or new laptop? Compare before buying | Kestro",
    },
    metaDescription: {
      da: "Refurbished eller ny bærbar? Find det rette valg til dig eller dit team. Se på behov, batteri, stand og Windows, og regn hele prisen ud, før du køber.",
      en: "Refurbished or new laptop? Find the right fit for you or a team. Check tasks, battery, condition and Windows, then compare the cost before buying.",
    },
    summary: {
      da: "Et lavere prisskilt er ikke hele regnestykket. Vælg efter opgaven, batteriet, supporten og den samlede pris.",
      en: "A lower price tag is not the whole calculation. Choose by workload, battery, support and total cost.",
    },
    audience: { da: "Private, startups og indkøbere", en: "Individuals, startups and buyers" },
    readingMinutes: 7,
    published: "2026-10-16",
    updated: "2026-10-19",
    tldr: {
      da: "En refurbished erhvervsbærbar kan være et godt køb, når den løser dine opgaver, har dokumenteret stand og batteri og kan bruge et understøttet styresystem. Nyt kan være bedre ved særlige ydelseskrav eller lang planlagt brugstid. Sammenlign hele pakken, ikke kun processorens navn eller prisskiltet.",
      en: "A refurbished business laptop can be good value when it handles your work, has documented condition and battery health and can run a supported operating system. New may be better for specific performance requirements or a long planned service life. Compare the entire package, not just the processor name or price tag.",
    },
    intro: {
      da: "Spørgsmålet er ikke, om alle skal købe brugt. Det er, hvilken løsning der opfylder dit behov med færrest samlede omkostninger og acceptable risici. Her er en beslutningsramme til både hjemmearbejde og en virksomheds næste arbejdspladser.",
      en: "The question is not whether everyone should buy used. It is which solution meets your needs with the lowest total cost and acceptable risks. Here is a decision framework for home working and a company's next workstations.",
    },
    sections: [
      {
        heading: {
          da: "Hvornår giver refurbished mening?",
          en: "When does refurbished make sense?",
        },
        body: [
          {
            da: "Til mail, dokumenter, browserbaserede systemer og videomøder kan en passende ældre erhvervsmaskine være tilstrækkelig. Det er vores vurdering, ikke et løfte om alle modeller: afprøv dine programmer, skærme og mødeopsætning på den konkrete konfiguration.",
            en: "For email, documents, browser-based systems and video calls, a suitable older business machine may be sufficient. That is our assessment, not a promise about every model: test your applications, monitors and meeting setup on the actual configuration.",
          },
        ],
        list: [
          {
            da: "Du prioriterer arbejdsfunktion frem for den nyeste generation og kan acceptere dokumenterede kosmetiske brugsspor.",
            en: "You prioritise work capability over the latest generation and can accept documented cosmetic wear.",
          },
          {
            da: "RAM, SSD, batteri og fysisk dansk eller norsk tastatur er specificeret, ikke blot beskrevet som »god stand«.",
            en: "RAM, SSD, battery and physical Danish or Norwegian keyboard are specified, not merely described as good condition.",
          },
          {
            da: "Styresystem, drivere, licenser og eventuel virksomhedsadministration kan understøttes i den planlagte periode.",
            en: "The operating system, drivers, licences and any company management can be supported for the intended period.",
          },
        ],
      },
      {
        heading: {
          da: "Hvornår er en ny bærbar det bedre valg?",
          en: "When is a new laptop the better choice?",
        },
        body: [
          {
            da: "Krav til en bestemt GPU, specialsoftware, batteritid, skærmkvalitet eller dokumenteret producentservice kan gøre en nyere model nødvendig. En ny maskine er ikke automatisk hurtigere i alle opgaver, men en ældre billig konfiguration bør heller ikke presses ind i et arbejde, den ikke kan løse.",
            en: "Requirements for a particular GPU, specialist software, battery runtime, screen quality or documented manufacturer service may require a newer model. A new computer is not automatically faster at every task, but a cheap older configuration should not be forced into work it cannot handle.",
          },
          {
            da: "Hvis computeren skal bruges længe, skal du undersøge support for operativsystem, drivere og de programmer, du er afhængig af. Fremtidig kompatibilitet kan ikke garanteres ud fra et generationsnummer alene.",
            en: "For a long planned service life, investigate support for the operating system, drivers and applications you depend on. Future compatibility cannot be guaranteed from a generation number alone.",
          },
        ],
      },
      {
        heading: {
          da: "Sammenlign det samme behov, ikke samme reklame",
          en: "Compare the same needs, not the same advertising",
        },
        body: [
          {
            da: "Brug tabellen som en indkøbsliste til begge tilbud. »Refurbished« siger ikke i sig selv, hvilke dele der er udskiftet eller testet.",
            en: "Use this table as a checklist for both quotes. Refurbished does not, by itself, identify which parts were replaced or tested.",
          },
        ],
        table: {
          caption: {
            da: "Oplysninger, du bør have før valget",
            en: "Information to obtain before choosing",
          },
          head: [
            { da: "Kontrolpunkt", en: "Check" },
            { da: "Refurbished", en: "Refurbished" },
            { da: "Ny", en: "New" },
          ],
          rows: [
            [
              { da: "Ydelse", en: "Performance" },
              {
                da: "Test dine opgaver på den tilbudte konfiguration.",
                en: "Test your workload on the quoted configuration.",
              },
              {
                da: "Kontrollér faktisk CPU, GPU, RAM og køling; ikke kun modelåret.",
                en: "Check the actual CPU, GPU, RAM and cooling, not just the model year.",
              },
            ],
            [
              { da: "Batteri", en: "Battery" },
              {
                da: "Bed om målt kapacitet og eventuel udskiftningspris.",
                en: "Ask for measured capacity and any replacement cost.",
              },
              {
                da: "Undersøg kapacitet og målt batteritid; reklamens tal er ikke din arbejdsdag.",
                en: "Check capacity and measured battery life; the advertised figure is not your working day.",
              },
            ],
            [
              { da: "Opgradering", en: "Upgrading" },
              {
                da: "Slå sokler, lagerinterface og maksimum op.",
                en: "Look up slots, storage interface and maximum capacity.",
              },
              {
                da: "Tjek også her: nyt udstyr kan have fastloddet RAM.",
                en: "Check here too: new hardware can have soldered RAM.",
              },
            ],
            [
              { da: "Support og aftale", en: "Support and terms" },
              {
                da: "Få testomfang, stand, licens og aftalevilkår skriftligt.",
                en: "Get testing scope, condition, licence and terms in writing.",
              },
              {
                da: "Kontrollér de konkrete servicevilkår, ikke en antaget garanti.",
                en: "Verify the specific service terms, not an assumed warranty.",
              },
            ],
          ],
        },
      },
      {
        heading: { da: "Regn på den samlede pris", en: "Calculate the total cost" },
        body: [
          {
            da: "Sammenlign køb + nødvendige dele + arbejde + dataflytning + tilbehør + forventet nedetid. Hold momsgrundlaget ens i tilbuddene, og afklar, om eventuelle gebyrer og fragt er med. Vi angiver ikke en universel besparelsesprocent.",
            en: "Compare purchase + necessary parts + labour + data migration + accessories + expected downtime. Keep the VAT basis consistent between quotes and establish whether fees and shipping are included. We do not claim a universal saving percentage.",
          },
          {
            da: "En billig maskine med for lidt fastloddet RAM kan være et dyrere valg end et dyrere tilbud med den rigtige mængde fra starten. Omvendt er mere RAM eller en dyr workstation spild, hvis dine programmer ikke har brug for det.",
            en: "A cheap laptop with too little soldered RAM can be worse value than a higher-priced quote with the right capacity from the start. Conversely, more RAM or an expensive workstation is wasteful if your applications do not need it.",
          },
        ],
      },
      {
        heading: {
          da: "Til startups og virksomheder med flere medarbejdere",
          en: "For startups and teams",
        },
        body: [
          {
            da: "Start med roller, programmer og tilbehør, ikke et bestemt modelnavn. Notér, hvor mange der arbejder stationært, rejser eller bruger tunge programmer. Et enkelt fælles minimum kan være lettere at administrere, men en udvikler og en receptionist har ikke nødvendigvis samme behov.",
            en: "Start with roles, applications and accessories, not a particular model name. Record how many people work at a desk, travel or use demanding applications. One shared minimum specification may simplify management, but a developer and a receptionist do not necessarily have the same needs.",
          },
          {
            da: "Afprøv en repræsentativ maskine med jeres dockingstation, skærme, VPN og styringsværktøjer. Bed om alternativer, hvis den samme konfiguration ikke kan skaffes senere. Vurder også, om gammelt udstyr kan opgraderes, før alle arbejdspladser udskiftes.",
            en: "Trial a representative machine with your dock, monitors, VPN and management tools. Ask about alternatives if the same configuration cannot be sourced later. Also assess whether existing equipment can be upgraded before replacing every workstation.",
          },
        ],
      },
      {
        heading: { da: "Windows og genbrug skal også passe", en: "Windows and reuse must fit too" },
        body: [
          {
            da: "Microsofts PC Health Check er udgangspunktet for en eksisterende Windows-pc. En RAM- eller SSD-opgradering fjerner ikke et problem med en ikke-understøttet processor. Windows 10 22H2 er ude af almindelig support; særskilt ESU og LTSC skal vurderes efter deres egne vilkår.",
            en: "Microsoft's PC Health Check is the starting point for an existing Windows PC. Upgrading RAM or SSD does not solve an unsupported processor. Windows 10 22H2 is out of general support; separate ESU and LTSC options must be assessed under their own terms.",
          },
          {
            da: "At beholde brugbart udstyr længere kan undgå en unødvendig udskiftning. Det er ikke det samme som en dokumenteret CO₂-besparelse for et bestemt køb; transport, klargøring, strømforbrug og faktisk forlænget brugstid skal indgå i sådan et regnestykke.",
            en: "Keeping useful equipment longer can avoid an unnecessary replacement. That is not the same as a verified carbon saving for a particular purchase; transport, preparation, power use and actual extended service life belong in that calculation.",
          },
        ],
      },
    ],
    closing: {
      da: "Beskriv opgaver, antal og budget, så mulighederne kan sammenlignes på samme grundlag. Pris og tilgængelighed bekræftes ved en konkret forespørgsel.",
      en: "Describe workloads, quantity and budget so the options can be compared on the same basis. Price and availability are confirmed for a specific enquiry.",
    },
    related: [
      {
        href: "/vejledninger/refurbished-eller-brugt",
        label: {
          da: "Hvad betyder refurbished og brugt?",
          en: "What do refurbished and used mean?",
        },
      },
      {
        href: "/vejledninger/tjek-brugt-baerbar-foer-koeb",
        label: { da: "Tjeklisten før køb", en: "The pre-purchase checklist" },
      },
      {
        href: "/vejledninger/reparere-eller-koebe-ny",
        label: {
          da: "Kan den gamle computer beholdes?",
          en: "Can you keep the existing computer?",
        },
      },
      {
        href: "/produkter/baerbare-computere",
        label: { da: "Bærbare efter arbejdsbehov", en: "Laptops by workload" },
      },
      {
        href: "/flaadeloesninger",
        label: { da: "Planlæg flere arbejdspladser", en: "Plan multiple workstations" },
      },
    ],
    sources: [
      guideSource("pcHealthCheck"),
      guideSource("windows10Servicing"),
      guideSource("thinkpadX1CarbonGen7"),
    ],
    faqs: [
      {
        question: {
          da: "Er refurbished altid billigere end nyt?",
          en: "Is refurbished always cheaper than new?",
        },
        answer: {
          da: "Nej. Sammenlign den nødvendige konfiguration, batteri, dele, opsætning, tilbehør og vilkår. En billigere købspris kan blive spist op af manglende dele eller en maskine, der ikke løser opgaven.",
          en: "No. Compare the required configuration, battery, parts, setup, accessories and terms. A lower purchase price can be outweighed by missing parts or a machine that cannot do the work.",
        },
      },
      {
        question: {
          da: "Er en refurbished bærbar god til en startup?",
          en: "Is a refurbished laptop suitable for a startup?",
        },
        answer: {
          da: "Det kan den være, hvis den passer til programmerne, har et understøttet styresystem og er prissat med nødvendig opsætning. Definér først arbejdsopgaver og budget; brug ikke alle pengene på en modelbetegnelse.",
          en: "It can be, if it suits the applications, has a supported operating system and is priced with the necessary setup. Define workloads and budget first; do not spend everything on a model name.",
        },
      },
    ],
  },
  {
    slug: "hvor-meget-kan-en-baerbar-opgraderes",
    cluster: "memory-storage",
    type: "grundviden",
    intent: "informational-commercial",
    primaryKeyword: "hvor meget kan en bærbar opgraderes",
    author: "alireza",
    title: {
      da: "Hvor meget kan en bærbar opgraderes? RAM, SSD og Windows",
      en: "How far can you upgrade a laptop? RAM, SSD and Windows",
    },
    metaTitle: {
      da: "Hvor meget kan en bærbar opgraderes? RAM og SSD | Kestro",
      en: "Laptop upgrade limits: RAM, SSD and Windows | Kestro",
    },
    metaDescription: {
      da: "Kan din bærbare få mere RAM, SSD eller Windows 11? Tjek model, sokler og krav, og se, hvad du selv kan gøre. Med kilder og trin til et sikkert skift.",
      en: "Is your laptop fit for a RAM or SSD upgrade? Check model, slots and Windows 11 eligibility. See real limits and safety tips before you fit a new part.",
    },
    summary: {
      da: "8. eller 9. generation er ikke nok at vide. Model, sokler, BIOS og lagerinterface afgør grænsen.",
      en: "Knowing 8th or 9th generation is not enough. Model, slots, BIOS and storage interface determine the limits.",
    },
    audience: {
      da: "Ejere af ældre bærbare og IT-ansvarlige",
      en: "Owners of older laptops and IT managers",
    },
    readingMinutes: 8,
    published: "2026-10-16",
    updated: "2026-10-19",
    tldr: {
      da: "Den præcise model bestemmer, hvad der kan opgraderes. To bærbare med en 8. generations processor kan have henholdsvis udskiftelig DDR4 og fastloddet LPDDR3. Find producentens manual, kontrollér RAM-sokler og SSD-interface, og vurder Windows med PC Health Check. Maksimal understøttet kapacitet er ikke nødvendigvis det, du har brug for eller bør betale for.",
      en: "The exact model determines upgrade options. Two laptops with an 8th-generation processor can have replaceable DDR4 or soldered LPDDR3. Find the manufacturer manual, check memory slots and SSD interface, and assess Windows with PC Health Check. Maximum supported capacity is not necessarily the amount you need or should pay for.",
    },
    intro: {
      da: "En generation beskriver en produktfamilie, ikke hele computeren. Denne guide viser, hvordan du finder grænsen uden at købe en del på gæt. Modelnavnene nedenfor er tekniske eksempler, ikke en anbefaling om at købe en bestemt maskine.",
      en: "A generation describes a product family, not the entire computer. This guide shows how to find the limit without guessing which part to buy. The model names below are technical examples, not recommendations to buy a specific machine.",
    },
    sections: [
      {
        heading: {
          da: "Find modellen, før du finder delen",
          en: "Find the model before finding the part",
        },
        body: [
          {
            da: "Notér producent, fuldt modelnavn, generation og maskintype eller produktnummer fra mærkaten eller systemoplysningerne. Slå den variant op hos producenten. Et familienavn som ThinkPad eller Latitude er ikke tilstrækkeligt.",
            en: "Record manufacturer, full model name, generation and machine type or product number from the label or system information. Look up that variant with its manufacturer. A family name such as ThinkPad or Latitude is not enough.",
          },
          {
            da: "Find både specifikationsarket og servicemanualen: det første beskriver understøttede dele, det andet adgangen og sikkerhedsproceduren. CPU-producentens maksimum er ikke automatisk det maksimum, den færdige bærbare understøtter.",
            en: "Find both the specification sheet and service manual: the first describes supported parts, the second access and safety procedures. The CPU manufacturer's maximum is not automatically the maximum supported by the finished laptop.",
          },
        ],
      },
      {
        heading: {
          da: "8., 9. eller 11. generation: konkrete forskelle",
          en: "8th, 9th or 11th generation: real differences",
        },
        body: [
          {
            da: "Tabellen gengiver Lenovos angivne konfigurationer og testede RAM-maksima. Det er ikke en garanti for alle varianter eller en påstand om den absolutte elektriske grænse. Kontrollér altid det konkrete produktnummer før køb.",
            en: "This table follows Lenovo's listed configurations and tested RAM maxima. It is not a guarantee for every variant or a claim about the absolute electrical limit. Always check the exact product number before buying.",
          },
        ],
        table: {
          caption: {
            da: "Eksempler fra producentens PSREF",
            en: "Examples from manufacturer PSREF specifications",
          },
          head: [
            { da: "Eksempel", en: "Example" },
            { da: "RAM og angivet maksimum", en: "RAM and listed maximum" },
            { da: "Lager: hvad skal kontrolleres?", en: "Storage: what needs checking?" },
          ],
          rows: [
            [
              {
                da: "T480 med 8. gen. Core; findes også med 7. gen.",
                en: "T480 with 8th-gen Core; 7th-gen variants also exist",
              },
              {
                da: "To DDR4 SO-DIMM-sokler. Lenovo angiver 32 GB.",
                en: "Two DDR4 SO-DIMM slots. Lenovo lists 32 GB.",
              },
              {
                da: "Primært 2,5-tommer SATA eller M.2 NVMe med passende adapter; ikke to frie primære pladser.",
                en: "Primary 2.5-inch SATA or M.2 NVMe with the appropriate adapter; not two free primary bays.",
              },
            ],
            [
              { da: "X1 Carbon Gen 7 med 8. gen. Core", en: "X1 Carbon Gen 7 with 8th-gen Core" },
              {
                da: "8 eller 16 GB LPDDR3, fastloddet. Ingen RAM-sokkel.",
                en: "8 or 16 GB soldered LPDDR3. No memory slot.",
              },
              {
                da: "Én M.2 2280 SSD. PSREF angiver SATA- og NVMe-varianter; kontrollér den konkrete del.",
                en: "One M.2 2280 SSD. PSREF lists SATA and NVMe variants; verify the actual part.",
              },
            ],
            [
              { da: "P53 med 9. gen. Core", en: "P53 with 9th-gen Core" },
              {
                da: "Fire DDR4 SO-DIMM-sokler, op til 128 GB. ECC kræver særskilt Xeon-konfiguration.",
                en: "Four DDR4 SO-DIMM slots, up to 128 GB. ECC needs a separate Xeon configuration.",
              },
              {
                da: "Flere drev er mulige; 2,5-tommer- og M.2-layout afhænger af konfigurationen.",
                en: "Multiple drives are possible; 2.5-inch and M.2 layout depends on configuration.",
              },
            ],
            [
              { da: "T14 Gen 2 Intel med 11. gen. Core", en: "T14 Gen 2 Intel with 11th-gen Core" },
              {
                da: "8/16 GB fastloddet + én DDR4-sokkel. Angivet maksimum 40/48 GB.",
                en: "8/16 GB soldered + one DDR4 slot. Listed maximum 40/48 GB.",
              },
              {
                da: "Én M.2 PCIe-plads. RAM- og lageroplysninger gælder Intel-varianten, ikke alle T14.",
                en: "One M.2 PCIe slot. Memory and storage details concern the Intel variant, not every T14.",
              },
            ],
          ],
        },
      },
      {
        heading: { da: "Hvilken RAM kan du sætte i?", en: "Which memory can you install?" },
        body: [
          {
            da: "Kontrollér, om RAM er fastloddet, sidder i sokler eller er en blanding. Dernæst skal type, formfaktor, kapacitet pr. sokkel, samlet kapacitet og producentens hastighedskrav passe. DDR4 og DDR5 er ikke udskiftelige; køb ikke efter GB alene.",
            en: "Check whether memory is soldered, socketed or a mixture. Then match type, form factor, capacity per slot, total capacity and manufacturer speed requirements. DDR4 and DDR5 are not interchangeable; do not buy by gigabytes alone.",
          },
          {
            da: "Mere RAM gør ikke automatisk processoren hurtigere. Mål forbruget under dine normale programmer. Hvis maskinen mangler hukommelse, kan mere hjælpe; hvis CPU, varme eller netværk er flaskehalsen, skal problemet findes dér.",
            en: "More memory does not automatically make the processor faster. Measure usage in your normal applications. More can help a memory-constrained machine; if CPU, heat or networking is the bottleneck, investigate that instead.",
          },
        ],
      },
      {
        heading: { da: "Hvilken harddisk eller SSD passer?", en: "Which hard drive or SSD fits?" },
        body: [
          {
            da: "M.2 beskriver en formfaktor, ikke i sig selv SATA eller PCIe NVMe. Kontrollér interface, længde, tykkelse, stik, beslag, køling og producentens understøttelse. En ledig sokkel til mobilnet er ikke automatisk en ekstra SSD-plads.",
            en: "M.2 describes a form factor, not SATA or PCIe NVMe by itself. Check interface, length, thickness, connector, mounting hardware, cooling and manufacturer support. An empty mobile-network slot is not automatically an extra SSD slot.",
          },
          {
            da: "T480 er et godt eksempel: den primære lagerplads kan være sat op til 2,5-tommer SATA eller NVMe med en adapter. Du kan ikke konkludere ud fra kabinetnavnet, at et vilkårligt M.2-drev passer. Et skift af systemdrev kræver også en plan for dataflytning eller geninstallation.",
            en: "T480 is a useful example: the primary storage bay may be configured for 2.5-inch SATA or NVMe through an adapter. The chassis name does not tell you that an arbitrary M.2 drive fits. Replacing a system drive also requires a migration or reinstallation plan.",
          },
        ],
      },
      {
        heading: {
          da: "Hvilken Windows kan en ældre bærbar bruge?",
          en: "Which Windows can an older laptop use?",
        },
        body: [
          {
            da: "Svar ikke kun »8. generation eller nyere«. Kontrollér den præcise processor, TPM 2.0, UEFI/Secure Boot-egnethed og de øvrige krav med Microsofts PC Health Check. Resultatet og producentens drivere er vigtigere end sælgerens generationsmærkat. En T480 kan for eksempel have enten 7. eller 8. generations CPU.",
            en: "Do not answer simply 8th generation or newer. Check the exact processor, TPM 2.0, UEFI/Secure Boot capability and other requirements with Microsoft's PC Health Check. Its result and manufacturer drivers matter more than a seller's generation label. A T480, for example, can have a 7th- or 8th-generation CPU.",
          },
          {
            da: "At Windows kan installeres, betyder ikke, at kombinationen er understøttet. Microsoft fraråder Windows 11 på hardware, der ikke opfylder kravene. Windows 10 22H2 mistede almindelig support 14. oktober 2025; ESU og LTSC er særskilte ordninger med egne krav og datoer, ikke en permanent løsning til alle.",
            en: "Being able to install Windows does not make the combination supported. Microsoft advises against Windows 11 on hardware that fails the requirements. Windows 10 22H2 lost general support on 14 October 2025; ESU and LTSC are separate arrangements with their own requirements and dates, not permanent options for everyone.",
          },
          {
            da: "På en administreret firmacomputer skal IT-ansvarlige godkende ændringen. Et andet understøttet styresystem kan være en mulighed, men kontrollér programmer, printere, dockingstation og sikkerhedsstyring først.",
            en: "For a managed company computer, IT must approve the change. Another supported operating system may be an option, but check applications, printers, docking and security management first.",
          },
        ],
      },
      {
        heading: {
          da: "Kan en almindelig bruger gøre det hjemme?",
          en: "Can an ordinary user do it at home?",
        },
        body: [
          {
            da: "Nogle RAM- og SSD-skift er egnede til en omhyggelig bruger med korrekt værktøj og en modelspecifik manual. Andre kræver omfattende adskillelse, specialdele eller professionel service. Hvor svært det er, afhænger helt af modellen.",
            en: "Some memory and SSD replacements suit a careful user with the right tools and model-specific manual. Others require extensive disassembly, specialist parts or professional service. How hard it is depends entirely on the model.",
          },
        ],
        list: [
          {
            da: "Tag en kontrolleret sikkerhedskopi, og find BitLocker-genoprettelsesnøglen før hardware- eller BIOS-ændringer. Del ikke nøglen offentligt.",
            en: "Make a verified backup and locate the BitLocker recovery key before hardware or BIOS changes. Do not share the key publicly.",
          },
          {
            da: "Følg manualens rækkefølge for nedlukning, frakobling af strøm og isolering af batteriet. Brug ESD-beskyttelse; rør ikke kontakter.",
            en: "Follow the manual's sequence for shutdown, disconnecting power and isolating the battery. Use ESD protection and avoid touching contacts.",
          },
          {
            da: "Stop ved opsvulmet batteri, væskeskade, fastloddet komponent eller noget, der skal tvinges fri. Batterier må ikke punkteres eller bøjes.",
            en: "Stop for a swollen battery, liquid damage, a soldered component or anything that needs forcing. Never puncture or bend batteries.",
          },
          {
            da: "Saml alle dæksler og skruer korrekt, kontrollér registreret RAM og lager, og kør producentens diagnosticering efter arbejdet.",
            en: "Refit covers and screws correctly, verify detected memory and storage, and run manufacturer diagnostics afterwards.",
          },
        ],
      },
      {
        heading: {
          da: "Hvornår er opgraderingen pengene værd?",
          en: "When is the upgrade worth paying for?",
        },
        body: [
          {
            da: "Sammenlign dele, arbejdstid, dataflytning og eventuelt batteri med en passende erstatning. Behold helst den nuværende maskine, hvis en dokumenteret flaskehals kan løses, kabinettet er sundt, og software kan understøttes. Overvej udskiftning, hvis begrænsningen er fastloddet RAM, utilstrækkelig CPU/GPU eller manglende support.",
            en: "Compare parts, labour, migration and any battery with a suitable replacement. Keeping the existing machine makes sense when a demonstrated bottleneck can be fixed, the chassis is sound and software can be supported. Consider replacement for insufficient soldered RAM, inadequate CPU/GPU or missing support.",
          },
          {
            da: "Producentens maksimum er et loft for en bestemt konfiguration, ikke en indkøbsliste. Køb den kapacitet, arbejdsopgaven har brug for, med en rimelig margin og en pris, du har fået bekræftet.",
            en: "The manufacturer maximum is a ceiling for a particular configuration, not a shopping list. Buy the capacity your workload needs, with reasonable headroom and a confirmed price.",
          },
        ],
      },
    ],
    closing: {
      da: "Send det fulde modelnavn og den nuværende konfiguration, hvis du ønsker en vurdering. Undlad at sende adgangskoder eller genoprettelsesnøgler.",
      en: "Send the full model name and current configuration for an assessment. Do not send passwords or recovery keys.",
    },
    related: [
      {
        href: "/vejledninger/opgrader-ram-i-baerbar",
        label: { da: "RAM: kontrol og sikkert skift", en: "Memory: checks and safe replacement" },
      },
      {
        href: "/vejledninger/hdd-eller-ssd",
        label: { da: "Er disken HDD eller SSD?", en: "Is the drive an HDD or an SSD?" },
      },
      {
        href: "/vejledninger/windows-11-paa-aeldre-maskine",
        label: { da: "Windows 11 på ældre hardware", en: "Windows 11 on older hardware" },
      },
      {
        href: "/vejledninger/reparere-eller-koebe-ny",
        label: {
          da: "Regnestykket: reparere eller udskifte",
          en: "The calculation: repair or replace",
        },
      },
      {
        href: "/reparation/ram-og-ssd-opgradering",
        label: { da: "Få vurderet RAM og SSD", en: "Have memory and storage assessed" },
      },
    ],
    sources: [
      guideSource("thinkpadT480Specs"),
      guideSource("thinkpadX1CarbonGen7"),
      guideSource("thinkpadP53Specs"),
      guideSource("thinkpadT14Gen2Intel"),
      guideSource("memoryGenerations"),
      guideSource("pcHealthCheck"),
      guideSource("unsupportedWindows11"),
      guideSource("windows10Servicing"),
      guideSource("laptopServiceSafety"),
      guideSource("swollenBatterySafety"),
      guideSource("bitlockerRecovery"),
    ],
    faqs: [
      {
        question: {
          da: "Kan alle bærbare med 8. generation få 32 GB RAM?",
          en: "Can every 8th-generation laptop take 32 GB RAM?",
        },
        answer: {
          da: "Nej. Som konkrete eksempler har T480 to DDR4-sokler og et Lenovo-angivet maksimum på 32 GB, mens X1 Carbon Gen 7 har 8 eller 16 GB fastloddet LPDDR3 uden RAM-sokler. Den præcise model er afgørende.",
          en: "No. As concrete examples, T480 has two DDR4 slots and a Lenovo-listed 32 GB maximum, whereas X1 Carbon Gen 7 has 8 or 16 GB soldered LPDDR3 without memory slots. The exact model is decisive.",
        },
      },
      {
        question: {
          da: "Kan CPU eller grafikkort opgraderes ligesom RAM?",
          en: "Can CPU or graphics be upgraded like RAM?",
        },
        answer: {
          da: "Det skal undersøges i servicemanualen. I mange bærbare er CPU og GPU integreret eller fastloddet, og køling, strøm og BIOS begrænser mulighederne. Gå ikke ud fra, at det er et enkelt modulskift, bare fordi en stationær pc kan opgraderes sådan.",
          en: "Check the service manual. In many laptops the CPU and GPU are integrated or soldered, and cooling, power and BIOS constrain the options. Do not assume a simple module swap just because a desktop can be upgraded that way.",
        },
      },
    ],
  },
  {
    slug: "windows-10-support-slutter",
    cluster: "lifecycle",
    type: "erhvervs-it",
    intent: "informational-commercial",
    primaryKeyword: "windows 10 support slut virksomhed",
    author: "alireza",
    title: {
      da: "Windows 10: supporten er slut – hvad gør virksomheden nu?",
      en: "Windows 10 support has ended — what now for your company?",
    },
    metaTitle: {
      da: "Windows 10-support slut: hvad gør virksomheden nu? | Kestro",
      en: "Windows 10 end of support: what companies do now | Kestro",
    },
    metaDescription: {
      da: "Windows 10-support er slut. Se jeres valg med ESU, LTSC og Windows 11, og hvad I bør tjekke, før I opgraderer eller udskifter firmaets computere.",
      en: "Windows 10 support has ended. Check ESU, LTSC and Windows 11 options for PCs, with a checklist for deciding what to upgrade, keep or replace.",
    },
    summary: {
      da: "Almindelig support er slut; ESU og LTSC har særskilte vilkår. Kontrollér hver maskines udgave, dækning og næste skridt.",
      en: "General support has ended; ESU and LTSC have separate terms. Check each device's edition, coverage and next step.",
    },
    audience: {
      da: "Virksomheder med maskiner på Windows 10",
      en: "Companies with machines still on Windows 10",
    },
    readingMinutes: 7,
    published: "2026-08-31",
    updated: "2026-10-16",
    tldr: {
      da: "Den almindelige support til Windows 10 22H2 sluttede 14. oktober 2025. ESU og LTSC har særskilte vilkår og datoer. Kontrollér derfor udgave, faktisk opdateringsdækning og Windows 11-egnethed pr. maskine. Planlæg derefter opgradering, understøttet midlertidig drift eller udskiftning med ansvar og frist; en supportdato er ikke i sig selv en ordre om nyt udstyr.",
      en: "General Windows 10 22H2 support ended on 14 October 2025. ESU and LTSC have separate terms and dates. Check edition, actual update coverage and Windows 11 eligibility per device. Then plan upgrading, supported temporary operation or replacement with an owner and deadline; a support date does not itself require buying new hardware.",
    },
    intro: {
      da: "Den almindelige support til Windows 10 version 22H2 sluttede 14. oktober 2025. Maskiner tilmeldt Extended Security Updates (ESU) kan fortsat få sikkerhedsrettelser; LTSC-udgaver har særskilte livscyklusser. Denne vejledning hjælper jer med at afklare opdateringer, Windows 11 og udskiftning – uden at skifte maskiner unødigt.",
      en: "General support for Windows 10 version 22H2 ended on 14 October 2025. Devices enrolled in Extended Security Updates (ESU) can still receive security fixes; LTSC editions have separate lifecycles. This guide helps you assess updates, Windows 11 and replacement without replacing machines unnecessarily.",
    },
    sections: [
      {
        heading: {
          da: "Hvad der faktisk skete den 14. oktober 2025",
          en: "What actually happened on 14 October 2025",
        },
        body: [
          {
            da: "Microsoft afsluttede almindelige opdateringer og teknisk support til Windows 10 version 22H2. ESU giver særskilt adgang til sikkerhedsrettelser, og LTSC har andre supportdatoer. Ingen maskine blev slukket, ingen licens holdt op med at virke, og ingen fil forsvandt som følge af slutdatoen.",
            en: "Microsoft ended general updates and technical support for Windows 10 version 22H2. ESU provides separate access to security fixes, and LTSC has different support dates. The end date did not switch machines off, invalidate licences or remove files.",
          },
          {
            da: "Uden relevant ESU-dækning eller en fortsat understøttet LTSC-udgave kan I ikke regne med fortsatte sikkerhedsrettelser. Kontrollér den konkrete udgave og tilmelding; en computer, der starter normalt, dokumenterer ikke, at den er dækket.",
            en: "Without relevant ESU coverage or a still-supported LTSC edition, you cannot rely on continued security fixes. Check the actual edition and enrolment; a computer starting normally does not demonstrate coverage.",
          },
          {
            da: "Datoer og vilkår herunder kommer fra Microsoft, og det er Microsoft, der kan ændre dem. Siden her bærer sin redigeringsdato øverst – brug den til at vurdere, hvor gammel informationen er, og slå det aktuelle op hos Microsoft, før I træffer en beslutning, der koster penge.",
            en: "The dates and terms below come from Microsoft, and Microsoft is who can change them. This page carries its edit date at the top — use it to judge how old the information is, and check Microsoft's current position before making a decision that costs money.",
          },
        ],
      },
      {
        heading: {
          da: "Support og hardwarekrav er to forskellige spørgsmål",
          en: "Support status and hardware eligibility are two different questions",
        },
        body: [
          {
            da: "De to bliver tit blandet sammen, når talen falder på det her, og det fører til forkerte beslutninger begge veje. Spørgsmålene er uafhængige.",
            en: "The two often get mixed together when this comes up, and that leads to wrong decisions in both directions. The questions are independent.",
          },
          {
            da: "Det første handler om styresystemet: får den konkrete maskine stadig sikkerhedsrettelser? Kontrollér Windows-udgave og supportdato, og om en gyldig ESU-tilmelding faktisk er aktiveret. En nyere maskine med Windows 10 version 22H2 uden ESU får ikke almindelige sikkerhedsopdateringer alene på grund af sin alder.",
            en: "The first concerns the operating system: does this particular device still receive security fixes? Check the Windows edition, support date and whether valid ESU enrolment is actually active. A newer device running Windows 10 version 22H2 without ESU does not receive general security updates simply because it is newer.",
          },
          {
            da: "Det andet handler om den enkelte maskine: må den installere Windows 11? Her er svaret forskelligt fra maskine til maskine, og det afgøres af TPM 2.0, Secure Boot i UEFI-tilstand, og om processoren står på Microsofts liste. Kravene, og hvordan I tjekker dem, står i vejledningen om Windows 11 på en ældre maskine.",
            en: "The second is about the individual machine: is it allowed to install Windows 11? Here the answer differs from machine to machine, decided by TPM 2.0, Secure Boot in UEFI mode, and whether the processor is on Microsoft's list. The requirements and how to check them are in our guide on Windows 11 on an older machine.",
          },
          {
            da: "Konsekvensen er værd at holde fast i: »vores maskiner er kun tre år gamle« svarer ikke på det første spørgsmål, og »Windows 10 er udløbet« svarer ikke på det andet. I skal have begge svar, før I ved, hvad opgaven koster.",
            en: "The consequence is worth holding on to: “our machines are only three years old” does not answer the first question, and “Windows 10 has expired” does not answer the second. You need both answers before you know what the job costs.",
          },
        ],
      },
      {
        heading: {
          da: "ESU: den betalte forlængelse",
          en: "ESU: the paid extension",
        },
        body: [
          {
            da: "Microsoft tilbyder Extended Security Updates til organisationer: sikkerhedsrettelser til Windows 10 mod betaling, købt et år ad gangen i et begrænset antal år efter slutdatoen. Det er rettelser og ikke andet – ingen nye funktioner og ingen almindelig teknisk support.",
            en: "Microsoft offers Extended Security Updates to organisations: paid security fixes for Windows 10, bought a year at a time for a limited number of years past the end date. It is fixes and nothing else — no new features and no general technical support.",
          },
          {
            da: "ESU er en bro, ikke en destination. Prisen stiger for hvert år, man forlænger, og slutdatoen rykker sig kun – den forsvinder ikke. Brug programmet til at skifte maskinerne ud i den rigtige rækkefølge i stedet for alle på én weekend. Brug det ikke til at udskyde beslutningen.",
            en: "ESU is a bridge, not a destination. The price rises with each year you extend, and the end date only moves — it does not disappear. Use the programme to replace machines in the right order rather than all in one weekend. Do not use it to put off the decision.",
          },
          {
            da: "Vi oplyser ikke priser eller nøjagtige vilkår her, fordi de ændrer sig, og fordi de afhænger af, hvilke aftaler I har i forvejen. Spørg jeres Microsoft-partner eller slå programmet op hos Microsoft.",
            en: "We do not quote prices or exact terms here, because they change and because they depend on the agreements you already have. Ask your Microsoft partner or look the programme up with Microsoft.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad I bør tjekke på de maskiner, I har",
          en: "What to check on the machines you already have",
        },
        body: [
          {
            da: "Opgørelsen er det eneste, der gør resten af beslutningen billig. Uden den bliver svaret enten »vi skifter det hele«, som koster for meget, eller »vi venter«, som ikke er en beslutning. Gå listen igennem én maskine ad gangen.",
            en: "The inventory is the one thing that makes the rest of the decision cheap. Without it the answer is either “we replace everything”, which costs too much, or “we wait”, which is not a decision. Go through the list one machine at a time.",
          },
        ],
        list: [
          {
            da: "Hvor mange maskiner kører reelt stadig Windows 10? Tallet er tit et andet end det, man husker.",
            en: "How many machines are actually still on Windows 10? The number is often not the one people remember.",
          },
          {
            da: "Opfylder maskinen Windows 11-kravene – TPM 2.0, Secure Boot i UEFI, processor på listen?",
            en: "Does the machine meet the Windows 11 requirements — TPM 2.0, Secure Boot in UEFI, processor on the list?",
          },
          {
            da: "Hvordan står maskinen fysisk? Batteri, lagerplads og hukommelse afgør, om den er værd at tage med videre, også når den kan opgraderes.",
            en: "What condition is the machine in? Battery, storage and memory decide whether it is worth taking forward, even when it can be upgraded.",
          },
          {
            da: "Hvad bruges den til? En maskine i receptionen og en maskine til konstruktion har ikke det samme svar.",
            en: "What is it used for? A reception machine and an engineering workstation do not have the same answer.",
          },
          {
            da: "Er den dækket af ESU i dag, og hvor længe? Det afgør, hvor meget tid I reelt har.",
            en: "Is it covered by ESU today, and for how long? That decides how much time you actually have.",
          },
          {
            da: "Behandler den personoplysninger? GDPR kræver passende tekniske foranstaltninger, og en maskine, der ikke længere modtager sikkerhedsopdateringer, er svær at argumentere for som passende. Tag den del med den, der har ansvaret for databeskyttelse hos jer – det er en vurdering, ikke en formalitet.",
            en: "Does it handle personal data? The GDPR requires appropriate technical measures, and a machine that no longer receives security updates is hard to argue is appropriate. Take that part to whoever is responsible for data protection with you — it is a judgement, not a formality.",
          },
          {
            da: "Er den på leasing eller stadig i garanti? Det ændrer, hvornår det giver mening at skifte den.",
            en: "Is it leased or still under warranty? That changes when replacing it makes sense.",
          },
        ],
      },
      {
        heading: {
          da: "Tre veje – og de fleste flåder skal bruge alle tre",
          en: "Three routes — and most fleets need all three",
        },
        body: [
          {
            da: "Opgrader. Opfylder maskinen kravene, og er den i øvrigt god nok til opgaven, er opgraderingen til Windows 11 den billigste vej. Microsoft har hidtil stillet opgraderingen til rådighed uden beregning for maskiner med en gyldig Windows 10-licens, der opfylder kravene – bekræft det aktuelle vilkår, før I planlægger ud fra det. For mange flåder er det her, størstedelen af maskinerne ender.",
            en: "Upgrade. If the machine meets the requirements and is otherwise good enough for the job, upgrading to Windows 11 is the cheapest route. Microsoft has so far made the upgrade available at no charge for machines with a valid Windows 10 licence that meet the requirements — confirm the current terms before planning around it. For many fleets this is where most machines end up.",
          },
          {
            da: "Udskift. Undersøg erstatning, når nødvendig software ikke kan understøttes, eller maskinen ikke kan løse opgaven efter en rimelig forbedring. Det behøver ikke være nyt udstyr: en egnet refurbished konfiguration kan også vurderes. Bekræft kompatibilitet, stand og tilgængelighed konkret.",
            en: "Replace. Investigate replacement when necessary software cannot be supported or the computer cannot do the job after a reasonable improvement. Replacement need not be new: a suitable refurbished configuration can also be assessed. Confirm compatibility, condition and availability specifically.",
          },
          {
            da: "Planlæg. Nogle maskiner kan vente: dem uden netværk, dem uden personoplysninger, dem, der er bundet til software, som ikke kan flytte endnu. At vente er et fint valg, når det er truffet med en dato og en begrundelse. Det er et dårligt valg, når det bare er det, der sker.",
            en: "Plan. Some machines can wait: the ones off the network, the ones with no personal data, the ones tied to software that cannot move yet. Waiting is a fine choice when it is made with a date and a reason. It is a poor choice when it is simply what happens.",
          },
          {
            da: "Det er sjældent, at en hel flåde falder i én af de tre kasser. Blandingen er det normale – og det er også derfor, opgørelsen er pengene værd, før nogen beslutter noget.",
            en: "It is rare for a whole fleet to fall into one of the three boxes. A mixture is the normal outcome — and that is also why the inventory is worth the effort before anyone decides anything.",
          },
        ],
      },
      {
        heading: {
          da: "Rækkefølgen, der gør det til et projekt frem for en brand",
          en: "The order that makes this a project rather than a fire",
        },
        body: [
          {
            da: "Lav opgørelsen først, og sortér derefter maskinerne i de tre veje. Beslut så, hvad der skal ske med dem, der går ud – de har en værdi, og den værdi kan modregnes i det, der kommer ind. Læg til sidst en rækkefølge, så udskiftningen sker i hold og ikke på én gang: en flåde, der skiftes samlet, skal også skiftes samlet næste gang.",
            en: "Do the inventory first, then sort the machines into the three routes. Then decide what happens to the ones going out — they have a value, and that value can be offset against what comes in. Finally set an order so the replacement happens in batches rather than all at once: a fleet replaced in one go has to be replaced in one go next time as well.",
          },
          {
            da: "Hvis I standardiserer på én konfiguration, mens I alligevel er i gang, bliver den næste runde nemmere. Det er sjældent muligt for hele flåden, men det er ofte muligt for den største gruppe af medarbejdere.",
            en: "If you standardise on one configuration while you are at it, the next round gets easier. That is rarely possible for the whole fleet, but it is often possible for the largest group of employees.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal en hel flåde gøres op, kan vi gennemgå listen med jer og sige, hvilke maskiner der kan opgraderes, og hvilke det bedre kan betale sig at skifte. Skal der skiftes noget, skaffer vi brugte erhvervsmaskiner, der opfylder Windows 11-kravene, og vi kan give et bud på de gamle samtidig. Der er ingen binding i at spørge.",
      en: "If a whole fleet needs assessing, we can go through the list with you and say which machines can be upgraded and which are better replaced. If something does need replacing, we source used business machines that meet the Windows 11 requirements, and we can price the old ones at the same time. Asking commits you to nothing.",
    },
    related: [
      {
        href: "/vejledninger/windows-11-paa-aeldre-maskine",
        label: {
          da: "Kravene til Windows 11, og hvordan I tjekker dem",
          en: "The Windows 11 requirements, and how to check them",
        },
      },
      {
        href: "/produkter",
        label: { da: "Udstyr, vi kan skaffe", en: "Equipment we can source" },
      },
      {
        href: "/tilbud",
        label: { da: "Få et tilbud på udskiftningen", en: "Get a quote for the replacement" },
      },
      {
        href: "/reparation/windows-installation",
        label: { da: "Geninstaller Windows", en: "Reinstall Windows" },
      },
    ],
    sources: [
      guideSource("windows10Servicing"),
      {
        href: {
          da: "https://www.microsoft.com/da-dk/windows/end-of-support",
          en: "https://www.microsoft.com/en-us/windows/end-of-support",
        },
        label: {
          da: "Microsoft: Windows 10 og ophør af support",
          en: "Microsoft: Windows 10 end of support",
        },
      },
    ],
    faqs: [
      {
        question: {
          da: "Holder vores Windows 10-maskiner op med at virke?",
          en: "Will our Windows 10 machines stop working?",
        },
        answer: {
          da: "Nej. De starter, kører og logger på som før. Det, der er stoppet, er sikkerhedsopdateringerne – og den forskel mærkes ikke på en bestemt dag, men når der bliver fundet en ny sårbarhed, og rettelsen ikke længere kommer til jer.",
          en: "No. They boot, run and log in as before. What has stopped is the security updates — and that difference is not felt on a particular day, but when a new vulnerability is found and the fix no longer reaches you.",
        },
      },
      {
        question: {
          da: "Er opgraderingen til Windows 11 gratis?",
          en: "Is the upgrade to Windows 11 free?",
        },
        answer: {
          da: "Microsoft har hidtil stillet opgraderingen til rådighed uden beregning for maskiner med en gyldig Windows 10-licens, der opfylder hardwarekravene. Vilkårene kan ændres, og de er Microsofts – bekræft det aktuelle, før I lægger et budget på det.",
          en: "Microsoft has so far made the upgrade available at no charge for machines with a valid Windows 10 licence that meet the hardware requirements. The terms can change and they are Microsoft's — confirm the current position before building a budget on it.",
        },
      },
      {
        question: {
          da: "Kan vi bare blive på Windows 10?",
          en: "Can we simply stay on Windows 10?",
        },
        answer: {
          da: "Teknisk set ja. Om det er forsvarligt, afhænger af, hvad maskinerne bruges til, om de er på netværket, og hvilke forpligtelser I har omkring de data, de behandler. ESU er den understøttede måde at købe sig tid på; at blive uden ESU er en risiko, nogen hos jer bør have taget stilling til frem for at arve.",
          en: "Technically yes. Whether it is defensible depends on what the machines are used for, whether they are on the network, and what obligations you have around the data they handle. ESU is the supported way to buy time; staying on without it is a risk somebody with you should have decided to accept rather than inherited.",
        },
      },
      {
        question: {
          da: "Hvor mange af vores maskiner skal skiftes?",
          en: "How many of our machines need replacing?",
        },
        answer: {
          da: "Det kan ikke besvares uden opgørelsen, og enhver, der svarer på det uden at have set listen, gætter. Det almindelige billede er en blanding: nogle kan opgraderes, nogle skal skiftes, og nogle kan vente.",
          en: "That cannot be answered without the inventory, and anyone who answers it without seeing the list is guessing. The usual picture is a mixture: some can be upgraded, some need replacing, and some can wait.",
        },
      },
      {
        question: {
          da: "Kan I hjælpe med at vurdere flåden?",
          en: "Can you help assess the fleet?",
        },
        answer: {
          da: "Ja. Send en liste over maskinerne – model og cirka alder er nok til at komme i gang – så gennemgår vi den med jer. Skal der skaffes noget, kan vi regne på det, og skal noget ud, kan vi byde på det samtidig.",
          en: "Yes. Send a list of the machines — model and rough age is enough to start — and we will go through it with you. If something needs sourcing we can price it, and if something is going out we can bid on it at the same time.",
        },
      },
    ],
  },
  {
    slug: "refurbished-eller-brugt",
    cluster: "buying-condition",
    type: "grundviden",
    intent: "informational-commercial",
    primaryKeyword: "refurbished vs brugt",
    author: "alireza",
    title: {
      da: "Refurbished eller brugt: hvad er forskellen?",
      en: "Refurbished or used: what is the difference?",
    },
    metaTitle: {
      da: "Refurbished vs. brugt computer: forskellen | Kestro",
      en: "Refurbished vs used laptops: the difference | Kestro",
    },
    metaDescription: {
      da: "Refurbished eller brugt computer? Se, hvad ordene betyder, og hvad I skal tjekke om stand, batteri og test. Få en tjekliste til jeres næste indkøb.",
      en: "Refurbished or used laptop? Learn what each term means and what to ask about condition, testing and battery health before choosing a computer.",
    },
    summary: {
      da: "To ord, der bruges i flæng, og en forskel, der afgør, hvad I får. Sådan finder I ud af, hvad der faktisk er lavet ved maskinen.",
      en: "Two words used interchangeably, and a difference that decides what you get. How to find out what was actually done to the machine.",
    },
    audience: {
      da: "Indkøbere og IT-ansvarlige",
      en: "Buyers and IT managers",
    },
    readingMinutes: 8,
    updated: "2026-08-31",
    tldr: {
      da: "Brugt beskriver maskinens historie: den har haft en ejer før. Refurbished beskriver et arbejde, nogen har udført på den bagefter – kontrol, rengøring, udskiftning af slidte dele, sletning af data. Forskellen er reel, men ordet er ikke en standard, nogen håndhæver. To sælgere kan bruge det om vidt forskellige processer, og derfor er spørgsmålet ikke, om en maskine er refurbished, men hvad der konkret blev gjort ved den.",
      en: "Used describes the machine's history: it had an owner before. Refurbished describes work somebody did to it afterwards — checking, cleaning, replacing worn parts, erasing data. The difference is real, but the word is not a standard anyone enforces. Two sellers can use it for completely different processes, which is why the question is not whether a machine is refurbished, but what was actually done to it.",
    },
    intro: {
      da: "De to ord står tit side om side i annoncer for brugt IT-udstyr, og de bliver brugt, som om de betyder det samme. Det gør de ikke – men forskellen ligger ikke i ordene. Den ligger i det arbejde, ordene påstår er udført, og det er dét, en indkøber skal have svar på.",
      en: "The two words often sit side by side in adverts for used IT equipment, and they get used as though they mean the same thing. They do not — but the difference is not in the words. It is in the work the words claim was done, and that is what a buyer needs an answer to.",
    },
    sections: [
      {
        heading: { da: "Hvad de to ord dækker", en: "What the two words cover" },
        body: [
          {
            da: "Brugt er en oplysning om historie. Maskinen har haft en ejer, den har været tændt, og den er solgt videre. Ordet siger ingenting om, hvilken stand den er i, om nogen har set på den, eller om der stadig ligger data på disken. En brugt maskine kan være upåklagelig, og den kan være defekt – begge dele er dækket af det samme ord.",
            en: "Used is a statement about history. The machine has had an owner, it has been switched on, and it has been sold on. The word says nothing about what condition it is in, whether anyone has looked at it, or whether there is still data on the drive. A used machine can be immaculate or it can be broken — the same word covers both.",
          },
          {
            da: "Refurbished er en oplysning om arbejde. Nogen har haft maskinen igennem en proces, før den blev sat til salg. Hvad den proces indeholder, varierer: den kan være en visuel gennemgang og en formatering, og den kan være funktionstest, udskiftning af batteri og disk, dokumenteret datasletning og ny opsætning. Begge dele bliver solgt under samme ord.",
            en: "Refurbished is a statement about work. Somebody has taken the machine through a process before putting it up for sale. What that process contains varies: it can be a visual check and a format, and it can be functional testing, a new battery and drive, documented data erasure and a fresh setup. Both are sold under the same word.",
          },
          {
            da: "Det er derfor, de to ord ikke er hinandens modsætninger. Alt refurbished udstyr er brugt. Ikke alt brugt udstyr er refurbished. Og to maskiner, der begge kaldes refurbished, kan have været gennem vidt forskellige processer.",
            en: "That is why the two words are not opposites. All refurbished equipment is used. Not all used equipment is refurbished. And two machines both called refurbished can have been through completely different processes.",
          },
        ],
        table: {
          caption: {
            da: "Hvad ordene brugt og refurbished siger om en maskine",
            en: "What the words used and refurbished say about a machine",
          },
          head: [
            { da: "", en: "" },
            { da: "Brugt", en: "Used" },
            { da: "Refurbished", en: "Refurbished" },
          ],
          rows: [
            [
              { da: "Hvad ordet beskriver", en: "What the word describes" },
              { da: "Maskinens historie", en: "The machine's history" },
              { da: "Et arbejde udført på maskinen", en: "Work performed on the machine" },
            ],
            [
              { da: "Siger noget om stand", en: "Says something about condition" },
              { da: "Nej", en: "No" },
              {
                da: "Kun hvis sælgeren beskriver processen",
                en: "Only if the seller describes the process",
              },
            ],
            [
              { da: "Test før salg", en: "Testing before sale" },
              { da: "Ikke underforstået", en: "Not implied" },
              { da: "Underforstået, men ikke ensartet", en: "Implied, but not consistent" },
            ],
            [
              { da: "Datasletning", en: "Data erasure" },
              { da: "Ikke underforstået", en: "Not implied" },
              {
                da: "Varierer, og dokumentation er sjældnere end sletning",
                en: "Varies, and documentation is rarer than erasure",
              },
            ],
            [
              { da: "Slidte dele skiftet", en: "Worn parts replaced" },
              { da: "Nej", en: "No" },
              {
                da: "Nogle gange – batteri og disk oftest",
                en: "Sometimes — battery and drive most often",
              },
            ],
            [
              { da: "Ord med en fast betydning", en: "A word with a fixed meaning" },
              { da: "Ja, i praksis", en: "Yes, in practice" },
              { da: "Nej", en: "No" },
            ],
          ],
        },
      },
      {
        heading: {
          da: "Hvorfor forskellen ikke er garanteret",
          en: "Why the difference is not guaranteed",
        },
        body: [
          {
            da: "Refurbished er et markedsføringsord, ikke en mærkning, som nogen kontrollerer. Der findes ikke en instans, der godkender, hvornår en sælger må bruge det, og der findes ikke ét sæt trin, alle følger. En sælger, der bruger tre timer per maskine, og en sælger, der bruger tre minutter, kan skrive det samme i annoncen.",
            en: "Refurbished is a marketing word, not a label anyone polices. There is no authority that approves when a seller may use it, and there is no single set of steps everyone follows. A seller who spends three hours per machine and a seller who spends three minutes can write the same thing in the advert.",
          },
          {
            da: "Det gør ikke ordet værdiløst. Det flytter bare, hvor man skal kigge: væk fra ordet og hen på beskrivelsen af, hvad der blev gjort. En sælger, der har lavet et reelt stykke arbejde, har som regel ikke noget imod at fortælle præcis, hvilket – og en, der ikke har, svarer i almindeligheder.",
            en: "That does not make the word worthless. It just moves where you have to look: away from the word and onto the description of what was done. A seller who has done real work usually has no objection to saying exactly what — and one who has not will answer in generalities.",
          },
          {
            da: "Der findes brancheordninger og standarder for dele af arbejdet, især for datasletning, hvor der findes anerkendte metodebeskrivelser. Om en konkret sælger følger dem, er noget, man skal spørge om og få skriftligt. Vi henviser ikke til en bestemt standard her, fordi vi ikke kan bekræfte, hvilken en given leverandør arbejder efter.",
            en: "There are industry schemes and standards for parts of the work, particularly for data erasure, where recognised method descriptions exist. Whether a given seller follows them is something to ask about and get in writing. We do not point to a specific standard here, because we cannot confirm which one any given supplier works to.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad der kan variere fra sælger til sælger",
          en: "What varies from seller to seller",
        },
        body: [
          {
            da: "Når to tilbud på samme model ligger langt fra hinanden i pris, er forskellen sjældent maskinen. Den er som regel en eller flere af posterne herunder.",
            en: "When two quotes on the same model are far apart on price, the difference is rarely the machine. It is usually one or more of the items below.",
          },
        ],
        list: [
          {
            da: "Hvor grundigt der er testet: en visuel gennemgang, en opstartstest, eller en gennemgang af porte, tastatur, skærm, batteri og lagermedie hver for sig.",
            en: "How thoroughly it was tested: a visual check, a boot test, or a run through ports, keyboard, screen, battery and drive one at a time.",
          },
          {
            da: "Hvad der er skiftet: ingenting, kun det defekte, eller også det slidte – batteri og lagermedie er de to, der oftest afgør, hvor længe maskinen holder hos jer.",
            en: "What was replaced: nothing, only what was broken, or the worn parts too — battery and drive are the two that most often decide how long the machine lasts with you.",
          },
          {
            da: "Hvordan data er håndteret: en formatering, en installation ovenpå, eller en egentlig sletning af lagermediet. De tre er ikke det samme, og kun den sidste fjerner data.",
            en: "How data was handled: a format, a reinstall on top, or an actual erasure of the drive. The three are not the same, and only the last removes data.",
          },
          {
            da: "Om der følger dokumentation med: en sletterapport, en liste over serienumre, en angivelse af batteriets målte tilstand. Dokumentation er det, der gør det muligt at kontrollere en påstand.",
            en: "Whether documentation comes with it: an erasure report, a list of serial numbers, a statement of the battery's measured condition. Documentation is what makes a claim checkable.",
          },
          {
            da: "Hvordan standen er beskrevet: en bogstavskala, en fritekstbeskrivelse eller ingenting. Skalaerne er sælgerens egne og betyder ikke det samme to steder.",
            en: "How condition is described: a letter scale, a free-text description, or nothing. The scales are the seller's own and do not mean the same thing in two places.",
          },
          {
            da: "Hvilke vilkår der gælder bagefter: hvad der er aftalt om fejl, hvor længe, og hvad I skal gøre. Vores egne vilkår står på siden om stand og kvalitet.",
            en: "What terms apply afterwards: what has been agreed about faults, for how long, and what you have to do. Our own terms are on the condition and quality page.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad der ændrer sig, når I køber mange maskiner",
          en: "What changes when you buy many machines",
        },
        body: [
          {
            da: "For én maskine er forskellen mellem brugt og refurbished en risiko, I bærer selv, og som kan løses med en returnering. For fyrre maskiner er den en driftsopgave. Det er dér, ordet holder op med at være en detalje.",
            en: "For one machine, the difference between used and refurbished is a risk you carry yourself, and one a return can solve. For forty machines it is an operations problem. That is where the word stops being a detail.",
          },
          {
            da: "Et konkret eksempel: fyrre maskiner købt som brugte uden ensartet proces kan have fem forskellige batteritilstande, tre forskellige diskstørrelser og to Windows-versioner. Hver afvigelse kan blive en supportsag hos jer i løbet af det første år. Fyrre maskiner gennem den samme proces har den samme opsætning, og afvigelserne er kendt på forhånd.",
            en: "A concrete example: forty machines bought as used with no consistent process can arrive with five different battery conditions, three different drive sizes and two Windows versions. Every deviation is a support case that lands with you during the first year. Forty machines through the same process have the same setup, and the deviations are known up front.",
          },
          {
            da: "Derfor er det spørgsmål, der betyder mest ved et større indkøb, ikke hvad den enkelte maskine fejler, men om alle maskiner har været gennem det samme. En liste over serienumre med den enkelte maskines tilstand er mere værd end en pæn beskrivelse af partiet som helhed.",
            en: "So the question that matters most on a larger purchase is not what is wrong with the individual machine, but whether all the machines went through the same thing. A list of serial numbers with each machine's condition is worth more than a nice description of the batch as a whole.",
          },
        ],
      },
      {
        heading: {
          da: "Hvad en virksomhed bør spørge om",
          en: "What a company should ask about",
        },
        body: [
          {
            da: "Spørgsmålene herunder handler om sælgerens proces, ikke om den enkelte maskine – det sidste står i vejledningen om, hvad man skal tjekke på en brugt bærbar. Stil dem, før I beder om en pris, så svaret ikke bliver skrevet bagefter.",
            en: "The questions below are about the seller's process, not the individual machine — that is covered in the guide on what to check on a used laptop. Ask them before you ask for a price, so the answer is not written afterwards.",
          },
        ],
        list: [
          {
            da: "Hvad indeholder jeres proces konkret, trin for trin?",
            en: "What does your process contain, step by step?",
          },
          {
            da: "Hvad blev testet på denne maskine, og hvad var resultatet?",
            en: "What was tested on this machine, and what was the result?",
          },
          {
            da: "Hvordan er lagermediet håndteret, og får vi dokumentation for det?",
            en: "How was the drive handled, and do we get documentation for it?",
          },
          {
            da: "Er batteriets tilstand målt, og hvad står der?",
            en: "Has the battery's condition been measured, and what does it say?",
          },
          {
            da: "Hvad betyder jeres standsbetegnelse helt præcist?",
            en: "What exactly does your condition grading mean?",
          },
          {
            da: "Hvad er aftalt, hvis der viser sig en fejl, og hvor længe gælder det?",
            en: "What is agreed if a fault turns up, and for how long does it apply?",
          },
          {
            da: "Får vi den samme konfiguration på tværs af hele leverancen?",
            en: "Do we get the same configuration across the whole delivery?",
          },
          {
            da: "Kan vi få det skriftligt, før vi bestiller?",
            en: "Can we have that in writing before we order?",
          },
        ],
      },
      {
        heading: { da: "Sådan ser vi på det hos Kestro", en: "How we see it at Kestro" },
        body: [
          {
            da: "Vi bruger ordet refurbished, fordi det er det ord, markedet bruger, og fordi en indkøber leder efter det. Men vi går ikke ud fra, at ordet i sig selv fortæller jer noget. Vi holder ikke lager: vi skaffer maskinerne til hver ordre i vores leverandørnetværk, og det betyder, at vi kender det konkrete parti frem for at beskrive en generel proces.",
            en: "We use the word refurbished because it is the word the market uses, and because a buyer looks for it. But we do not assume the word tells you anything by itself. We hold no stock: we source per order through our supplier network, which means we know the actual batch rather than describing a general process.",
          },
          {
            da: "I praksis betyder det, at tilbuddet viser hver enhed for sig frem for ét samlet tal: model, hukommelse, lagring, skærm, kosmetisk stand, batteri, tastaturlayout og styresystem. Eksempelsiden viser, hvordan det ser ud udfyldt. Vi tester og klargør maskinerne, før de sendes, og vi skifter tastaturlayout på maskiner, der kommer fra udlandet.",
            en: "In practice that means the quote is written per unit rather than as a single number: model, memory, storage, screen, cosmetic condition, battery, keyboard layout and operating system. The example page shows what that looks like filled in. We test and prepare the machines before they are sent, and we change the keyboard layout on machines that come from abroad.",
          },
          {
            da: "Og lige så vigtigt: vi lover ikke en fast proces på tværs af alt, hvad der findes i markedet. Hvad der kan skaffes til en given specifikation og et givent antal, afhænger af, hvad der er tilgængeligt, når I spørger. Kan vi ikke skaffe præcis den specifikation, siger vi det og foreslår det nærmeste alternativ. Det er en dårligere overskrift end et løfte – og det er det, der gør, at tallene i tilbuddet holder.",
            en: "And just as importantly: we do not promise a fixed process across everything in the market. What can be sourced at a given specification and quantity depends on what is available when you ask. If we cannot meet the specification, we say so and propose the closest alternative. That is a worse headline than a promise — and it is what makes the numbers in the quote hold.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal I bruge udstyr og vil hellere have svarene end ordene, så send os specifikationen og antallet. I får et tilbud på enhedsniveau, hvor stand og opsætning står skriftligt, før I bestiller. Der er ingen binding i at spørge.",
      en: "If you need equipment and would rather have the answers than the words, send us the specification and the quantity. You get a quote written per unit, with condition and setup in writing before you order. Asking commits you to nothing.",
    },
    related: [
      {
        href: "/kvalitet",
        label: { da: "Vores standard, stand og vilkår", en: "Our standard, condition and terms" },
      },
      {
        href: "/produkter",
        label: { da: "Udstyr, vi kan skaffe", en: "Equipment we can source" },
      },
      {
        href: "/tilbud",
        label: { da: "Få et tilbud på enhedsniveau", en: "Get a quote written per unit" },
      },
      {
        href: "/reparation/klargoering-af-brugt-udstyr",
        label: { da: "Få tjekket en brugt computer", en: "Get a used computer checked" },
      },
    ],
    sources: [guideSource("dkWarranty"), guideSource("ewasteMonitor")],
    faqs: [
      {
        question: { da: "Hvad betyder refurbished?", en: "What does refurbished mean?" },
        answer: {
          da: "At nogen har haft maskinen gennem en proces, før den blev sat til salg – typisk kontrol, rengøring, sletning af data og udskiftning af det, der var slidt eller defekt. Ordet siger ikke i sig selv, hvad processen indeholdt, fordi der ikke findes én fælles definition.",
          en: "That somebody put the machine through a process before it went up for sale — typically checking, cleaning, erasing data and replacing what was worn or broken. The word does not by itself say what the process contained, because there is no single shared definition.",
        },
      },
      {
        question: { da: "Hvad betyder brugt?", en: "What does used mean?" },
        answer: {
          da: "At maskinen har haft en ejer før og er solgt videre. Det er en oplysning om historie, ikke om stand: en brugt maskine kan være i fin stand eller defekt, og ordet skelner ikke.",
          en: "That the machine had an owner before and has been sold on. It is a statement about history, not condition: a used machine can be in fine shape or broken, and the word does not distinguish.",
        },
      },
      {
        question: {
          da: "Er refurbished bedre end brugt?",
          en: "Is refurbished better than used?",
        },
        answer: {
          da: "Som regel, men ikke automatisk. Refurbished betyder, at der er lavet et arbejde – ikke hvor meget. En brugt maskine fra en sælger, der beskriver den præcist, kan være et bedre køb end en refurbished maskine fra en, der ikke vil sige, hvad der blev gjort.",
          en: "Usually, but not automatically. Refurbished means work was done — not how much. A used machine from a seller who describes it precisely can be a better buy than a refurbished one from a seller who will not say what was done.",
        },
      },
      {
        question: {
          da: "Hvad bør en virksomhed kontrollere?",
          en: "What should a company check?",
        },
        answer: {
          da: "Sælgerens proces frem for annoncens ord: hvad der blev testet, hvad der blev skiftet, hvordan lagermediet er håndteret, om der følger dokumentation med, hvad standsbetegnelsen betyder, hvilke vilkår der gælder ved fejl, og om hele leverancen har den samme opsætning.",
          en: "The seller's process rather than the advert's wording: what was tested, what was replaced, how the drive was handled, whether documentation comes with it, what the condition grading means, what terms apply if there is a fault, and whether the whole delivery has the same setup.",
        },
      },
      {
        question: {
          da: "Er alt refurbished udstyr testet?",
          en: "Is all refurbished equipment tested?",
        },
        answer: {
          da: "Nej, og det er en udbredt misforståelse. Ordet er ikke reguleret, så omfanget af test afhænger helt af sælgeren – og det er derfor, spørgsmålet skal stilles konkret frem for at blive taget for givet.",
          en: "No, and it is a widespread misunderstanding. The word is not regulated, so how much testing happens depends entirely on the seller — which is why the question has to be asked specifically rather than assumed.",
        },
      },
    ],
  },
  {
    slug: "reparere-eller-koebe-ny",
    cluster: "lifecycle",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "reparere eller købe ny computer",
    author: "alireza",
    title: {
      da: "Reparere eller købe ny computer? Sådan regner du på det",
      en: "Repair or replace your computer? How to work it out",
    },
    metaTitle: {
      da: "Reparere eller købe ny computer? Sådan regner du | Kestro",
      en: "Repair or replace your computer? How to work it out | Kestro",
    },
    metaDescription: {
      da: "En enkel måde at afgøre, om det kan betale sig at reparere din computer: hvad delene koster, hvad maskinen er værd, og hvornår du bør lade være.",
      en: "A simple way to decide whether a computer is worth repairing or replacing: what the parts cost, what the machine is worth, and when to stop.",
    },
    summary: {
      da: "Regnestykket, der afgør, om en langsom eller defekt maskine skal repareres eller skiftes ud.",
      en: "The calculation that decides whether a slow or broken machine gets repaired or replaced.",
    },
    audience: { da: "Private og mindre virksomheder", en: "Individuals and small businesses" },
    readingMinutes: 6,
    published: "2026-08-23",
    updated: "2026-10-16",
    tldr: {
      da: "Sammenlign reparation eller opgradering med en passende erstatning, inklusive dele, arbejde, dataflytning og nedetid. Behold maskinen, hvis en konkret fejl kan løses, og den fortsat passer til opgaver og understøttet software. Vælg udskiftning, når nødvendige forbedringer ikke er mulige eller samlet er et dårligere køb. Der findes ingen universel procentgrænse.",
      en: "Compare repair or upgrading with a suitable replacement, including parts, labour, migration and downtime. Keep the machine when a specific fault can be fixed and it still suits your work and supported software. Replace it when necessary improvements are impossible or worse value overall. There is no universal percentage threshold.",
    },
    intro: {
      da: "En langsom bærbar behøver ikke være færdig, men en reparation er heller ikke altid det rigtige valg. Start med en diagnose og et sammenligneligt alternativ. Vores beslutningsramme handler om, hvad computeren skal kunne efter arbejdet, ikke blot hvad den kan sælges for i dag.",
      en: "A slow laptop may still be useful, but repairing is not always the right choice either. Start with a diagnosis and a comparable alternative. Our decision framework focuses on what the computer must do after the work, not just its resale value today.",
    },
    sections: [
      {
        heading: { da: "Start med maskinens værdi", en: "Start with what the machine is worth" },
        body: [
          {
            da: "Find et aktuelt tilbud på en erstatning, der løser samme arbejde med passende batteri, tastatur, licens og tilbehør. En lav gensalgspris på den gamle maskine er et nyttigt pejlemærke, men ikke et absolut loft: opsætning, dataflytning og særlige programmer kan ændre regnestykket.",
            en: "Find a current quote for a replacement that handles the same work with a suitable battery, keyboard, licence and accessories. Low resale value is a useful reference, not an absolute ceiling: setup, migration and specialist applications can change the calculation.",
          },
        ],
      },
      {
        heading: { da: "De billige fejl", en: "The cheap faults" },
        body: [
          {
            da: "Disse forhold er værd at undersøge. Pris og effekt afhænger af model og diagnose; listen er ikke en garanti for en billig løsning:",
            en: "These issues are worth checking. Cost and benefit depend on model and diagnosis; the list does not guarantee a cheap solution:",
          },
        ],
        list: [
          {
            da: "Kort batteritid: vurder målt kapacitet, opladning og den arbejdstid, du faktisk behøver, før et kompatibelt batteri bestilles.",
            en: "Short battery runtime: assess measured capacity, charging and the working time you actually need before ordering a compatible battery.",
          },
          {
            da: "Hukommelsespresset arbejde: mål RAM-forbruget og kontrollér, om hukommelsen kan udvides. Mere RAM løser ikke en utilstrækkelig CPU.",
            en: "Memory-constrained work: measure RAM usage and check expansion options. More RAM does not fix an inadequate CPU.",
          },
          {
            da: "Langsomt eller defekt lager: en kompatibel SSD kan være relevant. Medregn sikkerhedskopi, dataflytning og eventuel geninstallation.",
            en: "Slow or faulty storage: a compatible SSD may be relevant. Include backup, migration and any reinstallation.",
          },
          {
            da: "Varme og støj: undersøg ventilation, blæser og temperaturer. Lad diagnosen afgøre, om rengøring eller kølerarbejde er nødvendigt.",
            en: "Heat and noise: investigate ventilation, fan and temperatures. Let diagnosis determine whether cleaning or cooling work is needed.",
          },
        ],
      },
      {
        heading: { da: "De dyre fejl", en: "The expensive faults" },
        body: [
          {
            da: "Bundkort, væskeskade og ødelagte hængselfæster kan kræve omfattende arbejde og have usikker prognose. Skærm- og tastaturskift varierer meget efter konstruktion. Få diagnose, omfang og pris oplyst; antag ikke på forhånd, at en bestemt fejl altid er billig eller urentabel.",
            en: "Motherboard faults, liquid damage and damaged hinge mounts can need extensive work with uncertain outcomes. Screen and keyboard replacements vary significantly by construction. Obtain diagnosis, scope and price; do not assume a particular fault is always cheap or uneconomic.",
          },
        ],
      },
      {
        heading: { da: "Regn også tiden med", en: "Count the time too" },
        body: [
          {
            da: "Både reparation og udskiftning kan give nedetid, opsætning og dataflytning. Brug jeres egen tidsvurdering, ikke en fast antagelse om timer pr. medarbejder. Vurder også software- og driversupport: en vellykket hardwareopgradering er ikke nok, hvis arbejdsprogrammerne eller styresystemet ikke kan understøttes.",
            en: "Both repair and replacement can involve downtime, setup and migration. Use your own time estimate, not a fixed assumption about hours per employee. Also assess software and driver support: a successful hardware upgrade is insufficient if applications or the operating system cannot be supported.",
          },
        ],
      },
    ],
    closing: {
      da: "Er du i tvivl, så skriv til os, hvilken model det er, og hvad der sker. Vi siger ærligt, hvis det ikke kan betale sig – det er billigere for os at sige nej end at lave en reparation, du fortryder.",
      en: "If you are unsure, write to us with the model and what happens. We will say honestly if it is not worth it — it is cheaper for us to say no than to do a repair you regret.",
    },
    related: [
      {
        href: "/reparation",
        label: { da: "Reparation og opgradering", en: "Repairs and upgrades" },
      },
      {
        href: "/vejledninger/hvor-meget-kan-en-baerbar-opgraderes",
        label: { da: "Find maskinens opgraderingsgrænse", en: "Find your machine's upgrade limit" },
      },
      {
        href: "/vejledninger/refurbished-eller-ny-baerbar",
        label: {
          da: "Hvis du skal købe: refurbished eller nyt?",
          en: "If replacing: refurbished or new?",
        },
      },
      { href: "/priser", label: { da: "Hvad afgør prisen", en: "What decides the price" } },
      {
        href: "/reparation/fejlfinding",
        label: { da: "Computeren starter ikke?", en: "Computer will not start?" },
      },
      {
        href: "/reparation/reservedele-og-komponentskift",
        label: { da: "Reservedele til bærbar", en: "Laptop spare parts" },
      },
      {
        href: "/reparation/rens-og-koeling",
        label: { da: "Larmer den eller bliver varm?", en: "Running loud or hot?" },
      },
      {
        href: "/reparation/skaermskift",
        label: { da: "En revnet skærm", en: "A cracked screen" },
      },
    ],
    sources: [guideSource("pcHealthCheck"), guideSource("thinkpadX1CarbonGen7")],
    faqs: [
      {
        question: {
          da: "Hvornår kan det ikke betale sig at reparere en computer?",
          en: "When is a computer not worth repairing?",
        },
        answer: {
          da: "Når den nødvendige forbedring ikke er mulig, software ikke kan understøttes, eller samlet reparation, risiko og nedetid er et dårligere valg end en passende erstatning. Sammenlign konkrete tilbud; brug ikke en fast procent af gensalgsværdien som eneste beslutning.",
          en: "When the necessary improvement is impossible, software cannot be supported, or total repair cost, risk and downtime are worse than a suitable replacement. Compare actual quotes; do not decide solely by a fixed percentage of resale value.",
        },
      },
      {
        question: {
          da: "Hvorfor føles min gamle computer langsom?",
          en: "Why does my old computer feel slow?",
        },
        answer: {
          da: "Mulige årsager er hukommelsespres, langsomt lager, baggrundsprogrammer, varme eller begrænsninger i CPU og netværk. Mål under det arbejde, der føles langsomt, før du køber dele. Et slidt batteri og lav ydelse er ikke automatisk samme problem.",
          en: "Possible causes include memory pressure, slow storage, background software, heat or CPU and network limits. Measure during the work that feels slow before buying parts. A worn battery and poor performance are not automatically the same problem.",
        },
      },
      {
        question: {
          da: "Hvilke reparationer er dyre?",
          en: "Which repairs are the expensive ones?",
        },
        answer: {
          da: "Bundkort, væskeskade og kabinetskade kan kræve meget arbejde, men prisen er modelspecifik. Få et afgrænset tilbud og oplysning om usikkerheder før en beslutning.",
          en: "Motherboard faults, liquid damage and chassis damage can require substantial work, but cost is model-specific. Obtain a scoped quote and an explanation of uncertainties before deciding.",
        },
      },
      {
        question: {
          da: "Skal tiden til opsætning regnes med?",
          en: "Should the setup time be counted?",
        },
        answer: {
          da: "Ja. Regn opsætning, backup, dataflytning og nedetid med for begge alternativer. Tidsforbruget afhænger af jeres programmer og administration; det er ikke et fast antal timer pr. maskine.",
          en: "Yes. Include setup, backup, migration and downtime for both options. The time depends on your applications and management; it is not a fixed number of hours per computer.",
        },
      },
    ],
  },
  {
    slug: "opgrader-ram-i-baerbar",
    cluster: "memory-storage",
    type: "praktisk",
    intent: "informational",
    primaryKeyword: "opgradere ram i bærbar",
    author: "alireza",
    title: {
      da: "Sådan opgraderer du RAM i en bærbar",
      en: "How to upgrade the RAM in a laptop",
    },
    metaTitle: {
      da: "Opgrader RAM i bærbar: tjek, køb og skift selv | Kestro",
      en: "Upgrade laptop RAM safely: checks and fitting | Kestro",
    },
    metaDescription: {
      da: "Kan du opgradere RAM i din bærbare? Tjek type, sokler og kapacitet før et køb. Læs om sikkert skift, batteri og backup, og hvornår du bør få hjælp.",
      en: "Upgrade laptop RAM safely: check slots, type and capacity before buying. Get backup and battery precautions, fitting advice and reasons to stop.",
    },
    summary: {
      da: "Find den rigtige RAM, kontrollér, om den kan skiftes, og vurder, om opgaven er egnet til gør-det-selv.",
      en: "Find compatible memory, check whether it is replaceable and assess whether the job is suitable for DIY.",
    },
    audience: { da: "Private, der selv vil prøve", en: "People who want to do it themselves" },
    readingMinutes: 7,
    published: "2026-08-23",
    updated: "2026-10-16",
    tldr: {
      da: "RAM kan kun opgraderes, hvis den konkrete bærbare har en understøttet udvidelsesmulighed. Kontrollér sokler, type og maksimum i producentens dokumentation, og mål først, om hukommelsen er flaskehalsen. Før åbning: sikkerhedskopi, BitLocker-nøgle, korrekt strømafbrydelse og ESD-beskyttelse. Følg servicemanualen, og stop ved batteriskade eller en del, der ikke passer uden kraft.",
      en: "Memory can only be upgraded if the exact laptop has a supported expansion option. Check slots, type and maximum capacity in manufacturer documentation, and first measure whether memory is the bottleneck. Before opening: backup, BitLocker key, correct power isolation and ESD protection. Follow the service manual and stop for battery damage or a part that needs forcing.",
    },
    intro: {
      da: "Mere RAM kan hjælpe, når de programmer, du bruger, løber tør for hukommelse. Det løser ikke alle langsomme computere. Denne guide er en kontrolrækkefølge, ikke en universel adskillelsesmanual; brug altid dokumentationen til din præcise variant.",
      en: "More RAM can help when your applications run out of memory. It does not fix every slow computer. This guide provides a sequence of checks, not a universal disassembly manual; always use documentation for your exact variant.",
    },
    sections: [
      {
        heading: {
          da: "Tjek først, om det kan lade sig gøre",
          en: "First check whether it is possible",
        },
        body: [
          {
            da: "Fastloddet RAM er ikke en almindelig modulopgradering. X1 Carbon Gen 7 har eksempelvis 8 eller 16 GB uden sokler ifølge Lenovo; T14 Gen 2 Intel har derimod både fastloddet RAM og én DDR4-sokkel. Kontrollér generation og variant frem for at generalisere ud fra et familienavn.",
            en: "Soldered memory is not a normal module upgrade. For example, Lenovo lists X1 Carbon Gen 7 with 8 or 16 GB and no slots; T14 Gen 2 Intel instead has soldered memory plus one DDR4 slot. Check generation and variant instead of generalising from a family name.",
          },
          {
            da: "Er der sokler, står der som regel også, hvor mange der er, og hvad maskinen maksimalt understøtter. Begge dele skal du bruge.",
            en: "If there are slots, the same source usually says how many, and the maximum the machine supports. You need both numbers.",
          },
        ],
      },
      {
        heading: { da: "Køb den rigtige type", en: "Buy the right type" },
        body: [
          {
            da: "Sammenhold producentens specifikation og modulnummeret. Disse forhold skal passe:",
            en: "Compare the manufacturer specification with the module part number. These details must match:",
          },
        ],
        list: [
          {
            da: "Hukommelsestype og elektriske krav. DDR4 og DDR5 er ikke udskiftelige; et matchende antal GB er ikke nok.",
            en: "Memory type and electrical requirements. DDR4 and DDR5 are not interchangeable; matching gigabytes are not enough.",
          },
          {
            da: "Formfaktor og kapacitet: brug kun det modulformat og den kapacitet pr. sokkel, manualen understøtter. Bærbare med udskiftelig RAM bruger ofte SO-DIMM, men ikke alle gør.",
            en: "Form factor and capacity: use only the module format and capacity per slot supported by the manual. Laptops with replaceable memory often use SO-DIMM, but not all do.",
          },
          {
            da: "Understøttet datahastighed og modulprofil. Et hurtigere modul kan i nogle kombinationer køre langsommere, men det er ikke en generel kompatibilitetsgaranti.",
            en: "Supported data rate and module profile. A faster module may run at a lower rate in some combinations, but that is not a general compatibility guarantee.",
          },
          {
            da: "Kanalopsætning: følg producentens anbefaling. Dual-channel kan påvirke båndbredde og integreret grafik; det betyder ikke dobbelt ydelse i alle programmer.",
            en: "Channel configuration: follow manufacturer recommendations. Dual-channel can affect bandwidth and integrated graphics; it does not double performance in every application.",
          },
        ],
      },
      {
        heading: { da: "Hvor meget RAM har du brug for?", en: "How much RAM do you need?" },
        body: [
          {
            da: "Nedenstående er vores praktiske udgangspunkter, ikke systemkrav eller løfter om ydelse. Mål dine programmer under almindeligt arbejde og spidsbelastning, og kontrollér maskinens maksimum. En maskine med fastloddet RAM skal vælges med den nødvendige kapacitet fra starten.",
            en: "These are our practical starting points, not system requirements or performance promises. Measure your applications during ordinary work and peak use, and check the machine's maximum. A laptop with soldered memory needs the required capacity from the start.",
          },
        ],
        table: {
          caption: {
            da: "Kapacitet som vurderingspunkt, ikke universel anbefaling",
            en: "Capacity as an assessment point, not a universal recommendation",
          },
          head: [
            { da: "Kapacitet", en: "Capacity" },
            { da: "Vurdering før køb", en: "Assessment before buying" },
          ],
          rows: [
            [
              { da: "8 GB", en: "8 GB" },
              {
                da: "Kan være nok til begrænset brug. Afprøv browser, møder og øvrige programmer samtidig.",
                en: "May suffice for limited use. Trial the browser, meetings and other applications together.",
              },
            ],
            [
              { da: "16 GB", en: "16 GB" },
              {
                da: "Et relevant udgangspunkt for almindeligt kontorarbejde; mål, om dine programmer kræver mere.",
                en: "A useful starting point for ordinary office work; measure whether your applications need more.",
              },
            ],
            [
              { da: "32 GB eller mere", en: "32 GB or more" },
              {
                da: "Undersøg ved tunge projekter, virtuelle maskiner eller stort samtidighedsbehov. Køb efter måling og softwarekrav.",
                en: "Investigate for demanding projects, virtual machines or heavy concurrent use. Buy based on measurements and software requirements.",
              },
            ],
          ],
        },
      },
      {
        heading: { da: "Selve skiftet", en: "The swap itself" },
        body: [
          {
            da: "Tag sikkerhedskopi og find BitLocker-genoprettelsesnøglen først. Sluk, frakobl oplader og tilbehør, og følg den konkrete manuals procedure for at deaktivere eller frakoble både internt og eventuelt eksternt batteri. Brug korrekt ESD-beskyttelse og værktøj; en slukket computer er ikke nødvendigvis strømløs.",
            en: "Back up and locate the BitLocker recovery key first. Shut down, disconnect the charger and peripherals, and follow the exact manual for disabling or disconnecting the internal and any external battery. Use proper ESD protection and tools; a shut-down computer is not necessarily without power.",
          },
          {
            da: "Ved en almindelig SO-DIMM-sokkel frigøres sideklemmerne, og modulet tages i kanterne. Ret hakket ind og følg manualens vinkel og rækkefølge ved montering. Tving aldrig modulet i. Stop og søg faglig hjælp ved opsvulmet batteri, væskeskade eller uklar adgang; et batteri må ikke bøjes, punkteres eller vrides fri.",
            en: "For a conventional SO-DIMM slot, release the side clips and hold the module by its edges. Align the notch and follow the manual's insertion angle and sequence. Never force it. Stop and seek professional help for a swollen battery, liquid damage or unclear access; never bend, puncture or pry out a battery.",
          },
        ],
      },
      {
        heading: { da: "Bagefter", en: "Afterwards" },
        body: [
          {
            da: "Saml computerens dæksler og skruer efter manualen, før strømmen tilsluttes igen. Kontrollér registreret RAM i BIOS og Windows, og kør producentens hukommelsesdiagnostik. Manglende RAM kan skyldes montering, kompatibilitet eller en defekt del; åbn ikke maskinen igen uden først at følge strømafbrydelsen.",
            en: "Refit covers and screws according to the manual before reconnecting power. Check detected memory in BIOS and Windows and run manufacturer memory diagnostics. Missing memory may reflect installation, compatibility or a faulty part; do not reopen without first repeating power isolation.",
          },
        ],
      },
      {
        heading: { da: "Er gør-det-selv den rigtige løsning?", en: "Is DIY the right choice?" },
        body: [
          {
            da: "Hvis manualen beskriver delen som brugerudskiftelig, du har korrekt værktøj og kan følge sikkerhedsproceduren, kan opgaven være egnet hjemme. På en firmamaskine skal ejeren eller den IT-ansvarlige godkende ændringen. Fastloddet RAM, limet adgang eller en usikker batteriprocedure er gode grunde til at stoppe. Sammenlign også dele og arbejdstid med maskinens værdi og softwarelevetid.",
            en: "If the manual identifies the part as user-replaceable, you have the right tools and can follow the safety procedure, the job may suit home servicing. On a company machine, the owner or IT must approve the change. Soldered memory, glued access or an uncertain battery procedure are good reasons to stop. Also compare parts and labour with the machine's value and software lifetime.",
          },
        ],
      },
    ],
    closing: {
      da: "Vil du hellere have det gjort, klarer vi det – og vi tjekker samtidig, om der er andet, der trækker maskinen ned. Skriv til os med modellen.",
      en: "If you would rather have it done, we can do it — and we will check at the same time whether anything else is holding the machine back. Write to us with the model.",
    },
    related: [
      {
        href: "/reparation",
        label: { da: "Få os til at opgradere den", en: "Have us do the upgrade" },
      },
      {
        href: "/vejledninger/hvor-meget-kan-en-baerbar-opgraderes",
        label: { da: "Sammenlign RAM- og SSD-grænser", en: "Compare memory and storage limits" },
      },
      {
        href: "/vejledninger/hvorfor-er-ram-blevet-dyrere",
        label: { da: "Hvad påvirker RAM-prisen?", en: "What affects memory prices?" },
      },
      {
        href: "/modeller/lenovo-thinkpad-t14",
        label: {
          da: "ThinkPad T14: kontrollér generation og RAM-sokkel",
          en: "ThinkPad T14: check the generation and RAM slot",
        },
      },
      {
        href: "/modeller/lenovo-thinkpad-x1-carbon",
        label: {
          da: "X1 Carbon: vær opmærksom på fastloddet RAM",
          en: "X1 Carbon: watch for soldered RAM",
        },
      },
      {
        href: "/reparation/ram-og-ssd-opgradering",
        label: { da: "Få opgraderet RAM og SSD", en: "Have the RAM and SSD upgraded" },
      },
      {
        href: "/maskinen",
        label: { da: "Se, hvor RAM og SSD sidder", en: "See where the RAM and SSD sit" },
      },
    ],
    sources: [
      guideSource("thinkpadX1CarbonGen7"),
      guideSource("thinkpadT14Gen2Intel"),
      guideSource("memoryGenerations"),
      guideSource("laptopServiceSafety"),
      guideSource("swollenBatterySafety"),
      guideSource("bitlockerRecovery"),
    ],
    faqs: [
      {
        question: {
          da: "Kan man opgradere hukommelsen i alle bærbare?",
          en: "Can the memory be upgraded in every laptop?",
        },
        answer: {
          da: "Nej. Mange tynde maskiner har hukommelsen loddet fast på bundkortet, og så kan den ikke skiftes – uanset hvad. Slå din præcise model op hos producenten eller i servicemanualen, før du køber noget.",
          en: "No. Many thin machines have the memory soldered to the motherboard, and then it cannot be changed at all. Look your exact model up with the manufacturer or in the service manual before you buy anything.",
        },
      },
      {
        question: {
          da: "Hvilken slags RAM skal jeg købe?",
          en: "Which kind of RAM should I buy?",
        },
        answer: {
          da: "Brug producentens specifikation til den præcise variant: hukommelsestype, formfaktor, datahastighed, kapacitet pr. sokkel og samlet maksimum skal passe. Et hurtigere modul eller samme antal GB er ikke i sig selv bevis på kompatibilitet.",
          en: "Use the manufacturer specification for the exact variant: memory type, form factor, data rate, capacity per slot and total maximum must match. A faster module or matching gigabytes alone is not proof of compatibility.",
        },
      },
      {
        question: {
          da: "Er to moduler bedre end ét stort?",
          en: "Are two modules better than one large one?",
        },
        answer: {
          da: "Det afhænger af platformen og den samlede kapacitet. Dual-channel kan være nyttigt, især for integreret grafik, men er ikke et løfte om dobbelt ydelse. Følg producentens understøttede kombinationer.",
          en: "It depends on the platform and total capacity. Dual-channel can be useful, particularly for integrated graphics, but does not promise double performance. Follow the manufacturer's supported combinations.",
        },
      },
      {
        question: {
          da: "Maskinen ser kun halvdelen af hukommelsen – hvad er galt?",
          en: "The machine only sees half the memory — what is wrong?",
        },
        answer: {
          da: "Mulige årsager er montering, inkompatibelt modul, kapacitetsgrænse eller defekt del. Kontrollér BIOS og producentens diagnostik. Sluk og følg manualens fulde strømafbrydelse, før et modul berøres igen; tving ikke delen i.",
          en: "Possible causes include installation, an incompatible module, a capacity limit or a faulty part. Check BIOS and manufacturer diagnostics. Shut down and follow the manual's full power-isolation procedure before touching a module again; never force the part.",
        },
      },
    ],
  },
  {
    slug: "tjek-brugt-baerbar-foer-koeb",
    cluster: "buying-condition",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "hvad skal man tjekke på en brugt bærbar",
    author: "alireza",
    title: {
      da: "Ti ting du skal tjekke på en brugt bærbar, før du køber",
      en: "Ten things to check on a used laptop before you buy",
    },
    metaTitle: {
      da: "Ti ting du skal tjekke på en brugt bærbar | Kestro",
      en: "Buying a used laptop? Ten things to check first | Kestro",
    },
    metaDescription: {
      da: "Hvilken brugt bærbar passer til dit behov? Vælg efter opgaver og budget, og tjek batteri, skærm, tastatur og porte. Brug tjeklisten, før du vælger.",
      en: "Which used laptop fits your needs? Start with tasks and budget, then check battery, screen, keyboard and ports. Use the checklist before you buy.",
    },
    summary: {
      da: "Vælg efter opgaver og budget, og kontrollér derefter den brugte bærbares stand og tilbehør.",
      en: "Choose around tasks and budget, then check the used laptop's condition and accessories.",
    },
    audience: { da: "Alle, der køber brugt", en: "Anyone buying second-hand" },
    readingMinutes: 6,
    published: "2026-08-23",
    updated: "2026-10-16",
    tldr: {
      da: "Vælg en brugt bærbar efter arbejdsopgaver, mobilitet og samlet budget, før du vælger mærke. Kontrollér derefter batteri, skærm, tastatur, porte og lager samt understøttelse af styresystemet. Afklar dansk eller norsk tastatur, oplader, licenser og eventuelle fejl på den konkrete enhed; en kosmetisk grad erstatter ikke disse oplysninger.",
      en: "Choose a used laptop around tasks, mobility and total budget before picking a brand. Then check battery, display, keyboard, ports, storage and operating system support. Clarify a Danish or Norwegian keyboard, charger, licences and any faults on the actual device; a cosmetic grade does not replace these details.",
    },
    intro: {
      da: "Spørgsmålet er først: hvilken bærbar passer til mit behov? Når kravene er afklaret, hjælper tjeklisten dig med at vurdere den konkrete brugte computer. Den erstatter ikke en diagnose eller skriftlige oplysninger fra sælgeren.",
      en: "First ask: which laptop fits my needs? Once the requirements are clear, the checklist helps you assess the actual used computer. It does not replace a diagnosis or written details from the seller.",
    },
    sections: [
      {
        heading: { da: "Hvilken bærbar skal jeg vælge?", en: "Which laptop should I choose?" },
        body: [
          {
            da: "Skriv de programmer og opgaver ned, du skal bruge computeren til. Mail, regnskab og videomøder stiller ikke nødvendigvis de samme krav som udvikling, CAD eller video. Brug programmernes krav som udgangspunkt for processor, RAM og lager, og kontrollér også behovet for flere skærme.",
            en: "List the applications and tasks the computer needs to handle. Email, accounting and video calls do not necessarily have the same requirements as development, CAD or video work. Use application requirements as the starting point for processor, RAM and storage, and check multiple-monitor needs too.",
          },
          {
            da: "Skal den med hver dag, så sammenlign vægt, skærmstørrelse og målt batteritilstand. Står den mest ved et skrivebord, er dock, skærme og tilslutninger en større del af valget. Til en startup skal løsningen også kunne passe til næste medarbejder uden unødvendigt ekstra tilbehør.",
            en: "If you carry it daily, compare weight, screen size and measured battery health. At a fixed desk, the dock, monitors and connections become a larger part of the decision. For a startup, the setup should also accommodate the next employee without unnecessary accessories.",
          },
        ],
      },
      {
        heading: {
          da: "En billig bærbar: sammenlign hele budgettet",
          en: "A low-cost laptop: compare the whole budget",
        },
        body: [
          {
            da: "Læg computer, oplader, ønsket dansk eller norsk tastatur, licenser og eventuel dock og skærm sammen. Spørg også til batteri og kendte fejl, så en lav købspris ikke skjuler nødvendige udgifter. En højere kosmetisk grad er ikke i sig selv bedre ydelse.",
            en: "Add the computer, charger, required Danish or Norwegian keyboard, licences and any dock and monitor. Also ask about the battery and known faults so a low purchase price does not hide necessary costs. A higher cosmetic grade does not by itself mean higher performance.",
          },
          {
            da: "Har du allerede en gammel bærbar, bør du undersøge, om en relevant RAM- eller SSD-opgradering kan løse problemet, før du erstatter den. Sammenlign de konkrete muligheder og priser; budgeteksempler er ikke dokumentation for lager eller en aktuel salgspris.",
            en: "If you already have an old laptop, check whether a relevant RAM or SSD upgrade could solve the problem before replacing it. Compare actual options and prices; budget examples are not evidence of stock or a current selling price.",
          },
        ],
      },
      {
        heading: { da: "Det, du skal undersøge på maskinen", en: "What to inspect on the machine" },
        body: [
          {
            da: "Tag maskinen i hånden og gå listen igennem i rækkefølge. De fleste punkter tager kun et øjeblik.",
            en: "Pick the machine up and work through the list in order. Most points take a moment.",
          },
        ],
        list: [
          {
            da: "Batteriets tilstand. I Windows: åbn Kommandoprompt og skriv powercfg /batteryreport. Rapporten viser den oprindelige kapacitet over for den nuværende. Vi regner under 70 procent af den oprindelige som tid til et nyt batteri – en tommelfingerregel, ikke en standard – og så skal det med i prisen.",
            en: "Battery health. In Windows: open Command Prompt and type powercfg /batteryreport. The report shows the original capacity against the current one. We count below 70 per cent of the original as time for a new battery — a rule of thumb, not a standard — and then it belongs in the price.",
          },
          {
            da: "Skærmen på hvid og på sort baggrund. Døde pixels ses på hvid, lysutæthed og indbrænding ses på sort.",
            en: "The screen on a white and then a black background. Dead pixels show on white; backlight bleed and burn-in show on black.",
          },
          {
            da: "Hver eneste tast. Åbn et tomt dokument og tryk dem alle igennem. En enkelt død tast er billig at leve med, men den skal med i prisen.",
            en: "Every single key. Open a blank document and press through all of them. One dead key is cheap to live with, but it belongs in the price.",
          },
          {
            da: "Alle porte med noget i. Tag en USB-nøgle og et HDMI-kabel med. En port, ingen har prøvet, kan blive en ubehagelig overraskelse senere.",
            en: "Every port, with something in it. Bring a USB stick and an HDMI cable. A port nobody tried can turn into an unpleasant surprise later.",
          },
          {
            da: "Diskens tilstand. Programmet CrystalDiskInfo læser SMART-data og siger, hvor meget disken har kørt, og om den melder fejl.",
            en: "Disk health. CrystalDiskInfo reads the SMART data and tells you how long the disk has run and whether it is reporting errors.",
          },
          {
            da: "Blæseren under belastning. Åbn en håndfuld faner, og lyt. En skrabende lyd kan være et leje på vej ud.",
            en: "The fan under load. Open a handful of tabs and listen. A scraping sound can be a bearing on its way out.",
          },
          {
            da: "Kamera, mikrofon og højttalere. Start et opkald med dig selv i et vilkårligt program.",
            en: "Camera, microphone and speakers. Start a call with yourself in any app.",
          },
          {
            da: "Hængslerne. Åbn og luk skærmen langsomt. Knirken eller slør kan ende med at revne kabinettet.",
            en: "The hinges. Open and close the screen slowly. Creaking or play can end up cracking the chassis.",
          },
          {
            da: "BIOS-adgangskode og enhedslåse. Genstart og gå ind i BIOS. En låst maskine fra en tidligere ejer kan ikke altid låses op – heller ikke af os.",
            en: "BIOS password and device locks. Restart and enter the BIOS. A machine locked by a previous owner cannot always be unlocked — not by us either.",
          },
          {
            da: "Windows-licensen. Under Indstillinger → System → Aktivering skal der stå, at Windows er aktiveret.",
            en: "The Windows licence. Under Settings → System → Activation it should say that Windows is activated.",
          },
        ],
      },
      {
        heading: { da: "Spørg om to ting", en: "Ask two questions" },
        body: [
          {
            da: "Følger strømforsyningen med? Og hvorfor sælges maskinen? Det første er en reel udgift, hvis svaret er nej. Det andet kan fortælle, hvordan maskinen har været brugt.",
            en: "Is the power supply included? And why is the machine being sold? The first is a real cost if the answer is no. The second can tell you how the machine has been used.",
          },
        ],
      },
      {
        heading: { da: "Hvad et bogstav ikke fortæller", en: "What a letter does not tell you" },
        body: [
          {
            da: "Sælgere skriver ofte grad A eller B. Der findes ingen fælles standard for, hvad bogstaverne betyder – to sælgere kan kalde den samme maskine hver sit. Bed om standen beskrevet i ord.",
            en: "Sellers often write grade A or B. There is no shared standard for what the letters mean — two sellers can call the same machine different things. Ask for the condition described in words.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal maskinen bruges i en virksomhed, laver vi den gennemgang for jer og skriver resultatet ned, før I betaler. Det er hele forskellen på at købe brugt og at gætte.",
      en: "If the machine is for a company, we do that check for you and write down the result before you pay. That is the whole difference between buying used and guessing.",
    },
    related: [
      {
        href: "/kvalitet",
        label: {
          da: "Sådan vurderer vi stand og kvalitet",
          en: "How we assess condition and quality",
        },
      },
      {
        href: "/produkter/baerbare-computere",
        label: { da: "Brugte bærbare computere", en: "Used business laptops" },
      },
      {
        href: "/reparation/batteriskift",
        label: { da: "Batteriskift på bærbar", en: "Laptop battery replacement" },
      },
      {
        href: "/vejledninger/tjek-batterikapacitet",
        label: { da: "Mål batteriet, før du køber", en: "Measure the battery before you buy" },
      },
      {
        href: "/reparation/klargoering-af-brugt-udstyr",
        label: { da: "Tjek af brugt computer hos os", en: "A used-computer check by us" },
      },
      {
        href: "/reparation/tastaturskift-og-nordisk-layout",
        label: { da: "Slidt eller forkert tastatur", en: "A worn or wrong keyboard" },
      },
      {
        href: "/priser",
        label: { da: "Budgeteksempler og prisgrundlag", en: "Budget examples and pricing basis" },
      },
      {
        href: "/reparation/ram-og-ssd-opgradering",
        label: { da: "Opgradering af den gamle bærbare", en: "Upgrading the old laptop" },
      },
    ],
    sources: [guideSource("dkWarranty")],
    faqs: [
      {
        question: {
          da: "Hvordan tjekker jeg batteriets tilstand på en brugt bærbar?",
          en: "How do I check the battery condition on a used laptop?",
        },
        answer: {
          da: "Åbn Kommandoprompt i Windows og skriv powercfg /batteryreport. Rapporten viser den oprindelige kapacitet over for den nuværende. Vi regner under 70 procent af den oprindelige som tid til et nyt batteri; det er en tommelfingerregel, ikke en standard.",
          en: "Open the Command Prompt in Windows and type powercfg /batteryreport. The report shows the original capacity against the current one. We count below 70 per cent of the original as time for a new battery; that is a rule of thumb, not a standard.",
        },
      },
      {
        question: {
          da: "Hvad skal jeg tjekke, før jeg køber en brugt bærbar?",
          en: "What should I check before buying a used laptop?",
        },
        answer: {
          da: "Batteriets tilstand, skærmen på både hvid og sort baggrund, hver eneste tast, alle porte med noget i dem, diskens SMART-data, blæseren under belastning, kamera, mikrofon og højttalere, hængslerne, BIOS-adgangskode og enhedslåse, at Windows er aktiveret, og om strømforsyningen følger med. De fleste punkter tager kun et øjeblik.",
          en: "The battery condition, the screen on both a white and a black background, every single key, all the ports with something in them, the drive's SMART data, the fan under load, camera, microphone and speakers, the hinges, BIOS password and device locks, that Windows is activated, and whether the power supply is included. Most points take a moment.",
        },
      },
      {
        question: {
          da: "Hvad betyder grad A eller grad B?",
          en: "What do grade A and grade B mean?",
        },
        answer: {
          da: "Ikke noget fast. Der findes ingen fælles standard for, hvad bogstaverne betyder, og to sælgere kan kalde den samme maskine hver sit. Bed om standen beskrevet i ord.",
          en: "Nothing fixed. There is no common standard for what the letters mean, and two sellers can call the same machine different things. Ask for the condition described in words.",
        },
      },
      {
        question: {
          da: "Hvorfor er BIOS-adgangskoden vigtig på en brugt maskine?",
          en: "Why does the BIOS password matter on a used machine?",
        },
        answer: {
          da: "Fordi en maskine, der stadig er låst af en tidligere ejer, ikke altid kan låses op – heller ikke af os. Genstart og gå ind i BIOS, før du køber.",
          en: "Because a machine still locked by a previous owner cannot always be unlocked — not even by us. Restart and go into the BIOS before you buy.",
        },
      },
    ],
  },
  {
    slug: "samle-din-egen-pc",
    cluster: "uden-klynge",
    type: "praktisk",
    intent: "informational",
    primaryKeyword: "",
    author: "alireza",
    title: { da: "Sådan samler du din egen pc", en: "How to build your own PC" },
    metaTitle: {
      da: "Byg din egen pc: dele, rækkefølge og typiske fejl | Kestro",
      en: "Build your own PC: parts, order and common mistakes | Kestro",
    },
    metaDescription: {
      da: "Sådan samler du din egen pc: hvilke dele skal passe sammen, i hvilken rækkefølge, og hvad går ofte galt første gang? En gennemgang trin for trin.",
      en: "How to build your own PC: which parts must match, what order to assemble in, and what goes wrong the first time. A walkthrough without mystique.",
    },
    summary: {
      da: "Rækkefølgen, de dele, der skal passe sammen, og de fejl, der er lette at lave første gang.",
      en: "The order, the parts that must match, and the mistakes that are easy to make first time.",
    },
    audience: { da: "Private og gaming", en: "Individuals and gaming" },
    readingMinutes: 6,
    updated: "2026-10-08",
    tldr: {
      da: "Rækkefølgen gør arbejdet nemt: bundkort, CPU, køler og RAM samles uden for kabinettet, og først derefter skrues det hele i. De fejl, der koster tid, er typisk strøm, der ikke er sat i, eller RAM, der ikke sidder helt fast.",
      en: "The order makes the work easy: motherboard, CPU, cooler and memory go together outside the case, and only then does the whole thing get screwed in. The mistakes that cost time are typically power that is not plugged in, or memory that is not fully seated.",
    },
    intro: {
      da: "At samle en pc er lettere, end det ser ud. De fleste dele passer kun på én måde. Det svære er at vælge dele, der passer sammen – resten er mest skruearbejde.",
      en: "Building a PC is easier than it looks. Most parts only fit one way. The hard part is choosing components that fit together — the rest is mostly screwing things in.",
    },
    sections: [
      {
        heading: {
          da: "De fem ting, der skal passe sammen",
          en: "The five things that must match",
        },
        body: [
          {
            da: "Vælg i denne rækkefølge, så låser hvert valg det næste:",
            en: "Choose in this order, and each choice narrows the next:",
          },
        ],
        list: [
          {
            da: "Processoren bestemmer soklen. Bundkortet skal have præcis den sokkel – der findes ingen mellemløsning.",
            en: "The processor decides the socket. The motherboard must have exactly that socket — there is no in-between.",
          },
          {
            da: "Bundkortet bestemmer hukommelsens generation, DDR4 eller DDR5, og hvor mange moduler der er plads til.",
            en: "The motherboard decides the memory generation, DDR4 or DDR5, and how many modules there is room for.",
          },
          {
            da: "Kabinettet bestemmer, hvor langt et grafikkort og hvor høj en køler der kan være. Mål efter i stedet for at håbe.",
            en: "The case decides how long a graphics card and how tall a cooler will fit. Measure, rather than hope.",
          },
          {
            da: "Strømforsyningen skal kunne klare grafikkortet med luft over. Producenten oplyser en anbefalet effekt – følg den.",
            en: "The power supply has to handle the graphics card with headroom. The manufacturer states a recommended wattage — follow it.",
          },
          {
            da: "Bundkortet bestemmer også antallet af M.2-pladser til SSD. To er rart, én er nok til de fleste.",
            en: "The motherboard also decides the number of M.2 slots for SSDs. Two is nice, one is enough for most people.",
          },
        ],
      },
      {
        heading: { da: "Rækkefølgen ved samling", en: "The order of assembly" },
        body: [
          {
            da: "Sæt processor, hukommelse og M.2-disk i bundkortet, mens det ligger på bordet. Der er langt bedre plads dér end nede i kabinettet, hvor det er trangt at komme til.",
            en: "Fit the processor, memory and M.2 drive to the motherboard while it is lying on the table. There is far more room there than down in the case, where it is cramped to reach.",
          },
          {
            da: "Så kommer bundkortet i kabinettet, derefter strømforsyningen, og til sidst grafikkortet. Kabler føres bagest, mens der stadig er plads til hænderne.",
            en: "Then the motherboard goes into the case, then the power supply, and the graphics card last. Route the cables behind the tray while there is still room for your hands.",
          },
        ],
      },
      {
        heading: { da: "De klassiske fejl", en: "The classic mistakes" },
        body: [
          {
            da: "Fire ting står tit bag en maskine, der ikke vil starte første gang:",
            en: "Four things are often behind a machine that will not start the first time:",
          },
        ],
        list: [
          {
            da: "Det ekstra 8-benede strømstik til processoren øverst på bundkortet er ikke sat i. Maskinen er helt død.",
            en: "The extra 8-pin CPU power connector at the top of the board is not plugged in. The machine is completely dead.",
          },
          {
            da: "Hukommelsen sidder i de forkerte sokler. Manualen siger, hvilke to der skal bruges, når du kun har to moduler.",
            en: "Memory is in the wrong slots. The manual says which two to use when you only have two modules.",
          },
          {
            da: "Skærmen er sat i bundkortets udgang i stedet for grafikkortets. Billedet er sort, selvom alt virker.",
            en: "The monitor is plugged into the motherboard output instead of the graphics card. The screen is black even though everything works.",
          },
          {
            da: "Afstandsboltene mellem kabinet og bundkort mangler eller sidder forkert. Det kan kortslutte bundkortet mod pladen.",
            en: "The standoffs between case and motherboard are missing or misplaced. That can short the board against the tray.",
          },
        ],
      },
      {
        heading: { da: "Første start", en: "First boot" },
        body: [
          {
            da: "Gå i BIOS først. Tjek, at processoren, hele hukommelsen og disken er der, og slå XMP eller EXPO til, så hukommelsen kører den hastighed, du betalte for. Slå også TPM (fTPM på AMD, PTT på Intel) og Secure Boot til: ifølge Microsoft kræver Windows 11 begge dele, og på nogle bundkort er de slået fra, når de kommer fra fabrikken. Derefter installerer du Windows fra en USB-nøgle.",
            en: "Go into the BIOS first. Check that the processor, all the memory and the drive are there, and switch on XMP or EXPO so the memory runs at the speed you paid for. Switch on TPM (fTPM on AMD, PTT on Intel) and Secure Boot as well: according to Microsoft, Windows 11 requires both, and on some motherboards they are off from the factory. Then install Windows from a USB stick.",
          },
        ],
      },
    ],
    closing: {
      da: "Vil du hellere have den samlet, gør vi det – enten helt fra bunden eller ved at opgradere den maskine, du allerede har. Skriv til os med, hvad den skal bruges til.",
      en: "If you would rather have it built, we can do that — either from scratch or by upgrading the machine you already have. Write to us with what it is for.",
    },
    related: [
      {
        href: "/produkter/stationaere-computere",
        label: { da: "Brugte stationære computere", en: "Used desktop computers" },
      },
      {
        href: "/reparation/samling-af-pc",
        label: { da: "Få samlet en pc af os", en: "Have us build the PC" },
      },
    ],
    sources: [guideSource("windows11Requirements")],
    faqs: [
      {
        question: {
          da: "I hvilken rækkefølge skal delene vælges?",
          en: "In what order should the parts be chosen?",
        },
        answer: {
          da: "Processoren bestemmer soklen, og bundkortet skal have præcis den sokkel. Bundkortet bestemmer hukommelsens generation og antallet af moduler. Kabinettet bestemmer, hvor langt et grafikkort og hvor høj en køler der kan være. Strømforsyningen skal kunne klare grafikkortet med luft over. Vælg i den rækkefølge, så låser hvert valg det næste.",
          en: "The processor decides the socket, and the motherboard has to have exactly that socket. The motherboard decides the memory generation and how many modules fit. The case decides how long a graphics card and how tall a cooler can be. The power supply has to handle the graphics card with headroom. Choose in that order and each choice locks the next.",
        },
      },
      {
        question: {
          da: "Skal bundkortet samles i kabinettet?",
          en: "Should the motherboard be assembled in the case?",
        },
        answer: {
          da: "Nej. Sæt processor, hukommelse og M.2-disk i bundkortet, mens det ligger på bordet. Der er langt bedre plads dér end nede i kabinettet, hvor det er trangt at komme til.",
          en: "No. Fit the processor, memory and M.2 drive to the motherboard while it is lying on the table. There is far more room there than down in the case, where it is cramped to reach.",
        },
      },
      {
        question: {
          da: "Pc'en vil ikke starte første gang – hvad er det typisk?",
          en: "The PC will not start the first time — what is it usually?",
        },
        answer: {
          da: "Fire ting står tit bag det. Det ekstra 8-benede strømstik til processoren er ikke sat i, og så er maskinen helt død. Hukommelsen sidder i de forkerte sokler. Skærmen er sat i bundkortets udgang i stedet for grafikkortets, og så er billedet sort, selvom alt virker. Eller afstandsboltene mellem kabinet og bundkort mangler og kan kortslutte bundkortet mod pladen.",
          en: "Four things are often behind it. The extra 8-pin processor power connector is not plugged in, and the machine is completely dead. The memory is in the wrong sockets. The monitor is plugged into the motherboard's output instead of the graphics card's, so the picture is black although everything works. Or the standoffs between case and motherboard are missing and can short the board against the tray.",
        },
      },
      {
        question: {
          da: "Hvad skal man gøre, første gang maskinen starter?",
          en: "What should be done the first time the machine starts?",
        },
        answer: {
          da: "BIOS før alt andet: se efter, at processor, hukommelse og disk bliver fundet, og slå XMP eller EXPO til. Først derefter Windows fra en USB-nøgle.",
          en: "The BIOS before anything else: check that the processor, memory and drive are all detected, and switch XMP or EXPO on. Windows from a USB stick comes after that.",
        },
      },
    ],
  },
  {
    slug: "windows-11-paa-aeldre-maskine",
    cluster: "lifecycle",
    type: "beslutning",
    intent: "informational-commercial",
    primaryKeyword: "windows 11 krav gammel computer",
    author: "alireza",
    title: {
      da: "Windows 11 på en gammel computer: hvad er kravene?",
      en: "Upgrading an older business PC to Windows 11: what it takes",
    },
    metaTitle: {
      da: "Windows 11 på ældre computer: krav og løsninger | Kestro",
      en: "Windows 11 on an older PC: requirements and options | Kestro",
    },
    metaDescription: {
      da: "Kan din pc få Windows 11? Tjek CPU, TPM og Secure Boot med PC Health Check. Læs om dine muligheder, hvis maskinen ikke opfylder kravene.",
      en: "Can an old PC run Windows 11? Use PC Health Check to check CPU, TPM and Secure Boot. Find out what to do next if the device is not supported.",
    },
    summary: {
      da: "Hvorfor en maskine, der virker fint, ikke altid kan få Windows 11 – og hvad mulighederne så er.",
      en: "Why a machine that works fine cannot always get Windows 11 — and what the options are.",
    },
    audience: { da: "Private og virksomheder", en: "Individuals and companies" },
    readingMinutes: 6,
    published: "2026-08-23",
    updated: "2026-10-16",
    tldr: {
      da: "Brug Microsofts PC Health Check til den konkrete computer. Processoren, TPM 2.0, UEFI/Secure Boot og de øvrige krav skal passe; generationen alene afgør det ikke. Kontrollér også drivere og arbejdsprogrammer. Tag backup og find BitLocker-nøglen før firmwareændringer. En installation, der omgår kravene, er ikke en understøttet løsning.",
      en: "Use Microsoft's PC Health Check for the actual computer. The processor, TPM 2.0, UEFI/Secure Boot and other requirements must match; generation alone does not decide it. Also check drivers and work applications. Back up and locate the BitLocker key before firmware changes. Bypassing the requirements does not produce a supported installation.",
    },
    intro: {
      da: "En fungerende computer er ikke nødvendigvis egnet til Windows 11. Her skelner vi mellem at kunne installere systemet, at opfylde kravene og at have en brugbar, understøttet arbejdsplads bagefter.",
      en: "A working computer is not necessarily eligible for Windows 11. Here we distinguish being able to install the system, meeting its requirements and having a useful, supported workstation afterwards.",
    },
    sections: [
      {
        heading: { da: "De tre krav", en: "The three requirements" },
        body: [
          {
            da: "Windows 11 kræver blandt andet TPM 2.0, UEFI med Secure Boot-egnethed og en kompatibel processor. Microsoft angiver også krav til RAM, lager, grafik og skærm. Minimumskrav er ikke en anbefalet konfiguration til alle arbejdsopgaver.",
            en: "Windows 11 requires, among other things, TPM 2.0, UEFI with Secure Boot capability and a compatible processor. Microsoft also specifies memory, storage, graphics and display requirements. Minimum requirements are not a recommended configuration for every workload.",
          },
          {
            da: "Et Intel-generationsnummer er ikke en komplet kompatibilitetskontrol. T480 findes eksempelvis med både 7. og 8. generations CPU, mens andre modelnavnes »Gen 7« beskriver produktgenerationen og ikke processoren. Mere RAM eller en ny SSD ændrer ikke CPU'ens supportstatus.",
            en: "An Intel generation number is not a complete compatibility check. T480, for example, has both 7th- and 8th-generation CPU variants, while Gen 7 in another model name may describe its product generation, not its processor. More memory or a new SSD does not change CPU support status.",
          },
        ],
      },
      {
        heading: { da: "Tjek det selv", en: "Check it yourself" },
        body: [
          {
            da: "Kør først Microsofts PC Health Check på en eksisterende Windows-pc. Det giver en samlet vurdering og forklarer krav, der ikke er opfyldt. På administreret udstyr skal IT-ansvarlige vurdere kompatibiliteten og godkende ændringer.",
            en: "Start with Microsoft's PC Health Check on an existing Windows PC. It provides an overall assessment and explains unmet requirements. On managed equipment, IT must assess compatibility and approve changes.",
          },
          {
            da: "tpm.msc kan vise TPM-versionen, og msinfo32 viser blandt andet BIOS- og Secure Boot-status. Brug producentens vejledning ved ændringer. Tag sikkerhedskopi og find BitLocker-genoprettelsesnøglen først; ryd ikke TPM og skift ikke fra Legacy til UEFI på gæt.",
            en: "tpm.msc can show the TPM version, and msinfo32 shows BIOS and Secure Boot status among other details. Use manufacturer instructions for changes. Back up and locate the BitLocker recovery key first; do not clear TPM or switch from Legacy to UEFI by guesswork.",
          },
        ],
      },
      {
        heading: {
          da: "Hvis maskinen ikke kan komme med",
          en: "If the machine cannot come along",
        },
        body: [
          {
            da: "Der findes vejledninger til at omgå kravene. Vi anbefaler det ikke på en maskine, der skal bruges i en virksomhed: Microsoft giver ingen garanti for opdateringer bagefter, og en maskine uden sikkerhedsopdateringer er et problem, ikke en besparelse.",
            en: "There are guides to bypassing the requirements. We do not recommend it on a machine used in a company: Microsoft gives no guarantee of updates afterwards, and a machine without security updates is a problem, not a saving.",
          },
          {
            da: "Windows 10 22H2 mistede almindelig support 14. oktober 2025. Kontrollér særskilt ESU-berettigelse og slutdato eller en eksisterende LTSC-udgaves vilkår; de er ikke automatisk tilgængelige for enhver maskine. Alternativer er understøttet erstatningshardware eller et andet understøttet styresystem, hvis programmer og udstyr passer.",
            en: "Windows 10 22H2 lost general support on 14 October 2025. Check separate ESU eligibility and expiry, or the terms of an existing LTSC edition; these are not automatically available for every machine. Alternatives include supported replacement hardware or another supported operating system if applications and peripherals are compatible.",
          },
        ],
      },
    ],
    closing: {
      da: "Skal en hel flåde vurderes, kan vi gennemgå listen med jer og sige, hvilke maskiner der kan følge med, og hvilke det bedre kan betale sig at skifte.",
      en: "If a whole fleet needs assessing, we can go through the list with you and say which machines can come along and which are better replaced.",
    },
    related: [
      {
        href: "/produkter/baerbare-computere",
        label: { da: "Bærbare til Windows 11", en: "Laptops for Windows 11" },
      },
      {
        href: "/tilbud",
        label: { da: "Få et tilbud på udskiftningen", en: "Get a quote for the replacement" },
      },
      {
        href: "/reparation/windows-installation",
        label: { da: "Ren installation af Windows", en: "A clean Windows installation" },
      },
      {
        href: "/reparation/software-og-licenser",
        label: { da: "Licenser til firmacomputere", en: "Licences for company computers" },
      },
    ],
    sources: [
      guideSource("windows11Requirements"),
      guideSource("pcHealthCheck"),
      guideSource("unsupportedWindows11"),
      guideSource("windows10Servicing"),
      guideSource("thinkpadT480Specs"),
      guideSource("bitlockerRecovery"),
    ],
    faqs: [
      {
        question: {
          da: "Hvad kræver Windows 11 af maskinen?",
          en: "What does Windows 11 require of the machine?",
        },
        answer: {
          da: "Blandt andet en kompatibel processor, TPM 2.0, UEFI/Secure Boot-egnethed samt Microsofts krav til RAM, lager, grafik og skærm. Brug PC Health Check til vurdering af den konkrete pc; et enkelt generationsnummer er ikke nok.",
          en: "Among other requirements, a compatible processor, TPM 2.0, UEFI/Secure Boot capability and Microsoft's memory, storage, graphics and display requirements. Use PC Health Check to assess the actual PC; a generation number alone is not enough.",
        },
      },
      {
        question: {
          da: "Hvordan tjekker jeg, om min maskine opfylder kravene?",
          en: "How do I check whether my machine meets the requirements?",
        },
        answer: {
          da: "Kør PC Health Check fra Microsoft. Brug tpm.msc og msinfo32 til supplerende oplysninger, ikke som erstatning for den samlede kompatibilitetskontrol. Afklar også drivere, programmer og eventuelle blokeringer i Windows Update.",
          en: "Run Microsoft's PC Health Check. Use tpm.msc and msinfo32 for additional information, not as substitutes for the complete compatibility assessment. Also check drivers, applications and any Windows Update safeguards.",
        },
      },
      {
        question: {
          da: "TPM står som slået fra – kan det laves om?",
          en: "TPM shows as switched off — can that be changed?",
        },
        answer: {
          da: "Nogle maskiner har en indstilling til at aktivere TPM. Følg producentens modelspecifikke vejledning, tag sikkerhedskopi og find BitLocker-nøglen først. Ryd ikke TPM som forsøg på at løse kompatibilitet.",
          en: "Some machines have a setting to enable TPM. Follow model-specific manufacturer guidance, back up and locate the BitLocker key first. Do not clear TPM as an attempt to fix compatibility.",
        },
      },
      {
        question: {
          da: "Kan en bærbar med 8. eller 9. generations Intel få Windows 11?",
          en: "Can an 8th- or 9th-generation Intel laptop run Windows 11?",
        },
        answer: {
          da: "Vurder den præcise pc med PC Health Check. Generationsnummeret alene er ikke et ja: processor, firmware, TPM og de øvrige krav samt relevante drivere skal passe. Mere RAM eller en SSD gør ikke en ikke-understøttet CPU understøttet.",
          en: "Assess the exact PC with PC Health Check. The generation number alone is not a yes: processor, firmware, TPM, other requirements and relevant drivers must match. More memory or an SSD does not make an unsupported CPU supported.",
        },
      },
      {
        question: {
          da: "Kan man omgå kravene til Windows 11?",
          en: "Can the Windows 11 requirements be bypassed?",
        },
        answer: {
          da: "Der findes vejledninger til det, men vi anbefaler det ikke på en maskine, der skal bruges i en virksomhed. Microsoft giver ingen garanti for opdateringer bagefter, og en maskine uden sikkerhedsopdateringer er et problem i sig selv.",
          en: "Guides to doing it exist, but we do not recommend it on a machine that will be used in a company. Microsoft gives no guarantee of updates afterwards, and a machine without security updates is a problem in itself.",
        },
      },
    ],
  },
  {
    slug: "slet-data-foer-du-saelger",
    cluster: "buying-condition",
    type: "praktisk",
    intent: "informational",
    primaryKeyword: "sikker datasletning",
    author: "alireza",
    title: {
      da: "Sikker datasletning, før du sælger eller kasserer en computer",
      en: "Secure data erasure for businesses selling or scrapping computers",
    },
    metaTitle: {
      da: "Sikker datasletning før salg eller kassering | Kestro",
      en: "Secure data erasure before selling or scrapping PCs | Kestro",
    },
    metaDescription: {
      da: "Sikker datasletning før salg: se forskellen på SSD, harddisk og Windows-nulstilling. Få råd om backup, metode og sletterapport til firmaets pc'er.",
      en: "Erase PC data before selling: compare reset, SSD and hard drive sanitisation. See backups, choosing a method and records for company PCs.",
    },
    summary: {
      da: "Formatering er ikke sletning. Forskellen kan koste dyrt, hvis det er en firmamaskine.",
      en: "Formatting is not erasing. The difference gets expensive if it is a company machine.",
    },
    audience: { da: "Private og virksomheder", en: "Individuals and companies" },
    readingMinutes: 4,
    published: "2026-08-23",
    updated: "2026-10-16",
    tldr: {
      da: "Sikker datasletning kræver en metode, der passer til drevet og dataenes følsomhed. Tag en kontrolleret backup først. Windows-nulstilling med Rens data er beregnet til forbrugere, ikke dokumenteret branchesletning. Til virksomhedsudstyr skal metode, resultat og ansvar afklares; en slettet fil, en glemt adgangskode eller ét fjernet nøgleeksemplar er ikke i sig selv bevis på sletning.",
      en: "Secure data erasure requires a method suited to the drive and sensitivity of its data. Make a verified backup first. Windows reset with Clean data is intended for consumers, not documented industry sanitisation. For company equipment, establish the method, result and responsibility; a deleted file, forgotten password or one removed key copy does not itself prove erasure.",
    },
    intro: {
      da: "Før en computer sælges eller afleveres, skal der være en plan for data og konti. Denne guide skelner mellem en forbrugernulstilling og en dokumenteret sletningsproces; den er ikke en modelspecifik slettekommando eller en certificering af et drev.",
      en: "Before selling or handing over a computer, plan what happens to its data and accounts. This guide distinguishes a consumer reset from a documented sanitisation process; it is not a model-specific erase command or certification of a drive.",
    },
    sections: [
      {
        heading: { da: "For en privat maskine", en: "For a personal machine" },
        body: [
          {
            da: "Kontrollér først en sikkerhedskopi, og afklar konti, licenser og eventuelle enhedslåse. Microsoft beskriver Fjern alt med Rens data som en mulighed ved almindelig privat overdragelse: den gør gendannelse sværere. Microsoft understreger samtidig, at funktionen ikke opfylder statslige eller branchespecifikke datasletningsstandarder.",
            en: "First verify a backup and establish what happens to accounts, licences and device locks. Microsoft describes Remove everything with Clean data as an option for an ordinary private handover: it makes recovery harder. Microsoft also states that this function does not meet government or industry data-erasure standards.",
          },
          {
            da: "Antag ikke, at BitLocker eller FileVault alene dokumenterer sletning. Kryptografisk sletning kræver kontrol over kryptering og de relevante nøgler og nøglekopier. Er data følsomme, eller er opsætningen ukendt, så få metoden vurderet af en fagperson frem for blot at slette en gemt genoprettelsesnøgle.",
            en: "Do not assume BitLocker or FileVault alone proves erasure. Cryptographic erasure requires control over encryption and the relevant keys and key copies. For sensitive data or an unknown configuration, have a specialist assess the method instead of merely deleting a saved recovery key.",
          },
        ],
      },
      {
        heading: { da: "SSD og harddisk er ikke ens", en: "SSDs and hard disks are not the same" },
        body: [
          {
            da: "Valget afhænger af mediet, den konkrete enhed, dens tilstand og den nødvendige sikkerhed. NIST skelner mellem Clear, Purge og Destroy; det er ikke tre udskiftelige knapper. Følg drevproducentens dokumentation for en understøttet metode og kontrollér resultatet. Et værktøj med navnet Secure Erase er ikke i sig selv en certificering. Fysisk destruktion bør overlades til en egnet faglig proces, ikke improviseres derhjemme.",
            en: "The choice depends on the medium, exact device, its condition and required assurance. NIST distinguishes Clear, Purge and Destroy; these are not three interchangeable buttons. Follow drive-manufacturer documentation for a supported method and verify the result. A tool labelled Secure Erase is not itself certification. Physical destruction should use a suitable professional process, not an improvised home method.",
          },
        ],
      },
      {
        heading: {
          da: "For en virksomhed er det ikke nok",
          en: "For a company that is not enough",
        },
        body: [
          {
            da: "Aftal omfang, ansvar og dokumentation med den, der håndterer udstyret. Bed om identifikation af drev og enhed, valgt metode, udførelsesdato og kontrollens resultat. Afklar undtagelser og fejl; en rapport bør beskrive, hvad der faktisk er udført, ikke blot love, at alle data er væk.",
            en: "Agree scope, responsibility and documentation with the equipment handler. Ask for drive and device identification, selected method, execution date and verification result. Establish how exceptions and failures are handled; a report should describe what was actually done, not simply promise that all data is gone.",
          },
          {
            da: "Husk også BIOS-adgangskoder og enhedslåse. En maskine, der stadig er bundet til jeres administration, kan ikke bruges af den næste ejer.",
            en: "Remember BIOS passwords and device locks too. A machine still tied to your management system is unusable for the next owner.",
          },
        ],
      },
    ],
    closing: {
      da: "Køber vi jeres udstyr, sletter vi data som en del af aftalen og leverer dokumentationen med. I kan også bare bede om rådgivningen – den koster ingenting.",
      en: "If we buy your equipment, erasing the data is part of the deal and the documentation comes with it. You are also welcome to just ask for the advice — that costs nothing.",
    },
    related: [
      {
        href: "/saelg-til-os",
        label: { da: "Sælg jeres brugte udstyr til os", en: "Sell your used equipment to us" },
      },
      {
        href: "/ydelser/overskudslager-og-returvarer",
        label: { da: "Overskudslager og returvarer", en: "Surplus stock and returns" },
      },
      {
        href: "/reparation/ny-opsaetning-og-dataflytning",
        label: { da: "Flyt data til ny computer", en: "Move data to a new computer" },
      },
    ],
    sources: [guideSource("nistSanitization"), guideSource("windowsResetErasure")],
    faqs: [
      {
        question: {
          da: "Er det nok at slette filerne og tømme papirkurven?",
          en: "Is deleting the files and emptying the recycle bin enough?",
        },
        answer: {
          da: "Nej, det er ikke dokumentation for sikker datasletning. Windows' Fjern alt med Rens data er en forbrugermulighed med begrænsninger. Vælg og kontrollér en passende metode ud fra mediet og dataenes følsomhed.",
          en: "No, it does not demonstrate secure sanitisation. Windows Remove everything with Clean data is a consumer option with limitations. Select and verify an appropriate method based on the medium and data sensitivity.",
        },
      },
      {
        question: {
          da: "Hvordan sletter man data på en SSD?",
          en: "How is data erased on an SSD?",
        },
        answer: {
          da: "Brug drevproducentens understøttede metode til den konkrete SSD og det krævede sikkerhedsniveau, og kontrollér resultatet. Antag ikke, at en almindelig overskrivning eller sletning af en BitLocker-nøgle er tilstrækkelig.",
          en: "Use the drive manufacturer's supported method for the exact SSD and required assurance, and verify the result. Do not assume ordinary overwriting or deleting a BitLocker key is sufficient.",
        },
      },
      {
        question: {
          da: "Hvad skal en virksomhed gøre ud over at slette?",
          en: "What does a company have to do beyond erasing?",
        },
        answer: {
          da: "Afklar ansvar, omfang og dokumentation. En rapport bør identificere enhed og drev og angive metode, dato, kontrolresultat og eventuelle fejl eller undtagelser.",
          en: "Establish responsibility, scope and documentation. A report should identify the device and drive and record method, date, verification result and any failures or exceptions.",
        },
      },
      {
        question: {
          da: "Hvad med BIOS-adgangskoder og enhedslåse?",
          en: "What about BIOS passwords and device locks?",
        },
        answer: {
          da: "De skal fjernes sammen med data. En maskine, der stadig er bundet til jeres administration, kan ikke bruges af den næste ejer.",
          en: "They have to come off along with the data. A machine that is still tied to your administration cannot be used by the next owner.",
        },
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
