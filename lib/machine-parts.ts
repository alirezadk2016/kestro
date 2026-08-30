import type { Localized } from "./i18n";

/**
 * The machine, taken apart.
 *
 * Two halves, because they are two different things. The outside is the 3D
 * model: real geometry a visitor can turn. The inside is a drawing, because
 * the model has no inside — it is an outer shell, and pretending otherwise
 * would mean inventing a motherboard. A labelled cutaway is the honest way to
 * answer "which one is the RAM", and it is what a service manual would use.
 *
 * Everything a buyer would ask on the phone is here: what the part is, whether
 * it can be changed, and what we check before a machine goes out.
 */

/** How the camera stands to look at one part of the outside. */
export type Pose = {
  /** Radians around the machine. 0 faces the screen. */
  yaw: number;
  /** Radians above the horizon. */
  pitch: number;
  /** Multiples of the model's own size. Smaller is closer. */
  distance: number;
  /** 0 open, 1 shut. */
  lid: number;
  /**
   * What the camera aims at, as a fraction of the machine's height above or
   * below its centre. 0 frames the whole thing; negative drops the aim onto
   * the base, which is what a close-up of the deck needs.
   */
  lookY?: number;
};

export type ExteriorView = {
  id: string;
  name: Localized;
  /** One line under the heading, said plainly. */
  summary: Localized;
  /** What we look at here before a machine is sent on. */
  checks: Localized[];
  pose: Pose;
};

export const exteriorViews: ExteriorView[] = [
  {
    id: "overview",
    name: { da: "Hele maskinen", en: "The whole machine" },
    summary: {
      da: "En 14-tommer erhvervsbærbar. Træk i den for at vende den – det er den samme model, du ser i toppen af forsiden.",
      en: "A 14-inch business laptop. Drag it to turn it round — it is the same model you see at the top of the front page.",
    },
    checks: [
      {
        da: "Vi vurderer altid stand udvendigt først: ridser, buler og om skallen er skæv.",
        en: "Condition outside is always judged first: scratches, dents, and whether the shell sits square.",
      },
      {
        da: "En maskine med skader på kabinettet har som regel også fået et slag indvendigt.",
        en: "A machine with a damaged case has usually taken a knock inside as well.",
      },
    ],
    pose: { yaw: 0.62, pitch: 0.35, distance: 2.5, lid: 0, lookY: 0 },
  },
  {
    id: "keyboard",
    name: { da: "Tastatur", en: "Keyboard" },
    summary: {
      da: "Den del kunden rører ved hver dag – og den der afgør, om en maskine kan sælges i Norden.",
      en: "The part the user touches every day — and the part that decides whether a machine can be sold in the Nordics.",
    },
    checks: [
      {
        da: "Maskiner fra Sydeuropa har spansk eller italiensk layout. Vi skifter til dansk eller norsk, før de leveres.",
        en: "Machines from southern Europe come with Spanish or Italian layouts. We change them to Danish or Norwegian before delivery.",
      },
      {
        da: "Hver enkelt tast trykkes igennem. Én tast, der hænger, er nok til at maskinen ikke går videre.",
        en: "Every single key is pressed. One sticking key is enough for a machine not to go on.",
      },
      {
        da: "Baggrundsbelysning er ikke standard på alle modeller – spørg, hvis I skal bruge det.",
        en: "Backlighting is not standard on every model — ask if you need it.",
      },
    ],
    pose: { yaw: 0.3, pitch: 0.95, distance: 1.95, lid: 0, lookY: -0.34 },
  },
  {
    id: "ports",
    name: { da: "Porte og stik", en: "Ports and sockets" },
    summary: {
      da: "USB, HDMI, USB-C og dockingstik. Det er her, en maskine enten passer ind i jeres opsætning eller ikke gør.",
      en: "USB, HDMI, USB-C and the dock connector. This is where a machine either fits your setup or does not.",
    },
    checks: [
      {
        da: "Alle porte testes med udstyr i – en USB-port, der er slidt løs, ses ikke udefra.",
        en: "Every port is tested with something plugged in — a USB port worn loose does not show from the outside.",
      },
      {
        da: "Skal maskinerne bruges med dock, siger vi det på forhånd, hvis modellen kræver en bestemt serie.",
        en: "If the machines are going onto docks, we say up front when the model needs a particular dock series.",
      },
      {
        da: "Ældre modeller har ofte flere fysiske porte end nye – det er tit en fordel på kontoret.",
        en: "Older models often have more physical ports than new ones, which is frequently an advantage in an office.",
      },
    ],
    pose: { yaw: -1.4, pitch: 0.14, distance: 1.95, lid: 0, lookY: -0.3 },
  },
  {
    id: "hinge",
    name: { da: "Hængsler", en: "Hinges" },
    summary: {
      da: "Den mest oversete slitagedel på en brugt bærbar, og den dyreste at opdage for sent.",
      en: "The most overlooked wear part on a used laptop, and the most expensive one to discover too late.",
    },
    checks: [
      {
        da: "Skærmen åbnes og lukkes helt. Den skal stå stille i enhver vinkel uden at synke.",
        en: "The screen is opened and closed fully. It has to hold still at any angle without sagging.",
      },
      {
        da: "Vi kigger efter revner i plastikken omkring hængslet – det er der, brud starter.",
        en: "We look for cracks in the plastic around the hinge, which is where breaks begin.",
      },
    ],
    pose: { yaw: 2.35, pitch: 0.26, distance: 2.0, lid: 0, lookY: -0.16 },
  },
  {
    id: "lid",
    name: { da: "Bagsiden", en: "The back" },
    summary: {
      da: "Låget og bunden. Her sidder typeskiltet med modelnummer og serienummer – det er dét, en handel skrives ud fra.",
      en: "The lid and the underside. The type label with the model and serial number lives here, and that is what a deal is written from.",
    },
    checks: [
      {
        da: "Modelnummeret afgør alt: hvilken RAM der passer, hvilken disk, hvilken oplader.",
        en: "The model number decides everything: which memory fits, which disk, which charger.",
      },
      {
        da: "Vi noterer serienummer på hver maskine, så I kan spore den enkelte enhed bagefter.",
        en: "We record the serial number of every machine, so you can trace an individual unit afterwards.",
      },
      {
        da: "Er bundpladen skiftet eller mangler skruer, har maskinen været åbnet før. Det siger vi.",
        en: "If the base plate has been swapped or screws are missing, the machine has been opened before. We say so.",
      },
    ],
    pose: { yaw: 3.5, pitch: 0.55, distance: 2.3, lid: 1, lookY: 0 },
  },
  {
    id: "closed",
    name: { da: "Lukket", en: "Closed" },
    summary: {
      da: "Sådan ankommer den. Tynd nok til en taske, robust nok til at pendle med.",
      en: "How it arrives. Thin enough for a bag, solid enough to commute with.",
    },
    checks: [
      {
        da: "Låget skal slutte tæt hele vejen rundt. En skæv kant betyder et bøjet chassis.",
        en: "The lid has to close flush all the way round. An uneven edge means a bent chassis.",
      },
      {
        da: "Maskinerne pakkes enkeltvis og leveres samlet, så I kun har én modtagelse.",
        en: "Machines are packed individually and delivered together, so you only take delivery once.",
      },
    ],
    pose: { yaw: 0.9, pitch: 0.62, distance: 2.1, lid: 1, lookY: 0 },
  },
];

/** Whether a part can be changed after the machine is built. */
export type Swappable = "yes" | "sometimes" | "no";

export const swappableLabel = {
  yes: { da: "Kan skiftes", en: "Can be changed" },
  sometimes: { da: "Afhænger af modellen", en: "Depends on the model" },
  no: { da: "Sidder fast", en: "Fixed in place" },
} satisfies Record<Swappable, Localized>;

export type InteriorPart = {
  id: string;
  name: Localized;
  /** What is printed on the drawing. Short, because there is no room for more. */
  short: Localized;
  /** The part as it would be written on an order. */
  spec: Localized;
  what: Localized;
  upgrade: Localized;
  swappable: Swappable;
  /** Where the part sits on the 1000 × 640 board drawing. */
  region: { x: number; y: number; width: number; height: number };
  /**
   * Where its label goes, as a text anchor on the same drawing.
   *
   * Placed by hand rather than derived from the region: every part already has
   * something drawn inside it, so a label positioned automatically lands on top
   * of a fan blade or a row of contacts. These sit in the gaps.
   */
  label: { x: number; y: number };
};

/*
 * Laid out the way a 14-inch business laptop actually is with the base plate
 * off: board across the top, cooling on the left, storage and radio on the
 * right, and the battery taking the whole bottom half.
 */
export const interiorParts: InteriorPart[] = [
  {
    id: "ram",
    short: { da: "RAM", en: "RAM" },
    name: { da: "Hukommelse (RAM)", en: "Memory (RAM)" },
    spec: {
      da: "DDR4 SO-DIMM · typisk 1–2 sokler · op til 32 GB",
      en: "DDR4 SO-DIMM · typically 1–2 sockets · up to 32 GB",
    },
    what: {
      da: "Den plads maskinen arbejder på lige nu. Har den for lidt, skriver Windows til disken i stedet, og alt bliver langsomt – også selvom processoren er fin.",
      en: "The space the machine works in right now. Too little of it and Windows writes to the disk instead, and everything slows down — even with a perfectly good processor.",
    },
    upgrade: {
      da: "Den opgradering, der oftest kan mærkes mest. Prisen oplyses per maskine, og vi opgraderer som standard, før vi leverer.",
      en: "The upgrade that most often makes the biggest difference. The price is quoted per machine, and we upgrade as standard before delivery.",
    },
    swappable: "yes",
    region: { x: 372, y: 168, width: 236, height: 96 },
    label: { x: 374, y: 286 },
  },
  {
    id: "storage",
    short: { da: "SSD", en: "SSD" },
    name: { da: "Disk (SSD)", en: "Disk (SSD)" },
    spec: {
      da: "M.2 NVMe eller SATA · 256 GB – 2 TB",
      en: "M.2 NVMe or SATA · 256 GB – 2 TB",
    },
    what: {
      da: "Der hvor Windows, programmerne og filerne ligger. En gammel harddisk med skiver er den enkeltdel, der gør en ellers udmærket maskine ubrugelig.",
      en: "Where Windows, the programs and the files live. An old spinning hard disk is the single part that makes an otherwise decent machine unusable.",
    },
    upgrade: {
      da: "Skiftes på få minutter. Maskinerne sendes som udgangspunkt videre med SSD – og er der data på den gamle disk, slettes den, før den forlader os. Vi oplyser, hvilken metode der er brugt.",
      en: "Changed in minutes. The machines we pass on come with an SSD as standard — and if there is data on the old disk, it is erased before it leaves us. We tell you which method was used.",
    },
    swappable: "yes",
    region: { x: 660, y: 150, width: 268, height: 78 },
    label: { x: 662, y: 250 },
  },
  {
    id: "wifi",
    short: { da: "Wi-Fi", en: "Wi-Fi" },
    name: { da: "Trådløst kort", en: "Wireless card" },
    spec: {
      da: "M.2 2230 · Wi-Fi 5 eller Wi-Fi 6 · Bluetooth",
      en: "M.2 2230 · Wi-Fi 5 or Wi-Fi 6 · Bluetooth",
    },
    what: {
      da: "Wi-Fi og Bluetooth på ét lille kort med to antennekabler op i skærmrammen.",
      en: "Wi-Fi and Bluetooth on one small card, with two aerial leads running up into the screen surround.",
    },
    upgrade: {
      da: "Kan skiftes til et nyere kort, hvis I kører Wi-Fi 6 på kontoret. På nogle modeller er kortet låst af producenten – vi siger til, hvis det er tilfældet.",
      en: "Can be swapped for a newer card if your office runs Wi-Fi 6. On some models the card is locked by the manufacturer — we will say so when it is.",
    },
    swappable: "sometimes",
    region: { x: 700, y: 52, width: 150, height: 74 },
    label: { x: 702, y: 42 },
  },
  {
    id: "cooling",
    short: { da: "Køling", en: "Cooling" },
    name: { da: "Køling", en: "Cooling" },
    spec: {
      da: "Blæser og varmerør over processoren",
      en: "Fan and heat pipe over the processor",
    },
    what: {
      da: "Flytter varmen væk fra processoren. Er den stoppet til med støv, skruer maskinen selv ned for farten for ikke at brænde sammen.",
      en: "Moves heat away from the processor. Choked with dust, the machine throttles itself down rather than cook.",
    },
    upgrade: {
      da: "Blæser og ribber renses, og kølepastaen skiftes på hver maskine, vi klargør. Det er den mest oversete årsag til, at en brugt maskine føles træg.",
      en: "Fan and fins are cleaned and the thermal paste replaced on every machine we prepare. It is the most overlooked reason a used machine feels sluggish.",
    },
    swappable: "yes",
    region: { x: 60, y: 60, width: 250, height: 210 },
    label: { x: 62, y: 50 },
  },
  {
    id: "cpu",
    short: { da: "CPU", en: "CPU" },
    name: { da: "Processor", en: "Processor" },
    spec: {
      da: "Intel Core i5 eller i7 · loddet fast",
      en: "Intel Core i5 or i7 · soldered down",
    },
    what: {
      da: "Maskinens regnekraft. Til kontorarbejde er en i5 fra en nyere generation næsten altid nok – generationen betyder mere end tallet.",
      en: "The machine's computing power. For office work an i5 from a recent generation is nearly always enough — the generation matters more than the number.",
    },
    upgrade: {
      da: "Kan ikke skiftes. Den sidder loddet på printet, og det er derfor, valget af model betyder noget fra starten.",
      en: "Cannot be changed. It is soldered to the board, which is why choosing the right model matters from the start.",
    },
    swappable: "no",
    region: { x: 330, y: 60, width: 190, height: 86 },
    label: { x: 332, y: 50 },
  },
  {
    id: "battery",
    short: { da: "Batteri", en: "Battery" },
    name: { da: "Batteri", en: "Battery" },
    spec: {
      da: "Li-ion · kapacitet og opladningstal oplyses per maskine",
      en: "Li-ion · capacity and cycle count reported per machine",
    },
    what: {
      da: "Den del, der slides mest med tiden. Et batteri mister kapacitet, uanset om maskinen bruges eller står i et skab.",
      en: "The part that wears most over time. A battery loses capacity whether the machine is used or sits in a cupboard.",
    },
    upgrade: {
      da: "Vi oplyser den faktiske kapacitet i procent af ny, ikke bare “batteri OK”. Skal maskinerne bruges ude af huset, kan der sættes nye i, før de leveres.",
      en: "We report the actual capacity as a percentage of new, not just “battery OK”. If the machines are going out of the office, new ones can be fitted before delivery.",
    },
    swappable: "yes",
    region: { x: 96, y: 320, width: 700, height: 250 },
    label: { x: 98, y: 310 },
  },
  {
    id: "cmos",
    short: { da: "CMOS", en: "CMOS" },
    name: { da: "Bundkortbatteri", en: "Board battery" },
    spec: { da: "CR2032 knapcelle", en: "CR2032 coin cell" },
    what: {
      da: "Holder ur og opsætning, når maskinen er helt slukket. Et fladt et giver forkert dato og klager ved opstart.",
      en: "Keeps the clock and settings while the machine is fully off. A flat one gives the wrong date and complaints at start-up.",
    },
    upgrade: {
      da: "Koster nogle få kroner og skiftes på et minut. Vi skifter den, hvis maskinen har stået stille længe.",
      en: "Costs a few kroner and takes a minute to change. We replace it when a machine has been standing unused for a long time.",
    },
    swappable: "yes",
    region: { x: 838, y: 300, width: 96, height: 96 },
    label: { x: 824, y: 418 },
  },
  {
    id: "board",
    short: { da: "Bundkort", en: "Mainboard" },
    name: { da: "Bundkort", en: "Mainboard" },
    spec: {
      da: "Alt det, der ikke kan skilles ad",
      en: "Everything that does not come apart",
    },
    what: {
      da: "Printet, som resten sidder på. Processor, grafik og de fleste stik er loddet fast her.",
      en: "The board everything else sits on. Processor, graphics and most of the sockets are soldered to it.",
    },
    upgrade: {
      da: "Et defekt bundkort er som regel enden på maskinen økonomisk set. Det er dét, vi tjekker grundigst, før vi køber ind.",
      en: "A failed mainboard is normally the end of a machine in economic terms. It is the thing we check hardest before buying.",
    },
    swappable: "no",
    region: { x: 40, y: 30, width: 920, height: 260 },
    label: { x: 44, y: 22 },
  },
];

export function getInteriorPart(id: string): InteriorPart | undefined {
  return interiorParts.find((part) => part.id === id);
}
