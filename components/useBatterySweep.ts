"use client";

import { useEffect, useState } from "react";

import { SWEEP, RESTING } from "@/lib/battery";

/**
 * One clock, however many things are reading it.
 *
 * The figure in the hero's spec list and the number on the line beside it are
 * two components in two places in the tree, and they have to agree on every
 * frame — a drawing at 64% next to a label reading 71% is worse than either of
 * them being static. Two independent requestAnimationFrame loops would drift
 * the moment one of them mounted a frame later than the other, so there is one
 * loop in this module and both components subscribe to it.
 *
 * The loop only runs while something is subscribed, and stops when the last
 * subscriber leaves.
 */
let current = SWEEP.min;
let frame = 0;
let started = 0;
const listeners = new Set<(value: number) => void>();

function tick(now: number) {
  frame = requestAnimationFrame(tick);
  const t = ((now - started) / 1000 / SWEEP.seconds) * Math.PI;
  current = SWEEP.min + (SWEEP.max - SWEEP.min) * (0.5 - 0.5 * Math.cos(t));
  listeners.forEach((notify) => notify(current));
}

export function useBatterySweep(): number {
  /* Starts on the resting figure so the server markup and the first client
     render agree — a value that differs between them is a hydration error, and
     this one would be on the front page. */
  const [value, setValue] = useState(RESTING);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    listeners.add(setValue);
    if (listeners.size === 1) {
      started = performance.now();
      frame = requestAnimationFrame(tick);
    } else {
      setValue(current);
    }

    return () => {
      listeners.delete(setValue);
      if (listeners.size === 0) cancelAnimationFrame(frame);
    };
  }, []);

  return value;
}
