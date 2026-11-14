import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import {
  contentEntries,
  contentKind,
  publicContentPath,
  scalarQuery,
  catalogueUrl,
} from "@/lib/admin-catalogue";
import { formatDate } from "@/lib/i18n";
import { AdminPageHeader, EmptyState } from "@/components/admin/parts";
import { CatalogueStats } from "@/components/admin/CatalogueParts";
import { BUTTON, CARD, INPUT, PRIMARY_BUTTON } from "@/components/admin/tokens";

export const dynamic = "force-dynamic";

export default async function AdminContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const q = scalarQuery(query.q).trim().slice(0, 120);
  const kind = ["article", "practical"].includes(scalarQuery(query.kind))
    ? scalarQuery(query.kind)
    : "";
  const categories = [...new Set(contentEntries.map((entry) => entry.category))];
  const category = categories.includes(scalarQuery(query.category))
    ? scalarQuery(query.category)
    : "";
  const items = contentEntries.filter(
    (entry) =>
      (!kind || entry.kind === kind) &&
      (!category || entry.category === category) &&
      (!q ||
        `${entry.title.da} ${entry.title.en} ${entry.keyword ?? ""} ${entry.summary.da}`
          .toLocaleLowerCase("da")
          .includes(q.toLocaleLowerCase("da"))),
  );
  return (
    <div className="space-y-7">
      <AdminPageHeader
        compactMobile
        eyebrow="Websted · indhold"
        title="Indhold"
        description="Artikler, praktiske guides og sprogversioner samlet ét sted."
        actions={
          <Link href="/vejledninger" target="_blank" rel="noopener noreferrer" className={BUTTON}>
            Åbn Viden ↗
          </Link>
        }
      />
      <CatalogueStats
        items={[
          {
            value: contentEntries.filter((entry) => entry.kind === "article").length,
            label: "artikler",
          },
          {
            value: contentEntries.filter((entry) => entry.kind === "practical").length,
            label: "praktiske guides",
          },
          { value: 2, label: "sprog" },
        ]}
      />
      <form
        key={JSON.stringify([q, kind, category])}
        action="/admin/indhold"
        method="get"
        aria-label="Find indhold"
        className={`${CARD} p-4`}
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="block text-xs font-medium text-paper/80">
            Søg i indhold
            <input
              name="q"
              defaultValue={q}
              maxLength={120}
              type="search"
              placeholder="Titel, emne eller søgeord"
              className={`${INPUT} mt-2 w-full`}
            />
          </label>
          <button type="submit" className={PRIMARY_BUTTON}>
            Find indhold
          </button>
        </div>
        <details open={Boolean(kind || category)} className="mt-2">
          <summary className="flex min-h-11 cursor-pointer items-center rounded-sm text-xs font-medium text-paper/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300">
            Type og emne{kind || category ? " · filtre valgt" : ""} ↓
          </summary>
          <div className="grid gap-4 border-t border-white/10 pt-3 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="content-kind" className="block text-xs font-medium text-paper/80">
                Indholdstype
              </label>
              <select
                id="content-kind"
                name="kind"
                defaultValue={kind}
                className={`${INPUT} mt-2 w-full`}
              >
                <option value="">Alle typer</option>
                <option value="article">Artikler</option>
                <option value="practical">Praktiske guides</option>
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="content-category" className="block text-xs font-medium text-paper/80">
                Emne
              </label>
              <select
                id="content-category"
                name="category"
                defaultValue={category}
                className={`${INPUT} mt-2 w-full`}
              >
                <option value="">Alle emner</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-paper/70">
          <strong className="font-semibold tabular-nums text-paper">{items.length}</strong> af{" "}
          {contentEntries.length} indholdssider
        </p>
        {(q || kind || category) && (
          <Link
            href="/admin/indhold"
            className="inline-flex min-h-11 items-center text-sm text-brand-200 underline underline-offset-4"
          >
            Nulstil filtre
          </Link>
        )}
      </div>
      {items.length ? (
        <ul aria-label="Indhold" className={`${CARD} divide-y divide-white/10 overflow-hidden`}>
          {items.map((entry) => (
            <li
              key={entry.slug}
              className="grid min-w-0 gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:p-5 xl:grid-cols-[136px_minmax(0,1fr)_auto]"
            >
              <div className="flex min-w-0 gap-4 sm:contents">
                <Link
                  href={`/admin/indhold/${entry.slug}`}
                  className="relative block aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-brand-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300 sm:w-full"
                  aria-label={`Gennemse ${entry.title.da}`}
                >
                  {entry.images.da ? (
                    <Image
                      src={entry.images.da.src}
                      alt={entry.images.da.alt}
                      fill
                      sizes="(min-width:1280px) 136px, (min-width:640px) 120px, 96px"
                      className="object-contain"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs text-paper/70">
                      Grafik
                    </span>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-5 text-paper/70">
                    {entry.kind === "practical"
                      ? entry.category
                      : `${contentKind(entry.kind)} · ${entry.category}`}
                  </p>
                  <h2 className="mt-1 text-base font-semibold leading-6">
                    <Link
                      href={`/admin/indhold/${entry.slug}`}
                      className="inline-flex min-h-11 items-center rounded-sm hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
                    >
                      {entry.title.da}
                    </Link>
                  </h2>
                  <p className="mt-1 hidden text-sm leading-6 text-paper/70 sm:block">
                    {entry.summary.da}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-paper/65">
                    Opdateret {formatDate(entry.updated, "da")}
                    <span className="mx-2" aria-hidden="true">
                      ·
                    </span>
                    DA / EN{entry.tool ? ` · ${entry.tool}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:col-start-2 xl:col-start-auto xl:flex-col xl:items-stretch xl:justify-center">
                <Link href={`/admin/indhold/${entry.slug}`} className={BUTTON}>
                  Gennemse
                </Link>
                <Link
                  href={publicContentPath(entry, "da")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center px-3 text-sm text-brand-200 hover:text-paper"
                >
                  Se på sitet ↗
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Intet indhold matcher"
          description="Prøv et kortere søgeord, eller vis alle indholdstyper."
          action={
            <Link href={catalogueUrl("/admin/indhold", {})} className={BUTTON}>
              Vis alt indhold
            </Link>
          }
        />
      )}
      <p className="text-xs leading-6 text-paper/65">
        Biblioteket viser den publicerede indholdskilde. Tekstændringer og publicering foretages via
        GitHub; brug »Gennemse« til at finde den rigtige kilde og se begge sprog.
      </p>
    </div>
  );
}
