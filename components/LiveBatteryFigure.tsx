"use client";

import { colourAt, rgb } from "@/lib/battery";
import { useBatterySweep } from "./useBatterySweep";

/**
 * The cell in the hero's spec list, filling and emptying.
 *
 * The same glass as the battery-health section below it: one light source
 * above and to the left, a tonal range across the chamber, a lit top edge and
 * a meniscus where the charge ends. Two batteries in two materials, one
 * directly above the other, is what makes a page look assembled.
 *
 * It reads the shared sweep, so the drawing and the figure on the line beside
 * it are the same number on every frame rather than two animations that happen
 * to have started together.
 */
export default function LiveBatteryFigure() {
  const value = useBatterySweep();
  const tone = colourAt(value);

  const x = 196;
  const y = 206;
  const w = 508;
  const h = 144;
  const fill = (w * value) / 100;

  return (
    <>
      <defs>
        <linearGradient id="spec-bat-void" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2438" />
          <stop offset="45%" stopColor="#0A1120" />
          <stop offset="100%" stopColor="#16203a" />
        </linearGradient>
        <linearGradient id="spec-bat-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgb(tone)} stopOpacity="0.7" />
          <stop offset="42%" stopColor={rgb(tone)} stopOpacity="1" />
          <stop offset="100%" stopColor={rgb(tone)} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="spec-bat-meniscus" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgb(tone)} stopOpacity="0" />
          <stop offset="72%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="spec-bat-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93A6CC" />
          <stop offset="26%" stopColor="#4B5872" />
          <stop offset="60%" stopColor="#212B42" />
          <stop offset="100%" stopColor="#0E1524" />
        </linearGradient>
        <clipPath id="spec-bat-chamber">
          <rect x={x} y={y} width={w} height={h} rx={20} />
        </clipPath>
      </defs>

      <g clipPath="url(#spec-bat-chamber)">
        <rect x={x} y={y} width={w} height={h} fill="url(#spec-bat-void)" />
        <rect x={x} y={y} width={fill} height={h} fill="url(#spec-bat-liquid)" />
        <rect x={x + fill - 28} y={y} width={28} height={h} fill="url(#spec-bat-meniscus)" />
      </g>

      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={20}
        fill="none"
        stroke="#B6C8F0"
        strokeOpacity="0.4"
        strokeWidth={2}
      />
      <path
        d={`M${x + 26} ${y + 20}H${x + w - 50}`}
        stroke="#FFFFFF"
        strokeOpacity="0.32"
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${x + 40} ${y + h - 14}H${x + w - 92}`}
        stroke="#FFFFFF"
        strokeOpacity="0.12"
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Caps, and the terminal at the positive end. */}
      <rect x={x - 26} y={y - 12} width={34} height={h + 24} rx={11} fill="url(#spec-bat-cap)" />
      <rect x={x + w - 8} y={y - 12} width={34} height={h + 24} rx={11} fill="url(#spec-bat-cap)" />
      <rect x={x + w + 26} y={y + 50} width={22} height={44} rx={7} fill="#465270" />
    </>
  );
}
