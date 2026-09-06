"use client";

import { bandFor, colourAt, rgb } from "@/lib/battery";
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
  const band = bandFor(value);
  const shown = Math.round(value);

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

      {/*
       * The reading, above the cell.
       *
       * The drawing shows how full it is; this says how full in a number, and
       * the line under the cell says what that number means. All three take
       * their colour from the same value, so a cell that has just gone blue
       * cannot be sitting under an orange figure.
       *
       * The band name uses the band's own lighter tone rather than the fill
       * colour: the fill is a large shape and can be saturated, this is small
       * text on a dark ground and has to clear 4.5:1 to be read.
       */}
      <text
        x={x + w / 2}
        y={188}
        textAnchor="middle"
        fontSize="46"
        fontWeight="800"
        fill={rgb(tone)}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {shown}
        <tspan fontSize="24" dy="-14">
          %
        </tspan>
      </text>

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

      <text
        x={x + w / 2}
        y={y + h + 30}
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        letterSpacing="2"
        fill={band.text}
      >
        {band.title}
      </text>
      <text
        x={x + w / 2}
        /* Twenty-four units clear of the figure's own caption. At the first
           spacing the range sat on top of "MÅLT KAPACITET, IKKE SKØNNET" and
           the two lines read as one smudged line. */
        y={y + h + 50}
        textAnchor="middle"
        fontSize="14"
        fontWeight="500"
        className="fill-paper/55"
      >
        {band.range}
      </text>
    </>
  );
}
