"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SearchConsoleReport } from "@/lib/insights-types";
import {
  parseSearchConsoleImport,
  SEARCH_CONSOLE_MAX_BYTES,
  searchTypeLabel,
} from "@/lib/search-console";
import { formatDate } from "@/lib/i18n";
import styles from "@/components/admin/growth.module.css";

export default function SearchConsoleImport({
  dateFrom: initialFrom,
  dateTo: initialTo,
  syncConfigured,
}: {
  dateFrom: string;
  dateTo: string;
  syncConfigured: boolean;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"file" | "paste">("file");
  const [pasted, setPasted] = useState("");
  const [dateFrom, setDateFrom] = useState(initialFrom);
  const [dateTo, setDateTo] = useState(initialTo);
  const [searchType, setSearchType] = useState<SearchConsoleReport["searchType"]>("web");
  const [preview, setPreview] = useState<SearchConsoleReport | null>(null);
  const [busy, setBusy] = useState<"preview" | "save" | "sync" | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [saved, setSaved] = useState(false);
  const invalidate = () => {
    setPreview(null);
    setSaved(false);
    setError("");
    setStatus("");
  };

  async function showPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    invalidate();
    if (mode === "file" && !file) {
      setError("Vælg en JSON- eller CSV-fil først.");
      return;
    }
    if (mode === "file" && file && file.size > SEARCH_CONSOLE_MAX_BYTES) {
      setError("Filen må højst være 2 MB.");
      return;
    }
    setBusy("preview");
    try {
      const report = parseSearchConsoleImport(mode === "paste" ? pasted : await file!.text(), {
        dateFrom,
        dateTo,
        searchType,
      });
      setPreview(report);
      setStatus("Filen er valideret lokalt. Kontrollér perioden og indholdet, før du gemmer.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Filen kunne ikke læses.");
    } finally {
      setBusy(null);
    }
  }

  async function post(kind: "save" | "sync") {
    if (kind === "save" && !preview) return;
    setBusy(kind);
    setError("");
    setStatus("");
    try {
      const response = await fetch(
        `/api/admin/search-console-${kind === "save" ? "import" : "sync"}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(kind === "save" ? preview : { dateFrom, dateTo }),
          signal: AbortSignal.timeout(35_000),
        },
      );
      const result = (await response.json().catch(() => null)) as {
        saved?: boolean;
        error?: string;
      } | null;
      if (!response.ok || !result?.saved)
        throw new Error(
          result?.error || "Rapporten kunne ikke gemmes. Prøv igen, eller log ind på ny.",
        );
      setStatus(
        kind === "save"
          ? "Rapporten er gemt. Visningen er opdateret."
          : "Den nye rapport er hentet og gemt.",
      );
      setSaved(kind === "save");
      // A provider refresh saved its own report, not the file in this preview.
      if (kind === "sync") setPreview(null);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error && caught.name !== "TimeoutError" && caught.name !== "AbortError"
          ? caught.message
          : "Forbindelsen tog for lang tid. Kontrollér den gemte rapport før et nyt forsøg.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <fieldset className={`${styles.panelBody} min-w-0`} disabled={busy !== null}>
      <legend className="sr-only">Importér eller opdatér Search Console-rapport</legend>
      <p className={styles.sectionCopy}>
        Importér én officiel CSV-tabel eller en samlet Kestro JSON-rapport. Filen vises og
        kontrolleres før lagring; samme ejendom, periode og søgetype erstattes, så tallene ikke
        lægges sammen to gange.
      </p>
      <form
        onSubmit={showPreview}
        className="mt-5 grid gap-5"
        aria-label="Importér Search Console-rapport"
      >
        <div className="flex flex-wrap gap-3" aria-label="Vælg importmetode">
          <button
            type="button"
            className={styles.button}
            aria-pressed={mode === "file"}
            onClick={() => {
              invalidate();
              setMode("file");
            }}
          >
            Vælg fil
          </button>
          <button
            type="button"
            className={styles.button}
            aria-pressed={mode === "paste"}
            onClick={() => {
              invalidate();
              setMode("paste");
            }}
          >
            Indsæt rapport
          </button>
        </div>
        <div className={styles.builderFields}>
          <div className={styles.field}>
            <label htmlFor="search-import-from">Fra dato · Pacific</label>
            <input
              id="search-import-from"
              type="date"
              required
              className={styles.input}
              value={dateFrom}
              onChange={(event) => {
                invalidate();
                setDateFrom(event.target.value);
              }}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="search-import-to">Til dato · Pacific</label>
            <input
              id="search-import-to"
              type="date"
              required
              className={styles.input}
              value={dateTo}
              onChange={(event) => {
                invalidate();
                setDateTo(event.target.value);
              }}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="search-import-type">Søgetype i CSV-eksporten</label>
            <select
              id="search-import-type"
              className={styles.input}
              value={searchType}
              onChange={(event) => {
                invalidate();
                setSearchType(event.target.value as SearchConsoleReport["searchType"]);
              }}
            >
              {(["web", "image", "video", "news", "discover", "provider_default"] as const).map(
                (type) => (
                  <option key={type} value={type}>
                    {searchTypeLabel(type)}
                  </option>
                ),
              )}
            </select>
          </div>
          {mode === "file" && (
            <div className={styles.field}>
              <label htmlFor="search-import-file">Rapportfil · JSON eller CSV · højst 2 MB</label>
              <input
                id="search-import-file"
                type="file"
                accept=".json,.csv,.txt,application/json,text/csv"
                required
                className={styles.input}
                onChange={(event) => {
                  invalidate();
                  setFile(event.target.files?.[0] ?? null);
                }}
              />
            </div>
          )}
        </div>
        {mode === "paste" && (
          <div className={styles.field}>
            <label htmlFor="search-import-text">Indsæt JSON- eller CSV-rapport · højst 2 MB</label>
            <textarea
              id="search-import-text"
              required
              rows={8}
              spellCheck={false}
              maxLength={SEARCH_CONSOLE_MAX_BYTES}
              className={`${styles.input} w-full resize-y font-mono`}
              value={pasted}
              onChange={(event) => {
                invalidate();
                setPasted(event.target.value);
              }}
            />
          </div>
        )}
        <p className={styles.note}>
          CSV: vælg samme periode og søgetype som i Search Console. Eksportér uden land-, enheds-,
          side- eller forespørgselsfiltre. JSON bruger sine egne datoer. En enkelt tabel erstatter
          rapporten med den tabel; den flettes ikke med ældre filer.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy !== null} className={styles.button}>
            {busy === "preview" ? "Kontrollerer fil…" : "Forhåndsvis fil"}
          </button>
          {syncConfigured && (
            <button
              type="button"
              disabled={busy !== null}
              className={styles.button}
              onClick={() => void post("sync")}
            >
              {busy === "sync" ? "Henter rapport…" : "Hent ny rapport fra Windsor"}
            </button>
          )}
        </div>
      </form>
      {!syncConfigured && (
        <p className={`${styles.sectionCopy} mt-4`}>
          Serverens løbende forbindelse er ikke konfigureret. Filimport virker uafhængigt af
          forbindelsen til chatten.
        </p>
      )}
      <noscript>
        <p className={styles.notice}>
          Filens forhåndsvisning kræver JavaScript. Den gemte rapport og linket til Search Console
          kan stadig læses.
        </p>
      </noscript>
      {preview && (
        <section
          className="mt-6 rounded-lg border border-[color:var(--growth-line)] bg-[var(--growth-paper)] p-4"
          aria-labelledby="search-preview-title"
        >
          <h3 id="search-preview-title" className="text-base font-semibold">
            Valideret forhåndsvisning
          </h3>
          <p className={styles.sectionCopy}>
            sc-domain:kestro.dk · {formatDate(preview.dateFrom, "da")}–
            {formatDate(preview.dateTo, "da")} · {searchTypeLabel(preview.searchType)}
          </p>
          <p className={styles.sectionCopy}>
            {preview.queries.length} søgefraser · {preview.pages.length} sider ·{" "}
            {preview.daily.length} dagsrækker.{" "}
            {preview.totals
              ? `${preview.totals.clicks.toLocaleString("da-DK")} samlede klik.`
              : "Samlet ejendomstal mangler og vises som —."}
          </p>
          <p className={`${styles.note} mt-4`}>
            {preview.partial
              ? "Rapporten er markeret som delvis. En tabelsum vises aldrig som ejendommens samlede resultat."
              : "Synlige søgefraser kan stadig mangle anonymiserede forespørgsler, også når rapporten ikke er markeret delvis."}
          </p>
          {preview.queries.length > 0 && (
            <ul className="mt-4 grid gap-2 text-sm" aria-label="Eksempel på importerede søgefraser">
              {preview.queries.slice(0, 3).map((row) => (
                <li key={row.query} className="break-words">
                  {row.query} · {row.clicks} klik / {row.impressions} visninger
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton} mt-5`}
            disabled={busy !== null || saved}
            onClick={() => void post("save")}
          >
            {busy === "save" ? "Gemmer rapport…" : saved ? "Rapport gemt" : "Gem denne rapport"}
          </button>
        </section>
      )}
      <p role="status" aria-live="polite" className={`${styles.status} mt-4`}>
        {status}
      </p>
      {error && (
        <p role="alert" className={`${styles.error} mt-4`}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
