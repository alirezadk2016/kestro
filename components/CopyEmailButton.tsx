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
      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-transparent px-7 py-3.5 text-sm font-semibold text-slate-800 transition-colors duration-200 hover:bg-slate-900 hover:text-white"
    >
      {copied ? (
        "Kopieret!"
      ) : (
        <>
          <span className="underline underline-offset-2">{EMAIL}</span>
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
