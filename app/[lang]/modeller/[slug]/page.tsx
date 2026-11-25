import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ModelGallery from "@/components/ModelGallery";
import RelatedModelRows from "@/components/RelatedModelRows";
import { modelCatalogueEntries } from "@/components/ModelCatalogue";
import RetailLinks from "@/components/RetailLinks";
import { picturesFirst } from "@/lib/model-order";
import { modelSeries } from "@/lib/model-series";
import { additionalModelPhotos, modelMedia } from "@/lib/model-media";
import { Check, ChevronDown, Info } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import PriceOnRequest from "@/components/PriceOnRequest";
import WhatIsFixed from "@/components/WhatIsFixed";
import CtaSection from "@/components/CtaSection";
import { models, getModel, cardSpecs } from "@/lib/models";
import { getCategory } from "@/lib/categories";
import { formatDate, localePath, metaFor, langs, type Lang, lowerFirst } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import FactNote from "@/components/FactNote";
import Faq from "@/components/Faq";
import { modelFaqs, modelLead, modelSources } from "@/lib/model-copy";
import styles from "@/components/ModelDetail.module.css";

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
  const supplementalPhotos = additionalModelPhotos(model);
  const galleryImages =
    media?.kind === "photo"
      ? [
          { src: media.src, alt: media.alt, photographic: true, credit: media.credit },
          ...(model.images ?? []).filter((image) => image.src !== media.src),
        ]
      : model.images;
  const computer = ["baerbare", "workstations", "stationaere"].includes(model.group);
  const factLabels =
    lang === "da" ? ["Processor", "Hukommelse", "Lagring"] : ["Processor", "Memory", "Storage"];
  const quickFacts = computer
    ? cardSpecs(model, lang)
        .slice(0, 3)
        .map((value, index) => ({ label: factLabels[index], value }))
    : model.specs
        .filter((spec) => spec.label.en !== "Model")
        .slice(0, 3)
        .map((spec) => ({ label: spec.label[lang], value: spec.value[lang] }));
  const referenceName = model.name.startsWith(model.brand + " ")
    ? model.name.slice(model.brand.length + 1)
    : model.name;

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
  /* Other generations of the same series come first: with one page per
     generation, the T14 Gen 4 reader's next question is Gen 3 or Gen 5, not
     whichever model happens to have a photograph. */
  const series = (name: string) => name.replace(/ Gen \d+$/, "");
  const siblings = [...sameCategory, ...sameGroup].filter(
    (m) => series(m.name) === series(model.name),
  );
  /* Then the rest of the manufacturer's line, same form factor and newest
     generation first. The X1 2-in-1 Gen 9 has no other generation, and its
     shelf showed a 2018 T480, a T14 and a Latitude 7490 as "same class"
     because they had photographs; its real neighbours are the X1 Yogas it
     replaced. Only after the line come the photographed models. */
  const line = modelSeries(model.name)?.id;
  const generation = (name: string) => Number(name.match(/ Gen (\d+)$/)?.[1] ?? 0);
  const sameLine = [...sameCategory, ...sameGroup]
    .filter((m) => line && modelSeries(m.name)?.id === line && !siblings.includes(m))
    .sort(
      (a, b) =>
        Number(b.format.da === model.format.da) - Number(a.format.da === model.format.da) ||
        generation(b.name) - generation(a.name),
    );
  const near = [...siblings, ...sameLine];
  const peers = [
    ...near,
    ...picturesFirst([...sameCategory, ...sameGroup]).filter((m) => !near.includes(m)),
  ];
  /* A fourth row for the same kind of machine from another maker, when the
     series already fills the three. A ThinkPad page showed only ThinkPads,
     so the EliteBook and Latitude pages were linked from the category list
     and the model index and nowhere else (2026-11-20). The slug picks which
     alternative, so the links spread over the other makers' pages instead
     of all going to one. */
  /* The same kind of machine within an inch: a 16" ThinkPad's counterpart
     is the 15.6" ProBook, a 16" P-series the 15.6" ZBook. */
  const kind = (format: string) => format.replace(/^[\d,]+"\s*(eller [\d,]+"\s*)?/, "");
  const inches = (format: string) => Number(format.match(/^([\d,]+)"/)?.[1].replace(",", "."));
  const comparable = (m: (typeof models)[number]) =>
    kind(m.format.da) === kind(model.format.da) &&
    (Number.isNaN(inches(model.format.da)) ||
      Math.abs(inches(m.format.da) - inches(model.format.da)) <= 1);
  const alternatives = picturesFirst([...sameCategory, ...sameGroup]).filter(
    (m) => m.brand !== model.brand && comparable(m) && !near.includes(m),
  );
  const spread = [...model.slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const alternative = alternatives.length ? alternatives[spread % alternatives.length] : undefined;
  const related =
    near.length >= 3 && alternative ? [...near.slice(0, 3), alternative] : peers.slice(0, 3);
  const pagePath = `/modeller/${model.slug}`;
  const pageUrl = `${SITE_ORIGIN}${localePath(pagePath, lang)}`;
  const modelId = `${pageUrl}#model`;

  /*
   * The model as an entity, not as a product for sale (2026-11-24).
   *
   * It was a schema.org Product without offers, and Google's product reports
   * count every Product without offers, a review or a rating as an invalid
   * item: 136 errors in Search Console, one per model page and language, for
   * markup that could never become a rich result. Kestro holds no stock and
   * prices per order, so a real offer cannot be added, and a made-up one is
   * the thing this site refuses to do.
   *
   * What the page is about is still said: a Thing whose additionalType is
   * schema.org's ProductModel ("a datasheet or vendor specification of a
   * product"), which is what a model page is. Google validates Product and
   * leaves a Thing alone; answer engines still read the name, the
   * description and the picture. The specifications are on the page itself,
   * in the table. Add a real Product with offers the day there is a price.
   */
  const modelJsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    additionalType: "https://schema.org/ProductModel",
    "@id": modelId,
    name: model.name,
    description: model.intro[lang],
    url: pageUrl,
    ...(galleryImages?.length
      ? { image: galleryImages.map((img) => `${SITE_ORIGIN}${img.src}`) }
      : {}),
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
        primaryEntityId={modelId}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(modelJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className={`${styles.hero} py-6 text-paper sm:py-8`}>
        <Container>
          <Breadcrumbs
            lang={lang}
            trail={[
              { name: c.breadcrumb, href: "/modeller" },
              { name: model.name, href: `/modeller/${model.slug}` },
            ]}
          />
          <div className={styles.layout}>
            <header className={styles.title}>
              <p className="text-sm font-medium text-brand-300">
                {model.brand}, {model.format[lang]}
              </p>
              <h1 className="mt-3 min-w-0 text-balance font-display t-h1 font-extrabold tracking-display text-paper">
                {lang === "da" ? "Brugt" : "Refurbished"} {model.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-paper/85 sm:text-lg">
                {model.tagline[lang]}
              </p>
            </header>

            <div className={styles.media}>
              {galleryImages?.length ? (
                <ModelGallery
                  key={model.slug}
                  images={galleryImages}
                  lang={lang}
                  name={model.name}
                  note={c.imageNote}
                />
              ) : media ? (
                <figure className={styles.illustration}>
                  <div className="relative aspect-[8/5] sm:aspect-[4/3]">
                    <Image
                      src={media.src}
                      alt={media.alt[lang]}
                      width={media.width}
                      height={media.height}
                      priority
                      fetchPriority="high"
                      sizes="(min-width: 1536px) 43vw, (min-width: 1024px) 49vw, 92vw"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <figcaption className="border-t border-ink-200 px-4 py-3 text-xs leading-5 text-ink-600">
                    {lang === "da"
                      ? "Illustration af udstyrstypen. Udseende og konfiguration afhænger af den konkrete enhed."
                      : "Illustration of the equipment type. Appearance and configuration depend on the actual unit."}
                  </figcaption>
                </figure>
              ) : (
                <div className={styles.reference} data-model-reference>
                  <p className="text-sm font-semibold text-ink-600">
                    {lang === "da" ? "Modelreference" : "Model reference"}
                  </p>
                  <div className="py-8 sm:py-12">
                    <p className="mb-2 text-sm font-semibold text-brand-700">{model.brand}</p>
                    <p
                      className={`${styles.referenceName} font-display t-h1 font-extrabold tracking-display`}
                    >
                      {referenceName}
                    </p>
                    <p className="mt-4 text-base text-ink-600">{model.format[lang]}</p>
                  </div>
                  <p className="max-w-md border-t border-ink-200 pt-4 text-sm leading-6 text-ink-600">
                    {lang === "da"
                      ? "Et verificeret frontfoto af denne model er endnu ikke tilføjet."
                      : "A verified front photo of this model has not been added yet."}
                  </p>
                </div>
              )}
            </div>

            <div className={styles.decision}>
              {quickFacts.length > 0 && (
                <dl className={`${styles.facts} border-y border-white/15 py-4`}>
                  {quickFacts.map((fact) => (
                    <div key={fact.label} className="min-w-0">
                      <dt className="text-xs font-medium leading-5 text-paper/65">{fact.label}</dt>
                      <dd className="mt-1 break-words text-sm font-semibold leading-5 text-paper">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <PriceOnRequest
                lang={lang}
                equipment={model.name}
                accessory={model.group === "skaerme" || model.group === "docking"}
                className="mt-5"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-1 text-xs leading-5 text-paper/65">
                <a
                  href="#model-considerations"
                  className="inline-flex min-h-11 items-center font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
                >
                  {c.watchOut}
                </a>
                <p>
                  {lang === "da" ? "Opdateret" : "Updated"}{" "}
                  <time dateTime={pageUpdated("/modeller/[slug]")}>
                    {formatDate(pageUpdated("/modeller/[slug]"), lang)}
                  </time>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {supplementalPhotos.length > 0 && (
        <section className="pb-8">
          <Container>
            <details className="group rounded-xl border border-white/15 px-5 sm:px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <h2 className="text-base font-semibold text-paper">
                  {lang === "da"
                    ? "Referencefotos af modellens underside"
                    : "Reference photos of the model’s underside"}
                </h2>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-brand-300 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <div className="mx-auto max-w-2xl pb-6">
                <ModelGallery
                  key={`${model.slug}-reference`}
                  images={supplementalPhotos}
                  lang={lang}
                  name={model.name}
                  note={c.imageNote}
                />
              </div>
            </details>
          </Container>
        </section>
      )}

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

              <div id="model-considerations" className="plate scroll-mt-28 p-5 sm:p-6">
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

            <details className="group plate overflow-hidden" id="model-specifications">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 sm:px-6 [&::-webkit-details-marker]:hidden">
                <h2 className="font-display t-h3 font-bold tracking-tight text-paper">
                  {c.configTitle}
                </h2>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-brand-300 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <div className="border-t border-white/10 px-5 py-4 sm:px-6">
                <p className="mt-1 text-sm leading-[1.6] text-paper/75">{c.configBody}</p>
                <p className="mt-3 text-sm leading-6 text-paper/85">{modelLead(model, lang)}</p>
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
            </details>

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

      <RetailLinks model={model} lang={lang} />

      {related.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
          <Container>
            <div className="max-w-6xl xl:max-w-none">
              <h2 className="font-display t-h3 font-bold tracking-tight text-paper">{c.related}</h2>
              {/* The catalogue's own rows, so a model looks the same here as in
                  the list the buyer came from. */}
              <RelatedModelRows
                lang={lang}
                entries={modelCatalogueEntries(related, lang).map((entry) => ({
                  ...entry,
                  fragmentId: undefined,
                }))}
              />
              {category && peers.length > related.length && (
                <Link
                  href={localePath(`/produkter/${category.slug}`, lang)}
                  className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
                >
                  {lang === "da"
                    ? `Se alle ${lowerFirst(category.name.da)}`
                    : `See all ${lowerFirst(category.name.en)}`}
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
