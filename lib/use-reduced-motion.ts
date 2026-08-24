"use client";

import { useEffect, useState } from "react";

/**
 * Whether the visitor has asked their system for less motion.
 *
 * Only needed where the decision is a JavaScript one — whether to run a timer,
 * whether to download and start a WebGL scene. Anything that is purely a CSS
 * animation is handled by the prefers-reduced-motion block in globals.css
 * instead, which costs nothing and works before hydration.
 *
 * Starts at false and corrects itself after mount, because the server has no
 * way to know: rendering the reduced variant first would make the common case
 * flash.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const update = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
