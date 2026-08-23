"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "./Container";
import { categories } from "@/lib/categories";
import { mainNav, productsNav, ui } from "@/lib/nav";
import { localePath, stripLocale, langs, langLabel, type Lang } from "@/lib/i18n";

export default function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  /** The same page in the other language. */
  const basePath = stripLocale(pathname);

  function closeMobile() {
    setOpen(false);
    setMobileProductsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href={localePath("/", lang)}
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
              href={localePath(productsNav.hub.href, lang)}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-brand-700"
              aria-expanded={productsOpen}
            >
              {productsNav.hub.label[lang]}
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </Link>

            {productsOpen && (
              <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3">
                <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <Link
                    href={localePath(productsNav.models.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-brand-700"
                  >
                    {productsNav.models.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.quality.href, lang)}
                    className="mb-1 block rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-brand-700"
                  >
                    {productsNav.quality.label[lang]}
                  </Link>
                  <div className="mb-1 border-t border-slate-100" />
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={localePath(`/produkter/${category.slug}`, lang)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
                    >
                      {category.name[lang]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={localePath(link.href, lang)}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-700"
            >
              {link.label[lang]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher lang={lang} basePath={basePath} />
          <Link
            href={localePath("/kontakt", lang)}
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            {ui.bookCall[lang]}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={ui.openMenu[lang]}
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
              {productsNav.hub.label[lang]}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>

            {mobileProductsOpen && (
              <div className="mb-1 space-y-0.5 border-l border-slate-200 pl-3">
                <Link
                  href={localePath(productsNav.hub.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {productsNav.overview[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.models.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {productsNav.models.label[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.quality.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {productsNav.quality.label[lang]}
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={localePath(`/produkter/${category.slug}`, lang)}
                    onClick={closeMobile}
                    className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    {category.name[lang]}
                  </Link>
                ))}
              </div>
            )}

            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={localePath(link.href, lang)}
                onClick={closeMobile}
                className="rounded-md px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label[lang]}
              </Link>
            ))}

            <div className="mt-3 border-t border-slate-200 pt-3">
              <LanguageSwitcher lang={lang} basePath={basePath} onNavigate={closeMobile} />
            </div>

            <Link
              href={localePath("/kontakt", lang)}
              onClick={closeMobile}
              className="mt-2 rounded-full bg-brand-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              {ui.bookCall[lang]}
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}

function LanguageSwitcher({
  lang,
  basePath,
  onNavigate,
}: {
  lang: Lang;
  basePath: string;
  onNavigate?: () => void;
}) {
  return (
    <div
      className="flex w-fit items-center gap-1 rounded-full border border-slate-200 p-1"
      role="group"
      aria-label={ui.language[lang]}
    >
      {langs.map((code) => (
        <Link
          key={code}
          href={localePath(basePath, code)}
          onClick={onNavigate}
          hrefLang={code}
          aria-current={code === lang ? "true" : undefined}
          className={`inline-flex min-h-[36px] items-center rounded-full px-3 text-xs font-semibold uppercase transition ${
            code === lang
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span className="sr-only">{langLabel[code]}</span>
          <span aria-hidden="true">{code}</span>
        </Link>
      ))}
    </div>
  );
}
