"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  RESTING,
  SWEEP,
  clamp01,
  colourAt,
  rgb,
  type RGB,
} from "@/lib/battery";
import { type Lang } from "@/lib/i18n";

/**
 * Battery health, measured rather than asserted.
 *
 * The site's claim about batteries is that we give the capacity as a
 * percentage of new instead of "battery OK". This is that sentence as a
 * picture: a cell filling and emptying through the whole range, with the
 * colour, the figure and the position on the scale all moving together, so it
 * is obvious the number is a measurement on a scale and not a grade somebody
 * awarded.
 *
 * Everything animates from one value. There is no separate state for the
 * fill, the colour, the digits and the marker — four things easing on four
 * timelines is how a display like this ends up half a beat out of step with
 * itself.
 */

/* The three bands, and the exact wording they carry. */
const BANDS = [
  {
    id: "poor",
    from: 0,
    to: 79,
    range: "0–79%",
    title: "REPLACEMENT RECOMMENDED",
    note: "Reduced capacity · Shorter runtime",
    /* Deliberately lighter than the fill colour: the fill is a large shape and
       can be saturated, a caption is small text on a dark ground and has to
       clear 4.5:1 to be read at all. */
    text: "#FCA5A5",
  },
  {
    id: "good",
    from: 80,
    to: 89,
    range: "80–89%",
    title: "GOOD",
    note: "Reliable for everyday use",
    text: "#93AEFB",
  },
  {
    id: "excellent",
    from: 90,
    to: 100,
    range: "90–100%",
    title: "EXCELLENT",
    note: "Full performance · Extended runtime",
    text: "#86EFAC",
  },
] as const;

const bandFor = (value: number) =>
  value >= 90 ? BANDS[2] : value >= 80 ? BANDS[1] : BANDS[0];

/* How long a pointer or a keypress keeps the sweep out of the way. Long enough
   that reading a value you set yourself is not a race against the animation. */
const HOLD_MS = 2600;

const copy = {
  da: {
    heading: "BATTERY HEALTH",
    intro:
      "Vi måler batteriets faktiske kapacitet i procent af ny og skriver tallet på tilbuddet. Træk i skalaen for at se, hvad en given måling betyder.",
    scale: "Batteriets kapacitet i procent af ny",
  },
  en: {
    heading: "BATTERY HEALTH",
    intro:
      "We measure the battery's actual capacity as a percentage of new and put the figure in the quote. Drag the scale to see what a given measurement means.",
    scale: "Battery capacity as a percentage of new",
  },
} satisfies Record<Lang, { heading: string; intro: string; scale: string }>;

export default function BatteryHealth({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const [value, setValue] = useState(SWEEP.min);
  /*
   * Whether the sweep owns the value.
   *
   * A timestamp the loop compared against was the first attempt and it did not
   * hold: a click set the value, the loop kept running, and the next frame
   * wrote over it — measured, a click at 96% of the track read back 56. State
   * that tears the loop down is the version that cannot race, because while
   * somebody is holding the control there is no second writer at all.
   */
  const [auto, setAuto] = useState(true);
  const latest = useRef(SWEEP.min);
  const resume = useRef<number | undefined>(undefined);
  const frame = useRef(0);
  /* The track itself, not the padded box around it: the pointer has to map
     to the bar the reader can see, or the marker lands beside the finger. */
  const track = useRef<HTMLDivElement>(null);

  /*
   * One loop, driving one number.
   *
   * requestAnimationFrame rather than a CSS animation because the figure, the
   * colour and the marker all read from the same value — and because a
   * pointer has to be able to take it over mid-flight and hand it back.
   */
  latest.current = value;

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* No sweep at all for somebody who asked for no motion. The section is
         still worth having: a figure, and a scale they can move themselves. */
      setValue(RESTING);
      return;
    }

    /*
     * Pick up where the value already is.
     *
     * Restarting the clock from zero would snap the fill back to 55% the
     * moment the reader let go, which is the one thing a display like this
     * must never do. Inverting the easing gives the phase that matches the
     * current value, so the sweep continues from it.
     */
    const frac = clamp01((latest.current - SWEEP.min) / (SWEEP.max - SWEEP.min));
    const phase = Math.acos(1 - 2 * frac);
    const started = performance.now() - (phase / Math.PI) * SWEEP.seconds * 1000;

    const tick = (now: number) => {
      frame.current = requestAnimationFrame(tick);
      const t = ((now - started) / 1000 / SWEEP.seconds) * Math.PI;
      setValue(SWEEP.min + (SWEEP.max - SWEEP.min) * (0.5 - 0.5 * Math.cos(t)));
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [auto]);

  /** Take the value over, and hand it back once the reader has stopped. */
  const takeOver = useCallback(() => {
    setAuto(false);
    window.clearTimeout(resume.current);
    resume.current = window.setTimeout(() => setAuto(true), HOLD_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(resume.current), []);

  const setFromPointer = useCallback((clientX: number) => {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    takeOver();
    setValue(clamp01((clientX - box.left) / box.width) * 100);
  }, [takeOver]);

  const nudge = useCallback(
    (by: number) => {
      takeOver();
      setValue((v) => Math.min(100, Math.max(0, Math.round(v) + by)));
    },
    [takeOver],
  );

  const tone = colourAt(value);
  const band = bandFor(value);
  /* Rounded once, and everything reads the rounded figure. The digits saying
     87 while the marker sits at 86.6 is the kind of half-pixel disagreement
     that makes a display feel untrustworthy without being nameable. */
  const shown = Math.round(value);

  return (
    <section aria-labelledby="battery-health" className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="battery-health" className="eyebrow text-brand-300">
          {c.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-paper/60">{c.intro}</p>
      </div>

      <Cell value={value} tone={tone} />

      <p
        /* No colour transition. The value moves every frame, so the colour
           already changes continuously — a 150ms ease on top of that only made
           the digits lag the liquid, which is how the figure ended up reading
           83% in orange while the cell beside it was blue. */
        className="mt-6 text-center font-display text-[clamp(2.75rem,9vw,4.5rem)] font-extrabold leading-none tabular-nums tracking-tight"
        style={{ color: rgb(tone), textShadow: `0 0 42px ${rgb(tone, 0.45)}` }}
        aria-hidden="true"
      >
        {shown}
        <span className="ml-1 text-[0.45em] align-super">%</span>
      </p>

      {/*
       * The scale is the control.
       *
       * role="slider" rather than a styled <input type=range>: the track is
       * three proportional bands with their own colours and a glass marker,
       * and restyling a range input to that across browsers costs more than
       * implementing the five ARIA attributes and four key handlers that make
       * this one behave correctly.
       */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={c.scale}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shown}
        aria-valuetext={`${shown}% — ${band.title}`}
        onPointerDown={(e) => {
          /*
           * Set the value first, capture second.
           *
           * setPointerCapture throws NotFoundError when the pointer id is not
           * active, and an exception here used to abort the handler before the
           * value was ever set — so a click landed nowhere and the sweep, still
           * unheld, carried on as though nothing had been pressed. Measured:
           * clicking at 84% of the track read back 97.
           */
          setFromPointer(e.clientX);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            /* Dragging still works through the buttons check below. */
          }
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) setFromPointer(e.clientX);
        }}
        onPointerUp={(e) => {
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            /* Nothing was captured; nothing to release. */
          }
        }}
        onKeyDown={(e) => {
          const step =
            e.key === "ArrowRight" || e.key === "ArrowUp"
              ? 1
              : e.key === "ArrowLeft" || e.key === "ArrowDown"
                ? -1
                : 0;
          if (step) {
            e.preventDefault();
            nudge(step);
          }
        }}
        /* The gutter is the marker's radius. The track used to run to the edge of
           the box, so at 100% half the marker sat outside it — off the side of
           the screen on a phone, where there is no margin for it to spill into. */
        className="mx-auto mt-9 max-w-4xl cursor-ew-resize touch-none px-3.5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        <div ref={track} className="relative h-2 rounded-full">
          {/* Proportional, not three equal thirds: 0–79 is eighty points of a
              hundred and 80–89 is ten, so equal segments would put the marker
              somewhere its own label contradicts. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg,#B91C1C 0%,#F97316 62%,#F97316 79%,#3B82F6 80.5%,#3B82F6 89%,#22C55E 90.5%,#4ADE80 100%)",
            }}
          />
          {[79.5, 89.5].map((at) => (
            <span
              key={at}
              aria-hidden="true"
              className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-brand-950/70"
              style={{ left: `${at}%` }}
            />
          ))}
          <span
            aria-hidden="true"
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-brand-950/85 backdrop-blur-sm"
            style={{
              left: `${value}%`,
              borderColor: rgb(tone),
              boxShadow: `0 0 0 5px ${rgb(tone, 0.16)}, 0 0 22px ${rgb(tone, 0.55)}`,
            }}
          >
            <span
              className="absolute inset-1.5 rounded-full"
              style={{ background: rgb(tone) }}
            />
          </span>
        </div>

        <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
          {BANDS.map((b) => {
            const active = b.id === band.id;
            return (
              <li
                key={b.id}
                className={`text-center transition-opacity duration-200 ${active ? "opacity-100" : "opacity-45"}`}
              >
                <p className="text-sm font-semibold tabular-nums text-paper">{b.range}</p>
                <p
                  className="mt-1.5 text-sm font-bold uppercase tracking-[0.08em]"
                  style={{ color: b.text }}
                >
                  {b.title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-paper/55">{b.note}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/*
 * The cell.
 *
 * Glass is three things and none of them is a blur: a bright edge where the
 * light hits, a dark one where it does not, and a highlight that lies across
 * the surface rather than following the shape. The liquid sits behind all
 * three, which is what puts it inside the glass instead of on top of it.
 */
function Cell({ value, tone }: { value: number; tone: RGB }) {
  const W = 900;
  const H = 300;
  /* The chamber the liquid lives in, inset from the shell. */
  const x = 96;
  const y = 62;
  const w = 660;
  const h = 176;
  const fill = (w * value) / 100;
  const edge = x + fill;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto mt-10 w-full max-w-3xl"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* The empty part of the chamber. Not black: glass with nothing behind
            it still catches the room, and a flat black rectangle beside a lit
            one is the single thing that made this read as a filled bar rather
            than a cell you can see into. */}
        <linearGradient id="bh-void" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2438" />
          <stop offset="45%" stopColor="#0A1120" />
          <stop offset="100%" stopColor="#16203a" />
        </linearGradient>
        <linearGradient id="bh-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgb(tone)} stopOpacity="0.72" />
          <stop offset="42%" stopColor={rgb(tone)} stopOpacity="1" />
          <stop offset="100%" stopColor={rgb(tone)} stopOpacity="0.62" />
        </linearGradient>
        {/* The surface of the liquid, seen edge-on: bright where it meets the
            glass and falling away behind it. */}
        <linearGradient id="bh-meniscus" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgb(tone)} stopOpacity="0" />
          <stop offset="72%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="bh-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93A6CC" />
          <stop offset="26%" stopColor="#4B5872" />
          <stop offset="60%" stopColor="#212B42" />
          <stop offset="100%" stopColor="#0E1524" />
        </linearGradient>
        <radialGradient id="bh-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={rgb(tone)} stopOpacity="0.30" />
          <stop offset="55%" stopColor={rgb(tone)} stopOpacity="0.09" />
          <stop offset="100%" stopColor={rgb(tone)} stopOpacity="0" />
        </radialGradient>
        <clipPath id="bh-chamber">
          <rect x={x} y={y} width={w} height={h} rx={26} />
        </clipPath>
      </defs>

      {/* The light the cell throws. Tight to the body and centred on it, not
          on the moving edge — a halo that tracked the fill swung around the
          frame like a torch and read as a smudge rather than as glow. */}
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={430} ry={150} fill="url(#bh-halo)" />

      {/* Terminal, behind the right cap so the cap closes over its root. */}
      <rect x={x + w + 26} y={126} width={30} height={48} rx={9} fill="#465270" />

      <g clipPath="url(#bh-chamber)">
        <rect x={x} y={y} width={w} height={h} fill="url(#bh-void)" />
        <rect x={x} y={y} width={fill} height={h} fill="url(#bh-liquid)" />
        {/* 34px of surface rather than a hard white bar: the bar was a seam,
            this is a meniscus. */}
        <rect x={edge - 34} y={y} width={34} height={h} fill="url(#bh-meniscus)" />
      </g>

      {/* Glass, over the liquid: a bright top edge, a soft bottom bounce, and a
          specular streak lying across the surface instead of tracing it. */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={26}
        fill="none"
        stroke="#B6C8F0"
        strokeOpacity="0.4"
        strokeWidth="2"
      />
      <path
        d={`M${x + 30} ${y + 22} H${x + w - 64}`}
        stroke="#FFFFFF"
        strokeOpacity="0.34"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${x + 46} ${y + h - 18} H${x + w - 104}`}
        stroke="#FFFFFF"
        strokeOpacity="0.12"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Caps: overlapping the shell rather than butted against it, so they
          read as parts the body sits in. */}
      <rect x={x - 30} y={y - 14} width={40} height={h + 28} rx={13} fill="url(#bh-cap)" />
      <rect x={x + w - 10} y={y - 14} width={40} height={h + 28} rx={13} fill="url(#bh-cap)" />
    </svg>
  );
}
