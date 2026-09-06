import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaSection from "@/components/CtaSection";
import { VidenHeroPlate, VidenClusterPlate } from "@/components/VidenPlate";
import GuidePanel, { GuidePanelStyles } from "@/components/GuidePanel";
import { guides, clusters } from "@/lib/guides";
import { localePath, metaFor, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/*
 * Viden — the hub.
 *
 * The section is called Viden; the URL stays /vejledninger. Decoupling the two
 * is deliberate: the name is what a reader remembers, the URL is what costs
 * redirects to change, and the hub owns no keyword in the map, so relabelling
 * costs nothing.
 *
 * Drawn as a plate folder rather than a blog index. Every graphic is inline
 * SVG and every jump link is a real <a href="#…"> to an id in the markup, so
 * the whole page — including the anchors an article's cluster eyebrow links
 * back to — works for a crawler and with JavaScript switched off. No card
 * grid, no filter state, no gradients, no shadow.
 */

const copy = {
  da: {
    metaTitle: "Viden om erhvervs-IT: køb og udskiftning | Kestro",
    metaDescription:
      "Vejledninger til virksomheder om at købe, vurdere og udskifte erhvervs-IT. Skrevet af os, der skaffer maskinerne – og ærlige om, hvornår I ikke skal købe.",
    eyebrow: "Kestro Viden",
    title: "Viden om erhvervs-IT",
    description:
      "Vi tjener penge på at skaffe og klargøre udstyr – ikke på at holde på viden. Her er det, vi selv ville have fortalt dig, hvis du ringede.",
    statGuides: "vejledninger",
    statClusters: "emner",
    statUpdated: "senest opdateret",
    indexTitle: "Emner",
    jump: "Spring til",
    articles: "vejledninger",
    article: "vejledning",
    readingSuffix: "min.",
    read: "Læs vejledningen",
    adviceTitle: "Gratis rådgivning",
    adviceBody:
      "Står du med et konkret spørgsmål, som ingen af vejledningerne svarer på, så skriv til os. Vi svarer på spørgsmål om reparation, opgradering og køb af brugt udstyr uden at sende en regning – også hvis svaret er, at du ikke skal købe noget af os.",
    adviceCta: "Stil et spørgsmål",
    crumb: "Viden",
  },
  en: {
    metaTitle: "Knowledge: buying and replacing business IT | Kestro",
    metaDescription:
      "Guides for companies on buying, assessing and replacing business IT. Written by the people who source the machines — and honest about when not to buy.",
    eyebrow: "Kestro Knowledge",
    title: "Knowledge for business IT",
    description:
      "We make our money sourcing and preparing equipment, not hoarding knowledge. This is what we would have told you if you had phoned.",
    statGuides: "guides",
    statClusters: "topics",
    statUpdated: "last updated",
    indexTitle: "Topics",
    jump: "Jump to",
    articles: "guides",
    article: "guide",
    readingSuffix: "min",
    read: "Read the guide",
    adviceTitle: "Free advice",
    adviceBody:
      "If you have a specific question none of the guides answers, write to us. We answer questions about repairs, upgrades and buying used equipment without sending an invoice — including when the answer is that you should not buy anything from us.",
    adviceCta: "Ask a question",
    crumb: "Knowledge",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
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

export default function VidenPage({ params }: { params: { lang: Lang } }) {
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

  /* Real numbers, read off the data. Nothing here is a claim. */
  const lastUpdated = guides
    .map((guide) => guide.updated)
    .sort()
    .at(-1);

  /* A date a person reads, not the ISO string the data is stored in. It sat
     beside "8" and "4" at the same display size, which made a ten-character
     machine timestamp the largest thing in the row. */
  const updatedLabel = lastUpdated
    ? new Date(`${lastUpdated}T00:00:00Z`).toLocaleDateString(lang === "da" ? "da-DK" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <>
      {/* One stylesheet for all eight guide panels. Rendered here rather than
          inside each panel: eight identical copies of the same keyframes is
          thirty kilobytes of HTML saying one thing eight times. */}
      <GuidePanelStyles />

      <section className="relative overflow-hidden border-b border-white/10 bg-brand-950">
        {/* The plate sits behind the type and is clipped by the section, so it
            reads as a drawing the page is laid on rather than an illustration
            dropped into it. Fixed aspect, so nothing shifts as it paints. */}
        {/* Committed to, rather than left at a quarter opacity under a wash
            where it read as a smudge. It is the only drawing in the hero, so
            it either carries the space on the right or should not be there. */}
        <VidenHeroPlate className="pointer-events-none absolute -right-40 top-16 h-[20rem] w-[46rem] text-brand-300/40 sm:-right-24 sm:top-8 sm:h-[26rem] sm:w-[58rem] lg:right-0 lg:top-0 lg:h-full lg:w-[68rem] lg:text-brand-300/55" />
        {/* Vertical wash on a phone, horizontal on a wide screen: the drawing
            has to stay legible on the right where there is room, and stay out
            of the way of the type where there is not. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950 via-brand-950/55 to-brand-950 lg:bg-gradient-to-r lg:from-brand-950 lg:via-brand-950/70 lg:to-transparent"
        />

        <Container className="relative py-10 sm:py-16 lg:py-20">
          <Breadcrumbs lang={lang} trail={[{ name: c.crumb, href: "/vejledninger" }]} />

          <p className="eyebrow mt-8 text-brand-300">{c.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2.25rem,6vw,4.25rem)] font-extrabold leading-[0.98] tracking-display text-paper">
            {c.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-paper/70 sm:text-lg sm:leading-8">
            {c.description}
          </p>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-6 sm:mt-14">
            {[
              { n: String(guides.length), l: c.statGuides, wide: false },
              { n: String(groups.length), l: c.statClusters, wide: false },
              { n: updatedLabel, l: c.statUpdated, wide: true },
            ].map((stat) => (
              <div key={stat.l}>
                <dt className="label text-paper/40">{stat.l}</dt>
                {/* A count and a date are not the same kind of value and should
                    not be set at the same size: the count is the figure, the
                    date is a note about it. */}
                <dd
                  className={`mt-1 font-display font-bold tracking-tight text-paper ${
                    stat.wide ? "text-lg text-paper/80" : "text-2xl tabular-nums"
                  }`}
                >
                  {stat.n}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* The index: four plates in a folder. Each is a real link to the anchor
          its section carries, which is also what an article links back to. */}
      <section className="border-b border-white/10 py-10 sm:py-16">
        <Container>
          <h2 className="eyebrow text-paper/40">{c.indexTitle}</h2>
          <nav aria-label={c.jump}>
            <ul className="mt-6 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {groups.map(({ cluster, articles }, i) => (
                <li key={cluster.id} className="bg-brand-950">
                  <a
                    href={`#${cluster.anchor}`}
                    className="group flex h-full flex-col px-5 py-4 transition-colors hover:bg-white/[0.04] sm:p-6"
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
                     * below cannot.
                     */}
                    <VidenClusterPlate
                      cluster={cluster.id}
                      index={String(i + 1).padStart(2, "0")}
                      className="hidden transition-opacity group-hover:opacity-100 sm:block sm:opacity-85"
                    />
                    <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:mt-5">
                      {cluster.name[lang]}
                    </h3>
                    <p className="mt-2 hidden flex-1 text-sm leading-6 text-paper/55 sm:block">
                      {cluster.description[lang]}
                    </p>
                    {/* On its own rule at the foot of the card, so four cards
                        with descriptions of four different lengths still end on
                        one line across the row. */}
                    <p className="label mt-2 text-paper/45 sm:mt-5 sm:border-t sm:border-white/10 sm:pt-4">
                      {articles.length} {articles.length === 1 ? c.article : c.articles}
                    </p>
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
          className="scroll-mt-20 border-b border-white/10 py-12 sm:py-16"
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
            <header className="max-w-5xl border-b border-white/20 pb-7">
              {/* Position in the folder, not the name of the folder. It read
                  "01 / EMNER" on every section — the label of the index above,
                  repeated four times, saying the same thing about four
                  different topics. A chapter marker says something. */}
              <p className="eyebrow text-paper/40">
                <span className="tabular-nums text-brand-300">
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="mx-2.5 text-paper/25">
                  /
                </span>
                <span className="tabular-nums">{String(groups.length).padStart(2, "0")}</span>
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.5rem,2.8vw,2.125rem)] font-bold leading-tight tracking-tight text-paper">
                {cluster.name[lang]}
              </h2>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-paper/60">
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
            <ol className="max-w-5xl">
              {articles.map((guide, index) => (
                <li key={guide.slug} className="border-b border-white/[0.08] last:border-b-0">
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
                    className="group -mx-4 flex flex-col gap-5 border-l-2 border-transparent py-7 pl-4 pr-4 transition-colors hover:border-brand-400 hover:bg-white/[0.03] sm:-mx-5 sm:gap-6 sm:py-9 sm:pl-5 sm:pr-5"
                  >
                    {/*
                     * The guide's own panel.
                     *
                     * The section had pictures of its four topics and none of
                     * its eight guides, so three articles under "Levetid og
                     * udskiftning" shared one illustration and the list itself
                     * had nothing to recognise a row by but its title.
                     *
                     * It is drawn at 768x512 and rendered near that size. The
                     * first attempt put the same subjects in a 124px thumbnail
                     * beside the title, and at that size a drawing holds one
                     * shape and nothing else — no reading, no label, no light —
                     * so an illustration system arrived as eight small icons.
                     * A panel needs the room to be a panel.
                     *
                     * Fixed 3:2 box, so nothing shifts as it paints.
                     */}
                    <GuidePanel
                      slug={guide.slug}
                      lang={lang}
                      priority={groupIndex === 0 && index === 0}
                      className="aspect-[3/2] w-full overflow-hidden rounded-sm border border-white/10 transition-colors group-hover:border-brand-400/40"
                    />

                    <div className="flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:items-baseline">
                    <div className="min-w-0 flex-1">
                      <h3 className="max-w-2xl font-display text-xl font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:text-[1.4375rem]">
                        {guide.title[lang]}
                      </h3>
                      {/* One measure for the whole block: the heading used to
                          run to the column edge while the summary stopped two
                          thirds of the way, which left a ragged right side and
                          a void before the minutes. */}
                      <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-7 text-paper/65">
                        {guide.summary[lang]}
                      </p>
                    </div>

                    {/* A duration reads as a duration: "7 min." in the same
                        case as everything else, not "7 MIN." letterspaced like
                        a category tag. */}
                    <span className="flex flex-none items-center gap-3.5 sm:w-24 sm:justify-end">
                      <span className="whitespace-nowrap text-sm tabular-nums text-paper/50">
                        {guide.readingMinutes} {c.readingSuffix}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 flex-none text-paper/40 transition-all group-hover:translate-x-1 group-hover:text-brand-300"
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

      {/*
       * The question the guides did not answer.
       *
       * It used to be a narrow card floating in a wide empty section directly
       * above the site's own closing call to action — two invitations in a row,
       * the first of them visually the weaker, which made both count for less.
       * As a band it is plainly a footnote to the reading above rather than a
       * competing offer, and the section below can do the selling.
       */}
      <section className="py-10 sm:py-14">
        <Container>
          {/* The same measure as the topics above it. Left at full width it
              was a band a third wider than everything it followed, with the
              button stranded at the far end of the extra third. */}
          <div className="flex max-w-5xl flex-col gap-6 border-l-2 border-brand-400 bg-white/[0.035] p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">
                {c.adviceTitle}
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-7 text-paper/65">{c.adviceBody}</p>
            </div>
            <Link
              href={localePath("/kontakt", lang)}
              className="inline-flex min-h-[48px] flex-none items-center self-start bg-brand-600 px-7 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700 lg:ml-auto lg:self-auto"
            >
              {c.adviceCta}
            </Link>
          </div>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}
