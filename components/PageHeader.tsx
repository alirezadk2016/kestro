import { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import type { Lang } from "@/lib/i18n";

/*
 * The top of a top-level page.
 *
 * It carries the breadcrumb because these are exactly the pages that had
 * none: the hubs and section fronts were the parents of every page that did
 * have one. Passing `lang` and `href` turns it on; the trail is always
 * "Forside › denne side", because a top-level page has no deeper parent.
 */
export default function PageHeader({
  title,
  description,
  lang,
  href,
  crumb,
}: {
  title: string;
  description: ReactNode;
  /** Both of these, or neither: the breadcrumb needs a language and a target. */
  lang?: Lang;
  href?: string;
  /** A shorter label for the trail, when the heading is a sentence. */
  crumb?: string;
}) {
  return (
    <div className="max-w-3xl">
      {lang && href && (
        <Breadcrumbs lang={lang} trail={[{ name: crumb ?? title, href }]} className="mb-5" />
      )}
      <h1 className="text-balance font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.03] tracking-display text-paper">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-paper/65 sm:text-lg sm:leading-8">
        {description}
      </p>
    </div>
  );
}
