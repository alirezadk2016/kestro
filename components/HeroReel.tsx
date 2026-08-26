"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Container from "./Container";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { reelFrames } from "@/lib/reel-frames";
import view from "@/lib/reel-view.json";
import { localePath, type Lang } from "@/lib/i18n";

/*
 * The reel in the hero: nine frames of a machine being made ready, hung as
 * panels in a dark studio and drifting slowly past the camera.
 *
 * The same arrangement as components/MachineViewer.tsx, and as the rotating
 * laptop this replaced in the hero. Every visitor gets the poster frame first
 * — a WebP
 * that scripts/render-reel-still.mjs renders from lib/reel-scene.mjs, the very
 * module this file draws live, so the swap to WebGL is invisible. The upgrade
 * is skipped entirely for anyone who asked for less motion, turned on data
 * saver, or is on a low-memory device: a drifting rail is worth roughly 300 kB
 * of deferred JavaScript on a desk in an office and is not worth it on a phone
 * on a metered connection.
 *
 * What the canvas is not allowed to be is the only way to read this. The
 * captions are DOM, in both languages, and the nine buttons under the reel are
 * real buttons — so the sequence can be stepped through with a keyboard, read
 * by a screen reader, and indexed, whether or not a single triangle is ever
 * drawn. The canvas is the presentation; the list is the content.
 */

const copy = {
  da: {
    heading: "Fra leverandør til skrivebord",
    stepsLabel: "Trin i klargøringen",
    more: "Læs hvordan",
    of: "af",
  },
  en: {
    heading: "From supplier to desk",
    stepsLabel: "Steps in the preparation",
    more: "Read how",
    of: "of",
  },
} satisfies Record<Lang, Record<string, string>>;

const posterAlt = {
  da: "Tre trin i klargøringen af en brugt erhvervscomputer, vist side om side",
  en: "Three steps in preparing a used business computer, shown side by side",
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

type Handle = Awaited<ReturnType<typeof import("@/lib/reel-scene.mjs").createReelScene>>;

export default function HeroReel({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reel = useRef<Handle | null>(null);
  const [live, setLive] = useState(false);
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();
  const visible = useIsVisible(holder);

  /* Read through a ref rather than as an effect dependency, so scrolling the
     hero out of view pauses the loop instead of tearing the scene down. */
  const drawing = useRef(true);
  drawing.current = visible;

  useEffect(() => {
    if (!wantsTheUpgrade(reduced)) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function start() {
      const [THREE, { createReelScene }] = await Promise.all([
        import("three"),
        import("@/lib/reel-scene.mjs"),
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

      const scene = await createReelScene(renderer, view);
      if (disposed) {
        scene.dispose();
        renderer.dispose();
        return;
      }
      reel.current = scene;

      function resize() {
        const box = element!.getBoundingClientRect();
        if (!box.width || !box.height) return;
        // Capped at 2 so a 3× phone screen does not render nine times the pixels.
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
      let announced = -1;

      function draw(now: number) {
        frame = requestAnimationFrame(draw);
        if (!drawing.current || document.hidden) return;
        scene.draw((now - started) / 1000);

        /* React only hears about the frame in front when it changes. Setting
           state every tick would re-render the caption sixty times a second
           for the fifty-nine of those where it says the same thing. */
        const active = scene.activeFrame();
        if (active !== announced) {
          announced = active;
          setCurrent(active);
        }
      }

      frame = requestAnimationFrame(draw);
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        scene.dispose();
        renderer.dispose();
        reel.current = null;
      };
    }

    /* Nothing about a decorative reel should compete with the page becoming
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

  /* Pointer position in the −1…1 range the raycaster wants. Passing it through
     the handle rather than through React state keeps it off the render path. */
  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    reel.current?.setPointer(
      ((event.clientX - box.left) / box.width) * 2 - 1,
      -((event.clientY - box.top) / box.height) * 2 + 1,
    );
  }, []);

  const onPointerLeave = useCallback(() => reel.current?.setPointer(null, 0), []);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    reel.current?.goTo(index);
  }, []);

  const frame = reelFrames[current];

  return (
    <div ref={holder} className="mt-11 sm:mt-14">
      {/* No eyebrow above this one. The hero's own eyebrow sits a few hundred
          pixels higher, and two rule-and-label rows that close together read
          as a template rather than as a page. */}
      <Container>
        <h2 className="font-display text-[clamp(1.25rem,2.2vw,1.625rem)] font-bold leading-tight tracking-display text-paper">
          {c.heading}
        </h2>
      </Container>

      {/* Full-bleed on purpose: a rail of panels boxed inside the text column
          reads as a widget, and the whole point is that it runs off both
          edges of the screen the way a banner does. */}
      <div
        className="relative mt-6 h-[46vw] max-h-[430px] min-h-[320px] w-full sm:mt-8"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <Image
          src="/reel/reel-still.webp"
          alt={posterAlt[lang]}
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
        />
        <canvas
          ref={canvas}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            live ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <Container>
        {/*
          The caption. A fixed minimum height so the line under the reel does
          not jump the page around every few seconds as the frames change, and
          aria-live so the change is announced rather than silently swapped.
        */}
        <div className="mt-6 grid gap-x-10 gap-y-6 sm:mt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div aria-live="polite" className="min-h-[7rem] max-w-xl sm:min-h-[6rem]">
            <p className="label text-brand-300">
              {String(current + 1).padStart(2, "0")} {c.of}{" "}
              {String(reelFrames.length).padStart(2, "0")}
              {/* A rule rather than a slash: at the weight this divider wants
                  to be, punctuation is text and has to clear 4.5:1, while a
                  decorative rule does not have to be legible at all. */}
              <span
                aria-hidden="true"
                className="mx-3 inline-block h-3 w-px translate-y-px bg-paper/30"
              />
              <span className="text-paper">{frame.name[lang]}</span>
            </p>
            <p className="mt-3 text-base leading-7 text-paper/70">{frame.line[lang]}</p>
            <Link
              href={localePath(frame.href, lang)}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-paper"
            >
              {c.more}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          {/*
            Nine real buttons, not dots drawn on the canvas. This is how the
            reel is stepped through with a keyboard, and how it is read at all
            when the canvas never loads.
          */}
          <ol aria-label={c.stepsLabel} className="flex flex-wrap gap-1.5 md:justify-end">
            {reelFrames.map((step, index) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={index === current ? "true" : undefined}
                  className="group flex h-11 w-8 items-center justify-center"
                >
                  <span className="sr-only">
                    {step.name[lang]} — {step.alt[lang]}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`w-0.5 transition-all duration-300 ${
                      index === current
                        ? "h-7 bg-brand-300 shadow-[0_0_12px_rgba(147,169,239,0.85)]"
                        : "h-3.5 bg-paper/30 group-hover:h-5 group-hover:bg-paper/70"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </div>
  );
}
