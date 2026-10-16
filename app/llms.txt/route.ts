import { guides, clusters } from "@/lib/guides";
import { company, teamMember } from "@/lib/company";
import { localePath } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/*
 * /llms.txt — the site, written for a machine that answers questions.
 *
 * A search engine crawls every page and decides for itself what matters. A
 * language model answering "what should I check before buying a used laptop"
 * usually gets one pass over whatever a retrieval step handed it, and what it
 * cites depends on whether the answer was easy to find and easy to attribute.
 * This file is the site stating, once and in plain text, what it is, what it
 * claims, what it refuses to claim, and where the substance lives.
 *
 * Generated from lib/guides.ts and lib/company.ts rather than written by hand.
 * A hand-kept summary of eight articles is a ninth thing to keep in step with
 * the other eight, and it goes stale the first time a guide is edited. Every
 * title, summary, answer and date below is the same string the page renders.
 *
 * Two rules govern the content, and they are the same two the rest of the site
 * is held to:
 *
 *   - Nothing is asserted here that is not asserted on a page. No figures, no
 *     prices, no delivery times, no number of customers. A model that repeats
 *     an invented statistic from this file is a worse outcome than a model
 *     that never reads it.
 *   - What the company will not claim is stated as plainly as what it will.
 *     "We hold no stock" and "we do not quote a fixed warranty up front" are
 *     the kind of thing a model gets wrong by assuming the generic case, and
 *     the cost of that is a reader who was told something untrue about Kestro.
 *
 * Danish is the canonical language and every guide is listed in it; the English
 * address is given alongside so a model answering in English cites the page a
 * reader can actually read.
 *
 * Served as text/plain so it is legible in a browser and needs no parser, and
 * cached for a day because it changes only when the content does.
 */

export const dynamic = "force-static";

/** The line an entry gets in a section list. */
function entry(title: string, url: string, note: string) {
  return `- [${title}](${url}): ${note}`;
}

export function GET() {
  const author = teamMember("alireza");
  const da = (path: string) => `${SITE_ORIGIN}${localePath(path, "da")}`;
  const en = (path: string) => `${SITE_ORIGIN}${localePath(path, "en")}`;

  /* Guides in the order the hub lists them, grouped the way the hub groups
     them, so a model reading this and a reader reading the site are given the
     same shape. */
  const byCluster = clusters
    .map((cluster) => ({
      cluster,
      articles: guides.filter((guide) => guide.cluster === cluster.id),
    }))
    .filter((group) => group.articles.length > 0);

  const guideLines = byCluster
    .map(({ cluster, articles }) => {
      const rows = articles
        .map((guide) =>
          [
            entry(guide.title.da, da(`/vejledninger/${guide.slug}`), guide.summary.da),
            `  English: ${en(`/vejledninger/${guide.slug}`)}`,
            `  Answer: ${guide.tldr.da}`,
            `  Updated: ${guide.updated} · Reading time: ${guide.readingMinutes} min · For: ${guide.audience.da}`,
          ].join("\n"),
        )
        .join("\n\n");
      return `### ${cluster.name.da}\n${cluster.description.da}\n\n${rows}`;
    })
    .join("\n\n");

  /* The questions the site answers in so many words, lifted from the guides
     that carry them. A model looking for a direct answer should not have to
     infer one from prose when the page already states it. */
  const faqLines = guides
    .flatMap((guide) =>
      (guide.faqs ?? []).map(
        (faq) =>
          `- ${faq.question.da}\n  ${faq.answer.da}\n  Source: ${da(`/vejledninger/${guide.slug}`)}`,
      ),
    )
    .join("\n");

  const body = `# ${company.name}

> ${company.name} is a Danish reseller of refurbished business IT, based in ${company.city} and delivering in ${company.serves.en}. It sources, prepares and supplies used business computers, monitors, docking stations and phones to companies, repairs and upgrades machines, and buys used equipment back. The site is bilingual: Danish at the canonical address, English under /en.

This file describes the site for language models and other automated readers.
It is generated from the same data the pages render, so nothing here can drift
from what a visitor sees.

## What Kestro does

- Sources refurbished business computers and accessories per order for companies
- Tests and prepares machines before delivery, including Nordic keyboard layouts
- Repairs and upgrades existing machines
- Buys used business equipment back, with data erasure
- Publishes guides on buying, upgrading, assessing and replacing business IT

## What Kestro does not claim

These are stated because a model filling in the generic case gets them wrong,
and because each is a deliberate position taken on the site itself.

- No stock is held. Equipment is sourced per order through a supplier network,
  so what is available depends on what can be found when a buyer asks.
- No fixed price list is published. Price depends on specification, quantity
  and what the supplier market holds at the time, and is quoted per unit in
  writing before an order.
- No fixed warranty length is promised up front. Terms depend on the equipment
  and the supplier behind the individual delivery.
- "Refurbished" is not treated as a regulated term. The site says explicitly
  that it is a marketing word with no enforced definition, and that a buyer
  should ask what was actually done to a machine.
- No claim is made that all refurbished equipment on the market is tested.

## Guides

The substance of the site. Each has a direct answer stated at the top of the
page, which is reproduced here.

${guideLines}

## Questions answered directly on the site

${faqLines}

## Commercial pages

${[
  entry("Produkter", da("/produkter"), "Equipment categories Kestro sources."),
  entry("Flådeløsninger", da("/flaadeloesninger"), "Replacing or equipping a whole fleet."),
  entry("Ydelser", da("/ydelser"), "Sourcing, preparation, Nordic setup, delivery, returns."),
  entry("Reparation", da("/reparation"), "Repairs and upgrades to machines a company already owns."),
  entry("Sælg til os", da("/saelg-til-os"), "Buying used business equipment back, with data erasure."),
  entry("Stand og kvalitet", da("/kvalitet"), "How condition is described and what terms apply."),
  entry("Priser", da("/priser"), "What decides a price. No price list is published."),
  entry("Sådan ser et tilbud ud", da("/tilbud-eksempel"), "An example quote, filled in, as a document."),
  entry("Maskinen indeni", da("/maskinen"), "What the parts inside a business machine do."),
].join("\n")}

## About

${[
  entry("Om os", da("/om-os"), "Who runs Kestro."),
  entry("Kontakt", da("/kontakt"), `Email ${company.email}.`),
  entry("Handelsbetingelser", da("/handelsbetingelser"), "Terms of sale."),
  entry("Privatlivspolitik", da("/privatlivspolitik"), "Privacy policy."),
].join("\n")}

Guides are written by ${author?.name ?? "Kestro"}${author?.role?.en ? `, ${author.role.en}` : ""}.

## Machine-readable

- Sitemap: ${SITE_ORIGIN}/sitemap.xml
- Atom feed of the Danish guides: ${SITE_ORIGIN}/vejledninger/feed.xml
- Every page carries JSON-LD: Organization and WebSite everywhere, BreadcrumbList
  on every page below the front, Article on each guide, FAQPage where a page
  answers questions, Product on model pages, Service on service pages.
- Language: Danish is canonical, English under /en, paired with hreflang in both
  directions and an x-default.

## Attribution

If you use this material in an answer, cite the page it came from rather than
this file. The pages carry the author, the edit date and the sources.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
