"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Lang } from "@/lib/i18n";
import { buttonClass } from "@/components/Button";

/** Report values use whole mWh; separators must be consistent groups of three. */
export function parseWholeMWh(value: string): number | null {
  const text = value.trim().replace(/[\u00a0\u202f]/g, " ");
  if (!/^\d+$/.test(text) && !/^\d{1,3}([., ])\d{3}(?:\1\d{3})*$/.test(text)) {
    return null;
  }
  const number = Number(text.replace(/[., ]/g, ""));
  return Number.isSafeInteger(number) && number > 0 && number <= 10_000_000 ? number : null;
}

/** Kept above 100% when the report says so; the UI explains the discrepancy. */
export function calculateReportedCapacity(design: number, full: number): number | null {
  if (!Number.isFinite(design) || !Number.isFinite(full) || design <= 0 || full <= 0) {
    return null;
  }
  const percentage = (full / design) * 100;
  return Number.isFinite(percentage) && percentage > 0 ? percentage : null;
}

export function parseRamGigabytes(value: string): number | null {
  const text = value.trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(text)) return null;
  const number = Number(text.replace(",", "."));
  return Number.isFinite(number) && number <= Number.MAX_SAFE_INTEGER ? number : null;
}

export function calculateRamUsage(total: number, used: number) {
  if (!Number.isFinite(total) || !Number.isFinite(used) || total <= 0 || used < 0 || used > total) {
    return null;
  }
  return { percentage: (used / total) * 100, free: total - used };
}

const copy = {
  da: {
    battery: {
      legend: "Tallene fra din batterirapport",
      lead: "Brug værdierne fra samme batteri i mWh.",
      labels: ["Design Capacity", "Full Charge Capacity"],
      hints: ["Kapaciteten fra nyt.", "Rapporteret kapacitet ved fuld opladning."],
      placeholders: ["Fx 50000", "Fx 40000"],
      format: "Hele mWh: 50000, 50.000, 50,000 eller 50 000. 50 Wh = 50.000 mWh.",
      submit: "Beregn kapacitet",
      errors: [
        "Indtast en positiv, hel mWh-værdi uden enhed.",
        "Indtast en positiv, hel mWh-værdi uden enhed.",
      ],
      unit: "mWh",
      resultLabel: "Rapporteret kapacitet",
      resultSuffix: "af designkapaciteten",
      resultNote: "Beregnet fra dine tal. Det er ikke den aktuelle opladning eller en diagnose.",
      above:
        "Over 100 %: kontrollér samme batteri og enhed. Rapportens estimater kan afvige; resultatet er ikke begrænset kunstigt.",
      empty: "Din kapacitet vises her, når du har indtastet begge tal.",
      method: "Full Charge Capacity ÷ Design Capacity × 100",
    },
    ram: {
      legend: "RAM-forbruget lige nu",
      lead: "Brug tallene fra Jobliste → Ydeevne → Hukommelse.",
      labels: ["Samlet brugbar RAM", "RAM i brug"],
      hints: ["Den brugbare mængde, som systemet viser.", "Aflæs forbruget på samme tidspunkt."],
      placeholders: ["Fx 16", "Fx 10,5"],
      format: "Begge tal skal være i GB. Punktum og komma accepteres som decimaltegn.",
      submit: "Beregn forbruget",
      errors: [
        "Indtast samlet brugbar RAM over 0 GB.",
        "Indtast et tal mellem 0 og din samlede RAM.",
      ],
      unit: "GB",
      resultLabel: "RAM i brug",
      resultSuffix: "af den oplyste brugbare RAM",
      resultNote:
        "Et øjebliksbillede af forbruget. Det måler ikke RAM-hastighed eller behovet for en opgradering.",
      above: "",
      empty: "Dit forbrug og den ledige RAM vises her efter beregningen.",
      method: "RAM i brug ÷ samlet brugbar RAM × 100",
    },
    result: "Dit resultat",
    changed: "Tallene er ændret. Beregn igen for at se et nyt resultat.",
    invalid: "Kontrollér de markerede felter, og beregn igen.",
    local: "Beregnes på din enhed. Tallene sendes ikke til Kestro.",
    free: "GB ledig RAM",
    formula: "Formel",
    noScript: "Beregneren kræver JavaScript. Du kan beregne manuelt:",
  },
  en: {
    battery: {
      legend: "Values from your battery report",
      lead: "Use values from the same battery, in mWh.",
      labels: ["Design Capacity", "Full Charge Capacity"],
      hints: ["The capacity when new.", "Reported capacity when fully charged."],
      placeholders: ["E.g. 50000", "E.g. 40000"],
      format: "Whole mWh: 50000, 50,000, 50.000 or 50 000. 50 Wh = 50,000 mWh.",
      submit: "Calculate capacity",
      errors: [
        "Enter a positive, whole mWh value without the unit.",
        "Enter a positive, whole mWh value without the unit.",
      ],
      unit: "mWh",
      resultLabel: "Reported capacity",
      resultSuffix: "of design capacity",
      resultNote: "Calculated from your values. This is not the current charge or a diagnosis.",
      above:
        "Above 100%: check that both values use the same battery and unit. Report estimates can differ; the result has not been capped.",
      empty: "Your capacity appears here once you enter both values and calculate.",
      method: "Full Charge Capacity ÷ Design Capacity × 100",
    },
    ram: {
      legend: "Your RAM usage right now",
      lead: "Use Task Manager → Performance → Memory.",
      labels: ["Total usable RAM", "RAM in use"],
      hints: ["The usable amount shown by your system.", "Read the usage at the same time."],
      placeholders: ["E.g. 16", "E.g. 10.5"],
      format: "Use GB for both values. A dot or comma is accepted as a decimal separator.",
      submit: "Calculate usage",
      errors: ["Enter total usable RAM above 0 GB.", "Enter a value between 0 and your total RAM."],
      unit: "GB",
      resultLabel: "RAM in use",
      resultSuffix: "of the usable RAM you entered",
      resultNote:
        "A snapshot of usage. This does not measure RAM speed or determine whether an upgrade is needed.",
      above: "",
      empty: "Your usage and free RAM appear here after you calculate.",
      method: "RAM in use ÷ total usable RAM × 100",
    },
    result: "Your result",
    changed: "The values have changed. Calculate again to see a new result.",
    invalid: "Check the highlighted fields and calculate again.",
    local: "Calculated on your device. Your values are not sent to Kestro.",
    free: "GB of free RAM",
    formula: "Formula",
    noScript: "The calculator needs JavaScript. To calculate manually:",
  },
};

type ToolKind = "battery" | "ram";
type Calculation = { percentage: number; free?: number };

function CapacityTool({ lang, kind }: { lang: Lang; kind: ToolKind }) {
  const c = copy[lang];
  const t = c[kind];
  const id = useId();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [values, setValues] = useState(["", ""]);
  const [errors, setErrors] = useState<boolean[]>([false, false]);
  const [result, setResult] = useState<Calculation | null>(null);
  const [state, setState] = useState<"idle" | "dirty" | "invalid" | "valid">("idle");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const number = new Intl.NumberFormat(lang === "da" ? "da-DK" : "en-GB", {
    maximumFractionDigits: 1,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = values.map(kind === "battery" ? parseWholeMWh : parseRamGigabytes);
    const invalid = [
      parsed[0] === null || parsed[0] <= 0,
      parsed[1] === null || (kind === "ram" && parsed[0] !== null && parsed[1] > parsed[0]),
    ];
    setErrors(invalid);
    setResult(null);
    if (invalid.some(Boolean)) {
      setState("invalid");
      inputRefs.current[invalid.findIndex(Boolean)]?.focus();
      return;
    }
    const first = parsed[0] as number;
    const second = parsed[1] as number;
    const calculation =
      kind === "battery"
        ? { percentage: calculateReportedCapacity(first, second) as number }
        : calculateRamUsage(first, second);
    if (!calculation || !Number.isFinite(calculation.percentage)) {
      setErrors([true, true]);
      setState("invalid");
      inputRefs.current[0]?.focus();
      return;
    }
    setResult(calculation);
    setState("valid");
  }

  function edit(index: number, value: string) {
    setValues((current) => current.map((existing, field) => (field === index ? value : existing)));
    setErrors([false, false]);
    setResult(null);
    setState((current) => (current === "idle" ? "idle" : "dirty"));
  }

  return (
    <div className="sheet overflow-hidden text-ink-900">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <form noValidate onSubmit={submit} className="min-w-0 p-6 sm:p-8 lg:p-10">
          <fieldset>
            <legend className="text-lg font-semibold tracking-tight">{t.legend}</legend>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.lead}</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {t.labels.map((label, index) => (
                <div key={label} className="min-w-0">
                  <label htmlFor={`${id}-value-${index}`} className="block text-sm font-semibold">
                    {label}
                  </label>
                  <div className="relative mt-2">
                    <input
                      ref={(input) => {
                        inputRefs.current[index] = input;
                      }}
                      id={`${id}-value-${index}`}
                      type="text"
                      inputMode={kind === "battery" ? "numeric" : "decimal"}
                      autoComplete="off"
                      spellCheck={false}
                      required
                      value={values[index]}
                      placeholder={t.placeholders[index]}
                      aria-invalid={errors[index] || undefined}
                      aria-describedby={`${id}-hint-${index} ${id}-format${errors[index] ? ` ${id}-error-${index}` : ""}`}
                      onChange={(event) => edit(index, event.target.value)}
                      className="min-h-[52px] w-full min-w-0 rounded-lg border border-ink-300 bg-paper py-3 pl-4 pr-14 text-base tabular-nums text-ink-900 placeholder:text-ink-600 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 aria-[invalid=true]:border-red-700"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-ink-600"
                    >
                      {t.unit}
                    </span>
                  </div>
                  <p
                    id={`${id}-hint-${index}`}
                    className="mt-2 text-xs leading-relaxed text-ink-600"
                  >
                    {t.hints[index]}
                  </p>
                  {errors[index] && (
                    <p
                      id={`${id}-error-${index}`}
                      className="mt-2 text-sm leading-relaxed text-red-800"
                    >
                      {t.errors[index]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p id={`${id}-format`} className="mt-5 text-xs leading-relaxed text-ink-600">
              {t.format}
            </p>
            <button
              type="submit"
              disabled={!ready}
              className={`${buttonClass("primary", "lg")} mt-6 w-full focus-visible:ring-offset-white disabled:cursor-wait disabled:opacity-65 sm:w-auto`}
            >
              {t.submit}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-ink-600">{c.local}</p>
            <noscript>
              <p className="mt-4 text-sm text-ink-700">
                {c.noScript} {t.method}.
              </p>
            </noscript>
          </fieldset>
        </form>
        <div className="flex min-w-0 flex-col justify-between border-t border-paper-edge bg-paper-dim p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div role="status" aria-live="polite" aria-atomic="true">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
              {c.result}
            </p>
            {result ? (
              <>
                <p className="mt-6 text-sm font-medium text-ink-700">{t.resultLabel}</p>
                <p className="t-h1 mt-2 break-words tabular-nums text-brand-700 [overflow-wrap:anywhere]">
                  {number.format(result.percentage)}
                  <span className="ml-1 text-2xl">%</span>
                </p>
                <p className="mt-2 text-sm text-ink-600">{t.resultSuffix}</p>
                {result.free !== undefined && (
                  <p className="mt-5 font-semibold tabular-nums">
                    {number.format(result.free)} {c.free}
                  </p>
                )}
                {kind === "battery" && result.percentage > 100 && (
                  <p className="mt-5 text-sm leading-relaxed text-ink-700">{t.above}</p>
                )}
              </>
            ) : (
              <>
                <p aria-hidden="true" className="t-h1 mt-6 text-ink-300">
                  —<span className="ml-1 text-2xl">%</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-700">
                  {state === "dirty" ? c.changed : state === "invalid" ? c.invalid : t.empty}
                </p>
              </>
            )}
          </div>
          <div className="mt-8">
            <p className="text-sm leading-relaxed text-ink-600">{t.resultNote}</p>
            <p className="mt-5 border-t border-ink-200 pt-5 text-xs leading-relaxed text-ink-600">
              <span className="font-semibold">{c.formula}: </span>
              {t.method}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BatteryCapacityTool({ lang }: { lang: Lang }) {
  return <CapacityTool lang={lang} kind="battery" />;
}

export function RamUsageTool({ lang }: { lang: Lang }) {
  return <CapacityTool lang={lang} kind="ram" />;
}
