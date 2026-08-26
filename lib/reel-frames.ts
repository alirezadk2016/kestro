import type { Lang } from "@/lib/i18n";

type Localized = Record<Lang, string>;

/*
 * The nine steps the hero reel shows, in order.
 *
 * This is a sequence, not a gallery: a machine arrives, gets opened, the parts
 * we actually touch come out, and it goes back together set up for a Danish
 * desk. Every line here is something the site already states on a service page
 * — /ydelser/klargoering-og-test says the battery's capacity is measured in
 * percent, /ydelser/nordisk-tilpasning says the keyboard is physically
 * swapped. Nothing new is claimed in a caption. A picture on the front page is
 * worth having only where the work behind it is written down somewhere a
 * visitor can go and read, which is what `href` is for.
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
    id: "01-arrival",
    name: { da: "Ankomst", en: "Arrival" },
    line: {
      da: "Maskinen kommer fra en leverandør i Sydeuropa. Første gennemgang er udvendig: kabinet, hængsler og skærmramme.",
      en: "The machine comes from a supplier in Southern Europe. The first pass is on the outside: chassis, hinges and screen bezel.",
    },
    href: "/ydelser/sourcing-og-indkoeb",
    alt: {
      da: "Lukket bærbar computer set fra oven i studielys",
      en: "A closed laptop seen from above under studio light",
    },
  },
  {
    id: "02-chassis",
    name: { da: "Åbnet", en: "Opened" },
    line: {
      da: "Bundpladen af. Alt bliver set efter indeni – ikke kun det, der kan aflæses udefra.",
      en: "Base plate off. Everything inside gets looked at — not only what can be read off from the outside.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: {
      da: "Bundkabinettet af en bærbar computer, afmonteret",
      en: "The bottom chassis of a laptop, removed",
    },
  },
  {
    id: "03-cooling",
    name: { da: "Køling", en: "Cooling" },
    line: {
      da: "Blæser og ribber renses, og kølepastaen skiftes. Det er ofte det, der får en ellers god maskine til at føles træg.",
      en: "Fan and fins are cleaned and the thermal paste replaced. That is often what makes an otherwise good machine feel sluggish.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: {
      da: "Køleenhed med to blæsere og kobberrør",
      en: "A cooling assembly with two fans and copper heat pipes",
    },
  },
  {
    id: "04-board",
    name: { da: "Bundkort", en: "Mainboard" },
    line: {
      da: "Ydeevnen måles, mens maskinen arbejder – ikke kun når den tændes.",
      en: "Performance is measured while the machine is working — not only when it boots.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: {
      da: "Bundkortet fra en bærbar computer med processoren i midten",
      en: "A laptop mainboard with the processor at its centre",
    },
  },
  {
    id: "05-memory",
    name: { da: "Hukommelse", en: "Memory" },
    line: {
      da: "RAM opgraderes efter, hvad opgaven kræver – ikke efter hvad der tilfældigvis sad i maskinen.",
      en: "Memory is upgraded to what the job needs — not to whatever happened to be in the machine.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: { da: "To SODIMM-hukommelsesmoduler", en: "Two SODIMM memory modules" },
  },
  {
    id: "06-storage",
    name: { da: "Lagring", en: "Storage" },
    line: {
      da: "Alt udstyr, vi sender videre, har SSD. Det gamle lagermedie slettes først.",
      en: "Everything we pass on has an SSD. The old storage medium is erased first.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: { da: "En M.2 SSD tæt på", en: "An M.2 SSD close up" },
  },
  {
    id: "07-battery",
    name: { da: "Batteri", en: "Battery" },
    line: {
      da: "Den faktiske kapacitet måles og oplyses i procent af ny – ikke som “OK”.",
      en: "The actual capacity is measured and stated as a percentage of new — not as “OK”.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: {
      da: "Et lithium-ion-batteri til en bærbar computer",
      en: "A lithium-ion laptop battery",
    },
  },
  {
    id: "08-open",
    name: { da: "Test", en: "Testing" },
    line: {
      da: "Hver tast trykkes igennem, og portene testes med udstyr i. En slidt USB-port ses ikke udefra.",
      en: "Every key gets pressed through and the ports are tested with something plugged in. A worn USB port does not show from the outside.",
    },
    href: "/ydelser/klargoering-og-test",
    alt: {
      da: "En bærbar computer halvt åben, set fra siden",
      en: "A laptop half open, seen from the side",
    },
  },
  {
    id: "09-ready",
    name: { da: "Klar", en: "Ready" },
    line: {
      da: "Nordisk tastatur monteret og Windows sat op. Klar til et dansk skrivebord.",
      en: "Nordic keyboard fitted and Windows set up. Ready for a Danish desk.",
    },
    href: "/ydelser/nordisk-tilpasning",
    alt: {
      da: "En bærbar computer åben med Kestros logo på skærmen",
      en: "A laptop open with the Kestro logo on screen",
    },
  },
];
