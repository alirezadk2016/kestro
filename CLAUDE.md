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
- **No universal claims about refurbished hardware,** and no claim that every
  device has been tested unless Kestro can actually guarantee it.
- Prices: the site carries none until real ones exist. Do not add one.

### Machine readability

- **A visible "Opdateret" date means the words changed.** It comes from git
  (`scripts/build/page-dates.mjs`). A commit that only changes how pages look
  carries a `Page-Dates: skip` trailer, so a styling pass does not stamp the
  whole site with today; pushed commits go in
  `scripts/build/page-dates-skip.txt`.
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

- **Text colour: nothing below `text-paper/65`.** White at 40% on the site's
  navy is 3.81:1 and at 30% it is 2.9:1, both under the 4.5 body text needs;
  /55 passed AA but a review on a phone called the small grey text under the
  cards hard to read, so the floor went up. The content gate fails the build
  on anything fainter. On the light sections, text is `text-ink-600` or
  darker — ink-500 on `#F3F4F6` is 4.4:1. `aria-hidden`
  decoration is exempt — a "/" between two crumbs is not text anybody reads,
  and forcing it up makes a separator louder than the words it separates.
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

- **Two light sections on the front page, on purpose.** The answer block and
  the written-quote section sit on `bg-paper-dim` (the brand board's
  #F3F4F6); everything else is navy. That is the page's rhythm — eight navy
  bands in a row read as one. A panel on a light section is `.sheet`, never
  `.plate`.
- **`.plate` is the panel.** Not `border border-white/10 bg-white/[0.04]`,
  which is a rectangle lit by nothing. `.plate-lift` is the clickable version,
  `.plate-sm` the control-size one, `.plate-well` the recess a picture sits
  in, `.plate-edge` for panels whose content covers their own background.
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
  one brand-300 accent on the part that carries the meaning.
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
