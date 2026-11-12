import type { Model } from "./models";
import { modelMedia } from "./model-media";

/*
 * The order a shelf of model cards is shown in: photographed models first,
 * then illustrated ones, then those with no picture yet; within each, the
 * catalogue's own order. A row that opens on two photographs and then runs
 * into empty wells reads as a catalogue being filled in; the same cards with
 * the empty wells gathered at the end read as a catalogue with a few gaps.
 *
 * Display only: structured data (ItemList) keeps lib/models.ts's order, so a
 * photograph arriving never reorders what search engines were told.
 */
const RANK = { photo: 0, illustration: 1 } as const;

export function picturesFirst(list: readonly Model[]): Model[] {
  const rank = (model: Model) => {
    const media = modelMedia(model);
    return media ? RANK[media.kind] : 2;
  };
  return list
    .map((model, index) => ({ model, index, rank: rank(model) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.model);
}
