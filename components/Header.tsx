"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import Container from "./Container";
import Logo from "./Logo";
import { categories } from "@/lib/categories";
import { company } from "@/lib/company";
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
    <header className="glass sticky top-0 z-50 border-b border-ink-900/8">
      {/*
        The first thing a keyboard reaches on every page.
       
        Without it, tabbing to the content means going through the logo, eight
        navigation items, the products menu, two language buttons and the call
        to action — on every page, every time. WCAG calls this Bypass Blocks
        and it is a Level A requirement; it is also just the difference between
        a site that can be used from a keyboard and one that can technically be
        operated from one.

        Off-screen until focused rather than hidden, because a hidden element
        cannot be focused and would never appear.
      */}
      <a
        href="#indhold"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-none focus:bg-brand-700 focus:px-5 focus:text-sm focus:font-semibold focus:text-paper focus:outline-none focus:ring-2 focus:ring-paper focus:ring-offset-2"
      >
        {ui.skipToContent[lang]}
      </a>

      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href={localePath("/", lang)}
          className="flex min-h-[44px] items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-ink-900"
        >
          <Logo className="h-7 w-auto" />
          Kestro
        </Link>

        {/*
          The navigation and the button beside it have to fit on one line, and
          between 1024 and 1168 px they did not: "Hvad vi skaffer", "Sælg til
          os" and "Om os" each broke onto a second line and the header grew a
          row taller. That is the whole of tablet landscape and every small
          laptop.

          Fixed by giving the row less to carry rather than by pushing the
          breakpoint up and sending laptops back to the burger menu. The items
          are told not to wrap, the gap tightens below xl, and the call to
          action steps aside until there is room for it — it is the widest
          thing in the header and, at the top of the page, it repeats the
          button in the hero directly underneath. It comes back at xl, and in
          between the nav's own Kontakt link still reaches the same page.
        */}
        <nav className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-7">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <Link
              href={localePath(productsNav.hub.href, lang)}
              className="flex items-center gap-1 text-sm font-medium text-ink-700 transition hover:text-brand-700"
              aria-expanded={productsOpen}
            >
              {productsNav.hub.label[lang]}
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </Link>

            {productsOpen && (
              <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3">
                <div className="glass rounded-xl border border-ink-900/8 p-2 shadow-xl shadow-ink-900/10">
                  <Link
                    href={localePath(productsNav.models.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {productsNav.models.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.machine.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {productsNav.machine.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.quality.href, lang)}
                    className="mb-1 block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {productsNav.quality.label[lang]}
                  </Link>
                  <div className="mb-1 border-t border-paper-edge" />
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={localePath(`/produkter/${category.slug}`, lang)}
                      className="block rounded-lg px-3 py-2 text-sm text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
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
              className="text-sm font-medium text-ink-700 transition hover:text-brand-700"
            >
              {link.label[lang]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher lang={lang} basePath={basePath} />
          <Link
            href={localePath("/kontakt", lang)}
            className="hidden min-h-[44px] items-center whitespace-nowrap bg-brand-600 px-6 text-sm font-semibold tracking-tight text-paper transition hover:bg-brand-700 xl:inline-flex"
          >
            {ui.bookCall[lang]}
          </Link>
        </div>

        {/*
          On a phone every way to reach us used to be behind the burger. For a
          company whose enquiries start with a call, one tap to dial belongs in
          the bar itself.
        */}
        <div className="flex items-center gap-1 lg:hidden">
          {company.phoneHref && (
            <a
              href={`tel:${company.phoneHref}`}
              aria-label={ui.callUs[lang]}
              className="inline-flex h-11 w-11 items-center justify-center text-ink-700 transition hover:text-brand-700"
            >
              <Phone className="h-5 w-5" strokeWidth={1.9} />
            </a>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={ui.openMenu[lang]}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
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
        </div>
      </Container>

      {open && (
        <div className="glass max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink-900/8 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <button
              type="button"
              onClick={() => setMobileProductsOpen((v) => !v)}
              aria-expanded={mobileProductsOpen}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {productsNav.hub.label[lang]}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>

            {mobileProductsOpen && (
              <div className="mb-1 space-y-0.5 border-l border-paper-edge pl-3">
                <Link
                  href={localePath(productsNav.hub.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {productsNav.overview[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.models.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {productsNav.models.label[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.machine.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {productsNav.machine.label[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.quality.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {productsNav.quality.label[lang]}
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={localePath(`/produkter/${category.slug}`, lang)}
                    onClick={closeMobile}
                    className="block rounded-lg px-3 py-2 text-sm text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
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
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label[lang]}
              </Link>
            ))}

            <div className="mt-3 border-t border-paper-edge pt-3">
              <LanguageSwitcher lang={lang} basePath={basePath} onNavigate={closeMobile} />
            </div>

            <Link
              href={localePath("/kontakt", lang)}
              onClick={closeMobile}
              className="mt-2 bg-brand-600 px-5 py-3.5 text-center text-sm font-semibold text-paper"
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
      className="flex w-fit items-center border border-paper-edge"
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
          className={`inline-flex min-h-[38px] items-center px-3 text-xs font-semibold uppercase tracking-wider transition ${
            code === lang ? "bg-brand-950 text-paper" : "text-ink-700 hover:text-ink-900"
          }`}
        >
          <span className="sr-only">{langLabel[code]}</span>
          <span aria-hidden="true">{code}</span>
        </Link>
      ))}
    </div>
  );
}
