"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

/*
 * Decided before the first paint, not after hydration.
 *
 * This used to render nothing on the server and then set state in an effect,
 * which inserted a ~100px bar above everything once React had booted. Measured
 * on a 390px viewport that was a layout shift of 0.11 — over Google's 0.1
 * threshold, on every Danish page, while the English pages sat at 0. The bar
 * is the whole of the difference.
 *
 * So the markup ships with the page and is hidden in CSS, and the script below
 * runs synchronously before the bar is parsed, flipping one attribute on
 * <html> when the visitor should see it. Whatever the browser paints first is
 * already correct, so nothing moves afterwards.
 *
 * It is a blocking inline script, which is normally worth avoiding — here it
 * is four lines and it runs before layout, which is exactly the point.
 */
export const languageHintScript = `(function(){try{
if(localStorage.getItem(${JSON.stringify(KEY)})==="1")return;
var l=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];
for(var i=0;i<l.length;i++){if(/^(da|no|nb|nn|sv)\\b/i.test(l[i]))return;}
document.documentElement.setAttribute("data-lang-hint","on");
}catch(e){}})()`;

export default function LanguageHint() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

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
    /* Both, because the attribute is what CSS reads and the state is what
       React reads — leaving either behind would show a bar that is gone. */
    document.documentElement.removeAttribute("data-lang-hint");
    setDismissed(true);
  }

  return (
    <div className="lang-hint border-b border-white/10 bg-white/[0.06]">
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
