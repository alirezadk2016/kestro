"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogueEntry } from "@/lib/catalogue-types";
import type { Lang } from "@/lib/i18n";
import { buttonClass } from "./Button";
import styles from "./CatalogueListingItem.module.css";

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
  sharedHeads?: boolean;
  hidden?: boolean;
};

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
  hidden = false,
}: Props) {
  const da = lang === "da";
  const budget = mode === "budget";
  const compactGrid = view === "grid" && !budget;
  const parts = nameParts(entry);
  const disabled = !ready || (selectionFull && !selected);
  const enquiry = budget ? (da ? "Spørg om pris" : "Enquire") : da ? "Forespørg" : "Enquire";

  return (
    <li
      id={entry.fragmentId}
      hidden={hidden}
      data-catalogue-item={entry.id}
      data-catalogue-layout={view}
      data-budget-model={budget ? entry.id : undefined}
      className={`${styles.card} ${view === "grid" ? styles.grid : styles.list} ${compactGrid ? styles.compact : ""} ${selected ? styles.selected : ""} ${hidden ? "!hidden" : ""}`}
    >
      <Link
        data-catalogue-image-link
        href={entry.detailHref}
        aria-label={`${entry.image ? (da ? "Se billeder og detaljer" : "View images and details") : da ? "Se detaljer" : "View details"}: ${entry.name}`}
        className={styles.mediaLink}
      >
        <figure
          data-catalogue-media
          data-photographic={entry.image?.kind === "photo" ? "true" : undefined}
          className={styles.media}
        >
          {entry.image ? (
            <Image
              src={entry.image.src}
              width={entry.image.width}
              height={entry.image.height}
              alt={entry.image.alt}
              priority={priority}
              sizes={
                view === "grid"
                  ? "(min-width: 1536px) 24vw, (min-width: 1024px) 28vw, (min-width: 640px) 44vw, 92vw"
                  : "(min-width: 1024px) 180px, (min-width: 640px) 160px, 92vw"
              }
              className={`${styles.image} ${entry.image.sourceFrame ? styles.sourceFrame : ""}`}
            />
          ) : (
            <div data-catalogue-placeholder aria-hidden="true" className={styles.reference}>
              <span className={styles.referenceFamily}>
                {entry.brand} {parts.family !== entry.brand ? parts.family : ""}
              </span>
              <span className={styles.referenceModel}>{parts.model}</span>
              {parts.generation && (
                <span className={styles.referenceGeneration}>{parts.generation}</span>
              )}
              <span className={styles.referenceNote}>
                {da ? "Modelreference" : "Model reference"}
              </span>
            </div>
          )}
        </figure>
      </Link>
      <div className={styles.identity}>
        {compactGrid ? (
          <Link
            data-catalogue-detail
            href={entry.detailHref}
            aria-label={entry.name}
            className={styles.identityLink}
          >
            <span className={styles.format}>{entry.format}</span>
            <h3 className={styles.name}>{entry.name}</h3>
          </Link>
        ) : (
          <>
            <p className={styles.format}>{entry.format}</p>
            <h3 className={styles.name}>
              <Link data-catalogue-detail href={entry.detailHref}>
                {entry.name}
              </Link>
            </h3>
          </>
        )}
        {!budget && view === "list" && entry.application && (
          <p data-catalogue-application className={styles.application}>
            {entry.application}
          </p>
        )}
      </div>
      {budget ? (
        <div className={styles.budget}>
          <p className="text-sm leading-6 text-ink-700">{entry.configuration}</p>
          {entry.budget && (
            <div className="mt-3">
              <p className="text-xs font-semibold leading-5 text-ink-600">
                {da ? "Historisk budget pr. enhed" : "Historical budget per unit"}
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-ink-900">
                {da ? "Ca." : "Approx."} {entry.budget.formatted}
              </p>
            </div>
          )}
        </div>
      ) : (
        <dl className={styles.facts}>
          {entry.facts.slice(0, 3).map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className={styles.actions}>
        {canCompare && (
          <label
            className={`${styles.compare} ${disabled && !selected ? styles.unavailable : ""}`}
            title={
              selectionFull && !selected
                ? da
                  ? "Vælg højst tre modeller. Fjern en model for at vælge en anden."
                  : "Compare up to three models. Remove one to choose another."
                : undefined
            }
          >
            <input
              data-catalogue-compare={entry.id}
              type="checkbox"
              checked={selected}
              disabled={disabled}
              onChange={onCompare}
            />
            <span>
              {da ? "Sammenlign" : "Compare"}
              <span className="sr-only">: {entry.name}</span>
            </span>
          </label>
        )}
        <Link
          data-catalogue-enquiry
          data-budget-enquiry={budget ? "" : undefined}
          href={entry.enquiryHref}
          aria-label={`${da ? "Spørg om modellen" : "Enquire"}: ${entry.name}`}
          className={budget ? `${buttonClass("primary")} !px-3` : styles.enquiry}
        >
          {enquiry}
        </Link>
      </div>
      {budget && (
        <div className={styles.budgetLinks}>
          <Link data-budget-model-link href={entry.detailHref}>
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
            >
              {da ? "Historisk priskilde" : "Historical price source"}
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </li>
  );
}
