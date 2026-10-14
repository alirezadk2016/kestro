# The sheets

The course keeps its SEO work in spreadsheets. Here are their shapes, and the
Kestro file that plays each part.

## Pillar cluster  →  `docs/seo-pillar-cluster.csv`

| Course column | Kestro column |
| --- | --- |
| Pillar (one per tree: services, training, error codes) | Træ |
| Level 1 … Level 5, stepped: one row per item, the deeper level one column further in | Niveau 1–3 |
| — | URL, Findes (ja/nej/—), Primært søgeord |
| SEO title, `=LEN(title)` | SEO-title, Title-tegn, Title-px |
| SEO description, `=LEN(description)` | Meta description, Description-tegn, Description-px |
| (title, description, URL and H1: the homework's third tab) | URL, H1 |

- **Grouping rows** such as "by brand", "by city" or "Efter model" are not
  pages. They have no URL and `Findes = —`.
- **Proposed pages** have `Findes = nej`, and come from the keyword map's
  `New` rows.
- **One product may appear under several categories.** The OptiPlex 5060
  sits under both stationære and mini-pc'er.
- **Rebuild:** `python3 .claude/skills/mak/scripts/pillar.py --audit <audit json>`.

## Keyword pool  →  `docs/keyword-pool/<page>.csv` (when real data exists)

The course exports one block per seed or category from its keyword tool, side by side in one sheet:

| keyword | search volume | difficulty |
| --- | --- | --- |

Pools are built per page, and the city and brand combinations are kept in
them. A pool's keywords are then sorted into the page's own, its children's,
and other intents (method, rule 4).

**At Kestro there is no Danish volume source in the environment.** A pool is
created only from an export the owner supplies, such as Google Keyword
Planner or Search Console. Its columns are `keyword, volume, difficulty,
source, date`. No numbers are estimated.

### Kestro's seeds  *(rule 6)*

These are the starting phrases to run through Google Keyword Planner, one
export per seed. They are what a Danish buyer, seller or repair customer
plausibly types. Volumes come only from the export, so these lines carry
none. Store each export as `docs/keyword-pool/<seed>.csv` with the columns
`keyword, volume, difficulty, source, date`.

| Pillar | Seeds |
| --- | --- |
| Buy | brugt bærbar · refurbished bærbar · brugte computere · brugt stationær computer · brugt skærm · brugt dockingstation · brugt mini pc · brugte tablets · brugt iphone · refurbished computer erhverv · it-udstyr til virksomheder · firmacomputer |
| Buy, by brand | brugt thinkpad · brugt lenovo · brugt dell latitude · brugt dell optiplex · brugt hp elitebook · brugt hp elitedesk · refurbished thinkpad |
| Fleet and B2B | computere til medarbejdere · udskiftning af firmacomputere · it-indkøb virksomhed · klargøring af computere · leasing af computere (check the intent: Kestro does not lease) |
| Sell | sælg brugt it-udstyr · opkøb af computere · sælg brugte bærbare · bortskaffelse af it-udstyr · datasletning |
| Repair | computer reparation · pc reparation · batteriskift bærbar · skærmskift bærbar · rens bærbar · geninstallere windows · computer starter ikke · ram opgradering · tastatur bærbar |
| Learn | windows 11 krav · windows 10 support · tjek brugt bærbar · refurbished eller brugt · hvor meget ram · lenovo fejlkode · dell blinkende lys · hp bip lyde |

**Run the short seeds first.** The course advises one or two words per seed,
so the tool returns the long phrases itself:

`brugt bærbar` · `brugt computer` · `refurbished computer` · `brugt skærm` ·
`dockingstation` · `mini pc` · `thinkpad` · `elitebook` · `latitude` ·
`optiplex` · `pc reparation` · `computer reparation` · `sælg computer`

The longer seeds in the table are checks: if a short seed's export does not
bring them back, run them on their own.

Norway is a market, but the site has no Norwegian pages. Norwegian seeds
("brukt pc bedrift") wait until there is a Norwegian page plan.

## A full SEO project, tab by tab  *(rule 7)*

The course's project sheet keeps one tab per stage:

1. Categorisation
2. Final categorisation
3. Content
4. Services
5. Keyword research
6. Social
7. Internal links
8. Blog
9. Working instructions

At Kestro each stage has a file:

| Stage | Kestro file |
| --- | --- |
| Categorisation and final categorisation | `docs/seo-pillar-cluster.csv` |
| Keyword research | `docs/seo-keyword-map.csv` |
| Keyword pool | `docs/keyword-pool/` |
| Status and working instructions | `docs/seo-playbook.md` |

Internal links and social have no sheet yet. Internal links are the next one
worth adding, because seven repair pages have few links pointing to them.

## Keyword research  →  `docs/seo-keyword-map.csv`

The course's sheet has one row per category: category name, keyword, search
volume, difficulty, SEO title. The title is written from the row's own
research, packing the same-intent variants and a bracketed benefit (rule 5).

At Kestro the map is keyword-first instead:

- **One row per keyword.** Columns: language, intent, category, primary
  URL, primary or secondary, priority, existing or new page, cannibalisation,
  B2B intent, volume, difficulty, CPC, notes, live title, and keyword in
  title (ja/delvist/nej).
- **One primary per URL,** and never the same primary on two URLs.
- **Check it** with `scripts/check-map.py`.

## Product categories  →  `lib/categories.ts` + `lib/models.ts`

- **Course columns:** level 2, level 3, exists on site ✔, SEO title,
  product count, description.
- **The ✔ is the rule:** no category page for products the site does not
  have.
- **Kestro has no stock and no counts.** A model page exists because Kestro
  sources that model repeatedly, and that is what the page says.
- **The course's title pattern does not transfer as written.** It runs
  "buy + category + brand + original + [direct from the maker + price
  list]". Kestro has no price list, so a bracket of true benefits takes its
  place, such as "dansk tastatur" or "skriftligt tilbud".

## Article categories  →  `lib/guides.ts` clusters

- **The blog tree has its own levels.** Topic, then subtopic, then articles,
  and sometimes a level under that (recipes by type, sherbets by season).
- **At Kestro:** five clusters, guides under them.
  - Proposed guides wait in the keyword map as `New` rows.
  - A possible error-codes and warning-lights cluster is the
    repair-business pattern from rule 3. It needs page-one evidence first.
