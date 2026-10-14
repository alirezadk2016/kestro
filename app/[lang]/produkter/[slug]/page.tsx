import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderArt from "@/components/HeaderArt";
import CtaSection from "@/components/CtaSection";
import { categories, getCategory } from "@/lib/categories";
import { getModel, getModelsForCategory } from "@/lib/models";
import { getCategoryMark } from "@/lib/category-marks";
import MarkTile from "@/components/MarkTile";
import CraftMark from "@/components/CraftMark";
import { formatDate, localePath, metaFor, langs, type Lang, lowerFirst } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import Faq from "@/components/Faq";
import { categoryFaqs, categoryLead, categorySources } from "@/lib/category-copy";
import SpecChips from "@/components/SpecChips";
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
    imageNote:
      "Billederne viser modeltypen; stand og specifikation aftales for den enkelte ordre.",
    seeAllSpecs: "Specifikationer for {model}",
    modelsTitle: "Modeller vi ofte skaffer",
    modelsBody:
      "Erhvervsmodeller, vi kender godt. Klik ind for specifikationer og hvad de egner sig til.",
    allModels: "Se hele modeloversigten",
    cardAction: "Se specifikationer",
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
      "We source per order, so we are not tied to particular brands. These are the ones we can normally get within",
    brandsNote: "Missing a particular brand or model? Ask us — we can often get it.",
    imageNote:
      "The photos show the model type; condition and specification are agreed per order.",
    seeAllSpecs: "{model} specifications",
    modelsTitle: "Models we often source",
    modelsBody:
      "Business models we know well. Click through for specifications and what they suit.",
    allModels: "See the full model overview",
    cardAction: "See specifications",
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
};

export default async function CategoryPage(props: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const category = getCategory(params.slug);
  if (!category) notFound();

  const others = categories.filter((c) => c.slug !== category.slug);
  const exampleModel = category.exampleModel ? getModel(category.exampleModel) : undefined;
  const categoryModels = getModelsForCategory(category.slug);
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
  const collectionJsonLd = categoryModels.length
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": collectionId,
        name: category.name[lang],
        description: category.metaDescription[lang],
        url: pageUrl,
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        about: { "@id": `${SITE_ORIGIN}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: categoryModels.length,
          itemListElement: categoryModels.map((model, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: model.name,
            url: `${SITE_ORIGIN}${localePath(`/modeller/${model.slug}`, lang)}`,
          })),
        },
      }
    : null;

  return (
    <>
      <PageSchema
        lang={lang}
        route="/produkter/[slug]"
        type="CollectionPage"
        pagePath={pagePath}
        name={category.name[lang]}
        description={category.metaDescription[lang]}
        sources={categorySources(category)}
        primaryEntityId={collectionJsonLd ? collectionId : undefined}
      />

      {/* Lit by the site's own wash. Two blurred orbs sat here: one was
          bg-brand-950 on bg-brand-950 and drew nothing, the other was the
          generic glow every generated page has. */}
      <section
        className={`lit overflow-hidden bg-brand-950 py-12 text-white sm:py-20 ${
          CATEGORY_ART[category.slug] ? "max-md:-mt-[65px] max-md:pt-0" : ""
        }`}
      >
        <Container className="relative">
          {/* Text in the left seven columns, the category's picture in the
              right five from lg. On a phone the picture is the header's
              ground, from under the glass bar, and the trail, title and lead
              sit on glass over its foot, as the front page's words sit over
              the room. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-14">
            <div
              className={`max-w-3xl lg:col-span-7 ${
                CATEGORY_ART[category.slug] ? "glass-card relative z-10 max-md:-mt-14" : ""
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

            {CATEGORY_ART[category.slug] && (
              <HeaderArt
                src={CATEGORY_ART[category.slug].src}
                width={1200}
                height={675}
                alt={CATEGORY_ART[category.slug].alt[lang]}
                className="mt-8 aspect-[16/9] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-16 lg:self-start"
                bleed
              />
            )}

            <div className="max-w-3xl lg:col-span-7">
              <p className="mt-8 text-base leading-[1.75] text-paper/75">{category.intro[lang]}</p>
              <p className="label mt-6 text-paper/65">
                {lang === "da" ? "Opdateret" : "Updated"}{" "}
                <time
                  dateTime={pageUpdated("/produkter/[slug]")}
                  className="tabular-nums text-paper/85"
                >
                  {formatDate(pageUpdated("/produkter/[slug]"), lang)}
                </time>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.brandsTitle}
            </h2>
            <p className="mt-3 text-base leading-[1.75] text-paper/75">
              {c.brandsBodyPre} {lowerFirst(category.name[lang])}:
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {category.brands.map((brand) => (
                <li
                  key={brand}
                  className="plate-sm rounded-full px-3.5 py-1.5 text-sm text-paper/85"
                >
                  {brand}
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-2xl text-sm leading-[1.6] text-paper/65">{c.brandsNote}</p>
          </div>
        </Container>
      </section>

      {exampleModel?.images && (
        <section className="py-10 sm:py-20">
          <Container>
            {/* Machine on one side, what it is on the other. Stacked, the
                gallery alone was a screen and a half with the right half of
                the window empty. */}
            <div className="grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-6">
                <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                  {exampleModel.name}
                </h2>
                <p className="mt-3 text-base leading-[1.75] text-paper/75">
                  {exampleModel.intro[lang]}
                </p>

                <p className="mt-5 text-sm leading-[1.6] text-paper/65">{c.imageNote}</p>

                <Link
                  href={localePath(`/modeller/${exampleModel.slug}`, lang)}
                  className="mt-5 inline-block py-2.5 text-base font-semibold leading-7 text-brand-300 transition hover:text-paper"
                >
                  {/* The model without its brand: with "Lenovo" in it the label
                      ran to two lines at 375px, and the brand is in the heading
                      directly above. */}
                  {c.seeAllSpecs.replace(
                    "{model}",
                    exampleModel.name.replace(`${exampleModel.brand} `, ""),
                  )}{" "}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {/*
                Lead image, then the rest in an even grid – the renders sit on
                white, so object-contain keeps ports and keyboard uncropped,
                which is the part a buyer actually looks at.
              */}
              <div className="space-y-3 sm:space-y-4 lg:col-span-6">
                {/* The photographs are studio shots on white. On a navy page a pure
                    white tile was the brightest thing on screen; on the brand's light
                    neutral, with the photo multiplied in, the studio white becomes
                    the paper the site's answers already sit on. */}
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-paper-dim ring-1 ring-white/10 shadow-lg shadow-black/25">
                  <Image
                    src={exampleModel.images[0].src}
                    quality={90}
                    alt={exampleModel.images[0].alt[lang]}
                    width={1179}
                    height={1120}
                    className="h-full w-full object-contain mix-blend-multiply p-3 sm:p-6"
                    sizes="(max-width: 1024px) 92vw, 550px"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {exampleModel.images.slice(1).map((img) => (
                    <div
                      key={img.src}
                      className="aspect-[4/3] overflow-hidden rounded-xl bg-paper-dim ring-1 ring-white/10 shadow-md shadow-black/25"
                    >
                      <Image
                        src={img.src}
                        quality={90}
                        alt={img.alt[lang]}
                        width={1179}
                        height={1120}
                        className="h-full w-full object-contain mix-blend-multiply p-2 sm:p-3"
                        sizes="(max-width: 640px) 30vw, 175px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {categoryModels.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
                {c.modelsTitle}
              </h2>
              <p className="mt-3 text-base leading-[1.75] text-paper/75">{c.modelsBody}</p>
              <p className="mt-1.5 text-sm leading-[1.6] text-paper/65">{c.priceNote}</p>
            </div>

            {/* A shelf to swipe on a phone (.rail), two columns from md, three
                from lg across the full container — nine laptops ran as one
                long two-column list beside an empty half of the page. */}
            <div>
              <ul className="rail mt-8 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {categoryModels.map((model) => (
                  <li key={model.slug}>
                    <Link
                      href={localePath(`/modeller/${model.slug}`, lang)}
                      className="plate plate-lift group flex h-full flex-col p-5"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-paper/65">
                        {model.format[lang]}
                      </span>
                      <span className="mt-1.5 text-base font-semibold text-paper group-hover:text-paper">
                        {model.name}
                      </span>
                      <span className="mt-1.5 text-sm leading-6 text-paper/75">
                        {model.tagline[lang]}
                      </span>
                      <SpecChips model={model} lang={lang} />
                      <span className="flex-1" />
                      {/* What tapping the card does. It said "Få et tilbud" here,
                          as plain text on a card that opens the model page. */}
                      <span className="mt-3 inline-flex items-center gap-1.5 border-t border-white/10 pt-3 text-sm font-semibold text-brand-300">
                        {c.cardAction}
                        <span aria-hidden="true">&rarr;</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

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
      )}

      <section className="border-t border-white/10 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-paper">
              {c.useCases}
            </h2>

            {/* A <div> in a <dl> holds only <dt> and <dd>; the mark goes in the
                term, hung in the row's left gutter. */}
            <dl className="mt-8 space-y-6">
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
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
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
