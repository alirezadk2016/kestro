/**
 * When the two legal documents were last changed.
 *
 * These are the only pages outside the guides that carry a real, meaningful
 * edit date: a visitor is told which version of the terms they are reading,
 * and a crawler is told when it changed. Both readings have to come from the
 * same value — a page that says "last updated 2 September" while the sitemap
 * claims a different day is worse than a sitemap with no date at all.
 *
 * So the date lives here and is imported by both the page and app/sitemap.ts,
 * rather than being written twice and kept in step by memory.
 *
 * Update the date in this file when, and only when, the wording of the
 * corresponding document actually changes. It is not a build stamp: Google
 * uses lastmod only while it is consistently accurate and ignores it
 * otherwise, so a date that moves on every deploy costs more than none.
 */
export const legalUpdated = {
  "/handelsbetingelser": "2026-09-02",
  "/privatlivspolitik": "2026-09-04",
} as const;
