import Link from "next/link";
import Container from "./Container";
import { categories } from "@/lib/categories";
import { company } from "@/lib/company";

const companyLinks = [
  { href: "/", label: "Forside" },
  { href: "/ydelser", label: "Ydelser" },
  { href: "/om-os", label: "Om os" },
  { href: "/kontakt", label: "Kontakt" },
];

const serviceLinks = [
  { href: "/produkter", label: "Alle produkter" },
  { href: "/saelg-til-os", label: "Sælg jeres udstyr" },
  { href: "/reparation", label: "Reparation" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm">
                K
              </span>
              Kestro
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Kestro klargør renoveret erhvervshardware fra Sydeuropa til det nordiske marked og
              leverer kvalitetstestede computere til danske og norske virksomheder.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Produkter</h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/produkter/${category.slug}`}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {category.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Ydelser</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Virksomhed</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-slate-800 pt-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Ring til os</h3>
            <a
              href={`tel:${company.phoneHref}`}
              className="mt-2 inline-block text-base font-semibold text-white transition hover:text-brand-300"
            >
              {company.phoneDisplay}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Skriv til os</h3>
            <a
              href={`mailto:${company.email}`}
              className="mt-2 inline-block text-sm text-slate-400 transition hover:text-white"
            >
              {company.email}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Find os</h3>
            <p className="mt-2 text-sm text-slate-400">{company.locationShort}</p>
            <p className="text-sm text-slate-400">Leverer i {company.serves}</p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Kestro. Alle rettigheder forbeholdes.</p>
        </div>
      </Container>
    </footer>
  );
}
