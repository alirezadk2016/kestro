"use client";

import { clearConsent } from "@/lib/consent";
import type { Lang } from "@/lib/i18n";

/*
 * Withdrawing consent has to be as easy as giving it, so the footer carries
 * this: one click, the banner comes back, and the answer can be changed.
 */
const label = { da: "Cookies og statistik", en: "Cookies and statistics" };

export default function ConsentReset({ lang }: { lang: Lang }) {
  return (
    <button
      type="button"
      onClick={clearConsent}
      className="inline-flex min-h-[44px] items-center text-left text-sm text-paper/60 transition hover:text-paper"
    >
      {label[lang]}
    </button>
  );
}
