import type { Metadata } from "next";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { Suspense } from "react";

import "../globals.css";
import AdminNav from "@/components/admin/AdminNav";
import AdminHistoryRefresh from "@/components/admin/AdminHistoryRefresh";
import { InboxCountProvider } from "@/components/admin/InboxCount";
import Logo from "@/components/Logo";
import { AlertIcon, ArrowLeftIcon } from "@/components/admin/icons";
import styles from "@/components/admin/admin-shell.module.css";
import { SESSION_COOKIE, FAILED_COOKIE, sessionValid, adminConfigured } from "@/lib/admin-auth";
import { countNew } from "@/lib/db";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * The panel's own shell.
 *
 * Deliberately not inside app/[lang]. The panel has no language, no header, no
 * footer, no consent banner and no analytics — it is a tool, not a page of the
 * site — and putting it under the language segment would have given it all of
 * those and a URL that says /da/admin.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "Kestro admin",
  /* Belt and braces with the header set in next.config.mjs. Neither is the
     access control — the session below is. */
  robots: { index: false, follow: false, nocache: true },
};

/*
 * The same face as the site.
 *
 * The panel had no font at all, and it did not fall back to a sans — it fell
 * back to Times. Tailwind's sans stack starts with var(--font-sans), the
 * variable is set by the class next/font generates, and this layout never
 * applied it. A var() pointing at a property that does not exist makes the
 * whole font-family declaration invalid rather than skipping to the next name
 * in the list, so the browser used its own default and the panel rendered in
 * a serif.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: false,
});

/* Session state is per request, so nothing here may be cached or prerendered. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  /*
   * The wall, which is not the gate.
   *
   * This used to say it was the gate, and gave a reason: middleware runs on the
   * edge runtime, node:crypto's timing-safe compare does not exist there, and
   * writing the signature check a second time against another crypto API is one
   * implementation more than is safe to have.
   *
   * The reasoning was sound and the conclusion was wrong, because a layout does
   * not run on every request — ask for the page segment alone and Next skips it.
   * So the check is now in three places (see middleware.ts), the second
   * implementation does exist, in lib/admin-session.ts against Web Crypto, and
   * the thing that was actually worth worrying about — the two drifting apart —
   * is handled by testing them against each other rather than by not writing
   * the second one.
   *
   * What is left here is the wall: the login form in place of the children,
   * which is what an admin with an expired session should see. It is a screen,
   * not a control.
   */
  const jar = await cookies();
  const authed = sessionValid(jar.get(SESSION_COOKIE)?.value);
  const unread = authed ? await countNew() : 0;
  /* Set by the login route on a wrong password, and given a ten-second life so
     it clears itself. A layout cannot read the query string — it wraps every
     page under /admin, and ?fejl=1 would follow the reader onto all of them —
     so the one bit of state the login screen needs travels as a cookie that
     expires before it can go stale. */
  const failed = jar.get(FAILED_COOKIE)?.value === "1";

  return (
    <html lang="da">
      <body
        className={`${jakarta.variable} min-h-dvh bg-brand-950 font-sans text-paper antialiased`}
      >
        {authed ? (
          <>
            <a href="#admin-main" className={styles.skip}>
              Gå til indhold
            </a>
            <div className={styles.shell}>
              <InboxCountProvider initialCount={unread}>
                <AdminHistoryRefresh />
                <AdminNav />
                <main id="admin-main" tabIndex={-1} className={styles.main}>
                  {/*
                   * A boundary between <main> and the page, for hydration.
                   *
                   * The panel streams, so the page arrives as its own row of
                   * the Flight payload, after this layout's. When React reaches
                   * <main> before that row, it suspends while reconciling
                   * <main>'s children and later replays <main>. The React that
                   * Next 15.5.28 bundles (19.2 canary) does not rewind the
                   * hydration cursor on that replay: it tries to claim <main>
                   * again from inside it, throws #418, and renders the whole
                   * document again on the client. Measured with the mismatch
                   * instrumented: fiber <main>, cursor on its first child,
                   * about one admin run in three. Inside a boundary the same
                   * wait suspends the boundary instead, and nothing is claimed
                   * twice.
                   */}
                  <Suspense>{children}</Suspense>
                </main>
              </InboxCountProvider>
            </div>
          </>
        ) : (
          <LoginWall configured={adminConfigured} failed={failed} />
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
function LoginWall({ configured, failed }: { configured: boolean; failed: boolean }) {
  return (
    <main className={styles.login}>
      <div className={styles.loginInner}>
        <div className={styles.loginBrand}>
          <Logo className="h-9 w-auto" idPrefix="admin-login" />
          <span>
            <span className={styles.brandName}>Kestro</span>
            <span className={styles.brandLabel}>Administration</span>
          </span>
        </div>

        <div className={styles.loginStory}>
          <p className={styles.loginTitle}>
            Dit websted.
            <br />
            Dit arbejdsrum.
          </p>
          <p className={styles.loginDescription}>
            Beskeder, opfølgning og indhold. Samlet ét sted.
          </p>
          <div className={styles.loginArtwork}>
            {/* The public site's original artwork anchors the private workspace
                in Kestro's existing visual identity. It is not a UI preview. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cards/cat-laptops.webp"
              alt="Bærbar computer på et skrivebord med udsigt over byen."
              width={1600}
              height={900}
            />
          </div>
          <p className={styles.loginCaption}>Kestro · Refurbished business IT</p>
        </div>

        <section className={styles.loginCard} aria-labelledby="admin-login-title">
          {configured ? (
            <>
              <h1 id="admin-login-title" className="font-display text-2xl font-bold tracking-tight">
                Log ind
              </h1>
              <p className="mt-2 text-sm leading-6 text-paper/70">Fortsæt til dit arbejdsrum.</p>

              {failed && (
                <p
                  role="alert"
                  className="mt-6 flex items-start gap-2.5 rounded-r-lg border-l-2 border-red-400/80 bg-red-400/[0.08] px-4 py-3 text-sm leading-6 text-red-100/90"
                >
                  <AlertIcon className="mt-0.5 h-4 w-4 flex-none text-red-300" />
                  Forkert adgangskode. Prøv igen.
                </p>
              )}

              <form action="/api/admin/login" method="post" className="mt-8">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-paper/80"
                >
                  Adgangskode
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  autoFocus
                  className="min-h-12 w-full rounded-lg border border-[#64748b] bg-[#0e1726] px-4 py-3 text-base text-paper transition-colors focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
                />
                <button
                  type="submit"
                  className="mt-4 min-h-12 w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950"
                >
                  Log ind
                </button>
              </form>
            </>
          ) : (
            <div className="border-l-2 border-amber-400/70 bg-amber-400/[0.06] p-5">
              <h1
                id="admin-login-title"
                className="flex items-center gap-2 font-display text-lg font-bold"
              >
                <AlertIcon className="h-5 w-5 flex-none text-amber-300" />
                Panelet er ikke sat op
              </h1>
              <p className="mt-3 text-sm leading-6 text-paper/70">
                Der er ingen adgangskode konfigureret, så panelet er lukket. Sæt{" "}
                <code className="bg-white/10 px-1.5 py-0.5 text-brand-200">ADMIN_PASSWORD</code> i
                Vercel og deploy igen.
              </p>
            </div>
          )}
        </section>

        <Link href="/" className={styles.loginFoot}>
          <ArrowLeftIcon className="h-4 w-4" />
          Til kestro.dk
        </Link>
      </div>
    </main>
  );
}
