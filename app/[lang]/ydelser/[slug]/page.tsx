import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import { type Crumb } from "@/components/BreadcrumbSchema";
import CtaSection from "@/components/CtaSection";
import { services, getService } from "@/lib/services";
import {
  formatDate,
  localePath,
  metaFor,
  langs,
  htmlLang,
  type Lang,
  lowerFirst,
} from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import PageSchema, { pageUpdated } from "@/components/PageSchema";
import Faq from "@/components/Faq";
import FactNote from "@/components/FactNote";
import MarkTile from "@/components/MarkTile";
import { type CraftMarkName } from "@/components/CraftMark";
import { serviceAnswers } from "@/lib/service-answers";

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
  return langs.flatMap((lang) => services.map((service) => ({ lang, slug: service.slug })));
}

const copy = {
  da: {
    breadcrumb: "Ydelser",
    next: "Videre herfra",
    more: "Andre ydelser",
    updated: "Opdateret",
    faq: "Spørgsmål om",
    cta: "Få et tilbud",
    inShort: "Kort fortalt",
    enquire: "Send en forespørgsel",
  },
  en: {
    breadcrumb: "Services",
    next: "Where to go next",
    more: "Other services",
    updated: "Updated",
    faq: "Questions about",
    cta: "Get a quote",
    inShort: "In short",
    enquire: "Send an enquiry",
  },
} satisfies Record<Lang, Record<string, string>>;

/*
 * The mark each service already carries on the services hub, so the page's
 * heading sits beside the same tile as a repair or a category does.
 */
const serviceMarks: Record<string, CraftMarkName> = {
  "sourcing-og-indkoeb": "network",
  "klargoering-og-test": "tested",
  "nordisk-tilpasning": "nordic",
  levering: "delivery",
  "overskudslager-og-returvarer": "batch",
  "opstart-af-arbejdspladser": "install",
};

/*
 * "In short", beside the article on a wide screen. Most services have one or
 * two sections, so the text ran down the left half of a 1440px page with the
 * right half empty. Every line is one the site states elsewhere (delivery,
 * the written time frame, the non-binding enquiry; for surplus stock, the
 * valuation first and the erasure before resale).
 */
const inShort: Record<"supply" | "surplus", Record<Lang, string[]>> = {
  supply: {
    da: [
      "Leveres til virksomheder i Danmark og Norge.",
      "Tidsrammen får I på skrift, før I bestiller.",
      "En forespørgsel er uforpligtende.",
    ],
    en: [
      "Delivered to companies in Denmark and Norway.",
      "You get the time frame in writing before you order.",
      "An enquiry commits you to nothing.",
    ],
  },
  surplus: {
    da: [
      "I får en vurdering, før I beslutter jer.",
      "Lagermedier slettes før videresalg.",
      "En forespørgsel er uforpligtende.",
    ],
    en: [
      "You get a valuation before you decide.",
      "Storage is erased before resale.",
      "An enquiry commits you to nothing.",
    ],
  },
};

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const service = getService(params.slug);
  if (!service) return {};

  return {
    title: service.metaTitle[params.lang],
    description: service.metaDescription[params.lang],
    ...metaFor(`/ydelser/${service.slug}`, params.lang),
  };
}

export default async function ServicePage(props: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const params = await props.params;
  const { lang } = params;
  const c = copy[lang];
  const service = getService(params.slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  /* The quote is the closing band's job; everything else this page points to. */
  const onward = service.related.filter((link) => link.href !== "/tilbud");
  const answers = serviceAnswers[service.slug];
  const updated = pageUpdated("/ydelser/[slug]");
  const pagePath = `/ydelser/${service.slug}`;
  const pageUrl = `${SITE_ORIGIN}${localePath(pagePath, lang)}`;
  const serviceId = `${pageUrl}#service`;

  /* Service schema, so the page can be understood as one thing we do rather
     than as an article about it. */
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceId,
    name: service.name[lang],
    description: service.metaDescription[lang],
    inLanguage: htmlLang[lang],
    /* By reference to the site-wide Organization node, not a second bare
       copy of it — same reason as the Article's publisher. */
    provider: { "@id": `${SITE_ORIGIN}/#organization` },
    areaServed: ["DK", "NO"],
    url: pageUrl,
  };

  const trail: Crumb[] = [
    { name: c.breadcrumb, href: "/ydelser" },
    { name: service.name[lang], href: `/ydelser/${service.slug}` },
  ];

  return (
    <>
      <PageSchema
        lang={lang}
        route="/ydelser/[slug]"
        type="ItemPage"
        pagePath={pagePath}
        name={service.name[lang]}
        description={service.metaDescription[lang]}
        sources={answers?.sources}
        primaryEntityId={serviceId}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header and body are the same navy with no edge between them, so
          the date and the first paragraph of the body were 96px apart on a
          phone, which read as the page ending. The header now closes short
          and the body opens without its own top padding. */}
      <section className="bg-white pb-8 pt-14 text-ink-900 sm:pb-12 sm:pt-20">
        <Container>
          <div className="max-w-3xl">
            <Breadcrumbs lang={lang} trail={trail} />

            {/* The tile above the heading on a phone, beside it from sm: the
                service headings run to sixty characters, and beside a tile
                they took five lines at 390px. */}
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              {serviceMarks[service.slug] && (
                <MarkTile name={serviceMarks[service.slug]} size="lg" className="flex-none" />
              )}
              <h1 className="min-w-0 text-balance font-display t-h1 font-extrabold tracking-display text-ink-900">
                {(service.h1 ?? service.name)[lang]}
              </h1>
            </div>
            {/* The answer first. The card one-liner is `summary`; the page opens
                with what the service is, with the figure in it. */}
            <p className="mt-5 text-base leading-[1.65] sm:text-lg sm:leading-[1.65] text-ink-800">
              {(answers?.lead ?? service.summary)[lang]}
            </p>
            <p className="label mt-6 text-ink-600">
              {c.updated}{" "}
              <time dateTime={updated} className="tabular-nums text-ink-800">
                {formatDate(updated, lang)}
              </time>
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-20">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-14">
            <aside className="hidden lg:order-2 lg:col-span-4 lg:block">
              <div className="plate p-6 lg:sticky lg:top-28">
                <p className="text-sm font-semibold text-ink-900">{c.inShort}</p>
                <p className="mt-2 text-sm leading-6 text-ink-700">{service.summary[lang]}</p>
                <ul className="mt-5 space-y-3 border-t border-ink-200 pt-5">
                  {inShort[service.slug === "overskudslager-og-returvarer" ? "surplus" : "supply"][
                    lang
                  ].map((line) => (
                    <li key={line} className="flex gap-3 text-sm leading-6 text-ink-700">
                      <Check
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 flex-none text-brand-700"
                        strokeWidth={2}
                      />
                      {line}
                    </li>
                  ))}
                </ul>
                <Link
                  href={localePath("/tilbud", lang)}
                  className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-ink-900"
                >
                  {c.enquire}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            </aside>
            <div className="max-w-3xl lg:order-1 lg:col-span-8">
              {/* The answer above is the brighter line; this is the context
                after it, as on the model pages. */}
              <p className="text-base leading-[1.75] text-ink-700 sm:text-lg sm:leading-[1.75]">
                {service.intro[lang]}
              </p>

              {service.sections.map((section) => (
                <div key={section.heading.da} className="mt-12 border-t border-ink-300 pt-8">
                  <h2 className="text-balance font-display t-h2 font-extrabold tracking-display text-ink-900">
                    {section.heading[lang]}
                  </h2>

                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.da}
                      className="mt-4 text-base leading-[1.75] sm:leading-[1.75] text-ink-700"
                    >
                      {paragraph[lang]}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="mt-6 space-y-3.5">
                      {section.list.map((item) => (
                        <li key={item.da} className="flex gap-3 text-base leading-7 text-ink-700">
                          <Check
                            aria-hidden="true"
                            className="mt-1.5 h-4 w-4 flex-none text-brand-700"
                            strokeWidth={2}
                          />
                          {item[lang]}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Where to go from here, in one band: the sibling services as a shelf
          of plates, then the pages this one points to. The pointers were a
          row of chips at the end of the article and the siblings a second
          section after it, hairline rows that read as a table; and one chip
          was "Få et tilbud", which the closing band says a screen later. */}
      {(others.length > 0 || onward.length > 0) && (
        <section className="border-t border-ink-200 bg-paper-dim py-10 sm:py-20">
          <Container>
            {others.length > 0 && (
              <>
                <h2 className="font-display t-h3 font-bold tracking-tight text-ink-900">
                  {c.more}
                </h2>
                <ul className="rail mt-6 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={localePath(`/ydelser/${other.slug}`, lang)}
                        className="plate plate-lift group flex h-full flex-col p-5"
                      >
                        <span className="font-display text-base font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-700">
                          {other.name[lang]}
                        </span>
                        <span className="mt-1.5 text-sm leading-6 text-ink-700">
                          {other.summary[lang]}
                        </span>
                        <span className="flex-1" />
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-4 h-4 w-4 text-brand-700 transition-transform group-hover:translate-x-1"
                          strokeWidth={2}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {onward.length > 0 && (
              <>
                <p className={`eyebrow text-brand-700 ${others.length > 0 ? "mt-10" : ""}`}>
                  {c.next}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {onward.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={localePath(link.href, lang)}
                        className="plate-sm inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-semibold text-ink-800 transition hover:text-ink-900"
                      >
                        {link.label[lang]}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Container>
        </section>
      )}

      {answers && (
        <Faq
          lang={lang}
          items={answers.faqs}
          title={{
            da: `${copy.da.faq} ${lowerFirst(service.name.da)}`,
            en: `${copy.en.faq} ${lowerFirst(service.name.en)}`,
          }}
        />
      )}

      {answers && <FactNote lang={lang} ids={answers.sources} />}

      <CtaSection lang={lang} />
    </>
  );
}
