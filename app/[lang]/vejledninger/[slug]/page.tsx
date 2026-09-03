import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaSection from "@/components/CtaSection";
import Faq from "@/components/Faq";
import ArticleToc from "@/components/ArticleToc";
import AuthorByline from "@/components/AuthorByline";
import ClusterMark from "@/components/ClusterMark";
import { guides, getGuide, getCluster } from "@/lib/guides";
import { teamMember } from "@/lib/company";
import { localePath, metaFor, langs, htmlLang, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

export function generateStaticParams() {
  return langs.flatMap((lang) => guides.map((guide) => ({ lang, slug: guide.slug })));
}

const copy = {
  da: {
    breadcrumb: "Viden",
    inCluster: "Mere om",
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
    inCluster: "More on",
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

export function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};

  return {
    title: guide.metaTitle[params.lang],
    description: guide.metaDescription[params.lang],
    ...metaFor(`/vejledninger/${guide.slug}`, params.lang),
  };
}

export default function GuidePage({ params }: { params: { lang: Lang; slug: string } }) {
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

  /* Article schema so the guide can win a rich result rather than a bare link. */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title[lang],
    description: guide.metaDescription[lang],
    inLanguage: htmlLang[lang],
    dateModified: guide.updated,
    datePublished: guide.updated,
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
      "@id": `${SITE_ORIGIN}${localePath(`/vejledninger/${guide.slug}`, lang)}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* The header carries depth by layering rather than by ornament: the mark
          sits behind the type on a wide screen and steps out of the way on a
          narrow one, where the words are the only thing worth the space. */}
      <section className="relative overflow-hidden border-b border-white/10 bg-brand-950 py-12 text-paper sm:py-16 lg:py-20">
        <ClusterMark
          cluster={guide.cluster}
          className="pointer-events-none absolute -right-8 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 text-brand-300/10 lg:block"
        />
        <Container className="relative">
          <div className="max-w-3xl">
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
                className="inline-flex min-h-[36px] items-center gap-2 eyebrow text-brand-300 transition hover:text-paper"
              >
                {cluster.name[lang]}
              </Link>
            </p>

            <h1 className="mt-3 text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-paper">
              {guide.title[lang]}
            </h1>

            {/* The answer, before the scroll. Someone who reads only this
                should still have got what they came for. */}
            <p className="mt-6 border-l-2 border-brand-400 pl-5 text-base leading-7 text-paper/85 sm:text-lg sm:leading-8">
              {guide.tldr[lang]}
            </p>

            <AuthorByline
              authorId={guide.author}
              updated={guide.updated}
              readingMinutes={guide.readingMinutes}
              lang={lang}
            />

            <ArticleToc items={toc} lang={lang} />
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-base leading-7 sm:text-lg sm:leading-8 text-paper/70">
              {guide.intro[lang]}
            </p>

            {guide.sections.map((section) => (
              <div
                key={section.heading.da}
                id={sectionId(section.heading.da)}
                className="scroll-mt-24 border-t border-white/10 py-8 first:mt-10"
              >
                <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
                  {section.heading[lang]}
                </h2>

                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.da}
                    className="mt-4 text-base leading-7 sm:leading-8 text-paper/65"
                  >
                    {paragraph[lang]}
                  </p>
                ))}

                {section.table && (
                  /* A real table, in a container that scrolls on its own so a
                     narrow screen never makes the page scroll sideways. */
                  <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                    <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                      <caption className="sr-only">{section.table.caption[lang]}</caption>
                      <thead>
                        <tr className="border-b border-white/20">
                          {section.table.head.map((cell) => (
                            <th
                              key={cell.da}
                              scope="col"
                              className="py-3 pr-5 align-bottom font-display text-sm font-bold text-paper last:pr-0"
                            >
                              {cell[lang]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row[0].da} className="border-b border-white/10 align-top">
                            <th
                              scope="row"
                              className="py-4 pr-5 font-semibold leading-6 text-paper/80"
                            >
                              {row[0][lang]}
                            </th>
                            {row.slice(1).map((cell) => (
                              <td
                                key={cell.da}
                                className="py-4 pr-5 leading-6 text-paper/65 last:pr-0"
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
                      <li key={item.da} className="flex gap-3 text-base leading-7 text-paper/65">
                        <Check
                          className="mt-1.5 h-4 w-4 flex-shrink-0 text-brand-300"
                          strokeWidth={2.5}
                        />
                        {item[lang]}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="mt-6 border-l-2 border-brand-400 bg-white/5 p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold tracking-tight text-paper">
                {c.closingTitle}
              </h2>
              <p className="mt-3 text-base leading-7 sm:leading-8 text-paper/65">
                {guide.closing[lang]}
              </p>
              <Link
                href={localePath("/kontakt", lang)}
                className="mt-6 inline-flex min-h-[48px] items-center bg-brand-600 px-7 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700"
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
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
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
                        className="inline-flex min-h-[44px] items-center gap-2 border border-white/10 px-5 text-sm font-semibold text-paper/80 transition hover:border-white/25 hover:text-paper"
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
        </Container>
      </section>

      {inCluster.length > 0 && (
        <section className="border-t border-white/10 py-10 sm:py-16">
          <Container>
            <div className="max-w-3xl">
              <p className="eyebrow text-brand-300">
                {c.inCluster} {cluster.name[lang].toLowerCase()}
              </p>
              <ul className="mt-5 space-y-3">
                {inCluster.map((sibling) => (
                  <li key={sibling.slug}>
                    <Link
                      href={localePath(`/vejledninger/${sibling.slug}`, lang)}
                      className="group flex items-baseline gap-3 text-base font-semibold leading-7 text-paper transition-colors hover:text-brand-300"
                    >
                      <span aria-hidden="true" className="text-brand-300">
                        &rarr;
                      </span>
                      {sibling.title[lang]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {guide.faqs && guide.faqs.length > 0 && (
        <div className="border-t border-white/10">
          <Faq lang={lang} items={guide.faqs} title={{ da: copy.da.faq, en: copy.en.faq }} />
        </div>
      )}

      {others.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">{c.more}</h2>
              <ul className="mt-8 border-t border-white/15">
                {others.map((other) => (
                  <li key={other.slug} className="border-b border-white/10">
                    <Link
                      href={localePath(`/vejledninger/${other.slug}`, lang)}
                      className="group block py-5"
                    >
                      <span className="font-display text-base font-bold tracking-tight text-paper transition-colors group-hover:text-brand-300">
                        {other.title[lang]}
                      </span>
                      <span className="mt-1.5 block text-sm leading-6 text-paper/65">
                        {other.summary[lang]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* CTA weight follows the article's declared intent, not a layout choice.
          A guide to wiping a disk before selling it has no business carrying
          the same three-link sales block as one about replacing a fleet; the
          closing note above already offers the help, quietly. */}
      {guide.intent !== "informational" && <CtaSection lang={lang} />}
    </>
  );
}
