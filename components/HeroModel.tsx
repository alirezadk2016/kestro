"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { reelFrames } from "@/lib/reel-frames";
import view from "@/lib/hero-view.json";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * The hero visual: the actual laptop model, turning slowly on its own —
 * the same scene lib/laptop-scene.mjs renders for the interactive viewer on
 * /maskinen and scripts/render-hero-still.mjs renders to the poster image.
 *
 * This replaces the earlier hero, a ring of photographs hung as panels and
 * drifted past the camera. A ring of stock photos swinging in a loop reads
 * as a carousel; a single product turning under real light reads as the
 * product. Same idea a laptop manufacturer's own product page uses, and it
 * is the same 3D asset the site already had — nothing new to build, source
 * or maintain.
 *
 * The caption underneath still steps through the six stages of an order,
 * each linked to the page that documents it — that content did not depend
 * on the ring, so it stays, just on its own timer instead of tied to the
 * model's rotation.
 */

const copy = {
  da: {
    heading: "Fra leverandør til skrivebord",
    stepsLabel: "Trin i klargøringen",
    more: "Læs hvordan",
    still: "Erhvervsbærbar computer",
  },
  en: {
    heading: "From supplier to desk",
    stepsLabel: "Steps in the preparation",
    more: "Read how",
    still: "Business laptop",
  },
} satisfies Record<Lang, Record<string, string>>;

const CYCLE_MS = 5000;

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
  const c = copy[lang];
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const laptop = useRef<Handle | null>(null);
  const [live, setLive] = useState(false);
  const [current, setCurrent] = useState(0);
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
      laptop.current = scene;

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
        laptop.current = null;
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

  /* The caption steps on its own clock now — nothing about it depended on
     the ring's rotation, only on a timer and the visitor's own clicks. */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setCurrent((i) => (i + 1) % reelFrames.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const goTo = useCallback((index: number) => setCurrent(index), []);

  const frame = reelFrames[current];

  return (
    <div ref={holder} className={className}>
      <div className="relative aspect-square w-full sm:aspect-[5/4] lg:aspect-[16/10]">
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
          alt={c.still}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
          className={`object-contain p-6 transition-opacity duration-700 sm:p-10 ${live ? "opacity-0" : "opacity-100"}`}
        />
        <canvas
          ref={canvas}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="glass-dark relative z-10 -mt-6 p-5 sm:-mt-8 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="eyebrow text-brand-300">{c.heading}</h2>
          <p className="label tabular-nums text-paper/60">
            {String(current + 1).padStart(2, "0")}&nbsp;&mdash;&nbsp;
            {String(reelFrames.length).padStart(2, "0")}
          </p>
        </div>

        <div aria-live="polite" className="mt-4 min-h-[8.5rem] sm:min-h-[7.5rem]">
          <p className="font-display text-lg font-bold tracking-tight text-paper">
            {frame.name[lang]}
          </p>
          <p className="mt-2 text-sm leading-6 text-paper/70">{frame.line[lang]}</p>
          <Link
            href={localePath(frame.href, lang)}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
          >
            {c.more}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <ol
          aria-label={c.stepsLabel}
          className="mt-1 flex flex-wrap gap-1 border-t border-paper/10 pt-1"
        >
          {reelFrames.map((step, index) => (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === current ? "true" : undefined}
                className="group flex h-11 w-7 items-center justify-center"
              >
                <span className="sr-only">{step.name[lang]}</span>
                <span
                  aria-hidden="true"
                  className={`w-0.5 transition-all duration-300 ${
                    index === current
                      ? "h-6 bg-brand-300 shadow-[0_0_12px_rgba(147,169,239,0.85)]"
                      : "h-3 bg-paper/30 group-hover:h-4.5 group-hover:bg-paper/70"
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
