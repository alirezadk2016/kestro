# SEO playbook

How keywords, pages and categories are decided on kestro.dk. CLAUDE.md
requires every SEO change to follow it, and `docs/seo-keyword-map.md` / `.csv`
apply it.

The rules come from an SEO course the owner is working through. The lessons
are added here one at a time, in our own words. The course text itself stays
out of the repository: this repository is public, and the course is not ours
to publish.

| Lesson | Status |
| --- | --- |
| 2-1 | Waiting — not transcribed yet |
| 2-2 | Rules 1–5 below: the owner's transcript (0:00–20:17) and screenshots of the session's sheets and slides |
| 2-3 | Waiting |
| 2-4 | Waiting |

---

## 1. One page per search intent — the results page decides

Before two keywords share a page, search each one and read page one.

- **Same results for both → one page.** If "stylish shirt", "new shirt" and
  "shirt" bring up the same pages, one category page can serve all three.
- **Different results → different intents → separate pages.** "Google Ads",
  "Google Ads price", "Google Ads examples" and "Google Ads specialist" bring up
  four different result sets: dedicated pricing pages, videos, job boards and
  freelancer sites. That is four intents and needs four pages. A site with no
  page of its own for the price cannot compete with the sites that have one.
- **The type of result tells you the intent.**

  | What page one shows | Intent | Where it goes |
  | --- | --- | --- |
  | Product or category pages | Commercial | A category or service page |
  | Videos, how-to articles, recipes | Informational | The blog (`/vejledninger`) |
  | Job boards, freelancer profiles | Hiring a person | Not ours |

## 2. Categories follow the buyer's first decision

- **The first level is the first choice the buyer makes.** In a pet shop that
  is the animal, so the top categories are dog and cat. Next to them goes a
  general category for things that serve every animal. "Pet food", "dog food"
  and "cat food" are three intents and get three pages.
- **A product may sit in many categories.** Categories come from keyword
  research, cut along whatever people search by: price band, style, colour,
  feature, occasion. One large shop has about 3,000 products in about 7,000
  categories, and a single product appears in about 100 of them.
- **Second-level groups take creativity.** Group them in the words people
  search with. For syrups that means nutty, spiced and sugar-free, not one long
  list.
- **Thin categories leave demand on the table.** A gift shop with only
  "birthday" and "Valentine's" misses gifts by style, by recipient and by type
  of person.

## 3. The blog has its own tree, and it comes second

- **An informational search never goes on a product or service category.**
  Take "khakshir sherbet": page one is recipes, so the searcher wants to make
  it, not buy it. That keyword goes in the blog. "Syrup uses" goes there too.
- **Blog categories are planned as carefully as the product categories.**
- **Order:** finish the product and service categories first, then the blog.
- **A repair business has four or five trees, not one:** repairs (the
  services), error codes, catalogues and manuals, and training videos. Build
  them from the keyword bank and from how competitors categorise.

## 4. Keyword research is done per page, after the structure is final

- **Set up a "keyword research" sheet.** One row per category, indented by
  level. Each row has empty columns for its SEO title and meta description,
  which are written later, row by row.
- **Research one category's own name at a time.**
- **Take** variants with the same intent:
  - singular and plural, "repair" and "repairs";
  - "authorised … repair";
  - "… at home" when the service cannot be anywhere else, because nobody
    carries a fridge into a workshop.
- **Do not take:**
  - **A child page's keywords.** A brand ("DeLonghi fridge repair") or a city
    ("… repair Isfahan") that has its own page belongs to that page.
  - **A different intent.** "… in English" is informational. "Book on …"
    means the searcher wants to read, so it belongs in the blog or nowhere.
- **Harvest suggestions from Google autocomplete.** Type the keyword plus
  each letter of the alphabet, then check every suggestion against the two
  lists above.
- **When a modifier might change the intent, test it.** Take "electric":
  search the keyword with and without it. If page one is largely the same and
  most results do not use the modifier, the intent is the same and the keyword
  belongs on the same page.
- **Keep a keyword pool per category.** Export one column block per
  category from a keyword tool, with three columns: keyword, search volume and
  difficulty. The course uses Keywordchi; for Danish, Google Keyword Planner
  gives the volumes.
- **Expand with connecting words, not just letters.** The tool's mind map
  hangs suggestions off the keyword plus each preposition ("to", "with",
  "from", "in", "for"). That is how "… in English", "a book on …" and
  "… at home" surface. In Danish the words are *til, med, fra, i, for, uden,
  på*, and the question words are *hvad, hvordan, hvorfor, hvilken*.

## 5. Title, description and H1 for every row

The second session's homework has three parts, all done in the same sheet:
the pillar cluster, the keyword research, and a title, description and H1 for
every row.

- **The pillar-cluster sheet has these columns:** pillar, levels 1–5, SEO
  title, `=LEN()` of the title, SEO description, `=LEN()` of the description.
  - Each tree (repairs, repair training, error codes) is a pillar of its own.
  - Grouping rows ("by neighbourhood", "by brand", "by city") are not pages.
    The pages sit under them: "fridge repair in Saadat Abad", "Bosch fridge
    repair".
- **Product category sheet:** level 2, level 3, an "exists on the site" tick,
  SEO title, product count, description. A category gets a page only when the
  site has the products for it.
- **The title tag** is shown in the browser tab and as the headline in
  search, which makes it the most important on-page element.
  - 50–60 characters, so it shows in full.
  - The target keyword at the start.
  - Attractive enough to click.
  - Unique: no two pages share a title.
- **The meta description** is the summary shown under the title.
  - 150–160 characters.
  - The keywords used naturally, written for a person.
  - A call to action raises click-through: "Read more", "Buy now".
  - Unique, and an accurate description of that page.

**At Kestro the pixel limits bind:** 580 px for a title, 920 px for a
description, measured the way Google cuts them. Characters are the course's
rule of thumb, and Danish is wider than Persian per character. The two agree
for most titles. For descriptions, aim for 145–158 characters inside 920 px.

---

## What this means for kestro.dk

**Structure today:**

| Tree | Where |
| --- | --- |
| Products | `/produkter/*` and `/modeller/*` |
| Services | `/ydelser/*` |
| Repairs | `/reparation/*` |
| Blog | `/vejledninger/*` |

### Checked against rules 1–4 (13 October 2026)

- **Rule 4, child keywords: no breaches.** No category or hub page carries a
  keyword that has its own child page. The ThinkPad, EliteBook and Latitude
  keywords on `/modeller` are generic. Every model keyword sits on its own
  model page.
- **Rule 3, informational keywords on commercial pages: to check.** These
  keywords are secondary on a service or category page, and their intent is
  probably "how do I", not "do it for me":

  | Keyword | Page it sits on |
  | --- | --- |
  | `bærbar larmer` | `/reparation/rens-og-koeling` |
  | `bærbar bliver varm` | `/reparation/rens-og-koeling` |
  | `computer går ned` | `/reparation/fejlfinding` |
  | `overføre filer til ny pc` | `/reparation/ny-opsaetning-og-dataflytning` |
  | `tjek batteri bærbar` | `/reparation/batteriskift` |
  | `skifte ssd i bærbar` | `/reparation/ram-og-ssd-opgradering` |
  | `dobbeltskærm opsætning kontor` | `/produkter/skaerme` |
  | `usb-c dock til flere skærme` | `/produkter/dockingstationer` |

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
  of the course sheet.
  - Columns: tree, levels 1–3, URL, "exists" (ja/nej), primary keyword, SEO
    title, characters and pixels, meta description, characters and pixels,
    H1.
  - Proposed pages are rows marked `nej`: the brand level, the guides not yet
    written, and an error-code tree.
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
