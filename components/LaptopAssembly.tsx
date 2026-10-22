"use client";

import { Box, Laptop, LoaderCircle, RotateCcw, Wrench } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { WebGLRenderer } from "three";
import type { Lang } from "@/lib/i18n";
import { stepAssemblyMotion } from "@/lib/laptop-motion.mjs";

type Assembly = {
  setProgress: (progress: number) => void;
  draw: (delta: number, immediate?: boolean) => void;
  camera: {
    aspect: number;
    updateProjectionMatrix: () => void;
    userData: { framingDistance: number };
  };
  dispose: () => void;
  orbitBy: (horizontal: number, vertical: number) => void;
  setHover: (horizontal: number, vertical: number) => void;
  resetOrbit: () => void;
  orbit: { yaw: number; pitch: number };
  moving: boolean;
};

const buttonClass =
  "flex h-11 w-11 flex-none items-center justify-center rounded border border-transparent text-paper/80 transition-colors hover:bg-paper/5 hover:text-paper aria-pressed:border-brand-300/40 aria-pressed:bg-brand-400/10 aria-pressed:text-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";

/** The workshop's interactive product view; the homepage uses a server-rendered still. */
export default function LaptopAssembly({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const controller = useRef<{
    target: (value: number, scrub: boolean) => void;
    reset: () => void;
  } | null>(null);
  const requested = useRef(0);
  const activate = useRef<() => void>(() => {});
  const [state, setState] = useState("static");
  const [target, setTarget] = useState(0);
  const instructionsId = useId();
  const labels =
    lang === "da"
      ? {
          model: "Interaktiv illustration af en bærbar computer til reparation",
          assembled: "Samlet computer",
          service: "Servicedele",
          separation: "Adskillelse",
          reset: "Nulstil visning",
          activate: "Åbn 3D-visning",
          loading: "Indlæser 3D-visning",
        }
      : {
          model: "Interactive illustration of a laptop for repair",
          assembled: "Assembled laptop",
          service: "Service components",
          separation: "Disassembly",
          reset: "Reset view",
          activate: "Open 3D view",
          loading: "Loading 3D view",
        };

  function choose(value: number, scrub = false) {
    requested.current = value;
    setTarget(value);
    controller.current?.target(value, scrub);
  }

  useEffect(() => {
    const element = canvas.current,
      view = viewport.current,
      figure = root.current,
      input = slider.current;
    if (!element || !view || !figure || !input) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    let disposed = false,
      starting = false,
      activated = false,
      generation = 0;
    let cleanup: (() => void) | undefined;

    async function start() {
      if (disposed || starting || !desktop.matches || reduced.matches || connection?.saveData)
        return;
      starting = true;
      setState("loading");
      const token = ++generation;
      let renderer: WebGLRenderer | undefined, assembly: Assembly | undefined;
      try {
        const [THREE, { createLaptopAssembly }] = await Promise.all([
          import("three"),
          import("@/lib/laptop-assembly-scene.mjs"),
        ]);
        if (disposed || !desktop.matches || reduced.matches || token !== generation) return;
        renderer = new THREE.WebGLRenderer({ canvas: element!, alpha: true, antialias: true });
        renderer.setClearAlpha(0);
        assembly = (await createLaptopAssembly(renderer)) as unknown as Assembly;
        if (disposed || !desktop.matches || reduced.matches || token !== generation) {
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

      const scene = assembly!,
        engine = renderer!;
      let frame = 0,
        previous = 0,
        velocity = 0,
        lastMotion = performance.now(),
        scrubUntil = 0;
      let visible = false,
        current = requested.current,
        destination = current;
      let pointer:
        { id: number; x: number; y: number; touch: boolean; dragging: boolean } | undefined;

      function draw(now: number) {
        frame = 0;
        if (!desktop.matches || reduced.matches) {
          motionChanged();
          return;
        }
        if (disposed || !visible || document.hidden) return;
        const delta = previous ? Math.max(0, (now - previous) / 1000) : 1 / 60;
        previous = now;
        const omega = now < scrubUntil ? 18 : 2.8;
        const motion = stepAssemblyMotion(current, velocity, destination, delta, omega);
        current = motion.position;
        velocity = motion.velocity;
        scene.setProgress(current);
        scene.draw(delta);
        figure!.dataset.assemblyProgress = current.toFixed(4);
        figure!.dataset.animationTime = now.toFixed(3);
        figure!.dataset.orbitYaw = scene.orbit.yaw.toFixed(4);
        figure!.dataset.framingDistance = scene.camera.userData.framingDistance.toFixed(4);
        if (now >= scrubUntil) input!.value = String(Math.round(current * 100));
        if (
          Math.abs(current - destination) + Math.abs(velocity) > 0.00015 ||
          scene.moving ||
          now - lastMotion < 250
        )
          frame = requestAnimationFrame(draw);
      }
      function schedule() {
        if (!desktop.matches || reduced.matches) {
          motionChanged();
          return;
        }
        if (!frame && visible && !document.hidden && desktop.matches && !reduced.matches) {
          previous = 0;
          frame = requestAnimationFrame(draw);
        }
      }
      function wake() {
        lastMotion = performance.now();
        schedule();
      }
      function resize() {
        if (!desktop.matches || reduced.matches) {
          motionChanged();
          return;
        }
        const bounds = element!.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        engine.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        engine.setSize(bounds.width, bounds.height, false);
        scene.camera.aspect = bounds.width / bounds.height;
        scene.camera.updateProjectionMatrix();
        wake();
      }
      const resetView = () => {
        scene.resetOrbit();
        wake();
      };
      controller.current = {
        target(value, scrub) {
          destination = value;
          scrubUntil = scrub ? performance.now() + 200 : 0;
          wake();
        },
        reset: resetView,
      };
      const onPointerDown = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || event.target !== element) return;
        pointer = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          touch: event.pointerType === "touch",
          dragging: false,
        };
        scene.setHover(0, 0);
        view!.focus({ preventScroll: true });
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!pointer) {
          if (event.pointerType !== "mouse" || event.target !== element) return;
          const box = view!.getBoundingClientRect();
          scene.setHover(
            ((event.clientX - box.left) / box.width) * 2 - 1,
            ((event.clientY - box.top) / box.height) * 2 - 1,
          );
          wake();
          return;
        }
        if (pointer.id !== event.pointerId) return;
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
        scene.orbitBy(-x * 0.006, pointer.touch ? 0 : y * 0.004);
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        wake();
      };
      const onPointerEnd = (event: PointerEvent) => {
        if (pointer && event.pointerId !== pointer.id) return;
        pointer = undefined;
        delete view!.dataset.dragging;
      };
      const onPointerLeave = () => {
        scene.setHover(0, 0);
        wake();
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (
          event.target !== view ||
          !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)
        )
          return;
        event.preventDefault();
        if (event.key === "Home") resetView();
        else
          scene.orbitBy(
            event.key === "ArrowLeft" ? -0.12 : event.key === "ArrowRight" ? 0.12 : 0,
            event.key === "ArrowUp" ? 0.08 : event.key === "ArrowDown" ? -0.08 : 0,
          );
        wake();
      };
      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else wake();
      };
      const onContextLost = (event: Event) => {
        event.preventDefault();
        cleanup?.();
        cleanup = undefined;
        setState("fallback");
      };

      resize();
      scene.setProgress(current);
      scene.draw(0, true);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(view!);
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      visibilityObserver.observe(view!);
      document.addEventListener("visibilitychange", onVisibility);
      element!.addEventListener("webglcontextlost", onContextLost);
      view!.addEventListener("pointerdown", onPointerDown);
      view!.addEventListener("pointermove", onPointerMove);
      view!.addEventListener("pointerup", onPointerEnd);
      view!.addEventListener("pointercancel", onPointerEnd);
      view!.addEventListener("lostpointercapture", onPointerEnd);
      view!.addEventListener("pointerleave", onPointerLeave);
      view!.addEventListener("keydown", onKeyDown);
      setState("ready");
      cleanup = () => {
        cancelAnimationFrame(frame);
        controller.current = null;
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        element!.removeEventListener("webglcontextlost", onContextLost);
        view!.removeEventListener("pointerdown", onPointerDown);
        view!.removeEventListener("pointermove", onPointerMove);
        view!.removeEventListener("pointerup", onPointerEnd);
        view!.removeEventListener("pointercancel", onPointerEnd);
        view!.removeEventListener("lostpointercapture", onPointerEnd);
        view!.removeEventListener("pointerleave", onPointerLeave);
        view!.removeEventListener("keydown", onKeyDown);
        scene.dispose();
        engine.dispose();
      };
    }

    const motionChanged = () => {
      if (!desktop.matches || reduced.matches) {
        generation++;
        cleanup?.();
        cleanup = undefined;
        starting = false;
        setState(desktop.matches ? "fallback" : "poster");
      } else if (activated) void start();
    };
    reduced.addEventListener("change", motionChanged);
    desktop.addEventListener("change", motionChanged);
    activate.current = () => {
      activated = true;
      void start();
    };
    setState(reduced.matches || connection?.saveData ? "fallback" : "poster");
    return () => {
      disposed = true;
      generation++;
      activate.current = () => {};
      reduced.removeEventListener("change", motionChanged);
      desktop.removeEventListener("change", motionChanged);
      cleanup?.();
    };
  }, []);

  return (
    <figure ref={root} className={`repair-laptop min-w-0 ${className}`} data-scene-state={state}>
      <span id={instructionsId} className="sr-only" hidden={state !== "ready"}>
        {lang === "da"
          ? "Brug piletasterne til at dreje modellen og Home til at nulstille visningen."
          : "Use the arrow keys to rotate the model and Home to reset the view."}
      </span>
      <div
        ref={viewport}
        className={`repair-laptop-viewport relative aspect-square max-h-[min(540px,65svh)] w-full min-w-0 ${state === "ready" ? "cursor-grab touch-pan-y select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper/70 data-[dragging=true]:cursor-grabbing motion-reduce:cursor-default" : ""}`}
        role={state === "ready" ? "group" : undefined}
        tabIndex={state === "ready" ? 0 : undefined}
        aria-label={state === "ready" ? labels.model : undefined}
        aria-describedby={state === "ready" ? instructionsId : undefined}
      >
        {/* The static poster remains visible on phones and without JavaScript.
            The renderer and its controls are still limited to desktop. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/models/laptop-repair.webp"
          alt={
            lang === "da"
              ? "Illustreret samlet bærbar med åbent display og tastatur"
              : "Illustrated assembled laptop with an open display and keyboard"
          }
          width={1200}
          height={1200}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 motion-reduce:transition-none motion-reduce:!opacity-100 ${state === "ready" ? "opacity-0" : "opacity-100"}`}
        />
        <canvas
          ref={canvas}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 motion-reduce:transition-none motion-reduce:!opacity-0 ${state === "ready" ? "opacity-100" : "opacity-0"}`}
        />
        {(state === "poster" || state === "loading") && (
          <button
            type="button"
            onClick={() => activate.current()}
            disabled={state === "loading"}
            aria-label={state === "loading" ? labels.loading : labels.activate}
            title={state === "loading" ? labels.loading : labels.activate}
            className="absolute bottom-4 right-4 hidden h-12 w-12 items-center justify-center rounded border border-white/25 bg-brand-950/95 text-paper shadow-lg transition-colors hover:border-brand-300 hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper disabled:cursor-wait motion-reduce:hidden lg:flex"
          >
            {state === "loading" ? (
              <LoaderCircle aria-hidden="true" size={23} className="animate-spin" />
            ) : (
              <Box aria-hidden="true" size={23} />
            )}
          </button>
        )}
      </div>
      <div
        className={`mt-2 hidden items-center gap-2 border-t border-paper/10 pt-2 motion-reduce:invisible motion-reduce:pointer-events-none lg:flex ${state === "ready" ? "" : "invisible pointer-events-none"}`}
        aria-hidden={state !== "ready"}
      >
        <button
          type="button"
          className={buttonClass}
          title={labels.assembled}
          aria-label={labels.assembled}
          aria-pressed={target === 0}
          disabled={state !== "ready"}
          onClick={() => choose(0)}
        >
          <Laptop size={19} aria-hidden="true" />
        </button>
        <input
          ref={slider}
          type="range"
          min={0}
          max={100}
          step={1}
          defaultValue={0}
          disabled={state !== "ready"}
          aria-label={labels.separation}
          title={labels.separation}
          className="h-11 min-w-0 flex-1 cursor-ew-resize accent-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          onChange={(event) => choose(Number(event.currentTarget.value) / 100, true)}
        />
        <button
          type="button"
          className={buttonClass}
          title={labels.service}
          aria-label={labels.service}
          aria-pressed={target === 1}
          disabled={state !== "ready"}
          onClick={() => choose(1)}
        >
          <Wrench size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={buttonClass}
          title={labels.reset}
          aria-label={labels.reset}
          disabled={state !== "ready"}
          onClick={() => controller.current?.reset()}
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>
    </figure>
  );
}
