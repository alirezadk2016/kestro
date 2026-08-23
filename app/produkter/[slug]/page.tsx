import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import CtaSection from "@/components/CtaSection";
import { categories, getCategory } from "@/lib/categories";
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
              <Link href="/produkter" className="transition hover:text-white">
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

      <section className="py-12 sm:py-20">
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
