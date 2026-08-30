import Link from "next/link";
import Container from "./Container";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * "Where to go next", on a commercial page.
 *
 * Step 3 measured the internal linking and found it was the menu and almost
 * nothing else: the pages carrying the most important keywords had one
 * incoming link each. This is the other half of the fix — the guide links
 * forward to the page that sells, and the page that sells links back to the
 * guide that answers the objection.
 */
export type RelatedLink = { href: string; label: { da: string; en: string } };

export default function RelatedLinks({
  lang,
  links,
  title,
}: {
  lang: Lang;
  links: RelatedLink[];
  title?: { da: string; en: string };
}) {
  if (links.length === 0) return null;
  const heading = title ?? { da: "Videre herfra", en: "Where to go next" };

  return (
    <section className="border-t border-white/10 py-10 sm:py-16">
      <Container>
        <div className="max-w-6xl">
          <p className="eyebrow text-brand-300">{heading[lang]}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={localePath(link.href, lang)}
                  className="inline-flex min-h-[44px] items-center gap-2 border border-white/10 px-5 text-sm font-semibold text-paper/80 transition hover:border-white/25 hover:text-paper"
                >
                  {link.label[lang]}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
