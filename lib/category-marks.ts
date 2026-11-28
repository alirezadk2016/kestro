import type { CraftMarkName } from "@/components/CraftMark";

/*
 * The mark for each category slug. Keep in sync with lib/categories.ts.
 *
 * These were lucide glyphs — Laptop, Computer, HardDrive, Cable — drawn at a
 * 1.5 stroke in a plain bordered square, on the catalogue, the category pages
 * and every model page. That was the last place the old icon language
 * survived after the rest of the site moved to CraftMark, and it was exactly
 * where a buyer comparing machines looks. Now the same marks, in the same
 * MarkTile, as everywhere else.
 */
export const categoryMarks: Record<string, CraftMarkName> = {
  "baerbare-computere": "laptop",
  "stationaere-computere": "desktop",
  skaerme: "screen",
  "mini-pc": "mini-pc",
  tablets: "tablet",
  smartphones: "phone",
  smartwatches: "watch",
  dockingstationer: "dock",
};

export function getCategoryMark(slug: string): CraftMarkName {
  return categoryMarks[slug] ?? "laptop";
}
