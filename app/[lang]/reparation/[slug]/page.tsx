import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/Container";
import BreadcrumbSchema, { type Crumb } from "@/components/BreadcrumbSchema";
import CtaSection from "@/components/CtaSection";
import CraftMark from "@/components/CraftMark";
import PageSchema from "@/components/PageSchema";
import ServiceTile from "@/components/ServiceTile";
import { repairs, getRepair } from "@/lib/repairs";
import { localePath, metaFor, langs, type Lang } from "@/lib/i18n";

/* Same reason as the other slug routes: the language layout's guard must not
   swallow an unknown slug before this page can answer with the site's 404. */
export const dynamicParams = true;

export function generateStaticParams() {
  return langs.flatMap((lang) => repairs.map((r) => ({ lang, slug: r.slug })));
}

const copy = {
  da: {
    breadcrumb: "Reparation",
    does: "Det gør vi",
    needs: "Det skal vi bruge",
    bands: "Sådan læser vi procenten",
    howTo: "Sådan tjekker du det selv",
    more: "Andre reparationer",
    read: "Læs mere",
    back: "Alle reparationer",
  },
  en: {
    breadcrumb: "Repairs",
    does: "What we do",
    needs: "What we need",
    bands: "How we read the percentage",
    howTo: "How to check it yourself",
    more: "Other repairs",
    read: "Read more",
    back: "All repairs",
  },
} satisfies Record<Lang, Record<string, string>>;

type Params = { params: { lang: Lang; slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const repair = getRepair(params.slug);
  if (!repair) return {};
  return {
    title: repair.metaTitle[params.lang],
    description: repair.metaDescription[params.lang],
    ...metaFor(`/reparation/${repair.slug}`, params.lang),
  };
}

export default function RepairPage({ params }: Params) {
  const { lang, slug } = params;
  const repair = getRepair(slug);
  if (!repair) notFound();
  const c = copy[lang];
  const others = repairs.filter((r) => r.slug !== slug).slice(0, 4);

  const trail: Crumb[] = [
    { name: c.breadcrumb, href: "/reparation" },
    { name: repair.name[lang], href: `/reparation/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema lang={lang} trail={trail} />
      <PageSchema
        lang={lang}
        route="/reparation"
        name={repair.name[lang]}
        description={repair.metaDescription[lang]}
      />

      <section className="py-10 sm:py-20">
        <Container>
          <nav className="label text-paper/40">
            <Link href={localePath("/reparation", lang)} className="transition hover:text-paper/70">
              {c.breadcrumb}
            </Link>
          </nav>

          <div className="mt-6 flex items-start gap-5">
            <span className="plate-sm flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500/[0.12] text-brand-300">
              <CraftMark name={repair.mark} className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <h1 className="t-h1 text-balance font-display font-extrabold tracking-display text-paper">
                {repair.name[lang]}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-[1.75] text-paper/70">
            {repair.intro[lang]}
          </p>
        </Container>
      </section>

      {/* The battery page is the one with a number on it, so it is the one
          that owes the reader a way to read that number and a way to find it
          without asking anybody. */}
      {repair.bands && (
        <section className="bg-ink-900 py-10 sm:py-20">
          <Container>
            <h2 className="t-h2 font-display font-bold tracking-tight text-paper">{c.bands}</h2>
            <ul className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
              {repair.bands.map((band) => (
                <li key={band.range} className="plate flex items-baseline gap-4 p-4 sm:p-5">
                  {/* Fixed width and no wrapping: "90–100%" broke after the
                      dash and read as two numbers stacked. */}
                  <span className="w-[5.5rem] flex-shrink-0 whitespace-nowrap font-display text-lg font-bold tabular-nums tracking-tight text-brand-300 sm:text-xl">
                    {band.range}
                  </span>
                  <span className="text-sm leading-[1.6] text-paper/70">{band.reading[lang]}</span>
                </li>
              ))}
            </ul>
            {repair.bandsNote && (
              <p className="mt-6 max-w-2xl text-sm leading-[1.6] text-paper/50">
                {repair.bandsNote[lang]}
              </p>
            )}
          </Container>
        </section>
      )}

      {repair.howTo && (
        <section className="py-10 sm:py-20">
          <Container>
            <h2 className="t-h2 font-display font-bold tracking-tight text-paper">{c.howTo}</h2>
            <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6">
              {repair.howTo.map((block) => (
                <div key={block.heading.da} className="plate p-5 sm:p-6">
                  <h3 className="font-display text-lg font-bold tracking-tight text-paper">
                    {block.heading[lang]}
                  </h3>
                  <ol className="mt-4 space-y-3">
                    {block.steps.map((step, i) => (
                      <li key={step.da} className="flex gap-3 text-sm leading-[1.6] text-paper/70">
                        <span className="font-display text-xs font-bold tabular-nums text-brand-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">{step[lang]}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-white/10 py-10 sm:py-20">
        <Container>
          <div className="grid max-w-4xl gap-10 sm:grid-cols-2 sm:gap-14">
            {(
              [
                [c.does, repair.does],
                [c.needs, repair.needs],
              ] as const
            ).map(([heading, items]) => (
              <div key={heading}>
                <h2 className="t-h3 font-display font-bold tracking-tight text-paper">{heading}</h2>
                <ul className="mt-5 space-y-3">
                  {items.map((item) => (
                    <li key={item.da} className="flex gap-3 text-sm leading-[1.6] text-paper/70">
                      <Check
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400"
                        strokeWidth={2}
                      />
                      <span className="min-w-0">{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink-900 py-10 sm:py-20">
        <Container>
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="t-h2 font-display font-bold tracking-tight text-paper">{c.more}</h2>
            <Link
              href={localePath("/reparation", lang)}
              className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
            >
              {c.back}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {others.map((other) => (
              <li key={other.slug}>
                <ServiceTile
                  href={localePath(`/reparation/${other.slug}`, lang)}
                  mark={other.mark}
                  title={other.name[lang]}
                  summary={other.summary[lang]}
                  prompt={c.read}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}
