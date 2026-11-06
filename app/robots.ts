import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";

/*
 * robots.txt.
 *
 * Everything is open, and the wildcard already said so — a named agent with no
 * rule of its own falls through to `*`, so GPTBot and the rest were never
 * blocked. They are named anyway, for two reasons.
 *
 * The first is that silence is ambiguous to a person reading the file. A site
 * that wants to be quoted by an assistant and a site that has not thought about
 * it look identical under a bare wildcard, and the difference matters enough to
 * write down: these pages answer questions, and being the page an assistant
 * cites is worth as much here as being the result a search engine ranks.
 *
 * The second is that an explicit rule is harder to lose. A later edit that
 * narrows `*` — a staging fence, a crawl-budget experiment — takes the
 * assistants with it silently. A named Allow survives that edit and makes the
 * removal a decision somebody has to type.
 *
 * The training crawlers and the answer crawlers are listed separately because
 * they are not the same bargain. OAI-SearchBot, ClaudeBot, PerplexityBot and
 * Google-Extended fetch a page to answer a question that was just asked, and
 * the answer can carry a citation; GPTBot and CCBot gather corpus. Both are
 * allowed here — a site with no backlinks and no budget cannot afford to turn
 * down being read — but they are kept apart so the choice can be changed for
 * one without touching the other.
 */

/** Fetches a page to answer a question now, and can cite the source. */
const answerAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Amazonbot",
  "cohere-ai",
  "YouBot",
];

/** Gathers text for training corpora. */
const corpusAgents = ["GPTBot", "CCBot", "Meta-ExternalAgent", "Bytespider"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: answerAgents, allow: "/" },
      { userAgent: corpusAgents, allow: "/" },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
