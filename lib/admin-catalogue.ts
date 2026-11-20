import { guideArtwork } from "@/components/GuidePanel";
import { guides, getCluster } from "@/lib/guides";
import { practicalGuides, practicalGuideDates } from "@/lib/practical-guides";
import { localePath, type Lang, type Localized } from "@/lib/i18n";
import media from "@/lib/admin-media.json";

export type ContentEntry = {
  slug: string;
  kind: "article" | "practical";
  category: string;
  title: Localized;
  summary: Localized;
  metaTitle: Localized;
  metaDescription: Localized;
  published: string;
  updated: string;
  keyword: string | null;
  sourceFile: string;
  headings: Localized[];
  images: Partial<Record<Lang, { src: string; alt: string }>>;
  tool: string | null;
};

/** A view of the actual published source, never a second editable content store. */
export const contentEntries: ContentEntry[] = [
  ...practicalGuides.map((guide): ContentEntry => ({
    slug: guide.slug,
    kind: "practical",
    category: "Praktiske guides",
    title: guide.title,
    summary: guide.summary,
    metaTitle: guide.metaTitle,
    metaDescription: guide.metaDescription,
    // These are the dates published by PracticalGuidePage, not the admin deploy date.
    published: practicalGuideDates.published,
    updated: practicalGuideDates.modified,
    keyword: null,
    sourceFile: "lib/practical-guides.ts",
    headings: guide.steps.map((step) => step.title),
    images: {
      da: { src: guide.image, alt: guide.imageAlt.da },
      en: { src: guide.image, alt: guide.imageAlt.en },
    },
    tool:
      guide.tool === "battery"
        ? "Batteriberegner"
        : guide.tool === "ram"
          ? "RAM-beregner"
          : guide.slug === "langsom-computer"
            ? "Browsermåling"
            : null,
  })),
  ...guides.map((guide): ContentEntry => ({
    slug: guide.slug,
    kind: "article",
    category: getCluster(guide.cluster).name.da,
    title: guide.title,
    summary: guide.summary,
    metaTitle: guide.metaTitle,
    metaDescription: guide.metaDescription,
    published: guide.published ?? guide.updated,
    updated: guide.updated,
    keyword: guide.primaryKeyword || null,
    sourceFile: "lib/guides.ts",
    headings: guide.sections.map((section) => section.heading),
    images: Object.fromEntries(
      (["da", "en"] as const).flatMap((lang) => {
        const image = guideArtwork(guide.slug, lang);
        return image ? [[lang, { src: image.src, alt: image.alt[lang] }]] : [];
      }),
    ),
    tool: null,
  })),
].sort((a, b) => b.updated.localeCompare(a.updated) || a.title.da.localeCompare(b.title.da, "da"));

export const publicContentPath = (entry: ContentEntry, lang: Lang) =>
  localePath(`/vejledninger/${entry.slug}`, lang);
export const sourceUrl = (entry: ContentEntry) =>
  `https://github.com/alirezadk2016/kestro/blob/claude/nextjs-14-scaffold-qycd1n/${entry.sourceFile}`;
export const contentKind = (kind: ContentEntry["kind"]) =>
  kind === "article" ? "Artikel" : "Praktisk guide";
export const scalarQuery = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : "";

export const mediaGroups = [
  { id: "all", label: "Alle billeder" },
  { id: "practical", label: "Praktiske guides" },
  { id: "knowledge", label: "Viden" },
  { id: "products", label: "Produkter og hardware" },
  { id: "brand", label: "Forside og team" },
  { id: "other", label: "Øvrige" },
] as const;
export type MediaGroup = (typeof mediaGroups)[number]["id"];
export function mediaGroup(src: string): Exclude<MediaGroup, "all"> {
  if (src.startsWith("/images/practical/")) return "practical";
  if (src.startsWith("/viden/")) return "knowledge";
  if (
    /^\/(cards|models|graphics)\//.test(src) ||
    src.startsWith("/images/repairs/") ||
    src.startsWith("/thinkpad-")
  )
    return "products";
  if (/^\/(hero|team)\//.test(src)) return "brand";
  return "other";
}
export const mediaEntries = media.map((asset) => ({
  ...asset,
  group: mediaGroup(asset.src),
  filename: asset.src.slice(asset.src.lastIndexOf("/") + 1),
  content: contentEntries.filter((entry) =>
    Object.values(entry.images).some((image) => image?.src === asset.src),
  ),
}));
export const fileSize = (bytes: number) =>
  new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format(
    bytes >= 1_000_000 ? bytes / 1_000_000 : bytes / 1000,
  ) + (bytes >= 1_000_000 ? " MB" : " kB");

export function catalogueUrl(path: string, query: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (value !== undefined && value !== "") params.set(key, String(value));
  return `${path}${params.size ? `?${params}` : ""}`;
}
