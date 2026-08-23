"use client";

import { useState } from "react";

const EMAIL = "info@kestro.dk";

export default function CopyEmailButton() {
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
    <button
      type="button"
      onClick={handleCopy}
      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
    >
      {copied ? (
        "Kopieret!"
      ) : (
        <>
          <span>{EMAIL}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
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
  );
}
