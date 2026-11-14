import type { Localized } from "./i18n";

/*
 * How Kestro reads a battery's remaining capacity, in one place.
 *
 * The battery-replacement page shows these four bands, and the calculator in
 * the practical guide answers with the same words, so a reader who measures on
 * one page and reads on the other is told the same thing. Our reading, not an
 * official standard — both places say so.
 */
export type BatteryBand = { range: string; min: number; reading: Localized };

export const batteryBands: BatteryBand[] = [
  {
    range: "90–100%",
    min: 90,
    reading: {
      da: "Som ny. Maskinen holder, hvad den blev solgt til at holde.",
      en: "As new. The machine lasts what it was sold to last.",
    },
  },
  {
    range: "80–90%",
    min: 80,
    reading: {
      da: "Almindeligt slid. De fleste maskiner klarer stadig en arbejdsdag.",
      en: "Normal wear. Most machines still manage a working day.",
    },
  },
  {
    range: "70–80%",
    min: 70,
    reading: {
      da: "Du kan mærke det. Planlæg et skift, men det haster sjældent.",
      en: "You notice it. Plan a replacement, though it is rarely urgent.",
    },
  },
  {
    range: "Under 70%",
    min: 0,
    reading: {
      da: "Skift det. Herfra er maskinen reelt bundet til en stikkontakt.",
      en: "Replace it. Below this the machine is effectively tied to a socket.",
    },
  },
];

export const batteryBandFor = (percentage: number) =>
  batteryBands.find((band) => percentage >= band.min) ?? batteryBands[batteryBands.length - 1];
