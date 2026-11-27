import type { Metadata } from "next";
import PracticalGuides from "@/components/practical/PracticalGuides";
import { practicalGuides } from "@/lib/practical-guides";
import Link from "next/link";

import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaSection from "@/components/CtaSection";
import { guides, clusters } from "@/lib/guides";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema from "@/components/PageSchema";

/* Existing article URLs and cluster anchors stay stable. Practical tasks
 * appear first; the editorial library remains below them. */

const copy = {
  da: {
    metaTitle: "Artikler og guides: bærbare, RAM og Windows | Kestro",
    metaDescription:
      "Artikler og guides til dit næste køb eller en opgradering: RAM, SSD, Windows og refurbished eller nyt. Find svar, kilder og tips til at vælge rigtigt.",
    eyebrow: "Kestro Viden",
    title: "Artikler og guides om computere",
    description:
      "Hvad skal du købe, hvad kan du opgradere, og hvad kan du gøre selv? Konkrete svar til private og virksomheder, med kilder og tydelige begrænsninger.",
    statGuides: "artikler og guides",
    statClusters: "emner",
    statUpdated: "senest opdateret",
    indexTitle: "Emner",
    jump: "Spring til",
    articles: "vejledninger",
    article: "vejledning",
    readingSuffix: "min.",
    read: "Læs vejledningen",
    crumb: "Viden",
    start: "Start med dit spørgsmål",
    editorial:
      "Kildebaserede artikler, udarbejdet med AI-assistance. Tekniske eksempler er ikke individuelle kompatibilitetsgarantier. Markedsartikler angiver dato og skelner mellem prognoser og aktuelle priser.",
  },
  en: {
    metaTitle: "Articles and guides: laptops, RAM and Windows | Kestro",
    metaDescription:
      "Articles and guides: RAM, SSD, Windows and refurbished or new laptops. Find the right fit for your needs, with clear tips, limits and links to sources.",
    eyebrow: "Kestro Knowledge",
    title: "Computer articles and guides",
    description:
      "What should you buy, what can you upgrade and what can you do yourself? Practical answers for individuals and companies, with sources and clear limits.",
    statGuides: "articles and guides",
    statClusters: "topics",
    statUpdated: "last updated",
    indexTitle: "Topics",
    jump: "Jump to",
    articles: "guides",
    article: "guide",
    readingSuffix: "min",
    read: "Read the guide",
    crumb: "Knowledge",
    start: "Start with your question",
    editorial:
      "Source-based articles prepared with AI assistance. Hardware examples are not individual compatibility guarantees. Market articles state their date and distinguish forecasts from current prices.",
  },
} satisfies Record<Lang, Record<string, string>>;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const c = copy[params.lang];
  const base = metaFor("/vejledninger", params.lang);
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...base,
    /* The section's Atom feed, announced here so a reader that is handed the
       index URL can find it without being told the address.
       Danish only: the feed carries the Danish articles, and announcing it
       from the English index would offer a subscriber a feed in a language
       they did not choose.
       Spread onto the alternates metaFor built rather than beside them: this
       key is part of the same object, and writing it as a sibling would drop
       the canonical and the language map. */
    alternates: {
      ...base.alternates,
      ...(params.lang === "da"
        ? { types: { "application/atom+xml": `${SITE_ORIGIN}/vejledninger/feed.xml` } }
        : {}),
    },
  };
}

export default async function VidenPage(props: { params: Promise<{ lang: Lang }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];

  /* Only clusters that have something in them. An empty heading on a hub is a
     promise the section has not kept yet. */
  const groups = clusters
    .map((cluster) => ({
      cluster,
      articles: guides.filter((guide) => guide.cluster === cluster.id),
    }))
    .filter((group) => group.articles.length > 0);

  const hubUrl = `${SITE_ORIGIN}${localePath("/vejledninger", lang)}`;
  const listId = `${hubUrl}#articles`;
  const articleList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": listId,
    name: c.title,
    numberOfItems: guides.length + practicalGuides.length,
    itemListElement: [...practicalGuides, ...groups.flatMap(({ articles }) => articles)].map(
      (guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title[lang],
        url: `${SITE_ORIGIN}${localePath(`/vejledninger/${guide.slug}`, lang)}`,
      }),
    ),
  };

  return (
    <>
      <PageSchema
        lang={lang}
        type="CollectionPage"
        route="/vejledninger"
        name={c.title}
        description={c.metaDescription}
        primaryEntityId={listId}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleList).replace(/</g, "\\u003c"),
        }}
      />

      <section className="border-b border-white/10 bg-brand-950 py-8 sm:py-12">
        <Container>
          <Breadcrumbs lang={lang} trail={[{ name: c.crumb, href: "/vejledninger" }]} />
          <p className="eyebrow mt-6 text-brand-300">{c.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display t-h1 font-extrabold tracking-display text-paper">
            {c.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-paper/85">
            {lang === "da"
              ? "Find et svar, forstå din computer, og vælg dit næste skridt."
              : "Find a practical answer, understand your computer and choose your next step."}
          </p>
          <nav
            aria-label={lang === "da" ? "Vælg indhold" : "Choose content"}
            className="mt-6 flex flex-wrap gap-3"
          >
            <a
              href="#praktiske-guides"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {lang === "da" ? "Praktiske guides" : "Practical guides"}
            </a>
            <a
              href="#artikler"
              className="inline-flex min-h-[44px] items-center rounded-lg border border-white/25 px-5 text-sm font-semibold text-paper hover:bg-white/10"
            >
              {lang === "da" ? "Artikler og emner" : "Articles and topics"}
            </a>
          </nav>
        </Container>
      </section>
      <PracticalGuides lang={lang} />

      {/* Compact navigation to the topic sections, without repeating their artwork and descriptions. */}
      <section id="artikler" className="scroll-mt-28 border-b border-white/10 py-8 sm:py-10">
        <Container>
          <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.indexTitle}
          </h2>
          <nav aria-label={c.jump}>
            <ul className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {groups.map(({ cluster, articles }) => (
                <li key={cluster.id}>
                  <a
                    href={"#" + cluster.anchor}
                    className="plate-sm inline-flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm text-paper/85 transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                  >
                    <span className="font-semibold">{cluster.name[lang]}</span>
                    <span className="text-xs tabular-nums text-paper/65">
                      {articles.length} {articles.length === 1 ? c.article : c.articles}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {groups.map(({ cluster, articles }, groupIndex) => (
        <section
          key={cluster.id}
          id={cluster.anchor}
          className="scroll-mt-20 border-b border-white/10 py-10 sm:py-20"
        >
          <Container>
            {/*
             * A band across the page, not a column beside the list.
             *
             * The topic used to sit in a fixed 20rem column with its guides in
             * the column beside it, which works at three guides and falls apart
             * at one: the last two topics have a single guide each, and each was
             * a full section of which two thirds was empty. A header that spans
             * the page and a list that spans the page reads the same at one
             * guide and at ten.
             *
             * The drawing is gone from here on purpose. It is in the index card
             * for this topic a screen above, and the same illustration twice on
             * one page reads as a template rather than a decision — so the index
             * identifies a topic by picture and the section states it in type.
             */}
            {/*
             * Number, name, description — down, not across.
             *
             * They were one wrapping flex row, and the description carried
             * w-full to force it onto its own line. It never did: flex-wrap
             * decides from an item's hypothetical size, which max-w-2xl had
             * already clamped to something that fitted, so a paragraph ended up
             * set as a caption against the right margin of the heading.
             */}
            <header className="max-w-5xl border-b border-white/20 pb-7 min-[1680px]:max-w-none">
              {/* Position in the folder, not the name of the folder. It read
                  "01 / EMNER" on every section — the label of the index above,
                  repeated four times, saying the same thing about four
                  different topics. A chapter marker says something. */}
              <p className="eyebrow text-paper/65">
                <span className="tabular-nums text-brand-300">
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="mx-2.5 text-paper/25">
                  /
                </span>
                <span className="tabular-nums">{String(groups.length).padStart(2, "0")}</span>
              </p>
              <h2 className="mt-3 text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                {cluster.name[lang]}
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-paper/75">
                {cluster.description[lang]}
              </p>
            </header>

            {/*
             * Panels, not rows (27 November 2026).
             *
             * Each row carried a 320px picture beside its title. The pictures were
             * AI-generated plates and renders, and they went: a laptop on this site
             * is a real one. Six articles show a real photograph on their own page;
             * here every article is a title, one sentence and its reading time.
             * Text rows split by hairlines read as a table, so they stand as panels,
             * two across from sm and three from xl.
             */}
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {articles.map((guide) => (
                <li key={guide.slug} className="flex">
                  <Link
                    href={localePath(`/vejledninger/${guide.slug}`, lang)}
                    className="plate plate-lift group flex w-full flex-col p-6"
                  >
                    <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300">
                      {guide.title[lang]}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-7 text-paper/75">
                      {guide.summary[lang]}
                    </p>
                    <span className="mt-auto pt-4 text-sm tabular-nums text-paper/65">
                      {guide.readingMinutes} {c.readingSuffix}
                    </span>
                    <span className="sr-only">{c.read}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      ))}

      {/* The guides end straight on the closing band. A "free advice" panel
          used to sit above it, saying "write to us" one screen before the band
          said it again, and the six sources every guide already cites were
          listed here a second time; each guide keeps its own. */}
      <CtaSection lang={lang} />
    </>
  );
}
