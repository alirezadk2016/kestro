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
  country: "Danmark",
  /** Shown wherever a short location line is needed */
  locationShort: "Aarhus, Danmark",
  /** Markets served */
  serves: "Danmark & Norge",
  /** Not registered yet — leave empty until a real CVR exists. */
  cvr: "",
} as const;
