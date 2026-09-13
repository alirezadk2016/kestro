import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/*
 * The one button on this site.
 *
 * There were at least six of them. The primary action was px-5, px-6, px-7 and
 * px-8; it was text-sm in the hero and text-base on the pricing page; it was
 * text-paper in some places and text-white in others; it was rounded-lg under
 * the hero and a hard-cornered white rectangle in the closing band — on the
 * single most important conversion moment on the front page, the button looked
 * like it came from a different site than the one above it.
 *
 * None of that was a decision. It is what happens when a button is written out
 * by hand at every call site, and it is the most reliable way to make a
 * careful site look careless: a visitor never counts the variants, they just
 * register that the pieces do not match.
 *
 * So: three intents and two sizes, and nothing else.
 *
 *   primary   — the one action a screen is asking for. Brand blue, filled.
 *   secondary — the alternative worth showing. Hairline on a faint surface.
 *   quiet     — "read more" at the end of a section. Type and an arrow.
 *
 * Every variant is at least 44px tall, which is the touch target floor, and
 * carries the same radius and the same arrow travel on hover, so the family
 * reads as one control in three weights rather than three controls.
 *
 * `arrow` defaults on for primary and secondary because the arrow is what
 * separates "this goes somewhere" from "this is a label"; turn it off for a
 * button that stays on the page.
 */
type Intent = "primary" | "secondary" | "quiet";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2.5 font-semibold tracking-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950";

const intents: Record<Intent, string> = {
  primary: "rounded-lg bg-brand-600 text-white hover:bg-brand-500",
  secondary:
    "rounded-lg border border-white/15 bg-white/[0.04] text-paper hover:border-white/35 hover:bg-white/[0.08]",
  /* No box, so no padding either — a quiet action sits on the baseline of the
     text around it rather than floating in its own rectangle. */
  quiet: "text-brand-300 hover:text-paper",
};

const sizes: Record<Size, string> = {
  md: "min-h-[44px] text-sm",
  lg: "min-h-[52px] text-sm sm:text-base",
};

const padding: Record<Size, string> = { md: "px-6", lg: "px-8" };

/*
 * The same classes, for the places that cannot use the component.
 *
 * A form's submit is a <button type="submit"> with disabled and loading
 * states, and a couple of call sites need extra layout classes on the control
 * itself. Those still have to look identical to a real button, so they take
 * the string from here rather than writing brand-600 out again by hand.
 */
export const buttonClass = (intent: Intent = "primary", size: Size = "md") =>
  `${base} ${sizes[size]} ${intents[intent]} ${intent === "quiet" ? "" : padding[size]}`;

export default function Button({
  href,
  intent = "primary",
  size = "md",
  arrow,
  icon,
  className = "",
  children,
}: {
  href: string;
  intent?: Intent;
  size?: Size;
  /** Defaults to on except for `quiet`, where the caller usually wants it too. */
  arrow?: boolean;
  /** Replaces the arrow, for an action whose meaning is not "forward". */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const showArrow = arrow ?? true;

  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${intents[intent]} ${
        intent === "quiet" ? "" : padding[size]
      } ${className}`}
    >
      {children}
      {icon ??
        (showArrow ? (
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2}
          />
        ) : null)}
    </Link>
  );
}
