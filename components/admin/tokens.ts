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
export const CARD = "border border-white/[0.07] bg-white/[0.028]";

/** The same, for a block that sits inside another one. */
export const INSET = "bg-white/[0.02]";

export const HAIRLINE = "border-white/[0.07]";

/** Small caps. One size and one tracking for every label in the panel. */
export const EYEBROW =
  "text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45";

/** Any figure. Tight tracking because these are set large, and tabular so a
    number changing under a live update does not shift the layout. */
export const FIGURE = "font-display font-extrabold tabular-nums tracking-[-0.02em]";
