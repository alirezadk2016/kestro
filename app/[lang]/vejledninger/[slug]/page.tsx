import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CtaSection from "@/components/CtaSection";
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
    more: "Flere vejledninger",
    contact: "Skriv til os",
  },
  en: {
    breadcrumb: "Guides",
    readingSuffix: "min read",
    updated: "Updated",
    forWhom: "For",
    closingTitle: "If you would rather have it done",
    more: "More guides",
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

  const others = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-brand-950 py-16 text-paper sm:py-24">
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

            <p className="mt-8 text-lg leading-8 text-paper/70">{guide.intro[lang]}</p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            {guide.sections.map((section) => (
              <div key={section.heading.da} className="border-t border-white/10 py-8">
                <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
                  {section.heading[lang]}
                </h2>

                {section.body.map((paragraph) => (
                  <p key={paragraph.da} className="mt-4 text-base leading-8 text-paper/65">
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
              <p className="mt-3 text-base leading-8 text-paper/65">{guide.closing[lang]}</p>
              <Link
                href={localePath("/kontakt", lang)}
                className="mt-6 inline-flex min-h-[48px] items-center bg-brand-600 px-7 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700"
              >
                {c.contact}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-14 sm:py-24">
          <Container>
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {c.more}
              </h2>
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
