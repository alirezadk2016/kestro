import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, Info } from "lucide-react";
import Container from "@/components/Container";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import PriceOnRequest from "@/components/PriceOnRequest";
import CtaSection from "@/components/CtaSection";
import { models, getModel } from "@/lib/models";
import { getCategory } from "@/lib/categories";
import { getCategoryIcon } from "@/lib/category-icons";
import { localePath, alternatesFor, langs, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

export function generateStaticParams() {
  return langs.flatMap((lang) => models.map((model) => ({ lang, slug: model.slug })));
}

const copy = {
  da: {
    breadcrumb: "Modeller",
    notStock:
      "Vi har den ikke på lager. Vi sourcer den til den enkelte ordre – fortæl os antal og hvad maskinerne skal bruges til, så vender vi tilbage med pris og leveringstid.",
    imageNote:
      "Billederne viser modeltypen. Stand, specifikationer og antal aftales for den enkelte ordre.",
    configTitle: "Typisk konfiguration",
    configBody:
      "Brugt hardware findes i mange sammensætninger. Tallene her viser, hvad modellen som regel er bygget i – den præcise konfiguration aftaler vi for jeres ordre.",
    goodFor: "God til",
    watchOut: "Vær opmærksom på",
    whyTitle: "Derfor peger vi ofte på denne model",
    ctaTitlePre: "Skal I bruge",
    ctaBody:
      "Fortæl os antal, hvad maskinerne skal bruges til, og hvornår I skal bruge dem. Så finder vi dem i vores leverandørnetværk og vender tilbage med et konkret bud – også hvis en anden model passer bedre til opgaven.",
    ctaButton: "Spørg om denne model",
    seeAlsoPre: "Se også alt, hvad vi skaffer inden for",
    related: "Andre modeller i samme klasse",
  },
  en: {
    breadcrumb: "Models",
    notStock:
      "We do not hold it in stock. We source it per order — tell us the quantity and what the machines are for, and we come back with price and lead time.",
    imageNote:
      "The photos show the model type. Condition, specifications and quantity are agreed per order.",
    configTitle: "Typical configuration",
    configBody:
      "Used hardware turns up in many configurations. The figures here show how the model is usually built — the exact configuration is agreed for your order.",
    goodFor: "Good for",
    watchOut: "Worth knowing",
    whyTitle: "Why we often point at this model",
    ctaTitlePre: "Do you need the",
    ctaBody:
      "Tell us the quantity, what the machines are for, and when you need them. We then find them in our supplier network and come back with a concrete proposal — including if another model suits the job better.",
    ctaButton: "Ask about this model",
    seeAlsoPre: "See everything else we source within",
    related: "Other models in the same class",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Metadata {
  const model = getModel(params.slug);
  if (!model) return {};

  return {
    title: model.metaTitle[params.lang],
    description: model.metaDescription[params.lang],
    alternates: alternatesFor(`/modeller/${model.slug}`, params.lang),
  };
}

export default function ModelPage({ params }: { params: { lang: Lang; slug: string } }) {
  const { lang } = params;
  const c = copy[lang];
  const model = getModel(params.slug);
  if (!model) notFound();

  const category = getCategory(model.category);
  const Icon = getCategoryIcon(model.category);
  const related = models.filter((m) => m.group === model.group && m.slug !== model.slug);

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
    name: model.name,
    brand: { "@type": "Brand", name: model.brand },
    category: category?.name[lang],
    description: model.intro[lang],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative overflow-hidden bg-brand-950 py-12 text-white sm:py-16 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-950/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl"
        />

        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <BreadcrumbSchema
              lang={lang}
              trail={[
                { name: c.breadcrumb, href: "/modeller" },
                { name: model.name, href: `/modeller/${model.slug}` },
              ]}
            />
            <nav
              aria-label={lang === "da" ? "Brødkrumme" : "Breadcrumb"}
              className="text-sm text-ink-400"
            >
              <Link
                href={localePath("/modeller", lang)}
                className="inline-flex min-h-[44px] items-center transition hover:text-white"
              >
                {c.breadcrumb}
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="text-ink-200">{model.name}</span>
            </nav>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                <Icon className="h-8 w-8 text-paper/70" strokeWidth={1.5} />
              </span>
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-paper/70">
                  {model.brand} · {model.format[lang]}
                </span>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {model.name}
                </h1>
                <p className="mt-2 text-base text-ink-300 sm:text-lg">{model.tagline[lang]}</p>
              </div>
            </div>

            <p className="mt-8 text-base leading-7 text-ink-300">{model.intro[lang]}</p>

            <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-ink-300">
              {c.notStock}
            </p>

            {/* The page describes the machine in detail and then used to say
                nothing about price, which leaves a buyer guessing whether this
                is a shop that forgot its prices. */}
            <PriceOnRequest lang={lang} className="mt-6" />
          </div>
        </Container>
      </section>

      {model.images && (
        <section className="py-14 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
              <div className="aspect-[4/3] overflow-hidden bg-white shadow-lg shadow-black/20 sm:aspect-[16/10]">
                <Image
                  src={model.images[0].src}
                  alt={model.images[0].alt[lang]}
                  width={1179}
                  height={1120}
                  className="h-full w-full object-contain p-3 sm:p-6"
                  sizes="(max-width: 768px) 92vw, 768px"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {model.images.slice(1).map((img) => (
                  <div
                    key={img.src}
                    className="aspect-square overflow-hidden bg-white shadow-md shadow-black/20"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt[lang]}
                      width={1179}
                      height={1120}
                      className="h-full w-full object-contain p-2 sm:p-4"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 250px"
                    />
                  </div>
                ))}
              </div>

              <p className="pt-1 text-sm leading-6 text-paper/55">{c.imageNote}</p>
            </div>
          </Container>
        </section>
      )}

      <section className={`py-14 sm:py-24 ${model.images ? "border-t border-white/10" : ""}`}>
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden border border-white/10">
              <div className="border-b border-white/10 bg-ink-900 px-5 py-4 sm:px-6">
                <h2 className="text-base font-semibold text-paper">{c.configTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-paper/65">{c.configBody}</p>
              </div>

              <dl className="divide-y divide-white/10">
                {model.specs.map((spec) => (
                  <div
                    key={spec.label.da}
                    className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-4"
                  >
                    <dt className="text-sm font-semibold text-paper">{spec.label[lang]}</dt>
                    <dd className="mt-1 text-sm leading-6 text-paper/65 sm:col-span-2 sm:mt-0">
                      {spec.value[lang]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <h2 className="mt-12 text-xl font-bold tracking-tight text-paper sm:text-2xl">
              {c.goodFor}
            </h2>
            <ul className="mt-5 space-y-3">
              {model.goodFor.map((item) => (
                <li key={item.da} className="flex gap-3 text-base leading-7 text-paper/65">
                  <Check className="mt-1.5 h-5 w-5 flex-shrink-0 text-brand-300" strokeWidth={2} />
                  {item[lang]}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-l-2 border-white/30 bg-white/5 p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-paper">
                <Info className="h-5 w-5 flex-shrink-0 text-paper/80" strokeWidth={2} />
                {c.watchOut}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {model.notes.map((note) => (
                  <li key={note.da} className="text-sm leading-6 text-paper/80">
                    {note[lang]}
                  </li>
                ))}
              </ul>
            </div>

            {model.why && (
              <>
                <h2 className="mt-12 text-xl font-bold tracking-tight text-paper sm:text-2xl">
                  {c.whyTitle}
                </h2>
                <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {model.why.map((reason) => (
                    <div key={reason.title.da}>
                      <dt className="flex gap-3 text-base font-semibold text-paper">
                        <Check
                          className="mt-1 h-5 w-5 flex-shrink-0 text-brand-300"
                          strokeWidth={2}
                        />
                        {reason.title[lang]}
                      </dt>
                      <dd className="mt-1.5 pl-8 text-sm leading-6 text-paper/65">
                        {reason.description[lang]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <div className="mt-12 border border-white/10 bg-white/5 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-paper">
                {c.ctaTitlePre} {model.name}?
              </h2>
              <p className="mt-2 text-base leading-7 text-paper/65">{c.ctaBody}</p>
              <Link
                href={localePath("/kontakt", lang)}
                className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-brand-600 px-7 text-base font-semibold tracking-tight text-paper transition hover:bg-brand-700"
              >
                {c.ctaButton}
              </Link>
            </div>

            {category && (
              <p className="mt-8 text-sm leading-6 text-paper/55">
                {c.seeAlsoPre}{" "}
                <Link
                  href={localePath(`/produkter/${category.slug}`, lang)}
                  className="font-semibold text-brand-300 hover:text-paper"
                >
                  {category.name[lang].toLowerCase()}
                </Link>
                .
              </p>
            )}
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-14 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold tracking-tight text-paper">{c.related}</h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={localePath(`/modeller/${other.slug}`, lang)}
                      className="inline-flex min-h-[44px] items-center border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-paper/80 transition hover:border-brand-400 hover:text-brand-300"
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

      <CtaSection lang={lang} />
    </>
  );
}
