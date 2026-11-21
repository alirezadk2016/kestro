/** Small, localized listing data. Detailed model research stays on the server. */
export type CatalogueEntry = {
  id: string;
  name: string;
  brand: string;
  /** The manufacturer's product line (lib/model-series.ts), for the "Serie" facet. */
  series?: { id: string; label: string };
  category: { id: string; label: string };
  format: string;
  description: string;
  /** Existing, researched practical use, shown before technical detail. */
  application?: string;
  /** Browsing aids derived from the researched model, never an offered configuration. */
  useCases?: ("office" | "mobile" | "workstation")[];
  screenSize?: string;
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
    sourceFrame?: boolean;
    credit?: {
      author: string;
      source: string;
      licence: string;
      licenceUrl: string;
      title?: string;
    };
  };
  /** Kept verbatim for the four dated budget configurations. */
  configuration?: string;
  budget?: { amount: number; formatted: string };
  sourceHref?: string;
  /** Existing /modeller#group URLs continue to reach a real model. */
  fragmentId?: string;
};
