"use client";

import { useEffect } from "react";

/*
 * Sections arriving as they are scrolled to, rather than being already there.
 *
 * Mounted once in the layout and drawing nothing. The movement itself is in
 * globals.css; this only decides when each section has arrived.
 *
 * The hiding is deliberately conditional. This stamps `data-reveal-ready` on
 * <html> as its first act, and only then does the CSS hide anything — so if
 * the script never runs, fails, or is stripped by a proxy, the page is a page
 * with all its content visible rather than a screen of nothing. Content that
 * depends on JavaScript to become visible is content that can disappear.
 *
 * An observer alone is not enough, which is the part that is easy to get
 * wrong. IntersectionObserver reports threshold crossings it actually
 * witnesses, and a jump — End, a restored scroll position, a link into the
 * middle of the page, a fast flick on a phone — can carry a section from below
 * the viewport to above it between two frames without ever intersecting. Those
 * sections would stay invisible for as long as the visitor stayed on the page.
 * So a swept pass runs alongside it and reveals anything that has reached the
 * fold, however it got there. Both write the same class, both stop once every
 * section has arrived.
 *
 * Anyone who asked for less motion is left alone: the class is still added,
 * and the media query in globals.css means it carries no animation.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-reveal-ready", "");

    const pending = new Set(Array.from(document.querySelectorAll("[data-reveal]")));
    if (pending.size === 0) {
      root.removeAttribute("data-reveal-ready");
      return;
    }

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

    function stop() {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    for (const target of Array.from(pending)) observer.observe(target);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sweep();

    return () => {
      stop();
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
