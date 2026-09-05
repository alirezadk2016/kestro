"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ExternalIcon,
  GaugeIcon,
  InboxIcon,
  LogoutIcon,
} from "@/components/admin/icons";

const items = [
  { href: "/admin", label: "Oversigt", Icon: GaugeIcon },
  { href: "/admin/beskeder", label: "Beskeder", Icon: InboxIcon },
];

/**
 * The panel's navigation.
 *
 * A client component only because the current page has to be marked, and
 * knowing which page you are on requires the pathname. Marking it is not
 * decoration: a panel with two destinations and no indication of which one you
 * are looking at makes the reader work out their own position from the
 * content, every time.
 *
 * A rail on wide screens and a strip above the content on narrow ones — the
 * same list in the same order either way, rather than a second copy behind a
 * hamburger that then has to be kept in step with this one.
 */
export default function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Panel"
      className="border-b border-white/[0.09] bg-white/[0.02] lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r"
    >
      <div className="flex items-center gap-6 px-5 py-4 sm:px-8 lg:h-full lg:flex-col lg:items-stretch lg:gap-0 lg:px-5 lg:py-7">
        <Link
          href="/admin"
          className="font-display text-[17px] font-extrabold tracking-tight lg:px-3"
        >
          Kestro <span className="text-brand-300">admin</span>
        </Link>

        <ul className="flex items-center gap-1 lg:mt-9 lg:flex-col lg:items-stretch lg:gap-1">
          {items.map(({ href, label, Icon }) => {
            /* Exact match for the overview, prefix for anything with children,
               so opening one message keeps Beskeder marked as where you are. */
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2 text-sm transition ${
                    active
                      ? "bg-white/[0.08] font-semibold text-paper"
                      : "text-paper/60 hover:bg-white/[0.04] hover:text-paper"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] flex-none ${active ? "text-brand-300" : ""}`} />
                  {label}
                  {href === "/admin/beskeder" && unread > 0 && (
                    <span className="ml-auto inline-flex min-w-[1.375rem] justify-center bg-brand-600 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-paper">
                      {unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:mt-auto lg:flex-col lg:items-stretch">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-paper/50 transition hover:text-paper"
          >
            <ExternalIcon className="h-[18px] w-[18px] flex-none" />
            {/* sr-only, not hidden: below sm these are icon-only, and
                display:none takes the label away from a screen reader too,
                leaving two unnamed buttons. */}
            <span className="sr-only sm:not-sr-only">Se sitet</span>
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-paper/50 transition hover:text-paper">
              <LogoutIcon className="h-[18px] w-[18px] flex-none" />
              <span className="sr-only sm:not-sr-only">Log ud</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
