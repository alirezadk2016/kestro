import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ModelGallery from "@/components/ModelGallery";
import { Check, Info } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import PriceOnRequest from "@/components/PriceOnRequest";
import WhatIsFixed from "@/components/WhatIsFixed";
import CtaSection from "@/components/CtaSection";
import { models, getModel } from "@/lib/models";
import { getCategory } from "@/lib/categories";
import { getCategoryMark } from "@/lib/category-marks";
import MarkTile from "@/components/MarkTile";
import { formatDate, localePath, metaFor, langs, type Lang, lowerFirst } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import FactNote from "@/components/FactNote";
import Faq from "@/components/Faq";
import { modelFaqs, modelLead, modelSources } from "@/lib/model-copy";

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
  return langs.flatMap((lang) => models.map((model) => ({ lang, slug: model.slug })));
}

const copy = {
  da: {
    breadcrumb: "Modeller",
    imageNote:
      "Billederne viser modeltypen. Stand, specifikationer og antal aftales for den enkelte ordre.",
    configTitle: "Typisk konfiguration",
    configBody:
      "Brugt hardware findes i mange sammensætninger. Tallene her viser, hvad modellen som regel er bygget med – den præcise konfiguration aftaler vi for jeres ordre.",
    goodFor: "God til",
    watchOut: "Vær opmærksom på",
    whyTitle: "Derfor peger vi ofte på denne model",
    seeAlsoPre: "Se også alt, hvad vi skaffer inden for",
    related: "Andre modeller i samme klasse",
  },
  en: {
    breadcrumb: "Models",
    imageNote:
      "The photos show the model type. Condition, specifications and quantity are agreed per order.",
    configTitle: "Typical configuration",
    configBody:
      "Used hardware turns up in many configurations. The figures here show how the model is usually built — the exact configuration is agreed for your order.",
    goodFor: "Good for",
    watchOut: "Worth knowing",
    whyTitle: "Why we often point at this model",
    seeAlsoPre: "See everything else we source within",
    related: "Other models in the same class",
  },
} satisfies Record<Lang, Record<string, string>>;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const model = getModel(params.slug);
  if (!model) return {};

  return {
    title: model.metaTitle[params.lang],
    description: model.metaDescription[params.lang],
    ...metaFor(`/modeller/${model.slug}`, params.lang),
  };
}

export default async function ModelPage(props: { params: Promise<{ lang: Lang; slug: string }> }) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const model = getModel(params.slug);
  if (!model) notFound();

  const category = getCategory(model.category);
  /* Peers are the models in the same category, not the same group: the ZBook
     is the only "workstations" model, so relating by group left it with no
     siblings pointing at it — two incoming links on the whole site. */
  const sameCategory = models.filter((m) => m.category === model.category && m.slug !== model.slug);
  const sameGroup = models.filter(
    (m) => m.group === model.group && m.slug !== model.slug && !sameCategory.includes(m),
  );
  const related = [...sameCategory, ...sameGroup];
  const pagePath = `/modeller/${model.slug}`;
  const pageUrl = `${SITE_ORIGIN}${localePath(pagePath, lang)}`;
  const productId = `${pageUrl}#product`;

  /*
   * The model as a product Google can recognise.
   *
   * Deliberately carries no `offers`. Google wants a price there and will log
   * the omission as a warning, but we hold no stock and price per order — the
   * whole /priser page exists to say so. A made-up price would buy a rich
   * result with a number the buyer cannot hold us to, which is the one thing
   * this site has consistently refused to do. Everything here is a fact from
   * lib/models.ts; add offers the day there is a real price to publish.
   */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productId,
    name: model.name,
    brand: { "@type": "Brand", name: model.brand },
    category: category?.name[lang],
    description: model.intro[lang],
    url: pageUrl,
    ...(model.images?.length
      ? { image: model.images.map((img) => `${SITE_ORIGIN}${img.src}`) }
      : {}),
    additionalProperty: model.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label[lang],
      value: spec.value[lang],
    })),
    itemCondition: "https://schema.org/RefurbishedCondition",
    manufacturer: { "@type": "Organization", name: model.brand },
    seller: { "@id": `${SITE_ORIGIN}/#organization` },
  };

  return (
    <>
      <PageSchema
        lang={lang}
        route="/modeller/[slug]"
        type="ItemPage"
        pagePath={pagePath}
        name={model.name}
        description={model.metaDescription[lang]}
        sources={modelSources(model)}
        primaryEntityId={productId}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* Lit by the site's own wash. Two blurred orbs sat here: one was
          bg-brand-950 on bg-brand-950 and drew nothing, the other was the
          generic glow every generated page has. */}
      <section className="lit overflow-hidden bg-brand-950 py-12 text-white sm:py-20">
        <Container className="relative">
          {/* One shell width for the whole page, so every section starts at the
              same left edge. Inside it the machine and what we say about it sit
              side by side on a desktop: as stacked full-width blocks the photos
              alone were two screens of scrolling with half the window empty. */}
          <div className="max-w-6xl">
            {/* The shared trail, visible and marked up from one list. */}
            <Breadcrumbs
              lang={lang}
              trail={[
                { name: c.breadcrumb, href: "/modeller" },
                { name: model.name, href: `/modeller/${model.slug}` },
              ]}
            />
            {/* Title and lead, then the photographs, then the longer text on a
                phone; on a wide screen the photographs stand in the right
                column beside both. They used to follow the whole text column,
                900px down a phone. */}
            <div className="mt-6 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
              <div className="lg:col-span-7">
                {/* Brand and format as the page's one label, then mark and
                    title on one row, on the type scale like every page title. */}
                <p className="label mt-2 text-paper/75">
                  {model.brand} · {model.format[lang]}
                </p>
                <div className="mt-3 flex items-center gap-4 sm:gap-5">
                  <MarkTile
                    name={getCategoryMark(model.category)}
                    size="lg"
                    className="flex-none"
                  />
                  <h1 className="min-w-0 text-balance font-display t-h1 font-extrabold tracking-display text-paper">
                    {model.name}
                  </h1>
                </div>
                {/* The tagline, then the answer: what the machine is, with
                    the figures from its own spec table. */}
                <p className="mt-5 text-base leading-[1.65] text-paper/85 sm:text-lg">
                  {model.tagline[lang]} {modelLead(model, lang)}
                </p>
              </div>

              {model.images && (
                <div className="space-y-3 sm:space-y-4 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
                  <ModelGallery
                    images={model.images}
                    lang={lang}
                    name={model.name}
                    note={c.imageNote}
                  />
                </div>
              )}

              <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-8">
                <p className="text-base leading-[1.75] text-paper/75">{model.intro[lang]}</p>
                <p className="label mt-6 text-paper/65">
                  {lang === "da" ? "Opdateret" : "Updated"}{" "}
                  <time
                    dateTime={pageUpdated("/modeller/[slug]")}
                    className="tabular-nums text-paper/85"
                  >
                    {formatDate(pageUpdated("/modeller/[slug]"), lang)}
                  </time>
                </p>

                {/* The page describes the machine in detail and then used to say
                nothing about price, which leaves a buyer guessing whether this
                is a shop that forgot its prices. One box answers price and
                stock together: a "not in stock" plate stood above it saying
                half the same thing, and an "Ask about this model" panel further
                down said the rest again. */}
                <PriceOnRequest lang={lang} equipment={model.name} className="mt-6" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-10 sm:py-20">
        <Container>
          <div className="max-w-6xl">
            <div className="plate overflow-hidden">
              <div className="border-b border-white/10 bg-ink-900 px-5 py-4 sm:px-6">
                <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                  {c.configTitle}
                </h2>
                <p className="mt-1 text-sm leading-[1.6] text-paper/75">{c.configBody}</p>
              </div>

              <dl className="lg:grid lg:grid-cols-2">
                {model.specs.map((spec) => (
                  <div
                    key={spec.label.da}
                    className="border-b border-white/10 px-5 py-3 last:border-b-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-4 lg:border-b lg:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-white/10"
                  >
                    <dt className="text-sm font-semibold text-paper">{spec.label[lang]}</dt>
                    <dd className="mt-1 text-sm leading-6 text-paper/75 sm:col-span-2 sm:mt-0">
                      {spec.value[lang]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <WhatIsFixed lang={lang} className="mt-12" />

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                  {c.goodFor}
                </h2>
                <ul className="mt-5 space-y-3">
                  {model.goodFor.map((item) => (
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
              </div>

              <div className="plate p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display t-h3 font-bold tracking-tight text-paper">
                  <Info className="h-5 w-5 flex-shrink-0 text-paper/85" strokeWidth={2} />
                  {c.watchOut}
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {model.notes.map((note) => (
                    <li key={note.da} className="text-sm leading-6 text-paper/85">
                      {note[lang]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {model.why && (
              <>
                <h2 className="mt-12 text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                  {c.whyTitle}
                </h2>
                <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {model.why.map((reason) => (
                    <div key={reason.title.da}>
                      <dt className="flex gap-3 text-base font-semibold text-paper">
                        <Check
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 flex-none text-brand-300"
                          strokeWidth={2}
                        />
                        {reason.title[lang]}
                      </dt>
                      <dd className="mt-1.5 pl-8 text-sm leading-6 text-paper/75">
                        {reason.description[lang]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {category && (
              <p className="mt-8 text-sm leading-[1.6] text-paper/65">
                {c.seeAlsoPre}{" "}
                <Link
                  href={localePath(`/produkter/${category.slug}`, lang)}
                  className="font-semibold text-brand-300 hover:text-paper"
                >
                  {lowerFirst(category.name[lang])}
                </Link>
                .
              </p>
            )}
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
          <Container>
            <div className="max-w-6xl">
              <h2 className="font-display t-h3 font-bold tracking-tight text-paper">{c.related}</h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={localePath(`/modeller/${other.slug}`, lang)}
                      className="plate-sm inline-flex min-h-[44px] items-center px-4 text-sm font-medium text-paper/85 transition-colors hover:text-brand-300"
                    >
                      {other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      <Faq
        lang={lang}
        items={modelFaqs(model)}
        title={{ da: `Spørgsmål om ${model.name}`, en: `Questions about the ${model.name}` }}
      />

      {/* Windows sources only where the page is about a computer: a monitor
          does not run Windows 11 and has no business citing its requirements. */}
      <FactNote lang={lang} ids={modelSources(model)} />

      <CtaSection lang={lang} />
    </>
  );
}
