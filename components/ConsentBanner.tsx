"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "./Container";
import { CONSENT_EVENT, readConsent, writeConsent } from "@/lib/consent";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * The consent banner.
 *
 * Two buttons, equal weight. Danish practice on this is not subtle: refusing
 * has to be as easy as accepting, so "kun nødvendige" is the same size, in the
 * same place, and not greyed out. There is no third "manage settings" step,
 * because there is only one thing to decide — the site runs statistics or it
 * does not.
 *
 * Nothing from Google is loaded until this returns "granted"; see
 * components/Analytics.tsx.
 */
const copy = {
  da: {
    title: "Må vi måle, hvordan siden bruges?",
    body: "Google Analytics er valgfrit og uden annoncer. Valget kan ændres nederst på siden.",
    accept: "Accepter statistik",
    reject: "Kun nødvendige",
    more: "Privatlivspolitik",
    label: "Samtykke til statistik",
  },
  en: {
    title: "May we measure how the site is used?",
    body: "Google Analytics is optional and carries no advertising. Change your choice in the footer.",
    accept: "Accept statistics",
    reject: "Necessary only",
    more: "Privacy policy",
    label: "Consent to statistics",
  },
} satisfies Record<Lang, Record<string, string>>;

/*
 * Drawn by the server, shown before the first frame (2026-11-24).
 *
 * The banner used to exist only after hydration, so on a first visit it was
 * painted about three seconds in on a throttled phone, and as the largest
 * text on the screen it was the page's Largest Contentful Paint: 3.5 s on the
 * laptop category, against Google's 2.5 s. Now the server renders it hidden,
 * and this script, at the top of <body>, shows it before anything is painted
 * when no answer is stored. A returning visitor never sees it, and without
 * JavaScript it stays hidden, because its buttons need JavaScript to work.
 * The key and the two values are lib/consent.ts's.
 */
export const consentAskScript = `try{var v=localStorage.getItem("kestro-consent");if(v!=="granted"&&v!=="denied")document.documentElement.dataset.consentAsk="1"}catch(e){document.documentElement.dataset.consentAsk="1"}`;

export default function ConsentBanner({ lang }: { lang: Lang }) {
  const c = copy[lang];
  /* Rendered on the server and on the client's first pass alike, so the two
     match; the effect below removes it once an answer is known. */
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    setAsked(readConsent() !== null);
    const onChange = () => setAsked(readConsent() !== null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  /* While the banner is up it covers the foot of a phone's first screen —
     on the front page, the hero's own quote button. The bar's button is
     normally held back there until the hero scrolls away; this lets it show
     while the hero's is covered (globals.css, header-cta-home). */
  useEffect(() => {
    const root = document.documentElement;
    /* Read the answer itself, not the state: on the first pass the state is
       "not asked" for everyone, and a returning visitor's header must not
       blink. */
    if (asked || readConsent() !== null) {
      delete root.dataset.consentOpen;
      delete root.dataset.consentAsk;
    } else {
      /* Also when the question is asked again from the footer, after the
         first-paint script last ran: the banner is shown by this mark. */
      root.dataset.consentOpen = "1";
      root.dataset.consentAsk = "1";
    }
    return () => {
      delete root.dataset.consentOpen;
    };
  }, [asked]);

  if (asked) return null;

  return (
    <div
      role="dialog"
      aria-label={c.label}
      className="consent-banner fixed inset-x-0 bottom-0 z-[60] border-t border-white/15 bg-brand-950/95 backdrop-blur"
    >
      <Container className="flex flex-col gap-3 py-3 sm:gap-4 sm:py-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="max-w-3xl">
          <p className="text-sm leading-[1.55] text-paper/75">
            <span className="font-semibold text-paper">{c.title}</span> {c.body}{" "}
            <Link
              href={localePath("/privatlivspolitik", lang)}
              className="font-semibold text-brand-300 underline decoration-brand-400/60 underline-offset-4 hover:text-paper"
            >
              {c.more}
            </Link>
            .
          </p>
        </div>

        <div className="grid flex-shrink-0 grid-cols-2 gap-3 lg:ml-auto">
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/25 bg-white/5 px-3 text-sm font-semibold text-paper transition hover:border-white/50 sm:px-6"
          >
            {c.accept}
          </button>
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/25 bg-white/5 px-3 text-sm font-semibold text-paper transition hover:border-white/50 sm:px-6"
          >
            {c.reject}
          </button>
        </div>
      </Container>
    </div>
  );
}
