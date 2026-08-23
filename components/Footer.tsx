import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { categories } from "@/lib/categories";
import { company } from "@/lib/company";
import { companyNav, serviceNav, productsNav, ui } from "@/lib/nav";
import { localePath, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    blurb:
      "Kestro er indkøbspartner på renoveret erhvervs-IT. Vi forbinder danske og norske virksomheder med de rigtige leverandører – og klargør udstyret til det nordiske marked, før det leveres.",
    services: "Ydelser",
    company: "Virksomhed",
    delivers: "Leverer i",
    rights: "Alle rettigheder forbeholdes.",
  },
  en: {
    blurb:
      "Kestro is a sourcing partner for refurbished business IT. We connect Danish and Norwegian companies with the right suppliers — and prepare the equipment for the Nordic market before it ships.",
    services: "Services",
    company: "Company",
    delivers: "Delivers in",
    rights: "All rights reserved.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Footer({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <footer className="bg-brand-950 text-ink-300">
      <Container className="py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link
              href={localePath("/", lang)}
              className="flex min-h-[44px] items-center gap-2.5 font-display text-lg font-extrabold tracking-display text-paper"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-brand-600 font-display text-sm font-bold text-white">
                K
              </span>
              Kestro
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-400">{c.blurb}</p>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-300">{productsNav.hub.label[lang]}</h3>
            <ul className="mt-4 space-y-0.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={localePath(`/produkter/${category.slug}`, lang)}
                    className="-my-1 block py-3 text-sm text-ink-400 transition hover:text-paper"
                  >
                    {category.shortName[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-300">{c.services}</h3>
            <ul className="mt-4 space-y-0.5">
              {serviceNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href, lang)}
                    className="-my-1 block py-3 text-sm text-ink-400 transition hover:text-paper"
                  >
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-300">{c.company}</h3>
            <ul className="mt-4 space-y-0.5">
              {companyNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href, lang)}
                    className="-my-1 block py-3 text-sm text-ink-400 transition hover:text-paper"
                  >
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-ink-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-ink-400">
              {company.locationShort[lang]} · {c.delivers} {company.serves[lang]}
            </p>
            <a
              href={`mailto:${company.email}`}
              className="mt-1 inline-flex min-h-[44px] items-center text-sm text-ink-400 transition hover:text-paper"
            >
              {company.email}
            </a>
          </div>

          <Link
            href={localePath("/kontakt", lang)}
            className="inline-flex min-h-[48px] items-center gap-2 self-start border border-paper/25 px-6 text-sm font-semibold text-paper transition hover:border-paper/60 sm:self-auto"
          >
            {ui.talkToAdviser[lang]}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-12 border-t border-ink-800 pt-6 text-sm text-ink-500">
          <p>
            &copy; {new Date().getFullYear()} Kestro. {c.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
