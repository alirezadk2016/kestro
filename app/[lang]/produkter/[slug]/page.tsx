import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CtaSection from "@/components/CtaSection";
import { categories, getCategory } from "@/lib/categories";
import { getModel, getModelsForCategory } from "@/lib/models";
import { getCategoryIcon } from "@/lib/category-icons";
import { localePath, alternatesFor, langs, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return langs.flatMap((lang) => categories.map((category) => ({ lang, slug: category.slug })));
}

const copy = {
  da: {
    breadcrumbLabel: "Brødkrumme",
    breadcrumbHub: "Hvad vi skaffer",
    brandsTitle: "Mærker vi typisk arbejder med",
    brandsBodyPre:
      "Vi sourcer per ordre og er derfor ikke bundet til bestemte mærker. Det er typisk disse, vi kan skaffe inden for",
    brandsNote:
      "Mangler I et bestemt mærke eller en bestemt model? Spørg os – vi kan ofte skaffe det.",
    exampleEyebrow: "Eksempel på en maskine",
    imageNote:
      "Billederne viser modeltypen. Vi holder ikke lager – stand, specifikationer og antal aftales for den enkelte ordre.",
    seeAllSpecsPre: "Se alle specifikationer på",
    modelsTitle: "Modeller vi ofte skaffer",
    modelsBody:
      "Vi har dem ikke på lager. Listen viser de modeller, vi kender godt og oftest bliver bedt om at finde – klik ind for specifikationer og hvad de egner sig til.",
    allModels: "Se hele modeloversigten",
    useCases: "Typiske anvendelser",
    specs: "Specifikationer",
    other: "Andre kategorier",
  },
  en: {
    breadcrumbLabel: "Breadcrumb",
    breadcrumbHub: "What we source",
    brandsTitle: "Brands we usually work with",
    brandsBodyPre:
      "We source per order, so we are not tied to particular brands. These are the ones we can normally get within",
    brandsNote: "Missing a particular brand or model? Ask us — we can often get it.",
    exampleEyebrow: "An example machine",
    imageNote:
      "The photos show the model type. We do not hold stock — condition, specifications and quantity are agreed per order.",
    seeAllSpecsPre: "See all specifications for the",
    modelsTitle: "Models we often source",
    modelsBody:
      "We do not hold them in stock. The list shows the models we know well and are most often asked to find — click through for specifications and what they suit.",
    allModels: "See the full model overview",
    useCases: "Typical uses",
    specs: "Specifications",
    other: "Other categories",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};

  return {
    title: category.metaTitle[params.lang],
    description: category.metaDescription[params.lang],
    alternates: alternatesFor(`/produkter/${category.slug}`, params.lang),
  };
}

export default function CategoryPage({ params }: { params: { lang: Lang; slug: string } }) {
  const { lang } = params;
  const c = copy[lang];
  const category = getCategory(params.slug);
  if (!category) notFound();

  const others = categories.filter((c) => c.slug !== category.slug);
  const exampleModel = category.exampleModel ? getModel(category.exampleModel) : undefined;
  const categoryModels = getModelsForCategory(category.slug);
  const Icon = getCategoryIcon(category.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 py-12 text-white sm:py-16 lg:py-20">
        {/* Brand glow for depth — no product photography, since we source per order */}
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
                { name: c.breadcrumbHub, href: "/produkter" },
                { name: category.name[lang], href: `/produkter/${category.slug}` },
              ]}
            />
            <nav aria-label={c.breadcrumbLabel} className="text-sm text-ink-400">
              <Link
                href={localePath("/produkter", lang)}
                className="inline-flex min-h-[44px] items-center transition hover:text-white"
              >
                {c.breadcrumbHub}
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="text-ink-200">{category.name[lang]}</span>
            </nav>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                <Icon className="h-8 w-8 text-paper/70" strokeWidth={1.5} />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {category.name[lang]}
                </h1>
                <p className="mt-2 text-base text-ink-300 sm:text-lg">{category.tagline[lang]}</p>
              </div>
            </div>

            <p className="mt-8 text-base leading-7 text-ink-300">{category.intro[lang]}</p>
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-14 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.brandsTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-paper/65">
              {c.brandsBodyPre} {category.name[lang].toLowerCase()}:
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {category.brands.map((brand) => (
                <li
                  key={brand}
                  className="border border-white/15 px-3.5 py-1.5 text-sm text-paper/80"
                >
                  {brand}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm leading-6 text-paper/55">{c.brandsNote}</p>
          </div>
        </Container>
      </section>

      {exampleModel?.images && (
        <section className="py-14 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <span className="eyebrow text-brand-300">{c.exampleEyebrow}</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                {exampleModel.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-paper/65">{exampleModel.intro[lang]}</p>

              {/*
                Lead image full width, the rest in an even grid – the renders
                sit on white, so object-contain keeps ports and keyboard
                uncropped, which is the part a buyer actually looks at.
              */}
              <div className="mt-8 space-y-3 sm:space-y-4">
                <div className="aspect-[4/3] overflow-hidden bg-white shadow-lg shadow-black/20 sm:aspect-[16/10]">
                  <Image
                    src={exampleModel.images[0].src}
                    alt={exampleModel.images[0].alt[lang]}
                    width={1179}
                    height={1120}
                    className="h-full w-full object-contain p-3 sm:p-6"
                    sizes="(max-width: 768px) 92vw, 768px"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  {exampleModel.images.slice(1).map((img) => (
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
              </div>

              <p className="mt-4 text-sm leading-6 text-paper/55">{c.imageNote}</p>

              <Link
                href={localePath(`/modeller/${exampleModel.slug}`, lang)}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-300 transition hover:text-paper"
              >
                {c.seeAllSpecsPre} {exampleModel.name}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {categoryModels.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-14 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                {c.modelsTitle}
              </h2>
              <p className="mt-3 text-base leading-7 text-paper/65">{c.modelsBody}</p>

              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {categoryModels.map((model) => (
                  <li key={model.slug}>
                    <Link
                      href={localePath(`/modeller/${model.slug}`, lang)}
                      className="group flex h-full flex-col border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand-300 hover:border-white/35"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-paper/55">
                        {model.format[lang]}
                      </span>
                      <span className="mt-1.5 text-base font-semibold text-paper group-hover:text-paper">
                        {model.name}
                      </span>
                      <span className="mt-1.5 flex-1 text-sm leading-6 text-paper/65">
                        {model.tagline[lang]}
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

      <section className="border-t border-white/10 py-14 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              {c.useCases}
            </h2>

            <dl className="mt-8 space-y-6">
              {category.useCases.map((useCase) => (
                <div key={useCase.title.da} className="flex gap-4">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-brand-300" strokeWidth={2} />
                  <div>
                    <dt className="text-base font-semibold text-paper">{useCase.title[lang]}</dt>
                    <dd className="mt-1 text-base leading-7 text-paper/65">
                      {useCase.description[lang]}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-10 border border-white/10 bg-white/5 p-6">
              <h3 className="text-base font-semibold text-paper">{c.specs}</h3>
              <p className="mt-2 text-base leading-7 text-paper/65">{category.specNote[lang]}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-ink-900 py-14 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-paper">{c.other}</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {others.map((other) => {
                const OtherIcon = getCategoryIcon(other.slug);
                return (
                  <li key={other.slug}>
                    <Link
                      href={localePath(`/produkter/${other.slug}`, lang)}
                      className="inline-flex min-h-[44px] items-center gap-2 border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-paper/80 transition hover:border-brand-400 hover:text-brand-300"
                    >
                      <OtherIcon className="h-4 w-4 text-ink-400" strokeWidth={1.75} />
                      {other.name[lang]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}
