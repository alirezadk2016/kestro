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
  quality: { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
};

export const serviceNav: NavLink[] = [
  { href: "/flaadeloesninger", label: { da: "Flådeløsninger", en: "Fleet solutions" } },
  { href: "/produkter", label: { da: "Hvad vi skaffer", en: "What we source" } },
  { href: "/modeller", label: { da: "Populære modeller", en: "Popular models" } },
  { href: "/kvalitet", label: { da: "Stand og kvalitet", en: "Condition and quality" } },
  { href: "/saelg-til-os", label: { da: "Sælg jeres udstyr", en: "Sell your equipment" } },
  { href: "/reparation", label: { da: "Reparation", en: "Repairs" } },
  { href: "/ydelser", label: { da: "Alle ydelser", en: "All services" } },
  { href: "/vejledninger", label: { da: "Vejledninger", en: "Guides" } },
];

export const companyNav: NavLink[] = [
  { href: "/", label: { da: "Forside", en: "Home" } },
  { href: "/om-os", label: { da: "Om os", en: "About us" } },
  { href: "/kontakt", label: { da: "Kontakt", en: "Contact" } },
  { href: "/privatlivspolitik", label: { da: "Privatlivspolitik", en: "Privacy policy" } },
];

/** Buttons and labels that appear in more than one place. */
export const ui = {
  bookCall: { da: "Book en samtale", en: "Book a call" },
  talkToAdviser: { da: "Tal med en rådgiver", en: "Talk to an adviser" },
  openMenu: { da: "Åbn eller luk menu", en: "Open or close menu" },
  breadcrumb: { da: "Brødkrumme", en: "Breadcrumb" },
  language: { da: "Sprog", en: "Language" },
} satisfies Record<string, Localized>;
