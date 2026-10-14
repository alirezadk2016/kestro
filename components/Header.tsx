"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown, Phone, Search } from "lucide-react";
import Container from "./Container";
import Logo from "./Logo";
import { buttonClass } from "./Button";
import { categories } from "@/lib/categories";
import { company } from "@/lib/company";
import { mainNav, productsNav, ui } from "@/lib/nav";
import { localePath, stripLocale, langs, langLabel, type Lang } from "@/lib/i18n";

/* Loaded the first time someone opens search, not with every page. */
const SiteSearch = dynamic(() => import("./SiteSearch"), { ssr: false });

export default function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const productsTrigger = useRef<HTMLButtonElement>(null);

  /*
   * Hold the page still while the drawer is open.
   *
   * Without this the page keeps scrolling behind a panel that is pinned to the
   * top: a thumb aiming for "Kontakt" moves the article underneath instead,
   * and the content slides past under a translucent menu, which reads as the
   * page glitching rather than as a menu.
   */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    /* And out of reach of Tab. The drawer covers the page, so Tab past its
       last link used to land on a breadcrumb nobody could see. */
    const behind = [document.querySelector("main"), document.querySelector("footer")];
    for (const el of behind) if (el) el.inert = true;
    return () => {
      document.body.style.overflow = previous;
      for (const el of behind) if (el) el.inert = false;
    };
  }, [open]);
  /*
   * Escape closes the drawer.
   *
   * It is what anyone who uses a keyboard reaches for first, and without it
   * the only way out of an open menu was to find the button again — which, on
   * a panel that covers the screen, means tabbing past every link in it.
   * Focus goes back to the control that opened it, so the next Tab carries on
   * from where it was rather than from the top of the document.
   */
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      setMobileProductsOpen(false);
      burger.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pathname = usePathname() ?? "/";

  function openSearch() {
    setOpen(false);
    setMobileProductsOpen(false);
    setSearchLoaded(true);
    setSearchOpen(true);
  }

  /* Ctrl+K / ⌘K, the shortcut every documentation site has taught. */
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (!desktop.matches) return;
      setOpen(false);
      setMobileProductsOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  /** The same page in the other language. */
  const basePath = stripLocale(pathname);

  /*
   * Which navigation item is the page you are on.
   *
   * Nothing marked it. Measured across /flaadeloesninger, /reparation and
   * /om-os: the link for the page you were standing on rendered at exactly
   * the same colour, weight and decoration as the six beside it, and carried
   * no aria-current — so neither a reader nor a screen reader was ever told
   * where they were. On a seven-item bar over thirty-odd pages that is the
   * cheapest orientation cue there is, and it was missing.
   *
   * Prefix matching, not equality, because a section has children: standing on
   * /vejledninger/windows-10-support-slut should light "Viden", the same way
   * standing on the index does. The comparison is against basePath so it works
   * identically on /en.
   */
  const isCurrent = (href: string) =>
    basePath === href || (href !== "/" && basePath.startsWith(href + "/"));

  function closeMobile() {
    setOpen(false);
    setMobileProductsOpen(false);
  }

  return (
    <header className={`glass-nav sticky top-0 z-50 ${basePath === "/" ? "header-home" : ""}`}>
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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-none focus:bg-brand-700 focus:px-5 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
      >
        {ui.skipToContent[lang]}
      </a>

      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href={localePath("/", lang)}
          className="flex min-h-[44px] items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-ink-900"
        >
          <Logo className="h-7 w-auto" idPrefix="header" />
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
          are told not to wrap, the gap tightens below xl, and "Viden" waits
          for xl (lib/nav.ts, `wide`). The quote button stays at every width:
          at 1024 px the row has about 16 px to spare, measured.
        */}
        <nav
          aria-label={ui.mainNav[lang]}
          className="hidden items-center gap-4 whitespace-nowrap lg:flex xl:gap-7"
        >
          {/*
            A link and a disclosure, not a link pretending to be one.
 
            This was a single <Link> carrying aria-expanded, with the panel
            opening on mouseenter. Two things were wrong with that. The panel
            was unreachable from a keyboard — Tab put focus on the link and
            Enter navigated to the hub, so the nine pages inside were not in
            the tab order of any page on the site, which is WCAG 2.1.1 at
            Level A. And aria-expanded on a link tells a screen reader the
            control expands something when what it actually does is leave the
            page.
 
            So the label stays a link to the hub and the chevron becomes a
            button that owns the panel. Pointer behaviour is unchanged; focus
            moving anywhere inside the wrapper opens it, focus leaving the
            wrapper closes it, and Escape closes it and puts focus back on the
            button. onFocus and onBlur are React's focusin/focusout, so they
            catch focus arriving in the panel's children too.
          */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setProductsOpen(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key !== "Escape" || !productsOpen) return;
              setProductsOpen(false);
              productsTrigger.current?.focus();
            }}
          >
            <div className="flex items-center gap-1">
              <Link
                href={localePath(productsNav.hub.href, lang)}
                className="inline-flex min-h-[44px] items-center text-sm font-medium text-ink-700 transition hover:text-ink-900"
              >
                {productsNav.hub.label[lang]}
              </Link>
              <button
                ref={productsTrigger}
                type="button"
                onClick={() => setProductsOpen((v) => !v)}
                aria-expanded={productsOpen}
                aria-controls="header-products"
                aria-label={ui.showProducts[lang]}
                className="-mx-3 inline-flex h-11 w-11 items-center justify-center text-ink-700 transition hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>
            </div>

            {productsOpen && (
              <div
                id="header-products"
                className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3"
              >
                <div className="glass-panel rounded-xl p-2 shadow-xl shadow-ink-900/15">
                  <Link
                    href={localePath(productsNav.models.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ink-100"
                  >
                    {productsNav.models.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.machine.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ink-100"
                  >
                    {productsNav.machine.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.quality.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ink-100"
                  >
                    {productsNav.quality.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.sampleQuote.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ink-100"
                  >
                    {productsNav.sampleQuote.label[lang]}
                  </Link>
                  <div aria-hidden="true" className="mx-3 my-1.5 border-t border-ink-200" />
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={localePath(`/produkter/${category.slug}`, lang)}
                      className="block rounded-lg px-3 py-2 text-sm text-ink-700 transition hover:bg-ink-100 hover:text-ink-900"
                    >
                      {category.name[lang]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {mainNav.map((link) => {
            const current = isCurrent(link.href);
            return (
              <Link
                key={link.href}
                href={localePath(link.href, lang)}
                /* aria-current is the half a screen reader hears; the rule
                   below is the half everyone else sees. Both, not either. */
                aria-current={current ? "page" : undefined}
                className={`relative ${link.wide ? "hidden xl:inline-flex" : "inline-flex"} min-h-[44px] items-center text-sm transition ${
                  current
                    ? "font-semibold text-ink-900 after:absolute after:bottom-[14px] after:left-0 after:right-0 after:h-px after:bg-brand-600"
                    : "font-medium text-ink-700 hover:text-ink-900"
                }`}
              >
                {link.label[lang]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={openSearch}
            aria-label={ui.search[lang]}
            title={`${ui.search[lang]} (Ctrl K)`}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-700 transition hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </button>
          <LanguageSwitcher lang={lang} basePath={basePath} />
          <Link href={localePath("/tilbud", lang)} className={buttonClass("primary")}>
            {ui.bookCall[lang]}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </div>

        {/*
          On a phone every way to reach us used to be behind the burger. For a
          company whose enquiries start with a call, one tap to dial belongs in
          the bar itself.
        */}
        <div className="flex items-center gap-1 lg:hidden">
          {/*
            The quote, one tap away on every page of a phone.

            The bar is the one thing that stays on screen, and below lg it held
            the logo and the burger only: on an interior page the first "Få et
            tilbud" was anywhere from 1,000 to 7,800px down. On the front page
            the hero's own button is on the first screen, so there this one
            waits until that has scrolled away (header-cta-home in
            globals.css) rather than standing beside it.
          */}
          <Link
            href={localePath("/tilbud", lang)}
            className={`mr-1 inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-3.5 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-brand-700 motion-safe:active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
              basePath === "/" ? "header-cta-home" : ""
            }`}
          >
            {ui.bookCall[lang]}
          </Link>

          {company.phoneHref && (
            <a
              href={`tel:${company.phoneHref}`}
              aria-label={ui.callUs[lang]}
              className="inline-flex h-11 w-11 items-center justify-center text-ink-700 transition hover:text-ink-900"
            >
              <Phone className="h-5 w-5" strokeWidth={1.9} />
            </a>
          )}

          <button
            type="button"
            onClick={openSearch}
            aria-label={ui.search[lang]}
            className="inline-flex h-11 w-11 items-center justify-center text-ink-800 transition hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <Search className="h-5 w-5" strokeWidth={1.9} />
          </button>

          <button
            ref={burger}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={ui.openMenu[lang]}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
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

      {/* Opaque, not glass: the drawer covers the page rather than floating over
          a strip of it, and at 82% the article read straight through the links.
          It fills the screen under the bar: it used to stop where its links
          ran out, with the page's heading showing beneath it, live to a tap
          but locked against scrolling. */}
      {open && (
        <div
          id="mobile-menu"
          className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-ink-200 bg-white sm:h-[calc(100dvh-5rem)] lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {/* Search first: on a phone it is the fastest way to any of the
                136 pages, and it looks like the field it opens. */}
            <button
              type="button"
              onClick={openSearch}
              className="mb-2 flex min-h-[48px] items-center gap-3 rounded-xl border border-ink-300 bg-ink-50 px-3.5 text-left text-base text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <Search aria-hidden="true" className="h-5 w-5 flex-none" strokeWidth={1.9} />
              {ui.searchSite[lang]}
            </button>

            <button
              type="button"
              onClick={() => setMobileProductsOpen((v) => !v)}
              aria-expanded={mobileProductsOpen}
              aria-controls="mobile-products"
              className="flex min-h-[44px] items-center justify-between rounded-lg px-3 text-base font-medium text-ink-800 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              {productsNav.hub.label[lang]}
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>

            {/* Every row 44px. They were 36, thirteen of them in a column,
                which is the densest set of targets on the site and the one
                most often hit with a thumb. */}
            {mobileProductsOpen && (
              <div id="mobile-products" className="mb-1 border-l border-ink-200 pl-3">
                {[
                  { href: productsNav.hub.href, label: productsNav.overview },
                  productsNav.models,
                  productsNav.machine,
                  productsNav.quality,
                  productsNav.sampleQuote,
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={localePath(item.href, lang)}
                    onClick={closeMobile}
                    aria-current={basePath === item.href ? "page" : undefined}
                    className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-ink-100 hover:text-ink-900 ${
                      basePath === item.href ? "text-ink-900" : "text-ink-800"
                    }`}
                  >
                    {item.label[lang]}
                  </Link>
                ))}
                <div aria-hidden="true" className="mx-3 my-1 border-t border-ink-200" />
                {categories.map((category) => {
                  const href = `/produkter/${category.slug}`;
                  return (
                    <Link
                      key={category.slug}
                      href={localePath(href, lang)}
                      onClick={closeMobile}
                      aria-current={basePath === href ? "page" : undefined}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm transition-colors hover:bg-ink-100 hover:text-ink-900 ${
                        basePath === href ? "font-medium text-ink-900" : "text-ink-700"
                      }`}
                    >
                      {category.name[lang]}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* The page you are on, marked here as in the bar on a wide
                screen: aria-current for a screen reader, a lit row and full
                white for everyone else. */}
            {mainNav.map((link) => {
              const current = isCurrent(link.href);
              return (
                <Link
                  key={link.href}
                  href={localePath(link.href, lang)}
                  onClick={closeMobile}
                  aria-current={current ? "page" : undefined}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium transition-colors hover:bg-ink-100 hover:text-ink-900 ${
                    current ? "bg-ink-100 text-ink-900" : "text-ink-800"
                  }`}
                >
                  {link.label[lang]}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-ink-200 pt-3">
              <LanguageSwitcher lang={lang} basePath={basePath} onNavigate={closeMobile} />
            </div>

            {/* The site's button, not a square-cornered block in the one
                place every other button has a radius. */}
            <Link
              href={localePath("/tilbud", lang)}
              onClick={closeMobile}
              className={`${buttonClass("primary", "lg")} mt-3 w-full`}
            >
              {ui.bookCall[lang]}
            </Link>
          </Container>
        </div>
      )}

      {searchLoaded && (
        <SiteSearch lang={lang} open={searchOpen} onClose={() => setSearchOpen(false)} />
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
    /* Two words and a rule, not a segmented control.
       It was a bordered pair with the current language filled in brand blue,
       which put a third button-shaped object in a bar that already has one
       real button — and a filled chip reads as "press me" when the thing it
       marks is simply where you already are. The reference underlines the
       current language and leaves the other quiet, which is what a state
       marker should look like. */
    /* Each link is a 44px square; the underline sits on the two letters
       inside it, so the pair looks as it did when the links were 19px wide
       and too small to hit. */
    <div className="-mx-3 flex w-fit items-center" role="group" aria-label={ui.language[lang]}>
      {langs.map((code) => (
        <Link
          key={code}
          href={localePath(basePath, code)}
          onClick={onNavigate}
          hrefLang={code}
          aria-current={code === lang ? "true" : undefined}
          className={`group inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xs font-semibold uppercase tracking-[0.08em] transition ${
            code === lang ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
          }`}
        >
          <span className="sr-only">{langLabel[code]}</span>
          <span
            aria-hidden="true"
            className={`border-b-2 pb-0.5 pt-0.5 ${code === lang ? "border-ink-900" : "border-transparent"}`}
          >
            {code}
          </span>
        </Link>
      ))}
    </div>
  );
}
