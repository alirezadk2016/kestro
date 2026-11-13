import type { CatalogueEntry } from "@/lib/catalogue-types";
import { localePath, type Lang, type Localized } from "@/lib/i18n";
import { modelMedia } from "@/lib/model-media";
import { catalogueOrder } from "@/lib/model-order";
import { cardSpecs, modelGroups, type Model } from "@/lib/models";
import CatalogueExplorer from "./CatalogueExplorer";

const COMPUTER_LABELS: Localized[] = [
  { da: "Processor", en: "Processor" },
  { da: "Hukommelse", en: "Memory" },
  { da: "Lagring", en: "Storage" },
];

const SCREEN_LABELS: Localized[] = [
  { da: "Panel", en: "Panel" },
  { da: "Opløsning", en: "Resolution" },
];

/** Short display values from the same three dock specs; comparison keeps the full wording. */
const DOCK_FACTS: Record<string, [Localized, Localized, Localized]> = {
  "lenovo-thinkpad-ultra-dock": [
    { da: "Mekanisk ThinkPad-stik", en: "Mechanical ThinkPad connector" },
    { da: "Op til 3", en: "Up to 3" },
    { da: "USB-A · Gigabit LAN · lyd", en: "USB-A · Gigabit Ethernet · audio" },
  ],
  "dell-wd19": [
    { da: "USB-C", en: "USB-C" },
    { da: "Op til 3 (variantafhængigt)", en: "Up to 3 (varies by variant)" },
    { da: "USB-A/C · Gigabit LAN · lyd", en: "USB-A/C · Gigabit Ethernet · audio" },
  ],
  "hp-usb-c-dock-g5": [
    { da: "USB-C", en: "USB-C" },
    { da: "2 · DisplayPort/HDMI", en: "2 · DisplayPort/HDMI" },
    { da: "USB-A/C · Gigabit LAN · lyd", en: "USB-A/C · Gigabit Ethernet · audio" },
  ],
};

/** Only the small, localized listing data crosses into the interactive catalogue. */
export function modelCatalogueEntries(models: readonly Model[], lang: Lang): CatalogueEntry[] {
  const seenGroups = new Set<string>();
  return catalogueOrder(models).map((model) => {
    const media = modelMedia(model);
    const labels = model.group === "skaerme" ? SCREEN_LABELS : COMPUTER_LABELS;
    const facts =
      model.group === "docking"
        ? model.specs.slice(0, 3).map((spec, index) => ({
            label: spec.label[lang],
            value: DOCK_FACTS[model.slug]?.[index][lang] ?? spec.value[lang],
          }))
        : cardSpecs(model, lang).map((value, index) => ({
            label: labels[index][lang],
            value,
          }));
    const fragmentId = seenGroups.has(model.group) ? undefined : model.group;
    seenGroups.add(model.group);

    return {
      id: model.slug,
      name: model.name,
      brand: model.brand,
      category: {
        id: model.group,
        label:
          model.group === "workstations"
            ? "Mobile workstations"
            : modelGroups.find((group) => group.id === model.group)!.name[lang],
      },
      format: model.format[lang],
      description: model.tagline[lang],
      application: model.goodFor[0]?.[lang],
      facts,
      comparisonFacts: [
        {
          label: lang === "da" ? "Anvendelse" : "Use",
          value: model.goodFor[0]?.[lang] || model.tagline[lang],
        },
        ...model.specs
          .filter((spec) => spec.label.en !== "Model")
          .slice(0, 6)
          .map((spec) => ({
            label: spec.label[lang],
            value: spec.value[lang],
          })),
      ],
      detailHref: localePath(`/modeller/${model.slug}`, lang),
      enquiryHref: localePath(`/tilbud?model=${encodeURIComponent(model.name)}`, lang),
      image: media
        ? {
            src: media.src,
            width: media.width,
            height: media.height,
            alt: media.alt[lang],
            kind: media.kind,
          }
        : undefined,
      fragmentId,
    };
  });
}

export default function ModelCatalogue({
  models,
  lang,
  heading,
}: {
  models: readonly Model[];
  lang: Lang;
  heading?: string;
}) {
  return (
    <CatalogueExplorer
      entries={modelCatalogueEntries(models, lang)}
      lang={lang}
      mode="models"
      heading={heading}
    />
  );
}
