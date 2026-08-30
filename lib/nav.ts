import type { Localized } from "./i18n";

/**
 * Shared navigation labels for the header and footer.
 *
 * Paths stay the same in both languages — only the /en prefix differs, which
 * localePath() adds. Keeping one set of slugs keeps one route tree.
 */

export type NavLink = { href: string; label: Localized };

export const mainNav: NavLink[] = [
  { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
  { href: "/saelg-til-os", label: { da: "Sælg til os", en: "Sell to us" } },
  { href: "/reparation", label: { da: "Reparation", en: "Repairs" } },
  { href: "/vejledninger", label: { da: "Vejledninger", en: "Guides" } },
  { href: "/om-os", label: { da: "Om os", en: "About us" } },
  { href: "/kontakt", label: { da: "Kontakt", en: "Contact" } },
];

export const productsNav = {
  hub: { href: "/produkter", label: { da: "Hvad vi skaffer", en: "What we source" } },
  overview: { da: "Oversigt", en: "Overview" } as Localized,
  models: { href: "/modeller", label: { da: "Populære modeller", en: "Popular models" } },
  machine: { href: "/maskinen", label: { da: "Maskinen indeni", en: "Inside the machine" } },
  quality: { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
  pricing: { href: "/priser", label: { da: "Priser", en: "Pricing" } },
  sampleQuote: {
    href: "/tilbud-eksempel",
    label: { da: "Sådan ser et tilbud ud", en: "What a quote looks like" },
  },
};

export const serviceNav: NavLink[] = [
  { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
  { href: "/produkter", label: { da: "Hvad vi skaffer", en: "What we source" } },
  { href: "/modeller", label: { da: "Populære modeller", en: "Popular models" } },
  { href: "/maskinen", label: { da: "Maskinen indeni", en: "Inside the machine" } },
  { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
  { href: "/priser", label: { da: "Priser", en: "Pricing" } },
  {
    href: "/tilbud-eksempel",
    label: { da: "Sådan ser et tilbud ud", en: "What a quote looks like" },
  },
  { href: "/saelg-til-os", label: { da: "Sælg jeres udstyr", en: "Sell your equipment" } },
  { href: "/reparation", label: { da: "Reparation", en: "Repairs" } },
  { href: "/ydelser", label: { da: "Alle ydelser", en: "All services" } },
  { href: "/vejledninger", label: { da: "Vejledninger", en: "Guides" } },
];

export const companyNav: NavLink[] = [
  { href: "/", label: { da: "Forside", en: "Home" } },
  { href: "/om-os", label: { da: "Om os", en: "About us" } },
  { href: "/tilbud", label: { da: "Få et tilbud", en: "Get a quote" } },
  { href: "/kontakt", label: { da: "Kontakt", en: "Contact" } },
  { href: "/privatlivspolitik", label: { da: "Privatlivspolitik", en: "Privacy policy" } },
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
} satisfies Record<string, Localized>;
