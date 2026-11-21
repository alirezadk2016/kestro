# Admin panel, November 2026

The owner, 21 November 2026: the admin is messy, complicated and confusing;
make it more professional and more complete.

Who uses it: the owner, alone, between other work, on a laptop or a phone.
What they must do: answer the people who wrote, and not let a follow-up slip.
Everything else (traffic, Google, campaign links, content, media, system) is
looked at now and then. The panel should feel like a well-kept order desk in
the site's navy room: calm, dense enough to work in, nothing on screen that
does not say something.

## What made it confusing, measured at 1440 and 390 with the local fixture

| Finding | Evidence | Change |
| --- | --- | --- |
| Two design systems in one tool | Trafik, Google & SEO and Kampagnelinks were white cards with blue text on the navy room; every other page was dark. | The growth styles keep their variable names and take the panel's values (`growth.module.css`). One surface language everywhere. |
| The same menu three times | The sidebar, a "01 Trafik, 02 Google, 03 Kampagnelinks" tab row on each growth page, and the overview's right column (a site photograph, three growth links, "Indhold", "Medier", then "Kontakter" and "System" again). | The tab row is gone. The overview's right column shows what a glance should answer instead (below). |
| A heading above every heading | "KESTRO · ARBEJDSRUM", "KESTRO · VÆKST", "RELATIONER · SAMLET KONTAKTBILLEDE" in tracked capitals over each title; the sidebar already says where you are. | Not shown. `EYEBROW` is sentence case for every small label. |
| An inbox that read as a stack of cards | Four lines and about 120px a message: 25 messages ran to 3,700px. | Two lines, about 62px: who, company and when; then subject, the message on one line, and its state. A dot marks unread as well as the "Ny" label. Used by the inbox, the follow-up list, the overview and a contact's history. |
| A filter box inside a box | Status pills, a framed search panel with a visible "Søg" label, a "Type og sortering ↓" disclosure, then a framed bulk bar. | Status is a tab bar; search is one field and one button; the label is for screen readers. |
| A message page made of forms | Contact, follow-up, handling and note were four cards with four frames. | One panel, four sections divided by hairlines. |
| Arrows on everything | "Alle beskeder →", "Mærk dine næste links →", "Næste →", "Skriv svar ↓", ↗ on the overview's figures. | Gone, as on the site. Downloads keep ↓ and external links ↗. |
| Words about the machinery | "Filimport virker uafhængigt af forbindelsen til chatten" on the SEO page, and a Windsor note about "en forbindelse i chatten". | Plain sentences about what the owner can do. |

## The overview

- **Arbejdsstatus**, one dark panel with three figures: new messages lead in
  the brand's light blue; follow-ups say how many are late, in amber.
- **Left:** the six latest active messages, then today's follow-ups with a
  date chip (amber when late).
- **Right:** visits in the last 7 days with the change from the week before,
  the week's shape as seven bars and the top three sources; Google's clicks
  and impressions from the stored Search Console report, or that none is
  loaded; and a three-line system check (database, mail, Google report).
  Each figure comes from the same function its own page uses.

## Unchanged, on purpose

- The three gates: `middleware.ts`, `requireAdmin()` first on every page,
  `adminOnly()` first in every `lib/db.ts` reader. The overview's new
  figures read through functions that already have the third.
- Every accessible name the admin checks use, so the tests check the same
  behaviour on the new layout. Three links lost their arrow, and the checks
  now name them without it.
- The login screen, the sidebar and its grouping.
