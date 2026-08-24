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
import { localePath, alternatesFor, langs, type Lang } from "@/lib/i18n";

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

  return (
    <>
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
          </div>
        </Container>
      </section>

      {model.images && (
        <section className="py-14 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
              <div className="aspect-[4/3] overflow-hidden border border-paper-edge bg-white sm:aspect-[16/10]">
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
                    className="aspect-square overflow-hidden border border-paper-edge bg-white"
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

              <p className="pt-1 text-sm leading-6 text-ink-500">{c.imageNote}</p>
            </div>
          </Container>
        </section>
      )}

      <section className={`py-14 sm:py-24 ${model.images ? "border-t border-paper-edge" : ""}`}>
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden border border-paper-edge">
              <div className="border-b border-paper-edge bg-paper-dim px-5 py-4 sm:px-6">
                <h2 className="text-base font-semibold text-ink-900">{c.configTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-ink-600">{c.configBody}</p>
              </div>

              <dl className="divide-y divide-paper-edge">
                {model.specs.map((spec) => (
                  <div
                    key={spec.label.da}
                    className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-4"
                  >
                    <dt className="text-sm font-semibold text-ink-900">{spec.label[lang]}</dt>
                    <dd className="mt-1 text-sm leading-6 text-ink-600 sm:col-span-2 sm:mt-0">
                      {spec.value[lang]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <h2 className="mt-12 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
              {c.goodFor}
            </h2>
            <ul className="mt-5 space-y-3">
              {model.goodFor.map((item) => (
                <li key={item.da} className="flex gap-3 text-base leading-7 text-ink-600">
                  <Check className="mt-1.5 h-5 w-5 flex-shrink-0 text-brand-600" strokeWidth={2} />
                  {item[lang]}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-l-2 border-ink-900 bg-paper-dim p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900">
                <Info className="h-5 w-5 flex-shrink-0 text-ink-700" strokeWidth={2} />
                {c.watchOut}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {model.notes.map((note) => (
                  <li key={note.da} className="text-sm leading-6 text-ink-700">
                    {note[lang]}
                  </li>
                ))}
              </ul>
            </div>

            {model.why && (
              <>
                <h2 className="mt-12 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                  {c.whyTitle}
                </h2>
                <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {model.why.map((reason) => (
                    <div key={reason.title.da}>
                      <dt className="flex gap-3 text-base font-semibold text-ink-900">
                        <Check
                          className="mt-1 h-5 w-5 flex-shrink-0 text-brand-600"
                          strokeWidth={2}
                        />
                        {reason.title[lang]}
                      </dt>
                      <dd className="mt-1.5 pl-8 text-sm leading-6 text-ink-600">
                        {reason.description[lang]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <div className="mt-12 border border-paper-edge bg-paper-dim p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-ink-900">
                {c.ctaTitlePre} {model.name}?
              </h2>
              <p className="mt-2 text-base leading-7 text-ink-600">{c.ctaBody}</p>
              <Link
                href={localePath("/kontakt", lang)}
                className="mt-5 inline-flex min-h-[48px] items-center justify-center bg-brand-950 px-7 text-base font-semibold tracking-tight text-paper transition hover:bg-brand-800"
              >
                {c.ctaButton}
              </Link>
            </div>

            {category && (
              <p className="mt-8 text-sm leading-6 text-ink-500">
                {c.seeAlsoPre}{" "}
                <Link
                  href={localePath(`/produkter/${category.slug}`, lang)}
                  className="font-semibold text-brand-700 hover:text-brand-800"
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
        <section className="border-t border-paper-edge bg-paper-dim py-14 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">{c.related}</h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={localePath(`/modeller/${other.slug}`, lang)}
                      className="inline-flex min-h-[44px] items-center border border-paper-edge bg-white px-4 text-sm font-medium text-ink-700 transition hover:border-brand-600 hover:text-brand-700"
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
