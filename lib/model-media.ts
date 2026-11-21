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
  credit?: NonNullable<Model["images"]>[number]["credit"];
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

/*
 * Exact-model reference photographs, selected as complete, unretouched frames
 * from LaptopMedia's CC-licensed videos. The primary YouTube license declaration
 * and the matching Commons CC BY 3.0 records were checked on 2026-11-21;
 * docs/media-licenses.md records the source and selected time for each frame.
 * A generation-family page may show a labelled generation within its scope.
 * Never reuse these photos for a newer generation's individual model page.
 */
const REFERENCE_PHOTOS: Record<string, ModelMedia> = {
  "lenovo-thinkpad-t14": {
    src: "/models/t14/gen1-amd-front-reference.jpg",
    width: 1920,
    height: 1440,
    kind: "photo",
    alt: {
      da: "Referencefoto: ThinkPad T14 Gen 1 AMD, åben forfra med sort skærm og kyrilliske tastaturtegn",
      en: "Reference photo: ThinkPad T14 Gen 1 AMD, open front view with a black screen and Cyrillic keyboard legends",
    },
    credit: {
      author: "LaptopMedia",
      source: "https://www.youtube.com/watch?v=eHQjbtcbt1g",
      licence: "CC BY 3.0 (video frame)",
      licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
    },
  },
  "lenovo-thinkpad-x1-carbon": {
    src: "/models/x1-carbon/gen8-front-reference.jpg",
    width: 1920,
    height: 1440,
    kind: "photo",
    alt: {
      da: "Referencefoto: ThinkPad X1 Carbon Gen 8, åben forfra med sort skærm og kyrilliske tastaturtegn",
      en: "Reference photo: ThinkPad X1 Carbon Gen 8, open front view with a black screen and Cyrillic keyboard legends",
    },
    credit: {
      author: "LaptopMedia",
      source: "https://www.youtube.com/watch?v=Dkzl9vMPP9w",
      licence: "CC BY 3.0 (video frame)",
      licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
    },
  },
  "dell-latitude-5410": {
    src: "/models/latitude-5410/front-reference.jpg",
    width: 1920,
    height: 1440,
    kind: "photo",
    alt: {
      da: "Referencefoto: Dell Latitude 5410, åben skråt forfra på hvid baggrund med kyrilliske tastaturtegn",
      en: "Reference photo: Dell Latitude 5410, open three-quarter front view on white with Cyrillic keyboard legends",
    },
    credit: {
      author: "LaptopMedia",
      source: "https://www.youtube.com/watch?v=GfeEm279CrE",
      licence: "CC BY 3.0 (video frame)",
      licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
    },
  },
};

/* Underside views are supplemental references, never card or hero substitutes. */
const ADDITIONAL_PHOTOS: Record<string, NonNullable<Model["images"]>> = {
  "lenovo-thinkpad-t14-gen-5": [
    {
      src: "/models/t14-gen-5/intel-underside-reference.jpg",
      photographic: true,
      alt: {
        da: "Referencefoto: hele undersiden af en ThinkPad T14 Gen 5 Intel med bunddækslet monteret",
        en: "Reference photo: complete underside of a ThinkPad T14 Gen 5 Intel with its bottom cover attached",
      },
      credit: {
        author: "LaptopMedia",
        source: "https://www.youtube.com/watch?v=Y5eSTzvPOOU",
        licence: "CC BY 3.0 (video frame)",
        licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
      },
    },
  ],
  "lenovo-thinkpad-l16-gen-1": [
    {
      src: "/models/l16-gen-1/intel-underside-reference.jpg",
      photographic: true,
      alt: {
        da: "Referencefoto: hele undersiden af en ThinkPad L16 Gen 1 Intel med bunddækslet monteret",
        en: "Reference photo: complete underside of a ThinkPad L16 Gen 1 Intel with its bottom cover attached",
      },
      credit: {
        author: "LaptopMedia",
        source: "https://www.youtube.com/watch?v=Ls4b4ZSFty0",
        licence: "CC BY 3.0 (video frame)",
        licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
      },
    },
  ],
  "lenovo-thinkpad-e16-gen-2": [
    {
      src: "/models/e16-gen-2/intel-underside-reference.jpg",
      photographic: true,
      alt: {
        da: "Referencefoto: hele undersiden af en ThinkPad E16 Gen 2 Intel med bunddækslet monteret",
        en: "Reference photo: complete underside of a ThinkPad E16 Gen 2 Intel with its bottom cover attached",
      },
      credit: {
        author: "LaptopMedia",
        source: "https://www.youtube.com/watch?v=DY_-5NBw5PM",
        licence: "CC BY 3.0 (video frame)",
        licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
      },
    },
  ],
};

export function additionalModelPhotos(model: Model): NonNullable<Model["images"]> {
  return ADDITIONAL_PHOTOS[model.slug] ?? [];
}

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
  const reference = REFERENCE_PHOTOS[model.slug];
  if (reference) return reference;
  const photo = model.images?.[0];
  if (photo && PHOTO_SIZE[photo.src]) {
    return {
      src: photo.src,
      ...PHOTO_SIZE[photo.src],
      kind: "photo",
      alt: photo.alt,
      credit: photo.credit,
    };
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
