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
import type { AcquisitionChannel, AttributionEvidence } from "@/lib/insights-types";

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
  /*
   * Not the left-most x-forwarded-for.
   *
   * That entry is whatever the CLIENT sent; every proxy in the chain only
   * appends to it. So a caller who rotates the header gets a different
   * visitor hash on every request, and "visitors" becomes a number anybody
   * can set. app/api/kontakt/route.ts worked this out and wrote it down —
   * "eight requests with the header rotated all returned 200" — and fixed its
   * own rate-limit key; this path kept the original and the same spoof.
   *
   * Vercel sets x-vercel-forwarded-for itself and overwrites anything that
   * arrived under that name, so it is the one to trust. Failing that the
   * right hop is the RIGHT-most entry: the one our own proxy appended.
   */
  const vercel = headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel;

  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;

  const chain = headers.get("x-forwarded-for");
  if (chain) {
    const hops = chain
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  return "";
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
  [/(^|\.)google\.(?:com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)ecosia\.org$/, "Ecosia"],
  [/(^|\.)yahoo\.(?:com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/, "Yahoo"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.me$/, "Facebook"],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, "LinkedIn"],
  [/(^|\.)t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, "X"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, "YouTube"],
  [/(^|\.)pinterest\.(?:com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/, "Pinterest"],
  [/(^|\.)reddit\.com$/, "Reddit"],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
];

/** A link the visitor followed from elsewhere, folded to a service name. */
export function classifySource(referrer: string | null, host: string): string {
  if (!referrer) return "Direkte / ukendt";

  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return "Direkte / ukendt";
  }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) return "Direkte / ukendt";

  /* A link from one of our own pages is not a source — it is the same visitor
     still being here. Client-side navigation reports the previous page. */
  const bare = host.toLowerCase().replace(/^www\./, "");
  if (url.hostname === bare || url.hostname === `www.${bare}`) return "Direkte / ukendt";

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
  const source = readCampaignTags(search).source;
  return source ? canonicalSource(source) : null;
}

export type CampaignTags = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
};

export type VisitAttribution = CampaignTags & {
  source: string;
  channel: AcquisitionChannel;
  referrerHost: string | null;
  method: AttributionEvidence;
};

/** Campaign labels, never arbitrary query parameters, URLs or identifiers. */
function campaignLabel(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[^0-9A-Za-zÀ-ÿ ._-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
  return cleaned || null;
}

/** Useful in server-side tools. The tracker independently applies this allowlist. */
export function readCampaignTags(search: string): CampaignTags {
  const params = new URLSearchParams(search);
  return {
    source: campaignLabel(params.get("utm_source"), 40),
    medium: campaignLabel(params.get("utm_medium"), 40),
    campaign: campaignLabel(params.get("utm_campaign"), 80),
    content: campaignLabel(params.get("utm_content"), 80),
    term: campaignLabel(params.get("utm_term"), 80),
  };
}

function canonicalSource(source: string): string {
  const aliases: Record<string, string> = {
    google: "Google",
    bing: "Bing",
    duckduckgo: "DuckDuckGo",
    ecosia: "Ecosia",
    yahoo: "Yahoo",
    ig: "Instagram",
    instagram: "Instagram",
    fb: "Facebook",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    twitter: "X",
    x: "X",
    tiktok: "TikTok",
    youtube: "YouTube",
    pinterest: "Pinterest",
    reddit: "Reddit",
    chatgpt: "ChatGPT",
    perplexity: "Perplexity",
    claude: "Claude",
  };
  return aliases[source.toLowerCase()] ?? source.charAt(0).toUpperCase() + source.slice(1);
}

/** A channel describes available evidence; Google by itself never means paid. */
function channelFor(
  source: string,
  medium: string | null,
  referrerHost: string | null,
): AcquisitionChannel {
  const value = medium?.toLowerCase().replace(/[ -]+/g, "_") ?? "";
  if (
    ["cpc", "ppc", "paid", "paid_search", "paid_social", "display", "cpm", "retargeting"].includes(
      value,
    )
  )
    return "paid";
  if (["email", "e_mail", "newsletter"].includes(value)) return "email";
  if (["Google", "Bing", "DuckDuckGo", "Ecosia", "Yahoo"].includes(source)) return "search";
  if (
    ["Instagram", "Facebook", "LinkedIn", "X", "TikTok", "YouTube", "Pinterest", "Reddit"].includes(
      source,
    )
  )
    return "social";
  if (["organic", "organic_search", "search"].includes(value)) return "search";
  if (["social", "organic_social"].includes(value)) return "social";
  if (value === "referral" || referrerHost) return "referral";
  if (source === "Direkte / ukendt") return "direct_unknown";
  return "other";
}

/**
 * Resolve independently on the server. Tags declare a link's campaign, a
 * referrer identifies a sending host, and absence proves neither a direct
 * visit nor a particular app surface such as Instagram Explore.
 */
export function resolveAttribution(
  tags: unknown,
  referrer: unknown,
  host: string,
): VisitAttribution {
  const input =
    typeof tags === "object" && tags !== null && !Array.isArray(tags)
      ? (tags as Record<string, unknown>)
      : {};
  const sourceTag = campaignLabel(input.source, 40);
  const medium = campaignLabel(input.medium, 40)?.toLowerCase() ?? null;
  const campaign = campaignLabel(input.campaign, 80);
  const content = campaignLabel(input.content, 80);
  const term = campaignLabel(input.term, 80);
  const raw = typeof referrer === "string" ? referrer.slice(0, 2048) : null;
  const referredSource = classifySource(raw, host);
  let referrerHost: string | null = null;
  if (referredSource !== "Direkte / ukendt" && raw) {
    try {
      referrerHost = new URL(raw).hostname.replace(/^www\./, "").slice(0, 253);
    } catch {
      /* absent */
    }
  }
  const source = sourceTag ? canonicalSource(sourceTag) : referredSource;
  return {
    source,
    medium,
    campaign,
    content,
    term,
    referrerHost,
    channel: channelFor(source, medium, referrerHost),
    method: sourceTag ? "utm" : referrerHost ? "referrer" : "unknown",
  };
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
