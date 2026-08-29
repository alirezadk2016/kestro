"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import view from "@/lib/hero-view.json";
import type { Lang } from "@/lib/i18n";

/*
 * The hero visual: the laptop model, turning slowly on its own — the same
 * scene lib/laptop-scene.mjs renders for the interactive viewer on /maskinen
 * and scripts/render-hero-still.mjs renders to the poster image.
 *
 * Everyone gets the poster frame first, rendered from this very scene, so the
 * swap to WebGL is invisible. The upgrade is skipped for anyone who asked for
 * less motion, turned on data saver, or is on a low-memory device — a turning
 * laptop is worth a deferred WebGL chunk on a desk and is not worth it on a
 * phone on a metered connection.
 */

const alt = {
  da: "Erhvervsbærbar computer",
  en: "Business laptop",
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

type Handle = Awaited<ReturnType<typeof import("@/lib/laptop-scene.mjs").createLaptopScene>>;

export default function HeroModel({ lang, className }: { lang: Lang; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const reduced = useReducedMotion();
  const visible = useIsVisible(holder);

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

      let scene: Handle;
      try {
        scene = (await createLaptopScene(renderer, view, { spin: true })) as unknown as Handle;
      } catch {
        renderer.dispose();
        return;
      }
      if (disposed) {
        scene.dispose();
        renderer.dispose();
        return;
      }

      function resize() {
        const box = element!.getBoundingClientRect();
        if (!box.width || !box.height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(box.width, box.height, false);
        scene.camera.aspect = box.width / box.height;
        scene.camera.updateProjectionMatrix();
      }

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(element);

      let frame = 0;
      const started = performance.now();

      function draw(now: number) {
        frame = requestAnimationFrame(draw);
        if (!drawing.current || document.hidden) return;
        scene.draw((now - started) / 1000);
      }

      frame = requestAnimationFrame(draw);
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        scene.dispose();
        renderer.dispose();
      };
    }

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
    <div ref={holder} className={`relative ${className ?? ""}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 45%, rgba(84,116,236,0.24) 0%, rgba(66,92,200,0.08) 45%, transparent 74%)",
        }}
      />
      <Image
        src="/models/laptop-still.webp"
        alt={alt[lang]}
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 92vw"
        className={`object-contain transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
