import Link from "next/link";
import Container from "./Container";

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
  { href: "/ydelser", da: "Ydelser", en: "Services" },
  { href: "/vejledninger", da: "Viden", en: "Knowledge" },
  { href: "/flaadeloesninger", da: "Flådeløsninger", en: "Fleet solutions" },
  { href: "/kontakt", da: "Kontakt", en: "Contact" },
];

export default function NotFoundPanel() {
  return (
    <section className="flex min-h-[70vh] items-center py-10 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm font-semibold tracking-[0.3em] text-brand-300 leading-[1.6]">
            404
          </p>

          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-display text-paper sm:text-4xl">
            Siden blev ikke fundet
          </h1>
          <p className="mt-4 text-base leading-[1.75] text-paper/70">
            Siden findes ikke, eller den er flyttet. Prøv et af links herunder, eller skriv til os —
            så finder vi det, I leder efter.
          </p>

          <p className="mt-7 font-display text-xl font-bold tracking-display text-paper/85">
            This page could not be found
          </p>
          <p className="mt-3 text-base leading-[1.75] text-paper/60">
            The page does not exist or has moved. Try one of the links below, or write to us and we
            will point you to it.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2.5 font-semibold tracking-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 min-h-[44px] text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-500 px-6"
            >
              Til forsiden / Front page
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex min-h-[50px] items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold tracking-tight text-paper transition hover:border-white/35 hover:bg-white/[0.08]"
            >
              Kontakt os / Contact us
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-7">
            {ways.map((way) => (
              <li key={way.href}>
                <Link
                  href={way.href}
                  className="inline-flex min-h-[32px] items-center text-sm font-medium text-paper/60 transition hover:text-paper"
                >
                  {way.da}
                  <span aria-hidden="true" className="px-1.5 text-paper/55">
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
  );
}
