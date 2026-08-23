import Link from "next/link";
import Container from "@/components/Container";

/*
 * Middleware rewrites unprefixed paths to /da, so an unknown Danish URL lands
 * here. There is no language segment to read at this point, so the page shows
 * both languages rather than guessing.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="text-sm font-semibold text-accent-500">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Siden blev ikke fundet
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-ink-600">
          Siden findes ikke, eller er blevet flyttet. Prøv forsiden, eller kontakt os direkte.
        </p>
        <p className="mx-auto mt-2 max-w-md text-base leading-7 text-ink-500">
          This page does not exist or has moved. Try the front page, or contact us directly.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="bg-ink-950 px-7 py-3.5 text-sm font-semibold tracking-tight text-paper transition hover:bg-ink-800"
          >
            Til forsiden / Front page
          </Link>
          <Link
            href="/kontakt"
            className="rounded-full border border-ink-200 px-7 py-3 text-sm font-semibold text-ink-800 transition hover:border-ink-400 hover:bg-paper-dim"
          >
            Kontakt os / Contact
          </Link>
        </div>
      </Container>
    </section>
  );
}
