import { englishPath } from "@/lib/routes";

export type CampaignLinkInput = {
  destination: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
};

export const campaignPresets = [
  {
    id: "instagram-bio",
    label: "Instagram · bio",
    source: "instagram",
    medium: "social",
    content: "bio",
    term: "",
  },
  {
    id: "instagram-story",
    label: "Instagram · story",
    source: "instagram",
    medium: "social",
    content: "story",
    term: "",
  },
  {
    id: "instagram-reel",
    label: "Instagram · reel",
    source: "instagram",
    medium: "social",
    content: "reel",
    term: "",
  },
  {
    id: "newsletter",
    label: "Nyhedsbrev",
    source: "newsletter",
    medium: "email",
    content: "",
    term: "",
  },
  { id: "google-ads", label: "Google Ads", source: "google", medium: "cpc", content: "", term: "" },
] as const;

const knownPaths = new Set([
  "/",
  "/en",
  ...Object.keys(englishPath),
  ...Object.values(englishPath).map((path) => `/en${path}`),
]);

/** Pure builder. Nothing is stored and no network request is made. */
export function buildCampaignLink(
  input: CampaignLinkInput,
  additionalPaths: readonly string[] = [],
): { url: string; error: string | null } {
  const destination = input.destination.trim();
  if (!destination || destination.length > 600)
    return { url: "", error: "Vælg en offentlig side på kestro.dk." };
  if (destination.startsWith("//") || /[\\\u0000-\u0020]/.test(destination))
    return { url: "", error: "Brug en almindelig Kestro-adresse uden mellemrum." };
  let url: URL;
  try {
    url = new URL(destination, "https://www.kestro.dk");
  } catch {
    return { url: "", error: "Adressen kunne ikke læses." };
  }
  if (
    url.protocol !== "https:" ||
    !["kestro.dk", "www.kestro.dk"].includes(url.hostname) ||
    url.port ||
    url.username ||
    url.password
  )
    return { url: "", error: "Linket skal gå til https://www.kestro.dk." };
  const path = url.pathname.replace(/\/$/, "") || "/";
  if (!knownPaths.has(path) && !additionalPaths.includes(path))
    return {
      url: "",
      error:
        "Vælg en offentlig Kestro-side fra sidens navigation. Admin, filer og ukendte adresser kan ikke bruges.",
    };
  if (url.hash && !/^#[a-z0-9-]{1,100}$/i.test(url.hash))
    return { url: "", error: "Brug et almindeligt sektionsanker eller fjern delen efter #." };
  const fields = [
    ["source", "Kilde", 40],
    ["medium", "Medie", 40],
    ["campaign", "Kampagnenavn", 80],
    ["content", "Placering / variant", 80],
    ["term", "Betalt søgeord", 80],
  ] as const;
  const tags: Partial<Record<(typeof fields)[number][0], string>> = {};
  for (const [key, label, limit] of fields) {
    const value = input[key].trim().replace(/\s+/g, " ");
    if (["source", "medium", "campaign"].includes(key) && !value)
      return { url: "", error: `${label} skal udfyldes.` };
    if (value.length > limit) return { url: "", error: `${label} må højst være ${limit} tegn.` };
    if (value && !/^[0-9A-Za-zÀ-ÿ ._-]+$/.test(value))
      return {
        url: "",
        error: `${label}: brug bogstaver, tal, mellemrum, punktum, bindestreg eller underscore.`,
      };
    if (value) tags[key] = value;
  }
  url.hostname = "www.kestro.dk";
  url.pathname = path;
  // Replace old query parameters instead of carrying unknown values into a public link.
  url.search = "";
  for (const [key] of fields) if (tags[key]) url.searchParams.set(`utm_${key}`, tags[key]!);
  return { url: url.toString(), error: null };
}
