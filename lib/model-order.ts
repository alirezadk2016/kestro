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

/** Keep the product groups together; prefer cleared pictures within each group. */
export function catalogueOrder(list: readonly Model[]): Model[] {
  return list
    .map((model, index) => ({
      model,
      index,
      group: GROUP_ORDER.get(model.group) ?? modelGroups.length,
      picture: pictureRank(model),
    }))
    .sort((a, b) => a.group - b.group || a.picture - b.picture || a.index - b.index)
    .map((entry) => entry.model);
}
