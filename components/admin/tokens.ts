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

/** A small label. Sentence case, like the site: tracked capitals on every
    label were a third of what made the panel read as a template. */
export const EYEBROW = "text-xs font-medium text-[color:var(--admin-muted)]";

/** Any figure. Tight tracking because these are set large, and tabular so a
    number changing under a live update does not shift the layout. */
export const FIGURE = "font-display font-extrabold tabular-nums tracking-[-0.02em]";

export const INPUT =
  "min-h-11 rounded-md border border-[color:var(--admin-control-border)] bg-[var(--admin-inset)] px-3 py-2 text-sm text-paper focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40";

export const BUTTON =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[color:var(--admin-control-border)] bg-[var(--admin-panel)] px-4 py-2 text-sm font-semibold text-paper transition-colors hover:border-brand-300 hover:bg-[var(--admin-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:text-paper/65";

export const PRIMARY_BUTTON =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-paper/70";

/*
 * The top of a list page, shared since 2026-11-21: a tab row for the list's
 * views and one search line. On a phone the tabs scroll sideways in one row
 * rather than wrapping into three, and the search label is for screen
 * readers, so the first result is near the top of the screen.
 */
export const TAB_BAR =
  "-mx-4 flex gap-1 overflow-x-auto border-b border-white/10 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0";

export const tabClass = (active: boolean) =>
  `-mb-px inline-flex min-h-[44px] flex-none items-center gap-2 border-b-2 px-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300 ${active ? "border-brand-400 font-semibold text-paper" : "border-transparent text-paper/70 hover:text-paper"}`;

export const tabCount = (active: boolean) =>
  `tabular-nums text-xs ${active ? "text-brand-200" : "text-paper/65"}`;

/** The search line: the field takes the row, the button sits beside it. */
export const SEARCH_ROW = "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2";

/** A page title, the same size on every page. */
export const PAGE_TITLE =
  "break-words font-display text-[1.625rem] font-extrabold leading-tight tracking-tight sm:text-[1.75rem]";
