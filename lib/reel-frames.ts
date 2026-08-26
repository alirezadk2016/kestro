import type { Lang } from "@/lib/i18n";

type Localized = Record<Lang, string>;

/*
 * The six steps the hero carousel shows, in order — the way an order actually
 * runs, from the question a buyer starts with to the desks being ready.
 *
 * The captions live here rather than in the pictures for three reasons: they
 * exist in both languages, a screen reader can read them, and every one of
 * them links to the page that documents what it says. That last one is the
 * point. A line here is only allowed to claim what /ydelser already sets out —
 * so the delivery step says the timeframe is given before you order, which is
 * what /ydelser/levering says, and not that delivery is fast, which is a claim
 * nothing on the site can document.
 */
export type ReelFrame = {
  /** Matches the file in public/reel and the entry in lib/reel-view.json. */
  id: string;
  name: Localized;
  line: Localized;
  /** The page that documents this step. */
  href: string;
  /** What the picture shows, for anyone who cannot see it. */
  alt: Localized;
};

export const reelFrames: ReelFrame[] = [
  {
    id: "1-spoergsmaal",
    name: { da: "Spørgsmålet", en: "The question" },
    line: {
      da: "Hvor køber man brugt erhvervs-IT uden at gætte på stand, pris og garanti?",
      en: "Where do you buy used business IT without guessing at condition, price and warranty?",
    },
    href: "/ydelser/sourcing-og-indkoeb",
    alt: {
      da: "En mand ved et skrivebord med en bærbar computer, i tvivl om hvor han skal købe",
      en: "A man at a desk with a laptop, unsure where to buy",
    },
  },
  {
    id: "2-raadgivning",
    name: { da: "Rådgivning", en: "Advice" },
    line: {
      da: "I fortæller, hvad opgaven kræver. Vi foreslår en konfiguration – og siger det, hvis en opgradering er nok.",
      en: "You tell us what the job needs. We propose a configuration — and say so if an upgrade is enough.",
    },
    href: "/ydelser/sourcing-og-indkoeb",
    alt: {
      da: "En medarbejder taler med en kunde over et skrivebord",
      en: "A member of staff talking with a customer across a desk",
    },
  },
  {
    id: "3-klargoering",
    name: { da: "Klargøring", en: "Preparation" },
    line: {
      da: "Hver enhed testes: skærm, tastatur, batteri og porte. Slidte dele skiftes, og lagermediet slettes.",
      en: "Every unit is tested: screen, keyboard, battery and ports. Worn parts are replaced and the storage medium erased.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: {
      da: "En tekniker arbejder på en åbnet bærbar computer med skruetrækker",
      en: "A technician working on an opened laptop with a screwdriver",
    },
  },
  {
    id: "4-pakning",
    name: { da: "Pakning", en: "Packing" },
    line: {
      da: "Maskinerne pakkes enkeltvis og sendes samlet, så I kun har én modtagelse at holde styr på.",
      en: "The machines are packed individually and sent together, so you have one delivery to keep track of.",
    },
    href: "/ydelser/levering",
    alt: {
      da: "En kasse bliver pakket og tapet til forsendelse",
      en: "A box being packed and taped for shipping",
    },
  },
  {
    id: "5-levering",
    name: { da: "Levering", en: "Delivery" },
    line: {
      da: "Leveret til virksomheden i Danmark og Norge. Tidsrammen oplyser vi, før I bestiller.",
      en: "Delivered to the company in Denmark and Norway. We give you the timeframe before you order.",
    },
    href: "/ydelser/levering",
    alt: {
      da: "En pakke bliver afleveret til en kunde ved en varebil",
      en: "A parcel being handed to a customer at a van",
    },
  },
  {
    id: "6-paa-plads",
    name: { da: "På plads", en: "In place" },
    line: {
      da: "Arbejdspladserne står klar. Nordisk tastatur monteret og Windows sat op.",
      en: "The desks are ready. Nordic keyboard fitted and Windows set up.",
    },
    href: "/ydelser/nordisk-tilpasning",
    alt: {
      da: "Et team omkring et mødebord med bærbare computere",
      en: "A team around a meeting table with laptops",
    },
  },
];
