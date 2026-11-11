import type { Localized } from "./i18n";
import type { Model } from "./models";
import { pricingMedia } from "./pricing-media";

/*
 * The one picture each model shows on a card and at the top of its page.
 *
 * A photograph where there is a licensed or owner-supplied one, otherwise a
 * studio illustration from scripts/build/product-art.mjs (or the two the
 * pricing collection already drew). Every frame says which it is, and each
 * alt describes what is drawn — the format and the documented features — not
 * the model's exact appearance, which a drawing does not claim.
 */
export type ModelMedia = {
  src: string;
  width: number;
  height: number;
  kind: "photo" | "illustration";
  alt: Localized;
};

/* Intrinsic sizes of the photographs, so the frame never shifts. */
const PHOTO_SIZE: Record<string, { width: number; height: number }> = {
  "/thinkpad-t480-4.jpg": { width: 1179, height: 1142 },
  "/models/t14/gen2-intel-reference.webp": { width: 1600, height: 1200 },
};

const laptop14: Localized = {
  da: "Illustration: åben 14-tommer bærbar",
  en: "Illustration: an open 14-inch laptop",
};
const monitor24: Localized = {
  da: "Illustration: 24-tommer skærm på højdejusterbar fod",
  en: "Illustration: a 24-inch monitor on a height-adjustable stand",
};
const usbcDock: Localized = {
  da: "Illustration: USB-C-dock med værtskabel",
  en: "Illustration: a USB-C dock with its host cable",
};

const ILLUSTRATION_ALT: Record<string, Localized> = {
  "lenovo-thinkpad-x1-carbon": {
    da: "Illustration: åben, tynd 14-tommer bærbar med TrackPoint",
    en: "Illustration: an open, thin 14-inch laptop with a TrackPoint",
  },
  "lenovo-thinkpad-l14": {
    da: "Illustration: åben 14-tommer bærbar med TrackPoint",
    en: "Illustration: an open 14-inch laptop with a TrackPoint",
  },
  "hp-elitebook-840": laptop14,
  "dell-latitude-5410": laptop14,
  "dell-latitude-7490": laptop14,
  "hp-probook-450": {
    da: "Illustration: åben 15,6-tommer bærbar med numerisk tastatur",
    en: "Illustration: an open 15.6-inch laptop with a numeric keypad",
  },
  "hp-zbook-15": {
    da: "Illustration: åben 15,6-tommer mobil workstation",
    en: "Illustration: an open 15.6-inch mobile workstation",
  },
  "hp-elitedesk-800": {
    da: "Illustration: stationær pc i et stående SFF-kabinet",
    en: "Illustration: a desktop PC in an upright SFF case",
  },
  "lenovo-thinkcentre-m720q": {
    da: "Illustration: mini-pc i et 1-liters kabinet",
    en: "Illustration: a mini PC in a one-litre case",
  },
  "hp-elitedisplay-e243": monitor24,
  "lenovo-thinkvision-t24i": monitor24,
  "lenovo-thinkpad-ultra-dock": {
    da: "Illustration: mekanisk dockingstation med dockstik på oversiden",
    en: "Illustration: a mechanical docking station with its connector on top",
  },
  "dell-wd19": usbcDock,
  "hp-usb-c-dock-g5": usbcDock,
};

export function modelMedia(model: Model): ModelMedia | null {
  const photo = model.images?.[0];
  if (photo && PHOTO_SIZE[photo.src]) {
    return { src: photo.src, ...PHOTO_SIZE[photo.src], kind: "photo", alt: photo.alt };
  }
  const priced = pricingMedia[model.slug];
  if (priced && priced.kind === "illustration") {
    return {
      src: priced.src,
      width: priced.width,
      height: priced.height,
      kind: "illustration",
      alt: priced.alt,
    };
  }
  const alt = ILLUSTRATION_ALT[model.slug];
  if (!alt) return null;
  return { src: `/products/${model.slug}.svg`, width: 1200, height: 900, kind: "illustration", alt };
}
