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
    <section className="border-t border-ink-200 py-10 sm:py-20">
      <Container>
        <div className="max-w-6xl">
          <p className="eyebrow text-brand-700">{heading[lang]}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={localePath(link.href, lang)}
                  className="plate-sm inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-semibold text-ink-800 transition hover:text-ink-900"
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
