"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import Container from "./Container";
import { categories } from "@/lib/categories";
import { company } from "@/lib/company";

const navLinks = [
  { href: "/flaadeloesninger", label: "Flådeløsninger" },
  { href: "/saelg-til-os", label: "Sælg til os" },
  { href: "/reparation", label: "Reparation" },
  { href: "/om-os", label: "Om os" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  function closeMobile() {
    setOpen(false);
    setMobileProductsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-brand-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm text-white">
            K
          </span>
          Kestro
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <Link
              href="/produkter"
              className="flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-brand-700"
              aria-expanded={productsOpen}
            >
              Hvad vi skaffer
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </Link>

            {productsOpen && (
              <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3">
                <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/produkter/${category.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${company.phoneHref}`}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-brand-700"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            {company.phoneDisplay}
          </a>
          <Link
            href="/kontakt"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Få et tilbud
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Åbn eller luk menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <button
              type="button"
              onClick={() => setMobileProductsOpen((v) => !v)}
              aria-expanded={mobileProductsOpen}
              className="flex items-center justify-between rounded-md px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Hvad vi skaffer
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>

            {mobileProductsOpen && (
              <div className="mb-1 space-y-0.5 border-l border-slate-200 pl-3">
                <Link
                  href="/produkter"
                  onClick={closeMobile}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Oversigt
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/produkter/${category.slug}`}
                    onClick={closeMobile}
                    className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="rounded-md px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}

            <a
              href={`tel:${company.phoneHref}`}
              onClick={closeMobile}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-center text-sm font-semibold text-slate-800"
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              {company.phoneDisplay}
            </a>
            <Link
              href="/kontakt"
              onClick={closeMobile}
              className="mt-2 rounded-full bg-brand-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Få et tilbud
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
