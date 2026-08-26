"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
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
  },
  en: {
    heading: "From supplier to desk",
    stepsLabel: "Steps in the preparation",
    more: "Read how",
  },
} satisfies Record<Lang, Record<string, string>>;

const posterAlt = {
  da: "Trin i klargøringen af en brugt erhvervscomputer, vist på en roterende karrusel",
  en: "Steps in preparing a used business computer, shown on a turning carousel",
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

export default function HeroReel({ lang, className }: { lang: Lang; className?: string }) {
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
        /* The scene resizes itself: with a post-processing chain there are
           render targets behind the canvas that have to follow it too. */
        scene.setSize(box.width, box.height);
      }

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(element);

      let frame = 0;
      const started = performance.now();
      let announced = -1;

      /*
       * Whether this device can afford the bloom and grade passes.
       *
       * There is no way to ask. Reading the GPU string is unreliable and
       * banned in some browsers, and the same model of phone performs
       * differently on a cold morning and a warm afternoon. So it is measured:
       * the first ninety drawn frames are timed, and if the median frame took
       * longer than a 36 fps budget the whole chain is dropped for the rest of
       * the session. A slightly plainer picture at full speed beats a filmic
       * one that stutters — the stutter is the thing people notice.
       */
      const samples: number[] = [];
      let previous = started;
      let judged = false;

      function draw(now: number) {
        frame = requestAnimationFrame(draw);
        if (!drawing.current || document.hidden) return;

        if (!judged) {
          /* Ignore the first few: shader compilation lands in them. */
          if (samples.length > 0 || now - started > 400) samples.push(now - previous);
          if (samples.length >= 90) {
            const sorted = [...samples].sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];
            if (median > 1000 / 36) scene.setPost(false);
            judged = true;
          }
        }
        previous = now;

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

  /*
   * The ring answers the scroll.
   *
   * A carousel that turns at its own pace regardless of what the reader does
   * is a screensaver. Tying it to the scroll is what makes the hero feel like
   * a camera move rather than a loop playing in the corner: the ring is
   * already turning slowly, and scrolling past pushes it along.
   *
   * The listener is passive and does no work of its own — it hands the delta
   * to the scene, which applies it inside the frame it was already drawing.
   * Skipped entirely when the canvas is not live, which includes everyone who
   * asked for less motion.
   */
  useEffect(() => {
    if (!wantsTheUpgrade(reduced)) return;

    let last = window.scrollY;

    function onScroll() {
      const now = window.scrollY;
      const delta = now - last;
      last = now;
      /* Roughly a sixth of a turn per screen scrolled: enough to feel
         connected, not so much that the reader outruns the captions. */
      reel.current?.nudge(delta * 0.0011);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    reel.current?.goTo(index);
  }, []);

  const frame = reelFrames[current];

  return (
    <div ref={holder} className={className}>
      {/*
        The ring runs wider than the column and out into the page gutter, which
        the hero clips. Contained neatly inside the column it reads as three
        pictures side by side; running off the edge it reads as a carousel with
        more of it out of shot.

        The bleed is on the canvas alone, not on the whole component. Putting
        it on the wrapper took the caption plate out over the edge with it and
        cut the counter off — the picture may leave the frame, the words may
        not.
      */}
      <div
        className="relative aspect-square w-full sm:aspect-[5/4] lg:-mr-[22%] lg:aspect-[16/10] lg:w-[122%]"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <Image
          src="/reel/reel-still.webp"
          alt={posterAlt[lang]}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
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

      {/*
        The caption, on a pane of glass of its own — the same material the
        header uses, tuned for a dark surface. It overlaps the picture box so
        it reads as sitting at the foot of the ring rather than as a paragraph
        that happens to follow it.

        A fixed minimum height, so the line does not jump the page about every
        few seconds as the ring turns, and aria-live so the change is announced
        rather than silently swapped.
      */}
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

        {/*
          Nine real buttons, not markers drawn on the canvas. This is how the
          carousel is stepped through with a keyboard, and how it is read at
          all when the canvas never loads.
        */}
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
                <span className="sr-only">
                  {step.name[lang]} &mdash; {step.alt[lang]}
                </span>
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
