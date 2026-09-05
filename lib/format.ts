/**
 * Small formatters shared by the panel's server and client components.
 *
 * They live outside both because the live section renders once on the server
 * and then re-renders itself in the browser from polled JSON — and a number
 * that is formatted one way on the first paint and another way on the first
 * update is a flicker the reader will notice even if they cannot say why.
 */

/** Seconds as something read at a glance: 0:47, 3:12, 1:04:30. */
export function duration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 1) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export const decimal = (n: number) => n.toLocaleString("da-DK");

/*
 * A country code as a name.
 *
 * Intl rather than a table maintained by hand: the runtime already ships every
 * name in Danish, and a hand-written list would be incomplete the day it was
 * written and wrong a few years later. Constructed once and wrapped, because a
 * runtime built without full ICU has the class but not the data — and a
 * missing country name should show the code, not break the panel.
 */
let regions: Intl.DisplayNames | null = null;
try {
  regions = new Intl.DisplayNames(["da"], { type: "region" });
} catch {
  regions = null;
}

export function countryName(code: string | null): string {
  if (!code || code === "??") return "Ukendt";
  try {
    return regions?.of(code) ?? code;
  } catch {
    return code;
  }
}

/** The two letters as the regional-indicator pair that renders as a flag. */
export function flag(code: string | null): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return "";
  const up = code.toUpperCase();
  return String.fromCodePoint(127397 + up.charCodeAt(0), 127397 + up.charCodeAt(1));
}
