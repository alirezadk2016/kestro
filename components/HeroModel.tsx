"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import view from "@/lib/hero-view.json";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * The laptop in the hero.
 *
 * Every visitor gets the poster frame first: a WebP that
 * scripts/render-hero-still.mjs renders from lib/laptop-scene.mjs — the same
 * module this file draws live — at frame zero of the same cycle. Nothing here
 * blocks it. The WebGL canvas is an upgrade that loads afterwards and fades in
 * on the identical view, so the swap is invisible.
 *
 * This file owns when and whether to render. What gets rendered lives in
 * lib/laptop-scene.mjs, so the poster and the canvas cannot drift apart.
 *
 * The upgrade is skipped — poster frame only, forever — when the visitor asked
 * for less motion, turned on data saver, or is on a low-memory device. A
 * rotating laptop is worth roughly 300 kB of deferred JavaScript on a desk in
 * an office; it is not worth it on a phone on a metered connection.
 */

const alt = {
  da: "Bærbar erhvervscomputer, sat op til nordisk brug",
  en: "Business laptop, set up for Nordic use",
} satisfies Record<Lang, string>;

/* The hero's laptop is ambient — it turns on its own and takes no input. The
   one that can be turned by hand lives on its own page, and this is the way
   in: the whole thing is a link, with a label that appears on hover. */
const explore = {
  da: "Se maskinen del for del",
  en: "See the machine part by part",
} satisfies Record<Lang, string>;

/** A tab in the background should not be spending the visitor's battery. */
function useIsVisible(ref: React.RefObject<Element>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

function wantsTheUpgrade(reduced: boolean) {
  if (reduced) return false;
  if (typeof navigator === "undefined") return false;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memory === "number" && memory < 4) return false;

  return true;
}

export default function HeroModel({ lang, className }: { lang: Lang; className?: string }) {
  const holder = useRef<HTMLAnchorElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const reduced = useReducedMotion();
  const visible = useIsVisible(holder);

  /*
   * Whether the canvas should be drawing right now. The render loop reads it
   * through a ref rather than a dependency, so scrolling the hero out of view
   * pauses the loop instead of tearing down the scene and rebuilding it.
   */
  const drawing = useRef(true);
  drawing.current = visible;

  useEffect(() => {
    if (!wantsTheUpgrade(reduced)) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function start() {
      const [THREE, { createLaptopScene }] = await Promise.all([
        import("three"),
        import("@/lib/laptop-scene.mjs"),
      ]);
      const element = canvas.current;
      if (disposed || !element) return;

      const renderer = new THREE.WebGLRenderer({
        canvas: element,
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setClearAlpha(0);

      const laptop = await createLaptopScene(renderer, view);
      if (disposed) {
        laptop.dispose();
        renderer.dispose();
        return;
      }

      function resize() {
        const box = element!.getBoundingClientRect();
        if (!box.width || !box.height) return;
        // Capped at 2 so a 3× phone screen does not render nine times the pixels.
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(box.width, box.height, false);
        laptop.camera.aspect = box.width / box.height;
        laptop.camera.updateProjectionMatrix();
      }

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(element);

      let frame = 0;
      const started = performance.now();

      function draw(now: number) {
        frame = requestAnimationFrame(draw);
        if (!drawing.current || document.hidden) return;
        laptop.draw((now - started) / 1000);
      }

      frame = requestAnimationFrame(draw);
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        laptop.dispose();
        renderer.dispose();
      };
    }

    /* Nothing about a decorative laptop should compete with the page becoming
       interactive, so the whole thing waits for an idle moment. */
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void start(), { timeout: 3000 })
      : window.setTimeout(() => void start(), 1200);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      clearTimeout(idle);
      cleanup?.();
    };
  }, [reduced]);

  return (
    <Link
      href={localePath("/maskinen", lang)}
      ref={holder}
      aria-label={explore[lang]}
      className={`group relative block aspect-[4/3] ${className ?? ""}`}
    >
      {/* Backlight. The chassis is nearly as dark as the hero behind it — the
          machine is meant to be dark — so it needs something behind it to have
          a silhouette at all. This is the glow every product shot of a black
          laptop is lit with, and it costs one gradient. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 52% 44%, rgba(84,116,236,0.30) 0%, rgba(66,92,200,0.11) 45%, transparent 72%)",
        }}
      />

      {/* Contact shadow. Without something under it the laptop reads as a
          cut-out pasted onto the navy rather than an object standing on a
          surface, and a real shadow pass would cost frames for the same. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] bottom-[8%] h-[14%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(4,8,26,0.55) 0%, rgba(4,8,26,0) 70%)",
        }}
      />
      <Image
        src="/models/laptop-still.webp"
        alt={alt[lang]}
        fill
        priority
        sizes="(min-width: 1024px) 40vw, 90vw"
        className={`object-contain transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[6%] flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="inline-flex min-h-[40px] items-center border border-paper/25 bg-brand-950/70 px-5 text-xs font-semibold tracking-tight text-paper backdrop-blur-sm">
          {explore[lang]}
        </span>
      </span>
    </Link>
  );
}
