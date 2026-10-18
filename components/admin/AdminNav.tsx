"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/Logo";
import { useInboxCount } from "@/components/admin/InboxCount";
import {
  DeviceIcon,
  ExternalIcon,
  GaugeIcon,
  InboxIcon,
  LogoutIcon,
  PulseIcon,
} from "@/components/admin/icons";
import styles from "@/components/admin/admin-shell.module.css";

const items = [
  { href: "/admin", label: "Oversigt", Icon: GaugeIcon },
  { href: "/admin/beskeder", label: "Beskeder", Icon: InboxIcon },
  { href: "/admin/trafik", label: "Trafik", Icon: PulseIcon },
  { href: "/admin/system", label: "System", Icon: DeviceIcon },
];

/** The same destinations remain visible on a phone and a desktop. */
export default function AdminNav() {
  const pathname = usePathname();
  const { count: unread } = useInboxCount();

  return (
    <nav aria-label="Panel" className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/admin" className={styles.brand} aria-label="Kestro admin – oversigt">
          <Logo className={styles.brandMark} idPrefix="admin-navigation" />
          <span>
            <span className={styles.brandName}>Kestro</span>
            <span className={styles.brandLabel}>Administration</span>
          </span>
        </Link>

        <p className={styles.navLabel}>Arbejdsrum</p>

        <ul className={styles.destinations}>
          {items.map(({ href, label, Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`${styles.destination} ${active ? styles.destinationActive : ""}`}
                >
                  <Icon className={styles.destinationIcon} />
                  <span>{label}</span>
                  {href === "/admin/beskeder" && unread > 0 && (
                    <span className={styles.unread} aria-label={`${unread} nye beskeder`}>
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.session}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5.5" y="10" width="13" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2" />
          </svg>
          <div>
            <p>Logget ind</p>
            <span>Fælles administratoradgang</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.action}
            aria-label="Se sitet (åbner i ny fane)"
          >
            <ExternalIcon />
            <span className={styles.siteLabel}>Se sitet</span>
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className={styles.action}>
              <LogoutIcon />
              <span>Log ud</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
