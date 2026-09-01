import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaSection from "@/components/CtaSection";
import { VidenHeroPlate } from "@/components/VidenPlate";
import { guides, clusters, type Cluster } from "@/lib/guides";
import { localePath, metaFor, type Lang } from "@/lib/i18n";

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

/*
 * One render per cluster, from scripts/render-viden-stills.mjs — the same GLB
 * and the same studio lighting the front page's canvas uses, drawn from a
 * different camera for each subject. Stills rather than a live canvas: WebGL
 * here would cost the ~800 kB three.js bundle measured earlier, on a page whose
 * whole job is to send people somewhere else.
 */
const renders: Record<Cluster, { src: string; alt: { da: string; en: string } }> = {
  lifecycle: {
    src: "/viden/lifecycle.webp",
    alt: {
      da: "Erhvervsbærbar set forfra med skærmen halvt lukket",
      en: "Business laptop seen from the front with the lid half closed",
    },
  },
  "buying-condition": {
    src: "/viden/buying-condition.webp",
    alt: {
      da: "Tastatur og touchpad på en erhvervsbærbar set skråt oppefra",
      en: "Keyboard and touchpad of a business laptop seen from above at an angle",
    },
  },
  "memory-storage": {
    src: "/viden/memory-storage.webp",
    alt: {
      da: "Undersiden af en lukket erhvervsbærbar set nedefra",
      en: "Underside of a closed business laptop seen from below",
    },
  },
  "workplace-hardware": {
    src: "/viden/hero.webp",
    alt: {
      da: "Erhvervsbærbar set i tre kvart profil",
      en: "Business laptop seen in three-quarter profile",
    },
  },
  "uden-klynge": {
    src: "/viden/uden-klynge.webp",
    alt: {
      da: "Erhvervsbærbar på afstand, delvist lukket",
      en: "Business laptop at a distance, partly closed",
    },
  },
};

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

  /* Real numbers, read off the data. Nothing here is a claim. */
  const lastUpdated = guides
    .map((guide) => guide.updated)
    .sort()
    .at(-1);

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-brand-950">
        {/* The plate sits behind the type and is clipped by the section, so it
            reads as a drawing the page is laid on rather than an illustration
            dropped into it. Fixed aspect, so nothing shifts as it paints. */}
        <VidenHeroPlate className="pointer-events-none absolute inset-0 h-full w-full text-brand-300/[0.09]" />
        <Image
          src="/viden/hero.webp"
          /* Decorative: the machine is described by every card below, and a
             reader who cannot see it loses nothing by not hearing it named. */
          alt=""
          aria-hidden="true"
          width={1600}
          height={900}
          priority
          sizes="(max-width: 1023px) 100vw, 60vw"
          className="pointer-events-none absolute -right-16 top-6 w-[44rem] max-w-none opacity-70 sm:-right-8 sm:top-0 sm:w-[58rem] lg:right-[-5rem] lg:top-1/2 lg:w-[58rem] lg:-translate-y-1/2 lg:opacity-100"
        />
        {/* Vertical wash on a phone, horizontal on a wide screen: the render
            has to stay visible on the right where there is room, and stay out
            of the way of the type where there is not. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950/95 via-brand-950/80 to-brand-950 lg:bg-gradient-to-r lg:from-brand-950 lg:via-brand-950/75 lg:to-transparent"
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
              { n: String(guides.length), l: c.statGuides },
              { n: String(groups.length), l: c.statClusters },
              { n: lastUpdated ?? "", l: c.statUpdated },
            ].map((stat) => (
              <div key={stat.l}>
                <dt className="label text-paper/40">{stat.l}</dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums tracking-tight text-paper">
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
                    className="group flex h-full flex-col p-5 transition-colors hover:bg-white/[0.04] sm:p-6"
                  >
                    <div className="relative overflow-hidden border border-white/[0.07] bg-white/[0.02]">
                      <Image
                        src={renders[cluster.id].src}
                        alt={renders[cluster.id].alt[lang]}
                        width={900}
                        height={675}
                        loading="lazy"
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="label absolute left-3 top-3 text-paper/45">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300">
                      {cluster.name[lang]}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-paper/55">
                      {cluster.description[lang]}
                    </p>
                    <p className="label mt-5 text-paper/35">
                      {articles.length} {articles.length === 1 ? c.article : c.articles}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {groups.map(({ cluster, articles }) => (
        <section
          key={cluster.id}
          id={cluster.anchor}
          className="scroll-mt-20 border-b border-white/10 py-12 sm:py-20"
        >
          <Container>
            {/* Editorial and asymmetric: the topic states itself on the left and
                stays there while its guides run down the right. A symmetric grid
                is what makes a knowledge section read as a blog. */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="overflow-hidden border border-white/[0.07] bg-white/[0.02]">
                  <Image
                    src={renders[cluster.id].src}
                    alt={renders[cluster.id].alt[lang]}
                    width={900}
                    height={675}
                    loading="lazy"
                    sizes="(max-width: 1023px) 100vw, 20rem"
                    className="w-full"
                  />
                </div>
                <h2 className="mt-6 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-paper">
                  {cluster.name[lang]}
                </h2>
                <p className="mt-4 text-sm leading-6 text-paper/60">{cluster.description[lang]}</p>
              </div>

              <ol className="border-t border-white/15">
                {articles.map((guide, i) => (
                  <li key={guide.slug} className="border-b border-white/10">
                    <Link
                      href={localePath(`/vejledninger/${guide.slug}`, lang)}
                      className="group -mx-4 flex gap-5 rounded-xl px-4 py-7 transition-colors hover:bg-white/[0.04] sm:gap-8"
                    >
                      <span
                        aria-hidden="true"
                        className="pt-1 font-display text-sm font-semibold tabular-nums text-paper/30 transition-colors group-hover:text-brand-300"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="label text-paper/40">
                          {guide.readingMinutes} {c.readingSuffix}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-paper transition-colors group-hover:text-brand-300 sm:text-[1.6rem]">
                          {guide.title[lang]}
                        </h3>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-paper/60">
                          {guide.summary[lang]}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                          {c.read}
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            strokeWidth={2}
                          />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>
      ))}

      <section className="py-12 sm:py-20">
        <Container>
          <div className="max-w-3xl border-l-2 border-brand-400 bg-white/[0.04] p-6 sm:p-8">
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
