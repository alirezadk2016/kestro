import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import ClusterMark from "@/components/ClusterMark";
import { guides, clusters } from "@/lib/guides";
import { localePath, metaFor, type Lang } from "@/lib/i18n";

/*
 * Viden — the hub.
 *
 * The section is called Viden; the URL stays /vejledninger. Decoupling the two
 * is deliberate: the name is what a reader remembers, the URL is what costs
 * redirects to change, and the hub owns no keyword in the map, so relabelling
 * costs nothing. If the data ever justifies moving to /viden, one path segment
 * changes and the structure below is already right.
 *
 * Grouped by cluster, with a real anchor per group. The jump links are <a
 * href="#…"> to ids that exist in the markup — a crawler follows them, they
 * work with JavaScript off, and they are what an article's cluster eyebrow
 * links back to. No filter state, no JS, no card grid.
 */

const copy = {
  da: {
    metaTitle: "Viden om erhvervs-IT: køb og udskiftning | Kestro",
    metaDescription:
      "Vejledninger til virksomheder om at købe, vurdere og udskifte erhvervs-IT. Skrevet af os, der skaffer maskinerne – og ærlige om, hvornår I ikke skal købe.",
    title: "Viden",
    description:
      "Vi tjener penge på at skaffe og klargøre udstyr – ikke på at holde på viden. Her er det, vi selv ville have fortalt dig, hvis du ringede.",
    jump: "Spring til",
    articles: "vejledninger",
    article: "vejledning",
    adviceTitle: "Gratis rådgivning",
    adviceBody:
      "Står du med et konkret spørgsmål, som ingen af vejledningerne svarer på, så skriv til os. Vi svarer på spørgsmål om reparation, opgradering og køb af brugt udstyr uden at sende en regning – også hvis svaret er, at du ikke skal købe noget af os.",
    adviceCta: "Stil et spørgsmål",
    readingSuffix: "min. læsning",
    read: "Læs vejledningen",
  },
  en: {
    metaTitle: "Knowledge: buying and replacing business IT | Kestro",
    metaDescription:
      "Guides for companies on buying, assessing and replacing business IT. Written by the people who source the machines — and honest about when not to buy.",
    title: "Knowledge",
    description:
      "We make our money sourcing and preparing equipment, not hoarding knowledge. This is what we would have told you if you had phoned.",
    jump: "Jump to",
    articles: "guides",
    article: "guide",
    adviceTitle: "Free advice",
    adviceBody:
      "If you have a specific question none of the guides answers, write to us. We answer questions about repairs, upgrades and buying used equipment without sending an invoice — including when the answer is that you should not buy anything from us.",
    adviceCta: "Ask a question",
    readingSuffix: "min read",
    read: "Read the guide",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const c = copy[params.lang];
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    ...metaFor("/vejledninger", params.lang),
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

  return (
    <>
      <section className="py-10 sm:py-16">
        <Container>
          <PageHeader
            title={c.title}
            description={c.description}
            lang={lang}
            href="/vejledninger"
            crumb={c.title}
          />

          {/* Jump links, not filters. Real anchors, so they survive a crawler,
              a shared link and a browser with JavaScript switched off. */}
          <nav aria-label={c.jump} className="mt-10 border-y border-white/10 py-4">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <li className="label text-paper/40">{c.jump}</li>
              {groups.map(({ cluster, articles }) => (
                <li key={cluster.id}>
                  <a
                    href={`#${cluster.anchor}`}
                    className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-paper/70 transition hover:text-brand-300"
                  >
                    {cluster.name[lang]}
                    <span className="tabular-nums text-paper/35">{articles.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {groups.map(({ cluster, articles }) => (
            <section key={cluster.id} id={cluster.anchor} className="scroll-mt-24 pt-14 sm:pt-20">
              {/* Editorial two-column: the cluster states itself on the left and
                  stays there while its articles run down the right. Asymmetric
                  on purpose — a symmetric grid is what makes a knowledge
                  section read as a blog. */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <ClusterMark cluster={cluster.id} className="h-16 w-16 text-brand-300/70" />
                  <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-paper">
                    {cluster.name[lang]}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-paper/60">
                    {cluster.description[lang]}
                  </p>
                  <p className="label mt-4 text-paper/35">
                    {articles.length} {articles.length === 1 ? c.article : c.articles}
                  </p>
                </div>

                <ol className="border-t border-white/15">
                  {articles.map((guide) => (
                    <li key={guide.slug} className="border-b border-white/10">
                      <Link
                        href={localePath(`/vejledninger/${guide.slug}`, lang)}
                        className="group -mx-4 block rounded-xl px-4 py-6 transition-colors hover:bg-white/5"
                      >
                        <p className="label text-paper/45">
                          {guide.readingMinutes} {c.readingSuffix}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:text-2xl">
                          {guide.title[lang]}
                        </h3>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-paper/65">
                          {guide.summary[lang]}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                          {c.read}
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            strokeWidth={2}
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ))}

          <div className="mt-16 max-w-3xl border-l-2 border-brand-400 bg-white/5 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-paper">
              {c.adviceTitle}
            </h2>
            <p className="mt-3 text-base leading-7 sm:leading-8 text-paper/65">{c.adviceBody}</p>
            <Link
              href={localePath("/kontakt", lang)}
              className="mt-6 inline-flex min-h-[48px] items-center bg-brand-600 px-7 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700"
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
