/**
 * Whether the visitor has accepted statistics.
 *
 * Denmark follows the ePrivacy rule that anything beyond what the site needs
 * to work requires consent *before* it is set — so the default is "no", and
 * the answer is kept in localStorage rather than in a cookie: a cookie would
 * itself be sent to the server on every request for no reason.
 *
 * Withdrawal has to be as easy as giving, which is why the footer carries a
 * link that reopens the banner and why `clearConsent` exists at all.
 */
export type Consent = "granted" | "denied";

const KEY = "kestro-consent";
export const CONSENT_EVENT = "kestro-consent-change";

/** The stored answer, or null if the visitor has not been asked yet. */
export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    /* Private mode, or storage blocked. Treated as "not asked". */
    return null;
  }
}

export function writeConsent(value: Consent): void {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* If it cannot be stored, the banner comes back next visit. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Forget the answer, so the banner asks again. */
export function clearConsent(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* Nothing to clear. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
