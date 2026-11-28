import type { Lang } from "@/lib/i18n";

/*
 * A photo credit's licence line in the reader's language (28 November 2026).
 *
 * The licence name is the licence's own ("CC BY 3.0"), but the note after it
 * says what was done to the work, and on a Danish page it read "(video
 * frame)", "(resized)" or "(trimmed)" in English.
 */
const DA_NOTES: Record<string, string> = {
  "(video frame)": "(stillbillede fra video)",
  "(resized)": "(formindsket)",
  "(trimmed)": "(beskåret)",
};

export function licenceLabel(licence: string, lang: Lang): string {
  if (lang !== "da") return licence;
  return licence.replace(/\((video frame|resized|trimmed)\)/, (note) => DA_NOTES[note] ?? note);
}

/**
 * The language of a source's own title, for its lang attribute: a screen
 * reader on a Danish page otherwise reads an English or Vietnamese title with
 * Danish pronunciation (WCAG 3.1.2). Most titles are English.
 */
export const titleLang = (credit: { titleLang?: string }) => credit.titleLang ?? "en";
