/**
 * What the account says back, and — more importantly — when it says nothing.
 *
 * Kept apart from the webhook route on purpose. The route is transport: a
 * signature, a payload, an HTTP call. This is the editorial decision about
 * which comments a machine is allowed to answer on behalf of a company, and
 * that is the part worth being able to read, change and argue with on its own.
 *
 * The rule the whole file exists to enforce: an automatic reply is only ever
 * sent to a comment that is unmistakably praise and asks for nothing. Anything
 * that is a question, anything that is unhappy, and anything the classifier is
 * not sure about is left alone and forwarded to a person. A bot that answers
 * "tak!" to a complaint is worse than no bot, and on a B2B account the damage
 * is public and permanent.
 */

export type Verdict = "praise" | "question" | "negative" | "unknown";

/** Reply language. The account is Danish; English is offered because the site
 *  is, and a reply in the wrong language reads as a machine either way. */
export type ReplyLang = "da" | "en";

/*
 * Word lists, not sentiment scoring.
 *
 * A model would be more accurate on average and worse where it matters: its
 * mistakes are unpredictable, and the cost of one wrong "tak for de pæne ord"
 * under an angry comment is not worth the coverage it buys. A list is dull,
 * auditable, and fails towards silence — which is the safe direction here.
 *
 * Everything is matched on a lowercased, accent-preserved string, so the
 * Danish letters have to be written out as they are actually typed.
 */

/** Checked first, and it wins outright. "super dårlig service" contains a
 *  praise word; reading the praise word first would thank someone for an
 *  insult. Order is the whole safety property. */
const NEGATIVE = [
  "dårlig", "daarlig", "elendig", "skuffet", "skuffende", "svindel", "fusk",
  "bedrag", "utilfreds", "klage", "problem", "virker ikke", "aldrig mere",
  "spild", "dyrt", "for dyr", "advarsel", "pas på",
  "bad", "worst", "terrible", "awful", "scam", "fraud", "refund", "disappointed",
  "waste", "never again", "rip off", "ripoff", "avoid",
];

/** Checked second. Anything asking for something needs a person, even when it
 *  is asked warmly — "fedt! hvad koster den?" is a sales lead, not applause. */
const QUESTION = [
  "hvor", "hvad", "hvornår", "hvornaar", "hvilken", "hvilke", "hvordan",
  "kan i", "har i", "kunne i", "må jeg", "pris", "koster", "tilbud", "levering",
  "sælger i", "saelger i", "garanti", "kontakt", "skriv til mig", "dm",
  "how", "what", "when", "which", "where", "price", "cost", "quote", "shipping",
  "do you", "can you", "could you", "available", "warranty", "interested",
];

/** Checked last, and only reached when nothing above matched. */
const PRAISE = [
  "fed", "fedt", "flot", "flotte", "lækker", "laekker", "nice", "sejt", "sej",
  "godt", "god", "super", "perfekt", "skarpt", "skarp", "elsker", "dejlig",
  "spændende", "spaendende", "respekt", "wow", "tillykke",
  "great", "awesome", "beautiful", "love", "lovely", "excellent", "perfect",
  "brilliant", "amazing", "clean", "sharp", "well done", "congrats",
];

/** Emoji that carry approval on their own, for the comment that is only that. */
const PRAISE_EMOJI = ["👏", "🔥", "❤️", "❤", "😍", "👍", "🙌", "💙", "✨", "🤩", "💪"];

/**
 * A word list has to match words.
 *
 * Substring matching turns "god" into a hit inside "godt nok noget skidt", and
 * turns "nice" into a hit inside any word containing it. Word boundaries in
 * JavaScript's \b are ASCII-only and would split "dårlig" at the å, so the
 * boundary is written by hand as "not a letter" using a Unicode property.
 */
function mentions(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${escaped}([^\\p{L}]|$)`, "u").test(haystack);
}

/**
 * What kind of comment this is.
 *
 * Returns "unknown" freely. Everything except "praise" ends up in front of a
 * person, so a wrong "unknown" costs an email and a wrong "praise" costs the
 * brand — the classifier is built to make the first mistake.
 */
export function classify(text: string): Verdict {
  const clean = text.trim().toLowerCase();
  if (!clean) return "unknown";

  if (NEGATIVE.some((word) => mentions(clean, word))) return "negative";

  /* A question mark is a question whatever the words are. */
  if (clean.includes("?") || QUESTION.some((word) => mentions(clean, word))) return "question";

  /* An @mention is someone tagging a colleague, not applause for us — and a
     reply would notify a stranger who never addressed the account. */
  if (clean.includes("@")) return "unknown";

  /* A link is spam far more often than it is praise. */
  if (/https?:\/\/|www\./.test(clean)) return "unknown";

  const words = PRAISE.some((word) => mentions(clean, word));
  const emoji = PRAISE_EMOJI.some((glyph) => clean.includes(glyph));
  if (words || emoji) return "praise";

  return "unknown";
}

/**
 * Which language to answer in.
 *
 * A rough test, and deliberately biased: the account is Danish, so Danish is
 * what an uncertain comment gets. Only a comment with English markers and no
 * Danish ones is answered in English.
 */
export function replyLang(text: string): ReplyLang {
  const clean = text.toLowerCase();
  if (/[æøå]/.test(clean)) return "da";
  const english = ["the", "this", "your", "you", "guys", "looks", "love", "great", "nice", "work"];
  const danish = ["og", "er", "det", "den", "jer", "ser", "godt", "fedt", "tak"];
  const en = english.filter((w) => mentions(clean, w)).length;
  const da = danish.filter((w) => mentions(clean, w)).length;
  return en > da ? "en" : "da";
}

/*
 * The replies.
 *
 * Several, because one sentence repeated under every comment is how a feed
 * announces that nobody is home. None of them claim anything — no promise, no
 * delivery time, no price — because a reply is public and permanent and this
 * one is written by a machine.
 */
const REPLIES: Record<ReplyLang, string[]> = {
  da: [
    "Tak — det sætter vi pris på 🙏",
    "Mange tak for de pæne ord!",
    "Tak skal du have 🙏",
    "Dejligt at høre. Tak!",
    "Tusind tak 🙏",
  ],
  en: [
    "Thank you — much appreciated 🙏",
    "Thanks a lot for the kind words!",
    "Thank you 🙏",
    "Great to hear. Thanks!",
    "Many thanks 🙏",
  ],
};

/**
 * Pick one, by the comment's own id.
 *
 * Deterministic on purpose. Meta re-delivers a webhook it did not get a clean
 * 200 for, and the de-duplication in the route is per-instance and therefore
 * not a guarantee. If a redelivery does slip through, choosing by id means the
 * second attempt composes the identical sentence — so the worst case is the
 * same reply twice, never two different replies arguing under one comment.
 */
export function pickReply(commentId: string, lang: ReplyLang): string {
  const pool = REPLIES[lang];
  let hash = 0;
  for (let i = 0; i < commentId.length; i++) hash = (hash * 31 + commentId.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
}
