import { ReactNode } from "react";

/*
 * 1280 up to 2xl, then a proportional margin.
 *
 * The cap exists so a line of body copy never runs past a comfortable
 * measure, and at 1440 — where 1280 leaves 8% of air on each side — that is
 * exactly the proportion the hero artwork is drawn to. Past 1536 the same cap
 * stops being a measure and starts being a letterbox: on a 1942px screen it
 * left a fifth of the width empty on each side and pushed the headline from
 * the artwork's 8.9% out to 18.7%, so the page read as one designed for a
 * smaller screen and shown on this one.
 *
 * 8.2% is that same proportion continued. It is deliberately close to what
 * the 1280 cap gives at 1536, so nothing jumps at the breakpoint: 1275px of
 * content just above it against 1216px just below.
 */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-none 2xl:px-[8.2%] ${className}`}>{children}</div>
  );
}
