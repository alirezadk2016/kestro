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
export const GA_MEASUREMENT_ID = "G-5BCBNXTR8T";

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
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
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
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
} as const;
