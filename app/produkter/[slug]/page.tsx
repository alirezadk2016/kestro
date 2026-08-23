import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import CtaSection from "@/components/CtaSection";
import { categories, getCategory } from "@/lib/categories";

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

  return (
    <>
      <section className="py-12 sm:py-20 lg:py-24">
        <Container>
          <nav aria-label="Brødkrumme" className="mb-8 text-sm text-slate-500">
            <Link href="/produkter" className="transition hover:text-brand-700">
              Produkter
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-slate-700">{category.name}</span>
          </nav>

          <PageHeader title={category.name} description={category.tagline} />

          {category.image && (
            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <Image
                src={category.image}
                alt={category.imageAlt ?? ""}
                width={1200}
                height={675}
                priority
                className="h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <div className="mx-auto mt-12 max-w-3xl">
            <p className="text-base leading-7 text-slate-600">{category.intro}</p>
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

      <section className="border-t border-slate-200 py-12 sm:py-20">
        <Container>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Andre kategorier</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/produkter/${other.slug}`}
                  className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-600 hover:text-brand-700"
                >
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
