"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "./Container";

/*
 * "This page is also available in English."
 *
 * The site used to redirect visitors outside Scandinavia from the front page
 * to /en, by IP. That risked the Danish front page's place in the index, so
 * the offer is made here instead: the page stays Danish for everyone and every
 * crawler, and a browser that is not set to a Scandinavian language gets a
 * line offering the English version.
 *
 * navigator.language, not geography: someone in Copenhagen with an English
 * laptop is better served in English, and someone Danish on holiday abroad is
 * not suddenly served a language they did not ask for. Dismissing it, or
 * switching language in the header, is remembered.
 */
const KEY = "kestro-lang-hint";
const NORDIC = /^(da|no|nb|nn|sv)\b/i;

export default function LanguageHint() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(KEY) === "1";
    } catch {
      /* Storage blocked: show it, dismissing just will not stick. */
    }
    if (dismissed) return;
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    if (languages.some((l) => NORDIC.test(l))) return;
    setShow(true);
  }, []);

  if (!show) return null;

  /* The same page in English. usePathname reports the rewritten /da path on
     Danish pages, so strip it before prefixing. */
  const clean = pathname.replace(/^\/da(?=\/|$)/, "");
  const href = `/en${clean === "/" ? "" : clean}`;

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* Nothing to remember it with. */
    }
    setShow(false);
  }

  return (
    <div className="border-b border-white/10 bg-white/[0.06]">
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
        <p className="text-sm text-paper/75">This page is also available in English.</p>
        <Link
          href={href}
          onClick={dismiss}
          className="inline-flex min-h-[36px] items-center text-sm font-semibold text-brand-300 underline decoration-brand-400/60 underline-offset-4 transition hover:text-paper"
        >
          Read in English
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="ml-auto inline-flex min-h-[36px] items-center text-sm text-paper/55 transition hover:text-paper"
        >
          Dismiss
        </button>
      </Container>
    </div>
  );
}
