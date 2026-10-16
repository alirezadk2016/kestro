import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import ArticleToc from "@/components/ArticleToc";
import AuthorByline from "@/components/AuthorByline";
import GuidePanel, { GuidePanelStyles, needsPanelChrome } from "@/components/GuidePanel";
import { guides, getGuide, getCluster } from "@/lib/guides";
import { teamMember } from "@/lib/company";
import { localePath, metaFor, langs, htmlLang, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema from "@/components/PageSchema";
import { buttonClass } from "@/components/Button";

/*
 * No dynamicParams override here, and that is the point.
 *
 * This segment used to set it to true so that an unknown slug reached the page
 * and the notFound() below could answer with the site's own 404 instead of
 * Next's built-in one. The premise was right and the mechanism does not work:
 * in Next 15.5.25 and 15.5.26 a notFound() thrown while rendering emits the boundary into
 * the streaming payload and never into the HTML, so the reply was a blank
 * document with a 404 on it. See the note in app/[lang]/layout.tsx for the
 * measurement and the three-file reproduction.
 *
 * Inheriting `dynamicParams = false` from that layout instead means an unknown
 * slug is refused by the router, which serves the prerendered app/not-found.tsx
 * — the same panel, complete in the first byte. generateStaticParams below
 * enumerates every real slug, so nothing that exists is refused.
 *
 * The notFound() calls in this file stay as the guard for a slug that is
 * enumerated but whose data has gone missing.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return langs.flatMap((lang) => guides.map((guide) => ({ lang, slug: guide.slug })));
}

const copy = {
  da: {
    breadcrumb: "Viden",
    readingSuffix: "min. læsning",
    updated: "Opdateret",
    forWhom: "Til",
    closingTitle: "Hvis du hellere vil have det gjort",
    next: "Videre herfra",
    sources: "Kilder",
    more: "Flere fra Viden",
    faq: "Spørgsmål, vi får om det her",
    contact: "Skriv til os",
  },
  en: {
    breadcrumb: "Knowledge",
    readingSuffix: "min read",
    updated: "Updated",
    forWhom: "For",
    closingTitle: "If you would rather have it done",
    next: "Where to go next",
    sources: "Sources",
    more: "More from Knowledge",
    faq: "Questions we get about this",
    contact: "Write to us",
  },
} satisfies Record<Lang, Record<string, string>>;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const guide = getGuide(params.slug);
  if (!guide) return {};

  return {
    title: guide.metaTitle[params.lang],
    description: guide.metaDescription[params.lang],
    ...metaFor(`/vejledninger/${guide.slug}`, params.lang),
  };
}

export default async function GuidePage(props: { params: Promise<{ lang: Lang; slug: string }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  /*
   * The next three guides, wrapping around the list.
   *
   * This used to be the first three that were not this one, which quietly
   * meant only the first four guides in the array were ever linked: adding a
   * seventh guide dropped samle-din-egen-pc from every "more guides" block and
   * took it under three inbound links, breaking step 3's rule 1. Rotating
   * gives every guide exactly three inbound links from this block however many
   * guides there are, and it stays deterministic, which a prerendered page
   * needs.
   */
  const index = guides.findIndex((g) => g.slug === guide.slug);
  const others = [1, 2, 3]
    .map((offset) => guides[(index + offset) % guides.length])
    .filter((g) => g.slug !== guide.slug);

  const cluster = getCluster(guide.cluster);
  /* Same-cluster neighbours, shown separately from the rotation above. The
     rotation is what guarantees every article three inbound links whatever the
     cluster sizes are; this block is the topical signal on top of it. Anything
     already in the rotation is dropped so the two lists never repeat. */
  const inCluster = guides.filter(
    (g) =>
      g.cluster === guide.cluster &&
      g.slug !== guide.slug &&
      !others.some((other) => other.slug === g.slug),
  );
  /* One reading list: the topic's own guides first, then the rotation. */
  const further = [...inCluster, ...others];

  /* One id per section, from the Danish heading so the two languages share an
     anchor and a link into the article survives a language switch. */
  const sectionId = (headingDa: string) =>
    headingDa
      .toLowerCase()
      .replace(/[æå]/g, "a")
      .replace(/ø/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48);

  const toc = guide.sections.map((section) => ({
    id: sectionId(section.heading.da),
    label: section.heading,
  }));

  const author = teamMember(guide.author);
  const pagePath = `/vejledninger/${guide.slug}`;
  const pageUrl = `${SITE_ORIGIN}${localePath(pagePath, lang)}`;
  const articleId = `${pageUrl}#article`;

  /* Article schema so the guide can win a rich result rather than a bare link. */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleId,
    headline: guide.title[lang],
    description: guide.metaDescription[lang],
    inLanguage: htmlLang[lang],
    dateModified: guide.updated,
    datePublished: guide.published ?? guide.updated,
    /* Article rich results want an image, and this is the one the article
       actually has: the same 1200×630 card the page already gives Open Graph
       and Twitter. Claiming a photograph the guide does not contain would win
       the same badge dishonestly. */
    image: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    /* A named person with a real role, from lib/company.ts. Organization said
       nothing a reader or a search engine could weigh. */
    author: {
      "@type": "Person",
      /* An @id, so the same person on eight articles is one entity rather
         than eight people who happen to share a name. The fragment is the
         team member's own anchor on /om-os, which is a page that actually
         exists and describes them — the id resolves to something. */
      "@id": `${SITE_ORIGIN}${localePath("/om-os", lang)}#${author.id}`,
      name: author.name,
      jobTitle: author.role[lang],
      url: `${SITE_ORIGIN}${localePath("/om-os", lang)}#${author.id}`,
      worksFor: { "@id": `${SITE_ORIGIN}/#organization` },
    },
    articleSection: cluster.name[lang],
    /* The same node the site-wide Organization block defines, by reference
       rather than by repeating a bare name. Without the @id these were two
       unrelated organisations that both happened to be called Kestro, and
       none of what the real one carries — sameAs, contact, area served —
       reached the article. */
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
    },
  };

  return (
    <>
      <PageSchema
        lang={lang}
        route="/vejledninger/[slug]"
        pagePath={pagePath}
        name={guide.title[lang]}
        description={guide.metaDescription[lang]}
        primaryEntityId={articleId}
        contentDates={{ published: guide.published ?? guide.updated, modified: guide.updated }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* The header carries depth by layering rather than by ornament: the mark
          sits behind the type on a wide screen and steps out of the way on a
          narrow one, where the words are the only thing worth the space. */}
      <section className="relative overflow-hidden border-b border-white/10 bg-brand-950 py-12 text-paper max-md:-mt-[65px] max-md:pt-[65px] sm:py-10 sm:py-20">
        {/* The guide's own panel, not its cluster's.
            Three articles sit in "Levetid og udskiftning" and three in "Køb,
            stand og afhændelse", so the cluster mark put the same drawing
            behind six of the eight headings. Same corner, same breakpoint —
            the only thing that changed is that it now says which guide this
            is, and is large enough to be read. */}
        {/* Only where a drawn panel is what renders: the three guides with
            supplied artwork show an image, which needs neither the keyframes
            nor the shared defs. */}
        {needsPanelChrome(guide.slug, lang) && <GuidePanelStyles />}
        {/*
         * Inside the frame, and fading rather than cut.
         *
         * This bled off the right at -right-16 so the drawing would run out of
         * the page. That works for a transparent line drawing and fails for a
         * rendered plate: the artwork carries its own frame in the pixels, so
         * the section's overflow-hidden sliced a border in half and the panel
         * read as a broken image rather than as a picture running off.
         *
         * Now it sits fully inside, and dissolves into the page on its left
         * with a mask instead of ending on a hard vertical edge. The mask also
         * does the work opacity used to: the part that passes behind the
         * heading is the part that is gone.
         *
         * xl rather than lg, because at 1024 a 30rem plate and a max-w-3xl
         * reading column want the same pixels and the column wins.
         */}
        {/* On a phone the same panel is the header's ground: in the flow,
            full width from under the glass bar, fading at its foot where the
            words' glass panel overlaps it. One element, so a drawn panel's
            ids are not repeated. From md to xl it is not shown, as before. */}
        <div className="under-bar pointer-events-none relative aspect-[3/2] w-full md:hidden xl:absolute xl:right-0 xl:top-1/2 xl:block xl:w-[32rem] xl:-translate-y-1/2 2xl:w-[38rem]">
          <GuidePanel
            slug={guide.slug}
            lang={lang}
            priority
            className="guide-plate h-full w-full xl:opacity-70"
          />
          {/* The bottom edge, softened by painting the section's own colour
              over it rather than by a second mask layer: two mask layers need
              mask-composite to intersect, and where that is not supported they
              union instead — which would remove the fade rather than add one.
              A gradient in the background colour cannot fail that way. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-950 to-transparent"
          />
        </div>

        <Container className="relative">
          <div className="glass-card relative z-10 max-w-3xl max-md:-mt-14">
            <Breadcrumbs
              lang={lang}
              trail={[
                { name: c.breadcrumb, href: "/vejledninger" },
                { name: guide.title[lang], href: `/vejledninger/${guide.slug}` },
              ]}
            />

            <p className="mt-6">
              <Link
                href={`${localePath("/vejledninger", lang)}#${cluster.anchor}`}
                /* No mark at this size: the drawing is a technical diagram and
                   it turns to mud below about 40px. The large one behind the
                   heading already says which cluster this is. */
                className="inline-flex min-h-[44px] items-center gap-2 eyebrow text-brand-300 transition hover:text-paper"
              >
                {cluster.name[lang]}
              </Link>
            </p>

            <h1 className="mt-3 text-balance font-display t-h1 font-extrabold tracking-display text-paper">
              {guide.title[lang]}
            </h1>

            {/* The answer, before the scroll. Someone who reads only this
                should still have got what they came for. */}
            <p className="mt-6 text-base leading-[1.65] text-paper/85 sm:text-lg sm:leading-[1.65]">
              {guide.tldr[lang]}
            </p>

            <AuthorByline
              authorId={guide.author}
              updated={guide.updated}
              readingMinutes={guide.readingMinutes}
              lang={lang}
            />
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          {/*
           * The article and its contents side by side from lg.
           *
           * The contents list sat in the hero, and the article below it was a
           * 768px column with the right half of a wide screen empty for the
           * whole length of the page. Now the list stands in that half and
           * stays in view while the article scrolls, which is what a contents
           * list is for on a page this long. It is one element: first in the
           * markup, so a phone gets it at the top of the article, and moved
           * to the right column by order on a wide screen.
           */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-14">
            <aside className="lg:order-2 lg:col-span-4">
              <div className="mb-10 lg:sticky lg:top-28 lg:mb-0">
                <ArticleToc items={toc} lang={lang} className="" />
              </div>
            </aside>
            <div className="max-w-3xl lg:order-1 lg:col-span-8">
              <p className="text-base leading-[1.65] sm:text-lg sm:leading-[1.65] text-paper/75">
                {guide.intro[lang]}
              </p>

              {guide.sections.map((section) => (
                <div
                  key={section.heading.da}
                  id={sectionId(section.heading.da)}
                  className="scroll-mt-24 border-t border-white/10 py-8 first:mt-10"
                >
                  <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                    {section.heading[lang]}
                  </h2>

                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.da}
                      className="mt-4 text-base leading-[1.75] sm:leading-[1.75] text-paper/75"
                    >
                      {paragraph[lang]}
                    </p>
                  ))}

                  {section.table && (
                    /* One table, two layouts. On a wide screen it is a table.
                       On a phone each row stacks, its header on top and every
                       cell under the name of its column: at 390px the table
                       was 544px in a box that scrolled sideways with no sign
                       that it did, and the column cut off was the answer.
                       The roles are explicit because Safari drops a table's
                       semantics once its display changes. */
                    <div className="mt-6 sm:overflow-x-auto">
                      <table
                        role="table"
                        className="w-full border-collapse text-left text-sm sm:min-w-[34rem]"
                      >
                        <caption className="sr-only">{section.table.caption[lang]}</caption>
                        <thead className="max-sm:sr-only">
                          <tr role="row" className="border-b border-white/20">
                            {section.table.head.map((cell) => (
                              <th
                                key={cell.da}
                                role="columnheader"
                                scope="col"
                                className="py-3 pr-5 align-bottom font-display text-sm font-bold text-paper last:pr-0"
                              >
                                {cell[lang]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="max-sm:block max-sm:border-t max-sm:border-white/20">
                          {section.table.rows.map((row) => (
                            <tr
                              key={row[0].da}
                              role="row"
                              className="border-b border-white/10 align-top max-sm:block max-sm:py-4"
                            >
                              <th
                                role="rowheader"
                                scope="row"
                                className="py-4 pr-5 font-semibold leading-6 text-paper/85 max-sm:block max-sm:p-0 max-sm:pb-2 max-sm:text-paper"
                              >
                                {row[0][lang]}
                              </th>
                              {row.slice(1).map((cell, i) => (
                                <td
                                  key={cell.da}
                                  role="cell"
                                  data-label={section.table?.head[i + 1]?.[lang] ?? ""}
                                  className="py-4 pr-5 leading-6 text-paper/75 last:pr-0 max-sm:grid max-sm:grid-cols-[6.5rem_1fr] max-sm:gap-x-3 max-sm:py-1 max-sm:pr-0 max-sm:before:font-medium max-sm:before:text-paper/65 max-sm:before:content-[attr(data-label)]"
                                >
                                  {cell[lang]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.list && (
                    <ul className="mt-6 space-y-3.5">
                      {section.list.map((item) => (
                        <li key={item.da} className="flex gap-3 text-base leading-7 text-paper/75">
                          <Check
                            aria-hidden="true"
                            className="mt-1.5 h-4 w-4 flex-none text-brand-300"
                            strokeWidth={2}
                          />
                          {item[lang]}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="plate mt-6 p-6 sm:p-8">
                <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                  {c.closingTitle}
                </h2>
                <p className="mt-3 text-base leading-[1.75] sm:leading-[1.75] text-paper/75">
                  {guide.closing[lang]}
                </p>
                <Link
                  href={localePath("/kontakt", lang)}
                  className={`${buttonClass("primary")} mt-6`}
                >
                  {c.contact}
                </Link>
              </div>

              {/* Where the claims can be checked. An outbound link to the body
                that actually decides a date is not leaked authority; it is the
                difference between a page that asserts and a page that cites. */}
              {guide.sources && guide.sources.length > 0 && (
                <div className="mt-10 border-t border-white/15 pt-8">
                  <p className="eyebrow text-brand-300">{c.sources}</p>
                  <ul className="mt-4 space-y-2">
                    {guide.sources.map((source) => (
                      <li key={source.href.da}>
                        <a
                          href={source.href[lang]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
                        >
                          {source.label[lang]}
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* The page that resolves what the guide raised. A guide that
                answers a question and then stops leaves the reader to find the
                commercial page on their own. */}
              {guide.related.length > 0 && (
                <div className="mt-10 border-t border-white/15 pt-8">
                  <p className="eyebrow text-brand-300">{c.next}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {guide.related.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={localePath(link.href, lang)}
                          className="plate-sm inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-semibold text-paper/85 transition hover:text-paper"
                        >
                          {link.label[lang]}
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {guide.faqs && guide.faqs.length > 0 && (
        <div className="border-t border-white/10">
          <Faq lang={lang} items={guide.faqs} title={{ da: copy.da.faq, en: copy.en.faq }} />
        </div>
      )}

      {/* One shelf of further reading: this topic's other guides first, then
          three from elsewhere in Viden. They were two sections — "Mere om
          <emne>" as a list, then "Flere fra Viden" as hairline rows — each
          with its own heading, one after the other. */}
      {further.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
          <Container>
            <h2 className="font-display t-h3 font-bold tracking-tight text-paper">{c.more}</h2>
            <ul className="rail mt-6 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {further.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={localePath(`/vejledninger/${other.slug}`, lang)}
                    className="plate plate-lift group flex h-full flex-col p-5"
                  >
                    {other.cluster === guide.cluster && (
                      <span className="label text-brand-300">{cluster.name[lang]}</span>
                    )}
                    <span className="mt-1.5 font-display text-base font-bold tracking-tight text-paper transition-colors group-hover:text-brand-300">
                      {other.title[lang]}
                    </span>
                    <span className="mt-1.5 text-sm leading-6 text-paper/75">
                      {other.summary[lang]}
                    </span>
                    <span className="flex-1" />
                    <span className="mt-4 text-sm tabular-nums text-paper/65">
                      {other.readingMinutes} min.
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* No closing band on a guide. The article already ends on its own
          offer of help ("Hvis du hellere vil have det gjort"), in context,
          and a second, generic one after the reading list said it again. */}
    </>
  );
}
