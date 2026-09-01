"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

const copy = {
  da: {
    action: "Kopiér e-mailadressen",
    copied: "Kopieret!",
    announced: "E-mailadressen er kopieret",
  },
  en: {
    action: "Copy the email address",
    copied: "Copied",
    announced: "The email address is copied",
  },
} as const;

const EMAIL = "info@kestro.dk";

/*
 * The button reads as its own address on screen, which is what a visitor wants
 * to see. Read aloud, an address on its own is not an instruction — so the
 * action is carried in the name too, and the confirmation is a sentence in a
 * status region rather than a label that silently swaps to "Kopieret!". A bare
 * word swapped into a button is not announced at all.
 */
export default function CopyEmailButton({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — link below still works.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-paper"
      >
        {/* Said first, so the name is "Copy the email address info@kestro.dk"
            rather than an address with no verb in front of it. The visible
            label is still inside the name, which is what 2.5.3 asks for. */}
        <span className="sr-only">{`${c.action} `}</span>
        {copied ? (
          c.copied
        ) : (
          <>
            <span>{EMAIL}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              aria-hidden="true"
              focusable="false"
              className="h-3 w-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
              <path d="M1.5 8.5v-6a1 1 0 0 1 1-1h6" />
            </svg>
          </>
        )}
      </button>

      {/* Empty until it has something to say, so it is announced once when it
          fills rather than read out on load. */}
      <span role="status" aria-atomic="true" className="sr-only">
        {copied ? c.announced : ""}
      </span>
    </>
  );
}
