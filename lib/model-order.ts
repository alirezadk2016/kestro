import { modelGroups, type Model } from "./models";
import { modelMedia } from "./model-media";

/*
 * The order a shelf of model cards is shown in: photographed models first,
 * then illustrated ones, then those with no picture yet; within each, the
 * catalogue's own order. A row that opens on two photographs and then runs
 * into empty wells reads as a catalogue being filled in; the same cards with
 * the empty wells gathered at the end read as a catalogue with a few gaps.
 *
 * Related shelves keep this photo-first treatment. A complete catalogue uses
 * catalogueOrder below, so image availability never mixes product groups.
 */
const RANK = { photo: 0, illustration: 1 } as const;
const GROUP_ORDER = new Map(modelGroups.map((group, index) => [group.id, index]));

function pictureRank(model: Model) {
  const media = modelMedia(model);
  return media ? RANK[media.kind] : 2;
}

export function picturesFirst(list: readonly Model[]): Model[] {
  return list
    .map((model, index) => ({ model, index, rank: pictureRank(model) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.model);
}

/** Keep group/family positions fixed and show one representative per family.
 * Prefer an exact photographed reference within that family; its remaining
 * generations stay newest-first. No recommendation or recency is implied. */
export function catalogueOrder(list: readonly Model[]): Model[] {
  const families = new Map<string, number>();
  const family = (model: Model) => model.name.replace(/\sGen \d+$/, "");
  for (const model of list) {
    const key = family(model);
    if (!families.has(key)) families.set(key, families.size);
  }
  const ordered = list
    .map((model, index) => ({
      model,
      index,
      group: GROUP_ORDER.get(model.group) ?? modelGroups.length,
      family: families.get(family(model))!,
      generation: Number(model.name.match(/\sGen (\d+)$/)?.[1] || 0),
      photographed: modelMedia(model)?.kind === "photo",
    }))
    .sort(
      (a, b) =>
        a.group - b.group ||
        a.family - b.family ||
        b.generation - a.generation ||
        a.index - b.index,
    );
  const representatives = new Map<number, (typeof ordered)[number]>();
  for (const entry of ordered) {
    const current = representatives.get(entry.family);
    if (!current || (entry.photographed && !current.photographed))
      representatives.set(entry.family, entry);
  }
  return ordered
    .map((entry) => ({
      ...entry,
      tier: representatives.get(entry.family)?.index === entry.index ? 0 : 1,
    }))
    .sort(
      (a, b) =>
        a.group - b.group ||
        a.tier - b.tier ||
        a.family - b.family ||
        b.generation - a.generation ||
        a.index - b.index,
    )
    .map((entry) => entry.model);
}
