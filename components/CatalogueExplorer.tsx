"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Columns3,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { CatalogueEntry } from "@/lib/catalogue-types";
import { localePath, type Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";
import CatalogueListingItem from "./CatalogueListingItem";

type Sort = "default" | "name-asc" | "name-desc" | "budget-asc" | "budget-desc";
type State = {
  query: string;
  brands: string[];
  types: string[];
  sort: Sort;
  view: "grid" | "list";
  compare: string[];
};
const INITIAL: State = {
  query: "",
  brands: [],
  types: [],
  sort: "default",
  view: "list",
  compare: [],
};
const control =
  "min-h-11 rounded-lg border border-white/20 bg-ink-950 px-3 text-sm text-paper outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-300/60 disabled:cursor-not-allowed";

function keepComparisonFocusVisible(event: React.FocusEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  requestAnimationFrame(() => {
    if (!link.isConnected) return;
    const region = link.closest('[role="region"]');
    if (!(region instanceof HTMLElement)) return;
    const sticky = region.querySelector("thead th");
    const bounds = region.getBoundingClientRect();
    const target = link.getBoundingClientRect();
    const left = bounds.left + (sticky?.getBoundingClientRect().width || 0) + 6;
    const right = bounds.right - 6;
    if (target.left < left || target.right > right) {
      region.scrollLeft += target.left - (left + Math.max(0, (right - left - target.width) / 2));
    }
  });
}

export default function CatalogueExplorer({
  entries,
  lang,
  mode = "models",
  heading,
}: {
  entries: CatalogueEntry[];
  lang: Lang;
  mode?: "models" | "budget";
  heading?: string;
}) {
  const da = lang === "da";
  const budget = mode === "budget";
  const defaultView = budget ? "grid" : "list";
  const prefix = useId();
  const [state, setState] = useState<State>({ ...INITIAL, view: defaultView });
  const [ready, setReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const comparisonHeading = useRef<HTMLHeadingElement>(null);
  const comparisonButton = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const legacyTarget = useRef<string | null>(null);
  const explorer = useRef<HTMLDivElement>(null);
  const returnPosition = useRef<number | null>(null);
  const restoreBrowsing = useRef(false);
  const pendingSelectionFocus = useRef<string | null>(null);
  const selectionButtons = useRef(new Map<string, HTMLButtonElement>());
  const brands = useMemo(() => [...new Set(entries.map((entry) => entry.brand))].sort(), [entries]);
  const categories = useMemo(
    () => [...new Map(entries.map((entry) => [entry.category.id, entry.category])).values()],
    [entries],
  );
  const hasFacets = brands.length > 1 || categories.length > 1;

  useEffect(() => {
    function readLocation() {
      const url = new URL(window.location.href);
      const list = (key: string, allowed: string[]) =>
        [...new Set((url.searchParams.get(key) || "").split(","))].filter((value) =>
          allowed.includes(value),
        );
      const types = list(
        "type",
        categories.map((category) => category.id),
      );
      const fragment = url.hash.slice(1);
      if (categories.some((category) => category.id === fragment)) {
        if (!types.length) types.push(fragment);
        legacyTarget.current = fragment;
      }
      const sorts: Sort[] = budget
        ? ["default", "name-asc", "name-desc", "budget-asc", "budget-desc"]
        : ["default", "name-asc", "name-desc"];
      const requestedSort = url.searchParams.get("sort") as Sort;
      setState({
        query: (url.searchParams.get("q") || "").slice(0, 120),
        brands: list("brand", brands),
        types,
        sort: sorts.includes(requestedSort) ? requestedSort : "default",
        view: !budget && url.searchParams.get("view") === "grid" ? "grid" : defaultView,
        compare:
          entries.length > 1
            ? list(
                "compare",
                entries.map((entry) => entry.id),
              ).slice(0, 3)
            : [],
      });
    }
    readLocation();
    setReady(true);
    window.addEventListener("popstate", readLocation);
    window.addEventListener("hashchange", readLocation);
    return () => {
      window.removeEventListener("popstate", readLocation);
      window.removeEventListener("hashchange", readLocation);
    };
  }, [entries, categories, brands, budget, defaultView]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    const values = {
      q: state.query || "",
      brand: state.brands.join(","),
      type: state.types.join(","),
      sort: state.sort === "default" ? "" : state.sort,
      view: budget || state.view === defaultView ? "" : state.view,
      compare: state.compare.join(","),
    };
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    const anchoredCategory = categories.find((category) => `#${category.id}` === url.hash);
    if (anchoredCategory && !state.types.includes(anchoredCategory.id)) url.hash = "";
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [state, ready, categories, budget, defaultView]);

  // A fragment can initially scroll far down the unfiltered HTML. Keep its
  // real model in view after React commits the shorter filtered result.
  useEffect(() => {
    if (!ready || !legacyTarget.current) return;
    const target = legacyTarget.current;
    legacyTarget.current = null;
    const frame = requestAnimationFrame(() => {
      (document.getElementById(target) || explorer.current)?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [ready, state]);

  const comparisonVisible = comparisonOpen && state.compare.length >= 2;
  useEffect(() => {
    if (comparisonVisible) {
      comparisonHeading.current?.focus({ preventScroll: true });
      comparisonHeading.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [comparisonVisible]);
  useEffect(() => {
    if (state.compare.length < 2) setComparisonOpen(false);
  }, [state.compare.length]);
  useEffect(() => {
    if (comparisonVisible || !restoreBrowsing.current) return;
    restoreBrowsing.current = false;
    comparisonButton.current?.focus({ preventScroll: true });
    window.scrollTo({ top: returnPosition.current ?? 0, behavior: "instant" });
  }, [comparisonVisible]);
  useEffect(() => {
    const target = pendingSelectionFocus.current;
    if (!target) return;
    pendingSelectionFocus.current = null;
    if (target === "search") search.current?.focus();
    else selectionButtons.current.get(target)?.focus({ preventScroll: true });
  }, [state.compare, comparisonVisible]);

  const query = state.query.trim().toLocaleLowerCase(lang);
  const tokens = query.split(/\s+/).filter(Boolean);
  const textMatches = (entry: CatalogueEntry) => {
    const text =
      `${entry.name} ${entry.brand} ${entry.format} ${entry.configuration || ""} ${entry.facts.map((fact) => fact.value).join(" ")}`.toLocaleLowerCase(
        lang,
      );
    return tokens.every((token) => text.includes(token));
  };
  const brandMatches = (entry: CatalogueEntry) =>
    !state.brands.length || state.brands.includes(entry.brand);
  const typeMatches = (entry: CatalogueEntry) =>
    !state.types.length || state.types.includes(entry.category.id);
  const filtered = entries.filter(
    (entry) => textMatches(entry) && brandMatches(entry) && typeMatches(entry),
  );
  const collator = new Intl.Collator(da ? "da-DK" : "en-GB", {
    numeric: true,
    sensitivity: "base",
  });
  if (state.sort.startsWith("name"))
    filtered.sort(
      (a, b) => collator.compare(a.name, b.name) * (state.sort === "name-desc" ? -1 : 1),
    );
  if (state.sort.startsWith("budget"))
    filtered.sort(
      (a, b) =>
        ((a.budget?.amount || 0) - (b.budget?.amount || 0)) *
        (state.sort === "budget-desc" ? -1 : 1),
    );
  const selected = state.compare
    .map((id) => entries.find((entry) => entry.id === id))
    .filter((entry): entry is CatalogueEntry => Boolean(entry));
  const selectedFacts = [
    ...new Set(
      selected.flatMap((entry) => (entry.comparisonFacts || entry.facts).map((fact) => fact.label)),
    ),
  ];
  const active = state.brands.length + state.types.length + (query ? 1 : 0);
  const canReset = active > 0 || state.sort !== "default";
  const isList = state.view === "list";
  const toggle = (key: "brands" | "types" | "compare", value: string) =>
    setState((previous) => ({
      ...previous,
      [key]: previous[key].includes(value)
        ? previous[key].filter((item) => item !== value)
        : key === "compare" && previous.compare.length >= 3
          ? previous.compare
          : [...previous[key], value],
    }));
  const clear = () =>
    setState((previous) => ({ ...previous, query: "", brands: [], types: [], sort: "default" }));
  const removeSelection = (id: string) => {
    const index = state.compare.indexOf(id);
    const remaining = state.compare.filter((value) => value !== id);
    pendingSelectionFocus.current = remaining[Math.min(index, remaining.length - 1)] || "search";
    toggle("compare", id);
  };

  const filterPanel = (
    <div className={budget ? "grid gap-x-8 gap-y-4 sm:grid-cols-2" : ""}>
      <fieldset className="min-w-0">
        <legend className="text-sm font-semibold text-paper">{da ? "Mærke" : "Brand"}</legend>
        {brands.map((brand) => (
          <label
            key={brand}
            className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-paper/85"
          >
            <input
              data-catalogue-brand={brand}
              type="checkbox"
              checked={state.brands.includes(brand)}
              disabled={!ready}
              onChange={() => toggle("brands", brand)}
              className="h-4 w-4 shrink-0 accent-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
            />
            <span className="flex-1">{brand}</span>
            <span className="text-xs tabular-nums text-paper/65">
              {
                entries.filter(
                  (entry) => entry.brand === brand && textMatches(entry) && typeMatches(entry),
                ).length
              }
            </span>
          </label>
        ))}
      </fieldset>
      {categories.length > 1 && (
        <fieldset className={budget ? "min-w-0" : "mt-4 border-t border-white/10 pt-5"}>
          <legend className="float-left mb-2 w-full text-sm font-semibold text-paper">
            {da ? "Type" : "Type"}
          </legend>
          <div className="clear-both">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex min-h-11 cursor-pointer items-center gap-3 py-1 text-sm leading-5 text-paper/85"
              >
                <input
                  data-catalogue-category={category.id}
                  type="checkbox"
                  checked={state.types.includes(category.id)}
                  disabled={!ready}
                  onChange={() => toggle("types", category.id)}
                  className="h-4 w-4 shrink-0 accent-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                />
                <span className="flex-1">{category.label}</span>
                <span className="text-xs tabular-nums text-paper/65">
                  {
                    entries.filter(
                      (entry) =>
                        entry.category.id === category.id &&
                        textMatches(entry) &&
                        brandMatches(entry),
                    ).length
                  }
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
  const filterButton = (
    <button
      type="button"
      data-catalogue-filter-toggle
      disabled={!ready}
      aria-expanded={filtersOpen}
      aria-controls={prefix + "-filters"}
      onClick={() => setFiltersOpen((open) => !open)}
      className={
        buttonClass("secondary") + " justify-between " + (budget ? "" : "w-full lg:hidden")
      }
    >
      <span className="inline-flex items-center gap-2">
        <SlidersHorizontal size={18} aria-hidden="true" />
        {da ? "Filtre" : "Filters"}
        {active > 0 && " (" + active + ")"}
      </span>
      <ChevronDown size={18} aria-hidden="true" className={filtersOpen ? "rotate-180" : ""} />
    </button>
  );
  const selectionControls = (
    <>
      <div className="min-w-0 max-w-full">
        <p
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm font-semibold text-paper"
        >
          <Columns3 size={18} aria-hidden="true" />
          {selected.length} / 3 {da ? "valgt til sammenligning" : "selected to compare"}
        </p>
        <div className="mt-1 flex max-w-full gap-x-4 overflow-x-auto">
          {selected.map((entry) => (
            <button
              key={entry.id}
              ref={(node) => {
                if (node) selectionButtons.current.set(entry.id, node);
                else selectionButtons.current.delete(entry.id);
              }}
              data-catalogue-remove={entry.id}
              type="button"
              onClick={() => removeSelection(entry.id)}
              aria-label={(da ? "Fjern: " : "Remove: ") + entry.name}
              className="inline-flex min-h-11 max-w-56 shrink-0 items-center gap-2 rounded-sm text-xs text-paper/85 hover:text-paper focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300"
            >
              <span className="truncate">{entry.name}</span>
              <X size={14} className="shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        data-catalogue-compare-clear
        onClick={() => {
          setComparisonOpen(false);
          setState((previous) => ({ ...previous, compare: [] }));
          pendingSelectionFocus.current = "search";
        }}
        className="inline-flex min-h-11 items-center text-sm text-paper/75 underline underline-offset-4 hover:text-paper focus-visible:outline-2 focus-visible:outline-brand-300"
      >
        {da ? "Ryd udvalg" : "Clear selection"}
      </button>
    </>
  );

  return (
    <div ref={explorer} data-catalogue={mode} className="mt-7 min-w-0 scroll-mt-28">
      {heading && <h2 className="sr-only">{heading}</h2>}
      <noscript>
        <p className="mb-4 text-sm leading-6 text-paper/85">
          {da
            ? "Alle modeller og links vises her. Søgning, filtre og sammenligning kræver JavaScript."
            : "All models and links are shown here. Search, filters and comparison require JavaScript."}
        </p>
      </noscript>
      <div
        className={`grid min-w-0 gap-6 ${hasFacets && !budget ? "lg:grid-cols-[184px_minmax(0,1fr)] xl:gap-7 2xl:grid-cols-[200px_minmax(0,1fr)]" : ""}`}
      >
        {hasFacets && !budget && (
          <div className="min-w-0">
            {filterButton}
            <aside
              id={prefix + "-filters"}
              aria-label={da ? "Filtre" : "Filters"}
              className={
                (filtersOpen ? "block" : "hidden") +
                " plate mt-3 p-4 lg:sticky lg:top-24 lg:mt-0 lg:block lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto"
              }
            >
              {filterPanel}
            </aside>
          </div>
        )}

        <div className="min-w-0">
          <div className="border-b border-white/15 pb-4">
            <label htmlFor={`${prefix}-search`} className="sr-only">
              {da ? "Søg efter model eller mærke" : "Search by model or brand"}
            </label>
            <div className="relative">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-3.5 text-paper/65"
              />
              <input
                ref={search}
                id={`${prefix}-search`}
                data-catalogue-search
                disabled={!ready}
                type="search"
                value={state.query}
                maxLength={120}
                autoComplete="off"
                onChange={(event) =>
                  setState((previous) => ({ ...previous, query: event.target.value }))
                }
                placeholder={da ? "Søg efter model eller mærke" : "Search by model or brand"}
                className={`${control} w-full pl-10`}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p
                data-catalogue-count
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="text-sm font-semibold tabular-nums text-paper/85"
              >
                {filtered.length} {da ? "af" : "of"} {entries.length}{" "}
                {budget
                  ? da
                    ? "budgetreferencer"
                    : "budget references"
                  : da
                    ? "modeller"
                    : "models"}
              </p>
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                {budget && hasFacets && filterButton}
                {canReset && (
                  <button
                    type="button"
                    disabled={!ready}
                    data-catalogue-clear
                    onClick={clear}
                    className="inline-flex min-h-11 items-center rounded-sm text-sm text-brand-300 underline underline-offset-4 hover:text-paper focus-visible:outline-2 focus-visible:outline-brand-300"
                  >
                    {da ? "Nulstil filtre" : "Reset filters"}
                  </button>
                )}
                <label className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-paper/75">
                  <span>{da ? "Sortér" : "Sort"}</span>
                  <select
                    data-catalogue-sort
                    disabled={!ready}
                    value={state.sort}
                    onChange={(event) =>
                      setState((previous) => ({ ...previous, sort: event.target.value as Sort }))
                    }
                    className={`${control} max-w-full text-xs`}
                  >
                    <option value="default">
                      {da ? "Katalogets rækkefølge" : "Catalogue order"}
                    </option>
                    <option value="name-asc">{da ? "Modelnavn A–Å" : "Model name A–Z"}</option>
                    <option value="name-desc">{da ? "Modelnavn Å–A" : "Model name Z–A"}</option>
                    {budget && (
                      <>
                        <option value="budget-asc">
                          {da ? "Historisk budget: lav–høj" : "Historical budget: low–high"}
                        </option>
                        <option value="budget-desc">
                          {da ? "Historisk budget: høj–lav" : "Historical budget: high–low"}
                        </option>
                      </>
                    )}
                  </select>
                </label>
                {!budget && (
                  <div
                    className="hidden rounded-lg border border-white/20 p-0.5 sm:inline-flex"
                    role="group"
                    aria-label={da ? "Visning" : "View"}
                  >
                    {(["grid", "list"] as const).map((view) => {
                      const Icon = view === "grid" ? LayoutGrid : List;
                      return (
                        <button
                          key={view}
                          data-catalogue-view={view}
                          type="button"
                          disabled={!ready}
                          aria-pressed={state.view === view}
                          aria-label={
                            view === "grid"
                              ? da
                                ? "Vis som gitter"
                                : "Grid view"
                              : da
                                ? "Vis som liste"
                                : "List view"
                          }
                          onClick={() => setState((previous) => ({ ...previous, view }))}
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 ${state.view === view ? "bg-brand-600 text-paper" : "text-paper/75 hover:bg-white/10 hover:text-paper"}`}
                        >
                          <Icon size={18} aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          {budget && hasFacets && (
            <aside
              id={prefix + "-filters"}
              aria-label={da ? "Filtre" : "Filters"}
              className={`${filtersOpen ? "block" : "hidden"} plate mt-4 p-4 sm:p-5`}
            >
              {filterPanel}
            </aside>
          )}

          {active > 0 && (
            <div
              className="mt-3 flex flex-wrap gap-2"
              aria-label={da ? "Valgte filtre" : "Selected filters"}
            >
              {[
                ...(query ? [{ key: "query", value: state.query, label: state.query }] : []),
                ...state.brands.map((value) => ({ key: "brands", value, label: value })),
                ...state.types.map((value) => ({
                  key: "types",
                  value,
                  label: categories.find((category) => category.id === value)?.label || value,
                })),
              ].map((chip) => (
                <button
                  key={`${chip.key}-${chip.value}`}
                  type="button"
                  onClick={() =>
                    chip.key === "query"
                      ? setState((previous) => ({ ...previous, query: "" }))
                      : toggle(chip.key as "brands" | "types", chip.value)
                  }
                  aria-label={`${da ? "Fjern filter" : "Remove filter"}: ${chip.label}`}
                  className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-brand-300/40 bg-brand-600/10 px-3 text-sm text-paper"
                >
                  <span className="break-words">{chip.label}</span>
                  <X size={14} className="shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          <ul
            className={`mt-4 grid min-w-0 gap-4 ${isList ? "" : budget ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 2xl:grid-cols-3"}`}
          >
            {filtered.map((entry, index) => (
              <CatalogueListingItem
                key={entry.id}
                entry={entry}
                lang={lang}
                mode={mode}
                view={state.view}
                ready={ready}
                selected={state.compare.includes(entry.id)}
                selectionFull={state.compare.length >= 3}
                canCompare={entries.length > 1}
                priority={index === 0}
                onCompare={() => toggle("compare", entry.id)}
              />
            ))}
          </ul>
          {filtered.length === 0 && (
            <div className="plate mt-4 p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-paper">
                {da ? "Ingen modeller matcher dit valg" : "No models match your selection"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-paper/75">
                {da
                  ? "Prøv færre filtre, eller fortæl os, hvilken model du leder efter."
                  : "Try fewer filters, or tell us which model you are looking for."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={clear} className={buttonClass("primary")}>
                  {da ? "Vis alle" : "Show all"}
                </button>
                <Link href={localePath("/tilbud", lang)} className={buttonClass("secondary")}>
                  {da ? "Spørg om en model" : "Ask about a model"}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {comparisonVisible && (
        <section
          data-catalogue-comparison
          className="mt-10 scroll-mt-28 border-t border-white/10 pt-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                ref={comparisonHeading}
                tabIndex={-1}
                className="t-h2 font-display font-bold text-paper outline-none"
              >
                {da ? "Sammenlign dit udvalg" : "Compare your selection"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-paper/75">
                {budget
                  ? da
                    ? "Budgetterne er daterede referencer. Den præcise pris afklares ved forespørgsel."
                    : "Budgets are dated references. The exact price is confirmed on enquiry."
                  : da
                    ? "Specifikationerne beskriver modelserier. Bekræft altid generation og konfiguration."
                    : "Specifications describe model families. Always confirm the generation and configuration."}
              </p>
            </div>
            <button
              type="button"
              data-catalogue-compare-close
              onClick={() => {
                restoreBrowsing.current = true;
                setComparisonOpen(false);
              }}
              aria-label={da ? "Luk sammenligning" : "Close comparison"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-paper/85 hover:text-paper focus-visible:outline-2 focus-visible:outline-brand-300"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div
            data-catalogue-selection
            className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-3 border-y border-white/10 py-3"
          >
            {selectionControls}
          </div>
          <p className="mt-4 text-xs text-paper/75 sm:hidden">
            {da
              ? "Træk tabellen til siden for at se alle valgte modeller."
              : "Scroll the table sideways to see every selected model."}
          </p>
          <div
            className="mt-4 max-w-full overflow-x-auto rounded-xl border border-white/20 focus-visible:outline-2 focus-visible:outline-brand-300"
            role="region"
            tabIndex={0}
            aria-label={da ? "Sammenligningstabel" : "Comparison table"}
          >
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                {da ? "Sammenligning af de valgte modeller" : "Selected model comparison"}
              </caption>
              <thead>
                <tr className="bg-ink-950">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-24 min-w-24 max-w-24 break-words bg-ink-950 p-3 text-paper/75 sm:w-40 sm:min-w-40 sm:max-w-40 sm:p-4"
                  >
                    {da ? "Model" : "Model"}
                  </th>
                  {selected.map((entry) => (
                    <th
                      scope="col"
                      key={entry.id}
                      className="min-w-44 max-w-80 p-4 font-display text-base text-paper sm:min-w-60"
                    >
                      <Link
                        href={entry.detailHref}
                        onFocus={keepComparisonFocusVisible}
                        className="inline-flex min-h-11 max-w-full items-center rounded-sm underline decoration-brand-300/40 underline-offset-4 hover:text-brand-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                      >
                        {entry.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <th
                    scope="row"
                    className="sticky left-0 w-24 min-w-24 max-w-24 break-words bg-ink-900 p-3 font-medium text-paper/75 sm:w-40 sm:min-w-40 sm:max-w-40 sm:p-4"
                  >
                    {da ? "Format" : "Format"}
                  </th>
                  {selected.map((entry) => (
                    <td key={entry.id} className="p-4 leading-6 text-paper/85">
                      {entry.format}
                    </td>
                  ))}
                </tr>
                {selectedFacts.map((label) => (
                  <tr key={label} className="border-t border-white/10">
                    <th
                      scope="row"
                      className="sticky left-0 w-24 min-w-24 max-w-24 break-words bg-ink-900 p-3 font-medium text-paper/75 sm:w-40 sm:min-w-40 sm:max-w-40 sm:p-4"
                    >
                      {label}
                    </th>
                    {selected.map((entry) => (
                      <td key={entry.id} className="p-4 leading-6 text-paper/85">
                        {(entry.comparisonFacts || entry.facts).find((fact) => fact.label === label)
                          ?.value || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
                {budget && (
                  <tr className="border-t border-white/10">
                    <th
                      scope="row"
                      className="sticky left-0 w-24 min-w-24 max-w-24 break-words bg-ink-900 p-3 font-medium text-paper/75 sm:w-40 sm:min-w-40 sm:max-w-40 sm:p-4"
                    >
                      {da ? "Historisk budget" : "Historical budget"}
                    </th>
                    {selected.map((entry) => (
                      <td key={entry.id} className="p-4 font-bold tabular-nums text-paper">
                        {entry.budget?.formatted || "—"}
                      </td>
                    ))}
                  </tr>
                )}
                <tr className="border-t border-white/10">
                  <th
                    scope="row"
                    className="sticky left-0 w-24 min-w-24 max-w-24 break-words bg-ink-900 p-3 font-medium text-paper/75 sm:w-40 sm:min-w-40 sm:max-w-40 sm:p-4"
                  >
                    {da ? "Næste skridt" : "Next step"}
                  </th>
                  {selected.map((entry) => (
                    <td key={entry.id} className="p-4">
                      <Link
                        href={entry.enquiryHref}
                        onFocus={keepComparisonFocusVisible}
                        aria-label={`${da ? "Spørg om modellen" : "Ask about this model"}: ${entry.name}`}
                        className={`${buttonClass("primary")} max-w-36 px-3 text-center sm:max-w-none`}
                      >
                        {da ? "Spørg om modellen" : "Ask about this model"}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selected.length > 0 && !comparisonVisible && (
        <div
          data-catalogue-tray
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-ink-950 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-xl sm:inset-x-6 sm:bottom-4 sm:rounded-xl sm:border sm:px-5"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            {selectionControls}
            <button
              ref={comparisonButton}
              type="button"
              data-catalogue-compare-open
              disabled={selected.length < 2}
              onClick={() => {
                returnPosition.current = window.scrollY;
                setComparisonOpen(true);
              }}
              className={buttonClass("primary") + " px-4"}
            >
              {da ? "Sammenlign" : "Compare"} ({selected.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
