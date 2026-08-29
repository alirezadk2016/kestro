"use client";

import { useState } from "react";
import { interiorParts, swappableLabel, type InteriorPart } from "@/lib/machine-parts";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Lang } from "@/lib/i18n";

/*
 * The machine with the base plate off.
 *
 * Drawn rather than photographed, for three reasons: the 3D model has no
 * inside to show, a photograph of somebody else's teardown is somebody else's
 * photograph, and a drawing can be labelled, coloured to the brand and zoomed
 * into without going soft.
 *
 * The zoom is the SVG viewBox easing towards the selected part's rectangle, so
 * it is one animated attribute rather than a transform stack, and it stays
 * sharp at any magnification.
 */

const BOARD = { width: 1000, height: 640 };
/* Room around a part when zoomed in, so it is never cropped to its own edge. */
const PADDING = 90;

const copy = {
  da: {
    diagram: "Indersiden af en typisk 14-tommer erhvervsbærbar",
    all: "Vis det hele",
    what: "Hvad det er",
    upgrade: "Hvad der kan gøres",
    pick: "Vælg en del i tegningen",
    pickBody:
      "Tegningen viser, hvor delene sidder i en typisk 14-tommer erhvervsbærbar. Tryk på en del for at se, hvad den gør, og om den kan skiftes.",
    note: "Tegningen er en principskitse. Den præcise placering varierer fra model til model – spørg os om en konkret maskine.",
  },
  en: {
    diagram: "The inside of a typical 14-inch business laptop",
    all: "Show everything",
    what: "What it is",
    upgrade: "What can be done",
    pick: "Pick a part in the drawing",
    pickBody:
      "The drawing shows where the parts sit in a typical 14-inch business laptop. Tap a part to see what it does and whether it can be changed.",
    note: "The drawing is schematic. Exact placement varies between models — ask us about a specific machine.",
  },
} satisfies Record<Lang, Record<string, string>>;

/** Little repeated marks that make a rectangle read as a circuit board. */
function BoardDetail() {
  return (
    <g aria-hidden="true" opacity="0.5">
      {/* Traces */}
      {[60, 96, 132].map((y) => (
        <path
          key={y}
          d={`M 56 ${y} H 300 l 26 26 H 620 l 22 -22 H 956`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
      ))}
      {/* Mounting screws */}
      {[
        [52, 42],
        [948, 42],
        [52, 278],
        [948, 278],
        [500, 300],
        [104, 580],
        [788, 580],
      ].map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
}

/** The shapes that sit on top of a part's rectangle so it looks like the thing. */
function PartDetail({ id }: { id: string }) {
  if (id === "cooling") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55">
        <circle cx="150" cy="165" r="78" />
        <circle cx="150" cy="165" r="20" />
        {Array.from({ length: 9 }, (_, i) => {
          const angle = (i / 9) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M ${150 + Math.cos(angle) * 22} ${165 + Math.sin(angle) * 22}
                  Q ${150 + Math.cos(angle + 0.5) * 52} ${165 + Math.sin(angle + 0.5) * 52}
                    ${150 + Math.cos(angle + 0.35) * 76} ${165 + Math.sin(angle + 0.35) * 76}`}
            />
          );
        })}
        {/* Heat pipe running to the fins */}
        <path d="M 228 130 H 300 q 24 0 24 -24 V 96" strokeWidth="9" opacity="0.4" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={236 + i * 11} y1="212" x2={236 + i * 11} y2="258" />
        ))}
      </g>
    );
  }

  if (id === "ram") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6">
        <rect x="386" y="182" width="208" height="30" rx="2" />
        <rect x="386" y="220" width="208" height="30" rx="2" />
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={394 + i * 9} y1="206" x2={394 + i * 9} y2="212" />
        ))}
      </g>
    );
  }

  if (id === "storage") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6">
        <rect x="676" y="168" width="228" height="44" rx="2" />
        <rect x="700" y="180" width="52" height="22" rx="1" />
        <rect x="766" y="180" width="52" height="22" rx="1" />
        <circle cx="898" cy="190" r="6" />
      </g>
    );
  }

  if (id === "wifi") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6">
        <rect x="716" y="68" width="90" height="42" rx="2" />
        <path d="M 806 78 q 40 -18 76 -34" />
        <path d="M 806 100 q 40 6 76 -2" />
      </g>
    );
  }

  if (id === "cpu") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6">
        <rect x="352" y="74" width="146" height="58" rx="2" />
        <rect x="372" y="88" width="106" height="30" rx="1" />
      </g>
    );
  }

  if (id === "battery") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={124 + i * 226} y="352" width="206" height="186" rx="4" />
        ))}
        <path d="M 796 420 h 34" strokeWidth="6" />
      </g>
    );
  }

  if (id === "cmos") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6">
        <circle cx="886" cy="348" r="32" />
        <circle cx="886" cy="348" r="20" />
      </g>
    );
  }

  return null;
}

export default function MachineInside({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const [selected, setSelected] = useState<InteriorPart | null>(null);
  const reduced = useReducedMotion();

  /* Whole board when nothing is picked, the part's rectangle when one is. */
  const box = selected
    ? [
        selected.region.x - PADDING,
        selected.region.y - PADDING,
        selected.region.width + PADDING * 2,
        selected.region.height + PADDING * 2,
      ]
    : [0, 0, BOARD.width, BOARD.height];

  /* How far in the drawing is. 1 is the whole board. */
  const zoom = box[2] / BOARD.width;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="overflow-hidden border border-white/10 bg-brand-950">
          <svg
            viewBox={box.join(" ")}
            role="img"
            aria-label={c.diagram}
            className="block h-auto w-full text-brand-300"
            style={{
              transition: reduced ? undefined : "all 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Chassis */}
            <rect
              x="16"
              y="10"
              width="968"
              height="620"
              rx="14"
              fill="#0c1330"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            <BoardDetail />

            {interiorParts.map((part) => {
              const isSelected = selected?.id === part.id;
              const dimmed = selected !== null && !isSelected;

              return (
                <g
                  key={part.id}
                  onClick={() => setSelected(isSelected ? null : part)}
                  className="cursor-pointer"
                  opacity={dimmed ? 0.25 : 1}
                  style={{ transition: reduced ? undefined : "opacity 400ms ease" }}
                >
                  <rect
                    x={part.region.x}
                    y={part.region.y}
                    width={part.region.width}
                    height={part.region.height}
                    rx="6"
                    fill={isSelected ? "rgba(40,67,196,0.34)" : "rgba(147,169,239,0.07)"}
                    stroke="currentColor"
                    strokeOpacity={isSelected ? 1 : 0.45}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <PartDetail id={part.id} />

                  {/* Named on the drawing, not only in the list beside it —
                      "which one is the RAM" should be answerable by looking.
                      Scaled by the zoom so the text stays one size on screen
                      however far in the viewBox has travelled. */}
                  <text
                    x={part.label.x}
                    y={part.label.y}
                    fontSize={19 * zoom}
                    letterSpacing={2 * zoom}
                    className="pointer-events-none select-none font-semibold uppercase"
                    fill="currentColor"
                    fillOpacity={isSelected ? 1 : 0.65}
                  >
                    {part.short[lang]}
                  </text>

                  {/* Hit area on top of the detail, so thin strokes are still
                      easy to tap on a phone. */}
                  <rect
                    x={part.region.x}
                    y={part.region.y}
                    width={part.region.width}
                    height={part.region.height}
                    fill="transparent"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <p className="mt-4 text-xs leading-6 text-paper/50">{c.note}</p>
      </div>

      <div className="lg:col-span-5">
        {/* The same parts as a list. The drawing is the nice way in; this is
            the one that works with a keyboard, a screen reader and a glance. */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-pressed={selected === null}
            className={`inline-flex min-h-[40px] items-center border px-4 text-xs font-semibold tracking-tight transition ${
              selected === null
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-white/15 text-paper/65 hover:border-white/35 hover:text-paper"
            }`}
          >
            {c.all}
          </button>
          {interiorParts.map((part) => (
            <button
              key={part.id}
              type="button"
              onClick={() => setSelected(part)}
              aria-pressed={selected?.id === part.id}
              className={`inline-flex min-h-[40px] items-center border px-4 text-xs font-semibold tracking-tight transition ${
                selected?.id === part.id
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-white/15 text-paper/65 hover:border-white/35 hover:text-paper"
              }`}
            >
              {part.name[lang]}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          {selected ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-xl font-bold tracking-tight text-paper">
                  {selected.name[lang]}
                </h3>
                <span
                  className={`label px-2 py-1 ${
                    selected.swappable === "no"
                      ? "bg-white/10 text-paper/55"
                      : "bg-brand-500/15 text-brand-300"
                  }`}
                >
                  {swappableLabel[selected.swappable][lang]}
                </span>
              </div>

              <p className="mt-2 font-mono text-xs leading-6 text-paper/50">
                {selected.spec[lang]}
              </p>

              <p className="label mt-8 text-brand-300">{c.what}</p>
              <p className="mt-3 text-base leading-7 text-paper/65">{selected.what[lang]}</p>

              <p className="label mt-8 text-brand-300">{c.upgrade}</p>
              <p className="mt-3 text-base leading-7 text-paper/65">{selected.upgrade[lang]}</p>
            </>
          ) : (
            <>
              <h3 className="font-display text-xl font-bold tracking-tight text-paper">
                {c.pick}
              </h3>
              <p className="mt-3 text-base leading-7 text-paper/65">{c.pickBody}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
