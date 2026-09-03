import { guides } from "@/lib/guides";
import { teamMember } from "@/lib/company";
import { company } from "@/lib/company";
import { localePath } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";

/*
 * The Danish guide section as an Atom feed.
 *
 * Eight articles that are updated and added to, and until now the only way to
 * learn that one had changed was to visit the page. A feed is the one form of
 * distribution that costs nothing to run and that nobody has to be asked for
 * permission to use — a reader subscribes, an aggregator polls, and neither
 * needs an email address from us.
 *
 * Atom rather than RSS 2.0: dates are RFC 3339 rather than RFC 822, which is
 * the same format lib/guides.ts already stores, and every element is namespaced
 * so there is no ambiguity about what a reader is looking at.
 *
 * Danish only, deliberately. A feed carrying both languages would deliver every
 * article twice to every subscriber, and there is no way for a reader to say
 * which of the two they want. If the English section ever earns its own
 * audience it gets its own feed at its own address.
 *
 * Only the articles: these are the pages with a real publication date and a
 * real author. The commercial pages have neither and would be noise in a
 * reader.
 */

/** Escape the five characters that cannot appear literally in XML text. */
const xml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** A date-only string as the instant Atom requires. */
const stamp = (day: string) => `${day}T00:00:00Z`;

export function GET() {
  const self = `${SITE_ORIGIN}/vejledninger/feed.xml`;
  const index = `${SITE_ORIGIN}${localePath("/vejledninger", "da")}`;

  /* The feed's own timestamp is the newest article's, not the build's. A feed
     that changes its updated stamp on every deploy tells every aggregator that
     everything is new, every time. */
  const newest = guides.reduce((latest, guide) => (guide.updated > latest ? guide.updated : latest), guides[0].updated);

  const entries = guides
    .slice()
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .map((guide) => {
      const url = `${SITE_ORIGIN}${localePath(`/vejledninger/${guide.slug}`, "da")}`;
      const author = teamMember(guide.author);
      return `  <entry>
    <title>${xml(guide.title.da)}</title>
    <link rel="alternate" type="text/html" href="${xml(url)}"/>
    <id>${xml(url)}</id>
    <updated>${stamp(guide.updated)}</updated>
    <published>${stamp(guide.updated)}</published>
    <author><name>${xml(author.name)}</name></author>
    <summary type="text">${xml(guide.metaDescription.da)}</summary>
  </entry>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="da">
  <title>Viden – ${xml(company.name)}</title>
  <subtitle>Vejledninger om refurbished erhvervs-IT, hukommelse, levetid og stand.</subtitle>
  <link rel="self" type="application/atom+xml" href="${xml(self)}"/>
  <link rel="alternate" type="text/html" href="${xml(index)}"/>
  <id>${xml(index)}</id>
  <updated>${stamp(newest)}</updated>
  <rights>© ${new Date(stamp(newest)).getUTCFullYear()} ${xml(company.name)}</rights>
${entries}
</feed>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/atom+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
