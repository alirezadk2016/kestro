import decision from "./model-index.json";

/*
 * Which model pages Google is asked to index (2026-11-25).
 *
 * The 50 ThinkPad generation pages arrived in one day, beside the lines'
 * original pages, and a generation reads almost exactly like the one before
 * it: measured on 5-word sequences, a model page had a median of 16% text of
 * its own, and 54 of 68 shared more than half their text with their nearest
 * sibling. Pages that alike are what a search engine folds together or leaves
 * out, and many of them dilute how it judges the rest of the site.
 *
 * So one page per line is indexed: the line's original page where it has one,
 * otherwise the generation with a real photograph and the most text of its
 * own. The others stay online for the buyer who wants that generation —
 * linked from their line, listed in the laptop category and in site search —
 * with noindex,follow and no sitemap entry. The decision, its rule and the
 * list are in model-index.json, which scripts/verify/catalogue-explorer.mjs
 * reads as well. A generation goes back by leaving the list once it has
 * something its siblings do not.
 */
type Decision = { families: Record<string, { lead: string; heldOut: string[] }> };

export const heldOutOfIndex: ReadonlySet<string> = new Set(
  Object.values((decision as Decision).families).flatMap((family) => family.heldOut),
);

/** The line's lead page for a held-out generation, or undefined. */
export function familyLead(slug: string): string | undefined {
  return Object.values((decision as Decision).families).find((family) =>
    family.heldOut.includes(slug),
  )?.lead;
}

export function modelIndexed(slug: string): boolean {
  return !heldOutOfIndex.has(slug);
}
