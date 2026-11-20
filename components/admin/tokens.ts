/**
 * The panel's visual constants, written down once.
 *
 * Not a theme system — the panel is small enough that one would be overhead.
 * It is the four or five decisions that have to be the same everywhere for a
 * screen to look designed rather than assembled: what a raised surface is,
 * what a hairline is, how a small label is set, how a number is set.
 *
 * The first version of this panel had cards the same colour as the page with
 * one-pixel gaps between them. Nothing was raised, so nothing was grouped, and
 * every block carried the same weight as every other — which is most of what
 * made it read as unfinished.
 */

/** A raised block. Light over the dark ground rather than a second colour, so
    the surface stays in the brand's single hue at every depth. */
export const CARD = "rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)]";

/** The same, for a block that sits inside another one. */
export const INSET = "bg-[var(--admin-inset)]";

export const HAIRLINE = "border-[color:var(--admin-border)]";

/** Small caps. One size and one tracking for every label in the panel. */
export const EYEBROW =
  "text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--admin-muted)]";

/** Any figure. Tight tracking because these are set large, and tabular so a
    number changing under a live update does not shift the layout. */
export const FIGURE = "font-display font-extrabold tabular-nums tracking-[-0.02em]";

export const INPUT =
  "min-h-11 rounded-md border border-[color:var(--admin-control-border)] bg-[var(--admin-inset)] px-3 py-2 text-sm text-paper focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40";

export const BUTTON =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[color:var(--admin-control-border)] bg-[var(--admin-panel)] px-4 py-2 text-sm font-semibold text-paper transition-colors hover:border-brand-300 hover:bg-[var(--admin-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:text-paper/65";

export const PRIMARY_BUTTON =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-paper/70";
