# Retail links for the reference models

Checked on **2026-11-12**. Data: `lib/retail-links.ts`. No model page imports it yet.

Kestro stocks none of the 18 models in `lib/models.ts`. Each model page will get
a section that points the buyer to retailers who carry the model. This file
records how those links were checked.

## Retailers and search URL formats

| Retailer   | Search URL format                               | How it was found                                                                                                | Status      |
| ---------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------- |
| Proshop    | not established                                 | home page refused (see below)                                                                                   | **blocked** |
| Dustin     | not established                                 | home page refused (see below)                                                                                   | **blocked** |
| Elgiganten | `https://www.elgiganten.dk/search?q=<query>`    | home page search form: `action="/search"`, field `q`                                                            | **blocked** |
| Amazon.de  | `https://www.amazon.de/s?k=<query>`             | home page search form posts to `/s`; format as briefed                                                          | **blocked** |
| refurbed   | `https://www.refurbed.dk/search/?query=<query>` | home page search form: `action="/search/"`, field `query`; the site's own `SearchAction` template says the same | reachable   |

In each query, spaces are written as `+`.

### Blocked, and how

No block was worked around. Each retailer got one plain request and, where
it is noted below, one load in a browser.

- **Proshop** – `https://www.proshop.dk/` answered `403` with a Cloudflare
  "Attention Required!" page.
- **Dustin** – `https://www.dustin.dk/` answered `403` with
  `cf-mitigated: challenge` (a Cloudflare challenge).
- **Amazon.de** – the home page loaded (`200`). The search
  `https://www.amazon.de/s?k=ThinkPad+T480` returned Amazon's "Tut uns Leid!"
  page, which carries their notice about automated access and points to their
  APIs. That is a refusal of automated search.
- **Elgiganten** – the search page loaded (`200`, title "Søgeresultater for
  "ThinkPad T480""). Its results are rendered in the browser. The page was
  loaded twice in headless Chromium with Playwright's default identity:
  `ThinkPad T480` once, and `ThinkPad L14` with a 12-second wait. The result
  area stayed completely empty. It showed no products, no count and no "no
  results" message, and the page config carries a reCAPTCHA low-score
  setting. The results could not be seen, so Elgiganten is treated as
  blocked. A retailer whose search showed nothing is not a retailer whose
  search showed a match. Nothing further was attempted.

## Method

1. For each retailer, load the home page and read its search form. Confirm
   the format by loading one search for `ThinkPad T480`.
2. Send requests as `User-Agent: KestroCatalogueBot/1.0 (https://kestro.dk)`
   (plain HTTP) or with Playwright's default identity. Wait at least 3 seconds
   between requests to the same site; the refurbed run waited 4.
3. For every model, search for its `name` from `lib/models.ts`, brand
   included. Each refurbed search found the model with the brand in, so no
   search without the brand was needed.
4. refurbed renders its results on the server. Read the product titles from
   the result cards, which come as `Brand Model Gen | CPU | size`.
5. Count a result only if its title is the same model line. `ThinkPad T480`
   counts; `T480s`, `L15`, another series or an accessory does not. Keep a
   link only where at least one result matched.
6. Condition: refurbed sells only refurbished devices, so every match is
   `used`.
7. Generations: compare the generations in the titles with the ones the
   model page covers in `lib/models.ts`.

## Per model

refurbed is the only retailer that could be checked. The other four are
blocked for every model.

| Model                         | Retailer | Matched | Condition | Generations: page vs results                                                           |
| ----------------------------- | -------- | ------- | --------- | -------------------------------------------------------------------------------------- |
| Lenovo ThinkPad T480          | refurbed | yes     | used      | Single model; T480 in several 8th-gen configurations. T480s also shown, not counted    |
| Lenovo ThinkPad T14           | refurbed | yes     | used      | Page: Gen 1–2. Results: G1, G2 (covered) and G3, G4                                    |
| Lenovo ThinkPad X1 Carbon     | refurbed | yes     | used      | Page: Gen 6–8. Results: G6, G7, G8 (covered) and G9, G10, G11                          |
| Lenovo ThinkPad L14           | refurbed | yes     | used      | Page: 10th/11th-gen Intel or Ryzen (Gen 1–2). Results: G1, G2 (covered) and G3, G4, G5 |
| HP EliteBook 840              | refurbed | yes     | used      | Page: G5–G6. Results: G5, G6 (covered) and G7–G11                                      |
| HP ProBook 450                | refurbed | yes     | used      | Page: G7–G8. Results: G7, G8 (covered) and G6, G9, G10. ProBook 455/650 not counted    |
| Dell Latitude 5410            | refurbed | yes     | used      | Single model; 10th-gen i5/i7 configurations                                            |
| Dell Latitude 7490            | refurbed | yes     | used      | Single model; 8th-gen i5/i7 configurations                                             |
| HP ZBook 15                   | refurbed | yes     | used      | Page: G5–G6. Results: G5, G6 (covered) and 15v G5. Fury 15 and Firefly 15 not counted  |
| HP EliteDesk 800              | refurbed | yes     | used      | Page: G4–G5 SFF. Results: G4, G5 as SFF, TWR, DM (covered) and G6, G8, G9              |
| Lenovo ThinkCentre M720q Tiny | refurbed | yes     | used      | Single model                                                                           |
| Dell OptiPlex 5060            | refurbed | yes     | used      | Page: SFF and Micro. Results: 5060 SFF only; the other OptiPlex models are not counted |
| Dell UltraSharp U2419H        | refurbed | yes     | used      | Single model. U2415H also shown, not counted                                           |
| HP EliteDisplay E243          | refurbed | yes     | used      | Single model, among other EliteDisplay models (not counted)                            |
| Lenovo ThinkVision T24i       | refurbed | yes     | used      | Page names no generation. Results: T24i-10, T24i-20, T24i-2L                           |
| Lenovo ThinkPad Ultra Dock    | refurbed | yes     | used      | Page: 40A2. Results: 40A2 (covered) and 40AJ                                           |
| Dell Dock WD19                | refurbed | yes     | used      | Page: WD19. Results: WD19 (covered) and WD19S, WD19TB, WD19DC                          |
| HP USB-C Dock G5              | refurbed | yes     | used      | Single model                                                                           |

All 18 models have one link, to refurbed. Each search URL is the
query above, exactly as loaded, and is stored in `lib/retail-links.ts`.

## Lenovo ThinkPad generations, 2026-11-14

The 50 ThinkPad generation pages in `lib/models-lenovo-business.ts` were
checked against refurbed only. Amazon and Elgiganten were not touched, and
no images or prices were taken.

**Method.** One script fetched refurbed's own search for each model's `name`,
spaces as `+` (e.g. `https://www.refurbed.dk/search/?query=Lenovo+ThinkPad+T14+Gen+4`),
one request at a time, about two seconds apart. Every request answered 200
with a normal results page; nothing was blocked, rate-limited or served a
captcha. Product titles were read from the result cards
(`<article title="…">`, 16 per page). refurbed writes generations as `G4`,
not `Gen 4`.

A link was kept only if at least one title was that exact model and
generation: `T14 G4` counts for T14 Gen 4; `T14 G3`, `T14s G4`, `X13 Yoga G4`
for X13 Gen 4, or `P16s G2` for P16 Gen 2 do not. A title with no generation
was not counted. Kept slugs get one refurbed link with `condition: "used"`
and `checkedOn: "2026-11-14"`; the rest get `[]`, a real check that found
nothing.

**Result:** 38 kept, 12 not found.

| Slug                             | Result    | What the titles showed                                                                                                                                                               |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| lenovo-thinkpad-t14-gen-3        | kept      | Several T14 Gen 3 titles. Also shown: T14s Gen 3, T14 Gen 1, T14                                                                                                                     |
| lenovo-thinkpad-t14-gen-4        | kept      | Several T14 Gen 4 titles. Also shown: T14, T14s Gen 4, T14 Gen 3, T14 Gen 1, T14 Gen 5, T14 Gen 2                                                                                    |
| lenovo-thinkpad-t14-gen-5        | kept      | Several T14 Gen 5 titles. Also shown: T14 Gen 3, T14 Gen 4, T14 Gen 1, T14s Gen 5, T14, T14 Gen 2, T14s Gen 2                                                                        |
| lenovo-thinkpad-t14s-gen-2       | kept      | Several T14s Gen 2 titles. Also shown: T14s Gen 5, T14s Gen 4, T14s Gen 1                                                                                                            |
| lenovo-thinkpad-t14s-gen-3       | kept      | Several T14s Gen 3 titles. Also shown: T14s Gen 5, T14s Gen 4                                                                                                                        |
| lenovo-thinkpad-t14s-gen-4       | kept      | Several T14s Gen 4 titles. Also shown: T14s Gen 3, T14s Gen 5, T14s Gen 2, T14s Gen 1                                                                                                |
| lenovo-thinkpad-t14s-gen-5       | kept      | Several T14s Gen 5 titles. Also shown: T14s Gen 4, T14s Gen 3, T14s Gen 1, T14s Gen 2                                                                                                |
| lenovo-thinkpad-t16-gen-1        | kept      | Several T16 Gen 1 titles. Also shown: T16 Gen 2                                                                                                                                      |
| lenovo-thinkpad-t16-gen-2        | kept      | Several T16 Gen 2 titles. Also shown: T16 Gen 1                                                                                                                                      |
| lenovo-thinkpad-t16-gen-3        | not found | Also shown: T16 Gen 1, T16 Gen 2                                                                                                                                                     |
| lenovo-thinkpad-x1-carbon-gen-9  | kept      | Several X1 Carbon Gen 9 titles. Also shown: X1 Carbon Gen 10, X1 Carbon Gen 6, X1 Carbon Gen 8, X1 Carbon Gen 11, X1 Carbon Gen 12                                                   |
| lenovo-thinkpad-x1-carbon-gen-10 | kept      | Several X1 Carbon Gen 10 titles. Also shown: X1 Carbon Gen 7, X1 Carbon Gen 8, X1 Carbon Gen 6, X1 Carbon Gen 9                                                                      |
| lenovo-thinkpad-x1-carbon-gen-11 | kept      | One X1 Carbon Gen 11 title. Also shown: X1 Carbon Gen 10, X1 Carbon Gen 8, X1 Carbon Gen 6, X1 Carbon Gen 7, X1 Carbon Gen 9                                                         |
| lenovo-thinkpad-x1-carbon-gen-12 | kept      | One X1 Carbon Gen 12 title. Also shown: X1 Carbon Gen 10, X1 Carbon Gen 6, X1 Carbon Gen 8, X1 Carbon Gen 11, X1 Carbon Gen 9                                                        |
| lenovo-thinkpad-x1-yoga-gen-6    | kept      | Several X1 Yoga Gen 6 titles. Also shown: X1 Yoga Gen 7, X1 Yoga Gen 5, X1 Yoga Gen 8, X1 Yoga Gen 1 Titanium, X1 Carbon Gen 6, X1 Yoga Gen 4                                        |
| lenovo-thinkpad-x1-yoga-gen-7    | kept      | Several X1 Yoga Gen 7 titles. Also shown: X1 Yoga Gen 5, X1 Yoga Gen 6, X1 Yoga Gen 1 Titanium, X1 Yoga Gen 8, X1 Yoga Gen 4, X1 Yoga Gen 3, X13 Yoga Gen 3                          |
| lenovo-thinkpad-x1-yoga-gen-8    | kept      | Several X1 Yoga Gen 8 titles. Also shown: X1 Yoga Gen 6, X1 Yoga Gen 5, X1 Yoga Gen 4, X1 Carbon Gen 8, X13 Yoga Gen 3, X1 Yoga Gen 7, X1 Carbon Gen 9, X1 Yoga Gen 3                |
| lenovo-thinkpad-x1-2-in-1-gen-9  | not found | Also shown: X1 Yoga Gen 8, X1 Yoga Gen 3, X1 Yoga Gen 4, X1 Carbon Gen 11, X1 Yoga Gen 7, X13 Yoga Gen 3, X1 Carbon Gen 9, X13 Gen 3, X1 Yoga Gen 5, X1 Yoga Gen 6, X1 Carbon Gen 10 |
| lenovo-thinkpad-x1-nano-gen-1    | kept      | One X1 Nano Gen 1 title. Also shown: X1 Carbon Gen 10, X1 Carbon Gen 6, X1 Carbon Gen 7, X1 Yoga Gen 6, X1 Carbon Gen 8, X1 Carbon Gen 9, X13 Gen 3, X1 Yoga Gen 3                   |
| lenovo-thinkpad-x1-nano-gen-2    | not found | Also shown: X1 Nano Gen 1, X13 Gen 2, X1 Carbon Gen 9, X1 Carbon Gen 10, X1 Carbon Gen 8, X13 Yoga Gen 2, X1 Carbon Gen 6, X1 Yoga Gen 6, X13 Gen 3                                  |
| lenovo-thinkpad-x1-nano-gen-3    | not found | Also shown: X1 Nano Gen 1, X13 Gen 3, X1 Yoga Gen 3, X1 Extreme Gen 3, X1 Carbon Gen 10, X1 Carbon Gen 8, X1 Yoga Gen 7, X13 Yoga Gen 3, X1 Carbon Gen 9                             |
| lenovo-thinkpad-x13-gen-2        | kept      | Several X13 Gen 2 titles. Also shown: X13, X13 Yoga Gen 2, X13 Gen 1, X13 Gen 4, X13 Gen 3                                                                                           |
| lenovo-thinkpad-x13-gen-3        | kept      | Several X13 Gen 3 titles. Also shown: X13, X13 Yoga Gen 3, X13 Gen 1, X13 Gen 2, X13 Gen 4                                                                                           |
| lenovo-thinkpad-x13-gen-4        | kept      | Several X13 Gen 4 titles. Also shown: X13, X13 Gen 2, X13 Gen 3, X13 Yoga Gen 4, X13 Gen 1, X13 Yoga Gen 2, X13 Yoga                                                                 |
| lenovo-thinkpad-x13-gen-5        | not found | Also shown: X13, X13 Gen 4, X13 Gen 2, X13 Gen 1, X13 Gen 3, X13 Yoga Gen 2                                                                                                          |
| lenovo-thinkpad-x13-yoga-gen-2   | kept      | Several X13 Yoga Gen 2 titles. Also shown: X13 Yoga Gen 1, X13 Yoga, X13 Yoga Gen 3, X13 Yoga Gen 4, X13 Gen 2                                                                       |
| lenovo-thinkpad-x13-yoga-gen-3   | kept      | Several X13 Yoga Gen 3 titles. Also shown: X13 Yoga Gen 2, X13 Yoga Gen 4, X13 Yoga, X13 Yoga Gen 1, X13, X13 Gen 3                                                                  |
| lenovo-thinkpad-x13-yoga-gen-4   | kept      | One X13 Yoga Gen 4 title. Also shown: X13 Yoga, X13 Yoga Gen 2, X13 Yoga Gen 1, X13 Yoga Gen 3, X13 Gen 4                                                                            |
| lenovo-thinkpad-l14-gen-3        | kept      | Several L14 Gen 3 titles. Also shown: L14 Gen 5, L14 Gen 1, L14 Gen 4, L14 Gen 2                                                                                                     |
| lenovo-thinkpad-l14-gen-4        | kept      | One L14 Gen 4 title. Also shown: L14 Gen 5, L14 Gen 2, L14 Gen 1, L14 Gen 3                                                                                                          |
| lenovo-thinkpad-l14-gen-5        | kept      | Several L14 Gen 5 titles. Also shown: L14 Gen 4, L14 Gen 1, L14 Gen 2, L14 Gen 3                                                                                                     |
| lenovo-thinkpad-l13-gen-3        | kept      | One L13 Gen 3 title. Also shown: L13 Gen 4, L13 Gen 2, L13 Yoga Gen 2, L13 2-in-1 Gen 5, L13 Gen 5, L13, L13 Yoga Gen 3, L13 Yoga Gen 1                                              |
| lenovo-thinkpad-l13-gen-4        | kept      | Several L13 Gen 4 titles. Also shown: L13 Gen 5, L13 Gen 2, L13 Yoga Gen 2, L13 Gen 3, L13, L13 Yoga Gen 4, L13 2-in-1 Gen 5                                                         |
| lenovo-thinkpad-l16-gen-1        | kept      | One L16 Gen 1 title. Also shown: —                                                                                                                                                   |
| lenovo-thinkpad-e14-gen-4        | kept      | Several E14 Gen 4 titles. Also shown: E14 Gen 5, E14, E14 Gen 2, E14 Gen 3                                                                                                           |
| lenovo-thinkpad-e14-gen-5        | kept      | Several E14 Gen 5 titles. Also shown: E14, E14 Gen 4, E14 Gen 3, E14 Gen 2                                                                                                           |
| lenovo-thinkpad-e14-gen-6        | not found | Also shown: E14 Gen 5, E14, E14 Gen 4, E14 Gen 2, E14 Gen 3                                                                                                                          |
| lenovo-thinkpad-e16-gen-1        | kept      | Several E16 Gen 1 titles. Also shown: E16 Gen 2, E16 Gen 3                                                                                                                           |
| lenovo-thinkpad-e16-gen-2        | kept      | Several E16 Gen 2 titles. Also shown: E16 Gen 1, E16 Gen 3                                                                                                                           |
| lenovo-thinkpad-p14s-gen-3       | not found | Also shown: P14s Gen 2, P14s Gen 1                                                                                                                                                   |
| lenovo-thinkpad-p14s-gen-4       | not found | Also shown: P14s Gen 2, P14s Gen 1                                                                                                                                                   |
| lenovo-thinkpad-p14s-gen-5       | not found | Also shown: P14s Gen 1, P14s Gen 2                                                                                                                                                   |
| lenovo-thinkpad-p16s-gen-1       | kept      | Several P16s Gen 1 titles. Also shown: P16s Gen 2                                                                                                                                    |
| lenovo-thinkpad-p16s-gen-2       | kept      | Several P16s Gen 2 titles. Also shown: P16s Gen 1                                                                                                                                    |
| lenovo-thinkpad-p16s-gen-3       | not found | Also shown: P16s Gen 1, P16s Gen 2                                                                                                                                                   |
| lenovo-thinkpad-p1-gen-5         | kept      | Several P1 Gen 5 titles. Also shown: P1 Gen 4, P1 Gen 6, P1 Gen 3, P16, P1 Gen 2, P16 Gen 2, P17 Gen 1, P16v Gen 1                                                                   |
| lenovo-thinkpad-p1-gen-6         | kept      | One P1 Gen 6 title. Also shown: P1 Gen 5, P1 Gen 4, P1 Gen 2, P1 Gen 3, P16, P16 Gen 2, P15 Gen 2                                                                                    |
| lenovo-thinkpad-p1-gen-7         | not found | Also shown: P1 Gen 6, P1 Gen 5, P1 Gen 3, P1 Gen 4, P1 Gen 2, P16, P16 Gen 2, P17 Gen 1, P16v Gen 1, P15v Gen 1                                                                      |
| lenovo-thinkpad-p16-gen-1        | not found | No title says Gen 1/G1; three say only "P16" with no generation and were not counted. Also shown: P16 Gen 2, P16v Gen 1, P16s Gen 1, P16s Gen 2                                      |
| lenovo-thinkpad-p16-gen-2        | kept      | One P16 Gen 2 title. Also shown: P16, P16s Gen 2, P16v Gen 1, P16s Gen 1                                                                                                             |

Notes: the X1 Carbon Gen 10 search also listed one card as "X1 Kulstof G10",
refurbed's Danish rendering of Carbon, counted as the same model. The
X1 2-in-1 Gen 9 search showed no title named 2-in-1 at all.

## Re-checking

Listings change. Before the section goes live, and whenever `checkedOn` is
old, run the same searches again. A blocked retailer can be added once it can
be reached without working around its protection, for example through an
affiliate or product API it offers.
