import { categories } from "@/lib/categories";
import { models } from "@/lib/models";
import { repairs } from "@/lib/repairs";
import { services } from "@/lib/services";
import { guides } from "@/lib/guides";
import { practicalGuides } from "@/lib/practical-guides";
import { localePath, type Lang, type Localized } from "@/lib/i18n";

/*
 * The site search's index, built once at build time from the same data the
 * pages render, so a page that exists is findable and a page that does not is
 * not. Fetched by the search dialog the first time it opens — never by a page
 * load — so it costs nothing to a visitor who does not search.
 *
 * Public pages only. Nothing here is not already in the sitemap.
 */
export const dynamic = "force-static";

type Entry = {
  /** group */
  g: "page" | "product" | "model" | "repair" | "service" | "guide";
  /** title */
  t: string;
  /** one line under it */
  d: string;
  /** href, in the entry's language */
  h: string;
  /** words a buyer types that the title does not contain */
  k?: string;
};

/* The pages that are not generated from a data file, named as the
   navigation names them, with the words people actually search for. */
const pages: { href: string; t: Localized; d: Localized; k?: string }[] = [
  {
    href: "/produkter",
    t: { da: "Produkter", en: "Products" },
    d: {
      da: "Alle kategorier: bærbare, stationære, skærme, mini-pc'er og mere",
      en: "All categories: laptops, desktops, monitors, mini PCs and more",
    },
    k: "hvad vi skaffer what we source computere computers kategorier categories udstyr equipment",
  },
  {
    href: "/priser",
    t: { da: "Priser", en: "Pricing" },
    d: {
      da: "Budgeteksempler og hvad der afgør prisen",
      en: "Budget examples and what decides the price",
    },
    k: "pris prisliste koster kr dkk budget price cost costs",
  },
  {
    href: "/tilbud",
    t: { da: "Få et tilbud", en: "Get a quote" },
    d: { da: "Send en uforpligtende forespørgsel", en: "Send a non-binding enquiry" },
    k: "bestil bestilling bestille køb købe ordre order buy forespørgsel enquiry quote tilbud",
  },
  {
    href: "/tilbud-eksempel",
    t: { da: "Sådan ser et tilbud ud", en: "What a quote looks like" },
    d: { da: "Et udfyldt eksempel, enhed for enhed", en: "A filled-in example, unit by unit" },
    k: "eksempel example sample",
  },
  {
    href: "/flaadeloesninger",
    t: { da: "Flådeløsninger", en: "Fleet solutions" },
    d: {
      da: "Computere til hele virksomheden – én model, én levering",
      en: "Computers for the whole company — one model, one delivery",
    },
    k: "flåde fleet mange many medarbejdere employees virksomhed company bulk",
  },
  {
    href: "/saelg-til-os",
    t: { da: "Sælg jeres udstyr", en: "Sell your equipment" },
    d: {
      da: "Vi køber brugt IT, henter det og sletter data",
      en: "We buy used IT, collect it and erase the data",
    },
    k: "sælg sælge sell opkøb byt bytte trade gamle old datasletning",
  },
  {
    href: "/reparation",
    t: { da: "Reparation og opgradering", en: "Repairs and upgrades" },
    d: {
      da: "Værksted for computere – også for private",
      en: "A workshop for computers — individuals welcome",
    },
    k: "reparer repair værksted workshop private",
  },
  {
    href: "/ydelser",
    t: { da: "Alle ydelser", en: "All services" },
    d: {
      da: "Indkøb, klargøring, levering, opkøb og opstart",
      en: "Sourcing, preparation, delivery, buy-back and setup",
    },
    k: "ydelser services",
  },
  {
    href: "/modeller",
    t: { da: "Populære modeller", en: "Popular models" },
    d: {
      da: "ThinkPad, EliteBook, Latitude, OptiPlex og flere",
      en: "ThinkPad, EliteBook, Latitude, OptiPlex and more",
    },
    k: "modeller models",
  },
  {
    href: "/maskinen",
    t: { da: "Maskinen indeni", en: "Inside the machine" },
    d: {
      da: "Hvad vi tester og skifter i en erhvervsbærbar",
      en: "What we test and replace in a business laptop",
    },
    k: "3d indeni inside",
  },
  {
    href: "/kvalitet",
    t: { da: "Stand og kvalitet", en: "Condition and quality" },
    d: {
      da: "Grad A, B og C, funktionstest og garanti",
      en: "Grades A, B and C, function test and warranty",
    },
    k: "grad grade garanti warranty test stand condition kvalitet quality",
  },
  {
    href: "/vejledninger",
    t: { da: "Artikler og guides", en: "Articles and guides" },
    d: {
      da: "Køb, priser, RAM, SSD, Windows og sikre opgraderinger",
      en: "Buying, prices, RAM, SSD, Windows and safe upgrades",
    },
    k: "vejledninger guides artikler articles",
  },
  {
    href: "/om-os",
    t: { da: "Om os", en: "About us" },
    d: { da: "Hvem Kestro er, og hvordan vi arbejder", en: "Who Kestro is and how we work" },
    k: "kestro om about",
  },
  {
    href: "/kontakt",
    t: { da: "Kontakt", en: "Contact" },
    d: {
      da: "Skriv til os eller find den rette person",
      en: "Write to us or find the right person",
    },
    k: "kontakt contact email e-mail mail telefon phone",
  },
  {
    href: "/handelsbetingelser",
    t: { da: "Handelsbetingelser", en: "Terms of sale" },
    d: { da: "Status, vilkår og reklamation", en: "Status, terms and complaints" },
    k: "vilkår terms betingelser",
  },
  {
    href: "/privatlivspolitik",
    t: { da: "Privatlivspolitik", en: "Privacy policy" },
    d: { da: "Hvilke oplysninger vi gemmer, og hvorfor", en: "What we store and why" },
    k: "privatliv privacy gdpr cookies",
  },
];

/* The other words for each category, in both languages. */
const categoryWords: Record<string, string> = {
  "baerbare-computere": "laptop laptops notebook bærbar bærbare computer pc",
  "stationaere-computere": "desktop stationær stationære pc computer tower kontor-pc",
  skaerme: "monitor monitors skærm display",
  "mini-pc": "mini pc tiny micro",
  tablets: "tablet ipad",
  smartphones: "mobil mobiltelefon telefon iphone phone smartphone",
  dockingstationer: "dock docks docking usb-c tilbehør accessories kabler cables",
};

/* A one-line excerpt: the first sentence, cut at a word if it is long. */
const line = (s: string) => {
  const first = s.split(/(?<=[.!?])\s/)[0] ?? s;
  return first.length <= 110 ? first : `${first.slice(0, 107).replace(/\s+\S*$/, "")}…`;
};

function build(lang: Lang): Entry[] {
  return [
    ...pages.map((p) => ({
      g: "page" as const,
      t: p.t[lang],
      d: p.d[lang],
      h: localePath(p.href, lang),
      k: p.k,
    })),
    ...categories.map((c) => ({
      g: "product" as const,
      t: c.name[lang],
      d: line(c.tagline[lang]),
      h: localePath(`/produkter/${c.slug}`, lang),
      k: `${c.shortName[lang]} ${categoryWords[c.slug] ?? ""}`,
    })),
    ...models.map((m) => ({
      g: "model" as const,
      t: m.name,
      d: line(m.tagline[lang]),
      h: localePath(`/modeller/${m.slug}`, lang),
      k: `${m.brand} ${m.format[lang]}`,
    })),
    ...repairs.map((r) => ({
      g: "repair" as const,
      t: r.name[lang],
      d: line(r.summary[lang]),
      h: localePath(`/reparation/${r.slug}`, lang),
    })),
    ...services.map((s) => ({
      g: "service" as const,
      t: s.name[lang],
      d: line(s.summary[lang]),
      h: localePath(`/ydelser/${s.slug}`, lang),
    })),
    ...[...guides, ...practicalGuides].map((gd) => ({
      g: "guide" as const,
      t: gd.title[lang],
      d: line(gd.summary[lang]),
      h: localePath(`/vejledninger/${gd.slug}`, lang),
      k: "primaryKeyword" in gd ? gd.primaryKeyword : gd.title.da,
    })),
  ];
}

export function GET() {
  return Response.json(
    { da: build("da"), en: build("en") },
    { headers: { "Cache-Control": "public, max-age=3600, must-revalidate" } },
  );
}
