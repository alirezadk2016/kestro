import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { buttonClass } from "./Button";
import SearchLauncher from "./SearchLauncher";

/*
 * What a visitor sees at a URL that does not exist.
 *
 * Bilingual on purpose. A 404 is reached from a stale link, a typo or a
 * scanner, and none of those carry a language: the path may have no /en
 * prefix and still have been meant in English, and guessing wrong makes a
 * dead end feel like two. Both languages, in the site's own order, costs four
 * short lines.
 *
 * It offers routes out rather than only a way back. "Return to the front page"
 * is the least useful thing you can say to someone who arrived looking for a
 * specific machine — the five links below are the five places a mistyped or
 * moved URL was most likely aiming at.
 */
const ways = [
  { href: "/produkter", da: "Produkter", en: "Products" },
  { href: "/priser", da: "Priser", en: "Pricing" },
  { href: "/ydelser", da: "Ydelser", en: "Services" },
  { href: "/vejledninger", da: "Viden", en: "Knowledge" },
  { href: "/flaadeloesninger", da: "Flådeløsninger", en: "Fleet solutions" },
  { href: "/kontakt", da: "Kontakt", en: "Contact" },
];

export default function NotFoundPanel() {
  return (
    <>
      {/* The bar the rest of the site has, without the navigation: there is
          no language to draw it in. Without it the page carried no name at
          all, and a visitor from a stale link could not tell whose 404 it
          was. */}
      <header className="border-b border-ink-200">
        <Container className="flex h-16 items-center sm:h-20">
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-ink-900"
          >
            <Logo className="h-7 w-auto" idPrefix="notfound" />
            Kestro
          </Link>
        </Container>
      </header>
      <main id="indhold">
        <section className="flex min-h-[70vh] items-center py-10 sm:py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="mx-auto font-mono text-sm font-semibold tracking-[0.3em] text-brand-700 leading-[1.6]">
                404
              </p>

              <h1 className="mt-5 font-display text-3xl font-extrabold tracking-display text-ink-900 sm:text-4xl">
                Siden blev ikke fundet
              </h1>
              <p className="mx-auto mt-4 text-base leading-[1.75] text-ink-700">
                Siden findes ikke, eller den er flyttet. Prøv et af links herunder, eller skriv til
                os — så finder vi det, I leder efter.
              </p>

              <p className="mx-auto mt-7 font-display text-xl font-bold tracking-display text-ink-800">
                This page could not be found
              </p>
              <p className="mx-auto mt-3 text-base leading-[1.75] text-ink-700">
                The page does not exist or has moved. Try one of the links below, or write to us and
                we will point you to it.
              </p>

              {/* Search first: whoever lands here was looking for a page. */}
              <div className="mx-auto mt-9 max-w-md">
                <SearchLauncher lang="da" label="Søg på siden / Search the site" />
              </div>

              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/" className={buttonClass("primary", "lg")}>
                  Til forsiden / Front page
                </Link>
                <Link href="/kontakt" className={buttonClass("secondary", "lg")}>
                  Kontakt os / Contact us
                </Link>
              </div>

              <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-ink-200 pt-7">
                {ways.map((way) => (
                  <li key={way.href}>
                    <Link
                      href={way.href}
                      className="inline-flex min-h-[44px] items-center text-sm font-medium text-ink-700 transition hover:text-ink-900"
                    >
                      {way.da}
                      <span aria-hidden="true" className="px-1.5 text-ink-600">
                        /
                      </span>
                      {way.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
