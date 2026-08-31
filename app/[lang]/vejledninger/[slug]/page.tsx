import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";
import Container from "@/components/Container";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CtaSection from "@/components/CtaSection";
import Faq from "@/components/Faq";
import { guides, getGuide } from "@/lib/guides";
import { company } from "@/lib/company";
import { localePath, metaFor, langs, htmlLang, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

export function generateStaticParams() {
  return langs.flatMap((lang) => guides.map((guide) => ({ lang, slug: guide.slug })));
}

const copy = {
  da: {
    breadcrumb: "Vejledninger",
    readingSuffix: "min. læsning",
    updated: "Opdateret",
    forWhom: "Til",
    closingTitle: "Hvis du hellere vil have det gjort",
    next: "Videre herfra",
    sources: "Kilder",
    more: "Flere vejledninger",
    faq: "Spørgsmål, vi får om det her",
    contact: "Skriv til os",
  },
  en: {
    breadcrumb: "Guides",
    readingSuffix: "min read",
    updated: "Updated",
    forWhom: "For",
    closingTitle: "If you would rather have it done",
    next: "Where to go next",
    sources: "Sources",
    more: "More guides",
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

  /* Article schema so the guide can win a rich result rather than a bare link. */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title[lang],
    description: guide.metaDescription[lang],
    inLanguage: htmlLang[lang],
    dateModified: guide.updated,
    datePublished: guide.updated,
    author: { "@type": "Organization", name: company.name },
    publisher: { "@type": "Organization", name: company.name },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}${localePath(`/vejledninger/${guide.slug}`, lang)}`,
    },
  };

  const faqJsonLd = guide.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: htmlLang[lang],
        mainEntity: guide.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question[lang],
          acceptedAnswer: { "@type": "Answer", text: faq.answer[lang] },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <section className="bg-brand-950 py-16 text-paper sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <BreadcrumbSchema
              lang={lang}
              trail={[
                { name: c.breadcrumb, href: "/vejledninger" },
                { name: guide.title[lang], href: `/vejledninger/${guide.slug}` },
              ]}
            />
            <nav aria-label={c.breadcrumb} className="text-sm text-paper/50">
              <Link
                href={localePath("/vejledninger", lang)}
                className="inline-flex min-h-[44px] items-center transition hover:text-paper"
              >
                {c.breadcrumb}
              </Link>
            </nav>

            <h1 className="mt-4 text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-paper">
              {guide.title[lang]}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 label text-brand-300">
              <span>
                {c.forWhom} {guide.audience[lang].toLowerCase()}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {guide.readingMinutes} {c.readingSuffix}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {c.updated} {guide.updated}
              </span>
            </div>

            <p className="mt-8 text-base leading-7 sm:text-lg sm:leading-8 text-paper/70">
              {guide.intro[lang]}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            {guide.sections.map((section) => (
              <div key={section.heading.da} className="border-t border-white/10 py-8">
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

      <CtaSection lang={lang} />
    </>
  );
}
