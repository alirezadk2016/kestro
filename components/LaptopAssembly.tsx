"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { WebGLRenderer } from "three";
import type { Lang } from "@/lib/i18n";

type Assembly = {
  setProgress: (progress: number, immediate?: boolean) => void;
  draw: (seconds: number) => void;
  camera: { aspect: number; updateProjectionMatrix: () => void };
  dispose: () => void;
  orbitBy: (horizontal: number, vertical: number) => void;
  resetOrbit: () => void;
  orbit: { yaw: number; pitch: number };
};

const css = `
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .laptop-assembly-story[data-scene-state="ready"] { min-height: 200svh; }
  .laptop-assembly-story[data-scene-state="ready"] .laptop-assembly-stage { position: sticky; top: 97px; min-height: calc(100svh - 113px); }
}
@media (max-width: 1023px) and (prefers-reduced-motion: no-preference) {
  .laptop-assembly-story[data-scene-state="ready"] .laptop-assembly-track { height: 140svh; }
  .laptop-assembly-story[data-scene-state="ready"] .laptop-assembly-viewport { position: sticky; top: 97px; }
}
`;

export default function LaptopAssembly({ lang, children }: { lang: Lang; children: ReactNode }) {
  const story = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const reset = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState("poster");

  useEffect(() => {
    const element = canvas.current;
    const root = story.current;
    const panel = stage.current;
    const rail = track.current;
    const view = viewport.current;
    const resetButton = reset.current;
    if (!element || !root || !panel || !rail || !view || !resetButton) return;

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
        const distance = Math.max(1, rail!.offsetHeight - view!.offsetHeight);
        return Math.min(1, Math.max(0, (97 - rail!.getBoundingClientRect().top) / distance));
      }

      function resize() {
        if (reduced.matches) {
          motionChanged();
          return;
        }
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
        if (reduced.matches) {
          motionChanged();
          return;
        }
        if (disposed || !visible || document.hidden) return;
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
        root!.dataset.orbitYaw = scene.orbit.yaw.toFixed(3);
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
      let pointer:
        { id: number; x: number; y: number; touch: boolean; dragging: boolean } | undefined;
      const onPointerDown = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || !(event.target instanceof HTMLCanvasElement))
          return;
        pointer = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          touch: event.pointerType === "touch",
          dragging: false,
        };
        view!.focus({ preventScroll: true });
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!pointer || pointer.id !== event.pointerId) return;
        const x = event.clientX - pointer.x,
          y = event.clientY - pointer.y;
        if (!pointer.dragging) {
          if (Math.hypot(x, y) < 5) return;
          if (pointer.touch && Math.abs(y) > Math.abs(x)) {
            pointer = undefined;
            return;
          }
          pointer.dragging = true;
          element!.setPointerCapture(event.pointerId);
          view!.dataset.dragging = "true";
        }
        scene.orbitBy(-x * 0.007, pointer.touch ? 0 : y * 0.005);
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        lastMotion = performance.now();
        schedule();
      };
      const onPointerEnd = (event: PointerEvent) => {
        if (pointer && event.pointerId !== pointer.id) return;
        pointer = undefined;
        delete view!.dataset.dragging;
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.target !== view) return;
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key))
          return;
        event.preventDefault();
        if (event.key === "Home") scene.resetOrbit();
        else
          scene.orbitBy(
            event.key === "ArrowLeft" ? -0.12 : event.key === "ArrowRight" ? 0.12 : 0,
            event.key === "ArrowUp" ? 0.08 : event.key === "ArrowDown" ? -0.08 : 0,
          );
        lastMotion = performance.now();
        schedule();
      };
      const onReset = () => {
        scene.resetOrbit();
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
      resizeObserver.observe(root!);
      resizeObserver.observe(rail!);
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
      view!.addEventListener("pointerdown", onPointerDown);
      view!.addEventListener("pointermove", onPointerMove);
      view!.addEventListener("pointerup", onPointerEnd);
      view!.addEventListener("pointercancel", onPointerEnd);
      view!.addEventListener("lostpointercapture", onPointerEnd);
      view!.addEventListener("keydown", onKeyDown);
      resetButton!.addEventListener("click", onReset);
      setState("ready");

      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        element!.removeEventListener("webglcontextlost", onContextLost);
        view!.removeEventListener("pointerdown", onPointerDown);
        view!.removeEventListener("pointermove", onPointerMove);
        view!.removeEventListener("pointerup", onPointerEnd);
        view!.removeEventListener("pointercancel", onPointerEnd);
        view!.removeEventListener("lostpointercapture", onPointerEnd);
        view!.removeEventListener("keydown", onKeyDown);
        resetButton!.removeEventListener("click", onReset);
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
        <div ref={track} className="laptop-assembly-track min-w-0">
          <div
            ref={viewport}
            className={`laptop-assembly-viewport relative aspect-square min-w-0 max-lg:max-h-[55svh] ${state === "ready" ? "cursor-grab touch-pan-y select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper/70 data-[dragging=true]:cursor-grabbing" : ""}`}
            role={state === "ready" ? "group" : undefined}
            tabIndex={state === "ready" ? 0 : undefined}
            aria-label={
              state === "ready"
                ? lang === "da"
                  ? "Interaktiv 3D-model af en illustreret erhvervsbærbar"
                  : "Interactive 3D model of an illustrated business laptop"
                : undefined
            }
          >
            <Image
              src="/models/laptop-assembly.webp"
              alt={
                lang === "da"
                  ? "Illustreret sort erhvervsbærbar med individuelle taster og rød TrackPoint"
                  : "Illustrated black business laptop with individual keys and red TrackPoint"
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
            <button
              ref={reset}
              type="button"
              hidden={state !== "ready"}
              title={lang === "da" ? "Nulstil visning" : "Reset view"}
              aria-label={lang === "da" ? "Nulstil 3D-visning" : "Reset 3D view"}
              className={`absolute bottom-2 right-2 ${state === "ready" ? "flex" : "hidden"} h-11 w-11 items-center justify-center rounded border border-paper/20 bg-ink/80 text-paper/80 transition-colors hover:border-paper/50 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper`}
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
