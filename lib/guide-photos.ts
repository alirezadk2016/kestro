import type { Localized } from "@/lib/i18n";

/*
 * The photograph an article shows, where it has one (27 November 2026).
 *
 * Every picture here is a photograph of a real machine: the owner-supplied
 * ThinkPad T480 set and two Wikimedia Commons files already licensed for the
 * model pages (docs/media-licenses.md). The AI-generated plates and the
 * rendered scenes the articles used to carry are gone, on the owner's rule
 * that a laptop on this site is a real one. An article with no photograph
 * that shows its subject has no picture at all, rather than a generic laptop
 * standing in for RAM, a drive or a repair.
 */
export type GuidePhoto = {
  src: string;
  width: number;
  height: number;
  /** MIME type for Open Graph; the files are JPEG and WebP. */
  type: "image/jpeg" | "image/webp";
  alt: Localized;
  /** Said under the picture: what it shows. */
  caption: Localized;
  /** Absent for the owner's own photographs. */
  credit?: { author: string; source: string; licence: string; licenceUrl: string };
};

const t480 = (n: 3 | 4 | 6 | 7, height: number, alt: Localized): GuidePhoto => ({
  src: `/thinkpad-t480-${n}.jpg`,
  width: 1179,
  height,
  type: "image/jpeg",
  alt,
  caption: { da: "Modelfoto: Lenovo ThinkPad T480", en: "Model photo: Lenovo ThinkPad T480" },
});

const photos: Record<string, GuidePhoto> = {
  "windows-10-support-slutter": {
    ...t480(6, 1115, {
      da: "En Lenovo ThinkPad T480 set forfra med Windows 10's startmenu på skærmen.",
      en: "A Lenovo ThinkPad T480 from the front with the Windows 10 Start menu on screen.",
    }),
    caption: {
      da: "Modelfoto: Lenovo ThinkPad T480 med Windows 10",
      en: "Model photo: Lenovo ThinkPad T480 running Windows 10",
    },
  },
  "refurbished-eller-ny-baerbar": t480(4, 1142, {
    da: "En Lenovo ThinkPad T480 åbnet i vinkel med skærmen tændt.",
    en: "A Lenovo ThinkPad T480 open at an angle with the screen switched on.",
  }),
  "tjek-brugt-baerbar-foer-koeb": t480(7, 1142, {
    da: "Tastaturet på en Lenovo ThinkPad T480 set oppefra med TrackPoint og fingeraftrykslæser.",
    en: "The keyboard of a Lenovo ThinkPad T480 from above, with TrackPoint and fingerprint reader.",
  }),
  "refurbished-eller-brugt": t480(3, 1142, {
    da: "En Lenovo ThinkPad T480 set skråt oppefra med tastatur, TrackPoint og skærmen tændt.",
    en: "A Lenovo ThinkPad T480 seen at an angle from above, with keyboard, TrackPoint and the screen on.",
  }),
  "thinkpad-elitebook-latitude": {
    src: "/models/t14/gen2-intel-reference.webp",
    width: 1600,
    height: 1200,
    type: "image/webp",
    alt: {
      da: "En Lenovo ThinkPad T14 Gen 2 i brug på et skrivebord, set forfra med åben skærm og tastatur.",
      en: "A Lenovo ThinkPad T14 Gen 2 in use on a desk, from the front with the screen open and keyboard visible.",
    },
    caption: {
      da: "Lenovo ThinkPad T14 Gen 2",
      en: "Lenovo ThinkPad T14 Gen 2",
    },
    credit: {
      author: "Edvard10",
      source: "https://commons.wikimedia.org/wiki/File:ThinkPad_T14.jpg",
      licence: "CC0",
      licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  },
  "standardiser-firmacomputere": {
    src: "/models/lenovo-thinkpad-ultra-dock/docked-t470-reference.webp",
    width: 1600,
    height: 1057,
    type: "image/webp",
    alt: {
      da: "En lukket Lenovo ThinkPad T470 sat i en ThinkPad Ultra Dock, set ovenfra.",
      en: "A closed Lenovo ThinkPad T470 docked in a ThinkPad Ultra Dock, seen from above.",
    },
    caption: {
      da: "ThinkPad T470 i en ThinkPad Ultra Dock",
      en: "ThinkPad T470 in a ThinkPad Ultra Dock",
    },
    credit: {
      author: "Paowee",
      source:
        "https://commons.wikimedia.org/wiki/File:ThinkPad_T470_docked_in_the_Ultra_docking_station.JPG",
      licence: "CC BY-SA 4.0",
      licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
};

/** The article's photograph, or nothing. The same for both languages. */
export function guidePhoto(slug: string): GuidePhoto | undefined {
  return photos[slug];
}
