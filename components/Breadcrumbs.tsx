import Link from "next/link";
import BreadcrumbSchema, { type Crumb } from "./BreadcrumbSchema";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * The visible trail and the marked-up one, from the same list.
 *
 * The hub and top-level pages carried neither: 30 of 112 pages had no
 * BreadcrumbList, and they were the parents of the pages that did. Marking up
 * a trail a page does not show is the kind of structured data that does not
 * represent the page, so the fix has to be both at once — which is what this
 * component is for.
 *
 * "Forside" is added here rather than passed in, so no caller can forget it
 * and no caller can spell it differently.
 */
export default function Breadcrumbs({
  lang,
  trail,
  className = "",
}: {
  lang: Lang;
  trail: Crumb[];
  className?: string;
}) {
  const home = { name: lang === "da" ? "Forside" : "Home", href: "/" };
  const crumbs = [home, ...trail];

  return (
    <>
      <BreadcrumbSchema lang={lang} trail={trail} />
      <nav
        aria-label={lang === "da" ? "Brødkrumme" : "Breadcrumb"}
        className={`text-sm text-paper/55 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-x-2">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-x-2">
                {last ? (
                  <span aria-current="page" className="text-paper/80">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={localePath(crumb.href, lang)}
                    className="inline-flex min-h-[32px] items-center transition hover:text-paper"
                  >
                    {crumb.name}
                  </Link>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-paper/30">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
