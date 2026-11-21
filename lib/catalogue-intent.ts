import type { CatalogueEntry } from "./catalogue-types";
import type { Model } from "./models";

/** Discovery facets describe the reference model; they imply no stock or performance guarantee. */
export function catalogueIntent(model: Model): Pick<CatalogueEntry, "useCases" | "screenSize"> {
  const computer = model.group === "baerbare" || model.group === "workstations";
  const useCases: NonNullable<CatalogueEntry["useCases"]> = [];
  if (model.group === "baerbare" || model.group === "stationaere") useCases.push("office");
  if (model.group === "workstations") useCases.push("workstation");
  // These are explicitly described as light/ultralight in the existing format
  // or are the researched travel/commuting use, rather than a guessed weight.
  if (
    computer &&
    (/\b(?:light|ultralight|let|ultralet)\b/i.test(model.format.en + " " + model.format.da) ||
      model.goodFor.some((use) => /\b(?:travel|commut|pendl|rejse)/i.test(use.en + " " + use.da)))
  )
    useCases.push("mobile");
  const size = model.format.en.match(/(\d{2}(?:[.,]\d+)?)\s*(?:["″]|-inch)/)?.[1];
  return {
    useCases,
    screenSize: computer && size ? size.replace(",", ".") : undefined,
  };
}
