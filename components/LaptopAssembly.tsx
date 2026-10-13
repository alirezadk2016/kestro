"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { WebGLRenderer } from "three";
import type { Lang } from "@/lib/i18n";

type Assembly = {
  setProgress: (progress: number, immediate?: boolean) => void;
  draw: (seconds: number) => void;
  camera: { aspect: number; updateProjectionMatrix: () => void };
  dispose: () => void;
};

const css = `
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .laptop-assembly-story[data-scene-state="ready"] { min-height: 165svh; }
  .laptop-assembly-stage { position: sticky; top: 97px; min-height: calc(100svh - 113px); }
}
`;

export default function LaptopAssembly({ lang, children }: { lang: Lang; children: ReactNode }) {
  const story = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState("poster");

  useEffect(() => {
    const element = canvas.current;
    const root = story.current;
    const panel = stage.current;
    if (!element || !root || !panel) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    let starting = false;
    let generation = 0;

    async function start() {
      if (starting || disposed || reduced.matches || connection?.saveData) return;
      starting = true;
      const token = ++generation;
      let renderer: WebGLRenderer | undefined;
      let assembly: Assembly | undefined;
      try {
        const [THREE, { createLaptopAssembly }] = await Promise.all([
          import("three"),
          import("@/lib/laptop-assembly-scene.mjs"),
        ]);
        if (disposed || reduced.matches || token !== generation) return;
        renderer = new THREE.WebGLRenderer({ canvas: element!, alpha: true, antialias: true });
        renderer.setClearAlpha(0);
        assembly = (await createLaptopAssembly(renderer)) as unknown as Assembly;
        if (disposed || reduced.matches || token !== generation) {
          assembly.dispose();
          renderer.dispose();
          return;
        }
        if (renderer.getContext().isContextLost()) throw new Error("WebGL context lost");
      } catch {
        assembly?.dispose();
        renderer?.dispose();
        if (!disposed && token === generation) setState("fallback");
        return;
      }

      const scene = assembly!;
      const engine = renderer!;
      let frame = 0;
      let visible = false;
      let previous = 0;
      let target = 0;
      let current = 0;
      let measure = true;
      let lastMotion = performance.now();

      function progress() {
        if (window.innerWidth >= 1024) {
          const distance = Math.max(1, root!.offsetHeight - panel!.offsetHeight);
          return Math.min(1, Math.max(0, (97 - root!.getBoundingClientRect().top) / distance));
        }
        const bounds = element!.getBoundingClientRect();
        const start = Math.max(150, window.innerHeight - bounds.height - 32);
        return Math.min(1, Math.max(0, (start - bounds.top) / (start - 89)));
      }

      function resize() {
        const bounds = element!.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        engine.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
        engine.setSize(bounds.width, bounds.height, false);
        scene.camera.aspect = bounds.width / bounds.height;
        scene.camera.updateProjectionMatrix();
        measure = true;
        lastMotion = performance.now();
      }

      function draw(now: number) {
        frame = 0;
        if (disposed || !visible || document.hidden || reduced.matches) return;
        const delta = previous ? Math.min((now - previous) / 1000, 0.1) : 0.016;
        previous = now;
        if (measure) {
          target = progress();
          measure = false;
        }
        current += (target - current) * (1 - Math.exp(-delta / 0.12));
        scene.setProgress(current);
        scene.draw(now / 1000);
        root!.dataset.assemblyProgress = current.toFixed(3);
        if (Math.abs(target - current) > 0.001 || now - lastMotion < 1400) {
          frame = requestAnimationFrame(draw);
        }
      }

      function schedule() {
        if (!frame && visible && !document.hidden && !reduced.matches) {
          previous = 0;
          frame = requestAnimationFrame(draw);
        }
      }

      const onScroll = () => {
        measure = true;
        lastMotion = performance.now();
        schedule();
      };
      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else {
          measure = true;
          schedule();
        }
      };
      const onContextLost = (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(frame);
        frame = 0;
        visible = false;
        cleanup?.();
        cleanup = undefined;
        setState("fallback");
      };

      resize();
      current = target = progress();
      scene.setProgress(current, true);
      scene.draw(0);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(element!);
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure = true;
          schedule();
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      visibilityObserver.observe(element!);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      element!.addEventListener("webglcontextlost", onContextLost);
      setState("ready");

      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        element!.removeEventListener("webglcontextlost", onContextLost);
        scene.dispose();
        engine.dispose();
      };
    }

    const motionChanged = () => {
      if (reduced.matches) {
        generation++;
        cleanup?.();
        cleanup = undefined;
        setState("poster");
        starting = false;
      } else void start();
    };
    reduced.addEventListener("change", motionChanged);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void start();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    if (reduced.matches || connection?.saveData) setState("fallback");

    return () => {
      disposed = true;
      generation++;
      observer.disconnect();
      reduced.removeEventListener("change", motionChanged);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={story} className="laptop-assembly-story relative" data-scene-state={state}>
      <style>{css}</style>
      <div
        ref={stage}
        className="laptop-assembly-stage grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
      >
        <div className="relative aspect-[4/3] min-w-0 max-lg:max-h-[65svh] lg:aspect-square">
          <Image
            src="/models/laptop-assembly.webp"
            alt={
              lang === "da"
                ? "Illustreret erhvervsbærbar med skærm, tastatur, RAM, SSD, batteri og bundplade i separate lag"
                : "Illustrated business laptop with display, keyboard, memory, SSD, battery and base in separate layers"
            }
            fill
            quality={88}
            sizes="(min-width: 1536px) 40vw, (min-width: 1024px) 560px, 92vw"
            className={`object-contain transition-opacity duration-300 motion-reduce:transition-none ${state === "ready" ? "opacity-0" : "opacity-100"}`}
          />
          <canvas
            ref={canvas}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 motion-reduce:transition-none ${state === "ready" ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
