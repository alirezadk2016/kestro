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
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link
              href={localePath("/", lang)}
              className="flex items-center gap-2 text-lg font-bold text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm">
                K
              </span>
              Kestro
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">{c.blurb}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{productsNav.hub.label[lang]}</h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={localePath(`/produkter/${category.slug}`, lang)}
                    className="-my-1 block py-2 text-sm text-slate-400 transition hover:text-white"
                  >
                    {category.shortName[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{c.services}</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href, lang)}
                    className="-my-1 block py-2 text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{c.company}</h3>
            <ul className="mt-4 space-y-2.5">
              {companyNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localePath(link.href, lang)}
                    className="-my-1 block py-2 text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">
              {company.locationShort[lang]} · {c.delivers} {company.serves[lang]}
            </p>
            <a
              href={`mailto:${company.email}`}
              className="mt-1 inline-flex min-h-[44px] items-center text-sm text-slate-400 transition hover:text-white"
            >
              {company.email}
            </a>
          </div>

          <Link
            href={localePath("/kontakt", lang)}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:self-auto"
          >
            {ui.talkToAdviser[lang]}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Kestro. {c.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
