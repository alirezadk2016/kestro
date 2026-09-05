"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ExternalIcon,
  GaugeIcon,
  InboxIcon,
  LogoutIcon,
} from "@/components/admin/icons";
import { EYEBROW } from "@/components/admin/tokens";

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
      <div className="flex items-center gap-6 px-5 py-4 sm:px-8 lg:h-full lg:flex-col lg:items-stretch lg:gap-0 lg:px-4 lg:py-7">
        <Link
          href="/admin"
          className="font-display text-[17px] font-extrabold tracking-tight lg:px-3"
        >
          Kestro <span className="text-brand-300">admin</span>
        </Link>

        <p className={`mt-8 hidden px-3 lg:block ${EYEBROW}`}>Panel</p>

        <ul className="flex items-center gap-1 lg:mt-3 lg:flex-col lg:items-stretch lg:gap-0.5">
          {items.map(({ href, label, Icon }) => {
            /* Exact match for the overview, prefix for anything with children,
               so opening one message keeps Beskeder marked as where you are. */
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  /* A left edge on the current item, not only a fill: a
                     highlighted background alone reads as a hover that got
                     stuck, and this is the one thing on the page that says
                     where you are. */
                  className={`flex items-center gap-2.5 border-l-2 py-2 pl-3 pr-3 text-sm transition ${
                    active
                      ? "border-brand-400 bg-white/[0.07] font-semibold text-paper"
                      : "border-transparent text-paper/60 hover:bg-white/[0.035] hover:text-paper"
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

        {/* The rail's own footer, so the bottom of a tall column is not an
            empty half-screen. */}
        <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:mt-auto lg:flex-col lg:items-stretch lg:border-t lg:border-white/[0.07] lg:pt-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 border-l-2 border-transparent py-2 pl-3 pr-3 text-sm text-paper/50 transition hover:text-paper"
          >
            <ExternalIcon className="h-[18px] w-[18px] flex-none" />
            {/* sr-only, not hidden: below sm these are icon-only, and
                display:none takes the label away from a screen reader too,
                leaving two unnamed buttons. */}
            <span className="sr-only sm:not-sr-only">Se sitet</span>
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="flex w-full items-center gap-2.5 border-l-2 border-transparent py-2 pl-3 pr-3 text-sm text-paper/50 transition hover:text-paper">
              <LogoutIcon className="h-[18px] w-[18px] flex-none" />
              <span className="sr-only sm:not-sr-only">Log ud</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
