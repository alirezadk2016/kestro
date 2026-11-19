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
  series: string[];
  types: string[];
  sort: Sort;
  view: "grid" | "list";
  compare: string[];
};
const INITIAL: State = {
  query: "",
  brands: [],
  series: [],
  types: [],
  sort: "default",
  view: "list",
  compare: [],
};
const control =
  "min-h-11 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm text-paper outline-none transition-colors hover:border-white/25 focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-300/60 disabled:cursor-not-allowed";

/*
 * Facets, 2026-11-19. Three rows of chips over the list, and a fourth row of
 * tags repeating the chips that were on, read as clutter: seventeen choices
 * before the first model. On a desktop each facet is now one button in the
 * command bar that opens its chips; on a phone the chips sit in the Filtre
 * panel. Each chip is still a native checkbox (its transparent surface) and
 * turns blue when it is on.
 */
const pill =
  "group relative inline-flex min-h-11 cursor-pointer select-none items-center gap-1.5 rounded-full bg-white/[0.04] px-3.5 text-sm text-paper/85 ring-1 ring-inset ring-white/10 transition-colors duration-150 hover:bg-white/[0.08] hover:text-paper has-[:checked]:bg-brand-600 has-[:checked]:text-white has-[:checked]:ring-brand-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-300 has-[:disabled]:cursor-not-allowed";
/* The native checkbox is the chip's whole surface, transparent: it is what
   a pointer hits and what a keyboard focuses, and the chip shows its state. */
const dot =
  "absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none disabled:cursor-not-allowed";
const tally = "text-xs tabular-nums text-paper/65 group-has-[:checked]:text-white/80";
type FacetKey = "brands" | "series" | "types";

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
  /* The desktop facet whose chips are open under its button, if any. */
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null);
  const facetBar = useRef<HTMLDivElement>(null);
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
  /* Product lines, grouped by brand so ThinkPad T sits beside ThinkPad X1. */
  const allSeries = useMemo(() => {
    const lines = new Map<string, { id: string; label: string; brand: string }>();
    for (const entry of entries)
      if (entry.series) lines.set(entry.series.id, { ...entry.series, brand: entry.brand });
    const order = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
    return [...lines.values()].sort(
      (a, b) => order.compare(a.brand, b.brand) || order.compare(a.label, b.label),
    );
  }, [entries]);

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
        series: list(
          "series",
          allSeries.map((line) => line.id),
        ),
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
  }, [entries, categories, brands, allSeries, budget, defaultView]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    const values = {
      q: state.query || "",
      brand: state.brands.join(","),
      series: state.series.join(","),
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

  /* An open facet closes on a click anywhere else and on Escape, which
     returns focus to its button. Choosing chips keeps it open: a facet is a
     multiple choice. */
  useEffect(() => {
    if (!openFacet) return;
    const group = () => facetBar.current?.querySelector(`[data-catalogue-facet="${openFacet}"]`);
    const away = (event: PointerEvent) => {
      if (!group()?.contains(event.target as Node)) setOpenFacet(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const opener = group()?.querySelector<HTMLButtonElement>("[data-catalogue-facet-toggle]");
      setOpenFacet(null);
      opener?.focus();
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", escape);
    };
  }, [openFacet]);

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

  /* A generation is one term. "T14 Gen 4" matched all seven T14 and T14s
     generations, because "4" alone is in 14" and in PCIe 4.0; "X1 Carbon Gen
     1" matched Gen 10 to 12; and "gen4" or "G4", as shops write it, matched
     nothing. Query and text both spell a generation "gen N", and that token
     must end where the number ends. */
  const generations = (text: string) =>
    text
      .toLocaleLowerCase(lang)
      .replace(/\bgen(?:eration)?\.?\s*(\d+)\b/g, "gen $1")
      .replace(/\bg(\d+)\b/g, "gen $1");
  /* One normalised text per entry, not one per facet count per keystroke. */
  const haystacks = useMemo(
    () =>
      new Map(
        entries.map((entry) => [
          entry.id,
          generations(
            `${entry.name} ${entry.brand} ${entry.format} ${entry.configuration || ""} ${entry.facts.map((fact) => fact.value).join(" ")}`,
          ),
        ]),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entries, lang],
  );
  const query = state.query.trim().toLocaleLowerCase(lang);
  const tokens = generations(query).match(/gen \d+|\S+/g) ?? [];
  const textMatches = (entry: CatalogueEntry) => {
    const text = haystacks.get(entry.id) ?? "";
    return tokens.every((token) =>
      /^gen \d+$/.test(token) ? new RegExp(`\\b${token}\\b`).test(text) : text.includes(token),
    );
  };
  const brandMatches = (entry: CatalogueEntry) =>
    !state.brands.length || state.brands.includes(entry.brand);
  const typeMatches = (entry: CatalogueEntry) =>
    !state.types.length || state.types.includes(entry.category.id);
  /* The lines on offer follow the chosen type: all of /modeller has too many
     to scan, its laptops alone have ten. A line that drops out of view stops
     filtering, so a hidden checkbox can never empty the results, but it stays
     chosen and returns with its type. */
  const seriesOptions = allSeries.filter((line) =>
    entries.some((entry) => entry.series?.id === line.id && typeMatches(entry)),
  );
  const showSeries = !budget && seriesOptions.length >= 2 && seriesOptions.length <= 12;
  const activeSeries = showSeries
    ? state.series.filter((id) => seriesOptions.some((line) => line.id === id))
    : [];
  const seriesMatches = (entry: CatalogueEntry) =>
    !activeSeries.length || (!!entry.series && activeSeries.includes(entry.series.id));
  const filtered = entries.filter(
    (entry) =>
      textMatches(entry) && brandMatches(entry) && seriesMatches(entry) && typeMatches(entry),
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
  const active = state.brands.length + activeSeries.length + state.types.length + (query ? 1 : 0);
  const canReset = active > 0 || state.sort !== "default";
  const isList = state.view === "list";
  const ledger = isList && !budget;
  const heads = filtered[0]?.facts.slice(0, 3).map((fact) => fact.label) ?? [];
  const sharedHeads =
    ledger &&
    heads.length > 0 &&
    filtered.every(
      (entry) =>
        entry.facts
          .slice(0, 3)
          .map((fact) => fact.label)
          .join("|") === heads.join("|"),
    );
  const toggle = (key: "brands" | "series" | "types" | "compare", value: string) =>
    setState((previous) => ({
      ...previous,
      [key]: previous[key].includes(value)
        ? previous[key].filter((item) => item !== value)
        : key === "compare" && previous.compare.length >= 3
          ? previous.compare
          : [...previous[key], value],
    }));
  const clear = () =>
    setState((previous) => ({
      ...previous,
      query: "",
      brands: [],
      series: [],
      types: [],
      sort: "default",
    }));
  const removeSelection = (id: string) => {
    const index = state.compare.indexOf(id);
    const remaining = state.compare.filter((value) => value !== id);
    pendingSelectionFocus.current = remaining[Math.min(index, remaining.length - 1)] || "search";
    toggle("compare", id);
  };

  const facet = (
    key: FacetKey,
    label: string,
    attribute: "data-catalogue-brand" | "data-catalogue-series" | "data-catalogue-category",
    options: { id: string; label: string; count: number; checked: boolean }[],
    first: boolean,
  ) => {
    const open = openFacet === key;
    const chosen = options.filter((option) => option.checked).length;
    const panelId = `${prefix}-${key}`;
    return (
      <fieldset
        key={key}
        data-catalogue-facet={key}
        onBlur={(event) => {
          const next = event.relatedTarget as Node | null;
          if (open && next && !event.currentTarget.contains(next)) setOpenFacet(null);
        }}
        className={budget ? "min-w-0" : `min-w-0 ${first ? "" : "mt-5"} lg:relative lg:mt-0`}
      >
        <legend className="sr-only">{label}</legend>
        {!budget && (
          <button
            type="button"
            data-catalogue-facet-toggle={key}
            disabled={!ready}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpenFacet(open ? null : key)}
            className={`hidden min-h-11 items-center gap-2 rounded-full px-4 text-sm ring-1 ring-inset transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed lg:inline-flex ${
              chosen || open
                ? "bg-white/[0.08] text-paper ring-white/25"
                : "bg-white/[0.04] text-paper/85 ring-white/10 hover:bg-white/[0.08] hover:text-paper"
            }`}
          >
            {label}
            {chosen > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold tabular-nums text-white">
                {chosen}
                <span className="sr-only">{da ? " valgt" : " selected"}</span>
              </span>
            )}
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`text-paper/65 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
        <span
          aria-hidden="true"
          className={`mb-2.5 block text-xs font-medium text-paper/65 ${budget ? "" : "lg:hidden"}`}
        >
          {label}
        </span>
        <div
          id={panelId}
          className={`flex flex-wrap gap-2 ${
            budget
              ? ""
              : `${open ? "lg:flex" : "lg:hidden"} lg:absolute lg:left-0 lg:top-full lg:z-40 lg:mt-2 lg:w-max lg:max-w-[30rem] lg:rounded-2xl lg:bg-ink-900 lg:p-3 lg:shadow-[0_24px_48px_-12px_rgb(0_0_0/0.6)] lg:ring-1 lg:ring-white/10`
          }`}
        >
          {options.map((option) => (
            <label key={option.id} className={pill}>
              <input
                {...{ [attribute]: option.id }}
                type="checkbox"
                checked={option.checked}
                disabled={!ready}
                onChange={() => toggle(key, option.id)}
                className={dot}
              />
              <span className="whitespace-nowrap">{option.label}</span>
              <span className={tally}>{option.count}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  };
  const filterPanel = (
    <div
      className={
        budget ? "grid gap-x-8 gap-y-4 sm:grid-cols-2" : "lg:flex lg:items-center lg:gap-2"
      }
    >
      {facet(
        "brands",
        da ? "Mærke" : "Brand",
        "data-catalogue-brand",
        brands.map((brand) => ({
          id: brand,
          label: brand,
          checked: state.brands.includes(brand),
          count: entries.filter(
            (entry) =>
              entry.brand === brand &&
              textMatches(entry) &&
              seriesMatches(entry) &&
              typeMatches(entry),
          ).length,
        })),
        true,
      )}
      {showSeries &&
        facet(
          "series",
          da ? "Serie" : "Series",
          "data-catalogue-series",
          seriesOptions.map((line) => ({
            id: line.id,
            label: line.label,
            checked: activeSeries.includes(line.id),
            count: entries.filter(
              (entry) =>
                entry.series?.id === line.id &&
                textMatches(entry) &&
                brandMatches(entry) &&
                typeMatches(entry),
            ).length,
          })),
          false,
        )}
      {categories.length > 1 &&
        facet(
          "types",
          "Type",
          "data-catalogue-category",
          categories.map((category) => ({
            id: category.id,
            label: category.label,
            checked: state.types.includes(category.id),
            count: entries.filter(
              (entry) =>
                entry.category.id === category.id &&
                textMatches(entry) &&
                brandMatches(entry) &&
                seriesMatches(entry),
            ).length,
          })),
          false,
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
        buttonClass("secondary") + " shrink-0 justify-between !px-3 " + (budget ? "" : "lg:hidden")
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
    <div ref={explorer} data-catalogue={mode} className="mt-5 min-w-0 scroll-mt-28">
      {heading && <h2 className="sr-only">{heading}</h2>}
      <noscript>
        <p className="mb-4 text-sm leading-6 text-paper/85">
          {da
            ? "Alle modeller og links vises her. Søgning, filtre og sammenligning kræver JavaScript."
            : "All models and links are shown here. Search, filters and comparison require JavaScript."}
        </p>
      </noscript>
      {/* One command bar over the catalogue: search, count, sort and view.
          From lg it stays under the site header while the list scrolls,
          on frosted glass, so the controls are where the eye is after the
          tenth row too. */}
      <div className="lg:sticky lg:top-20 lg:z-30 lg:-mx-3 lg:rounded-b-2xl lg:bg-ink-900/80 lg:px-3 lg:py-3 lg:backdrop-blur-xl">
        <label htmlFor={`${prefix}-search`} className="sr-only">
          {da ? "Søg efter model eller mærke" : "Search by model or brand"}
        </label>
        <div ref={facetBar} className="flex flex-wrap items-center gap-x-4 gap-y-3 lg:gap-x-3">
          <div className="flex min-w-0 basis-full items-center gap-2 lg:w-56 lg:flex-none lg:basis-auto xl:w-80">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-3.5 text-paper/65"
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
                placeholder={da ? "Model eller mærke" : "Model or brand"}
                className={`${control} w-full pl-11`}
              />
            </div>
            {hasFacets && filterButton}
          </div>
          {hasFacets && !budget && (
            <aside
              id={prefix + "-filters"}
              aria-label={da ? "Filtre" : "Filters"}
              className={
                (filtersOpen ? "block" : "hidden") +
                /* A panel on a phone, under the count and sort; on a desktop
                   the facet buttons beside the search, each opening its chips. */
                " plate order-last basis-full p-4 [color-scheme:dark] lg:order-none lg:block lg:basis-auto lg:rounded-none lg:bg-none lg:p-0 lg:shadow-none"
              }
            >
              {filterPanel}
            </aside>
          )}
          <p
            data-catalogue-count
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm font-semibold tabular-nums text-paper/85"
          >
            {filtered.length} {da ? "af" : "of"} {entries.length}{" "}
            {budget ? (da ? "budgetreferencer" : "budget references") : da ? "modeller" : "models"}
          </p>
          {/* Reset belongs to the count it changes. */}
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
          <div className="ml-auto flex min-w-0 flex-wrap items-center gap-3">
            <label className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-paper/75">
              <span className="sr-only sm:not-sr-only lg:sr-only xl:not-sr-only">
                {da ? "Sortér" : "Sort"}
              </span>
              <span className="relative inline-flex">
                <select
                  data-catalogue-sort
                  disabled={!ready}
                  value={state.sort}
                  onChange={(event) =>
                    setState((previous) => ({ ...previous, sort: event.target.value as Sort }))
                  }
                  className={`${control} w-32 max-w-full appearance-none pr-9 text-sm sm:w-auto`}
                >
                  <option value="default">{da ? "Standard" : "Default"}</option>
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
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-paper/65"
                />
              </span>
            </label>
            {!budget && (
              <div
                className="hidden rounded-full bg-white/[0.04] p-1 ring-1 ring-inset ring-white/10 sm:inline-flex"
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
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 ${state.view === view ? "bg-white text-ink-950" : "text-paper/75 hover:bg-white/10 hover:text-paper"}`}
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
      <div
        /* The list has the container's width: the facets were a 200px
           column beside it once, and rows of chips over it after that. */
        className="min-w-0"
      >
        <div className="min-w-0">
          {budget && hasFacets && (
            <aside
              id={prefix + "-filters"}
              aria-label={da ? "Filtre" : "Filters"}
              className={`${filtersOpen ? "block" : "hidden"} plate mt-4 p-4 sm:p-5`}
            >
              {filterPanel}
            </aside>
          )}

          {/* No row of "selected filter" tags: it repeated the chips that
              were on. A facet's button counts its choices, Filtre counts them
              all on a phone, and "Nulstil filtre" clears them. */}
          {/* The list is one ledger: a single panel, a rule between rows,
              and the spec columns named once above them. Fifty-nine white
              cards with the same radius and the same shadow was the SaaS
              card kit Anthropic's frontend-design skill lists as a tell, and
              each card repeated "Processor, Hukommelse, Lagring". */}
          <div
            className={
              ledger && filtered.length > 0 ? "plate mt-4 overflow-hidden [color-scheme:dark]" : ""
            }
          >
            {sharedHeads && (
              <div
                aria-hidden="true"
                className="hidden grid-cols-[144px_minmax(0,1.15fr)_minmax(0,1.35fr)_11rem] gap-x-6 border-b border-white/10 px-5 py-3 text-xs font-medium text-paper/65 xl:grid"
              >
                <span className="col-span-2">Model</span>
                <span
                  className={`grid gap-3 ${heads.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
                >
                  {heads.map((head) => (
                    <span key={head}>{head}</span>
                  ))}
                </span>
              </div>
            )}
            <ul
              className={`min-w-0 ${
                ledger
                  ? "divide-y divide-white/[0.07]"
                  : `mt-4 grid gap-4 ${isList ? "" : budget ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 2xl:grid-cols-3"}`
              }`}
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
                  sharedHeads={sharedHeads}
                />
              ))}
            </ul>
          </div>
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
