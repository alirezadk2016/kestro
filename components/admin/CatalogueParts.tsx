import Link from "next/link";
import { BUTTON, FIGURE } from "@/components/admin/tokens";

export function CatalogueStats({ items }: { items: { label: string; value: number | string }[] }) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-4 border-y border-white/10 py-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2">
          <dt className="order-2 text-xs text-paper/70">{item.label}</dt>
          <dd className={`${FIGURE} text-xl`}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CataloguePager({
  page,
  pages,
  previous,
  next,
}: {
  page: number;
  pages: number;
  previous: string;
  next: string;
}) {
  if (pages < 2) return null;
  return (
    <nav
      aria-label="Billedsider"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5"
    >
      <p className="text-sm tabular-nums text-paper/70">
        Side {page} af {pages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={previous} className={BUTTON}>
            ← Forrige
          </Link>
        ) : (
          <span className={`${BUTTON} pointer-events-none !text-paper/65`} aria-disabled="true">
            ← Forrige
          </span>
        )}
        {page < pages ? (
          <Link href={next} className={BUTTON}>
            Næste →
          </Link>
        ) : (
          <span className={`${BUTTON} pointer-events-none !text-paper/65`} aria-disabled="true">
            Næste →
          </span>
        )}
      </div>
    </nav>
  );
}

export function FieldValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <dt className="text-xs font-semibold text-paper/70">{label}</dt>
      <dd className="break-words text-sm leading-6 text-paper [overflow-wrap:anywhere]">
        {children}
      </dd>
    </div>
  );
}
