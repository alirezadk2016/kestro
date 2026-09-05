/**
 * Who a visit belongs to, without putting anything on the visitor's device.
 *
 * Counting a refresh as a second visit, showing who is reading right now, or
 * saying how long somebody stayed all need one thing: telling two requests
 * apart. The usual answer is a cookie or an id in localStorage — and the
 * privacy policy on this site says, in both languages, that nothing of ours is
 * written to or read from the visitor's browser. That sentence is worth more
 * than the feature, so the identifier is derived on the server and never
 * leaves it.
 *
 * The derivation is a hash of the address, the user agent and a random salt
 * that is regenerated every day and deleted the day after. Within a day the
 * same browser hashes to the same value, which is all the panel needs. Once
 * the salt is gone the hash cannot be tied back to an address by anyone,
 * ourselves included — so yesterday's rows are anonymous rather than merely
 * pseudonymous. This is the construction Plausible uses, for the same reason.
 *
 * The raw address is never stored, never logged, and never leaves the request
 * that computed the hash.
 */
import { createHash } from "node:crypto";

export function visitorId(ip: string, agent: string, salt: string): string {
  return createHash("sha256").update(`${salt}|${ip}|${agent}`).digest("hex").slice(0, 32);
}

/**
 * The client address, as the proxy in front of us reports it.
 *
 * x-forwarded-for is a chain when several proxies are involved, and the client
 * is its first entry. x-real-ip is read as a fallback so this also works
 * behind a host that sets only that one.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "";
}

/*
 * Where a visit came from.
 *
 * Matched on the referring host rather than the whole URL, because one service
 * arrives under many names: Instagram sends traffic from l.instagram.com when
 * a link is tapped inside the app and from instagram.com on the web, Google
 * from a dozen country domains, and a link shared on X arrives from t.co.
 * Folding them together is the difference between "Instagram: 14" and four
 * rows that each mean Instagram.
 *
 * The list is ordered and the first match wins, so a specific host can be
 * written above a general one.
 */
const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)ecosia\.org$/, "Ecosia"],
  [/(^|\.)yahoo\./, "Yahoo"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.me$/, "Facebook"],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, "LinkedIn"],
  [/(^|\.)t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, "X"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, "YouTube"],
  [/(^|\.)pinterest\./, "Pinterest"],
  [/(^|\.)reddit\.com$/, "Reddit"],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
];

/** A link the visitor followed from elsewhere, folded to a service name. */
export function classifySource(referrer: string | null, host: string): string {
  if (!referrer) return "Direkte";

  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return "Direkte";
  }

  /* A link from one of our own pages is not a source — it is the same visitor
     still being here. Client-side navigation reports the previous page. */
  const bare = host.replace(/^www\./, "");
  if (url.hostname === bare || url.hostname === `www.${bare}`) return "Direkte";

  const known = SOURCES.find(([pattern]) => pattern.test(url.hostname))?.[1];
  /* Anything else keeps its own name, minus the www. An unknown referrer is
     more useful named than lumped into "other". */
  return known ?? url.hostname.replace(/^www\./, "");
}

/**
 * A campaign's own claim about where it came from, which beats the referrer.
 *
 * A link in an Instagram story or a newsletter often arrives with no referrer
 * at all — the app strips it — so utm_source is the only thing that knows.
 * The query string comes from the page the visitor is on, not from the
 * request to this endpoint — the tracking call carries no campaign of its own.
 *
 * Capped and stripped of everything but letters, digits, spaces, dots and
 * dashes, so the column cannot be filled with a sentence by whoever wrote the
 * link. The letter range is written out rather than using a Unicode property
 * escape, because this file is compiled for the ES5 target the project sets.
 */
export function campaignSource(search: string): string | null {
  const utm = new URLSearchParams(search).get("utm_source");
  if (!utm) return null;
  const clean = utm.replace(/[^0-9A-Za-zÀ-ÿ .-]/g, "").trim().slice(0, 40);
  if (!clean) return null;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Three buckets, from the user agent.
 *
 * Not a device database: the question the panel answers is whether the site is
 * being read on a phone, and that is one regular expression. Anything finer
 * would be a dependency needing updates forever to tell two phones apart that
 * we would treat identically anyway.
 */
export function deviceOf(agent: string): "Mobil" | "Tablet" | "Computer" {
  if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(agent)) return "Tablet";
  if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(agent)) return "Mobil";
  return "Computer";
}

/** Obvious automated traffic, kept out of the numbers. */
export function isBot(agent: string): boolean {
  return /bot|crawl|spider|slurp|headless|preview|lighthouse|monitor|curl|wget|python-requests/i.test(
    agent,
  );
}
