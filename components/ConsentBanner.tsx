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
    body: "Google Analytics er valgfrit. Ingen annoncer eller deling til markedsføring. Du kan altid ændre dit valg nederst på siden.",
    accept: "Accepter statistik",
    reject: "Kun nødvendige",
    more: "Læs privatlivspolitikken",
    label: "Samtykke til statistik",
  },
  en: {
    title: "May we measure how the site is used?",
    body: "Google Analytics is optional. No advertising or sharing for marketing. Change your choice at any time in the footer.",
    accept: "Accept statistics",
    reject: "Necessary only",
    more: "Read the privacy policy",
    label: "Consent to statistics",
  },
} satisfies Record<Lang, Record<string, string>>;

export default function ConsentBanner({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const [asked, setAsked] = useState(true);

  /* Only after hydration: the server has no idea what this visitor answered,
     and rendering the banner on the server would flash it for everyone. */
  useEffect(() => {
    setAsked(readConsent() !== null);
    const onChange = () => setAsked(readConsent() !== null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (asked) return null;

  return (
    <div
      role="dialog"
      aria-label={c.label}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/15 bg-brand-950/95 backdrop-blur"
    >
      <Container className="flex flex-col gap-4 py-4 sm:py-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-paper leading-[1.6]">{c.title}</p>
          <p className="mt-1 text-sm leading-[1.6] text-paper/75">
            {c.body}{" "}
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
