import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/Container";
import BreadcrumbSchema, { type Crumb } from "@/components/BreadcrumbSchema";
import CtaSection from "@/components/CtaSection";
import { services, getService } from "@/lib/services";
import { localePath, metaFor, langs, htmlLang, type Lang } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

export function generateStaticParams() {
  return langs.flatMap((lang) => services.map((service) => ({ lang, slug: service.slug })));
}

const copy = {
  da: {
    breadcrumb: "Ydelser",
    next: "Videre herfra",
    more: "Andre ydelser",
    cta: "Få et tilbud",
  },
  en: {
    breadcrumb: "Services",
    next: "Where to go next",
    more: "Other services",
    cta: "Get a quote",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return {};

  return {
    title: service.metaTitle[params.lang],
    description: service.metaDescription[params.lang],
    ...metaFor(`/ydelser/${service.slug}`, params.lang),
  };
}

export default function ServicePage({ params }: { params: { lang: Lang; slug: string } }) {
  const { lang } = params;
  const c = copy[lang];
  const service = getService(params.slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  /* Service schema, so the page can be understood as one thing we do rather
     than as an article about it. */
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name[lang],
    description: service.metaDescription[lang],
    inLanguage: htmlLang[lang],
    /* By reference to the site-wide Organization node, not a second bare
       copy of it — same reason as the Article's publisher. */
    provider: { "@id": `${SITE_ORIGIN}/#organization` },
    areaServed: ["DK", "NO"],
    url: `${SITE_ORIGIN}${localePath(`/ydelser/${service.slug}`, lang)}`,
  };

  const trail: Crumb[] = [
    { name: c.breadcrumb, href: "/ydelser" },
    { name: service.name[lang], href: `/ydelser/${service.slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema lang={lang} trail={trail} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="lit bg-brand-950 py-14 text-paper sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <nav aria-label={c.breadcrumb} className="text-sm text-paper/55">
              <Link
                href={localePath("/ydelser", lang)}
                className="inline-flex min-h-[44px] items-center transition hover:text-paper"
              >
                {c.breadcrumb}
              </Link>
            </nav>

            <h1 className="mt-4 text-balance font-display text-[clamp(1.875rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-display text-paper">
              {service.name[lang]}
            </h1>
            <p className="mt-5 text-base leading-7 sm:text-lg sm:leading-8 text-paper/70">
              {service.summary[lang]}
            </p>
          </div>
        </Container>
      </section>

      <section className="lit lit-paper py-10 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-base leading-7 sm:text-lg sm:leading-8 text-paper/80">
              {service.intro[lang]}
            </p>

            {service.sections.map((section) => (
              <div key={section.heading.da} className="mt-12 border-t border-white/15 pt-8">
                <h2 className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
                  {section.heading[lang]}
                </h2>

                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.da}
                    className="mt-4 text-base leading-7 sm:leading-8 text-paper/65"
                  >
                    {paragraph[lang]}
                  </p>
                ))}

                {section.list && (
                  <ul className="mt-6 space-y-3.5">
                    {section.list.map((item) => (
                      <li key={item.da} className="flex gap-3 text-base leading-7 text-paper/65">
                        <Check
                          className="mt-1.5 h-4 w-4 flex-shrink-0 text-brand-300"
                          strokeWidth={2.5}
                        />
                        {item[lang]}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="mt-12 border-t border-white/15 pt-8">
              <p className="eyebrow text-brand-300">{c.next}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.related.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localePath(link.href, lang)}
                      className="inline-flex min-h-[44px] items-center gap-2 border border-white/10 px-5 text-sm font-semibold text-paper/80 transition hover:border-white/25 hover:text-paper"
                    >
                      {link.label[lang]}
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="border-t border-white/10 bg-ink-900 py-10 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-bold tracking-tight text-paper">{c.more}</h2>
              <ul className="mt-8 border-t border-white/15">
                {others.map((other) => (
                  <li key={other.slug} className="border-b border-white/10">
                    <Link
                      href={localePath(`/ydelser/${other.slug}`, lang)}
                      className="group -mx-4 block rounded-xl px-4 py-5 transition-colors hover:bg-white/5"
                    >
                      <span className="font-display text-base font-bold tracking-tight text-paper transition-colors group-hover:text-brand-300">
                        {other.name[lang]}
                      </span>
                      <span className="mt-1.5 block text-sm leading-6 text-paper/65">
                        {other.summary[lang]}
                      </span>
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
