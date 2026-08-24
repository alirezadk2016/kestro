import type { Localized } from "./i18n";

/**
 * Single source of truth for company contact details.
 * Update here and every page picks it up.
 */
export const company = {
  name: "Kestro",
  email: "info@kestro.dk",
  /** Display format (Danish convention: 8 digits, grouped in pairs) */
  phoneDisplay: "+45 91 48 88 43",
  /** tel: href format */
  phoneHref: "+4591488843",
  city: "Aarhus",
  country: { da: "Danmark", en: "Denmark" } as Localized,
  /** Shown wherever a short location line is needed */
  locationShort: { da: "Aarhus, Danmark", en: "Aarhus, Denmark" } as Localized,
  /** Markets served */
  serves: { da: "Danmark & Norge", en: "Denmark & Norway" } as Localized,
  /** Not registered yet — leave empty until a real CVR exists. */
  cvr: "",
} as const;

export type TeamMember = {
  name: string;
  role: Localized;
  /** Short intro shown on the team card. */
  bio: Localized;
  /**
   * Everything below is optional on purpose. A card renders with a name, a
   * role and the company address alone — a direct line, a personal address or
   * a photo is added when there is a real one to add, not filled in with a
   * placeholder.
   */
  phoneDisplay?: string;
  phoneHref?: string;
  photo?: string;
  email?: string;
};

export const team: TeamMember[] = [
  {
    name: "Mak",
    role: { da: "Salgs- og marketingchef", en: "Head of Sales and Marketing" },
    bio: {
      da: "Står for salg og kunderelationer hos Kestro. Skriv, hvis I vil have et bud på en leverance, en flådeløsning eller en vurdering af jeres brugte udstyr.",
      en: "Handles sales and customer relationships at Kestro. Write if you want a quote on a delivery, a fleet solution, or a valuation of your used equipment.",
    },
  },
];
