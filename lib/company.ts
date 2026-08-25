import type { Lang, Localized } from "./i18n";

/**
 * Single source of truth for company contact details.
 * Update here and every page picks it up.
 */
export const company = {
  name: "Kestro",
  email: "info@kestro.dk",
  /*
   * Empty until there is a number to publish. Nothing renders a phone that is
   * not here — the header's call button, the contact card, the footer's legal
   * line and the Organization schema all check first — so the site simply
   * routes people to email and the form instead.
   *
   * Left blank rather than printed as "+45 XX XX XX XX" for the same reason
   * "CVR: Tilføjes snarest" came out: a visible placeholder tells a buyer the
   * company is not ready. Filling these two fields in turns the phone back on
   * everywhere at once.
   */
  phoneDisplay: "" as string,
  /** tel: href format, digits and a leading +. */
  phoneHref: "" as string,
  city: "Aarhus",
  country: { da: "Danmark", en: "Denmark" } as Localized,
  /** Shown wherever a short location line is needed */
  locationShort: { da: "Aarhus, Danmark", en: "Aarhus, Denmark" } as Localized,
  /** Markets served */
  serves: { da: "Danmark & Norge", en: "Denmark & Norway" } as Localized,
  /*
   * The legal identity, as e-handelsloven §7 requires it and as a procurement
   * manager will look for it before placing an order.
   *
   * Empty until the real values exist. Nothing renders a field that is empty:
   * a blank row is better than "to be added shortly", which tells a buyer the
   * company is not registered yet. Filling these in is the only step needed —
   * the contact page, the footer and the Organization schema all read from
   * here.
   */
  /* Annotated as string rather than left to `as const`, which would type an
     empty field as the literal "" and make every `company.cvr ? …` branch
     unreachable to the compiler. */
  cvr: "" as string,
  /** e.g. "ApS", "A/S", "Enkeltmandsvirksomhed". */
  legalForm: "" as string,
  /** Street and number. */
  street: "" as string,
  /** Four digits in Denmark. */
  postcode: "" as string,
  /** When there is a place to meet. Empty means "by appointment" only. */
  openingHours: { da: "", en: "" } as Localized,
} as const;

/** Whether there is enough to publish a legal-details block at all. */
export const hasLegalDetails = Boolean(company.cvr);

/** The postal address on one line, as much of it as exists. */
export function postalAddress(lang: Lang): string {
  return (
    [company.street, [company.postcode, company.city].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ")
      .trim() || company.locationShort[lang]
  );
}

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
