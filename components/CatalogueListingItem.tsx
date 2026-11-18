"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
  /** The list shows one row of column heads for every row, so each row's
      labels can stay for screen readers and leave the screen from xl. */
  sharedHeads?: boolean;
};

/* "Lenovo ThinkPad T14s Gen 4" -> ThinkPad / T14s / Gen 4, for the tile a
   model without a photograph gets. */
const FAMILIES = new Set([
  "ThinkPad",
  "ThinkCentre",
  "ThinkVision",
  "EliteBook",
  "ProBook",
  "ZBook",
  "EliteDesk",
  "EliteDisplay",
  "Latitude",
  "OptiPlex",
  "UltraSharp",
]);
function nameParts(entry: CatalogueEntry) {
  const rest = entry.name.startsWith(entry.brand + " ")
    ? entry.name.slice(entry.brand.length + 1)
    : entry.name;
  const generation = rest.match(/\s(Gen \d+)$/)?.[1];
  const base = generation ? rest.slice(0, -generation.length - 1) : rest;
  const [first, ...others] = base.split(" ");
  return FAMILIES.has(first) && others.length
    ? { family: first, model: others.join(" "), generation }
    : { family: entry.brand, model: base, generation };
}

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
  const parts = nameParts(entry);
  return (
    /* The picture stands on the products hub's own floor (.product-well): the
       drawings' ground with a hairline, photos multiplied into it. */
    <figure
      data-catalogue-media
      aria-hidden={entry.image ? undefined : true}
      className={`product-well relative aspect-[4/3] self-start overflow-hidden rounded-md ${budget ? "w-[104px]" : grid ? "w-[88px] sm:w-32" : "w-[88px] sm:w-28"} ${
        grid
          ? entry.image
            ? "sm:aspect-auto sm:h-48 sm:w-full sm:rounded-none"
            : "sm:aspect-auto sm:h-14 sm:w-full sm:rounded-none"
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
          sizes={grid ? "(min-width: 1536px) 25vw, (min-width: 640px) 45vw, 128px" : "112px"}
          className={`h-full w-full object-contain ${entry.image.kind === "photo" ? "mix-blend-multiply brightness-[1.025]" : ""}`}
        />
      ) : (
        /* No photograph of this exact model yet, and no stand-in device: the
           owner wants real pictures or none. A grey box with "Lenovo" in it,
           54 times down the page, read as a shop with its images missing;
           the model's own name, set as type, reads as a specification. */
        <div
          data-catalogue-placeholder
          className={`flex h-full flex-col justify-end p-2 sm:p-3 ${grid ? "sm:flex-row sm:items-center sm:justify-start sm:gap-2 sm:px-4" : ""}`}
        >
          {/* The family only from sm: in the 88px phone tile "ELITEBOOK" ran to
              the edge and a two-line "X1 Carbon" pushed it out of the top. */}
          <span className="hidden truncate text-xs font-semibold uppercase leading-4 tracking-[0.08em] text-ink-600 sm:block">
            {parts.family}
          </span>
          {/* sm:text-base in the list's 112px well: at text-xl "X1 Carbon"
              took two lines and pushed "ThinkPad" out of the top. */}
          <span
            className={`font-display text-sm font-extrabold leading-tight text-ink-900 ${grid ? "sm:text-xl" : "sm:text-base"}`}
          >
            {parts.model}
          </span>
          {parts.generation && (
            <span className="text-xs font-medium leading-4 text-ink-600">{parts.generation}</span>
          )}
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
  sharedHeads = false,
}: Props) {
  const da = lang === "da";
  const nameBreak = entry.name.lastIndexOf(" ");
  const nameHead = nameBreak > 0 ? entry.name.slice(0, nameBreak) : "";
  const nameTail = nameBreak > 0 ? entry.name.slice(nameBreak + 1) : entry.name;
  const budget = mode === "budget";
  const grid = view === "grid";
  /* The list is one dark ledger (CatalogueExplorer gives it the panel and the
     rules between rows); the grid keeps the hub's white sheets. In the list
     only the pictures sit on light: a product on its own lit shelf. */
  const ledger = !grid && !budget;
  const tone = ledger
    ? {
        eyebrow: "text-brand-300",
        name: "text-paper hover:text-brand-200 focus-visible:outline-brand-300",
        body: "text-paper/75",
        rule: "border-white/10",
        term: "text-paper/65",
        value: "text-paper",
        compare: "text-paper/85",
      }
    : {
        eyebrow: "text-brand-700",
        name: "text-ink-900 hover:text-brand-700 focus-visible:outline-brand-600",
        body: "text-ink-700",
        rule: "border-ink-200",
        term: "text-ink-600",
        value: "text-ink-900",
        compare: "text-ink-700",
      };
  const enquiry = budget
    ? da
      ? "Spørg om pris"
      : "Enquire"
    : da
      ? "Spørg om modellen"
      : "Enquire";
  const compare = canCompare && (
    <label
      className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 text-sm ${tone.compare}`}
    >
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
      /* One quiet outline action per row. Fifty-nine filled blue buttons
         down the page shouted over the models; the filled blue stays the
         header's single "Få et tilbud". It fills on hover. */
      className={
        budget
          ? `${buttonClass("primary")} shrink-0 whitespace-nowrap !px-3`
          : ledger
            ? "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-semibold text-paper ring-1 ring-inset ring-white/20 transition-colors duration-150 hover:bg-brand-600 hover:ring-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 motion-safe:active:scale-[0.96]"
            : "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/35 transition-colors duration-150 hover:bg-brand-600 hover:text-white hover:ring-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 motion-safe:active:scale-[0.96]"
      }
    >
      {enquiry}
    </Link>
  );

  return (
    <li
      id={entry.fragmentId}
      data-catalogue-item={entry.id}
      data-budget-model={budget ? entry.id : undefined}
      className={`grid min-w-0 scroll-mt-28 gap-y-3 ${
        ledger
          ? "grid-cols-[88px_minmax(0,1fr)] gap-x-3.5 px-3 py-4 transition-colors duration-150 hover:bg-white/[0.025] sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-x-5 sm:px-5 xl:grid-cols-[112px_minmax(0,1.15fr)_minmax(0,1.35fr)_11rem] xl:gap-x-6 xl:gap-y-1 xl:py-3.5"
          : `sheet overflow-hidden ${
              budget
                ? `grid-cols-[104px_minmax(0,1fr)] gap-x-4 p-4 ${grid ? "sm:flex sm:flex-col sm:gap-y-0 sm:p-0" : "xl:grid-cols-[104px_minmax(0,1fr)]"}`
                : "grid-cols-[88px_minmax(0,1fr)] gap-x-3.5 p-3 sm:flex sm:flex-col sm:gap-x-5 sm:gap-y-0 sm:p-0"
            }`
      }`}
    >
      <Media entry={entry} grid={grid} budget={budget} priority={priority} />
      <div
        className={`min-w-0 self-center ${grid ? `sm:w-full sm:px-4 sm:pt-3 ${budget ? "sm:min-h-24" : ""}` : "xl:col-start-2 xl:row-start-1"}`}
      >
        <p className={`text-xs font-semibold leading-4 ${tone.eyebrow}`}>{entry.format}</p>
        <h3 className="font-display text-base font-bold leading-snug sm:text-lg">
          <Link
            data-catalogue-detail
            href={entry.detailHref}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${tone.name} ${budget && grid ? "sm:min-h-14" : ""}`}
          >
            {/* The last word stays whole when the name wraps ("…X1 Carbon
                Gen 10"). It carried an arrow once; the row is the link, and an
                arrow on every one of sixty rows was chrome. */}
            <span>
              {nameHead && `${nameHead} `}
              <span className="whitespace-nowrap">{nameTail}</span>
            </span>
          </Link>
        </h3>
        {/* What a picture is — model photo or illustration — is said once,
            in the note under the list, not under every name. */}
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
              className={`col-span-2 text-sm leading-5 ${tone.body} ${grid ? "sm:px-4 sm:pt-2" : "xl:col-span-1 xl:col-start-2 xl:row-start-2"}`}
            >
              {entry.application}
            </p>
          )}
          <dl
            className={`col-span-2 grid min-w-0 gap-3 border-t pt-3 ${tone.rule} ${entry.facts.length === 2 ? "grid-cols-2" : "grid-cols-3"} ${
              grid
                ? "sm:mx-4 sm:mt-3"
                : "xl:col-span-1 xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:self-center xl:border-0 xl:pt-0"
            }`}
          >
            {entry.facts.slice(0, 3).map((fact) => (
              <div key={fact.label} className="min-w-0">
                {/* With one row of column heads above the list, each row's
                    labels stay for screen readers and leave the screen. */}
                <dt
                  className={`text-xs font-medium leading-4 ${tone.term} ${sharedHeads && ledger ? "xl:sr-only" : ""}`}
                >
                  {fact.label}
                </dt>
                <dd
                  className={`mt-1 break-words text-sm font-semibold leading-5 tabular-nums ${tone.value} ${sharedHeads && ledger ? "xl:mt-0" : ""}`}
                >
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
