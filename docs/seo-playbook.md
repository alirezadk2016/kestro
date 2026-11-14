# SEO playbook — Kestro against Mak

The method lives in the **Mak** skill (`.claude/skills/mak/`, the owner calls
it مک). It holds the rules, the recipes, the sheet formats and the scripts.
The owner is teaching it lesson by lesson from an SEO course; see
`.claude/skills/mak/references/lessons.md` for which lessons are in.

This file is the other half: where kestro.dk stands against those rules. It
records what passes, what is pending, and what waits on the owner. Update it
in every change that applies Mak or adds a lesson.

## The owner's laptop searches — 21 October 2026

The owner sent 21 searches about buying, selling and repairing laptops. Each
was put into Danish search language and given to the page its intent belongs
to (rule 1); no page was created. The table is in `docs/seo-keyword-map.md`.

- The laptop category's lead now says "brugte bærbare til virksomheden" and
  addresses the reader as "I"; the category links to `/flaadeloesninger` as
  "Køb bærbare i større antal", and that question is now a heading in the
  fleet FAQ, answered "Ja – bærbare, stationære og skærme".
- The laptop category's two upgrade links had the same anchor; the workshop
  one now says what it is.
- Not targeted: school and student laptops (private buyers), gaming laptops
  (folded into `/produkter`), "best price" (price comparison; Kestro has no
  selling prices). Schools as institutions are the owner's call.

## Search Console read — 21 October 2026

The first reading under rule 14, through the Windsor.ai connector
(`searchconsole`, property `sc-domain:kestro.dk`). It is read-only: it gives
performance and sitemap data, not Page Indexing, URL Inspection or Core Web
Vitals. Raw figures stay outside this public repository (rule 14: share it
with nobody); this records what they led to.

What holds:

- **Property:** Domain, as the method asks. **Sitemap:**
  `https://www.kestro.dk/sitemap.xml`, every URL in it submitted, no errors
  or warnings, re-read by Google on 19 October.
- **Old addresses:** Google still shows some of the English pages on their
  old Danish-slug addresses (`/en/produkter/...`, `/en/knowledge/<danish>`,
  `/en/modeller/...`). Every one of them answers with a single 301 to a live
  200 page; none 404s. Nothing to change; Google folds them as it recrawls.
- **Canonical host:** www, which is the host the sitemap was submitted on.

What it showed, and what was done (rules 1, 2, 5, 9):

- **Wrong page for the general term.** "Computer til erhverv", "pc til
  erhverv", "køb pc til erhverv" and "arbejdscomputer" land on `/modeller`.
  None names a model, so the general category owns them. `/produkter`'s
  description now says "computere til erhverv", and `/modeller` links to
  `/produkter` with that anchor.
- **The Danish laptop and monitor categories had no impressions at all**
  in the period, while Danish laptop searches reached `/produkter` and the
  old English laptop address. The laptop category has the most internal
  links in of any category (20 pages), and its canonical, hreflang, sitemap
  entry and status are correct, so this reads as an indexing question, not a
  content one. Only URL Inspection can answer it. The category's title now
  carries "til erhverv" and its description addresses the business with "I"
  instead of "du".
- **Lenovo in the title.** Searches use the brand ("brugt lenovo x1
  carbon"); the Dell and HP model titles already carried theirs. All seven
  Lenovo model titles now do, in both languages, each measured under 580 px.
- **Keyword map:** 17 rows from Search Console, each on the page its intent
  belongs to. Volume stays `unknown`: impressions are this site's, not the
  market's.
- **Not acted on:** zero clicks at positions 5–10 on pages with a handful of
  impressions. At this volume that is not a CTR signal, and rewriting a
  snippet on it would be guessing. A query that is plainly another trade
  (industrial shredders on the desktop category) is left alone.

Open, for the owner:

- **URL Inspection** on `/produkter/baerbare-computere` and
  `/produkter/skaerme`: is the page indexed, and which canonical did Google
  choose? Then request indexing for both.
- **Indexing → Pages:** the exclusion reasons and the URLs under each. The
  connector cannot read them.
- **Workstations.** Workstation searches land on `/modeller`. A category is
  only right if Kestro sources workstations (rule 2); the owner decides.
- **Bing Webmaster Tools:** import the property from Search Console.

Next reading: weekly while the site is this young; compare completed
windows, not a partial week against a full one.

## Language review — 11 November 2026

Every visible string on all 156 pages (text, titles, descriptions, alt,
aria-labels, placeholders, folded FAQs) read as one corpus per language:
hunspell, rules for Danish compounds, number and unit style, quotes,
pronoun case, r-errors, startkomma, address (du/I), and for English the
UK spelling, Danish calques and article use; then the front pages and the
most-seen guide read in full. The Danish was clean on grammar: no r-errors,
startkomma used throughout, numbers and units in Danish style. What was
wrong:

- **Spelling and compounds.** "Se trinene" (trinnene); `14" skærmen`
  (14"-skærmen); "USB-C dock", "SATA SSD", "M.2 SSD-modul", "PC
  DRAM-udbud" and half-hyphenated "DDR4 SO-DIMM-sokkel" in running text;
  "et NVMe SSD" where the site otherwise says "en SSD". Spec tables keep
  the trade's "512 GB NVMe SSD".
- **One form each.** "per" and "pr." were mixed 38 to 25; Danish now says
  "pr." throughout. "f.eks." and "bl.a." became "fx" and "blandt andet",
  as elsewhere on the site; "vs" became "vs.", including the comparison
  guide's title (still 495 px).
- **Address.** Shared templates spoke to "I" on pages written to "du":
  the FAQ prompt ("Står jeres spørgsmål ikke her?"), the repair call to
  action and the guides' closing heading, which on the RAM guide also
  repeated its own paragraph. They are now neutral.
- **Meaning.** The front page's definition read as if the companies were
  tested ("udstyr fra virksomheder, som er testet"); it is two sentences.
  "Nordisk klar" is the service's own name, "Nordisk tilpasning".
- **English calques.** "also called renovated", "go after the
  specifications", "every key is pressed through", "in preparation" for
  "under etablering", "need making", "within" for "inden for", "when it
  pays", "Is your question not here?"; plus one spaced en dash, "percent",
  "timeframe" and "ten" against "10" on the same page.
- **"Konkret".** The Danish used it 79 times, mostly as filler ("den
  konkrete maskine", "en konkret pris"). Now twelve: the terms of sale,
  which stay as written, and the places where it carries the point ("hvad
  der konkret blev gjort"). The rest became the definite form, "den
  enkelte", "præcis" or nothing. Two descriptions fell under 145
  characters with the shorter words; /ydelser/nordisk-tilpasning was
  lengthened, and /priser keeps "konkret" because every 145-character
  alternative ran past 920 px.
- **"Actual", "exact", "specific".** The English carried the same habit,
  as translations of "konkret": 60 "actual(ly)", 34 "exact", 29
  "specific". The places that mirrored the Danish fillers follow the
  Danish ("the configuration", "the individual machine", "an order").
  Where the word makes a contrast, it stays: the battery's actual capacity
  against its design capacity, what was actually done to a machine, the
  exact model number to look up.

## Site review and score — 11 November 2026

A crawl of all 156 sitemap pages, mobile Lighthouse on twelve templates,
`mak run`, `npm audit`, and a read of every category page's opening text.

- **Technical SEO holds.** 212 internal link targets, none broken and none
  redirecting; no duplicate titles or descriptions; every canonical points
  at itself and every hreflang pair links back; sitemap read with no
  errors. Lighthouse SEO and accessibility 100 on all twelve templates,
  performance 91–99.
- **Structured data.** Model pages put `seller` on a Product, where
  schema.org does not define it; removed. The Product still carries no
  offers, by decision, so Search Console will keep listing those items as
  invalid product snippets. That costs a rich result and nothing else.
- **Snippets.** The five Danish descriptions under 145 characters already
  measure 900–920 px; they are short because the words are wide, and
  stay.
- **Category openings.** Each category page has a generated line under
  the H1 and an intro under that. On /produkter/baerbare-computere the two
  said the same thing twice (office, home, startup, budget, keyboard); the
  intro now carries only the lead into the use cases. /produkter/skaerme
  claimed a monitor "som regel" outlives its computer and that this is
  where a company saves most, and /produkter/smartphones that company phones
  are "ofte" replaced before they wear out; neither has a source, and both
  are gone.
- **`npm audit`.** A new advisory for `minimatch` below 11.0.1
  (GHSA-g3hv-75wg-m249) reached the linter through
  `@typescript-eslint/typescript-estree`, whose newest release still asks
  for 10. Overridden to 11 for that package only; audit back at zero.

## Search Console — week to 7 November 2026

Rule 14, read through Windsor for `sc-domain:kestro.dk`, 1–7 November
against 25–31 October. No figure is recorded here; what the data led to is.

- **More of everything, from a small base.** Impressions, clicks and
  Denmark's impressions grew; Denmark's share held. Clicks are still too few
  to read CTR.
- **Desktops are found in Danish.** `/produkter/stationaere-computere`
  drew its first Danish searches, in the singular ("brugt stationær
  computer", "brugt stationær pc"), on pages three to five. It is the
  primary keyword's intent, so no new page (rule 1); the singular is in the
  map as a secondary. The intro said a refurbished desktop is "ofte den mest
  økonomiske løsning", which no source carries. The generated opening line
  names the page and its series and the brands section says the machines
  are sourced per order, so the intro now says only what nothing else on the
  page does: each machine's condition is written into the quote.
- **The RAM guide's wording.** The visible queries for
  `/vejledninger/hvorfor-er-ram-blevet-dyrere` say "så dyrt", not
  "dyrere". The variant is in the map; title and H1 keep the primary until
  the variant holds for more than one week.
- **Holding.** The T480 model page and the English HDD/SSD guide sit around
  position nine. The HDD/SSD title changed on 29 October, too recently to
  judge its click-through.
- **Old URLs.** Mixed-language addresses from before the English routes
  (`/en/produkter/…`, `/en/repairs/batteriskift`,
  `/en/knowledge/slet-data-foer-du-saelger`) still collect impressions.
  Each answers 301 to its English route; nothing to change.
- **Sitemap and indexing.** Sitemap read by Google on 5 November, 156 URLs,
  no errors. `/produkter/baerbare-computere` and `/produkter/skaerme` still
  show no Danish impressions; URL Inspection for both is with the owner.

## Site review — 5 November 2026

Screenshots of 27 templates at 390, 1440 and 1920 px, a text-overlap scan at
ten widths, hunspell over the visible text of all 156 pages, and a console
crawl. What it found and what changed:

- **Footer, 1280–1500 px.** "Modeller og specifikationer" ran into "Maskinen
  indeni": two equal 153 px columns for a 181 px label with nowrap. The
  products group's columns now size to their labels.
- **/om-os.** The quote rendered “…” in Danish (an `&ldquo;` in the markup,
  outside any string the gate read); it now follows the language, and the
  content gate fails on the entity. "Hvorfor virksomheder vælger Kestro"
  claimed customers a business that is not trading yet does not have; it is
  "Sådan arbejder Kestro".
- **Polish.** Model pages' sibling chips rounded like every other chip; the
  sources fold on /priser has the site's chevron.
- **Spelling.** No real errors in either language; every unknown word was a
  product name, a technical compound or a proper name.
- **Rule 9.** `/vejledninger/hdd-eller-ssd` and
  `/vejledninger/tjek-batterikapacitet` had three content links in each; the
  RAM-upgrade guide and /kvalitet now link them with new anchors.
- **Dates.** `lib/page-dates.json` had not been regenerated since 22
  October, so pages changed by the claims, H1 and FAQ commits of 24–28
  October still showed older dates. Regenerated from the full history. A
  shallow clone stamps every route as published 14 October, so the history
  was fetched with `--unshallow` first. Four pushed commits that changed no
  words on the page went into `page-dates-skip.txt` (meta descriptions, a
  comma, validation messages, commas and alt text).
- **Early signal.** The English comparison guide already appears near page
  one for "thinkpad vs elitebook vs latitude".
- **Second round, same day.** Model pages for monitors and docks showed the
  laptop lists (memory, keyboard, battery); each kind now has its own. The
  price box no longer explains budget figures that are not on the page, and
  on the sixteen model pages without photographs it fills the header's empty
  right column, as the intro now does on /produkter/tablets.
  /tilbud-eksempel shows the document and its explanation side by side.
  A contrast scan of all 156 pages at 390 and 1440 px found one label under
  4.5:1 ("Videre herfra" on /tilbud-eksempel, 2.23:1), now fixed. Mobile
  Lighthouse on six templates: performance 94–97, accessibility, best
  practices and SEO 100.
- **Third round, 8 November.** A scan of all 156 pages at 390, 375, 360 and
  320 px for link chips whose label breaks onto two lines inside the pill.
  Twenty-one anchors were shortened to fit 360, each still unlike the other
  anchors to the same page (rule 9); "ThinkPad vs EliteBook vs Latitude"
  is now one of the comparison guide's anchors, from the used-laptop
  checklist. Below 360 the chip gives up some padding and a pixel of type.
  Two headings claimed a history a business that is not trading yet does
  not have: the guides' FAQ was "Spørgsmål, vi får om det her" and model
  pages said "Derfor peger vi ofte på denne model"; both now drop the claim.

## Search Console — week to 31 October 2026

Rule 14, read through Windsor for `sc-domain:kestro.dk`, 25–31 October
against 18–24 October. No figure is recorded here; what the data led to is.

- **Denmark moved up.** Danish impressions grew and their average position
  improved; total impressions grew too. Clicks stay in
  single figures, so no conclusion is drawn from CTR.
- **The T480 model page is found.** `/modeller/lenovo-thinkpad-t480` drew
  its first Danish searches ("lenovo t480", "lenovo thinkpad t480",
  "thinkpad t480") at positions 10–15, with clicks. Its title keeps
  "Lenovo", which those searches use. Rule 9: the ThinkPad, EliteBook and
  Latitude guide, which discusses the T480 throughout, now links to it.
- **Rule 5, `/en/knowledge/hdd-or-ssd`.** The most-shown page again, now
  near page one, without clicks, across dozens of "how to know if I have an
  SSD or HDD" searches. Most put SSD first and ask how to tell, so the
  title became "SSD or HDD? How to tell which drive you have" (53
  characters, 490 px) and the description leads with "SSD or HDD?". The
  H1 and the URL are unchanged.
- **`/en/knowledge/check-memory-usage` dropped out** from 25 October. The
  page answers 200, is its own canonical and carries the da/en hreflang
  pair; no commit touched its English text that week. The Danish
  `/vejledninger/tjek-ram-forbrug` kept its impressions. An indexing
  question for URL Inspection, not a rewrite.
- **Old addresses still shown:** `/en/knowledge/slet-data-foer-du-saelger`,
  `/en/produkter/*` (including the retired `gaming`) and other hybrid
  `/en/` paths. Each answers one 301 to a live page. Nothing to do.
- **Still no impressions** for `/produkter/baerbare-computere` and
  `/produkter/skaerme`. The new English TCO guide was already shown.
- **Sitemap:** 156 submitted, no errors or warnings, read by Google on 31
  October.
- **No query landed on two URLs** apart from the brand name.

## English descriptions — 29 October 2026

Rule 5 on the English side, which the 28 October run left for later.

| Measure                                     | Before | After   |
| ------------------------------------------- | ------ | ------- |
| Descriptions at 145–160 characters, ≤920 px | 104    | 135/156 |
| English descriptions on target              | 32     | 62/78   |
| Pages with a warning                        | 75     | 47      |
| FAIL                                        | 0      | 0       |

- **Method.** Each English description was redrafted from the reviewed
  Danish one for the same page and measured with mak's metrics. English
  sets wider (about 6.3 px a character at the limit), so commas replace
  dashes and short words replace long ones.
- **Five said more than the Danish:** desktops "function-tested",
  smartphones "tested, reset and ready", a monitor size range and hub,
  monitors and mice on docking, and digital signage on mini PCs. They now
  say what the Danish says.
- **Left, width-bound:** 16 English and 5 Danish descriptions, mostly
  model pages and pages with Windows 11 or USB-C in the text. The
  Danish repair guide keeps "computer", its keyword, rather than gain a
  character.
- **Titles at 61–63 characters** (`/produkter/baerbare-computere` and five
  model pages) stay: all are under 580 px with the keyword in full, and
  shortening them would drop "Lenovo".

## Three new guides — 28 October 2026

The owner approved building the guide topics the map proposed. Three of the
five were built; two were not, on purpose.

| Guide                                       | Primary keyword                             | Covered | In-links |
| ------------------------------------------- | ------------------------------------------- | ------- | -------- |
| `/vejledninger/thinkpad-elitebook-latitude` | thinkpad vs elitebook vs latitude           | 17 / 17 | 10       |
| `/vejledninger/standardiser-firmacomputere` | standardisering af computere i virksomheden | 16 / 16 | 8        |
| `/vejledninger/tco-paa-firmacomputere`      | tco på firmacomputere                       | 15 / 15 | 9        |

- **Rule 5.** Titles 52–58 characters and descriptions 145–148, all within
  580 and 920 px, in both languages. The comparison's H1 uses the natural
  form ("ThinkPad, EliteBook eller Latitude: hvad er forskellen?"); "vs"
  stays in the title.
- **Rule 8.** The map's draft slug `vaelg-erhvervsbaerbar` was never
  published, so the comparison took `thinkpad-elitebook-latitude`, with
  the keyword in the path.
- **Never invented.** The comparison's facts come from `lib/models.ts` and
  the PSREF and Dell entries in `lib/sources.ts`. TCO gives the calculation
  and a checklist, not one figure; the dates and requirements it uses are
  cited from the registry.
- **Rule 9.** In from the laptop, desktop and docking categories,
  `/flaadeloesninger` and four guides, each with its own anchor.
- **Rule 3.** "ens computere til alle medarbejdere" moved to
  `/flaadeloesninger`: it is a buying search, and the guide explains it.
- **Not built.** Leasing or buying: Kestro does not lease, and the
  financial claims would need sources the registry does not have; TCO
  compares leasing neutrally instead. IT for small businesses: the results
  page probably wants IT-support providers, and the page would compete with
  `/produkter`. Both wait on a Danish results page.

## `mak run` — 28 October 2026

Run on a fresh build of the branch, then again after the fixes.

| Measure                                           | Before   | After                 |
| ------------------------------------------------- | -------- | --------------------- |
| Descriptions at 145–160 characters (all ≤ 920 px) | 80 / 150 | 98 / 150              |
| Danish descriptions under 145                     | 24       | 6, all bound by width |
| H1s carrying the primary keyword                  | 80       | 83                    |
| Pages with a warning                              | 88       | 73                    |
| Topic pages missing graph nodes                   | 18       | 7                     |
| FAIL, orphans, rule 9                             | 0        | 0                     |

- **Rule 5.** 21 Danish descriptions redrafted from their own pages and
  measured. The six left short are width-bound (model numbers and
  capitals): X1 Carbon, ZBook, WD19, USB-C Dock G5, repair-or-replace,
  Windows 11.
- **H1s.** `/modeller` names the series it lists, `/kvalitet` names
  warranty, and the WD19 takes Dell's own name, "Dell Dock WD19". The front
  page, `/flaadeloesninger` and `/kontakt` are left on purpose (design,
  and "aarhus" waits on an address); two guides already use the natural
  form of their keyword.
- **Rule 12.** New FAQ answers on battery, RAM/SSD, screen, keyboard,
  troubleshooting and PC-building repairs, and buying details on five
  category FAQs, all general facts or the pages' own. Seven graph terms
  were widened where the page already said it in other words.
- **Still questions for the owner:** warranty on a new battery; prices on
  tablets and phones; recycling claims on five categories; data erasure
  when preparing a bought machine; tablets for tills and booking.
- **Rule 3 (unchanged):** 20 informational keywords sit on commercial
  pages; each waits on a Danish results page, which cannot be read here.
- **New guide topics in the map** (model comparison, standardising,
  small-business IT, leasing or buying, TCO): each needs the owner's yes
  before a route is made.

## Search Console — week to 24 October 2026

Rule 14, read through Windsor for `sc-domain:kestro.dk`, 18–24 October
against 11–17 October. No figure is recorded here; what the data led to is.

- **Visibility grew, mostly abroad.** The English practical guides (drive
  type, RAM usage, slow computer, upgrade limits) took most of the new
  impressions, largely outside Denmark. Danish impressions grew too, and
  their average position improved. No query has impressions in the
  hundreds, so no title or description was rewritten for CTR (rule 5).
- **Rule 9.** The drive-type guide (`/vejledninger/hdd-eller-ssd`,
  `/en/knowledge/hdd-or-ssd`) was the most-shown page, at positions 8–20,
  with two content links in against a site median of seven. The upgrade-
  limits guide, which explains M.2, SATA and NVMe and itself sits near page
  one, now links it as "Er disken HDD eller SSD?".
- **Old addresses.** `/en/produkter/*`, `/en/vejledninger/*`, `/en/ydelser/*`
  and `/en/kvalitet` still collect impressions; each answers one 301 to its
  English page with a 200. Nothing to do.
- **No impressions yet** for `/produkter/baerbare-computere` and
  `/produkter/skaerme`, though both are in the sitemap and linked from 20 and
  11 pages. An indexing question for URL Inspection, not a rewrite.
- **Sitemap:** 150 submitted, no errors or warnings, read by Google on 25
  October.
- **Waiting on the owner:** URL Inspection and "Request indexing" for the two
  category pages above; the workstation category decision (workstation
  searches keep landing on `/modeller` and the desktop category).

## Copy Review — 24 October 2026

A sentence-level read of every Danish page against CLAUDE.md's writing
rules, with the English mirrors changed alongside.

- **Claims out.** "Populære modeller" was a demand claim in the menu, the
  footer, two service pages and the site search; the anchor is now
  "Modeller og specifikationer" (rule 9: a descriptive anchor, and a new
  variant to `/modeller`). Invented figures went: a 60 % battery "three months
  later" on `/kvalitet` and `/tilbud-eksempel`, a U2419H "on thousands of
  desks", an unlabelled 70 % threshold in the used-laptop checklist (now the
  site's own rule of thumb from `lib/battery-bands.ts`, said to be ours).
  Stock and price promises on the U2419H, E243, ThinkVision and G5 dock
  pages, and "most common", "almost every", "most overlooked" statistics
  across the guides and "inside the machine", were softened or removed.
- **Metadata re-measured** after grammar fixes changed five descriptions
  (two guides, the RAM-upgrade guide, `/priser`, the U2419H): all 145–160
  characters and at most 920 px with `measure.mjs`. No title or URL moved.
- **Anchor.** The Windows 11 guide's link to the laptop category reads
  "Bærbare til Windows 11" instead of "Maskiner, der kommer med over".
- **Grammar.** "Din bærbare", "den gamle bærbare" (definite after a
  determiner), the comma before a subordinate clause, English words in
  Danish copy ("tower", "laptop-model", "runtime-tests", "en laptops").

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
- Technical fixes cover consent withdrawal, non-JavaScript form safety, menu resize cleanup, a keyboard-accessible T480 gallery and explicit desktop 3D activation. The homepage hero and its four bitmap assets were unchanged. The repair viewer described here was replaced on 27 October by a four-stage photographic illustration with native controls on desktop and mobile; see [the current repair brief](../design/art-direction/repair-workbench.md).
- `npm audit --omit=dev` reports zero findings after compatible patches. Nine development-tool dependency findings remain; no forced Tailwind major upgrade or unverified override is used to hide them.
- Not resolved by wording: the real data controller's identity/contact details, processor agreements and legal review before trading; authentic photos for 17 model pages; actual customer evidence; stock, margins, repair handover and service policies. Catalogue comparison/filtering, broader visual simplification and new articles remain separate design/content work, not claims of defects already fixed.

| Lesson | In Mak                                                               | Checked here           |
| ------ | -------------------------------------------------------------------- | ---------------------- |
| 2-1    | Rules 6–7, the order of work                                         | 14 October 2026        |
| 2-2    | Rules 1–5; URL, snippet preview and harvest sources added 14 October | 13 and 14 October 2026 |
| 2-3    | Rules 8–10, heading roles in 5                                       | 14 October 2026        |
| 2-4    | Rules 11–14                                                          | 14 October 2026        |
| —      | Beyond the course (`references/beyond-course.md`)                    | 14 October 2026        |

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

  | Job          | Tree                            |
  | ------------ | ------------------------------- |
  | Buy          | `/produkter`, `/modeller`       |
  | Have it done | `/ydelser`, `/flaadeloesninger` |
  | Repair       | `/reparation`                   |
  | Sell         | `/saelg-til-os`                 |
  | Learn        | `/vejledninger`                 |

  Candidates from the course's repair example: error codes, and manuals or
  drivers. Not candidates: training and a parts shop, which Kestro does not
  sell.

- **Rule 7, the six steps:**

  | Step                       | Status                                                                                                  |
  | -------------------------- | ------------------------------------------------------------------------------------------------------- |
  | 1. User needs              | Done: B2B buyers, sellers, and repair customers including private ones.                                 |
  | 2. Keyword research        | Partial: the map exists, without volumes.                                                               |
  | 3. Hierarchy               | Done: the pillar sheet.                                                                                 |
  | 4. Alignment with products | Done: no category without the things it names. Tablets and phones have no model pages, which is honest. |
  | 5. Competitors             | Started (see below).                                                                                    |
  | 6. Review                  | Running: `mak audit` and this file.                                                                     |

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

| Check                                                     | Result                                             |
| --------------------------------------------------------- | -------------------------------------------------- |
| Canonical is the page's own path                          | 136 / 136                                          |
| `<meta charset>` in the first 1024 bytes                  | 136 / 136                                          |
| No heading level skipped                                  | 136 / 136 (median seven H2s a page)                |
| Title over 65 characters (the extension's warning)        | 0                                                  |
| Description over 170 characters (the extension's warning) | 0                                                  |
| URL is lowercase ASCII words joined by hyphens            | 136 / 136; longest 50 characters, deepest 3 levels |
| Slug carries the whole primary keyword                    | 4 of 77; partly 58; none 15                        |

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
- **Rule 14, Search Console:** done. Domain property `sc-domain:kestro.dk`,
  sitemap processed without errors; read through the Windsor.ai connector
  (first reading 21 October 2026, above). Bing Webmaster Tools still waits
  on the owner (it can import from Search Console).

### `mak run`, applied 14 October 2026

The whole method run on the site, as far as the facts allow. Measured by
`mak run` before and after, 136 pages:

| Check                                          | Before  | After                                                                      |
| ---------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| Titles 50–60 characters (all ≤ 580 px)         | 91      | 131 (the five left: four legal pages, and the English tablets title at 61) |
| Descriptions 145–160 characters (all ≤ 920 px) | 23      | 61; the rest sit at 850–920 px, a full snippet                             |
| Primary keyword in the H1                      | 5 of 77 | 67 of 77                                                                   |
| Product categories linked from every page      | 0       | 7 (footer)                                                                 |
| Repair pages with one link in                  | 8       | 0 (three to six each)                                                      |
| Blog → commercial links                        | 42      | 52                                                                         |
| Knowledge-graph coverage, categories           | 35–76 % | 67–88 %                                                                    |
| Knowledge-graph coverage, repairs              | 50–91 % | 75–100 %                                                                   |
| FAIL                                           | 0       | 0                                                                          |

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

| Check                                               | Result                                            |
| --------------------------------------------------- | ------------------------------------------------- |
| Page errors, console errors                         | 0 (WebGL notices from the software renderer only) |
| Broken internal links, of 202 distinct targets      | 0                                                 |
| In-page anchors pointing at a missing id            | 0                                                 |
| hreflang alternates answering anything but 200      | 0                                                 |
| Broken images, images without `alt`                 | 0                                                 |
| Horizontal overflow, elements wider than the screen | 0                                                 |
| Duplicate ids, controls without a name              | 0                                                 |
| Production runtime errors (Vercel, last 7 days)     | 0                                                 |
| `npm audit --omit=dev` (what ships)                 | 0                                                 |

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

### New sections reviewed, 19 October 2026

The practical guides, the three new articles, the products hub and the
category copy that landed between 15 and 17 October, read on a phone and at
1440 and 1920 px, then measured with `mak run`. 150 pages.

| Check                                       | Before                                                              | After    |
| ------------------------------------------- | ------------------------------------------------------------------- | -------- |
| FAIL                                        | 0                                                                   | 0        |
| Rule 9: page that matters with one link in  | 1 (`/vejledninger/tjek-batterikapacitet`)                           | 0        |
| Knowledge-graph coverage, categories        | 67–88 % after the rewrite dropped "funktionstest" and Danmark/Norge | 83–100 % |
| Bug crawl, 150 pages × 2 widths             | 0 errors, 0 broken links of 218, 0 overflow                         | same     |
| Duplicate article images on `/vejledninger` | 3 pairs                                                             | 0        |

Changed:

- **Practical guides.** The battery calculator says what its number means, in
  the same four bands as `/reparation/batteriskift` (one source,
  `lib/battery-bands.ts`). The browser check compares a run with the first
  one, which is the guide's last step; a rate on its own meant nothing. Each
  page says its caveat once, the AI-image note is one short line, and four
  leads and headings were rewritten in plainer Danish and English.
- **Articles.** The RAM-price article opens with the answer; the
  refurbished-or-new and upgrade articles lost a filler sentence each.
  Their `updated` is 19 October because their words changed.
- **Category FAQ.** "Funktionstest" and delivery to Danmark/Norge are back,
  as advice to get in writing rather than as a promise.
- **Links in.** The battery, RAM and troubleshooting repair pages link the
  guide that measures the problem first; the used-laptop checklist links the
  battery guide.

Waits on the owner, as before.

### External laptop recommendations, 11 November 2026

The existing laptop category now separates editorial recommendations with direct
external purchase links from Kestro's own future range. Danish and English keep
their existing URL, title, description, H1 and canonical. Three exact retailer
configurations are documented in the source registry; merchant identity,
business/personal purchasing and condition caveats are visible before leaving.
There are no copied retailer photographs, persistent live-stock badges, invented
prices or Kestro Offer markup. The future range is a plan with unconfirmed prices
and timing. The keyword map and pillar routes are unchanged; no new search intent
or page was created. The category's current content date is already 11 November.
The date generator was not run against the shallow checkout.

The implementation brief is `design/art-direction/external-laptop-recommendations.md`.
The release gate includes a bilingual external-merchant handoff check, including
native links without JavaScript and the exact seller destinations. Publication
requires the full existing verification/security/admin-workflow gate.

# Product browsing and model photographs — 11 November 2026

The product hub now has one visual directory of the same seven categories.
Its title, description, H1, canonical, hreflang and URLs are unchanged; the
opening copy is shorter and existing buying guidance remains server-rendered
inside native disclosures. Category and guide destinations are preserved.

The laptop category reaches exact licensed model photographs without a large
generic hero ahead of them. T14 Gen 2 and EliteBook 840 G8 are the two visual
starting points; Latitude 5420 remains a secondary external comparison.
Their exact retailer destinations and purchase/condition notices are intact.
The model-photo notice distinguishes the image from the seller's particular
unit, keyboard and condition; source, author and licence credits are available
without JavaScript. No photograph is used to claim stock or a sales Offer.
See `docs/media-licenses.md` and `design/art-direction/product-browsing-refresh.md`.

# Pricing collection — 11 November 2026

The four existing `/priser` references now form an image-led collection with
explicit model-photo/illustration labels, a visible 14 October 2026 read date,
and the VAT/service-fee/shipping basis beside the grid. These remain historical
retail examples, not Kestro stock, selling prices or new sales Offers. The
original amounts, fees, source URLs and H1/metadata/canonicals are preserved.

Each non-binding enquiry carries the reference's full model and configuration,
including generation, SFF case and keyboard, into the existing quote form.
The model-page budget boxes now show the historical read date too. External
source links are labelled historical because today's default variant may
differ. Exact T480/T14 images and original, visibly schematic Dell artwork
are documented in `docs/media-licenses.md`; no retailer image is hotlinked.
The prelaunch notice and all existing model/specification links remain.

# Laptop pictures: real photographs only — 11 November 2026

The owner ruled that every laptop shown must be a real photograph of that
model. The seven laptop illustrations (X1 Carbon, L14, EliteBook 840,
ProBook 450, Latitude 5410, Latitude 7490, ZBook 15) were deleted; those
cards and model pages now open without a picture, and their image alt texts
are gone with them. Only the T480 (owner photos) and T14 (CC0) carry a
model photo. Commons candidates for the 7490 and X1 Carbon are listed in
`docs/media-licenses.md`; the other five need the owner's own photographs.
Image search for these pages waits on real photos; no URL, title, H1 or
canonical changed.

# Model photographs: a second search — 12 November 2026

Every catalogue model and the Latitude 5420 recommendation was searched
again on Wikimedia Commons and Openverse. Two models gained real, licensed
photographs of the exact model: the Dell Latitude 7490 (Ahunt, CC0) and the
Dell Dock WD19 (Raimond Spekking, CC BY-SA 4.0, two views, cropped). The
WD19's illustration was removed. Each photo carries an alt text describing
what it shows and a visible credit; the files and their changes are in
`docs/media-licenses.md`, which also lists every model still without a
photograph and where it was looked for. No URL, title, H1, description or
canonical changed.

The ThinkPad Ultra Dock gained one too (Paowee, CC BY-SA 4.0, margins
trimmed, shown whole at about 2:1); its illustration was removed. The X1
Carbon candidate on Flickr stays unused: only its 1024 px size is reachable
from here, under the 1200 px minimum. No URL, title, H1 or canonical changed.

How the catalogue uses them (12 November 2026):

- **Image sitemap.** Every model page with photographs lists them as
  `<image:image>` entries in `app/sitemap.ts`, read from `model.images`, so
  a new photograph is listed without another edit. Illustrations are left
  out: they are not a picture of the model.
- **Photographs first.** Every shelf of model cards (the catalogue groups,
  a category's models, a model page's related row, the four-model shelf on
  /produkter) shows photographed models first (`lib/model-order.ts`). The
  ItemList structured data keeps the catalogue's order.
- **The X1 Carbon candidate is closed.** Its screen shows personal data,
  and blurring a stranger's screen to use the photo is not worth a
  retouched product image. The X1 Carbon, L14, EliteBook 840 G5/G6, ProBook
  450 G7/G8, Latitude 5410, ZBook 15 G5/G6 and the Latitude 5420 wait for
  the owner's own photographs.

# Model photographs: more views — 12 November 2026

Two galleries gained a second or third licensed view of the exact model: the
ThinkPad Ultra Dock with a ThinkPad T470 docked (Paowee, CC BY-SA 4.0) and
the Dell WD19 from the front (Raimond Spekking, CC BY-SA 4.0). The card image
of each is unchanged. The OptiPlex 5060 Micro photograph on Commons stays
unused: the card's 4:3 crop cuts the upright machine in half. No URL, title,
H1, description, canonical or word of page copy changed.

# "Har I brug for den nu?" on every model page — 12 November 2026

The owner asked that each model say Kestro does not have it yet and point to
where it can be bought meanwhile. Every model page now has that section under
its header (`components/RetailLinks.tsx`): "Vi har ikke {model} på lager
endnu", the retailers whose own search showed that exact model, and a link to
ask Kestro to source it.

- The links come from `lib/retail-links.ts`, checked on 12 November. Only
  refurbed could be checked; Proshop and Dustin (Cloudflare 403), Amazon.de
  (refuses automated search) and Elgiganten (results never render for an
  automated client) are left out until someone checks them by hand
  (`docs/retail-links.md`).
- Outbound links carry `rel="noopener noreferrer nofollow"`: a search page
  is not a source the page vouches for.
- No retailer photo, price or "best price" claim is shown. The footnote says
  the shops are independent and Kestro earns nothing from the link.
- The FAQ answer "Har I {model} på lager?" stays: it answers a question
  buyers type, which is a different job from the section's notice.
