"use client";

import { useState } from "react";
import { BUTTON, INPUT } from "@/components/admin/tokens";

export default function CopyAssetLink({ url, filename }: { url: string; filename: string }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("manual");
    }
  }
  return (
    <div className="min-w-0">
      <button
        type="button"
        className={BUTTON}
        onClick={copy}
        aria-label={`Kopiér link til ${filename}`}
      >
        {state === "copied" ? "Link kopieret" : "Kopiér link"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? `Link til ${filename} er kopieret.`
          : state === "manual"
            ? "Automatisk kopiering er ikke tilgængelig. Markér og kopiér linket i feltet nedenfor."
            : ""}
      </span>
      {state === "manual" && (
        <label className="mt-3 block text-xs leading-5 text-paper/70">
          Markér og kopiér linket manuelt
          <input
            className={`${INPUT} mt-2 w-full`}
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
