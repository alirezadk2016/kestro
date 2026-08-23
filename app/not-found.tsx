import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="text-sm font-semibold text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Siden blev ikke fundet
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          Siden findes ikke, eller er blevet flyttet. Prøv forsiden, eller kontakt os direkte.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Til forsiden
          </Link>
          <Link
            href="/kontakt"
            className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Kontakt os
          </Link>
        </div>
      </Container>
    </section>
  );
}
