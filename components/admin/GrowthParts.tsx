import Link from "next/link";
import type { ReactNode } from "react";
import styles from "@/components/admin/growth.module.css";

/** Growth reports share one paper work surface within the navy Kestro frame. */
export function GrowthHeader({
  eyebrow = "Kestro · vækst",
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
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
}

export function GrowthNav({ active }: { active: "traffic" | "seo" | "campaigns" }) {
  const links = [
    { id: "traffic", href: "/admin/trafik", label: "Trafik & kilder", number: "01" },
    { id: "seo", href: "/admin/seo", label: "Google & SEO", number: "02" },
    { id: "campaigns", href: "/admin/kampagner", label: "Kampagnelinks", number: "03" },
  ];
  return (
    <nav aria-label="Vækstværktøjer" className={styles.growthNav}>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          prefetch={false}
          aria-current={active === link.id ? "page" : undefined}
          className={`${styles.growthLink} ${active === link.id ? styles.growthLinkActive : ""}`}
        >
          <span aria-hidden="true" className={styles.navNumber}>
            {link.number}
          </span>
          {link.label}
        </Link>
      ))}
    </nav>
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
