import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import Logo from "./Logo";
import { company, postalAddress } from "@/lib/company";
import { companyNav, serviceNav, ui } from "@/lib/nav";
import { localePath, type Lang } from "@/lib/i18n";

const copy = {
  da: {
    blurb:
      "Kestro er indkøbspartner på renoveret erhvervs-IT. Vi forbinder danske og norske virksomheder med de rigtige leverandører – og klargør udstyret til det nordiske marked, før det leveres.",
    services: "Ydelser",
    company: "Virksomhed",
    delivers: "Leverer i",
    rights: "Alle rettigheder forbeholdes.",
    cvrLabel: "CVR",
    trademarks:
      "Produktnavne og varemærker tilhører deres respektive ejere. Kestro er ikke tilknyttet Lenovo, HP, Dell, Apple, Microsoft eller andre nævnte producenter.",
  },
  en: {
    blurb:
      "Kestro is a sourcing partner for refurbished business IT. We connect Danish and Norwegian companies with the right suppliers — and prepare the equipment for the Nordic market before it ships.",
    services: "Services",
    company: "Company",
    delivers: "Delivers in",
    rights: "All rights reserved.",
    cvrLabel: "CVR",
    trademarks:
      "Product names and trademarks belong to their respective owners. Kestro is not affiliated with Lenovo, HP, Dell, Apple, Microsoft or any other manufacturer named on this site.",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function Footer({ lang }: { lang: Lang }) {
  const c = copy[lang];

  return (
    <footer className="lit bg-brand-950 text-ink-300">
      <Container className="py-12 sm:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          <div className="col-span-2">
            <Link
              href={localePath("/", lang)}
              className="flex min-h-[44px] items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-paper"
            >
              <Logo className="h-7 w-auto" />
              Kestro
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-400">{c.blurb}</p>
          </div>

          <div>
            <h3 className="eyebrow text-brand-300">{c.services}</h3>
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
            <h3 className="eyebrow text-brand-300">{c.company}</h3>
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

        {/* The legal line. A B2B buyer looks for the entity, the address and
            the CVR before ordering, and e-handelsloven §7 requires them; each
            part appears when there is a real value for it. */}
        <div className="mt-12 space-y-3 border-t border-white/10 pt-6 text-sm text-ink-400">
          <p className="text-xs leading-6">
            {[
              company.legalForm ? `${company.name} ${company.legalForm}` : company.name,
              postalAddress(lang),
              company.cvr ? `${c.cvrLabel} ${company.cvr}` : null,
              company.phoneDisplay,
              company.email,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="max-w-3xl text-xs leading-6">{c.trademarks}</p>
          <p>
            &copy; {new Date().getFullYear()} Kestro. {c.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
