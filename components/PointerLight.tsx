"use client";

import { useCallback, useRef } from "react";

/*
 * The light that follows the pointer.
 *
 * A highlight that stays put is printed on the card; one that moves with the
 * viewer is reflected off it. That is the whole difference between a panel
 * with a gradient and a panel that reads as a surface, and it is two custom
 * properties.
 *
 * What this deliberately does NOT do:
 *
 *  - run on touch. A finger has no hover, so a pointer light on a phone is a
 *    smear that appears under the tap and stays there. `pointerType` is
 *    checked and anything that is not a mouse is left alone, which also means
 *    the card keeps the correct default lighting rather than a stuck one.
 *  - set state. This writes two CSS variables straight onto the node in a
 *    pointermove handler; putting them through React would re-render a card on
 *    every mouse position.
 *  - matter. --px and --py default to the top centre in globals.css, so the
 *    card is lit properly with no JavaScript at all and this only ever makes
 *    it better.
 */
export default function PointerLight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    node.style.setProperty("--px", `${((event.clientX - box.left) / box.width) * 100}%`);
    node.style.setProperty("--py", `${((event.clientY - box.top) / box.height) * 100}%`);
  }, []);

  const reset = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.removeProperty("--px");
    node.style.removeProperty("--py");
  }, []);

  return (
    <div ref={ref} className="tilt h-full" onPointerMove={move} onPointerLeave={reset}>
      {children}
    </div>
  );
}
