"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { WebGLRenderer } from "three";
import view from "@/lib/hero-view.json";
import { exteriorViews } from "@/lib/machine-parts";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Lang } from "@/lib/i18n";

/*
 * The machine, turnable.
 *
 * The hero shows the same model on a loop that nobody can touch. This is the
 * other half: pick a part and the camera travels to it, or take hold and turn
 * it yourself. Everything it needs — the poses, the copy — is in
 * lib/machine-parts.ts, and the scene itself is the same lib/laptop-scene.mjs
 * the hero and the poster renderer use.
 *
 * Without WebGL, or with reduced motion asked for, the canvas never appears
 * and the poster image stays. The part list next to it is plain text and a set
 * of buttons, so the page still says everything it has to say.
 */

const copy = {
  da: {
    hint: "Træk for at dreje",
    reset: "Nulstil",
    still: "Bærbar erhvervscomputer set udefra",
    fallback:
      "Din browser viser ikke 3D her. Beskrivelserne nedenfor gælder stadig – vælg en del for at læse om den.",
    checks: "Det tjekker vi",
  },
  en: {
    hint: "Drag to turn",
    reset: "Reset",
    still: "Business laptop seen from the outside",
    fallback:
      "Your browser is not showing 3D here. The descriptions below still apply — pick a part to read about it.",
    checks: "What we check",
  },
} satisfies Record<Lang, Record<string, string>>;

/*
 * The scene handle, as much of it as this component uses. Written out rather
 * than inferred because lib/laptop-scene.mjs is loaded through a dynamic
 * import; the type-only import of WebGLRenderer above is erased at build, so
 * neither costs anything in the bundle.
 */
type Laptop = {
  draw: (seconds: number) => void;
  setSpinning: (spinning: boolean, seconds?: number) => void;
  setTarget: (
    pose: Partial<{ yaw: number; pitch: number; distance: number; lid: number; lookY: number }>,
  ) => void;
  orbitBy: (yaw: number, pitch: number) => void;
  camera: { aspect: number; updateProjectionMatrix: () => void };
  dispose: () => void;
};

export default function MachineViewer({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const canvas = useRef<HTMLCanvasElement>(null);
  const laptop = useRef<Laptop | null>(null);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  /* Whether the canvas is close enough to the viewport to be worth the
     download. See the effect below. */
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(exteriorViews[0]);
  const reduced = useReducedMotion();

  /* Read inside the render loop, so changing it never restarts the scene. */
  const dragging = useRef(false);

  const select = useCallback((id: string) => {
    const next = exteriorViews.find((v) => v.id === id);
    if (!next) return;
    setActive(next);
    laptop.current?.setSpinning(false);
    laptop.current?.setTarget(next.pose);
  }, []);

  /*
   * three.js is ~736 kB of chunks, and it used to start downloading the moment
   * this component mounted — whether or not the canvas was ever on screen.
   * Measured on a 390px viewport at 4x CPU throttle, that put 1682 ms of long
   * tasks on /maskinen against 228-493 ms on every other page: the main thread
   * was busy parsing a renderer for a picture the visitor had not scrolled to.
   *
   * So the import waits for two things. The canvas has to be within 200 px of
   * the viewport — and on a short screen, or a visitor who never scrolls, that
   * alone means the renderer is never fetched at all. And the main thread has
   * to be idle: on this page the viewer sits about 790 px down, which is
   * inside a 900 px viewport, so the gate opens immediately and the work would
   * otherwise land straight on top of hydration and first paint. Waiting for
   * an idle callback moves it behind them without making anyone wait for it.
   *
   * The poster still underneath is the same image the no-WebGL path already
   * falls back to, so nothing above the fold changes and the scene is warm by
   * the time anyone reaches it.
   */
  useEffect(() => {
    if (reduced) return;

    const element = canvas.current;
    if (!element) return;

    /* No IntersectionObserver: load it rather than never show the scene. */
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    /* requestIdleCallback is not in Safari before 17, so fall back to a short
       timeout — the point is only to yield the thread, not to be precise. */
    const whenIdle: (run: () => void) => number =
      typeof window.requestIdleCallback === "function"
        ? (run) => window.requestIdleCallback(run, { timeout: 2000 })
        : (run) => window.setTimeout(run, 300);

    let scheduled: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        scheduled = whenIdle(() => setNear(true));
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (scheduled === undefined) return;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(scheduled);
      else window.clearTimeout(scheduled);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !near) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function start() {
      const element = canvas.current;
      if (!element) return;

      let scene: Laptop;
      let renderer: WebGLRenderer;

      try {
        const [THREE, { createLaptopScene }] = await Promise.all([
          import("three"),
          import("@/lib/laptop-scene.mjs"),
        ]);
        if (disposed) return;

        renderer = new THREE.WebGLRenderer({
          canvas: element,
          antialias: true,
          alpha: true,
          powerPreference: "default",
        });
        renderer.setClearAlpha(0);
        scene = (await createLaptopScene(renderer, view, { spin: false })) as unknown as Laptop;
      } catch {
        /* No WebGL, or the model did not load. The poster and the text remain. */
        if (!disposed) setFailed(true);
        return;
      }

      if (disposed) {
        scene.dispose();
        return;
      }

      laptop.current = scene;
      scene.setTarget(exteriorViews[0].pose);

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
        if (document.hidden) return;
        scene.draw((now - started) / 1000);
      }

      frame = requestAnimationFrame(draw);
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        scene.dispose();
        renderer.dispose();
        laptop.current = null;
      };
    }

    void start();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduced, near]);

  /* Pointer events rather than mouse and touch separately: one code path
     covers a mouse, a finger and a stylus, and setPointerCapture keeps the
     drag alive when the pointer leaves the canvas. */
  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!live) return;
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    laptop.current?.setSpinning(false);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging.current) return;
    laptop.current?.orbitBy(-event.movementX * 0.008, -event.movementY * 0.006);
  }

  function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="relative aspect-[4/3] select-none overflow-hidden bg-brand-950">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 45% at 50% 45%, rgba(84,116,236,0.28) 0%, rgba(66,92,200,0.10) 45%, transparent 72%)",
            }}
          />

          <Image
            src="/models/laptop-still.webp"
            alt={c.still}
            fill
            sizes="(min-width: 1024px) 58vw, 92vw"
            className={`object-contain transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
          />

          <canvas
            ref={canvas}
            aria-hidden="true"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
              live
                ? "cursor-grab opacity-100 active:cursor-grabbing"
                : "pointer-events-none opacity-0"
            }`}
          />

          {live && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4">
              <span className="label text-paper/60">{c.hint}</span>
              <button
                type="button"
                onClick={() => select(exteriorViews[0].id)}
                className="pointer-events-auto inline-flex min-h-[40px] items-center gap-2 border border-paper/20 px-4 text-xs font-semibold text-paper/70 transition hover:border-paper/50 hover:text-paper"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                {c.reset}
              </button>
            </div>
          )}
        </div>

        {failed && <p className="mt-4 text-sm leading-7 text-paper/50">{c.fallback}</p>}
      </div>

      <div className="lg:col-span-5">
        {/* Buttons rather than tabs: each one moves the camera and changes the
            text below, and both are useful without the other. */}
        <div className="flex flex-wrap gap-2">
          {exteriorViews.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => select(item.id)}
              aria-pressed={item.id === active.id}
              className={`inline-flex min-h-[40px] items-center border px-4 text-xs font-semibold tracking-tight transition ${
                item.id === active.id
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-white/15 text-paper/65 hover:border-white/35 hover:text-paper"
              }`}
            >
              {item.name[lang]}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <h3 className="font-display text-xl font-bold tracking-tight text-paper">
            {active.name[lang]}
          </h3>
          <p className="mt-3 text-base leading-7 text-paper/65">{active.summary[lang]}</p>

          <p className="label mt-8 text-brand-300">{c.checks}</p>
          <ul className="mt-4 space-y-3">
            {active.checks.map((check) => (
              <li key={check.da} className="flex gap-3 text-sm leading-7 text-paper/65">
                <span aria-hidden="true" className="mt-3 h-px w-4 flex-shrink-0 bg-brand-400" />
                {check[lang]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
