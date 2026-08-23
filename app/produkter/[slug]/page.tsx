import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import CtaSection from "@/components/CtaSection";
import { categories, getCategory } from "@/lib/categories";
import { getModel, getModelsForCategory } from "@/lib/models";
import { getCategoryIcon } from "@/lib/category-icons";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: { canonical: `/produkter/${category.slug}` },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const others = categories.filter((c) => c.slug !== category.slug);
  const exampleModel = category.exampleModel ? getModel(category.exampleModel) : undefined;
  const categoryModels = getModelsForCategory(category.slug);
  const Icon = getCategoryIcon(category.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-900 py-12 text-white sm:py-16 lg:py-20">
        {/* Brand glow for depth — no product photography, since we source per order */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl"
        />

        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Brødkrumme" className="text-sm text-slate-400">
              <Link href="/produkter" className="inline-flex min-h-[44px] items-center transition hover:text-white">
                Hvad vi skaffer
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="text-slate-200">{category.name}</span>
            </nav>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                <Icon className="h-8 w-8 text-brand-300" strokeWidth={1.5} />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {category.name}
                </h1>
                <p className="mt-2 text-base text-slate-300 sm:text-lg">{category.tagline}</p>
              </div>
            </div>

            <p className="mt-8 text-base leading-7 text-slate-300">{category.intro}</p>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Mærker vi typisk arbejder med
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Vi sourcer per ordre og er derfor ikke bundet til bestemte mærker. Det er typisk
              disse, vi kan skaffe inden for {category.name.toLowerCase()}:
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {category.brands.map((brand) => (
                <li
                  key={brand}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-700"
                >
                  {brand}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm leading-6 text-slate-500">
              Mangler I et bestemt mærke eller en bestemt model? Spørg os – vi kan ofte skaffe det.
            </p>
          </div>
        </Container>
      </section>

      {exampleModel?.images && (
        <section className="py-12 sm:py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Eksempel på en maskine
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {exampleModel.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{exampleModel.intro}</p>

              {/*
                Lead image full width, the rest in an even grid – the renders
                sit on white, so object-contain keeps ports and keyboard
                uncropped, which is the part a buyer actually looks at.
              */}
              <div className="mt-8 space-y-3 sm:space-y-4">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white sm:aspect-[16/10]">
                  <Image
                    src={exampleModel.images[0].src}
                    alt={exampleModel.images[0].alt}
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
                      className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={1179}
                        height={1120}
                        className="h-full w-full object-contain p-2 sm:p-4"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 250px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Billederne viser modeltypen. Vi holder ikke lager – stand, specifikationer og antal
                aftales for den enkelte ordre.
              </p>

              <Link
                href={`/modeller/${exampleModel.slug}`}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Se alle specifikationer på {exampleModel.name}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {categoryModels.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Modeller vi ofte skaffer
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Vi har dem ikke på lager. Listen viser de modeller, vi kender godt og oftest bliver
                bedt om at finde – klik ind for specifikationer og hvad de egner sig til.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {categoryModels.map((model) => (
                  <li key={model.slug}>
                    <Link
                      href={`/modeller/${model.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {model.format}
                      </span>
                      <span className="mt-1.5 text-base font-semibold text-slate-900 group-hover:text-brand-700">
                        {model.name}
                      </span>
                      <span className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">
                        {model.tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/modeller"
                className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Se hele modeloversigten
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-slate-200 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Typiske anvendelser
            </h2>

            <dl className="mt-8 space-y-6">
              {category.useCases.map((useCase) => (
                <div key={useCase.title} className="flex gap-4">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-brand-600" strokeWidth={2} />
                  <div>
                    <dt className="text-base font-semibold text-slate-900">{useCase.title}</dt>
                    <dd className="mt-1 text-base leading-7 text-slate-600">
                      {useCase.description}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-base font-semibold text-slate-900">Specifikationer</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">{category.specNote}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Andre kategorier</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {others.map((other) => {
                const OtherIcon = getCategoryIcon(other.slug);
                return (
                  <li key={other.slug}>
                    <Link
                      href={`/produkter/${other.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-600 hover:text-brand-700"
                    >
                      <OtherIcon className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                      {other.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
