"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Logo from "@/components/Logo";
import { useInboxCount } from "@/components/admin/InboxCount";
import {
  ClockIcon,
  DeviceIcon,
  ExternalIcon,
  GaugeIcon,
  ContactsIcon,
  InboxIcon,
  LogoutIcon,
  PagesIcon,
  PulseIcon,
} from "@/components/admin/icons";
import styles from "@/components/admin/admin-shell.module.css";

function MediaIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="9.5" r="1.5" />
      <path d="m4 17 5-4.5 3.5 3L16 12l4 5" />
    </svg>
  );
}

const groups = [
  {
    label: "Arbejde",
    items: [
      { href: "/admin", label: "Oversigt", Icon: GaugeIcon },
      { href: "/admin/beskeder", label: "Beskeder", Icon: InboxIcon },
      { href: "/admin/opfoelgning", label: "Opfølgning", Icon: ClockIcon },
      { href: "/admin/kontakter", label: "Kontakter", Icon: ContactsIcon },
    ],
  },
  {
    label: "Websted",
    items: [
      { href: "/admin/indhold", label: "Indhold", Icon: PagesIcon },
      { href: "/admin/medier", label: "Medier", Icon: MediaIcon },
    ],
  },
  { label: "Indsigt", items: [{ href: "/admin/trafik", label: "Trafik", Icon: PulseIcon }] },
  { label: "Drift", items: [{ href: "/admin/system", label: "System", Icon: DeviceIcon }] },
];
const items = groups.flatMap((group) => group.items);
const primary = items.slice(0, 3);
const activePath = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname.startsWith(href);

/** Group the whole workspace while keeping everyday work within one tap. */
export default function AdminNav() {
  const pathname = usePathname();
  const { count: unread } = useInboxCount();
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const current = items.find((item) => activePath(pathname, item.href));
  const secondaryActive = Boolean(current && !primary.includes(current));

  function closeMenu() {
    menu.current?.close();
    setMenuOpen(false);
  }
  function openMenu() {
    menu.current?.showModal();
    setMenuOpen(true);
  }

  useEffect(() => {
    menu.current?.close();
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener("change", resize);
    return () => {
      document.body.style.overflow = previous;
      desktop.removeEventListener("change", resize);
    };
  }, [menuOpen]);

  function destination(item: (typeof items)[number], inMenu = false) {
    const active = activePath(pathname, item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          prefetch={false}
          aria-current={active ? "page" : undefined}
          onClick={inMenu ? closeMenu : undefined}
          className={`${styles.destination} ${active ? styles.destinationActive : ""}`}
        >
          <item.Icon className={styles.destinationIcon} />
          <span>{item.label}</span>
          {item.href === "/admin/beskeder" && unread > 0 && (
            <span className={styles.unread} aria-label={`${unread} nye beskeder`}>
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Link>
      </li>
    );
  }

  function sections(inMenu = false) {
    return groups.map((group) => (
      <div key={group.label} className={styles.navGroup}>
        <p className={styles.navLabel}>{group.label}</p>
        <ul className={styles.destinations} aria-label={group.label}>
          {group.items.map((item) => destination(item, inMenu))}
        </ul>
      </div>
    ));
  }

  return (
    <aside className={styles.nav} aria-label="Kestro administration">
      <div className={styles.navInner}>
        <Link href="/admin" className={styles.brand} aria-label="Kestro admin – oversigt">
          <Logo className={styles.brandMark} idPrefix="admin-navigation" />
          <span>
            <span className={styles.brandName}>Kestro</span>
            <span className={styles.brandLabel}>Administration</span>
          </span>
        </Link>

        <nav aria-label="Panel" className={styles.desktopNavigation}>
          {sections()}
        </nav>

        <nav aria-label="Panel" className={styles.mobileNavigation}>
          <ul className={styles.primaryDestinations}>
            {primary.map((item) => destination(item))}
            <li className={styles.mobileMenuItem}>
              <button
                type="button"
                ref={menuButton}
                onClick={openMenu}
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                aria-controls="admin-menu"
                aria-label={secondaryActive ? `Menu · ${current?.label}` : "Menu"}
                className={`${styles.destination} ${secondaryActive ? styles.destinationActive : ""}`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  className={styles.destinationIcon}
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Menu</span>
              </button>
            </li>
          </ul>
        </nav>

        <noscript>
          <style>{`.${styles.navInner}>noscript{display:contents}.${styles.mobileMenuItem}{display:none!important}.${styles.primaryDestinations}{grid-template-columns:repeat(3,minmax(0,1fr))}`}</style>
          <nav aria-label="Flere sektioner" className={styles.noScriptNavigation}>
            {items.slice(3).map((item) => (
              <Link key={item.href} href={item.href} className={styles.noScriptLink}>
                {item.label}
              </Link>
            ))}
          </nav>
        </noscript>

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

      <dialog
        id="admin-menu"
        ref={menu}
        aria-labelledby="admin-menu-title"
        className={styles.menuDialog}
        onCancel={() => setMenuOpen(false)}
        onClose={() => {
          setMenuOpen(false);
          if (menuButton.current?.getClientRects().length) menuButton.current.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className={styles.menuHeader}>
          <div>
            <p className={styles.menuEyebrow}>Kestro · arbejdsrum</p>
            <h2 id="admin-menu-title">Alle sektioner</h2>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Luk menu"
            className={styles.menuClose}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Alle sektioner" className={styles.menuNavigation}>
          {sections(true)}
        </nav>
      </dialog>
    </aside>
  );
}
