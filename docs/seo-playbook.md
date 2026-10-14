# SEO playbook — Kestro against Mak

The method lives in the **Mak** skill (`.claude/skills/mak/`, the owner calls
it مک). It holds the rules, the recipes, the sheet formats and the scripts.
The owner is teaching it lesson by lesson from an SEO course; see
`.claude/skills/mak/references/lessons.md` for which lessons are in.

This file is the other half: where kestro.dk stands against those rules. It
records what passes, what is pending, and what waits on the owner. Update it
in every change that applies Mak or adds a lesson.

## Pre-launch Audit Fixes — 14 October 2026

- The owner has explicitly requested indicative pricing during the preparation phase. `/priser` now shows four dated external retail examples, with configurations, VAT context, fees and sources. These are budget references, not Kestro offers or stock claims. No `Product.offers` markup is created.
- A shared Danish/English notice identifies the project as not yet a registered business and makes enquiries non-binding. The terms URL now renders preparation-phase information instead of the retained commercial draft. No CVR, legal identity, address or trading registration has been invented.
- Model references no longer mix Latitude 5410 with 5420 or OptiPlex 5060 with 5070. Dell's documented RAM maximum, CPU generations and optional HDMI are reflected in model tables, chips and generated answers.
- The Windows 10 article distinguishes general 22H2 support from ESU and LTSC servicing. Existing URLs, canonicals, hreflang and sitemap membership stay unchanged.
- Changed pricing, terms and Dell descriptions were measured in both languages: 145–148 characters and 883–911 px, within the 920 px limit. Titles and keyword ownership were preserved.
- Technical fixes cover consent withdrawal, non-JavaScript form safety, menu resize cleanup, a keyboard-accessible T480 gallery and explicit desktop 3D activation. The homepage hero and its four bitmap assets are unchanged; mobile repair artwork still downloads nothing.
- `npm audit --omit=dev` reports zero findings after compatible patches. Nine development-tool dependency findings remain; no forced Tailwind major upgrade or unverified override is used to hide them.
- Not resolved by wording: the real data controller's identity/contact details, processor agreements and legal review before trading; authentic photos for 17 model pages; actual customer evidence; stock, margins, repair handover and service policies. Catalogue comparison/filtering, broader visual simplification and new articles remain separate design/content work, not claims of defects already fixed.

| Lesson | In Mak | Checked here |
| --- | --- | --- |
| 2-1 | Rules 6–7, the order of work | 14 October 2026 |
| 2-2 | Rules 1–5; URL, snippet preview and harvest sources added 14 October | 13 and 14 October 2026 |
| 2-3 | Waiting | — |
| 2-4 | Waiting | — |

---

## Status

**Structure today:**

| Tree     | Where                            |
| -------- | -------------------------------- |
| Products | `/produkter/*` and `/modeller/*` |
| Services | `/ydelser/*`                     |
| Repairs  | `/reparation/*`                  |
| Blog     | `/vejledninger/*`                |

### Rules 1–5, checked 13 October 2026

- **Rule 4, child keywords: no breaches.** No category or hub page carries a
  keyword that has its own child page. The ThinkPad, EliteBook and Latitude
  keywords on `/modeller` are generic. Every model keyword sits on its own
  model page.
- **Rule 3, informational keywords on commercial pages: to check.** These
  keywords are secondary on a service or category page, and their intent is
  probably "how do I", not "do it for me":

  | Keyword                         | Page it sits on                             |
  | ------------------------------- | ------------------------------------------- |
  | `bærbar larmer`                 | `/reparation/rens-og-koeling`               |
  | `bærbar bliver varm`            | `/reparation/rens-og-koeling`               |
  | `computer går ned`              | `/reparation/fejlfinding`                   |
  | `overføre filer til ny pc`      | `/reparation/ny-opsaetning-og-dataflytning` |
  | `tjek batteri bærbar`           | `/reparation/batteriskift`                  |
  | `skifte ssd i bærbar`           | `/reparation/ram-og-ssd-opgradering`        |
  | `dobbeltskærm opsætning kontor` | `/produkter/skaerme`                        |
  | `usb-c dock til flere skærme`   | `/produkter/dockingstationer`               |

  For each one, read Danish page one:
  - Mostly guides and forums → it moves to a `/vejledninger` article (new or
    existing).
  - Mostly workshops and shops → it stays where it is.

  `google.com` is blocked from this environment, so the check needs the
  owner's screenshots or Search Console data. The `WebSearch` tool returns US
  results and does not count.

- **Rule 3, a repair business has more than one tree: candidate.** A
  `/vejledninger` cluster for error codes and warning lights, such as
  "Lenovo fejlkode" or "Dell blinkende lys". Build it only after a
  results-page check, and only with answers Kestro can stand behind.
- **Rule 2, categories cut by search facets: candidates.**
  - Brand: brugt Lenovo / Dell / HP.
  - Use: bærbar til kontor, workstation til CAD.
  - Feature: bærbar med dansk tastatur.

  Each one gets a page only when page one shows category pages for it and
  Kestro has a real answer to give. No page is made just because a keyword
  exists.

- **Rule 5, one sheet with every page: done.**
  [`docs/seo-pillar-cluster.csv`](seo-pillar-cluster.csv) is Kestro's version
  of the course sheet (`.claude/skills/mak/references/sheets.md`).
  - Columns: tree, levels 1–3, URL, "exists" (ja/nej), primary keyword, SEO
    title, characters and pixels, meta description, characters and pixels,
    H1.
  - Proposed pages are rows marked `nej`: the guides not yet written. The
    brand level and the error-code tree are candidates above, and they get
    rows when they enter the keyword map.
  - Rebuild it with `.claude/skills/mak/scripts/pillar.py`.
  - The OptiPlex 5060 sits under both stationære and mini-pc'er, because a
    product may sit in more than one category.
- **Rule 5, lengths: titles fit, descriptions are short.**
  - Titles: 136 pages, every one within 580 px and unique. 91 are 50–60
    characters, 31 are 61–64 characters (still within 580 px), and 14 short
    ones (legal pages, contact) are under 50.
  - Descriptions: every one within 920 px and unique. The median is 139
    characters, though, and only 6 reach 150. The next pass lengthens them to
    145–158 characters, with the related keywords and a call to action.
- **Rule 5, H1: to check.** The H1 column is filled in. Many H1s are the bare
  category name ("Batteriskift"), not the primary keyword ("batteriskift
  bærbar"). Change this once the course's H1 lesson is in.
- **Audit numbers (`audit.mjs`, 13 October 2026, 136 pages):**
  - **Titles:** all within 580 px and unique; 91 are 50–60 characters.
  - **Descriptions:** all within 920 px and unique; only 23 are 145–160
    characters.
  - **H1:** exactly one on every page.
  - **Primary keyword:** in the title on 68 of 77 pages that have one, in the
    H1 on 5.
- **Rule 4, `check-map.py`:** 0 failures, no parent holding a child's
  keyword, and 19 informational keywords on non-blog pages waiting for
  Danish page-one evidence.

### Rules 6–7, checked 14 October 2026

- **Rule 6, seeds and pool: half done.**
  - The seeds are written: about fifty Danish phrases across six pillars, in
    `.claude/skills/mak/references/sheets.md`.
  - The pool does not exist, because there are no Danish volumes.
  - **Waits on the owner:** one Google Keyword Planner export per seed, or a
    Search Console export.
  - The site's structure was built before the pool, the reverse of the
    course's order. When the pool arrives, re-check every category and
    proposed page against it.
- **Rule 7, pillars:** five of the jobs people come for have a tree.

  | Job | Tree |
  | --- | --- |
  | Buy | `/produkter`, `/modeller` |
  | Have it done | `/ydelser`, `/flaadeloesninger` |
  | Repair | `/reparation` |
  | Sell | `/saelg-til-os` |
  | Learn | `/vejledninger` |

  Candidates from the course's repair example: error codes, and manuals or
  drivers. Not candidates: training and a parts shop, which Kestro does not
  sell.
- **Rule 7, the six steps:**

  | Step | Status |
  | --- | --- |
  | 1. User needs | Done: B2B buyers, sellers, and repair customers including private ones. |
  | 2. Keyword research | Partial: the map exists, without volumes. |
  | 3. Hierarchy | Done: the pillar sheet. |
  | 4. Alignment with products | Done: no category without the things it names. Tablets and phones have no model pages, which is honest. |
  | 5. Competitors | Started (see below). |
  | 6. Review | Running: `mak audit` and this file. |

  On step 5, Danish refurbished sellers seen in search results put brand
  pages high in their structure: "Refurbished Lenovo ThinkPad", "Lenovo
  ThinkPad bærbar PC", refurbished Lenovo and HP collections. That supports
  the brand-level candidate under rule 2. A full competitor keyword analysis
  needs a keyword tool or the owner's input.

### Rule 5 additions, checked 14 October 2026

The rest of lesson 2-2's slides open the on-page session: what a searcher
sees (title, URL, description), the tag checks an SEO extension makes, and
the URL as a column in the homework sheet. `audit.mjs` now makes the
extension's checks. Results on 136 pages:

| Check | Result |
| --- | --- |
| Canonical is the page's own path | 136 / 136 |
| `<meta charset>` in the first 1024 bytes | 136 / 136 |
| No heading level skipped | 136 / 136 (median seven H2s a page) |
| Title over 65 characters (the extension's warning) | 0 |
| Description over 170 characters (the extension's warning) | 0 |
| URL is lowercase ASCII words joined by hyphens | 136 / 136; longest 50 characters, deepest 3 levels |
| Slug carries the whole primary keyword | 4 of 77; partly 58; none 15 |

- **The slug numbers are information, not faults.** Most "partly" rows are
  model and category pages whose slug drops "brugt" (`/modeller/lenovo-thinkpad-t480`
  for "brugt thinkpad t480"), which is right. The 15 with none are hubs
  (`/`, `/produkter`, `/modeller`, `/kontakt`) and pages whose primary is a
  phrase people type rather than the page's name (`/reparation/fejlfinding`
  for "computer starter ikke"). Danish URLs do not move, so nothing changes;
  the URL lesson in session 3 applies to new routes.
- **The pillar sheet already has a URL column,** so the homework's third tab
  (title, description, URL, H1) is complete per row.
- **Title packing is in use:** category titles carry the type and the
  brands, model titles the model and what the page settles. The benefit
  after the colon is always one the page states.
- **Waits on the owner:**
  - The second audio cut of 2-2 (`2-2_2`): a transcript, or allowing
    `huggingface.co`, `cdn-lfs.huggingface.co` and `*.hf.co` so it can be
    transcribed here.
  - Autocomplete harvests from google.dk, YouTube, DBA and PriceRunner,
    which need a Danish browser.

### Rule 2 corrected, checked 14 October 2026

The owner's clean transcript of the second audio cut of 2-2 corrected one
point. The watch shop's "gifts" category is a parent name over birthday
and Valentine's, an example of grouping well, not of cutting too thin.
Rule 2 now also says how categories are built: group the pool's keywords
and give each group a parent name ("by brand", "by style", "gifts"). A
search that names no first choice gets a general category beside them.

- **General category: in place.** `/produkter` takes the searches that name
  no type ("brugt it-udstyr", "brugte computere").
- **Parents: one way of cutting today.** Every type in the pillar sheet has
  a single parent, "Efter model". The course would cut more ways:
  - "Efter mærke": Lenovo, Dell, HP;
  - "Efter brug": kontor, CAD;
  - "Efter funktion": dansk tastatur.

  Each stays a candidate until three things hold: page one shows category
  pages for it, Kestro sources enough of those machines to fill it, and the
  page has a real answer. The keyword pool decides which parents exist, so
  this waits on the Keyword Planner exports (rule 6).
- **Not possible: a price band.** Kestro has no prices of its own. The
  examples on `/priser` are external retail references.
- **One product in several categories: already true** where the facts allow
  it. The OptiPlex 5060 sits under both stationære and mini-pc'er.

