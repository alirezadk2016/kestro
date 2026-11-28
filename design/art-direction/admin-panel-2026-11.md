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

## Round 2: the phone, the same day

The owner: more professional, more complete, and on a phone very simple with
everything in easy reach. Measured at 390 and 320:

| Finding | Evidence | Change |
| --- | --- | --- |
| The menu was out of reach | A 140px block under the logo: three destinations and Menu, at the top of the screen, with "Log ud" beside the logo on every page. | A bar at the bottom edge, where the thumb is: Oversigt, Beskeder (with the unread count), Opfølgning, Kontakter, Menu. Menu opens a sheet from the bottom with every section, "Se sitet" and "Log ud". The top bar is the logo and a search button. |
| Searching meant finding the right page first | Search lived inside each list. | A search button in the phone's top bar and a search field at the top of the desktop sidebar, both over every message (status "Alle"). |
| Lists started a screen down | Opfølgning: title, a line of text, five scope buttons in three rows, a framed search box and a filter: the first customer at 760px. | Every list page has the same top: title, one row of tabs that scrolls sideways, one search line. Page descriptions are left to sm and up. |
| Contacts read as cards | About 175px a contact. | A list line with the contact's initials, name, company and address, and on the right what waits and when they last wrote. |
| The overview's figures were squeezed | Three columns at 390: "Aktive beskeder" broke over two lines. | On a phone the three are rows with the figure on the right. |
| A message's actions were not where the hand is | Three equal outline buttons; "Kontakt og håndtering" wrapped. | "Skriv svar" a full-width primary button, then "Samlet kontakt" and "Detaljer"; "Ring op" when the customer left a number. |

Every admin page fits 320px with no sideways scroll.
