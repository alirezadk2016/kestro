# SEO playbook — Kestro against Mak

The method lives in the **Mak** skill (`.claude/skills/mak/`, the owner calls
it مک). It holds the rules, the recipes, the sheet formats and the scripts.
The owner is teaching it lesson by lesson from an SEO course; see
`.claude/skills/mak/references/lessons.md` for which lessons are in.

This file is the other half: where kestro.dk stands against those rules. It
records what passes, what is pending, and what waits on the owner. Update it
in every change that applies Mak or adds a lesson.

## Needs-Led Targeting — 16 October 2026

- The owner prioritised selection, budget, company use, startup equipment,
  old-laptop upgrades and Danish/Norwegian keyboards over model names.
  `docs/seo-needs-research.md` records public competitor observations and
  their limits. No competitor traffic, volume or ranking figures are claimed.
- Laptop titles, lead and use-case order now start with buying requirements.
  Model URLs and specifications remain available as supporting references.
- The existing buying checklist now explains task selection and total budget.
  Its original publication date is retained separately from its update date.
- Physical keyboard preparation and hardware upgrades have distinct copy;
  software updates are not presented as RAM or SSD upgrades.
- The keyword map contains 201 rows. Ten needs-led variants are secondary
  targets; startup equipment and laptop choice use existing pages. No new
  price-band, city or thin keyword pages have been created.
- Existing external budget references remain unchanged. No lowest-price,
  availability, warranty, performance or registration claim has been added.

## Search Visibility Fixes — 16 October 2026

- Search Console is connected for the Kestro domain property. The current
  connector supplies performance and sitemap data, not the six Page Indexing
  exclusion reasons or URL Inspection. Do not claim these unknown exclusions
  are fixed. Raw account data stays outside the public repository.
- Existing product pages now answer category-specific buying questions and
  link configuration, quality, software and total-cost decisions to relevant
  pages. No new thin guides, city pages, URLs or speculative stock offers.
- T14 Gen 2 Intel and X1 Carbon Gen 7 buying answers cite Lenovo PSREF.
  Soldered memory, RAM slots and the Iris Xe dual-channel requirement are
  explicitly generation-specific. Windows compatibility and licensing must be
  checked for the actual configuration, not promised from a model name.
- The models hub no longer claims customer demand. The About quote describes
  the project's purpose rather than invented enquiry history.
- A CC0 T14 Gen 2 Intel reference photograph is credited and compressed to
  WebP. T480 photographs remain unchanged. Sixteen model pages still need
  suitable authentic photographs; do not substitute the wrong generation.
- The RAM guide now links directly to the T14 and X1 Carbon checks. The
  keyword map distinguishes existing guides from unapproved proposals.
- Canonicals, hreflang, sitemap membership, redirects, homepage artwork and
  the Danish/English route structure are unchanged.
- Model-hub descriptions were measured at 146/147 characters and 905/917 px
  in Danish/English. The content-date generator normalises Windows paths so
  shared components and per-file presentation exclusions work on both hosts.
  Related-link edits do not refresh every guide's visible date.
- Next review: compare equivalent completed Search Console windows for
  non-brand queries and relevant landing pages. Do not confuse anonymised
  queries with zero clicks, impressions with market volume, or indexing with
  first-page ranking. No ranking, traffic or rich-result guarantee is made.

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
| 2-3 | Rules 8–10, heading roles in 5 | 14 October 2026 |
| 2-4 | Rules 11–14 | 14 October 2026 |
| — | Beyond the course (`references/beyond-course.md`) | 14 October 2026 |

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

### Rules 8–14, checked 14 October 2026

`mak run` (`.claude/skills/mak/scripts/run.mjs`) now runs every check below
in one go.

- **Rule 8, URLs: passes.** 136 of 136 are lowercase ASCII with hyphens; no
  slug over five words; no year in a path; nothing nested under a parent
  (each type has its own prefix, and model pages are not under their
  category); longest path 50 characters. A URL with `?utm_…` keeps the
  clean canonical. Danish URLs stay as they are.
- **Rule 5, headings: passes.** One H1 on every page, no level skipped,
  median seven H2s a page.
- **Rule 9, internal links:** `docs/seo-internal-links.csv`.
  - Menu: 9 links; footer: 18 (Danish). The footer links hubs, not the
    seven product categories; the course would put the most important
    categories there.
  - In running text no page has more than five links: inside the course's
    seven or eight.
  - **The gap:** eight repair pages (rens og køling, Windows-installation,
    software og licenser, dataflytning, fejlfinding, samling af pc,
    klargøring af brugt udstyr; reservedele has five) are linked from one
    page, `/reparation`, through one card. Four more are linked from twelve
    pages, but every link is the same card with the same words. Rule 9 asks
    for links from related pages with varied anchors.
  - Blog → commercial: 42 links; commercial → blog: 11.
- **Rule 10, deep content: in place on category pages.** Each ends with the
  other categories, its guides, the FAQ and the sources.
- **Rule 11, content structure:** one template per page type. Model
  coverage exists on category pages (brand lines). No cost table: Kestro has
  no prices, so the honest structure says what sets the price.
- **Rule 12, knowledge graphs:** `docs/seo-knowledge-graph.json`, 19 pages
  (7 categories, 12 repairs). Coverage 35–91 %. The common gaps on category
  pages are the terms, delivery and data-erasure nodes that the site states
  elsewhere but not on the category page. On `/reparation/fejlfinding` the
  primary keyword's own words ("starter ikke") are not in the page body.
- **Rule 13, evergreen:** guides answer standing questions; no year in any
  URL.
- **Rule 14, Search Console:** waits on the owner. Create a Domain property
  for kestro.dk, add the TXT record where the DNS is managed, submit
  `https://www.kestro.dk/sitemap.xml`, and add the same site to Bing
  Webmaster Tools (it can import from Search Console).

### `mak run`, applied 14 October 2026

The whole method run on the site, as far as the facts allow. Measured by
`mak run` before and after, 136 pages:

| Check | Before | After |
| --- | --- | --- |
| Titles 50–60 characters (all ≤ 580 px) | 91 | 131 (the five left: four legal pages, and the English tablets title at 61) |
| Descriptions 145–160 characters (all ≤ 920 px) | 23 | 61; the rest sit at 850–920 px, a full snippet |
| Primary keyword in the H1 | 5 of 77 | 67 of 77 |
| Product categories linked from every page | 0 | 7 (footer) |
| Repair pages with one link in | 8 | 0 (three to six each) |
| Blog → commercial links | 42 | 52 |
| Knowledge-graph coverage, categories | 35–76 % | 67–88 % |
| Knowledge-graph coverage, repairs | 50–91 % | 75–100 % |
| FAIL | 0 | 0 |

What changed:
- **Rule 5.** 61 descriptions lengthened with the main entity, its synonym
  and a true call to action (pre-launch: a written quote, a price before
  work, a non-binding enquiry; never an order). 40 titles moved into
  50–60 characters. H1s carry the search phrase through an `h1` field on
  categories, repairs and services, "Brugt <model>" on model pages, and new
  headings on five hubs and five guides.
- **Rule 9.** Each repair links four related repairs
  (`relatedRepairs` in `lib/repairs.ts`); guides link the repair that does
  what they explain, with anchors in the searcher's words; the footer has a
  Products group.
- **Rule 12.** Each category answers "Hvordan bliver … klargjort og
  leveret?" with sentences the service pages already state.

Kept on purpose:
- The front page, fleet, quality, models and contact H1s, and the guide
  "Refurbished eller brugt" (its question reads better than the keyword).
- Danish URLs.
- The legal pages' short titles.

Waits on the owner:
- **Search Console:** a Domain property for kestro.dk, its TXT record added
  at one.com (the domain's DNS), and the sitemap submitted. Bing Webmaster
  Tools can import it.
- **Danish page-one evidence** for the 19 informational keywords on
  commercial pages (rule 3) and for the brand, use and feature parents
  (rule 2).
- **Keyword Planner exports** for the seeds (rule 6).
- **Knowledge-graph questions** (rule 12) that need Kestro's own answer:
  warranty terms while pre-launch, swollen batteries, original or
  compatible parts, which brands and models the repairs cover (rule 11's
  model coverage), Microsoft 365 licences.


### Audit, 15 October 2026

A bug crawl and `mak run` on the build of `5535e39` (with the mobile hero,
fleet scene, grade comparison and repair viewer that landed the same day).

Bug crawl: all 136 sitemap pages, at 1440 px and on a 390 px phone, read in
a real browser.

| Check | Result |
| --- | --- |
| Page errors, console errors | 0 (WebGL notices from the software renderer only) |
| Broken internal links, of 202 distinct targets | 0 |
| In-page anchors pointing at a missing id | 0 |
| hreflang alternates answering anything but 200 | 0 |
| Broken images, images without `alt` | 0 |
| Horizontal overflow, elements wider than the screen | 0 |
| Duplicate ids, controls without a name | 0 |
| Production runtime errors (Vercel, last 7 days) | 0 |
| `npm audit --omit=dev` (what ships) | 0 |

Fixed:
- **Two page entities on one URL.** The five category pages with models
  described themselves twice in JSON-LD: PageSchema's CollectionPage
  (`#webpage`) pointing its `mainEntity` at a second CollectionPage
  (`#collection`) that held the model list. The second node is now the
  `ItemList` it always described.
- **Favicon too small for search.** The only icon was 32 px; Google shows a
  site icon beside results only at a multiple of 48 px, so every result
  showed the generic globe. `app/icon.tsx` now renders 32, 48 and 192 px,
  and `/favicon.ico`, which answered 404, serves the 48.
- **The grade dialog on /kvalitet** gave the page back (scrolling, and
  focus on the button that opened it) only when its `close` event landed,
  a task after the dialog had shut; verify caught it once in two runs. It
  now restores on `cancel` and in the close buttons, before it shuts.
- **Rule 9.** `/maskinen` and `/ydelser` had one page linking in. Both now
  have three (quality, the RAM guide; the fleet and sell-to-us pages). Four
  repair pages whose every link in carried the same card text now also get
  a guide link in the searcher's words ("Larmer den eller bliver varm?",
  "En revnet skærm", "Slidt eller forkert tastatur", "Licenser til
  firmacomputere").

Kept on purpose:
- **Product without `offers`** on the 36 model pages. Search Console will
  list them as invalid product snippets; that is the price of not
  publishing a price Kestro does not have (see the note in
  `app/[lang]/modeller/[slug]/page.tsx`).
- **Descriptions 133–144 characters** on about 70 pages: all inside the
  binding 920 px, a few characters under the 145–160 guide.

Waits on the owner, as before, plus:
- **Build-time advisories.** `npm audit` reports 9 (7 high, 2 moderate), all
  in Tailwind 3's file watcher and `eslint-config-next`, which run on the
  build machine and are not shipped. `braces` has no patched release; the
  only fix is Tailwind 4, a migration of the whole stylesheet set-up.

### Education Expansion, 16 October 2026

The existing knowledge section now has eleven Danish articles and eleven
English mirrors. Three new articles cover memory-price context, refurbished
versus new laptops, and model-specific upgrade limits. Four existing guides
(RAM, Windows 11, repair decisions and Windows 10 servicing) were refreshed.
The homepage hero, graphics pipeline, commercial routing and dependencies
were not redesigned or replaced.

- `npm run verify`: content gates, production build and browser checks passed;
  all 65 security cases held.
- Independent sitemap crawl: 142 URLs, no response, canonical, hreflang,
  heading, metadata, image-alt or internal-link issues.
- Focused education QA: 20 route/viewport combinations at 320, 390, 768,
  1440 and 1920 pixels, no horizontal overflow or missing visible images.
  Desktop/mobile screenshots and upgrade tables were visually inspected.
- New articles are in site search and the Danish Atom feed. Feed publication
  dates match Article dates; refreshed articles retain their original dates.
- The six new-language snippets fit the 580/920-pixel title/description
  budget. All six descriptions are 145–160 characters.
- Article and WebPage publication/modification dates agree. Per-article
  dates override the age of the shared route template.

Keyword map: 213 rows; demand, CPC and difficulty remain unknown.
No paid market report, media generation or advertising was purchased.
See `docs/seo-education.md` for source boundaries and outcome measurement.
Search Console traffic and indexing improvement are not yet measured.

### Bilingual Education SEO, 16 October 2026

Scoped to the existing eleven articles in Danish and their eleven English
translations. Existing URLs, self-canonicals, reciprocal language alternates
and sitemap entries were already correct and remain in place.

- Localized the remaining older article snippets around the question each
  article answers. All 22 title/description pairs fit the 580/920-pixel budget.
- Article, Open Graph and Twitter metadata now identify the illustration
  actually shown on the article, with its localized alt text and dimensions.
  Article pages allow large image previews; this is permission, not a promise
  of a rich result or ranking improvement.
- Each language's knowledge hub has an ItemList matching its visible reading
  list, referenced by its CollectionPage.
- Corrected data-erasure advice against Microsoft and NIST: a consumer reset
  or deletion of one encryption-key copy does not prove verified sanitization.
  Original publication dates remain; the revised guide has a real update date.
- The keyword map has 218 rows and ten explicit English article primary
  targets. The PC-building guide remains deliberately untargeted. Unknown
  search volume, CPC and difficulty remain unknown.

Verification of this change:

- `npm run verify`: content, production build and browser checks passed;
  all 65 security cases held. Persistent checks now cover all 22 article
  language variants and both hub reading lists.
- Independent rendered-HTML audit: 22 article variants passed language,
  metadata, canonical, reciprocal hreflang, article dates, actual-cover and
  language-switch checks; all eight referenced cover assets returned 200.
- Independent full sitemap crawl: 142 URLs, no detected response, canonical,
  hreflang, heading, metadata, image-alt or internal-link issues.
- The revised English guide was visually inspected at 390 and 1440 pixels.

No homepage redesign, new routes, dependencies, paid media or advertising.
Google indexing and post-release search traffic are not yet verified; the
connector does not provide URL Inspection or request-indexing capabilities.

### Practical guides, 17 October 2026 — release checks pending

The owner approved four task guides in the existing knowledge tree:
checking reported battery capacity, checking RAM usage, identifying HDD or
SSD storage, and investigating a slow computer. Each has a Danish route
and an English mirror. The keyword map records their distinct informational
intents, with unknown volume, CPC and difficulty. Danish and English SERP
evidence remains pending; no ranking or traffic improvement is claimed.

Two manual calculators support the guides. The battery calculation divides
reported Full Charge Capacity by Design Capacity; it is separate from
current charge and does not diagnose safety or predict runtime. The RAM
calculation uses user-entered usable and used memory, checks their
consistency and reports a snapshot. It does not measure RAM frequency,
memory errors or a need to upgrade. Values are calculated locally and are
not uploaded. The performance guide teaches Task Manager observations;
browser measurements cannot isolate physical CPU or RAM speed. Storage
identification does not certify drive health.

Four new knowledge graphs record those task entities and limits. The slow
computer secondary query now points to the diagnostic guide; the existing
repair-versus-replace guide keeps its economic decision intent. Existing
commercial repair URLs and model-upgrade guides remain separate. The task
photographs are illustrations, not model-specific service instructions.

Release validation: `npm run verify` passed against a clean production build,
including structure, metadata, rendered contrast, navigation, motion,
calculator interactions, responsive layouts and the security checks. Eight
bilingual practical-tool scenarios and eight article/image metadata variants
also passed targeted checks. Production delivery uses the existing
`claude/nextjs-14-scaffold-qycd1n` branch and Vercel integration. The deployed
commit is checked separately through `/api/version`; Search Console indexing
and traffic require post-release observation.
