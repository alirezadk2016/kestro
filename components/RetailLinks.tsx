import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "./Container";
import { formatDate, localePath, type Lang } from "@/lib/i18n";
import type { Model } from "@/lib/models";
import { retailLinks, retailers } from "@/lib/retail-links";

/*
 * "Need it now?" — under a model's header, for a buyer who cannot wait for
 * Kestro to source one.
 *
 * Kestro stocks none of the catalogue yet. The owner asked that each model
 * say so and point to where it can be bought meanwhile. Each link is a
 * retailer's own search for the model, kept only where that search showed
 * the exact model line when it was checked (lib/retail-links.ts, with the
 * method in docs/retail-links.md).
 *
 * Deliberately not here: the retailers' product photos (theirs, not ours to
 * copy), their prices (they change by the hour, and CLAUDE.md allows no
 * figure that is not the owner's dated reference), and any "best price"
 * claim, which nobody here has checked. The buyer compares; the page says so.
 */
const copy = {
  da: {
    title: "Har I brug for den nu?",
    lead: (name: string, stores: string) =>
      `Vi har ikke ${name} på lager endnu. Indtil vi har, kan I finde den hos ${stores} og selv sammenligne pris og stand.`,
    leadNone: (name: string) =>
      `Vi har ikke ${name} på lager endnu, og ingen af de butikker, vi har tjekket, viste netop den model, da vi så efter.`,
    source: "Skal den hellere komme fra os, klargjort og med nordisk tastatur?",
    sourceLink: "Bed os skaffe den",
    search: (name: string, retailer: string) => `Søg efter ${name} hos ${retailer}`,
    open: "Se udvalget",
    and: "og",
    newWindow: "åbner i et nyt vindue",
    footnote: (many: boolean) =>
      `Uafhængige butikker: pris, stand og vilkår er deres, og Kestro får intet for linket. ${many ? "Søgningerne er tjekket" : "Søgningen er tjekket"}`,
  },
  en: {
    title: "Need it now?",
    lead: (name: string, stores: string) =>
      `We don't have the ${name} in stock yet. Until we do, you can find it at ${stores} and compare price and condition yourself.`,
    leadNone: (name: string) =>
      `We don't have the ${name} in stock yet, and none of the retailers we checked showed that exact model when we looked.`,
    source: "Would you rather it came from us, prepared and with a Nordic keyboard?",
    sourceLink: "Ask us to source it",
    search: (name: string, retailer: string) => `Search for the ${name} at ${retailer}`,
    open: "See what they have",
    and: "and",
    newWindow: "opens in a new window",
    footnote: (many: boolean) =>
      `Independent retailers: price, condition and terms are theirs, and Kestro earns nothing from the link. ${many ? "Searches checked" : "Search checked"}`,
  },
};

export default function RetailLinks({ model, lang }: { model: Model; lang: Lang }) {
  const c = copy[lang];
  const links = retailLinks[model.slug] ?? [];
  const checkedOn = links.map((link) => link.checkedOn).sort().at(-1);
  const names = links.map((link) => retailers[link.retailer].name);
  const stores =
    names.length > 1 ? `${names.slice(0, -1).join(", ")} ${c.and} ${names.at(-1)}` : (names[0] ?? "");
  /* One store is one wide card, not a third of a row with two holes beside it. */
  const grid =
    links.length === 1 ? "grid max-w-xl" : links.length === 2 ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3";
  const sourceHref = localePath(`/tilbud?model=${encodeURIComponent(model.name)}`, lang);

  return (
    <section
      aria-labelledby="retail-links-title"
      className="border-t border-white/10 py-10 sm:py-16"
      data-retail-links
    >
      <Container>
        <div className="split">
          <div>
            <h2
              id="retail-links-title"
              className="text-balance font-display t-h2 font-extrabold tracking-display text-paper"
            >
              {c.title}
            </h2>
            <p className="mt-3 text-base leading-[1.75] text-paper/75">
              {links.length > 0 ? c.lead(model.name, stores) : c.leadNone(model.name)}
            </p>
          </div>

          {links.length > 0 && (
            <ul className={grid}>
              {links.map((link) => {
                const retailer = retailers[link.retailer];
                return (
                  <li key={link.retailer} className="min-w-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      aria-label={`${c.search(model.name, retailer.name)}: ${link.note[lang]} (${c.newWindow})`}
                      className="plate plate-lift group flex h-full min-h-[44px] flex-col p-4 sm:p-5"
                    >
                      <span className="block font-display text-base font-bold text-paper">
                        {retailer.name}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-paper/75">{link.note[lang]}</span>
                      <span className="mt-auto inline-flex items-center gap-1.5 whitespace-nowrap pt-3 text-sm font-semibold text-brand-300 transition-colors group-hover:text-paper">
                        {c.open}
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 flex-none" strokeWidth={2} />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="mt-5 text-sm leading-6 text-paper/75">
            {c.source}{" "}
            <Link
              href={sourceHref}
              className="whitespace-nowrap font-semibold text-brand-300 underline decoration-brand-400/40 underline-offset-4 transition-colors hover:text-paper"
            >
              {c.sourceLink}
            </Link>
          </p>
          {checkedOn && (
            <p className="mt-2 text-xs leading-5 text-paper/65">
              {c.footnote(links.length > 1)} <time dateTime={checkedOn}>{formatDate(checkedOn, lang)}</time>.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
