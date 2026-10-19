import type { Metadata } from "next";
import PracticalGuides from "@/components/practical/PracticalGuides";
import { practicalGuides } from "@/lib/practical-guides";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaSection from "@/components/CtaSection";
import { VidenClusterPlate } from "@/components/VidenPlate";
import GuidePanel, { GuidePanelStyles, needsPanelChrome } from "@/components/GuidePanel";
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

      {/* One stylesheet for all eight guide panels. Rendered here rather than
          inside each panel: eight identical copies of the same keyframes is
          thirty kilobytes of HTML saying one thing eight times. */}
      {guides.some((guide) => needsPanelChrome(guide.slug, lang)) && <GuidePanelStyles />}

      <section className="border-b border-white/10 bg-brand-950 py-8 sm:py-12">
        <Container>
          <Breadcrumbs lang={lang} trail={[{ name: c.crumb, href: "/vejledninger" }]} />
          <p className="eyebrow mt-6 text-brand-300">{c.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display t-h1 font-extrabold tracking-display text-paper">
            {c.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-paper/85">
            {lang === "da"
              ? "Find et konkret svar, forstå din computer, og vælg dit næste skridt."
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

      {/* The index: four plates in a folder. Each is a real link to the anchor
          its section carries, which is also what an article links back to. */}
      <section id="artikler" className="scroll-mt-28 border-b border-white/10 py-10 sm:py-20">
        <Container>
          <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
            {c.indexTitle}
          </h2>
          <nav aria-label={c.jump}>
            {/* Four cards, not four cells.
             *
             * This was a `gap-px` grid inside a bordered box — the trick where
             * the container's background shows through one-pixel gaps to draw
             * the rules. It is cheap to write and it reads as a spreadsheet:
             * four compartments of one table, every rule the same weight, no
             * card with an edge of its own. Separate plates on a real gap read
             * as four things you can pick up, which is what a jump list is.
             */}
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {groups.map(({ cluster, articles }, i) => (
                <li key={cluster.id}>
                  <a
                    href={`#${cluster.anchor}`}
                    /* The picture runs to the card's own edge. Inset inside
                       the padding it was a framed rectangle sitting inside a
                       framed rectangle, and the eye counts both. */
                    className="plate plate-lift group flex h-full flex-col overflow-hidden"
                  >
                    {/*
                     * The drawing and the description are for a wide screen.
                     *
                     * On a phone this index sat directly above the same four
                     * topics as full sections, so four illustrated cards with
                     * the same names and the same descriptions were eight
                     * hundred pixels the reader scrolled past to reach a copy
                     * of what they had just read. What is left is a jump list,
                     * which is the one thing the index does that the sections
                     * below cannot. The drawing carried no `hidden` and was on
                     * the phone after all, four 250px pictures in a column;
                     * now the four names sit two by two in one screen.
                     */}
                    <VidenClusterPlate
                      cluster={cluster.id}
                      index={String(i + 1).padStart(2, "0")}
                      className="plate-well hidden transition-opacity group-hover:opacity-100 sm:block sm:opacity-90"
                    />
                    <div className="flex flex-1 flex-col px-5 py-4 sm:p-5">
                      <h3 className="text-balance font-display text-base font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:text-lg">
                        {cluster.name[lang]}
                      </h3>
                      <p className="mt-2 hidden flex-1 text-sm leading-[1.6] text-paper/65 sm:block">
                        {cluster.description[lang]}
                      </p>
                      {/* On its own rule at the foot of the card, so four cards
                          with descriptions of four different lengths still end
                          on one line across the row. The rule fades out rather
                          than running the full width at one value — a hairline
                          that stops dead is the loudest thing on a quiet
                          card. */}
                      <p className="label relative mt-2 text-paper/65 sm:mt-5 sm:pt-4 sm:before:absolute sm:before:inset-x-0 sm:before:top-0 sm:before:h-px sm:before:bg-gradient-to-r sm:before:from-white/20 sm:before:to-transparent">
                        {articles.length} {articles.length === 1 ? c.article : c.articles}
                      </p>
                    </div>
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
             * A reading column, not the full page.
             *
             * The rows ran the whole container while the text was set to a
             * readable measure, so every row ended with four hundred pixels of
             * nothing before the minutes. The index above stays full width —
             * it is a grid of four and wants the room — and everything meant to
             * be read sits in one narrower column beneath it.
             */}
            {/* flex flex-col: a list of rows, not a list of text. The
                reading measure in globals.css caps the li of any list that is
                not a grid or a flex at 34em, and that cap squeezed each row —
                picture and all — into 544px, so the titles broke after every
                word. */}
            {/* Two columns from 1680 px. At 1920 the container is about
                1600 px wide and one 1024 px reading column left a third of
                every topic empty; two rows side by side still keep each row's
                text to a reading measure. The hairlines go there, because a
                rule under one cell of a grid row reads as a table. */}
            <ol className="flex max-w-5xl flex-col min-[1680px]:grid min-[1680px]:max-w-none min-[1680px]:grid-cols-2 min-[1680px]:gap-x-12 min-[1680px]:gap-y-2">
              {articles.map((guide, index) => (
                <li
                  key={guide.slug}
                  className="border-b border-white/[0.08] last:border-b-0 min-[1680px]:border-b-0"
                >
                  {/*
                   * No number on the guide.
                   *
                   * The section above already opens with one, and a second
                   * count in the same face directly beneath it read as a
                   * continuation of the first — the file said as much before
                   * this layout was rewritten, and the rewrite reintroduced
                   * exactly what the note warned about. The list is ordered in
                   * the markup, which is where that belongs.
                   */}
                  <Link
                    href={localePath(`/vejledninger/${guide.slug}`, lang)}
                    /* The left edge is the affordance at rest: a rule that is
                       there but unlit until the row is pointed at, which is
                       what tells a flat list of headings that it is a list of
                       links. */
                    /* The negative margin has to match the gutter it is cancelling.
                       Container is px-4 on a phone and px-6 from sm, so -mx-5
                       pulled 20px out of a 16px inset and the whole page
                       scrolled 4px sideways — measured: scrollWidth 394 in a
                       390 viewport. */
                    className="group relative -mx-4 flex flex-col gap-5 py-7 pl-4 pr-4 transition-colors before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gradient-to-b before:from-brand-400 before:to-brand-400/0 before:opacity-0 before:transition-opacity hover:bg-white/[0.03] hover:before:opacity-100 sm:-mx-5 sm:flex-row sm:items-center sm:gap-7 sm:py-7 sm:pl-5 sm:pr-5"
                  >
                    {/*
                     * The guide's own panel.
                     *
                     * The section had pictures of its four topics and none of
                     * its eight guides, so three articles under "Levetid og
                     * udskiftning" shared one illustration and the list itself
                     * had nothing to recognise a row by but its title.
                     *
                     * Beside the title, not above it. Stacked full width it
                     * was 700x470 in a 1280 container, so three links came to
                     * 2,900px of section — a list you scroll for three screens
                     * to read three lines, in a column using 55% of the page
                     * with the rest empty. That is what "the site looks zoomed
                     * in" means when it stops being a feeling.
                     *
                     * 320px is the size to land on. An earlier attempt used a
                     * 124px thumbnail and at that size a drawing holds one
                     * shape and nothing else — no reading, no label, no light.
                     * At 320 it is still a panel, and the row is a row.
                     *
                     * Fixed 3:2 box, so nothing shifts as it paints.
                     */}
                    <GuidePanel
                      slug={guide.slug}
                      lang={lang}
                      priority={groupIndex === 0 && index === 0}
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 100vw"
                      className="plate-well aspect-[3/2] w-full shrink-0 overflow-hidden sm:w-[17.5rem] lg:w-[20rem]"
                    />

                    {/* flex-1 and min-w-0 on this block, not only on the
                        title inside it: with only the inner one set, its basis
                        of 0 made this block's intrinsic width its longest
                        word, and from sm the title broke after every word in
                        a hundred-pixel column beside the picture. */}
                    <div className="flex min-w-0 flex-1 flex-col gap-x-8 gap-y-2 sm:flex-row sm:items-baseline">
                      <div className="min-w-0 flex-1">
                        <h3 className="max-w-2xl font-display text-xl font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:text-[1.4375rem]">
                          {guide.title[lang]}
                        </h3>
                        {/* One measure for the whole block: the heading used to
                          run to the column edge while the summary stopped two
                          thirds of the way, which left a ragged right side and
                          a void before the minutes. */}
                        <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-7 text-paper/75">
                          {guide.summary[lang]}
                        </p>
                      </div>

                      {/* A duration reads as a duration: "7 min." in the same
                        case as everything else, not "7 MIN." letterspaced like
                        a category tag. */}
                      <span className="flex flex-none items-center gap-3.5 sm:w-24 sm:justify-end">
                        <span className="whitespace-nowrap text-sm tabular-nums text-paper/65">
                          {guide.readingMinutes} {c.readingSuffix}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 flex-none text-paper/65 transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-brand-300"
                          strokeWidth={2}
                        />
                      </span>
                    </div>
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
