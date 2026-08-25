import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/Container";
import CtaSection from "@/components/CtaSection";
import { services, getService } from "@/lib/services";
import { company } from "@/lib/company";
import { localePath, alternatesFor, langs, htmlLang, type Lang } from "@/lib/i18n";

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
    alternates: alternatesFor(`/ydelser/${service.slug}`, params.lang),
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
    provider: { "@type": "Organization", name: company.name, url: "https://www.kestro.dk" },
    areaServed: ["DK", "NO"],
    url: `https://www.kestro.dk${localePath(`/ydelser/${service.slug}`, lang)}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="lit bg-brand-950 py-14 text-paper sm:py-24">
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
            <p className="mt-5 text-lg leading-8 text-paper/70">{service.summary[lang]}</p>
          </div>
        </Container>
      </section>

      <section className="lit lit-paper py-14 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-lg leading-8 text-ink-700">{service.intro[lang]}</p>

            {service.sections.map((section) => (
              <div key={section.heading.da} className="mt-12 border-t border-ink-900/12 pt-8">
                <h2 className="font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                  {section.heading[lang]}
                </h2>

                {section.body.map((paragraph) => (
                  <p key={paragraph.da} className="mt-4 text-base leading-8 text-ink-600">
                    {paragraph[lang]}
                  </p>
                ))}

                {section.list && (
                  <ul className="mt-6 space-y-3.5">
                    {section.list.map((item) => (
                      <li key={item.da} className="flex gap-3 text-base leading-7 text-ink-600">
                        <Check
                          className="mt-1.5 h-4 w-4 flex-shrink-0 text-brand-600"
                          strokeWidth={2.5}
                        />
                        {item[lang]}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="mt-12 border-t border-ink-900/12 pt-8">
              <p className="eyebrow text-brand-700">{c.next}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.related.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localePath(link.href, lang)}
                      className="inline-flex min-h-[44px] items-center gap-2 border border-paper-edge px-5 text-sm font-semibold text-ink-700 transition hover:border-ink-300 hover:text-ink-900"
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
        <section className="border-t border-paper-edge bg-paper-dim py-14 sm:py-24">
          <Container>
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink-900">
                {c.more}
              </h2>
              <ul className="mt-8 border-t border-ink-900/12">
                {others.map((other) => (
                  <li key={other.slug} className="border-b border-ink-900/10">
                    <Link
                      href={localePath(`/ydelser/${other.slug}`, lang)}
                      className="group -mx-4 block rounded-xl px-4 py-5 transition-colors hover:bg-white/70"
                    >
                      <span className="font-display text-base font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-700">
                        {other.name[lang]}
                      </span>
                      <span className="mt-1.5 block text-sm leading-6 text-ink-600">
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
