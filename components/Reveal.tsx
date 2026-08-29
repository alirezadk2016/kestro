"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Sections arriving as they are scrolled to, rather than being already there.
 *
 * Mounted once in the layout and drawing nothing. The movement itself is in
 * globals.css; this only decides when each section has arrived.
 *
 * The hiding is conditional on `data-reveal-ready`, which this stamps on
 * <html> as its first act — so a page whose JavaScript never arrives, fails,
 * or is stripped by a proxy is a page with all its content on it rather than a
 * blank screen. Content that depends on JavaScript to become visible is
 * content that can disappear.
 *
 * It did disappear, and the way it happened is worth keeping written down.
 * This used to run once, on mount, with an empty dependency array. That is
 * correct for a page that is loaded, and wrong for a site: the layout does not
 * remount when a link is clicked, so on every client-side navigation the new
 * page's sections were marked `data-reveal`, <html> still carried
 * `data-reveal-ready` so the stylesheet still hid them, and nothing was left
 * running to reveal them. Every internal link led to a page that was blank
 * below the header, permanently, and scrolling did not help because the
 * listeners had been torn down when the first page finished. Keyed on the
 * pathname now, so each page gets its own pass.
 *
 * Two other things this has to get right, both learned rather than foreseen:
 *
 *   - An observer alone is not enough. IntersectionObserver reports threshold
 *     crossings it witnesses, and a jump — End, a restored scroll position, a
 *     fast flick on a phone — can carry a section from below the viewport to
 *     above it between two frames without ever intersecting. A swept pass runs
 *     alongside it and catches anything that has reached the fold however it
 *     got there.
 *   - Nothing may stay hidden. Whatever else goes wrong, the failsafe below
 *     reveals everything still waiting after ten seconds. It costs a section
 *     its entrance in the rare case a reader lingers at the top that long; it
 *     buys the guarantee that no visitor is ever looking at an empty page.
 *
 * Anyone who asked for less motion is left alone: the class is still added,
 * and the media query in globals.css means it carries no animation.
 */

/** How long to wait before deciding the machinery has failed and showing everything. */
const FAILSAFE_MS = 10000;

export default function Reveal() {
  const pathname = usePathname();

  /* The attribute's lifetime is the component's, not the route's. Removing it
     between pages would flash every section into view and back out again. */
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-reveal-ready", "");
    return () => root.removeAttribute("data-reveal-ready");
  }, []);

  useEffect(() => {
    const pending = new Set(Array.from(document.querySelectorAll("[data-reveal]")));
    if (pending.size === 0) return;

    let frame = 0;

    function reveal(target: Element) {
      target.classList.add("is-revealed");
      pending.delete(target);
      observer.unobserve(target);
      if (pending.size === 0) stop();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
      },
      /* Fires a little before the section's top edge arrives, so the movement
         finishes about when the reader gets there rather than starting then. */
      { rootMargin: "0px 0px -12% 0px", threshold: 0.02 },
    );

    /** Anything that has reached the fold, whether or not it was seen arriving. */
    function sweep() {
      frame = 0;
      const fold = window.innerHeight * 0.92;
      for (const target of Array.from(pending)) {
        if (target.getBoundingClientRect().top < fold) reveal(target);
      }
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(sweep);
    }

    const failsafe = window.setTimeout(() => {
      for (const target of Array.from(pending)) reveal(target);
    }, FAILSAFE_MS);

    function stop() {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      clearTimeout(failsafe);
    }

    for (const target of Array.from(pending)) observer.observe(target);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sweep();

    return stop;
  }, [pathname]);

  return null;
}
