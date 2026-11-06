import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import {
  contentEntries,
  contentKind,
  publicContentPath,
  sourceUrl,
  mediaEntries,
  fileSize,
} from "@/lib/admin-catalogue";
import { formatDate } from "@/lib/i18n";
import { SITE_ORIGIN } from "@/lib/site";
import { AdminPageHeader } from "@/components/admin/parts";
import { FieldValue } from "@/components/admin/CatalogueParts";
import { BUTTON, CARD } from "@/components/admin/tokens";

export const dynamic = "force-dynamic";

export default async function AdminContentDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const entry = contentEntries.find((item) => item.slug === slug);
  if (!entry) notFound();
  const image = entry.images.da;
  const asset = image ? mediaEntries.find((item) => item.src === image.src) : undefined;
  return (
    <div className="space-y-7">
      <Link
        href="/admin/indhold"
        className="inline-flex min-h-11 items-center text-sm text-paper/75 hover:text-paper"
      >
        ← Alt indhold
      </Link>
      <AdminPageHeader
        eyebrow={`${contentKind(entry.kind)} · ${entry.category}`}
        title={entry.title.da}
        description={entry.summary.da}
        actions={
          <Link
            href={sourceUrl(entry)}
            target="_blank"
            rel="noopener noreferrer"
            className={BUTTON}
          >
            Åbn kilde i GitHub ↗
          </Link>
        }
      />
      <section
        aria-labelledby="content-overview"
        className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      >
        <div className={`${CARD} overflow-hidden`}>
          {image ? (
            <div className="relative aspect-[3/2] border-b border-white/10 bg-brand-950">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width:1024px) 700px, 100vw"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="p-6 text-sm text-paper/70">
              Denne side bruger en indbygget illustration.
            </div>
          )}
          <div className="p-5">
            <h2 id="content-overview" className="text-base font-semibold">
              Illustration og indhold
            </h2>
            <p className="mt-2 text-sm leading-6 text-paper/70">
              {image?.alt ?? "Illustrationen genereres i sidens skabelon."}
            </p>
            {asset && (
              <p className="mt-3 text-xs tabular-nums text-paper/65">
                {asset.width} × {asset.height} px · {asset.format.toUpperCase()} ·{" "}
                {fileSize(asset.bytes)}
              </p>
            )}
            {image && (
              <Link
                href={`/admin/medier?q=${encodeURIComponent(image.src.split("/").pop() || "")}`}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-200 hover:text-paper"
              >
                Find billedet i Medier →
              </Link>
            )}
          </div>
        </div>
        <div className={`${CARD} p-5 sm:p-6`}>
          <h2 className="text-base font-semibold">Publiceret indhold</h2>
          <dl className="mt-5 space-y-5">
            <FieldValue label="Publiceret">{formatDate(entry.published, "da")}</FieldValue>
            <FieldValue label="Senest opdateret">{formatDate(entry.updated, "da")}</FieldValue>
            <FieldValue label="Primært søgeord">
              {entry.keyword ?? "Ikke angivet som separat felt i indholdskilden."}
            </FieldValue>
            {entry.tool && <FieldValue label="Interaktivt værktøj">{entry.tool}</FieldValue>}
            <FieldValue label="Publicering">
              Kildestyret via GitHub. Dette overblik ændrer ikke teksten på sitet.
            </FieldValue>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["da", "en"] as const).map((lang) => (
              <Link
                key={lang}
                href={publicContentPath(entry, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON}
              >
                {lang === "da" ? "Se dansk side" : "Se engelsk side"} ↗
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="language-title">
        <h2 id="language-title" className="text-lg font-semibold">
          Sprog og metadata
        </h2>
        <p className="mt-2 text-sm text-paper/70">
          De faktiske titler og beskrivelser, som siden udgiver. Visningen er ikke en måling af
          placeringer i Google.
        </p>
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {(["da", "en"] as const).map((lang) => (
            <section
              key={lang}
              className={`${CARD} min-w-0 p-5 sm:p-6`}
              aria-labelledby={`language-${lang}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 id={`language-${lang}`} className="font-semibold">
                  {lang === "da" ? "Dansk" : "English"}
                </h3>
                <span className="rounded-md border border-white/15 px-2 py-1 text-xs font-semibold text-paper/75">
                  {lang.toUpperCase()}
                </span>
              </div>
              <dl className="mt-5 space-y-5">
                <FieldValue label="Sidens overskrift (H1)">{entry.title[lang]}</FieldValue>
                <FieldValue label="Søgeresultatets titel">
                  {entry.metaTitle[lang]}
                  <span className="mt-1 block text-xs tabular-nums text-paper/65">
                    {entry.metaTitle[lang].length} tegn
                  </span>
                </FieldValue>
                <FieldValue label="Metabeskrivelse">
                  {entry.metaDescription[lang]}
                  <span className="mt-1 block text-xs tabular-nums text-paper/65">
                    {entry.metaDescription[lang].length} tegn
                  </span>
                </FieldValue>
                <FieldValue label="Sidens adresse">
                  <a
                    href={publicContentPath(entry, lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-brand-200 underline underline-offset-4"
                  >
                    {SITE_ORIGIN}
                    {publicContentPath(entry, lang)}
                  </a>
                </FieldValue>
                <FieldValue label="Billedtekst (alt)">
                  {entry.images[lang]?.alt ?? "Indbygget grafik i denne sprogversion."}
                </FieldValue>
              </dl>
            </section>
          ))}
        </div>
      </section>
      <section className={`${CARD} p-5 sm:p-6`} aria-labelledby="structure-title">
        <h2 id="structure-title" className="text-lg font-semibold">
          {entry.kind === "practical" ? "Guidens trin" : "Artiklens afsnit"}
        </h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {entry.headings.map((heading, index) => (
            <li
              key={`${index}-${heading.da}`}
              className="flex gap-3 rounded-lg bg-brand-950/50 p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-400/10 text-xs font-semibold tabular-nums text-brand-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-6">{heading.da}</p>
                <p className="mt-1 text-xs leading-5 text-paper/65" lang="en">
                  {heading.en}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
