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

export type TeamMember = {
  name: string;
  role: string;
  phoneDisplay: string;
  phoneHref: string;
  photo: string;
  /** Short intro shown on the team card. */
  bio: string;
  /** Optional direct email — omit until the address actually exists. */
  email?: string;
};

export const team: TeamMember[] = [
  {
    name: "Mehdi",
    role: "Salgs- og marketingchef",
    phoneDisplay: "+45 91 19 91 15",
    phoneHref: "+4591199115",
    photo: "/mehdi.jpg",
    bio: "Står for salg og kunderelationer hos Kestro. Ring, hvis I vil have et bud på en leverance, en flådeløsning eller en vurdering af jeres brugte udstyr.",
  },
];
