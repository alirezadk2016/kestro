import type { Localized } from "./i18n";

/**
 * Shared navigation labels for the header and footer.
 *
 * Paths stay the same in both languages — only the /en prefix differs, which
 * localePath() adds. Keeping one set of slugs keeps one route tree.
 */

/** `wide`: in the bar from xl only. Between 1024 and 1280 px eight words and
    the search, language and quote controls do not fit on one line. */
export type NavLink = { href: string; label: Localized; rel?: string; wide?: boolean };

/*
 * Price is the first thing a buyer looks for, so it is a word in the bar
 * rather than the fourth row of the products menu.
 */
export const mainNav: NavLink[] = [
  { href: "/priser", label: { da: "Priser", en: "Pricing" } },
  { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
  { href: "/saelg-til-os", label: { da: "Sælg til os", en: "Sell to us" } },
  { href: "/reparation", label: { da: "Reparation", en: "Repairs" } },
  { href: "/vejledninger", label: { da: "Viden", en: "Guides" }, wide: true },
  { href: "/om-os", label: { da: "Om os", en: "About us" } },
  { href: "/kontakt", label: { da: "Kontakt", en: "Contact" } },
];

export const productsNav = {
  /* "Produkter", the word a buyer scans a menu for. It was "Hvad vi skaffer",
     which is accurate and which nobody looks for. */
  hub: { href: "/produkter", label: { da: "Produkter", en: "Products" } },
  overview: { da: "Oversigt", en: "Overview" } as Localized,
  models: { href: "/modeller", label: { da: "Populære modeller", en: "Popular models" } },
  machine: { href: "/maskinen", label: { da: "Maskinen indeni", en: "Inside the machine" } },
  quality: { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
  sampleQuote: {
    href: "/tilbud-eksempel",
    label: { da: "Sådan ser et tilbud ud", en: "What a quote looks like" },
  },
};

/*
 * The footer, by what the reader is trying to do: see the machines, buy
 * them, use another service, or check who we are. It was three groups, and
 * "Ydelser" held eleven links from the products hub to the price page, so
 * "how do we buy" had no place of its own.
 */
export const productExtras: NavLink[] = [
  { href: "/modeller", label: { da: "Populære modeller", en: "Popular models" } },
  { href: "/maskinen", label: { da: "Maskinen indeni", en: "Inside the machine" } },
];

export const buyNav: NavLink[] = [
  { href: "/priser", label: { da: "Priser", en: "Pricing" } },
  { href: "/tilbud", label: { da: "Få et tilbud", en: "Get a quote" } },
  {
    href: "/tilbud-eksempel",
    label: { da: "Sådan ser et tilbud ud", en: "What a quote looks like" },
  },
  { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
  { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
];

export const serviceNav: NavLink[] = [
  { href: "/saelg-til-os", label: { da: "Sælg jeres udstyr", en: "Sell your equipment" } },
  { href: "/reparation", label: { da: "Reparation", en: "Repairs" } },
  { href: "/ydelser", label: { da: "Alle ydelser", en: "All services" } },
  { href: "/vejledninger", label: { da: "Artikler og guides", en: "Articles and guides" } },
  {
    href: "/vejledninger#praktiske-guides",
    label: { da: "Praktiske guides", en: "Practical guides" },
  },
];

/*
 * `rel` on the two legal links.
 *
 * Both pages exist and both are in the footer of every page, and an AI-SEO
 * audit still reported "no privacy policy or terms links found" — because it
 * looks for the English words in the href or the label, and the Danish URLs
 * /privatlivspolitik and /handelsbetingelser contain neither. Changing the
 * URLs to satisfy a detector would break canonicals and the sitemap for a
 * string match. `rel="privacy-policy"` and `rel="terms-of-service"` are
 * registered HTML link relations and say the same thing to a machine in a
 * way that does not depend on what language the site is written in.
 *
 * They were not enough for that audit, which matches the words only, so the
 * Danish footer also links the English versions of both pages — see the
 * "På engelsk" line in components/Footer.tsx.
 */
export const companyNav: NavLink[] = [
  { href: "/", label: { da: "Forside", en: "Home" } },
  { href: "/om-os", label: { da: "Om os", en: "About us" } },
  { href: "/kontakt", label: { da: "Kontakt", en: "Contact" } },
  {
    href: "/handelsbetingelser",
    label: { da: "Handelsbetingelser", en: "Terms of sale" },
    rel: "terms-of-service",
  },
  {
    href: "/privatlivspolitik",
    label: { da: "Privatlivspolitik", en: "Privacy policy" },
    rel: "privacy-policy",
  },
];

/**
 * Buttons and labels that appear in more than one place.
 *
 * The primary actions name what they are for. "Få et tilbud" and "Book en
 * samtale" are the two buttons every competitor also has, and a procurement
 * manager reads them as the same generic form; a button that says what will be
 * quoted is the one that gets pressed.
 */
export const ui = {
  /* The one primary action on the site. Worded here so the header, the hero
     and the closing band cannot end up promising three different things —
     and matching the "Få et tilbud" on the model pages it now shares a
     destination with. */
  bookCall: { da: "Få et tilbud", en: "Get a quote" },
  talkToAdviser: { da: "Tal med en rådgiver", en: "Talk to an adviser" },
  openMenu: { da: "Åbn eller luk menu", en: "Open or close menu" },
  mainNav: { da: "Hovedmenu", en: "Main navigation" },
  breadcrumb: { da: "Brødkrumme", en: "Breadcrumb" },
  language: { da: "Sprog", en: "Language" },
  callUs: { da: "Ring til os", en: "Call us" },
  skipToContent: { da: "Gå til indhold", en: "Skip to content" },
  search: { da: "Søg", en: "Search" },
  searchSite: { da: "Søg efter model, ydelse …", en: "Search models, services …" },
  /* The header's products disclosure. It is a separate control from the link
     beside it: the link goes to the hub, this opens the list. */
  showProducts: { da: "Vis produktsider", en: "Show product pages" },
} satisfies Record<string, Localized>;
