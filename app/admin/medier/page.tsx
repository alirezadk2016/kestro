import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import {
  mediaEntries,
  mediaGroups,
  scalarQuery,
  catalogueUrl,
  fileSize,
} from "@/lib/admin-catalogue";
import { SITE_ORIGIN } from "@/lib/site";
import { AdminPageHeader, EmptyState } from "@/components/admin/parts";
import { CataloguePager } from "@/components/admin/CatalogueParts";
import CopyAssetLink from "@/components/admin/CopyAssetLink";
import { BUTTON, CARD, INPUT, PRIMARY_BUTTON } from "@/components/admin/tokens";

export const dynamic = "force-dynamic";

export default async function AdminMedia({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const q = scalarQuery(query.q).trim().slice(0, 120);
  const requestedGroup = scalarQuery(query.group);
  const group = mediaGroups.some((item) => item.id === requestedGroup) ? requestedGroup : "all";
  const filtered = mediaEntries.filter(
    (asset) =>
      (group === "all" || asset.group === group) &&
      (!q ||
        `${asset.src} ${asset.content.map((entry) => entry.title.da).join(" ")}`
          .toLocaleLowerCase("da")
          .includes(q.toLocaleLowerCase("da"))),
  );
  const pageSize = 18;
  const pages = Math.ceil(filtered.length / pageSize) || 1;
  const requestedPage = Number(scalarQuery(query.page));
  const page = Math.max(
    1,
    Math.min(pages, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1),
  );
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageUrl = (number: number) =>
    catalogueUrl("/admin/medier", { q, group: group === "all" ? undefined : group, page: number });
  return (
    <div className="space-y-7">
      <AdminPageHeader
        compactMobile
        eyebrow="Websted · medier"
        title="Medier"
        description="Find billeder, kopiér links, og hent originalfilerne."
        actions={
          <Link href="/admin/indhold" className={BUTTON}>
            Indhold →
          </Link>
        }
      />
      <form
        key={JSON.stringify([q, group])}
        action="/admin/medier"
        method="get"
        aria-label="Find billeder"
        className={`${CARD} p-4`}
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="block min-w-0 text-xs font-medium text-paper/80">
            Søg efter billede
            <input
              name="q"
              type="search"
              defaultValue={q}
              maxLength={120}
              placeholder="Filnavn eller guidens titel"
              className={`${INPUT} mt-2 w-full`}
            />
          </label>
          <button type="submit" className={PRIMARY_BUTTON}>
            Find billeder
          </button>
        </div>
        <details open={group !== "all"} className="mt-2">
          <summary className="flex min-h-11 cursor-pointer items-center rounded-sm text-xs font-medium text-paper/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300">
            Billedgruppe{group !== "all" ? " · filter valgt" : ""} ↓
          </summary>
          <div className="border-t border-white/10 pt-3">
            <div className="min-w-0">
              <label htmlFor="media-group" className="block text-xs font-medium text-paper/80">
                Billedgruppe
              </label>
              <select
                id="media-group"
                name="group"
                defaultValue={group}
                className={`${INPUT} mt-2 w-full`}
              >
                {mediaGroups.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-paper/70">
          <strong className="font-semibold tabular-nums text-paper">
            {filtered.length ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filtered.length)}
          </strong>{" "}
          af {filtered.length} billeder
        </p>
        {(q || group !== "all") && (
          <Link
            href="/admin/medier"
            className="inline-flex min-h-11 items-center text-sm text-brand-200 underline underline-offset-4"
          >
            Nulstil filtre
          </Link>
        )}
      </div>
      {items.length ? (
        <ul
          aria-label="Billedbibliotek"
          className="grid min-w-0 gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
          {items.map((asset) => (
            <li key={asset.src} className={`${CARD} flex min-w-0 flex-col overflow-hidden`}>
              <a
                href={asset.src}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[3/2] border-b border-white/10 bg-brand-950/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-300"
                aria-label={`Åbn originalen ${asset.filename}`}
              >
                <Image
                  src={asset.src}
                  alt={asset.content[0]?.images.da?.alt ?? `Forhåndsvisning af ${asset.filename}`}
                  fill
                  sizes="(min-width:1536px) 400px, (min-width:768px) 45vw, 90vw"
                  className="object-contain p-3"
                  unoptimized={asset.format === "svg"}
                />
              </a>
              <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                <h2 className="break-words text-sm font-semibold leading-6 [overflow-wrap:anywhere]">
                  {asset.filename}
                </h2>
                <p className="mt-2 text-xs tabular-nums leading-5 text-paper/70">
                  {asset.width} × {asset.height} px · {asset.format.toUpperCase()} ·{" "}
                  {fileSize(asset.bytes)}
                </p>
                <p className="mt-2 break-all text-xs leading-5 text-paper/65">{asset.src}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <CopyAssetLink url={`${SITE_ORIGIN}${asset.src}`} filename={asset.filename} />
                  <a href={asset.src} download={asset.filename} className={BUTTON}>
                    Hent fil ↓
                  </a>
                </div>
                <details className="mt-4 border-t border-white/10 pt-1">
                  <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-sm text-sm font-medium text-paper/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300">
                    Brug i Viden
                    <span aria-hidden="true" className="text-paper/65">
                      +
                    </span>
                  </summary>
                  {asset.content.length ? (
                    <ul className="mt-2 space-y-2">
                      {asset.content.map((entry) => (
                        <li key={entry.slug}>
                          <Link
                            href={`/admin/indhold/${entry.slug}`}
                            className="inline-flex min-h-11 items-center text-sm leading-6 text-brand-200 hover:text-paper"
                          >
                            {entry.title.da} →
                          </Link>
                          <p className="text-xs leading-5 text-paper/65">{entry.images.da?.alt}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="pb-3 text-xs leading-6 text-paper/70">
                      Ingen sidehenvisning er registreret i Viden. Filen kan bruges andre steder på
                      sitet; dette er ikke en liste over ubrugte billeder.
                    </p>
                  )}
                </details>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Ingen billeder matcher"
          description="Søg efter et kortere filnavn, eller vælg en anden billedgruppe."
          action={
            <Link href="/admin/medier" className={BUTTON}>
              Vis alle billeder
            </Link>
          }
        />
      )}
      <CataloguePager
        page={page}
        pages={pages}
        previous={pageUrl(page - 1)}
        next={pageUrl(page + 1)}
      />
      <p className="text-xs leading-6 text-paper/65">
        Mål og filstørrelser kommer fra originalfilerne i den aktuelle udgivelse. Billedfiler
        administreres via kodebasen; kopiering og download ændrer ikke sitet.
      </p>
    </div>
  );
}
