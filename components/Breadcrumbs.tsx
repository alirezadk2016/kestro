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
        className={`text-sm text-ink-600 ${className}`}
      >
        {/* One line. The current page's name is the h1 right below, so when
            it is long (a guide title) it is truncated with an ellipsis rather
            than wrapping the trail onto a second line on a phone. */}
        <ol className="flex min-w-0 items-center gap-x-2">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li
                key={crumb.href}
                className={`flex items-center gap-x-2 ${last ? "min-w-0" : "flex-none"}`}
              >
                {last ? (
                  <span aria-current="page" className="truncate text-ink-800">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={localePath(crumb.href, lang)}
                    className="inline-flex min-h-[44px] items-center transition hover:text-ink-900"
                  >
                    {crumb.name}
                  </Link>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-ink-500">
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
