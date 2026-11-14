"use client";

import type { CatalogueEntry } from "@/lib/catalogue-types";
import type { Lang } from "@/lib/i18n";
import CatalogueListingItem from "./CatalogueListingItem";

/*
 * A model page's related models, in the catalogue's own row.
 *
 * The page ended on three of the old dark cards (with the dark "K" frame for
 * a model without a photo) while the catalogue a buyer arrived from now shows
 * the same models as light rows with the brand in the empty frame. One model
 * looked two ways a click apart. These are the catalogue rows, without the
 * compare boxes: comparing belongs to the catalogue, where the tray is.
 */
const noop = () => {};

export default function RelatedModelRows({
  entries,
  lang,
}: {
  entries: CatalogueEntry[];
  lang: Lang;
}) {
  return (
    <ul className="mt-6 grid gap-3" data-related-models>
      {entries.map((entry) => (
        <CatalogueListingItem
          key={entry.id}
          entry={entry}
          lang={lang}
          mode="models"
          view="list"
          ready
          selected={false}
          selectionFull={false}
          canCompare={false}
          priority={false}
          onCompare={noop}
        />
      ))}
    </ul>
  );
}
