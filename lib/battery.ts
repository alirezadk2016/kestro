/**
 * What a capacity figure looks like, in one place.
 *
 * The bands are stated on the battery-health section, drawn in the cell beside
 * the hero's spec list, and used to colour the figure in that list. Three
 * copies of "80 is where blue starts" is three chances for one of them to be
 * 79, so the arithmetic lives here and the components render it.
 */

export type RGB = [number, number, number];

export const RED: RGB = [239, 68, 68];
export const ORANGE: RGB = [249, 115, 22];
export const BLUE: RGB = [59, 130, 246]; // brand-500, the Kestro blue
export const GREEN: RGB = [34, 197, 94];

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/**
 * The colour of a given capacity.
 *
 * The blend finishes on the boundary and starts half a point before it. A
 * window straddling the boundary is the obvious way to write this and it is
 * wrong: at exactly 80 — the first value of GOOD — the colour came out
 * rgb(106 126 190), a washed blue-grey halfway from orange, and 90 was teal
 * rather than green. Measured, both.
 *
 * Half a point is also exactly where a displayed figure rounds over, so every
 * integer a reader can see carries its own band's colour and the crossing is
 * still a ramp rather than a cut.
 */
export function colourAt(value: number): RGB {
  if (value < 79.5) return mix(RED, ORANGE, clamp01(value / 79.5));
  if (value < 80) return mix(ORANGE, BLUE, (value - 79.5) * 2);
  if (value < 89.5) return BLUE;
  if (value < 90) return mix(BLUE, GREEN, (value - 89.5) * 2);
  return GREEN;
}

export const rgb = (c: RGB, alpha = 1) =>
  alpha === 1 ? `rgb(${c[0]} ${c[1]} ${c[2]})` : `rgb(${c[0]} ${c[1]} ${c[2]} / ${alpha})`;

/** Low to high and back. Several seconds each way, eased by the cosine rather
    than by a curve laid over a linear ramp — the turn is where a loop like
    this gives itself away. */
export const SWEEP = { min: 55, max: 100, seconds: 7 };

/** What the figure shows when motion is turned down: the measured example. */
export const RESTING = 87;
