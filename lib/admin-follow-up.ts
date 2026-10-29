import { enquiryIdValid } from "@/lib/admin-form";

export type EnquiryPriority = "normal" | "high";
export type FollowUpScope = "due" | "overdue" | "upcoming" | "unscheduled" | "all";
export const FOLLOW_UP_SCOPES: FollowUpScope[] = [
  "due",
  "overdue",
  "upcoming",
  "unscheduled",
  "all",
];
export const MAX_BULK_ENQUIRIES = 25;

/** A calendar date in the business's timezone, independent of the host's TZ. */
export function copenhagenToday(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Copenhagen",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (name: string) => parts.find((entry) => entry.type === name)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** Reject rolled-over dates such as 31 February, and do not accept a time. */
export function followUpDateValid(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000"))
    return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Bound the original request before deduplication, including repeated IDs. */
export function bulkEnquiryIds(values: unknown[]): string[] | null {
  if (values.length < 1 || values.length > MAX_BULK_ENQUIRIES || !values.every(enquiryIdValid))
    return null;
  return [...new Set(values as string[])];
}
