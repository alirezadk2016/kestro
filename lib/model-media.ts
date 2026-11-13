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
 *
 * Laptops are the exception: they show a real photograph of that model or
 * nothing. The owner asked on 11 November 2026 that no laptop be shown with
 * an artificial picture, so a laptop without a licensed or owner-supplied
 * photograph has no entry below and its card and page open without one.
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
  "/thinkpad-t480-6.jpg": { width: 1179, height: 1115 },
  "/thinkpad-t480-4.jpg": { width: 1179, height: 1142 },
  "/models/t14/gen2-intel-reference.webp": { width: 1600, height: 1200 },
  "/models/latitude-7490/front-open-reference.webp": { width: 1600, height: 1200 },
  "/models/dell-wd19/front-reference.webp": { width: 1600, height: 900 },
  "/models/lenovo-thinkpad-ultra-dock/top-view-reference.webp": { width: 1600, height: 777 },
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
  return {
    src: `/products/${model.slug}.svg`,
    width: 1200,
    height: 900,
    kind: "illustration",
    alt,
  };
}
