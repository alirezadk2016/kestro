import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Smartphone, Watch, ArrowUpRight, ChevronDown } from "lucide-react";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLaptopRecommendations from "@/components/ExternalLaptopRecommendations";
import ProductDisclosure from "@/components/ProductDisclosure";
import CtaSection from "@/components/CtaSection";
import { categories, getCategory } from "@/lib/categories";
import { getModelsForCategory } from "@/lib/models";
import { getCategoryMark } from "@/lib/category-marks";
import CraftMark from "@/components/CraftMark";
import { formatDate, localePath, metaFor, langs, type Lang, lowerFirst } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import FaqSchema from "@/components/FaqSchema";
import { categoryFaqs, categorySources } from "@/lib/category-copy";
import ModelCatalogue from "@/components/ModelCatalogue";
import { catalogueOrder } from "@/lib/model-order";
import FactNote from "@/components/FactNote";

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
  return langs.flatMap((lang) => categories.map((category) => ({ lang, slug: category.slug })));
}

const copy = {
  da: {
    breadcrumbLabel: "Brødkrumme",
    breadcrumbHub: "Produkter",
    brandsTitle: "Mærker vi typisk arbejder med",
    brandsBodyPre:
      "Vi skaffer udstyret til hver ordre og er derfor ikke bundet til bestemte mærker. Det er typisk disse, vi kan skaffe inden for",
    brandsNote:
      "Mangler I et bestemt mærke eller en bestemt model? Spørg os – vi kan ofte skaffe det.",
    modelsTitle: "Sammenlign modelserier",
    modelsBody: "Modelreferencer · konfiguration og stand afklares ved forespørgsel.",
    stockNote: "Eksemplerne er ikke en lagerliste.",
    allModels: "Sammenlign på tværs af udstyrstyper",
    priceNote: "Prisen afhænger af konfiguration, stand og antal.",
    useCases: "Typiske anvendelser",
    specs: "Specifikationer",
    other: "Andre kategorier",
    readMore: "Læs også",
  },
  en: {
    breadcrumbLabel: "Breadcrumb",
    breadcrumbHub: "Products",
    brandsTitle: "Brands we usually work with",
    brandsBodyPre:
      "We source per order, so we are not tied to particular brands. These are the ones we can normally get for",
    brandsNote: "Missing a particular brand or model? Ask us — we can often get it.",
    modelsTitle: "Compare model ranges",
    modelsBody: "Model references · configuration and condition are clarified on enquiry.",
    stockNote: "These examples are not a stock list.",
    allModels: "Compare across equipment types",
    priceNote: "The price depends on configuration, condition and quantity.",
    useCases: "Typical uses",
    specs: "Specifications",
    other: "Other categories",
    readMore: "Read also",
  },
} satisfies Record<Lang, Record<string, string>>;

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const category = getCategory(params.slug);
  if (!category) return {};

  return {
    title: category.metaTitle[params.lang],
    description: category.metaDescription[params.lang],
    ...metaFor(`/produkter/${category.slug}`, params.lang),
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const category = getCategory(params.slug);
  if (!category) notFound();
  const isPhones = category.slug === "smartphones";
  const isLaptops = category.slug === "baerbare-computere";

  const others = categories.filter((c) => c.slug !== category.slug);
  const categoryModels = catalogueOrder(getModelsForCategory(category.slug));
  const pagePath = `/produkter/${category.slug}`;
  const pageUrl = `${SITE_ORIGIN}${localePath(pagePath, lang)}`;
  const collectionId = `${pageUrl}#collection`;
  const faqItems = categoryFaqs(category);
  const primaryFaqs = faqItems.filter((faq) => faq.primary);
  const secondaryFaqs = faqItems.filter((faq) => !faq.primary);
  const renderQuestion = (faq: (typeof faqItems)[number]) => (
    <details key={faq.question.da} className="sheet group/question px-5 sm:px-6">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <h3 className="text-base font-semibold leading-snug text-ink-900 group-open/question:text-brand-700 group-hover/question:text-brand-700">
          {faq.question[lang]}
        </h3>
        <ChevronDown
          className="h-5 w-5 flex-none text-ink-600 transition-transform duration-150 group-open/question:rotate-180"
          strokeWidth={2}
          aria-hidden="true"
        />
      </summary>
      <p className="pb-5 pr-2 text-base leading-[1.7] text-ink-700 sm:pr-9">{faq.answer[lang]}</p>
    </details>
  );

  /*
   * The category as a collection, not just a page with a breadcrumb.
   *
   * Model pages already publish Product. What was missing was anything saying
   * which products this page collects, so the commercial tree read as a set of
   * unconnected product pages under some prose. ItemList is what ties them
   * together, and the positions come from the same list the page renders below,
   * so the markup cannot name a model the page does not show.
   *
   * Only where there is a list to describe. Two categories carry no popular
   * models — we hold no stock and source per order, so a category without a
   * models block is not broken — and an empty ItemList would be markup
   * describing nothing.
   */
  /*
   * The list of models, as the page's main entity.
   *
   * This was a second CollectionPage with its own @id, holding the list as
   * its mainEntity — while PageSchema already describes this URL as a
   * CollectionPage (#webpage) and points its mainEntity here. Two page
   * entities for one URL, one of them the main entity of the other: a
   * validator reads it as two pages. The thing the page is about is the list,
   * so the node is the list.
   */
  const collectionJsonLd = categoryModels.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": collectionId,
        name: category.name[lang],
        numberOfItems: categoryModels.length,
        itemListElement: categoryModels.map((model, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: model.name,
          url: `${SITE_ORIGIN}${localePath(`/modeller/${model.slug}`, lang)}`,
        })),
      }
    : null;

  const useCasesSection = (
    <ProductDisclosure
      enabled={isLaptops}
      id="laptop-buying-help"
      title={
        lang === "da"
          ? "Hvilken firmabærbar passer til arbejdet?"
          : "Which company laptop fits the work?"
      }
    >
      <section className="border-t border-white/10 py-10 sm:py-20">
        <Container>
          <div className={isLaptops ? "" : "split max-w-3xl"}>
            {!isLaptops && (
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                {c.useCases}
              </h2>
            )}
            {!isPhones && (
              <p className="mb-6 text-base leading-7 text-paper/85">{category.intro[lang]}</p>
            )}
            <dl className={isLaptops ? "grid gap-6 md:grid-cols-2" : "mt-8 space-y-6"}>
              {category.useCases.map((useCase) => (
                <div key={useCase.title.da} className="relative pl-8">
                  <dt className="text-base font-semibold leading-6 text-paper">
                    <Check
                      aria-hidden="true"
                      className="absolute left-0 top-1 h-4 w-4 text-brand-300"
                      strokeWidth={2}
                    />
                    {useCase.title[lang]}
                  </dt>
                  <dd className="mt-1 text-base leading-7 text-paper/75">
                    {useCase.description[lang]}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="plate mt-10 p-6">
              <h3 className="text-base font-semibold text-paper">{c.specs}</h3>
              <p className="mt-2 text-base leading-[1.75] text-paper/75">
                {category.specNote[lang]}
              </p>
            </div>
            {isLaptops && (
              <Link
                href={localePath("/vejledninger/tjek-brugt-baerbar-foer-koeb", lang)}
                className="mt-5 inline-flex min-h-11 items-center font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
              >
                {lang === "da"
                  ? "Vælg efter behov og budget: læs købsguiden"
                  : "Choose around needs and budget: read the buying guide"}
              </Link>
            )}
          </div>
        </Container>
      </section>
    </ProductDisclosure>
  );

  /* The range, in the open and first: what Kestro sources, as a catalogue a
     buyer can search, filter and compare (components/ModelCatalogue.tsx). On the laptop
     page it used to follow the external recommendations, so the first thing
     a buyer met was where else to buy; now the models come first and "buy
     elsewhere meanwhile" follows them. */
  const modelsSection =
    categoryModels.length > 0 ? (
      <section id="models" className="scroll-mt-24 bg-ink-900 pb-8 pt-2 sm:py-10">
        <Container>
          <div id={isLaptops ? "laptop-model-library" : undefined} className="scroll-mt-28">
            <h2 className="sr-only font-display t-h2 font-extrabold text-paper sm:not-sr-only">
              {c.modelsTitle}
            </h2>
          </div>

          <div>
            <ModelCatalogue models={categoryModels} lang={lang} />
            <p className="mt-4 text-sm leading-6 text-paper/65">
              {c.stockNote}{" "}
              {lang === "da"
                ? "Billederne er modelfotos eller illustrationer af formatet – ikke den maskine, I får."
                : "The pictures are model photos or illustrations of the format — not the machine you get."}
            </p>

            <Link
              href={localePath("/modeller", lang)}
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
            >
              {c.allModels}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>
    ) : null;

  return (
    <>
      <PageSchema
        lang={lang}
        route="/produkter/[slug]"
        type="CollectionPage"
        pagePath={pagePath}
        name={category.name[lang]}
        description={category.metaDescription[lang]}
        sources={
          isLaptops
            ? [
                ...categorySources(category),
                "externalBusinessT14",
                "externalBusinessEliteBook",
                "externalBusinessLatitude",
                "dustinBusinessBuying",
              ]
            : categorySources(category)
        }
        primaryEntityId={collectionJsonLd ? collectionId : undefined}
      />

      <section className="border-b border-white/10 bg-brand-950 pb-5 pt-3 sm:pb-7 sm:pt-6">
        <Container>
          <Breadcrumbs
            lang={lang}
            trail={[
              { name: c.breadcrumbHub, href: "/produkter" },
              { name: category.name[lang], href: `/produkter/${category.slug}` },
            ]}
          />
          {collectionJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
              }}
            />
          )}
          <div className="mt-3 grid gap-3 lg:grid-cols-12 lg:items-center lg:gap-12">
            <h1 className="t-h1 font-display font-extrabold tracking-display text-paper lg:col-span-6">
              {(category.h1 ?? category.name)[lang]}
            </h1>
            <div className="lg:col-span-6">
              <p className="text-sm leading-6 text-paper/85 sm:text-base">
                {category.tagline[lang]}.
              </p>
              {/* On its own line: inside the sentence its 44px tap height
                  pushed the paragraph's lines 20px apart on a phone. */}
              {isLaptops && (
                <a
                  href="#external-laptop-recommendations"
                  className="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-semibold text-brand-300 hover:text-paper"
                >
                  {lang === "da" ? "Køb hos andre" : "Buy elsewhere"}
                </a>
              )}
              <p className="mt-1 text-xs leading-5 text-paper/65">
                {categoryModels.length > 0
                  ? c.modelsBody
                  : lang === "da"
                    ? "Fortæl os om antal, apps og budget. Vi afklarer mulighederne i et skriftligt tilbud."
                    : "Tell us your quantity, apps and budget. We clarify the options in a written quote."}
              </p>
              {categoryModels.length === 0 && (
                <div className="mt-3">
                  <Button
                    href={localePath(
                      `/tilbud?model=${encodeURIComponent(category.name[lang])}`,
                      lang,
                    )}
                    className="w-auto"
                  >
                    {lang === "da" ? "Beskriv jeres behov" : "Describe your needs"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {modelsSection}

      {isLaptops && (
        <ProductDisclosure
          enabled
          id="laptop-retailer-options"
          title={
            lang === "da"
              ? "Brug for en nu? Se eksterne forhandlere"
              : "Need one now? See external retailers"
          }
        >
          <ExternalLaptopRecommendations lang={lang} />
        </ProductDisclosure>
      )}

      {isLaptops && useCasesSection}

      {!isLaptops && (
        <ProductDisclosure
          enabled={categoryModels.length > 0}
          id={category.slug + "-brands"}
          title={c.brandsTitle}
        >
          <section className="bg-ink-900 py-10 sm:py-20">
            <Container>
              {isPhones && (
                <p className="mb-8 max-w-3xl text-base leading-[1.75] text-paper/75">
                  {category.intro[lang]}
                </p>
              )}
              <div className={isPhones ? "phone-brands" : "split max-w-3xl"}>
                {categoryModels.length === 0 && (
                  <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                    {c.brandsTitle}
                  </h2>
                )}
                <p className="mt-3 text-base leading-[1.75] text-paper/75">
                  {c.brandsBodyPre} {lowerFirst(category.name[lang])}:
                </p>
                {/* Brands were lit pills: the same capsule as the clickable
                    category links further down, but not links, so each looked
                    like a button that did nothing. Where the category has models
                    they are a plain list of names; where it has none (tablets),
                    each name asks for a price on that brand, as phones do. */}
                <ul
                  className={
                    isPhones
                      ? "phone-brand-links"
                      : categoryModels.length === 0
                        ? "mt-6 flex flex-wrap gap-2"
                        : "mt-5 flex flex-wrap gap-x-5 gap-y-2 text-base font-medium text-paper/85"
                  }
                >
                  {category.brands.map((brand) => (
                    <li key={brand}>
                      {!isPhones && categoryModels.length === 0 ? (
                        <Link
                          href={localePath(`/tilbud?model=${encodeURIComponent(brand)}`, lang)}
                          aria-label={`${lang === "da" ? "Få pris på" : "Get a price for"} ${brand}`}
                          className="plate-sm inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold text-paper/85 transition-colors hover:text-brand-300"
                        >
                          {brand}
                          <span aria-hidden="true" className="text-brand-300">
                            &rarr;
                          </span>
                        </Link>
                      ) : isPhones ? (
                        <Link
                          href={localePath(`/tilbud?model=${encodeURIComponent(brand)}`, lang)}
                          aria-label={`${lang === "da" ? "Spørg om" : "Ask about"} ${brand}`}
                        >
                          {brand.includes("Watch") ? (
                            <Watch size={22} strokeWidth={1.6} aria-hidden="true" />
                          ) : (
                            <Smartphone size={22} strokeWidth={1.6} aria-hidden="true" />
                          )}
                          <span>{brand}</span>
                          <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                      ) : (
                        brand
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-2xl text-sm leading-[1.6] text-paper/65">{c.brandsNote}</p>
              </div>
            </Container>
          </section>
        </ProductDisclosure>
      )}
      {!isLaptops && useCasesSection}

      <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="split max-w-3xl">
            <h2 className="font-display t-h3 font-bold tracking-tight text-paper">{c.other}</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {others.map((other) => {
                return (
                  <li key={other.slug}>
                    <Link
                      href={localePath(`/produkter/${other.slug}`, lang)}
                      className="plate-sm inline-flex min-h-[44px] items-center gap-2 rounded-full pl-2 pr-4 text-sm font-medium text-paper/85 transition-colors hover:text-brand-300"
                    >
                      <CraftMark name={getCategoryMark(other.slug)} className="h-5 w-5" />
                      {other.name[lang]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Secondary reading remains one deliberate step away, with every
                established guide link in the server-rendered document. */}
            {category.guides && category.guides.length > 0 && (
              <details
                id="category-buying-guides"
                className="group/guides mt-6 border-t border-white/10"
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold text-paper">
                    {lang === "da"
                      ? "Købsguider og kompatibilitet"
                      : "Buying guides and compatibility"}
                  </h3>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className="shrink-0 text-brand-300 transition-transform duration-150 group-open/guides:rotate-180"
                  />
                </summary>
                <ul className="flex flex-wrap gap-2 pb-3">
                  {category.guides.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={localePath(link.href, lang)}
                        className="plate-sm inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-semibold text-paper/85 transition hover:text-paper"
                      >
                        {link.label[lang]}
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </Container>
      </section>

      <section className="border-y border-ink-200 bg-paper-dim py-10 text-ink-900 sm:py-16">
        <FaqSchema lang={lang} items={faqItems} />
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="t-h2 text-balance font-display font-extrabold tracking-display text-ink-900">
                {lang === "da"
                  ? `Spørgsmål om ${lowerFirst(category.name.da)}`
                  : `Questions about ${lowerFirst(category.name.en)}`}
              </h2>
              <p className="mt-4 text-base leading-7 text-ink-700">
                {lang === "da" ? "Mangler der et spørgsmål? " : "Don't see your question? "}
                <Link
                  href={localePath("/kontakt", lang)}
                  className="inline-flex min-h-11 items-center font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-600"
                >
                  {lang === "da" ? "Skriv til os" : "Write to us"}
                </Link>
              </p>
            </div>
            <div className="space-y-2.5 lg:col-span-8">
              {primaryFaqs.map(renderQuestion)}
              {secondaryFaqs.length > 0 && (
                <details data-category-more-faq className="group/more border-t border-ink-200 pt-1">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold text-brand-700 [&::-webkit-details-marker]:hidden">
                    <span>{lang === "da" ? "Flere spørgsmål" : "More questions"}</span>
                    <ChevronDown
                      aria-hidden="true"
                      size={18}
                      className="shrink-0 transition-transform duration-150 group-open/more:rotate-180"
                    />
                  </summary>
                  <div className="space-y-2.5 pb-2">{secondaryFaqs.map(renderQuestion)}</div>
                </details>
              )}
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <p className="pb-3 text-xs leading-5 text-paper/65">
          {lang === "da" ? "Opdateret" : "Updated"}{" "}
          <time dateTime={pageUpdated("/produkter/[slug]")} className="tabular-nums">
            {formatDate(pageUpdated("/produkter/[slug]"), lang)}
          </time>
        </p>
      </Container>

      {/* Windows sources only on the categories that run it. */}
      <FactNote lang={lang} ids={categorySources(category)} />

      <CtaSection lang={lang} />
    </>
  );
}
