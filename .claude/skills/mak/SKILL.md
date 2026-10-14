---
name: mak
description: "Mak (مک): the owner's SEO method for kestro.dk, built lesson by lesson from their SEO course. Search intent, read from the results page, decides how many pages a topic needs. Categories are cut the way buyers search, as a pillar cluster. Keyword research runs per page and leaves children's keywords alone. Every page gets a title, description and H1 measured to Google's pixel limits. Use it for ANY SEO work on this site: keywords / کلمه کلیدی / سئو, titles, meta descriptions, H1s, categories, new pages, blog topics, the keyword map, SERP snippets, click-through, pillar cluster, seed keywords, keyword pool, keyword research, competitor categories, Search Console data. Use it whenever the owner says mak, مک, /mak, \"apply mak\", \"سئو کن\", \"با مک\", or sends a new course lesson (audio, transcript, screenshots) to learn. Verbs: audit, apply, research, page, learn."
---

# Mak (مک)

The owner is taking an SEO course and teaching it to you lesson by lesson.
This skill is where that method lives, so every SEO decision on kestro.dk
follows it, in this session and in every later one. It grows with each
lesson. `references/lessons.md` shows which lessons are in.

Report to the owner in **Persian**. Site copy is Danish, mirrored in English.

## Verbs

| Say | What happens |
| --- | --- |
| `mak audit [scope]` | Read-only. Run the scripts and read the results against the method. Return a ranked list of what breaks which rule, with evidence. No edits. |
| `mak apply [scope]` | Audit, then fix what the method and the facts allow. Measure, run verify, commit, push, report. Scope is optional: a URL, a tree (`reparation`, `modeller`) or `all`. |
| `mak research <page or keyword>` | Rule 4 for one page. Collect variants, sort them into its own / children's / other intent, and update the keyword map rows. |
| `mak page <topic>` | Rules 1–3. Should this be a page, which tree and level, which primary keyword, and draft title, description and H1. Propose first. A new route needs the owner's yes. |
| `mak learn <material>` | Add a lesson. Follow `references/lessons.md`: strip personal data, write the rules in our words, check the site against them, record it. |

When the owner asks for SEO work without a verb, take the verb that fits.
"Fix the titles" is `apply`; "is this keyword worth a page?" is `page`.

## The method on one screen

Details and examples: `references/method.md`.

1. **One page per search intent, and the results page decides.** Same page
   one for two keywords means one page; different page ones mean separate
   pages. Videos and how-tos mean informational, which means the blog.
2. **Categories follow the buyer's first decision.**
   - A search that names no first choice gets a general category beside
     them.
   - A product may sit in many categories, cut by what people search by.
   - Group the pool's keywords and give each group a parent name ("by
     brand", "gifts").
   - A category exists only if the site has the products for it.
3. **The blog is its own tree, built after the product and service trees.**
   An informational search never sits on a commercial page. A repair business
   has several trees: services, error codes, manuals, videos.
4. **Keyword research is per page, after the structure is final.**
   - Take same-intent variants.
   - Leave children's keywords (brand, model, city) to the children.
   - Leave other intents ("in English", "book") out.
   - Harvest autocomplete by letter and by connecting word.
5. **Every row gets a title, description, URL and H1.**
   - Title: keyword first, then its same-intent variants and a true
     benefit; attractive, unique, 50–60 characters, and binding ≤ 580 px.
   - Description: natural keywords plus a call to action, unique, 150–160
     characters, and binding ≤ 920 px. Danish lands at about 145–158.
   - Preview it as a snippet (`measure.mjs`), and check the tags the way an
     SEO extension does: canonical = the page, charset first.
   - URL structure and the H2/H3 roles are the next session's subject.
6. **Seeds first, then the keyword pool, then the structure.**
   - Ask an AI assistant what buyers search for, and take its answers as
     seeds.
   - Run each seed through a keyword tool, exporting keyword, volume and
     difficulty.
   - Read the pillar cluster out of that pool.
7. **Pillars are the separate jobs people come for:** buy, have it done,
   repair, sell, learn, error codes. Build them in six steps:
   1. User needs.
   2. Keyword research.
   3. Hierarchy.
   4. Alignment with the products.
   5. Competitors.
   6. Continuous review.

The work runs 6 → 7 → 2 → 1 → 3 → 4 → 5, then review. The full order is in
`references/method.md`.

## Ground rules

These come from the site's CLAUDE.md. The course does not override them,
because the site's credibility rests on them.

- **No invented facts.**
  - Never invent a number, price, delivery time, warranty period, customer
    or statistic.
  - A description says only what its page says. The list of usable facts is
    in `references/snippets.md`.
- **Course examples are teaching material, not content.** That covers the
  appliance-repair firm, pet shop, syrups, cities and brands, and every
  phone number, name and Telegram handle in the material. Apply the
  principle, never the example. Nothing personal from the course is stored.
- **Evidence or "to check", never a guess.**
  - Page-one evidence has to be Danish. `google.com` is blocked here, and
    `WebSearch` is US-only.
  - Volumes stay `unknown` until the owner supplies Keyword Planner or
    Search Console data.
  - Where a decision needs evidence you do not have, say so and ask for it.
- **No page without a real answer.** No city pages, no thin facet pages.
- **Preserve what works.** Keep canonical, hreflang, sitemap and internal
  links. Danish URLs do not move.

## Workflow: audit and apply

Paths, files and the ship steps in full: `references/kestro.md`.

1. **Build and serve.**
   - `npm run build`, then `npx next start -p 4411`, in the background.
   - Before verify, stop it. Verify serves on 4173 and refuses a taken port.
2. **Measure the live site.**
   - `node .claude/skills/mak/scripts/audit.mjs http://127.0.0.1:4411 --out <scratchpad>/mak-audit.json [--warn]`
     reads every sitemap page. It reports pixel and character lengths,
     duplicates, H1 count, the canonical and charset, skipped heading
     levels, URL shape, and whether the primary keyword is in the title, the
     H1 and the slug.
   - `python3 .claude/skills/mak/scripts/check-map.py --audit <scratchpad>/mak-audit.json`
     checks the keyword map:
     - two primaries on one URL;
     - one keyword on two rows;
     - a primary pointing at a page that does not exist;
     - rule 3: an informational keyword on a commercial page;
     - rule 4: a parent holding a child's keyword.
3. **Decide with the method,** rule by rule. Rank the findings:
   - first, what loses clicks or splits intent (wrong page, missing page,
     cannibalisation);
   - then what misses a rule (keyword not first, description short, H1
     without the keyword);
   - then polish.
4. **Draft and measure before editing.**
   - Write the snippets into a drafts JSON
     (`{"/url": {"t": …, "d": …}}`) and run
     `node .claude/skills/mak/scripts/measure.mjs drafts.json`.
   - Write both languages: Danish first, English mirroring it with English
     dashes.
5. **Edit the source fields,** run `npm run verify`, commit and push.
   - Meta-only commits carry `Page-Dates: skip`; H1 and body changes do not.
   - The commit trailers and branch are in `references/kestro.md`.
6. **Close the loop.**
   - Rebuild the pillar sheet:
     `python3 .claude/skills/mak/scripts/pillar.py --audit <scratchpad>/mak-audit.json`.
   - Refresh the live titles in `docs/seo-keyword-map.csv`.
   - Record the status in `docs/seo-playbook.md`.
   - Report in Persian:
     - what changed, with a few before → after rows;
     - what was measured;
     - what still waits, and on what.

## Reference files

| File | Read when |
| --- | --- |
| `references/method.md` | Any decision. The full rules, the lesson each came from, and how each applies at Kestro. |
| `references/snippets.md` | Writing a title, description or H1. The limits, the recipes, the facts you may use, and Danish wording. |
| `references/sheets.md` | Building or reading the pillar sheet, a keyword pool, the keyword map or the category trees. |
| `references/kestro.md` | Finding where a field lives, shipping a change, the constraints. |
| `references/lessons.md` | Learning a new lesson, or checking which lessons are in. |
