import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import "../globals.css";
import { SESSION_COOKIE, sessionValid, adminConfigured } from "@/lib/admin-auth";
import { countNew } from "@/lib/db";

/**
 * The panel's own shell.
 *
 * Deliberately not inside app/[lang]. The panel has no language, no header,
 * no footer, no consent banner and no analytics — it is a tool, not a page of
 * the site — and putting it under the language segment would have given it all
 * of those and a URL that says /da/admin.
 */
export const metadata: Metadata = {
  title: "Kestro admin",
  /* Belt and braces with the header set in next.config.mjs. Neither is the
     access control — the session below is. */
  robots: { index: false, follow: false, nocache: true },
};

/* Session state is per request, so nothing here may be cached or prerendered. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  /*
   * The gate, in the layout rather than in middleware.
   *
   * Middleware runs on the edge runtime, where node:crypto's timing-safe
   * compare does not exist — the signature check would have had to be written
   * a second time against a different crypto API, and two implementations of
   * one security check is one more than is safe. A server component runs on
   * Node and shares the exact code the login route uses.
   */
  const authed = sessionValid(cookies().get(SESSION_COOKIE)?.value);
  const unread = authed ? await countNew() : 0;

  return (
    <html lang="da">
      <body className="min-h-dvh bg-brand-950 font-sans text-paper antialiased">
        {authed ? (
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
            <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/10 pb-5">
              <Link href="/admin" className="font-display text-lg font-extrabold tracking-tight">
                Kestro <span className="text-brand-300">admin</span>
              </Link>
              <nav className="flex items-center gap-5 text-sm">
                <Link href="/admin" className="text-paper/70 transition hover:text-paper">
                  Beskeder
                  {unread > 0 && (
                    <span className="ml-2 inline-flex min-w-[1.25rem] justify-center bg-brand-600 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-paper">
                      {unread}
                    </span>
                  )}
                </Link>
                <Link href="/" className="text-paper/50 transition hover:text-paper">
                  Se sitet
                </Link>
              </nav>
              <form action="/api/admin/logout" method="post" className="ml-auto">
                <button className="text-sm text-paper/50 transition hover:text-paper">
                  Log ud
                </button>
              </form>
            </header>
            <main className="py-8">{children}</main>
          </div>
        ) : (
          <LoginWall configured={adminConfigured} />
        )}
      </body>
    </html>
  );
}

/**
 * Everything an unauthenticated request gets.
 *
 * The whole tree is replaced rather than the page redirecting, so no child
 * component runs and nothing it would have read is fetched. A redirect would
 * be equally safe here, but this keeps the reason on screen — including the
 * one case where there is no password set at all, which is a deployment
 * mistake and not a wrong guess.
 */
function LoginWall({ configured }: { configured: boolean }) {
  if (!configured) {
    return (
      <div className="mx-auto max-w-md px-5 py-24">
        <h1 className="font-display text-2xl font-bold">Panelet er ikke sat op</h1>
        <p className="mt-4 text-sm leading-6 text-paper/65">
          Der er ingen adgangskode konfigureret, så panelet er lukket. Sæt{" "}
          <code className="bg-white/10 px-1.5 py-0.5 text-brand-200">ADMIN_PASSWORD</code> i Vercel
          og deploy igen.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <h1 className="font-display text-2xl font-bold tracking-tight">Kestro admin</h1>
      <p className="mt-3 text-sm text-paper/60">Log ind for at se beskeder og besøgstal.</p>

      <form action="/api/admin/login" method="post" className="mt-8">
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-paper/80">
          Adgangskode
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          className="w-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-paper focus:border-paper focus:outline-none focus:ring-2 focus:ring-brand-400/40"
        />
        <button className="mt-4 w-full bg-brand-600 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-brand-500">
          Log ind
        </button>
      </form>
    </div>
  );
}
