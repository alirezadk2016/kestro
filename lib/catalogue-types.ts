/** Small, localized listing data. Detailed model research stays on the server. */
export type CatalogueEntry = {
  id: string;
  name: string;
  brand: string;
  category: { id: string; label: string };
  format: string;
  description: string;
  facts: { label: string; value: string }[];
  comparisonFacts?: { label: string; value: string }[];
  detailHref: string;
  enquiryHref: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    kind: "photo" | "illustration";
  };
  /** Kept verbatim for the four dated budget configurations. */
  configuration?: string;
  budget?: { amount: number; formatted: string };
  sourceHref?: string;
  /** Existing /modeller#group URLs continue to reach a real model. */
  fragmentId?: string;
};
