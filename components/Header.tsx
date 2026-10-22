"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const productsTrigger = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const panel = drawer.current;
    if (!open || !panel) return;
    const viewport = window.visualViewport;
    function sizeDrawer() {
      if (!panel) return;
      const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
      const height = `${Math.max(0, bottom - panel.getBoundingClientRect().top)}px`;
      if (panel.style.height !== height) panel.style.height = height;
    }
    /* The language hint can leave the sticky bar below the viewport's top.
       Size from the drawer's real position, including after text or viewport
       changes, rather than subtracting a nominal header height. */
    sizeDrawer();
    const observer = new ResizeObserver(sizeDrawer);
    if (header.current) observer.observe(header.current);
    const hint = document.querySelector(".lang-hint");
    if (hint) observer.observe(hint);
    window.addEventListener("resize", sizeDrawer);
    window.addEventListener("scroll", sizeDrawer, { passive: true });
    viewport?.addEventListener("resize", sizeDrawer);
    viewport?.addEventListener("scroll", sizeDrawer);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sizeDrawer);
      window.removeEventListener("scroll", sizeDrawer);
      viewport?.removeEventListener("resize", sizeDrawer);
      viewport?.removeEventListener("scroll", sizeDrawer);
    };
  }, [open]);

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
    /* The language hint and consent banner are siblings too. Isolating only
       main/footer left their controls reachable behind the full-screen menu. */
    const behind = Array.from(header.current?.parentElement?.children ?? [])
      .filter((el): el is HTMLElement => el instanceof HTMLElement && el !== header.current)
      .map((el) => ({ el, inert: el.inert }));
    for (const { el } of behind) el.inert = true;
    return () => {
      document.body.style.overflow = previous;
      for (const { el, inert } of behind) el.inert = inert;
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
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        setMobileProductsOpen(false);
        burger.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(
        header.current?.querySelectorAll<HTMLElement>(
          'a[href]:not([tabindex="-1"]), button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        ) ?? [],
      ).filter((el) => el.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (!header.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pathname = usePathname() ?? "/";

  function openSearch() {
    /* The drawer's search control unmounts as it opens the dialog. Give the
       native dialog a persistent return target before that happens. */
    if (drawer.current?.contains(document.activeElement)) burger.current?.focus();
    setOpen(false);
    setProductsOpen(false);
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
    setProductsOpen(false);
    setMobileProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      setProductsOpen(false);
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
  const productPages = [
    productsNav.models,
    productsNav.machine,
    productsNav.quality,
    productsNav.sampleQuote,
  ];
  const productsCurrent = [productsNav.hub, ...productPages].some((link) => isCurrent(link.href));

  function closeProducts() {
    setProductsOpen(false);
  }

  function closeMobile() {
    setOpen(false);
    setMobileProductsOpen(false);
  }

  return (
    <header
      ref={header}
      className={`glass-nav sticky top-0 ${open ? "z-[70]" : "z-50"} ${basePath === "/" ? "header-home" : ""}`}
    >
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
        tabIndex={open ? -1 : undefined}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-none focus:bg-brand-700 focus:px-5 focus:text-sm focus:font-semibold focus:text-paper focus:outline-none focus:ring-2 focus:ring-paper focus:ring-offset-2"
      >
        {ui.skipToContent[lang]}
      </a>

      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href={localePath("/", lang)}
          onClick={closeMobile}
          className="flex min-h-[44px] flex-none items-center gap-2.5 whitespace-nowrap font-display text-xl font-extrabold tracking-tight text-paper max-[359px]:gap-2 max-[359px]:text-lg"
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
            button that owns the panel. Focus leaving the wrapper closes it,
            and Escape closes it and puts focus back on the button. React's
            onBlur bubbles, so it also catches focus leaving a panel link.
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
                onClick={closeProducts}
                aria-current={
                  basePath === productsNav.hub.href ? "page" : productsCurrent ? "true" : undefined
                }
                className={`relative inline-flex min-h-[44px] items-center text-sm transition ${
                  productsCurrent
                    ? "font-semibold text-paper after:absolute after:bottom-[14px] after:left-0 after:right-0 after:h-px after:bg-brand-400"
                    : "font-medium text-paper/75 hover:text-paper"
                }`}
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
                className="-mx-3 inline-flex h-11 w-11 items-center justify-center text-paper/75 transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
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
                <div className="glass-panel rounded-xl p-2 shadow-xl shadow-black/40">
                  {productPages.map((link) => (
                    <Link
                      key={link.href}
                      href={localePath(link.href, lang)}
                      onClick={closeProducts}
                      aria-current={isCurrent(link.href) ? "page" : undefined}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10 ${isCurrent(link.href) ? "bg-white/[0.08]" : ""}`}
                    >
                      {link.label[lang]}
                    </Link>
                  ))}
                  <div aria-hidden="true" className="mx-3 my-1.5 border-t border-white/10" />
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={localePath(`/produkter/${category.slug}`, lang)}
                      onClick={closeProducts}
                      aria-current={isCurrent(`/produkter/${category.slug}`) ? "page" : undefined}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm transition hover:bg-white/10 hover:text-paper ${isCurrent(`/produkter/${category.slug}`) ? "bg-white/[0.08] font-semibold text-paper" : "text-paper/75"}`}
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
                    ? "font-semibold text-paper after:absolute after:bottom-[14px] after:left-0 after:right-0 after:h-px after:bg-brand-400"
                    : "font-medium text-paper/75 hover:text-paper"
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
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-paper/75 transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
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
        <div className="flex flex-none items-center gap-1 max-[359px]:gap-0 lg:hidden">
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
            onClick={closeMobile}
            className={`mr-1 inline-flex h-11 flex-none items-center justify-center whitespace-nowrap rounded-lg bg-brand-600 px-3.5 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-brand-500 motion-safe:active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 max-[359px]:px-2.5 ${
              basePath === "/" ? "header-cta-home" : ""
            }`}
          >
            {ui.bookCall[lang]}
          </Link>

          {company.phoneHref && (
            <a
              href={`tel:${company.phoneHref}`}
              aria-label={ui.callUs[lang]}
              className="inline-flex h-11 w-11 flex-none items-center justify-center text-paper/75 transition hover:text-paper"
            >
              <Phone className="h-5 w-5" strokeWidth={1.9} />
            </a>
          )}

          <button
            type="button"
            onClick={openSearch}
            aria-label={ui.search[lang]}
            className="inline-flex h-11 w-11 flex-none items-center justify-center text-paper/85 transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
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
            className="-mr-2 inline-flex h-11 w-11 flex-none items-center justify-center text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
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
          ref={drawer}
          id="mobile-menu"
          className="overflow-y-auto overscroll-contain border-b border-white/10 bg-brand-950 lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {/* Search first: on a phone it is the fastest way to any of the
                136 pages, and it looks like the field it opens. */}
            <button
              type="button"
              onClick={openSearch}
              className="mb-2 flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-left text-base text-paper/75 transition-colors hover:border-white/25 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            >
              <Search aria-hidden="true" className="h-5 w-5 flex-none" strokeWidth={1.9} />
              {ui.searchSite[lang]}
            </button>

            <button
              type="button"
              onClick={() => setMobileProductsOpen((v) => !v)}
              aria-expanded={mobileProductsOpen}
              aria-controls="mobile-products"
              aria-current={productsCurrent ? "true" : undefined}
              className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-base font-medium transition-colors hover:bg-white/10 hover:text-paper ${productsCurrent ? "bg-white/[0.06] text-paper" : "text-paper/85"}`}
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
              <div id="mobile-products" className="mb-1 border-l border-white/10 pl-3">
                {[{ href: productsNav.hub.href, label: productsNav.overview }, ...productPages].map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={localePath(item.href, lang)}
                      onClick={closeMobile}
                      aria-current={basePath === item.href ? "page" : undefined}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-white/10 hover:text-paper ${
                        basePath === item.href ? "text-paper" : "text-paper/85"
                      }`}
                    >
                      {item.label[lang]}
                    </Link>
                  ),
                )}
                <div aria-hidden="true" className="mx-3 my-1 border-t border-white/10" />
                {categories.map((category) => {
                  const href = `/produkter/${category.slug}`;
                  return (
                    <Link
                      key={category.slug}
                      href={localePath(href, lang)}
                      onClick={closeMobile}
                      aria-current={basePath === href ? "page" : undefined}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm transition-colors hover:bg-white/10 hover:text-paper ${
                        basePath === href ? "font-medium text-paper" : "text-paper/75"
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
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium transition-colors hover:bg-white/10 hover:text-paper ${
                    current ? "bg-white/[0.06] text-paper" : "text-paper/85"
                  }`}
                >
                  {link.label[lang]}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-white/10 pt-3">
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
  const [suffix, setSuffix] = useState("");
  useEffect(() => {
    function syncLocation() {
      const current = new URLSearchParams(window.location.search);
      const selection = new URLSearchParams();
      /* Keep only the quote form's existing public selection fields. Tracking
         and arbitrary query parameters are not part of the other language. */
      if (basePath === "/tilbud") {
        for (const key of ["model", "hvornaar"]) {
          const value = current.get(key)?.trim().slice(0, 120);
          if (value) selection.set(key, value);
        }
        const quantity = current.get("antal");
        if (quantity && ["1", "2–9", "10–49", "50+"].includes(quantity)) {
          selection.set("antal", quantity);
        }
      }
      const query = selection.toString();
      setSuffix(`${query ? `?${query}` : ""}${window.location.hash}`);
    }
    syncLocation();
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);
    return () => {
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
    };
  }, [basePath, lang]);

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
          href={`${localePath(basePath, code)}${suffix}`}
          onClick={onNavigate}
          hrefLang={code}
          aria-current={code === lang ? "true" : undefined}
          className={`group inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xs font-semibold uppercase tracking-[0.08em] transition ${
            code === lang ? "text-paper" : "text-paper/65 hover:text-paper"
          }`}
        >
          <span className="sr-only">{langLabel[code]}</span>
          <span
            aria-hidden="true"
            className={`border-b-2 pb-0.5 pt-0.5 ${code === lang ? "border-paper" : "border-transparent"}`}
          >
            {code}
          </span>
        </Link>
      ))}
    </div>
  );
}
