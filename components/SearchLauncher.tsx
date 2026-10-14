"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Search } from "lucide-react";
import type { Lang } from "@/lib/i18n";

const SiteSearch = dynamic(() => import("./SiteSearch"), { ssr: false });

/*
 * A search field that opens the site search, for places outside the header:
 * the 404, where "the page you wanted is not here" is the moment a search box
 * is most useful.
 */
export default function SearchLauncher({ lang, label }: { lang: Lang; label: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        className="flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-ink-300 bg-ink-50 px-4 text-left text-base text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
      >
        <Search aria-hidden="true" className="h-5 w-5 flex-none" strokeWidth={1.9} />
        {label}
      </button>
      {loaded && <SiteSearch lang={lang} open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
