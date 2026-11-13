"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
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
  view: "grid",
  compare: [],
};
const control =
  "min-h-11 rounded-lg border border-white/20 bg-ink-950 px-3 text-sm text-paper outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-300/60 disabled:cursor-not-allowed";

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
  const prefix = useId();
  const [state, setState] = useState<State>(INITIAL);
  const [ready, setReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const comparisonHeading = useRef<HTMLHeadingElement>(null);
  const comparisonButton = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const legacyTarget = useRef<string | null>(null);
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
      if (
        !url.searchParams.has("type") &&
        categories.some((category) => category.id === fragment)
      ) {
        types.push(fragment);
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
        view: url.searchParams.get("view") === "list" ? "list" : "grid",
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
  }, [entries, categories, brands, budget]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    const values = {
      q: state.query || "",
      brand: state.brands.join(","),
      type: state.types.join(","),
      sort: state.sort === "default" ? "" : state.sort,
      view: state.view === "grid" ? "" : state.view,
      compare: state.compare.join(","),
    };
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    if (!state.types.length && categories.some((category) => `#${category.id}` === url.hash))
      url.hash = "";
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [state, ready, categories]);

  // A fragment can initially scroll far down the unfiltered HTML. Keep its
  // real model in view after React commits the shorter filtered result.
  useEffect(() => {
    if (!ready || !legacyTarget.current) return;
    const target = legacyTarget.current;
    legacyTarget.current = null;
    document.getElementById(target)?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [ready, state]);

  useEffect(() => {
    if (comparisonOpen) {
      comparisonHeading.current?.focus({ preventScroll: true });
      comparisonHeading.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [comparisonOpen]);
  useEffect(() => {
    if (state.compare.length < 2) setComparisonOpen(false);
  }, [state.compare.length]);

  const query = state.query.trim().toLocaleLowerCase(lang);
  const textMatches = (entry: CatalogueEntry) =>
    !query ||
    `${entry.name} ${entry.brand} ${entry.format} ${entry.description} ${entry.configuration || ""} ${entry.facts.map((fact) => fact.value).join(" ")}`
      .toLocaleLowerCase(lang)
      .includes(query);
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

  return (
    <div
      data-catalogue={mode}
      className={`mt-7 min-w-0 ${selected.length ? "pb-48 sm:pb-36" : ""}`}
    >
      {heading && (
        <h2 className="sr-only font-display font-extrabold text-paper sm:not-sr-only sm:mb-6 sm:t-h2">
          {heading}
        </h2>
      )}
      <noscript>
        <p className="mb-4 text-sm leading-6 text-paper/85">
          {da
            ? "Alle modeller og links vises her. Søgning, filtre og sammenligning kræver JavaScript."
            : "All models and links are shown here. Search, filters and comparison require JavaScript."}
        </p>
      </noscript>
      <div
        className={`grid min-w-0 gap-6 ${hasFacets ? "lg:grid-cols-[208px_minmax(0,1fr)] xl:gap-8 2xl:grid-cols-[224px_minmax(0,1fr)]" : ""}`}
      >
        <div className={hasFacets ? "min-w-0" : "hidden"}>
          <button
            type="button"
            data-catalogue-filter-toggle
            disabled={!ready}
            aria-expanded={filtersOpen}
            aria-controls={`${prefix}-filters`}
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`${buttonClass("secondary")} w-full justify-between lg:hidden`}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal size={18} aria-hidden="true" />
              {da ? "Filtre" : "Filters"}
              {active > 0 && ` (${active})`}
            </span>
            <ChevronDown size={18} aria-hidden="true" className={filtersOpen ? "rotate-180" : ""} />
          </button>
          <aside
            id={`${prefix}-filters`}
            aria-label={da ? "Filtre" : "Filters"}
            className={`${filtersOpen ? "block" : "hidden"} plate mt-3 p-4 lg:sticky lg:top-24 lg:mt-0 lg:block lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:p-5`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <p className="font-display text-base font-bold text-paper">
                {da ? "Afgræns dit valg" : "Narrow your selection"}
              </p>
            </div>
            <fieldset className="mt-5">
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
                        (entry) =>
                          entry.brand === brand && textMatches(entry) && typeMatches(entry),
                      ).length
                    }
                  </span>
                </label>
              ))}
            </fieldset>
            {categories.length > 1 && (
              <fieldset className="mt-4 border-t border-white/10 pt-5">
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
            <button
              type="button"
              disabled={!ready}
              data-catalogue-clear
              onClick={clear}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/20 px-3 text-sm font-semibold text-paper/85 transition-colors hover:border-brand-300 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
            >
              {da ? "Nulstil filtre" : "Reset filters"}
            </button>
          </aside>
        </div>

        <div className="min-w-0">
          <div className="plate p-3 sm:p-4">
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
                onChange={(event) => setState({ ...state, query: event.target.value })}
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
                <label className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-paper/75">
                  <span>{da ? "Sortér" : "Sort"}</span>
                  <select
                    data-catalogue-sort
                    disabled={!ready}
                    value={state.sort}
                    onChange={(event) => setState({ ...state, sort: event.target.value as Sort })}
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
                        onClick={() => setState({ ...state, view })}
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 ${state.view === view ? "bg-brand-600 text-paper" : "text-paper/75 hover:bg-white/10 hover:text-paper"}`}
                      >
                        <Icon size={18} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

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
                      ? setState({ ...state, query: "" })
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
            className={`mt-4 grid min-w-0 gap-4 ${isList ? "" : budget ? "sm:grid-cols-2 2xl:grid-cols-4" : "sm:grid-cols-2 2xl:grid-cols-3"}`}
          >
            {filtered.map((entry, index) => (
              <li
                key={entry.id}
                id={entry.fragmentId}
                data-catalogue-item={entry.id}
                data-budget-model={budget ? entry.id : undefined}
                className={`plate grid min-w-0 scroll-mt-28 grid-cols-[104px_minmax(0,1fr)] gap-x-4 overflow-hidden p-4 ${isList ? "sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-x-5" : "sm:flex sm:flex-col sm:p-0"}`}
              >
                <figure
                  className={`relative aspect-[4/3] self-center overflow-hidden rounded-lg outline outline-1 -outline-offset-1 outline-white/10 ${entry.image ? "bg-paper-dim" : "border border-white/10 bg-ink-950"} ${isList ? "sm:row-span-2 sm:self-start" : "sm:self-auto sm:rounded-none"}`}
                >
                  {entry.image ? (
                    <Image
                      src={entry.image.src}
                      width={entry.image.width}
                      height={entry.image.height}
                      alt={entry.image.alt}
                      priority={index === 0}
                      sizes={
                        isList
                          ? "(min-width: 640px) 160px, 104px"
                          : "(min-width: 1536px) 22vw, (min-width: 1024px) 32vw, (min-width: 640px) 46vw, 104px"
                      }
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full min-h-16 flex-col items-center justify-center gap-1 px-2 py-4 text-center">
                      <span className="font-display text-lg font-bold text-paper/85 sm:text-2xl">
                        {entry.brand}
                      </span>
                      <span className="text-xs text-paper/65">
                        {da ? "Modelguide" : "Model guide"}
                      </span>
                    </div>
                  )}
                </figure>
                <div
                  className={`min-w-0 self-center ${isList ? "sm:self-start" : "sm:self-stretch sm:px-5 sm:pt-5"}`}
                >
                  <p className="text-xs font-semibold uppercase leading-5 tracking-wider text-brand-300">
                    {entry.format}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-snug text-paper">
                    <Link
                      data-catalogue-detail
                      href={entry.detailHref}
                      className="inline-flex min-h-11 items-center rounded-sm hover:text-brand-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                    >
                      {entry.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-paper/65">
                    {entry.image
                      ? entry.image.kind === "photo"
                        ? da
                          ? "Modelfoto"
                          : "Model photo"
                        : "Illustration"
                      : da
                        ? "Foto ikke tilgængeligt"
                        : "Photo unavailable"}
                  </p>
                </div>
                <div
                  className={`col-span-2 flex min-w-0 flex-1 flex-col pt-2 ${isList ? "sm:col-span-1 sm:col-start-2 sm:pt-0" : "sm:px-5 sm:pb-5 sm:pt-0"}`}
                >
                  {entry.configuration ? (
                    <p className="mt-2 text-sm leading-6 text-paper/75 sm:min-h-12">
                      {entry.configuration}
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-sm leading-6 text-paper/75 sm:min-h-12">
                        {entry.description}
                      </p>
                      <dl className="mt-4 grid gap-3 border-y border-white/10 py-3">
                        {entry.facts.slice(0, 3).map((fact) => (
                          <div
                            key={fact.label}
                            className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm"
                          >
                            <dt className="text-paper/65">{fact.label}</dt>
                            <dd className="text-right font-medium text-paper/85">{fact.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  )}
                  {entry.budget && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-paper/65">
                        {da ? "Historisk budget pr. enhed" : "Historical budget per unit"}
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold tabular-nums text-paper">
                        {da ? "Ca." : "Approx."} {entry.budget.formatted}
                      </p>
                    </div>
                  )}
                  <div className="mt-auto pt-4">
                    <Link
                      data-catalogue-enquiry
                      data-budget-enquiry={budget ? "" : undefined}
                      href={entry.enquiryHref}
                      aria-label={`${budget ? (da ? "Spørg om modellen" : "Ask about this model") : da ? "Få pris" : "Get a price"}: ${entry.name}`}
                      className={`${buttonClass("primary")} w-full px-3 py-2 text-center`}
                    >
                      <span>
                        {budget
                          ? da
                            ? "Spørg om modellen"
                            : "Ask about this model"
                          : da
                            ? "Få pris"
                            : "Get a price"}
                      </span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
                      <Link
                        data-budget-model-link={budget ? "" : undefined}
                        href={entry.detailHref}
                        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-paper"
                      >
                        <span>
                          {budget
                            ? da
                              ? "Detaljer"
                              : "Details"
                            : da
                              ? "Specifikationer"
                              : "Specifications"}
                        </span>
                        <span className="sr-only">: {entry.name}</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                      {entries.length > 1 && (
                        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-paper/85">
                          <input
                            data-catalogue-compare={entry.id}
                            type="checkbox"
                            checked={state.compare.includes(entry.id)}
                            disabled={
                              !ready ||
                              (state.compare.length >= 3 && !state.compare.includes(entry.id))
                            }
                            onChange={() => toggle("compare", entry.id)}
                            className="h-4 w-4 shrink-0 accent-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                          />
                          <span>
                            {da ? "Sammenlign" : "Compare"}
                            <span className="sr-only">: {entry.name}</span>
                          </span>
                        </label>
                      )}
                    </div>
                    {entry.sourceHref && (
                      <a
                        data-budget-source
                        href={entry.sourceHref}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={`${da ? "Historisk priskilde" : "Historical price source"}: ${entry.name} (${da ? "åbner i en ny fane" : "opens in a new tab"})`}
                        className="inline-flex min-h-11 items-center gap-2 text-xs text-paper/75 underline underline-offset-4 hover:text-paper"
                      >
                        {da ? "Historisk priskilde" : "Historical price source"}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </li>
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

      {comparisonOpen && selected.length >= 2 && (
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
                setComparisonOpen(false);
                comparisonButton.current?.focus();
              }}
              aria-label={da ? "Luk sammenligning" : "Close comparison"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-paper/85 hover:text-paper focus-visible:outline-2 focus-visible:outline-brand-300"
            >
              <X size={18} aria-hidden="true" />
            </button>
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
                    className="sticky left-0 z-10 min-w-28 bg-ink-950 p-4 text-paper/75"
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
                        className="inline-flex min-h-11 items-center underline decoration-brand-300/40 underline-offset-4 hover:text-brand-200"
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
                    className="sticky left-0 bg-ink-900 p-4 font-medium text-paper/75"
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
                      className="sticky left-0 bg-ink-900 p-4 font-medium text-paper/75"
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
                      className="sticky left-0 bg-ink-900 p-4 font-medium text-paper/75"
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
                    className="sticky left-0 bg-ink-900 p-4 font-medium text-paper/75"
                  >
                    {da ? "Næste skridt" : "Next step"}
                  </th>
                  {selected.map((entry) => (
                    <td key={entry.id} className="p-4">
                      <Link
                        href={entry.enquiryHref}
                        aria-label={`${da ? "Spørg om modellen" : "Ask about this model"}: ${entry.name}`}
                        className={`${buttonClass("primary")} whitespace-nowrap px-3`}
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

      {selected.length > 0 && (
        <div
          data-catalogue-tray
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-ink-950 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-xl sm:inset-x-6 sm:bottom-4 sm:rounded-xl sm:border sm:px-5"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
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
                    data-catalogue-remove={entry.id}
                    type="button"
                    onClick={() => toggle("compare", entry.id)}
                    aria-label={`${da ? "Fjern" : "Remove"}: ${entry.name}`}
                    className="inline-flex min-h-11 max-w-56 shrink-0 items-center gap-2 text-xs text-paper/85 hover:text-paper"
                  >
                    <span className="truncate">{entry.name}</span>
                    <X size={14} className="shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-catalogue-compare-clear
                onClick={() => {
                  setState({ ...state, compare: [] });
                  search.current?.focus();
                }}
                className="inline-flex min-h-11 items-center text-sm text-paper/75 underline underline-offset-4 hover:text-paper"
              >
                {da ? "Ryd udvalg" : "Clear selection"}
              </button>
              <button
                ref={comparisonButton}
                type="button"
                data-catalogue-compare-open
                disabled={selected.length < 2}
                onClick={() => setComparisonOpen(true)}
                className={`${buttonClass("primary")} px-4`}
              >
                {da ? "Sammenlign" : "Compare"} ({selected.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
