import { cookies } from "next/headers";
import { CARD, EYEBROW } from "@/components/admin/tokens";
import { SectionHead } from "@/components/admin/parts";
import { requireAdmin, SESSION_COOKIE } from "@/lib/admin-auth";
import { adminDatabaseHealth, dbMisconfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  await requireAdmin();
  const database = await adminDatabaseHealth();
  const mail = Boolean(process.env.RESEND_API_KEY);
  const dedicatedSecret = Boolean(process.env.ADMIN_SESSION_SECRET);
  // The signature has already been verified by requireAdmin. Never render it.
  const expires = Number((await cookies()).get(SESSION_COOKIE)?.value.split(".")[0]);
  const expiry = Number.isFinite(expires)
    ? new Date(expires).toLocaleString("da-DK", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Copenhagen",
      })
    : "ukendt";
  const checks = [
    {
      title: "Database",
      state:
        database === "ready"
          ? "Forbindelse bekræftet"
          : database === "error"
            ? "Forbindelsesfejl"
            : "Ikke tilgængelig",
      ok: database === "ready",
      note:
        database === "ready"
          ? "Et læsekald til beskedarkivet lykkedes ved denne sidevisning."
          : dbMisconfigured
            ? "Forbindelsen er sat, men formatet kan ikke bruges. Ret databasevariablen i Vercel og genudgiv."
            : database === "error"
              ? "Databasen er konfigureret, men beskedarkivet kunne ikke læses. Kontrollér forbindelsen og databasen i Vercel."
              : "Forbind en Postgres-database til projektet i Vercel. Arkivet og besøgstal kræver databasen.",
    },
    {
      title: "Mailafsendelse",
      state: mail ? "Nøgle konfigureret" : "Mangler opsætning",
      ok: mail,
      note: mail
        ? "RESEND_API_KEY er til stede. Domæne og levering er ikke testet her; denne kontrol sender ingen e-mail."
        : "Tilføj RESEND_API_KEY og en godkendt afsender i projektets miljøvariabler. Genudgiv derefter.",
    },
    {
      title: "Sessionsignering",
      state: dedicatedSecret ? "Separat nøgle" : "Afledt af adgangskoden",
      ok: dedicatedSecret,
      note: dedicatedSecret
        ? "Sessionen signeres med ADMIN_SESSION_SECRET. Nøglen vises aldrig i panelet."
        : "Den eksisterende adgangskode bruges også til signering. En separat ADMIN_SESSION_SECRET kan konfigureres i Vercel.",
    },
  ];
  return (
    <div className="space-y-8">
      <header>
        <p className={EYEBROW}>Kestro · drift</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Systemstatus</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/70">
          Se hvad der er tilsluttet, og hvad der kræver handling. Ingen nøgler eller adgangskoder
          vises.
        </p>
      </header>
      <section
        aria-label="Forbindelser"
        className={`${CARD} divide-y divide-white/10 overflow-hidden`}
      >
        {checks.map((check) => (
          <div
            key={check.title}
            className="grid gap-3 p-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-6"
          >
            <h2 className="font-semibold">{check.title}</h2>
            <div>
              <p
                className={`inline-flex items-center gap-2 text-sm font-semibold ${check.ok ? "text-emerald-200" : "text-amber-200"}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${check.ok ? "bg-emerald-300" : "bg-amber-300"}`}
                />
                {check.state}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/70">{check.note}</p>
            </div>
          </div>
        ))}
      </section>
      <section aria-label="Adgang og session">
        <SectionHead title="Adgang og session" />
        <dl className={`${CARD} mt-4 grid gap-6 p-5 sm:grid-cols-2 sm:p-6`}>
          <div>
            <dt className="text-xs text-paper/70">Adgang</dt>
            <dd className="mt-2 text-sm font-semibold">Fælles administrator</dd>
            <dd className="mt-2 text-sm leading-6 text-paper/70">
              Panelet har én fælles adgangskode. Der findes ingen individuelle roller eller
              brugerrettigheder i denne løsning.
            </dd>
          </div>
          <div>
            <dt className="text-xs text-paper/70">Denne session udløber</dt>
            <dd className="mt-2 text-sm font-semibold tabular-nums">{expiry} · København</dd>
            <dd className="mt-2 text-sm leading-6 text-paper/70">
              Log ud på fælles enheder. Ny adgang kræver login, når sessionen udløber.
            </dd>
          </div>
        </dl>
      </section>
      <section aria-label="Vedligeholdelse">
        <SectionHead
          title="Vedligeholdelse"
          note="Konfiguration ændres i hostingprojektet. Panelet ændrer ikke adgangskoder, nøgler eller rettigheder."
        />
        <div className={`${CARD} mt-4 flex flex-wrap gap-3 p-5`}>
          <a
            href="https://vercel.com/web-mak/kestro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-4 text-sm font-medium text-paper/90 hover:border-brand-300"
          >
            Åbn Vercel ↗
          </a>
          <a
            href="https://github.com/alirezadk2016/kestro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-4 text-sm font-medium text-paper/90 hover:border-brand-300"
          >
            Åbn kildekode ↗
          </a>
          <form action="/admin/system" method="get">
            <button className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-4 text-sm font-medium text-paper/90 hover:border-brand-300">
              Kontrollér igen
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
