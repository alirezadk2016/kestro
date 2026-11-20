"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * A row that runs by itself on a phone and stops under a finger.
 *
 * Below md the strip under the hero is one line of facts moving right to
 * left, the way a news ticker runs under a broadcast. Hold it and it stops;
 * drag and it follows the finger both ways, with the throw carried on when
 * the finger lifts; let go and it picks up its own pace again. From md up
 * both wrappers are display: contents and the row is whatever grid the
 * caller laid out.
 *
 * It is a transform on a track, not scrollLeft on a scroller: iOS rounds
 * scroll offsets to whole pixels, so a row creeping at 32px a second moved
 * in visible one-pixel steps. The children are the list twice — the second
 * copy aria-hidden and inert — and the offset wraps by the width of one
 * copy, so the row never runs out.
 *
 * Without JavaScript the same markup is a plain horizontal scroller, so
 * every fact is still reachable with a swipe. With reduced motion it never
 * moves on its own and is still draggable. It also stands still while it is
 * off screen, while the tab is hidden, and while anything inside has focus,
 * which is the pause a keyboard user gets.
 */
const SPEED = 32; // px per second, leftward
const RESUME_AFTER = 1200; // ms of stillness after a release before it runs again

export default function Ticker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const view = viewport.current;
    const row = track.current;
    if (!view || !row) return;

    const phone = window.matchMedia("(max-width: 767px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    let offset = 0;
    let velocity = 0; // px/s from a throw, decaying into the cruise
    let held = false;
    let dragging = false;
    let pointerId = -1;
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastT = 0;
    let releasedAt = -Infinity;
    let inView = true;
    let focused = false;
    let setWidth = 0;
    let frame = 0;
    let previous = 0;

    /* The width of one copy of the set comes from the ResizeObserver, which
       reports it after layout. Reading getBoundingClientRect() here, straight
       after data-ticking changed the styles, forced a synchronous layout on
       every page load — PageSpeed's "forced reflow". */
    const first = row.firstElementChild as HTMLElement | null;

    const wrap = () => {
      if (setWidth <= 0) return;
      while (offset <= -setWidth) offset += setWidth;
      while (offset > 0) offset -= setWidth;
    };

    const paint = () => {
      row.style.transform = `translate3d(${offset}px,0,0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000 || 0);
      previous = now;
      if (!held) {
        if (Math.abs(velocity) > 4) {
          offset += velocity * dt;
          velocity *= Math.exp(-dt * 3.5);
        } else {
          velocity = 0;
          const resting = now - releasedAt < RESUME_AFTER;
          if (!calm.matches && inView && !focused && !resting && !document.hidden) {
            offset -= SPEED * dt;
          }
        }
        wrap();
        paint();
      }
      frame = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      held = true;
      dragging = false;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      lastT = e.timeStamp;
      startOffset = offset;
      velocity = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!held || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 6) {
        dragging = true;
        view.setPointerCapture?.(pointerId);
      }
      if (!dragging) return;
      const dt = (e.timeStamp - lastT) / 1000;
      if (dt > 0) velocity = 0.8 * ((e.clientX - lastX) / dt) + 0.2 * velocity;
      lastX = e.clientX;
      lastT = e.timeStamp;
      offset = startOffset + dx;
      wrap();
      paint();
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      held = false;
      pointerId = -1;
      // A press without a drag is a "hold"; a throw keeps its speed.
      if (!dragging || e.type === "pointercancel") velocity = 0;
      velocity = Math.max(-2400, Math.min(2400, velocity));
      dragging = false;
      releasedAt = performance.now();
    };

    // A drag that moved the row should not also follow a link underneath it.
    const onClick = (e: MouseEvent) => {
      if (Math.abs(offset - startOffset) > 6 && performance.now() - releasedAt < 300) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onFocusIn = () => (focused = true);
    const onFocusOut = (e: FocusEvent) => {
      if (!view.contains(e.relatedTarget as Node | null)) focused = false;
    };

    const seen = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting));
    const resize = new ResizeObserver(([entry]) => {
      setWidth = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      wrap();
      paint();
    });

    const start = () => {
      view.dataset.ticking = "";
      paint();
      previous = performance.now();
      frame = requestAnimationFrame(tick);
      view.addEventListener("pointerdown", onDown);
      view.addEventListener("pointermove", onMove);
      view.addEventListener("pointerup", onUp);
      view.addEventListener("pointercancel", onUp);
      view.addEventListener("click", onClick, true);
      view.addEventListener("focusin", onFocusIn);
      view.addEventListener("focusout", onFocusOut);
      seen.observe(view);
      if (first) resize.observe(first);
    };

    const stop = () => {
      delete view.dataset.ticking;
      cancelAnimationFrame(frame);
      row.style.transform = "";
      offset = 0;
      view.removeEventListener("pointerdown", onDown);
      view.removeEventListener("pointermove", onMove);
      view.removeEventListener("pointerup", onUp);
      view.removeEventListener("pointercancel", onUp);
      view.removeEventListener("click", onClick, true);
      view.removeEventListener("focusin", onFocusIn);
      view.removeEventListener("focusout", onFocusOut);
      seen.disconnect();
      resize.disconnect();
    };

    const sync = () => (phone.matches ? start() : stop());
    sync();
    phone.addEventListener("change", sync);
    return () => {
      phone.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <div ref={viewport} className={`ticker md:contents ${className}`}>
      <div ref={track} className="flex w-max will-change-transform md:contents">
        {children}
      </div>
    </div>
  );
}
