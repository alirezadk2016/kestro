"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CatalogueEntry } from "@/lib/catalogue-types";
import type { Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";

type Props = {
  entry: CatalogueEntry;
  lang: Lang;
  mode: "models" | "budget";
  view: "list" | "grid";
  ready: boolean;
  selected: boolean;
  selectionFull: boolean;
  canCompare: boolean;
  priority: boolean;
  onCompare: () => void;
};

function Media({
  entry,
  grid,
  budget,
  priority,
}: {
  entry: CatalogueEntry;
  grid: boolean;
  budget: boolean;
  priority: boolean;
}) {
  return (
    <figure
      data-catalogue-media
      aria-hidden={entry.image ? undefined : true}
      className={`relative aspect-[4/3] self-start overflow-hidden rounded-lg ${budget ? "w-[104px]" : "w-20 sm:w-[104px]"} ${
        entry.image
          ? "bg-paper-dim ring-1 ring-inset ring-ink-900/5"
          : "border border-ink-200 bg-paper-dim"
      } ${
        grid
          ? entry.image
            ? "sm:aspect-auto sm:h-48 sm:w-full sm:rounded-none"
            : "sm:aspect-auto sm:h-14 sm:w-full sm:rounded-none sm:border-x-0 sm:border-t-0"
          : "xl:col-start-1 xl:row-start-1 xl:self-center"
      }`}
    >
      {entry.image ? (
        <Image
          src={entry.image.src}
          width={entry.image.width}
          height={entry.image.height}
          alt={entry.image.alt}
          priority={priority}
          sizes={grid ? "(min-width: 1536px) 25vw, (min-width: 640px) 45vw, 104px" : "104px"}
          className="h-full w-full object-contain"
        />
      ) : (
        <div
          data-catalogue-placeholder
          className={`flex h-full items-center justify-center px-2 text-center font-display text-sm font-bold text-ink-700 ${grid ? "sm:justify-start sm:px-4 sm:text-base" : ""}`}
        >
          {entry.brand}
        </div>
      )}
    </figure>
  );
}

export default function CatalogueListingItem({
  entry,
  lang,
  mode,
  view,
  ready,
  selected,
  selectionFull,
  canCompare,
  priority,
  onCompare,
}: Props) {
  const da = lang === "da";
  const budget = mode === "budget";
  const grid = view === "grid";
  const enquiry = budget
    ? da
      ? "Spørg om pris"
      : "Enquire"
    : da
      ? "Spørg om modellen"
      : "Enquire";
  const compare = canCompare && (
    <label className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 text-sm text-ink-700">
      <input
        data-catalogue-compare={entry.id}
        type="checkbox"
        checked={selected}
        disabled={!ready || (selectionFull && !selected)}
        onChange={onCompare}
        className="h-4 w-4 shrink-0 accent-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
      />
      <span>
        {da ? "Sammenlign" : "Compare"}
        <span className="sr-only">: {entry.name}</span>
      </span>
    </label>
  );
  const quote = (
    <Link
      data-catalogue-enquiry
      data-budget-enquiry={budget ? "" : undefined}
      href={entry.enquiryHref}
      aria-label={`${enquiry}: ${entry.name}`}
      className={`${buttonClass("primary")} shrink-0 whitespace-nowrap !px-3`}
    >
      {enquiry}
      {!budget && <ArrowRight size={14} aria-hidden="true" />}
    </Link>
  );

  return (
    <li
      id={entry.fragmentId}
      data-catalogue-item={entry.id}
      data-budget-model={budget ? entry.id : undefined}
      className={`sheet grid min-w-0 scroll-mt-28 gap-y-3 overflow-hidden ${
        budget
          ? "grid-cols-[104px_minmax(0,1fr)] gap-x-4 p-4"
          : `grid-cols-[80px_minmax(0,1fr)] gap-x-3 p-3 sm:grid-cols-[104px_minmax(0,1fr)] ${grid ? "" : "sm:p-4"}`
      } ${
        grid
          ? "sm:flex sm:flex-col sm:gap-y-0 sm:p-0"
          : budget
            ? "xl:grid-cols-[104px_minmax(0,1fr)]"
            : "xl:grid-cols-[104px_minmax(0,1.1fr)_minmax(0,1.25fr)_auto] xl:gap-x-5 xl:gap-y-1"
      }`}
    >
      <Media entry={entry} grid={grid} budget={budget} priority={priority} />
      <div
        className={`min-w-0 self-center ${grid ? `sm:w-full sm:px-4 sm:pt-3 ${budget ? "sm:min-h-24" : ""}` : "xl:col-start-2 xl:row-start-1"}`}
      >
        <p className="text-xs font-medium leading-4 text-ink-600">{entry.format}</p>
        <h3 className="font-display text-base font-bold leading-snug text-ink-900 sm:text-lg">
          <Link
            data-catalogue-detail
            href={entry.detailHref}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 ${budget && grid ? "sm:min-h-14" : ""}`}
          >
            <span>{entry.name}</span>
            <ArrowRight size={12} className="shrink-0 text-brand-700" aria-hidden="true" />
          </Link>
        </h3>
        <p className="text-xs leading-4 text-ink-600">
          {entry.image
            ? entry.image.kind === "photo"
              ? da
                ? "Modelfoto"
                : "Model photo"
              : "Illustration"
            : da
              ? "Modelreference"
              : "Model reference"}
        </p>
      </div>

      {budget ? (
        <div
          className={`col-span-2 flex min-w-0 flex-1 flex-col ${grid ? "sm:px-4 sm:pb-3" : "xl:col-span-1 xl:col-start-2 xl:row-start-2"}`}
        >
          <p className="text-sm leading-6 text-ink-700 sm:mt-2 sm:min-h-20 xl:min-h-24 min-[1440px]:min-h-20 min-[1800px]:min-h-12">
            {entry.configuration}
          </p>
          {entry.budget && (
            <div className="mt-3">
              <p className="text-xs font-semibold leading-4 text-ink-600">
                {da ? "Historisk budget pr. enhed" : "Historical budget per unit"}
              </p>
              <p className="mt-1 font-display text-2xl font-bold leading-7 tabular-nums text-ink-900">
                {da ? "Ca." : "Approx."} {entry.budget.formatted}
              </p>
            </div>
          )}
          <div className="mt-auto pt-3">
            <div className="flex flex-wrap items-center justify-between gap-x-2">
              {quote}
              {compare}
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3">
              <Link
                data-budget-model-link
                href={entry.detailHref}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {da ? "Detaljer" : "Details"}
                <span className="sr-only">: {entry.name}</span>
                <ArrowRight size={12} aria-hidden="true" />
              </Link>
              {entry.sourceHref && (
                <a
                  data-budget-source
                  href={entry.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`${da ? "Historisk priskilde" : "Historical price source"}: ${entry.name} (${da ? "åbner i en ny fane" : "opens in a new tab"})`}
                  className="inline-flex min-h-11 items-center gap-1.5 text-xs text-ink-600 underline underline-offset-4 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {da ? "Historisk priskilde" : "Historical price source"}
                  <ArrowUpRight size={12} className="shrink-0" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {entry.application && (
            <p
              data-catalogue-application
              className={`col-span-2 text-sm leading-5 text-ink-700 ${grid ? "sm:px-4 sm:pt-2" : "xl:col-span-1 xl:col-start-2 xl:row-start-2"}`}
            >
              {entry.application}
            </p>
          )}
          <dl
            className={`col-span-2 grid min-w-0 gap-3 border-t border-ink-200 pt-3 ${entry.facts.length === 2 ? "grid-cols-2" : "grid-cols-3"} ${
              grid
                ? "sm:mx-4 sm:mt-3"
                : "xl:col-span-1 xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:self-center xl:border-0 xl:pt-0"
            }`}
          >
            {entry.facts.slice(0, 3).map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="text-xs leading-4 text-ink-600">{fact.label}</dt>
                <dd className="mt-1 break-words text-sm font-medium leading-5 text-ink-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
          <div
            className={`col-span-2 flex flex-wrap items-center justify-between gap-x-3 ${
              grid
                ? "sm:mt-auto sm:px-4 sm:pb-3 sm:pt-3"
                : "xl:col-span-1 xl:col-start-4 xl:row-span-2 xl:row-start-1 xl:flex-col xl:items-end xl:justify-center"
            }`}
          >
            {compare}
            {quote}
          </div>
        </>
      )}
    </li>
  );
}
