import { looksLikeEmail, oneLine } from "./mail-safe";

/** The form and its API share one budget; accepted enquiries are never shortened. */
export const CONTACT_LIMITS = {
  name: 120,
  company: 160,
  email: 200,
  phone: 60,
  message: 5000,
  subject: 160,
  page: 200,
} as const;
export const QUOTE_DETAIL_LIMIT = 120;
export type ContactField = keyof typeof CONTACT_LIMITS | "kind";
export type ContactKind = "contact" | "quote";
type Enquiry = Record<keyof typeof CONTACT_LIMITS, string> & { kind: ContactKind };

export function composeEnquiryMessage(
  message: string,
  specification: readonly (string | null)[] = [],
) {
  const details = specification.filter((line): line is string => line !== null).join("\n");
  return details && message ? `${details}\n\n${message}` : details || message;
}

export function validateContactPayload(
  payload: Record<string, unknown>,
): { ok: true; value: Enquiry } | { ok: false; fields: ContactField[] } {
  const fields: ContactField[] = [];
  const values = {} as Record<keyof typeof CONTACT_LIMITS, string>;
  for (const key of Object.keys(CONTACT_LIMITS) as (keyof typeof CONTACT_LIMITS)[]) {
    const input = payload[key];
    const value = typeof input === "string" ? input.trim() : "";
    if ((input !== undefined && typeof input !== "string") || value.length > CONTACT_LIMITS[key]) {
      fields.push(key);
    }
    values[key] = ["name", "company", "phone", "subject", "page"].includes(key)
      ? oneLine(value)
      : value;
  }
  for (const key of ["name", "message"] as const)
    if (!values[key] && !fields.includes(key)) fields.push(key);
  if (!looksLikeEmail(values.email) && !fields.includes("email")) fields.push("email");
  if (payload.kind !== undefined && payload.kind !== "contact" && payload.kind !== "quote")
    fields.push("kind");
  if (fields.length) return { ok: false, fields };

  // Older open tabs have no explicit kind. Both language versions still classify
  // correctly; new forms use the validated field rather than translated prose.
  const kind: ContactKind =
    payload.kind === "contact" || payload.kind === "quote"
      ? payload.kind
      : /tilbud|quote request/i.test(values.subject) ||
          /^(?:\/da)?\/tilbud\/?$|^\/en\/(?:get-a-quote|tilbud)\/?$/.test(values.page)
        ? "quote"
        : "contact";
  return { ok: true, value: { ...values, kind } };
}
