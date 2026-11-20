/**
 * Google Analytics 4, behind consent.
 *
 * The measurement ID is public — it ships in the page source of every site
 * that runs GA — so it lives here rather than in an environment variable that
 * would only pretend to be a secret.
 *
 * Nothing in this file loads or sends anything on its own. The tag is only
 * injected once a visitor has accepted statistics (components/Analytics.tsx),
 * and `track` is a no-op until that has happened, so an event fired before
 * consent is dropped rather than queued.
 */
import { readConsent, type Consent } from "./consent";

export const GA_MEASUREMENT_ID = "G-5BCBNXTR8T";

/** Stop an already-loaded tag as soon as the visitor withdraws permission. */
export function syncAnalyticsConsent(consent: Consent | null): void {
  if (typeof window === "undefined") return;
  const granted = consent === "granted";
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = !granted;
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (granted) return;
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    const host = window.location.hostname.split(".");
    for (let index = 0; index < host.length - 1; index++)
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${host.slice(index).join(".")}; SameSite=Lax`;
  }
}

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean | undefined;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Send an event, if there is a tag to send it to.
 *
 * Never pass a name, an email address, a phone number or the content of a
 * message: GA4's terms forbid personal data, and none of it is needed to see
 * which pages produce enquiries.
 */
export function track(event: string, params: GtagParams = {}): void {
  if (
    typeof window === "undefined" ||
    readConsent() !== "granted" ||
    typeof window.gtag !== "function"
  )
    return;
  window.gtag("event", event, params);
}

/** The events this site sends. Kept in one place so the names cannot drift. */
export const events = {
  /** A quote or contact form was accepted by the API. */
  generateLead: "generate_lead",
  /** A click on any of the primary "Få et tilbud" calls to action. */
  quoteCta: "quote_cta_click",
  /** A click on a mailto: link anywhere on the site. */
  emailClick: "email_click",
  /** A click on a tel: link anywhere on the site. */
  phoneClick: "phone_click",
  formStart: "enquiry_form_start",
  formError: "enquiry_form_error",
} as const;
