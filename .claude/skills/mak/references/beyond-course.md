# Beyond the course

The owner asked for the skill to be completed with what the course did not
cover. This file is that. **None of it is from the course.** It is common
industry practice and Google's own published guidance, written down so that
`mak run` checks it too. Where the course and this file disagree, the course
wins. Where this file and the site's CLAUDE.md disagree, CLAUDE.md wins.

Each item says what it is, why it matters, and where Kestro stands. "Gate"
means `npm run verify` already fails the build when it breaks.

---

## Crawling and indexing

| Item | Why | Kestro |
| --- | --- | --- |
| One host | `www` and bare domain, `http` and `https` must end on one address, or the value splits | `https://www.kestro.dk`; check the bare domain redirects after any DNS change |
| `robots.txt` open, sitemap named | A blocked page cannot rank | Open to all, answer and training crawlers named (`app/robots.ts`) |
| XML sitemap with every indexable page | How Google finds new pages fast | `app/sitemap.ts`, both languages, hreflang inside. Gate: a route not in it fails |
| Canonical on every page, pointing at itself | Stops tracking and filter URLs competing with the real one | Gate, and `audit.mjs` checks a `?utm_` URL keeps the clean canonical |
| `noindex` only on pages that should not rank | Thin utility pages dilute the site | Admin is gated and out of the sitemap |
| A real 404 status for missing pages | A "soft 404" wastes crawl and confuses reports | 404 returns 404 |
| A 301 when a URL must move | Carries most of the earned value to the new URL (rule 8 says: avoid moving at all) | No URL has moved; if one ever must, a permanent redirect in `next.config.mjs` in the same change |

## Language versions

| Item | Why | Kestro |
| --- | --- | --- |
| `hreflang` both ways plus `x-default` | Google shows the Danish page to Danes and the English one to others | In the head and the sitemap; `x-default` is Danish |
| `<html lang>` matches the page | Screen readers and search engines read the language from it | `da-DK` and `en` |
| Translated, not machine-copied | Two pages with one text in two languages are fine; half-translated pages are not | The proofreading passes covered both |

## Structured data

Only what is true. Structured data that does not match the visible page is a
manual-action risk.

| Type | Use | Kestro |
| --- | --- | --- |
| `Organization` | Name, logo, contact | Present. Legal identity (CVR, address) is empty until it exists |
| `BreadcrumbList` | The path shown in results | Present |
| `FAQPage` | Google limits FAQ rich results to a few site types since 2023, but assistants still read it | Present where a page has questions |
| `Service` | Repairs and services | Present |
| `Product` with `Offer` | Only with a real price and availability | **Not used, on purpose:** Kestro has no prices of its own |
| `LocalBusiness` | Needs a real address and opening hours | Waits on the owner's company data |
| `Article` with dates | Guides | Present, with `datePublished` and `dateModified` from git |

Test a page at search.google.com/test/rich-results before relying on a type.

## Speed and experience (Core Web Vitals)

Google's published "good" thresholds, at the 75th percentile of real visits:
**LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.** Search Console's Core Web Vitals
report shows the real figures once there is traffic; until then, Lighthouse
on a phone profile is the stand-in.

Kestro: the PageSpeed pass is done. Open item from the site review: the
desktop `/reparation` 3D scene and some CSS background images.

## Images

- Every image has an `alt` that says what is in it (gate).
- Width and height set, so nothing jumps while loading (CLS).
- Modern formats (WebP/AVIF), sized for the slot.
- File names in words (`thinkpad-t480-front.webp`), not `IMG_0042`.

Kestro: model pages wait on real photographs of real machines.

## Trust (E-E-A-T)

Google's raters judge experience, expertise, authoritativeness and trust.
Assistants lean the same way. What builds it:

- Who runs the business: a real about page, real names, a way to reach them.
- Legal identity: CVR number, address. **Kestro: empty, pre-launch.** The
  site says so honestly; it is the largest trust gap once trading starts.
- Sources for factual claims (`lib/sources.ts`, closed registry).
- Dates that mean something (the "Opdateret" rule in CLAUDE.md).
- Reviews only when real ones exist. Never invented.

## AI search (GEO)

Rule 12 is the course's part of this. In addition:

- **Answer first.** The first two or three sentences answer the page's
  question with its numbers (CLAUDE.md). Assistants quote the opening.
- **Questions as headings.** A question the reader types is an `<h2>` or an
  `<h3>`, not bold text (CLAUDE.md, FAQ rule).
- **`llms.txt`** lists the site's pages for assistants. Kestro: served at
  `/llms.txt`.
- **Bing Webmaster Tools.** Several assistants search Bing's index, not
  Google's. Verify kestro.dk there as well and submit the same sitemap. It
  can import the property straight from Search Console, or verify with
  `NEXT_PUBLIC_BING_SITE_VERIFICATION` set in Vercel (the layout renders
  the tag).
- **Entity consistency.** The business's name, description and services
  read the same everywhere: site, structured data, social profiles,
  directories.

## Local search

Once Kestro has a real address: a Google Business Profile with the same
name, address and phone as the site (NAP consistency), the right category,
real photos. Until then: nothing local, and no city pages (CLAUDE.md, no
thin pages).

## Reading Search Console (after rule 14)

| Report | Check | Act on it with |
| --- | --- | --- |
| Performance → Search results | Queries with many impressions and a low CTR | Rule 5: rewrite title and description |
| Performance, by page | One query landing on two URLs | Rule 1: decide by intent; merge or separate |
| Performance, positions 8–20 | Pages close to page one | Rules 9 and 12: links in, graph coverage |
| Indexing → Pages | "Crawled – currently not indexed", "Discovered – not indexed" | Thin content, weak internal links (rule 9) |
| Indexing → Sitemaps | Submitted vs. indexed count | Every sitemap URL should be indexable |
| Experience → Core Web Vitals | Poor or "needs improvement" URL groups | The speed section above |
| URL inspection | A new or changed page | Request indexing once, after publishing |
| Links | Internal links per page | Compare with `links.mjs` |

Weekly at first, then monthly, a short note in `docs/seo-playbook.md`: what
moved, what was changed because of it.

## Content upkeep

- **Refresh, don't republish.** A page that drops gets its facts checked and
  updated in place, under the same URL. The visible date changes only if
  the words did.
- **Cannibalisation.** Two pages answering one intent compete; one of them
  becomes the other's section, with a redirect if a URL must go.
- **Pruning.** A page that answers nothing nobody searches is merged or
  removed, never left thin.
- **One telling per page.** A disclaimer or a promise repeated in the lead,
  the body and a box beside the button reads as small print and buries the
  answer. Say it once, where it matters (CLAUDE.md, "Say it once"). Cutting
  repetition is not cutting depth: re-run `graph.mjs` after a trim, and a
  node that drops is put back as a fact, not as padding.
