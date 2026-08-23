import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, Info } from "lucide-react";
import Container from "@/components/Container";
import CtaSection from "@/components/CtaSection";
import { models, getModel } from "@/lib/models";
import { getCategory } from "@/lib/categories";
import { getCategoryIcon } from "@/lib/category-icons";

export function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const model = getModel(params.slug);
  if (!model) return {};

  return {
    title: model.metaTitle,
    description: model.metaDescription,
    alternates: { canonical: `/modeller/${model.slug}` },
  };
}

export default function ModelPage({ params }: { params: { slug: string } }) {
  const model = getModel(params.slug);
  if (!model) notFound();

  const category = getCategory(model.category);
  const Icon = getCategoryIcon(model.category);
  const related = models.filter((m) => m.group === model.group && m.slug !== model.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-900 py-12 text-white sm:py-16 lg:py-20">
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
              <Link href="/modeller" className="inline-flex min-h-[44px] items-center transition hover:text-white">
                Modeller
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="text-slate-200">{model.name}</span>
            </nav>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                <Icon className="h-8 w-8 text-brand-300" strokeWidth={1.5} />
              </span>
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-brand-300">
                  {model.brand} · {model.format}
                </span>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {model.name}
                </h1>
                <p className="mt-2 text-base text-slate-300 sm:text-lg">{model.tagline}</p>
              </div>
            </div>

            <p className="mt-8 text-base leading-7 text-slate-300">{model.intro}</p>

            <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-slate-300">
              Vi har den ikke på lager. Vi sourcer den til den enkelte ordre – fortæl os antal og
              hvad maskinerne skal bruges til, så vender vi tilbage med pris og leveringstid.
            </p>
          </div>
        </Container>
      </section>

      {model.images && (
        <section className="py-12 sm:py-20">
          <Container>
            <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white sm:aspect-[16/10]">
                <Image
                  src={model.images[0].src}
                  alt={model.images[0].alt}
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

              <p className="pt-1 text-sm leading-6 text-slate-500">
                Billederne viser modeltypen. Stand, specifikationer og antal aftales for den
                enkelte ordre.
              </p>
            </div>
          </Container>
        </section>
      )}

      <section className={`py-12 sm:py-20 ${model.images ? "border-t border-slate-200" : ""}`}>
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                <h2 className="text-base font-semibold text-slate-900">Typisk konfiguration</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Brugt hardware findes i mange sammensætninger. Tallene her viser, hvad modellen
                  som regel er bygget i – den præcise konfiguration aftaler vi for jeres ordre.
                </p>
              </div>

              <dl className="divide-y divide-slate-200">
                {model.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-4"
                  >
                    <dt className="text-sm font-semibold text-slate-900">{spec.label}</dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-600 sm:col-span-2 sm:mt-0">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <h2 className="mt-12 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              God til
            </h2>
            <ul className="mt-5 space-y-3">
              {model.goodFor.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-7 text-slate-600">
                  <Check className="mt-1.5 h-5 w-5 flex-shrink-0 text-brand-600" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Info className="h-5 w-5 flex-shrink-0 text-amber-600" strokeWidth={2} />
                Vær opmærksom på
              </h2>
              <ul className="mt-3 space-y-2.5">
                {model.notes.map((note) => (
                  <li key={note} className="text-sm leading-6 text-slate-700">
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {model.why && (
              <>
                <h2 className="mt-12 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Derfor peger vi ofte på denne model
                </h2>
                <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {model.why.map((reason) => (
                    <div key={reason.title}>
                      <dt className="flex gap-3 text-base font-semibold text-slate-900">
                        <Check
                          className="mt-1 h-5 w-5 flex-shrink-0 text-brand-600"
                          strokeWidth={2}
                        />
                        {reason.title}
                      </dt>
                      <dd className="mt-1.5 pl-8 text-sm leading-6 text-slate-600">
                        {reason.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Skal I bruge {model.name}?
              </h2>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Fortæl os antal, hvad maskinerne skal bruges til, og hvornår I skal bruge dem. Så
                finder vi dem i vores leverandørnetværk og vender tilbage med et konkret bud – også
                hvis en anden model passer bedre til opgaven.
              </p>
              <Link
                href="/kontakt"
                className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-600 px-6 text-base font-semibold text-white transition hover:bg-brand-700"
              >
                Spørg om denne model
              </Link>
            </div>

            {category && (
              <p className="mt-8 text-sm leading-6 text-slate-500">
                Se også alt, hvad vi skaffer inden for{" "}
                <Link
                  href={`/produkter/${category.slug}`}
                  className="font-semibold text-brand-700 hover:text-brand-800"
                >
                  {category.name.toLowerCase()}
                </Link>
                .
              </p>
            )}
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Andre modeller i samme klasse
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/modeller/${other.slug}`}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-600 hover:text-brand-700"
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

      <CtaSection />
    </>
  );
}
