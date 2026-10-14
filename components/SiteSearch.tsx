"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * Search across every public page, in the visitor's language.
 *
 * 136 pages behind seven menu items, and nothing on the site let a buyer type
 * "T480" or "pris" and land on the page. The index is /search.json, built from
 * the same data the pages are, and fetched the first time the dialog opens —
 * a page load never pays for it.
 *
 * Matching is word-prefix on a folded string: lower case, æ ø å written as
 * ae oe aa (so "flaade" and "flåde" both work on a keyboard without them),
 * accents dropped. Every word typed has to match somewhere; a match in the
 * title outranks one in the keywords, which outranks one in the line under it.
 */

type Group = "page" | "product" | "model" | "repair" | "service" | "guide";
type Entry = { g: Group; t: string; d: string; h: string; k?: string };
type Prepared = Entry & { ft: string; fw: string[]; fk: string; fd: string; all: string[] };

const groupLabel: Record<Group, Record<Lang, string>> = {
  page: { da: "Sider", en: "Pages" },
  product: { da: "Produkter", en: "Products" },
  model: { da: "Modeller", en: "Models" },
  repair: { da: "Reparation", en: "Repairs" },
  service: { da: "Ydelser", en: "Services" },
  guide: { da: "Viden", en: "Knowledge" },
};

const copy = {
  da: {
    title: "Søg på kestro.dk",
    placeholder: "Model, ydelse eller spørgsmål",
    close: "Luk søgning",
    shortcuts: "Genveje",
    none: "Ingen sider matcher",
    noneHelp: "Prøv et andet ord – eller",
    write: "skriv til os",
    results: (n: number) => (n === 1 ? "1 resultat" : `${n} resultater`),
    failed: "Søgningen kunne ikke hentes. Prøv igen om lidt.",
  },
  en: {
    title: "Search kestro.dk",
    placeholder: "Model, service or question",
    close: "Close search",
    shortcuts: "Shortcuts",
    none: "No pages match",
    noneHelp: "Try another word — or",
    write: "write to us",
    results: (n: number) => (n === 1 ? "1 result" : `${n} results`),
    failed: "Search could not be loaded. Try again shortly.",
  },
};

/* The places most visits are looking for, shown before anything is typed. */
const SHORTCUTS = ["/produkter", "/priser", "/tilbud", "/flaadeloesninger", "/reparation", "/kontakt"];

const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");

let index: Promise<Record<Lang, Prepared[]>> | null = null;
const loadIndex = () =>
  (index ??= fetch("/search.json")
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json() as Promise<Record<Lang, Entry[]>>;
    })
    .then((raw) => {
      const prep = (e: Entry): Prepared => {
        const ft = fold(e.t);
        const fw = ft.split(/[^a-z0-9]+/).filter(Boolean);
        const fk = fold(e.k ?? "");
        const fd = fold(e.d);
        const all = [...fw, ...`${fk} ${fd}`.split(/[^a-z0-9]+/).filter(Boolean)];
        return { ...e, ft, fw, fk, fd, all };
      };
      return { da: raw.da.map(prep), en: raw.en.map(prep) };
    })
    .catch((error) => {
      index = null;
      throw error;
    }));

/* At most one letter wrong, missing, extra or swapped with its neighbour. */
function oneEdit(x: string, y: string) {
  if (x === y) return true;
  if (Math.abs(x.length - y.length) > 1) return false;
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  return (
    x.slice(i + 1) === y.slice(i + 1) || // one letter wrong
    x.slice(i) === y.slice(i + 1) || // one letter missing
    x.slice(i + 1) === y.slice(i) || // one letter extra
    (x[i] === y[i + 1] && x[i + 1] === y[i] && x.slice(i + 2) === y.slice(i + 2)) // two swapped
  );
}

/* A typed word is a near-prefix of a word in the index: "thinkapd" finds
   ThinkPad, "kontkat" Kontakt, "optiplx" OptiPlex. */
const nearly = (word: string, token: string) =>
  [token.length - 1, token.length, token.length + 1].some((n) => n > 0 && oneEdit(word.slice(0, n), token));

function rank(entries: Prepared[], query: string): Prepared[] {
  const strict = rankWith(entries, query, false);
  /* Only when nothing matches exactly: a typo should find the page, but it
     should not crowd out a real match. */
  return strict.length ? strict : rankWith(entries, query, true);
}

function rankWith(entries: Prepared[], query: string, fuzzy: boolean): Prepared[] {
  const tokens = fold(query).split(/[^a-z0-9]+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored: [number, Prepared][] = [];
  for (const e of entries) {
    let score = 0;
    for (const token of tokens) {
      const s = fuzzy
        ? token.length >= 4 && e.all.some((w) => nearly(w, token))
          ? 2
          : 0
        : e.ft.startsWith(token)
        ? 8
        : e.fw.some((w) => w.startsWith(token))
          ? 6
          : e.ft.includes(token)
            ? 4
            : e.fk.includes(token)
              ? 3
              : e.fd.includes(token)
                ? 1
                : 0;
      if (!s) {
        score = 0;
        break;
      }
      score += s;
    }
    if (score) scored.push([score, e]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, 12).map(([, e]) => e);
}

export default function SiteSearch({
  lang,
  open,
  onClose,
}: {
  lang: Lang;
  open: boolean;
  onClose: () => void;
}) {
  const c = copy[lang];
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const inputId = useId();
  const [entries, setEntries] = useState<Prepared[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const previous = document.body.style.overflow;
    if (!element.open) element.showModal();
    document.body.style.overflow = "hidden";
    input.current?.focus();
    loadIndex()
      .then((all) => {
        setEntries(all[lang]);
        setFailed(false);
      })
      .catch(() => setFailed(true));
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previous;
    };
  }, [open, lang]);

  const results = useMemo(() => (entries ? rank(entries, query) : []), [entries, query]);
  const shortcuts = useMemo(
    () =>
      entries
        ? SHORTCUTS.map((href) => entries.find((e) => e.h === localePath(href, lang))).filter(
            (e): e is Prepared => !!e,
          )
        : [],
    [entries, lang],
  );

  const typed = query.trim().length > 0;
  const shown = typed ? results : shortcuts;

  /* Results grouped by kind, in the order their best match appears. */
  const groups = useMemo(() => {
    const order: Group[] = [];
    const by = new Map<Group, Prepared[]>();
    for (const e of shown) {
      if (!by.has(e.g)) {
        by.set(e.g, []);
        order.push(e.g);
      }
      by.get(e.g)!.push(e);
    }
    return order.map((g) => ({ g, items: by.get(g)! }));
  }, [shown]);

  const links = () => Array.from(list.current?.querySelectorAll<HTMLAnchorElement>("a[data-result]") ?? []);
  const move = (from: HTMLElement, step: 1 | -1) => {
    const all = links();
    const i = all.indexOf(from as HTMLAnchorElement);
    const next = all[i + step];
    if (next) next.focus();
    else if (step === -1) input.current?.focus();
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onClose={() => {
        setQuery("");
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="mx-auto mb-auto mt-3 max-h-[calc(100svh-1.5rem)] w-[min(94vw,640px)] max-w-none overflow-hidden rounded-2xl border border-white/15 bg-brand-950 p-0 text-paper shadow-2xl shadow-black/60 backdrop:bg-black/70 sm:mt-[10vh] sm:max-h-[80vh]"
    >
      {open && (
        <div className="flex max-h-[inherit] flex-col">
          <h2 id={titleId} className="sr-only">
            {c.title}
          </h2>
          {/* The focus ring is the field's underline turning blue, not a box
              drawn through the middle of the panel. */}
          <div className="flex items-center gap-2 border-b-2 border-white/10 px-3 transition-colors focus-within:border-brand-500 sm:px-4">
            <Search aria-hidden="true" className="h-5 w-5 flex-none text-paper/65" strokeWidth={1.9} />
            <label htmlFor={inputId} className="sr-only">
              {c.title}
            </label>
            <input
              ref={input}
              id={inputId}
              type="search"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="go"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  links()[0]?.focus();
                }
                if (event.key === "Enter") {
                  const first = links()[0];
                  if (first) {
                    event.preventDefault();
                    first.click();
                  }
                }
              }}
              placeholder={c.placeholder}
              className="min-h-[56px] min-w-0 flex-1 bg-transparent text-base text-paper outline-none placeholder:text-paper/65 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label={c.close}
              className="-mr-1 inline-flex h-11 w-11 flex-none items-center justify-center rounded-lg text-paper/75 transition hover:bg-white/10 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400"
            >
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
            </button>
          </div>

          <div ref={list} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-3">
            <p role="status" className="sr-only">
              {typed && entries ? c.results(results.length) : ""}
            </p>

            {failed && <p className="px-3 py-6 text-sm text-paper/75">{c.failed}</p>}

            {!typed && shortcuts.length > 0 && (
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-paper/65">
                {c.shortcuts}
              </p>
            )}

            {typed && entries && results.length === 0 && (
              <p className="px-3 py-6 text-sm leading-6 text-paper/75">
                {c.none} »{query.trim()}«. {c.noneHelp}{" "}
                <Link
                  href={localePath("/kontakt", lang)}
                  onClick={() => dialog.current?.close()}
                  className="font-semibold text-brand-300 underline underline-offset-4 hover:text-paper"
                >
                  {c.write}
                </Link>
                .
              </p>
            )}

            {groups.map(({ g, items }) => (
              <div key={g} className="pb-1">
                {typed && (
                  <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-paper/65">
                    {groupLabel[g][lang]}
                  </p>
                )}
                <ul>
                  {items.map((e) => (
                    <li key={e.h}>
                      <Link
                        href={e.h}
                        data-result
                        onClick={() => dialog.current?.close()}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            move(event.currentTarget, 1);
                          }
                          if (event.key === "ArrowUp") {
                            event.preventDefault();
                            move(event.currentTarget, -1);
                          }
                        }}
                        className="block min-h-[44px] rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400"
                      >
                        <span className="block text-[0.9375rem] font-semibold leading-6 text-paper">{e.t}</span>
                        <span className="block text-sm leading-5 text-paper/75">{e.d}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
