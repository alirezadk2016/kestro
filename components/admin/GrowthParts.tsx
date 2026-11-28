import type { ReactNode } from "react";
import styles from "@/components/admin/growth.module.css";

/** The growth pages' header: the same title, line and actions as every page.
    The eyebrow is accepted and not shown; the sidebar already says where
    you are. */
export function GrowthHeader({
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
}

export function GrowthPanel({
  title,
  description,
  children,
  className = "",
  id,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${styles.panel} ${className}`}>
      {(title || description) && (
        <header className={styles.panelHead}>
          {title && <h2 className={styles.panelTitle}>{title}</h2>}
          {description && <p className={styles.panelDescription}>{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export const channelNames: Record<string, string> = {
  search: "Søgemaskiner",
  social: "Sociale medier",
  paid: "Betalt trafik",
  email: "E-mail",
  referral: "Andre websteder",
  direct_unknown: "Direkte / ukendt",
  other: "Øvrige",
};

export const channelLabel = (value: string) => channelNames[value] ?? value;

export function GrowthEmpty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

export const growthPercent = (part: number, total: number) =>
  total > 0
    ? `${new Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format((part / total) * 100)} %`
    : "—";
