"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
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
    return () => {
      document.body.style.overflow = previous;
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
    <header className="glass-nav sticky top-0 z-50">
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
          className="flex min-h-[44px] items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-paper"
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
          are told not to wrap, the gap tightens below xl, and the call to
          action steps aside until there is room for it — it is the widest
          thing in the header and, at the top of the page, it repeats the
          button in the hero directly underneath. It comes back at xl, and in
          between the nav's own Kontakt link still reaches the same page.
        */}
        <nav
          aria-label={ui.mainNav[lang]}
          className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-7"
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
                className="inline-flex min-h-[44px] items-center text-sm font-medium text-paper/75 transition hover:text-paper"
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
                className="inline-flex h-6 w-5 items-center justify-center text-paper/75 transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
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
                  <Link
                    href={localePath(productsNav.models.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10"
                  >
                    {productsNav.models.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.machine.href, lang)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10"
                  >
                    {productsNav.machine.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.quality.href, lang)}
                    className="mb-1 block rounded-lg px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10"
                  >
                    {productsNav.quality.label[lang]}
                  </Link>
                  <Link
                    href={localePath(productsNav.pricing.href, lang)}
                    className="mb-1 block rounded-lg px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10"
                  >
                    {productsNav.pricing.label[lang]}
                  </Link>{" "}
                  <Link
                    href={localePath(productsNav.sampleQuote.href, lang)}
                    className="mb-1 block rounded-lg px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10"
                  >
                    {productsNav.sampleQuote.label[lang]}
                  </Link>
                  <div className="mb-1 border-t border-white/10" />
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={localePath(`/produkter/${category.slug}`, lang)}
                      className="block rounded-lg px-3 py-2 text-sm text-paper/75 transition hover:bg-white/10 hover:text-paper"
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
                className={`relative inline-flex min-h-[44px] items-center text-sm transition ${
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
          <LanguageSwitcher lang={lang} basePath={basePath} />
          <Link
            href={localePath("/tilbud", lang)}
            className="group inline-flex items-center justify-center gap-2.5 font-semibold tracking-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 min-h-[44px] text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-500 px-6"
          >
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
          {company.phoneHref && (
            <a
              href={`tel:${company.phoneHref}`}
              aria-label={ui.callUs[lang]}
              className="inline-flex h-11 w-11 items-center justify-center text-paper/75 transition hover:text-paper"
            >
              <Phone className="h-5 w-5" strokeWidth={1.9} />
            </a>
          )}

          <button
            ref={burger}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={ui.openMenu[lang]}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
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
          a strip of it, and at 82% the article read straight through the links. */}
      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-white/10 bg-brand-950 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <button
              type="button"
              onClick={() => setMobileProductsOpen((v) => !v)}
              aria-expanded={mobileProductsOpen}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
            >
              {productsNav.hub.label[lang]}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>

            {mobileProductsOpen && (
              <div className="mb-1 space-y-0.5 border-l border-white/10 pl-3">
                <Link
                  href={localePath(productsNav.hub.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
                >
                  {productsNav.overview[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.models.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
                >
                  {productsNav.models.label[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.machine.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
                >
                  {productsNav.machine.label[lang]}
                </Link>
                <Link
                  href={localePath(productsNav.quality.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
                >
                  {productsNav.quality.label[lang]}
                </Link>{" "}
                <Link
                  href={localePath(productsNav.pricing.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
                >
                  {productsNav.pricing.label[lang]}
                </Link>{" "}
                <Link
                  href={localePath(productsNav.sampleQuote.href, lang)}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
                >
                  {productsNav.sampleQuote.label[lang]}
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={localePath(`/produkter/${category.slug}`, lang)}
                    onClick={closeMobile}
                    className="block rounded-lg px-3 py-2 text-sm text-paper/75 transition hover:bg-white/10 hover:text-paper"
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
                className="rounded-lg px-3 py-2.5 text-base font-medium text-paper/85 transition hover:bg-white/10 hover:text-paper"
              >
                {link.label[lang]}
              </Link>
            ))}

            <div className="mt-3 border-t border-white/10 pt-3">
              <LanguageSwitcher lang={lang} basePath={basePath} onNavigate={closeMobile} />
            </div>

            <Link
              href={localePath("/tilbud", lang)}
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
    /* Two words and a rule, not a segmented control.
       It was a bordered pair with the current language filled in brand blue,
       which put a third button-shaped object in a bar that already has one
       real button — and a filled chip reads as "press me" when the thing it
       marks is simply where you already are. The reference underlines the
       current language and leaves the other quiet, which is what a state
       marker should look like. */
    <div className="flex w-fit items-center gap-4" role="group" aria-label={ui.language[lang]}>
      {langs.map((code) => (
        <Link
          key={code}
          href={localePath(basePath, code)}
          onClick={onNavigate}
          hrefLang={code}
          aria-current={code === lang ? "true" : undefined}
          className={`inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.08em] transition ${
            code === lang
              ? "border-b-2 border-paper pt-0.5 text-paper"
              : "border-b-2 border-transparent pt-0.5 text-paper/55 hover:text-paper"
          }`}
        >
          <span className="sr-only">{langLabel[code]}</span>
          <span aria-hidden="true">{code}</span>
        </Link>
      ))}
    </div>
  );
}
