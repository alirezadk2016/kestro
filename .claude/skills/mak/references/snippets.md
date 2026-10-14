# Titles, descriptions, H1s — at Kestro

Rule 5 in practice. Measure every draft with `scripts/measure.mjs` before it
goes into the code. Nothing is right until it fits.

## Limits

| | Binding | Target | Why |
| --- | --- | --- | --- |
| Title | ≤ 580 px at 20px Arial | 50–60 characters | Google truncates by width; the course counts characters |
| Description | ≤ 920 px at 14px Arial | 145–158 characters | Course: 150–160. Danish runs wide, so 160 often overflows |
| H1 | exactly one | carries the primary keyword in natural form | Checked by `npm run verify` and `audit.mjs` |

SEO-check browser extensions flag a title over 65 characters and a
description over 170. Ours stay inside 60 and 160 by target, and inside the
pixel limits by rule, so a competitor's extension finds nothing to flag.

Every title and every description is unique across all 136 URLs, in both
languages. `audit.mjs` fails on a duplicate.

## Title recipe

**The words they type, then what they get, then `| Kestro`.**

- The primary keyword comes first, in the form people search ("Brugt …",
  "Batteriskift på bærbar"). The brand comes last.
- **The hook is something the page really has:**
  - "specs, fordele og ulemper" on model pages, which have "God til" and "Vær
    opmærksom på" sections;
  - "Pris, før vi går i gang", "dansk tastatur", "skriftligt tilbud".
- **For a symptom search, use the searcher's question:** "Computer starter
  ikke eller går ned?", "Varm og larmende bærbar?".
- **Pack same-intent variants, then the benefit** (the course's pattern:
  keyword, variants, a benefit in brackets). Kestro writes the benefit after
  a colon or dash rather than in brackets, and it is always one the page
  states. A variant that belongs to a child page or another intent stays
  out.
- **"Kestro" appears once.** Where it is already in the title (kontakt, om
  os), there is no suffix.

Live patterns:

| Page type | Danish | English |
| --- | --- | --- |
| Model | `Brugt <model>: specs, fordele og ulemper \| Kestro` | `Refurbished <model>: specs, pros and cons \| Kestro` |
| Category | `Brugte <kategori> til erhverv – <mærker> \| Kestro` | `Refurbished business <category> — <brands> \| Kestro` |
| Repair | `<job>: <what the page settles> \| Kestro` or `<symptom>? <job> \| Kestro` | same shape |
| Guide | `<the question or task>: <what you get> \| Kestro` | same |
| Hub | `<what's there, in the searcher's words> \| Kestro` | same |

If the model name is too long, drop "Lenovo": people type "thinkpad t480".

## Description recipe

**The first clause answers, with real facts. The last clause is what they
get.**

- **Facts the site states and may be used:**
  - Danish or Norwegian keyboard, physically swapped on imported machines.
  - Battery capacity measured in percent of new, stated per unit in the
    quote.
  - Condition per unit in writing; warranty terms in the quote.
  - Delivery in Denmark and Norway; a reply within one working day.
  - Storage media erased before resale; collection when buying back.
  - Repairs: a price before work starts; private customers welcome; no
    minimum order.
  - The model specs in `lib/models.ts`.
- **Never** a price, a delivery time, a warranty period, "every device
  tested", a customer count, or anything the page itself does not say.
- **Calls to action that are true:**
  - "Skriftligt tilbud med stand og batteri."
  - "Pris, før vi går i gang."
  - "Svar inden for én arbejdsdag."
  - "Vurdering, før I beslutter jer."
- **A real caveat sells,** because it shows the page is honest: "loddet RAM",
  "passer kun til visse ThinkPad-modeller".
- **The content gate rejects** a repair `metaDescription` identical to its
  `summary`.

## H1

- **One per page.** It may differ from the title. The title sells in the
  results; the H1 names the page for someone already on it.
- **The H1 should carry the primary keyword in natural form.**
  - Many H1s are the bare category name today ("Batteriskift"), and
    `audit.mjs` reports how many carry the primary.
  - Change H1s carefully. Each one is visible content, so the commit stamps
    the page's "Opdateret" date.
  - Each one feeds the hero layout at 390 px, so check it on a phone.

## Danish and English wording

- **"Brugt" and "refurbished".** Danish titles lead with *brugt*, and
  *refurbished* goes in the description or second position. English uses
  *refurbished*.
- **Dashes.** Danish uses the en dash with spaces ( – ); English uses the em
  dash ( — ). A range takes an unspaced en dash (Gen 6–8).
- **Addressing the reader.** Business pages use *I* (plural); repair pages
  use *du*, because private customers are welcome there.
- **Avoid wording nobody searches for:** "til erhverv" as a filler,
  "erhvervscomputere" stacked with "til virksomheder".
