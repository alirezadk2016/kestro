"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "./Container";
import { localePath } from "@/lib/i18n";

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
 * already correct.
 *
 * It is a blocking inline script, which is normally worth avoiding — here it
 * is four lines and it runs before layout, which is exactly the point.
 *
 * That was necessary and not sufficient. The bar used to lay its three parts
 * out with flex-wrap, so how tall it was depended on where the text happened
 * to break — and the text breaks in a different place before the web font
 * arrives than after. Measured on a 390px viewport: two rows and 85px in the
 * fallback face, three rows and 101px once Plus Jakarta Sans swapped in, with
 * the whole document below it moving down 16px. CLS 0.259 on every page, for
 * every visitor whose browser language is not Scandinavian.
 *
 * A metric-matched fallback narrows that but cannot close it: size-adjust
 * matches average advance width across the alphabet, not the width of one
 * particular sentence, so the wrap threshold can still be crossed. The fix has
 * to be a layout whose row count is not a function of text width.
 *
 * So below sm it is two deliberate rows: the sentence, then the link and the
 * dismiss together. Measured at 320px, the narrowest width worth supporting:
 * the sentence is 234px in Plus Jakarta Sans and 244px in the fallback against
 * 288px of room, and the second row is 166px. Neither can wrap in either face,
 * so the height is decided by the layout and the font cannot change it. From
 * sm the wrapper dissolves with display:contents and all three sit on one row,
 * where they have always fitted.
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

  /* The same page in English.
     usePathname reports the rewritten /da path on Danish pages, so strip that
     first — and then go through localePath rather than gluing "/en" on the
     front. The English tree has its own addresses now (/products, not
     /produkter), so concatenating produced a URL that 301s: the router
     prefetched it, followed the redirect and threw, which is exactly what the
     verify suite caught. localePath is the one place that knows the mapping. */
  const clean = pathname.replace(/^\/da(?=\/|$)/, "") || "/";
  const href = localePath(clean, "en");

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
      <Container className="flex flex-col items-start gap-y-1 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
        <p className="text-sm text-paper/75">This page is also available in English.</p>
        {/* One row of its own below sm; dissolved into the parent from sm, so
            the wide layout is exactly what it was. */}
        <div className="flex w-full items-center gap-x-4 sm:contents">
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
        </div>
      </Container>
    </div>
  );
}
