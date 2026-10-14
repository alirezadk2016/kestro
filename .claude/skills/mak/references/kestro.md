# kestro.dk — where SEO lives and how a change ships

## The trees

| Tree | URLs | Intent | Data |
| --- | --- | --- | --- |
| Front page | `/` | commercial: brugte og refurbished computere til virksomheder | `app/[lang]/layout.tsx` (`meta`) |
| Products | `/produkter`, `/produkter/<kategori>` | commercial | `lib/categories.ts` |
| Models | `/modeller`, `/modeller/<model>` | commercial, one model per page | `lib/models.ts` |
| Services | `/ydelser`, `/ydelser/<ydelse>`, `/flaadeloesninger` | commercial, B2B | `lib/services.ts`, page files |
| Repairs | `/reparation`, `/reparation/<job>` | commercial, B2B and private | `lib/repairs.ts` |
| Blog | `/vejledninger`, `/vejledninger/<guide>` | informational | `lib/guides.ts` (clusters + guides) |
| Trust and conversion | `/kvalitet`, `/priser`, `/tilbud`, `/tilbud-eksempel`, `/saelg-til-os`, `/kontakt`, `/om-os`, `/maskinen` | mixed | `app/[lang]/<route>/page.tsx` → `copy.da` / `copy.en` |
| Legal | `/handelsbetingelser`, `/privatlivspolitik` | — | page files |

English mirrors every page under `/en/…`. Its paths come from
`lib/routes.ts`, which must agree with `next.config.mjs`; the content gate
checks this.

## Where each field lives

- **Title and description**
  - Data-driven pages: `metaTitle` / `metaDescription` in `lib/*.ts`, each
    `{ da, en }`.
  - Static pages: the `copy` object at the top of the page file.
  - Front page: `meta` in `app/[lang]/layout.tsx`.
- **H1**
  - `name` for categories, models, services and repairs.
  - `title` for guides.
  - `copy.title` on static pages.
  - The hero H1 on the front page lives in `components/Hero.tsx`.
- **Guide primary keyword:** the `primaryKeyword` field in `lib/guides.ts`.
  It must be unique (content gate). `""` means "deliberately none".
- **Sitemap:** `app/sitemap.ts`. A new route goes in it in the same commit.
- **The keyword map:** `docs/seo-keyword-map.csv` and `.md`.
  - One row per keyword: intent, URL, primary or secondary, live title.
  - Volumes stay `unknown` until real data arrives.
- **The pillar sheet:** `docs/seo-pillar-cluster.csv`. Rebuild it with
  `scripts/pillar.py`.
- **Status against this skill:** `docs/seo-playbook.md`. It records what is
  checked, what is pending, and what needs the owner.

## Ship a change

1. **Start the site.** `npm run build`, then `npx next start -p 4411`.
   Before re-running verify, stop the server: verify brings its own on
   4173, and refuses a port that is already taken.
2. **Measure.** The quick way is `node .claude/skills/mak/scripts/run.mjs
   --out <scratchpad>/mak-run`, which runs everything below and ranks it.
   One by one: run `node .claude/skills/mak/scripts/audit.mjs
   http://127.0.0.1:4411 --out <scratchpad>/mak-audit.json`, then
   `python3 .claude/skills/mak/scripts/check-map.py --audit <that file>`.
3. **Draft.** Put the new snippets in a drafts JSON and run
   `node .claude/skills/mak/scripts/measure.mjs drafts.json`. Fix anything
   it flags.
4. **Edit the source fields** listed above, in both `da` and `en`. Replace
   exact strings. A title that is also a `name` (repairs) is replaced only
   inside `metaTitle`.
5. **Run `npm run verify`.** It must pass: content checks, build, browser
   checks and the security attack run.
6. **Commit** on `claude/nextjs-14-scaffold-qycd1n`, ending the message with
   the session's `Co-Authored-By` and `Claude-Session` trailers.
   - A commit that changes only titles and descriptions is not a content
     change. It carries `Page-Dates: skip`.
   - A change to an H1 or body text is a content change. No trailer.
7. **Push:** `git push -u origin claude/nextjs-14-scaffold-qycd1n`. Vercel
   deploys production from this branch.
8. **Close the loop.**
   - Rebuild the pillar sheet.
   - Update the live titles in the keyword map.
   - Update the status in `docs/seo-playbook.md`.
   - Report to the owner in Persian.

## Constraints

- **No invented numbers or claims.** No prices, delivery times, warranty
  period, customer counts or statistics. No claim that every device is
  tested. No universal claim about refurbished hardware.
- **Citations** come only from `lib/sources.ts`.
- **No page without a real answer.**
  - No city pages, because Kestro has no presence beyond Aarhus.
  - No "Aarhus" in the repair titles until the workshop address is confirmed
    on the page.
- **Canonical, hreflang, sitemap and internal links are preserved.**
  - Danish URLs never move.
  - Renaming a route needs the owner's yes and a redirect.
- **Search evidence.** `google.com` and the autocomplete endpoints are
  blocked here. Ask the owner for screenshots or a Search Console export,
  and say plainly when a decision waits on one.
- **This repository is public.** Course material, and anything personal in
  it, stays out: names, phone numbers, handles, client data.
