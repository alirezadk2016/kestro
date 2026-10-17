import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageSchema from "@/components/PageSchema";
import SourceList from "@/components/SourceList";
import { buttonClass } from "@/components/Button";
import { htmlLang, localePath, metaFor, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import { citationSchema } from "@/lib/sources";
import type { PracticalGuide } from "@/lib/practical-guides";
import { BatteryCapacityTool, RamUsageTool } from "./CapacityTools";
import BrowserCheck from "./BrowserCheck";
import styles from "./practical.module.css";

export function practicalMetadata(guide: PracticalGuide, lang: Lang): Metadata {
  const base = metaFor(`/vejledninger/${guide.slug}`, lang);
  const images = [
    {
      url: `${SITE_ORIGIN}${guide.image}`,
      width: 1200,
      height: 900,
      alt: guide.imageAlt[lang],
      type: "image/webp",
    },
  ];
  return {
    title: guide.metaTitle[lang],
    description: guide.metaDescription[lang],
    ...base,
    robots: { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      ...base.openGraph,
      type: "article",
      title: guide.metaTitle[lang],
      description: guide.metaDescription[lang],
      publishedTime: "2026-10-17",
      modifiedTime: "2026-10-17",
      images,
    },
    twitter: {
      ...base.twitter,
      title: guide.metaTitle[lang],
      description: guide.metaDescription[lang],
      images,
    },
  };
}

export default function PracticalGuidePage({ guide, lang }: { guide: PracticalGuide; lang: Lang }) {
  const pageUrl = `${SITE_ORIGIN}${localePath(`/vejledninger/${guide.slug}`, lang)}`;
  const articleId = `${pageUrl}#article`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleId,
    url: pageUrl,
    headline: guide.title[lang],
    description: guide.metaDescription[lang],
    inLanguage: htmlLang[lang],
    datePublished: "2026-10-17",
    dateModified: "2026-10-17",
    author: { "@type": "Organization", name: "Kestro", url: SITE_ORIGIN },
    publisher: { "@type": "Organization", name: "Kestro", url: SITE_ORIGIN },
    image: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}${guide.image}`,
      width: 1200,
      height: 900,
      caption: guide.imageAlt[lang],
    },
    citation: citationSchema(guide.sourceIds, lang),
    mainEntityOfPage: { "@id": pageUrl },
  };
  const hasTool = !!guide.tool || guide.slug === "langsom-computer";
  const c =
    lang === "da"
      ? {
          home: "Viden",
          label: "Praktisk guide · Windows",
          steps: "Sådan gør du",
          tool: "Brug værktøjet",
          browser: "Prøv et browsertjek",
          result: "Hvad betyder det?",
          related: "Dit næste skridt",
          source: "Kilder og dokumentation",
          image: "AI-genereret emnebillede. Ikke en modelbestemt reparationsvejledning.",
          stepLink: "Se trinene",
          battery: "Beregn batteriets kapacitet",
          ram: "Beregn dit RAM-forbrug",
        }
      : {
          home: "Knowledge",
          label: "Practical guide · Windows",
          steps: "Step by step",
          tool: "Use the tool",
          browser: "Try a browser check",
          result: "What does it mean?",
          related: "Your next step",
          source: "Sources and documentation",
          image: "AI-generated topic image. Not a model-specific repair manual.",
          stepLink: "View the steps",
          battery: "Calculate battery capacity",
          ram: "Calculate memory usage",
        };

  return (
    <>
      <PageSchema
        lang={lang}
        route="/vejledninger/[slug]"
        pagePath={`/vejledninger/${guide.slug}`}
        name={guide.title[lang]}
        description={guide.metaDescription[lang]}
        sources={guide.sourceIds}
        primaryEntityId={articleId}
        contentDates={{ published: "2026-10-17", modified: "2026-10-17" }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, "\\u003c") }}
      />
      <section className={styles.pageHero}>
        <Container>
          <Breadcrumbs
            lang={lang}
            trail={[
              { name: c.home, href: "/vejledninger" },
              { name: guide.title[lang], href: `/vejledninger/${guide.slug}` },
            ]}
          />
          <div className={styles.pageHeroGrid}>
            <div className={styles.pageHeroCopy}>
              <p className="eyebrow text-brand-300">{c.label}</p>
              <h1 className="mt-4 font-display t-h1 font-extrabold tracking-display text-paper">
                {guide.title[lang]}
              </h1>
              <p className={styles.pageIntro}>{guide.intro[lang]}</p>
              <div className={styles.pageActions}>
                <a className={buttonClass("primary")} href={guide.tool ? "#vaerktoej" : "#trin"}>
                  {guide.tool ? c.tool : c.stepLink}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                {hasTool && (
                  <a
                    href={guide.tool ? "#trin" : "#vaerktoej"}
                    className="text-sm text-brand-200 underline decoration-brand-300/50 underline-offset-4"
                  >
                    {guide.tool ? c.stepLink : c.browser}
                  </a>
                )}
              </div>
            </div>
            <figure className={styles.heroFigure}>
              <Image
                src={guide.image}
                alt={guide.imageAlt[lang]}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 42vw, 100vw"
                priority
              />
              <figcaption>{c.image}</figcaption>
            </figure>
          </div>
        </Container>
      </section>
      <section className={styles.stepsSection} id="trin" aria-labelledby="steps-title">
        <Container>
          <h2 id="steps-title" className="font-display t-h2 font-bold tracking-display text-paper">
            {c.steps}
          </h2>
          <ol className={styles.steps}>
            {guide.steps.map((step, index) => (
              <li className={styles.step} key={step.title.da}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="font-display text-lg font-bold leading-snug text-paper">
                  {step.title[lang]}
                </h3>
                <p>{step.body[lang]}</p>
                {step.command && <code>{step.command}</code>}
              </li>
            ))}
          </ol>
        </Container>
      </section>
      {hasTool && (
        <section id="vaerktoej" className={styles.toolSection} aria-labelledby="tool-title">
          <Container>
            <h2
              id="tool-title"
              className={`${styles.toolHeading} font-display t-h2 font-bold tracking-display text-paper`}
            >
              {guide.tool === "battery" ? c.battery : guide.tool === "ram" ? c.ram : c.browser}
            </h2>
            {guide.tool === "battery" && <BatteryCapacityTool lang={lang} />}
            {guide.tool === "ram" && <RamUsageTool lang={lang} />}
            {guide.slug === "langsom-computer" && <BrowserCheck lang={lang} />}
          </Container>
        </section>
      )}
      <section className={styles.resultSection} aria-labelledby="meaning-title">
        <Container>
          <h2
            id="meaning-title"
            className="font-display t-h2 font-bold tracking-display text-paper"
          >
            {c.result}
          </h2>
          <div className={styles.results}>
            {guide.result.map((item) => (
              <div className={`plate ${styles.result}`} key={item.title.da}>
                <h3 className="font-display text-lg font-bold leading-snug text-paper">
                  {item.title[lang]}
                </h3>
                <p>{item.body[lang]}</p>
              </div>
            ))}
          </div>
          <p className={styles.limits}>{guide.limits[lang]}</p>
        </Container>
      </section>
      <section className={styles.further}>
        <Container className={styles.furtherGrid}>
          <div>
            <h2 className="font-display t-h3 font-bold text-paper">{c.related}</h2>
            <ul className={styles.relatedList}>
              {guide.related.map((link) => (
                <li key={link.href}>
                  <Link href={localePath(link.href, lang)}>
                    {link.label[lang]}
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${localePath("/vejledninger", lang)}#praktiske-guides`}>
                  {lang === "da" ? "Alle praktiske guides" : "All practical guides"}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display t-h3 font-bold text-paper">{c.source}</h2>
            <SourceList lang={lang} ids={guide.sourceIds} className="mt-5" compact quietHeading />
          </div>
        </Container>
      </section>
    </>
  );
}
