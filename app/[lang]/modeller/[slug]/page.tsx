import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ModelGallery from "@/components/ModelGallery";
import ModelCard from "@/components/ModelCard";
import RetailLinks from "@/components/RetailLinks";
import { picturesFirst } from "@/lib/model-order";
import { modelMedia } from "@/lib/model-media";
import { Check, ChevronDown, Info } from "lucide-react";
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
    configTitle: "Specifikationer for modelserien",
    configBody:
      "Brugt hardware findes i mange sammensætninger. Tallene her viser, hvad modellen som regel er bygget med – den præcise konfiguration aftaler vi for jeres ordre.",
    goodFor: "God til",
    watchOut: "Vær opmærksom på",
    whyTitle: "Derfor peger vi på denne model",
    seeAlsoPre: "Se også alt, hvad vi skaffer inden for",
    related: "Andre modeller i samme klasse",
  },
  en: {
    breadcrumb: "Models",
    imageNote:
      "The photos show the model type. Condition, specifications and quantity are agreed per order.",
    configTitle: "Model family specifications",
    configBody:
      "Used hardware turns up in many configurations. The figures here show how the model is usually built — the exact configuration is agreed for your order.",
    goodFor: "Good for",
    watchOut: "Worth knowing",
    whyTitle: "Why we point to this model",
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
  const media = modelMedia(model);

  const category = getCategory(model.category);
  /* Peers are the models in the same category, not the same group: the ZBook
     is the only "workstations" model, so relating by group left it with no
     siblings pointing at it — two incoming links on the whole site. */
  const sameCategory = models.filter((m) => m.category === model.category && m.slug !== model.slug);
  const sameGroup = models.filter(
    (m) => m.group === model.group && m.slug !== model.slug && !sameCategory.includes(m),
  );
  /* Three, photographed first: eight cards in three rows was the longest
     section on the page and repeated the category page below a model. The
     rest are one link away, on the category page. */
  const peers = picturesFirst([...sameCategory, ...sameGroup]);
  const related = peers.slice(0, 3);
  const pagePath = `/modeller/${model.slug}`;
  const pageUrl = `${SITE_ORIGIN}${localePath(pagePath, lang)}`;
  const productId = `${pageUrl}#product`;

  /*
   * The model as a product Google can recognise.
   *
   * Deliberately carries no `offers`. Google's product snippets need offers,
   * a review or a rating, so Search Console lists these as invalid snippet
   * items: no rich result, and no ranking penalty. We hold no stock and price
   * per order — the whole /priser page exists to say so. A made-up price would
   * buy a rich result with a number the buyer cannot hold us to, which is the
   * one thing this site has consistently refused to do. The entity still tells
   * search engines and answer engines what the page is about. Everything here
   * is a fact from lib/models.ts; add offers the day there is a real price.
   *
   * No `seller` either: schema.org defines it on Offer, not on Product, so on
   * a Product it is an unknown property. The organisation is the page's
   * publisher already.
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
      <section className="overflow-hidden bg-brand-950 py-6 text-white sm:py-12">
        <Container className="relative">
          {/* One shell width for the whole page, so every section starts at the
              same left edge. Inside it the machine and what we say about it sit
              side by side on a desktop: as stacked full-width blocks the photos
              alone were two screens of scrolling with half the window empty. */}
          <div className="max-w-6xl xl:max-w-none">
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
                    {lang === "da" ? "Brugt" : "Refurbished"} {model.name}
                  </h1>
                </div>
                {/* The tagline, then the answer: what the machine is, with
                    the figures from its own spec table. */}
                <p className="mt-5 text-base leading-[1.65] text-paper/85 sm:text-lg">
                  {model.tagline[lang]} {modelLead(model, lang)}
                </p>
              </div>

              {model.images ? (
                <div className="space-y-3 sm:space-y-4 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
                  <ModelGallery
                    images={model.images}
                    lang={lang}
                    name={model.name}
                    note={c.imageNote}
                  />
                </div>
              ) : (
                media && (
                  /* The same studio frame as the catalogue card, so the model a
                     buyer tapped is the picture the page opens on. A drawing of
                     the format, and labelled as one. */
                  <figure className="relative overflow-hidden rounded-xl bg-paper-dim outline outline-1 -outline-offset-1 outline-white/10 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-start">
                    <Image
                      src={media.src}
                      alt={media.alt[lang]}
                      width={media.width}
                      height={media.height}
                      priority
                      sizes="(min-width: 1024px) 38vw, 92vw"
                      className="h-auto w-full"
                    />
                    <figcaption className="absolute left-3 top-3 rounded bg-ink-950/90 px-2 py-0.5 text-xs font-semibold leading-5 text-paper">
                      Illustration
                    </figcaption>
                  </figure>
                )
              )}

              <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-8">
                <p className="label text-paper/65">
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
                {model.images && (
                  <PriceOnRequest lang={lang} equipment={model.name} className="mt-6" />
                )}
              </div>

              {/* Models without photographs: the right column carries the
                  illustration and, under it, the price box; after the text in
                  the markup, so a phone still reads title, picture, intro,
                  then price. A laptop without a photograph has no picture at
                  all, so its price box moves up to the top of the column. */}
              {!model.images && (
                <div
                  className={`lg:col-span-5 lg:col-start-8 lg:self-start ${
                    media ? "lg:row-start-3 lg:mt-6" : "lg:row-span-2 lg:row-start-1"
                  }`}
                >
                  <PriceOnRequest
                    lang={lang}
                    equipment={model.name}
                    accessory={model.group === "skaerme" || model.group === "docking"}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Kestro stocks none of the catalogue yet: say so under the product,
          and where it can be found meanwhile (components/RetailLinks.tsx). */}
      <RetailLinks model={model} lang={lang} />

      <section className="border-t border-white/10 py-10 sm:py-20">
        <Container>
          <div className="max-w-6xl xl:max-w-none">
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
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

            <details className="group mt-8 border-y border-white/15">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-4 [&::-webkit-details-marker]:hidden">
                <h2 className="text-base font-semibold text-paper">
                  {lang === "da"
                    ? "Om modellen og den konkrete konfiguration"
                    : "About the model and your configuration"}
                </h2>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-brand-300 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-5 text-sm leading-6 text-paper/75">{model.intro[lang]}</p>
              <WhatIsFixed lang={lang} group={model.group} headingLevel="h3" className="pb-6" />
            </details>

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
            <div className="max-w-6xl xl:max-w-none">
              <h2 className="font-display t-h3 font-bold tracking-tight text-paper">{c.related}</h2>
              {/* The same product card as the catalogue, as a shelf: a row of
                  names in pills told a buyer nothing about which one to open. */}
              <ul className="rail mt-6 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <ModelCard model={other} lang={lang} />
                  </li>
                ))}
              </ul>
              {category && peers.length > related.length && (
                <Link
                  href={localePath(`/produkter/${category.slug}`, lang)}
                  className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
                >
                  {lang === "da"
                    ? `Se alle ${lowerFirst(category.name.da)}`
                    : `See all ${lowerFirst(category.name.en)}`}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
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
