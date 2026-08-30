import type { Lang, Localized } from "./i18n";
import teamPhotos from "./team-photos.json";

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
  /**
   * Stable key. It is what the photo on disk is named after
   * (public/team/<id>.webp) and what the pages that need one specific person
   * look up, so reordering the list below never moves a face or a name.
   */
  id: string;
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
  /**
   * Whether this person is one of the people an enquiry actually reaches.
   *
   * The closing band on every page says "dem I kommer til at tale med", and
   * that has to stay literally true: the whole team belongs on /om-os, but a
   * buyer writing about a delivery is answered by the two who handle
   * deliveries.
   */
  handlesEnquiries?: boolean;
};

/*
 * No phone numbers here, deliberately: the two fields exist because the
 * layouts read them, not because a number is coming. See the note on
 * company.phoneDisplay above — the same reasoning applies per person.
 */
const people: TeamMember[] = [
  {
    id: "ismail-masoumabadi",
    name: "Ismail Masoumabadi",
    role: {
      da: "Netværkssikkerhed & international salgsledelse",
      en: "Network Security & International Sales Management",
    },
    bio: {
      da: "Står for indkøbene i udlandet og for netværkssikkerheden i virksomheden. Han finder partierne hos leverandørerne i Sydeuropa, kontrollerer hvad der reelt er i dem, og sørger for, at det I sender os gennem siden, bliver håndteret forsvarligt.",
      en: "Runs the sourcing abroad and the company's network security. He finds the batches with suppliers in Southern Europe, checks what is actually in them, and makes sure that what you send us through this site is handled properly.",
    },
    handlesEnquiries: true,
  },
  {
    id: "mehdi",
    name: "Mehdi",
    role: {
      da: "Salgsrådgivning & chef for marketing og salg",
      en: "Sales Advisory & Head of Marketing and Sales",
    },
    bio: {
      da: "Er den, I taler med om en leverance. Han tager imod jeres behov, henter priserne hjem og sender et skriftligt tilbud, I kan regne på – uden at I binder jer til noget.",
      en: "The one you talk to about a delivery. He takes your requirements, gets the prices in and sends a written quote you can work with — with nothing committed.",
    },
    handlesEnquiries: true,
  },
  {
    id: "alireza",
    name: "Alireza",
    role: {
      da: "Medstifter & teknisk ansvarlig",
      en: "Co-founder & Technical Director",
    },
    bio: {
      da: "Står bag den tekniske side af Kestro: sitet, produktdata og kontrollen, før en maskine bliver beskrevet her. Han holder øje med, at specifikationerne passer, at komponenterne spiller sammen, og at det, siden siger om en model, er det samme, som står i tilbuddet.",
      en: "Behind the technical side of Kestro: the site, the product data and the checking that happens before a machine is described here. He watches that the specifications hold, that the components work together, and that what the site says about a model is what turns up in the quote.",
    },
  },
];

/*
 * A face is shown when a face exists on disk. scripts/build-team-photos.mjs
 * writes team-photos.json from whatever is in assets/team/, so dropping a
 * photograph in and running the script is the whole job: no edit here, and no
 * page left pointing at a file that 404s because it was named in advance.
 */
export const team: TeamMember[] = people.map((person) => {
  const photo = (teamPhotos as Record<string, string>)[person.id];
  return photo ? { ...person, photo } : person;
});

const byId = (id: string): TeamMember => team.find((member) => member.id === id) ?? team[0];

/**
 * Who a buyer is put in front of, by market.
 *
 * A visitor reading the Danish site is in Scandinavia and should land on
 * Mehdi, who handles the Nordic sales; a visitor reading the English site is
 * writing in from outside it and should land on Ismail, whose job is the
 * international side. Both are real people with real roles — this only decides
 * which of them is named first.
 *
 * Keyed off the language rather than off the request's country, because the
 * language is what the reader actually sees, and it is settled once by the
 * middleware rather than re-derived on every page.
 */
export function primaryContact(lang: Lang): TeamMember {
  return lang === "da" ? byId("mehdi") : byId("ismail-masoumabadi");
}

/** The team with the market's own contact first. */
export function teamFor(lang: Lang): TeamMember[] {
  const first = primaryContact(lang);
  return [first, ...team.filter((member) => member.id !== first.id)];
}

/** Only the people an enquiry reaches, the market's own contact first. */
export function enquiryContacts(lang: Lang): TeamMember[] {
  return teamFor(lang).filter((member) => member.handlesEnquiries);
}
