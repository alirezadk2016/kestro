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
  phoneDisplay: string;
  phoneHref: string;
  photo: string;
  /** Short intro shown on the team card. */
  bio: Localized;
  /** Optional direct email — omit until the address actually exists. */
  email?: string;
};

export const team: TeamMember[] = [
  {
    name: "Mehdi",
    role: { da: "Salgs- og marketingchef", en: "Head of Sales and Marketing" },
    phoneDisplay: "+45 91 19 91 15",
    phoneHref: "+4591199115",
    photo: "/mehdi.jpg",
    bio: {
      da: "Står for salg og kunderelationer hos Kestro. Ring, hvis I vil have et bud på en leverance, en flådeløsning eller en vurdering af jeres brugte udstyr.",
      en: "Handles sales and customer relationships at Kestro. Call if you want a quote on a delivery, a fleet solution, or a valuation of your used equipment.",
    },
  },
];
