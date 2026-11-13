import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, Smartphone, Watch, ArrowUpRight } from "lucide-react";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderArt from "@/components/HeaderArt";
import ExternalLaptopRecommendations from "@/components/ExternalLaptopRecommendations";
import ProductDisclosure from "@/components/ProductDisclosure";
import CtaSection from "@/components/CtaSection";
import { categories, getCategory } from "@/lib/categories";
import { getModelsForCategory } from "@/lib/models";
import { getCategoryMark } from "@/lib/category-marks";
import MarkTile from "@/components/MarkTile";
import CraftMark from "@/components/CraftMark";
import { formatDate, localePath, metaFor, langs, type Lang, lowerFirst } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import Faq from "@/components/Faq";
import { categoryFaqs, categoryLead, categorySources } from "@/lib/category-copy";
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
    modelsTitle: "Modeller vi skaffer",
    modelsBody: "Sammenlign specifikationer og begrænsninger, når I har afklaret arbejdsopgaverne.",
    stockNote: "Eksemplerne er ikke en lagerliste.",
    allModels: "Se hele modeloversigten",
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
    modelsTitle: "Models we source",
    modelsBody: "Compare specifications and limitations once the work requirements are clear.",
    stockNote: "These examples are not a stock list.",
    allModels: "See the full model overview",
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

/*
 * The artwork the site already has for a category, with the alt text the
 * front page's cards use for the same picture. Mini PCs share the desktop
 * render (it shows a tower and a mini PC side by side) and docks share the
 * monitor one (a monitor, a keyboard and a dock). Tablets and phones have
 * none, and get no picture rather than a borrowed one.
 */
const CATEGORY_ART: Record<string, { src: string; alt: { da: string; en: string } }> = {
  "baerbare-computere": {
    src: "/cards/cat-laptops.webp",
    alt: {
      da: "Åben bærbar erhvervscomputer set fra siden",
      en: "An open business laptop seen from the side",
    },
  },
  "stationaere-computere": {
    src: "/cards/cat-desktops.webp",
    alt: {
      da: "Stationær computer og en mini-pc side om side",
      en: "A desktop tower and a mini PC side by side",
    },
  },
  "mini-pc": {
    src: "/cards/cat-desktops.webp",
    alt: {
      da: "Stationær computer og en mini-pc side om side",
      en: "A desktop tower and a mini PC side by side",
    },
  },
  skaerme: {
    src: "/cards/cat-monitors.webp",
    alt: {
      da: "Bredformatskærm med tastatur og en dockingstation",
      en: "A widescreen monitor with a keyboard and a docking station",
    },
  },
  dockingstationer: {
    src: "/cards/cat-monitors.webp",
    alt: {
      da: "Bredformatskærm med tastatur og en dockingstation",
      en: "A widescreen monitor with a keyboard and a docking station",
    },
  },
  smartphones: {
    src: "/graphics/smartphones.webp",
    alt: {
      da: "Illustration af smartphones og et smartwatch på et arbejdsbord",
      en: "Illustrative smartphones and a smartwatch on a workbench",
    },
  },
};

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
            {isLaptops && (
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
      <section
        id="models"
        className={`scroll-mt-24 border-t border-white/10 bg-ink-900 ${isLaptops ? "py-6" : "py-10"} sm:py-20`}
      >
        <Container>
          <div
            id={isLaptops ? "laptop-model-library" : undefined}
            className="split max-w-3xl scroll-mt-28"
          >
            <h2
              className={`${isLaptops ? "sr-only sm:not-sr-only" : ""} text-balance font-display t-h2 font-extrabold tracking-display text-paper`}
            >
              {c.modelsTitle}
            </h2>
            <p
              className={`${isLaptops ? "sr-only sm:not-sr-only" : ""} mt-3 text-base leading-[1.75] text-paper/75`}
            >
              {c.modelsBody}
            </p>
            {!isLaptops && (
              <p className="mt-1.5 text-sm leading-[1.6] text-paper/65">{c.priceNote}</p>
            )}
          </div>

          <div>
            <p className="mt-3 text-sm leading-6 text-paper/65">{c.stockNote}</p>
            <ModelCatalogue models={categoryModels} lang={lang} />
            <p className="mt-4 text-sm leading-6 text-paper/65">
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

      {isLaptops ? (
        <section className="bg-brand-950 pb-8 pt-6 sm:pb-10 sm:pt-10">
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
            <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start lg:gap-12">
              <div className="lg:col-span-6">
                <h1 className="t-h1 font-display font-extrabold tracking-display text-paper">
                  {(category.h1 ?? category.name)[lang]}
                </h1>
                <p className="mt-4 text-xs leading-5 text-paper/65">
                  {lang === "da" ? "Opdateret" : "Updated"}{" "}
                  <time dateTime={pageUpdated("/produkter/[slug]")}>
                    {formatDate(pageUpdated("/produkter/[slug]"), lang)}
                  </time>
                </p>
              </div>
              <div className="lg:col-span-6">
                <p className="hidden text-base leading-7 text-paper/85 sm:block">
                  {categoryLead(category, lang)}
                </p>
                <p className="text-base leading-7 text-paper/85 sm:hidden">
                  {lang === "da"
                    ? "Til kontor, hjemmearbejde og startup."
                    : "For office work, home working and startup teams."}
                </p>
                {/* The models first; the way to buy one elsewhere today stays
                    one tap away, beside it. */}
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Button href="#models" className="w-auto">
                    {lang === "da" ? "Se modellerne" : "See the models"}
                  </Button>
                  <a
                    href="#external-laptop-recommendations"
                    className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap text-sm font-semibold text-brand-300 transition-colors hover:text-paper"
                  >
                    {lang === "da" ? "Køb hos andre" : "Buy elsewhere"}
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : (
        /* Lit by the site's own wash. Two blurred orbs sat here: one was
          bg-brand-950 on bg-brand-950 and drew nothing, the other was the
          generic glow every generated page has. */
        <section
          className={`lit overflow-hidden bg-brand-950 py-12 text-white sm:py-20 ${
            isPhones
              ? "product-phone-hero"
              : CATEGORY_ART[category.slug]
                ? "max-md:-mt-[65px] max-md:pt-0"
                : ""
          }`}
        >
          {isPhones && (
            <Image
              src={CATEGORY_ART.smartphones.src}
              width={1440}
              height={960}
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              alt={CATEGORY_ART.smartphones.alt[lang]}
              className="product-phone-image"
            />
          )}
          <Container className="relative">
            {/* Text in the left seven columns, the category's picture in the
              right five from lg. On a phone the picture is the header's
              ground, from under the glass bar, and the trail, title and lead
              sit on glass over its foot, as the front page's words sit over
              the room. */}
            <div
              className={
                isPhones ? "product-phone-copy" : "grid grid-cols-1 lg:grid-cols-12 lg:gap-x-14"
              }
            >
              <div
                className={`max-w-3xl lg:col-span-7 ${
                  CATEGORY_ART[category.slug] && !isPhones
                    ? "glass-card relative z-10 max-md:-mt-14"
                    : ""
                }`}
              >
                {/* The shared trail: "Forside / Produkter / Bærbare
                computere", visible and marked up from one list. The schema
                here already began at Forside while the visible trail did not,
                which is the mismatch BreadcrumbSchema warns about. */}
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
                {/* Mark and title on one row at every width, on the type scale.
                Stacked on a phone the 56px tile cost the first screen 80px,
                and the title was 3xl/4xl/5xl — 48px on a desktop, off the
                scale every other page title is on. */}
                <div className="mt-5 flex items-center gap-4 sm:gap-5">
                  <MarkTile name={getCategoryMark(category.slug)} size="lg" className="flex-none" />
                  <h1 className="min-w-0 text-balance font-display t-h1 font-extrabold tracking-display text-paper">
                    {(category.h1 ?? category.name)[lang]}
                  </h1>
                </div>
                <p className="mt-5 text-base leading-[1.65] text-paper/85 sm:text-lg">
                  {categoryLead(category, lang)}
                </p>
              </div>

              {CATEGORY_ART[category.slug] && !isPhones && (
                <HeaderArt
                  src={CATEGORY_ART[category.slug].src}
                  width={1200}
                  height={675}
                  alt={CATEGORY_ART[category.slug].alt[lang]}
                  className="mt-8 aspect-[16/9] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-16 lg:self-start"
                  bleed
                />
              )}

              {/* With no picture (tablets) the right five columns stood empty:
                half the header was dark glass on a desktop. The intro takes
                that column instead, beside the title, rather than a borrowed
                picture of something else. */}
              <div
                className={
                  CATEGORY_ART[category.slug] || isPhones
                    ? "max-w-3xl lg:col-span-7"
                    : "max-w-3xl lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end lg:[&>p:first-child]:mt-0"
                }
              >
                {!isPhones && (
                  <p className="mt-8 text-base leading-[1.75] text-paper/75">
                    {category.intro[lang]}
                  </p>
                )}
                <p className="label mt-6 text-paper/65">
                  {lang === "da" ? "Opdateret" : "Updated"}{" "}
                  <time
                    dateTime={pageUpdated("/produkter/[slug]")}
                    className="tabular-nums text-paper/85"
                  >
                    {formatDate(pageUpdated("/produkter/[slug]"), lang)}
                  </time>
                </p>
                {isPhones && (
                  <Button
                    href={localePath("/tilbud?model=Smartphones", lang)}
                    className="mt-7 w-full sm:w-auto"
                  >
                    {lang === "da" ? "Få et tilbud på firmatelefoner" : "Ask about business phones"}
                  </Button>
                )}
                {isLaptops && (
                  <Button href="#external-laptop-recommendations" className="mt-7 w-full sm:w-auto">
                    {lang === "da" ? "Se anbefalingerne" : "See recommendations"}
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

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
                <ul className={isPhones ? "phone-brand-links" : "mt-6 flex flex-wrap gap-2"}>
                  {category.brands.map((brand) => (
                    <li
                      key={brand}
                      className={
                        isPhones ? "" : "plate-sm rounded-full px-3.5 py-1.5 text-sm text-paper/85"
                      }
                    >
                      {isPhones ? (
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

            {/* The guides that belong to this category, in the same band as
                the other categories. They were a second band of their own
                ("Videre herfra") straight after this one: two rows of chips in
                two sections, each with its own heading and padding. */}
            {category.guides && category.guides.length > 0 && (
              <>
                <p className="eyebrow mt-10 text-brand-300">{c.readMore}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
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
              </>
            )}
          </div>
        </Container>
      </section>

      <Faq
        lang={lang}
        items={categoryFaqs(category)}
        title={{
          da: `Spørgsmål om ${lowerFirst(category.name.da)}`,
          en: `Questions about ${lowerFirst(category.name.en)}`,
        }}
      />

      {/* Windows sources only on the categories that run it. */}
      <FactNote lang={lang} ids={categorySources(category)} />

      <CtaSection lang={lang} />
    </>
  );
}
