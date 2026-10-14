# kestro.dk

Danish/Norwegian B2B reseller of refurbished business IT. Next 15 App Router,
TypeScript strict, Tailwind, bilingual (`da` default, `en` under `/en`),
deployed on Vercel.

`npm run verify` is the gate: content checks, then `next build`, then a real
browser over every template measuring contrast, overflow and motion. Nothing
ships without it passing.

---

## SEO is part of every change, not a pass afterwards

This is a standing rule, not a task. Any change that touches a page, a
component that renders text, or a route obeys the list below. It is cheaper to
write it right than to have an audit find it.

**Use the `mak` skill (`.claude/skills/mak/`, "مک") for any keyword, title,
description, H1, category or new-page decision.** It holds the owner's SEO
method, taught lesson by lesson from their course:
- one page per search intent, with the results page deciding;
- categories cut the way buyers search;
- the blog tree kept apart from the product tree;
- per-page keyword research that leaves children's keywords alone;
- a measured title, description, URL and H1 for every page;
- URLs set once and never moved;
- internal links with varied anchors;
- a content structure and a knowledge graph per page;
- Search Console read from launch.

"Run mak" (`mak run`) applies all of it to the site; what the course did not
cover is in the skill's `references/beyond-course.md`.

It also carries the scripts that audit the live site against those rules.
`docs/seo-playbook.md` records where the site stands against them. When a
lesson is added, the keyword map (`docs/seo-keyword-map.md` / `.csv`) and the
playbook are checked against it in the same change.

### Structure

- **One `<h1>` per page.** Enforced in `scripts/verify/checks.mjs`.
- **No heading level skipped.** Same place.
- **Every page gets a `<title>`, a description and a canonical.** Same place.
- **A question the reader would type is a heading, not text.** An FAQ's
  question lives in an `<h3>` _inside_ the `<summary>`. Bare text in a
  `<summary>` is a control, not a heading, and an audit reading the outline
  finds nothing — which is exactly what happened and is why this is written
  down.

### Writing

- **Answer first.** The opening paragraph of a page answers the question the
  page is for, in two or three sentences, with the numbers in it. Context
  comes after. A reader skimming and a model quoting both take the first
  paragraph.
- **Concrete over vague.** A percentage, a date, a command, a threshold. If
  there is a real number, use it.
- **Never invent one.** No made-up statistics, prices, delivery times,
  response times, customers, case studies or guarantees. If the number is not
  known, the sentence does not get a number.
- **Never fabricate a source.** Citations come from the closed registry in
  `lib/sources.ts` — six verified entries, each with publisher, URL, publish
  date, access date and the claim it supports. A page cites one only where it
  genuinely leans on it. `FactNote` states the fact in the source's own words
  and links the primary document; `SourceList` lists them.
- **Say it once.** A notice — pre-launch, not an order, not our price, no
  stock — appears once per page, where it matters. /priser said "these are
  not our prices" five times and a model page's price box three times; that,
  more than any one sentence, is what made the site read like a newspaper.
- **A card is a title and one sentence; a step is a title and one or two.**
  Detail lives on the page the card links to. A section is a heading and at
  most a two-sentence lead.
- **No claims about demand.** "The model we are asked about most" is a
  customer statistic, and a project that is not trading yet has none.
- **No universal claims about refurbished hardware,** and no claim that every
  device has been tested unless Kestro can actually guarantee it.
- **Prices: Kestro has no selling prices yet.** The one exception is the
  owner's dated budget references (`lib/pricing.ts`: external retail prices,
  their source and the day they were read), shown on /priser and the model
  pages they belong to, each labelled as not Kestro's price. Do not add any
  other figure, and do not present one of these as Kestro's.

### Machine readability

- **A visible "Opdateret" date means the words changed.** It comes from git
  (`scripts/build/page-dates.mjs`). A commit that only changes how pages look
  carries a `Page-Dates: skip` trailer, so a styling pass does not stamp the
  whole site with today; pushed commits go in
  `scripts/build/page-dates-skip.txt`. Content means what the page says —
  its text, facts and answers — not its interface: a heading restyled, a
  section moved, a "write to us" link or a button label is not an update.
- **Dates a person reads, never the ISO string.** `formatDate(iso, lang)` in
  `lib/i18n.ts`. A raw `2026-09-02` on a customer-facing page is a tell, and
  it shipped twice before this line existed.
- **Legal links carry their registered relations** — `rel="privacy-policy"`
  and `rel="terms-of-service"` in `lib/nav.ts`. The Danish URLs contain
  neither English word, and auditors look for them. Do not "fix" this by
  renaming the routes: that breaks canonicals, hreflang and the sitemap.
  The rel alone did not satisfy the AITDK audit, so the Danish footer also
  links the real English versions ("På engelsk: Privacy policy · Terms of
  sale" in `components/Footer.tsx`). Keep that line.
- **Preserve canonical, hreflang, sitemap and the internal link structure.**
  A new route goes into `app/sitemap.ts` in the same change that creates it.
- `lib/routes.ts` and `next.config.mjs` must agree on every English path —
  the content gate fails the build if they drift.

### Accessibility, because it is scored with SEO

- **Text colour: nothing below `text-ink-600` on the light ground, nothing
  below `text-paper/65` on navy.** The site is white and light grey
  (`bg-paper-dim`, #F3F4F6); only the closing call-to-action band and the
  footer are navy. ink-500 is 4.8:1 on white but 4.4:1 on the grey bands,
  under the 4.5 body text needs, so the floor is ink-600 (7.6:1 and 6.9:1).
  On navy, white at 40% is 3.81:1; /55 passed AA but a review on a phone
  called the small grey text hard to read, so that floor went up to /65. The
  content gate fails the build on anything fainter on either ground; a
  placeholder may use ink-500. `aria-hidden` decoration is exempt — a "/"
  between two crumbs is not text anybody reads, and forcing it up makes a
  separator louder than the words it separates.
- **Every tap target is at least 44px.** Bare text links in navigation need
  `min-h-[44px] inline-flex items-center`.
- **A `<div>` inside a `<dl>` may contain only `<dt>` and `<dd>`.** Icons and
  marks go inside the `<dt>`.
- Every image has an `alt`, and the artwork matches what the alt says. If the
  picture changes, the alt changes with it — or the picture is wrong.

---

## Security

The admin panel is the only thing on this site worth attacking, and what is
behind it is every enquiry: names, companies, addresses, phone numbers, message
bodies.

- **Three gates, and a change may not remove one.** `middleware.ts` before the
  router chooses anything; `requireAdmin()` at the top of every page under
  `/admin` and a session check at the top of every `/api/admin` handler;
  `adminOnly()` as the **first statement** of every function in `lib/db.ts` that
  reads an enquiry or a visitor figure. The third is the one that survives a
  page somebody forgets to gate.
- **A layout is not a boundary.** `RSC: 1` with a `Next-Router-State-Tree`
  renders one segment and skips every layout above it. That was a live
  unauthenticated read of the whole inbox. Never put a control in a layout.
- **`npm run verify` attacks the build it just made.**
  `scripts/security/attack.mjs` runs after the browser checks and fails the
  gate with them. Add a case when you add a surface; never relax one to make it
  pass. The count is not written down here on purpose — it only goes up, and a
  number in a document is a thing that goes stale the first time somebody does
  the right thing.
- **A new POST endpoint gets `crossSitePost()`** from `lib/same-site.ts` unless
  there is a reason it must accept a cross-origin post.
- **`npm audit` is at zero and stays there.** `postcss` is pinned past Next's
  own via `overrides` so it does not need a second major upgrade to be clean.

---

## Design

- **Light, calm, Scandinavian.** The owner's verdict on the dark-navy site
  with glass, glow and tilting cards was "too dark and fancy" for a Danish
  B2B buyer, whose other suppliers are white pages with plain cards. So: the
  page is white, sections alternate white and `bg-paper-dim` so that two
  neighbours never share a ground, text is ink, the accent is brand-600/700,
  and the only navy is the closing band (`CtaSection`) and the footer under
  it. No glass, no glow, no grain, no 3D tilt, no pointer-following light; a
  clickable card says so with a blue ring and its prompt line, not motion.
  Do not bring a dark section back into the middle of a page.
- **One panel.** `.sheet`, `.plate` and `.forge` are the same white card
  with a hairline ring (globals.css); `.plate-lift` is the clickable one,
  `.plate-sm` the control-size one, `.plate-well` the frame a picture sits in,
  `.plate-edge` the ring as an overlay. Not `border border-ink-200 bg-white`
  hand-rolled per page.
- **A picture is framed, never the page's ground.** The hero's room and the
  interior pages' artwork sit in a `.plate-well` beside the words (after them
  on a phone). Text over a photograph, under a scrim or on glass, is gone and
  stays gone.
- **One type scale**: `t-display`, `t-h1`, `t-h2`, `t-h3` in
  `app/globals.css`. Do not add a new `text-[clamp(...)]`; there were eight of
  them once and the interior pages shouted louder than the front page.
- **A list of steps gets a spine; a list of parallel things gets plates.**
  Rows separated by a hairline read as a table, and that is the single most
  common way a section here has looked unfinished.
- **Every mark sits in `<MarkTile>`.** One container, three sizes (sm 36,
  md 44, lg 56). There were seven hand-rolled wrappers once and the set read
  as collected rather than drawn. New marks follow the language in
  `components/CraftMark.tsx`: 1.5 stroke, round caps, one `km-body` surface,
  one brand-600 accent on the part that carries the meaning. The tile is pale
  brand-50 with the mark in deep navy.
- **Design for 1920 too.** The container is about 1600px wide there. A
  section that is one `max-w-3xl` column on the left leaves half the screen
  empty, page after page; give it `split` (globals.css: heading left, the rest
  right, from lg) or a real second column. Text inside a card is not capped
  at 34em — the card is the measure.
- **Design for the phone.** Every graphic idea must exist at 390px. The
  process section had a spine on desktop and `hidden lg:flex`, so the whole
  argument of the section was invisible to most readers.

## Card artwork

`npm run build:cards` makes `public/cards/*.webp`. Two pipelines, one set:

- **cat-laptops** is a crop of `public/hero/scene.webp` (`scripts/build/cards/`).
- **cat-desktops, cat-monitors, cat-fleet, exploded, fleet-scene** are
  path-traced with Blender's Cycles in the hero photograph's own room — stone desk, the hero's blue-hour
  view in the window, warm key from the left (`scripts/build/cards-cycles/`).
  Needs the `bpy` wheel in `/opt/bpyenv` (install line at the top of its
  `render.mjs`); a full render is about seven minutes a card on four cores.
  They were rasterised by three.js until the row sat under the hero with one
  photograph and three renders, and the renders lost: not because of the
  models, but because a rasteriser gives no bounced light, no reflection of
  the window and no lens. That pipeline is gone; git history has it.

`scripts/build/check-cards.mjs` measures ratio, exposure, highlight warmth and
local contrast against `design/art-direction/cards-brief.md`. Read the brief
before changing them. View a Cycles render as 8-bit (the webp), never the
16-bit PNG: the image viewer here posterises 16-bit and it looks like denoiser
blotching when it is not.

## Git

Work on `claude/nextjs-14-scaffold-qycd1n`. `git push -u origin <branch>`.
No pull request unless asked.
