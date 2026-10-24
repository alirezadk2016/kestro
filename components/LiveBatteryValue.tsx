"use client";

import { colourAt, rgb } from "@/lib/battery";
import { useBatterySweep } from "./useBatterySweep";

/**
 * The figure on the battery line, moving with the drawing beside it.
 *
 * tabular-nums so the row does not twitch as the digits change, and the colour
 * comes from the same function the cell is filled with — a line reading 84 in
 * orange next to a blue cell is the kind of disagreement that makes a display
 * look broken without being nameable.
 */
export default function LiveBatteryValue({ label }: { label: string }) {
  const value = useBatterySweep();
  const shown = Math.round(value);

  return (
    <>
      {label}{" "}
      <span className="tabular-nums" style={{ color: rgb(colourAt(value)) }}>
        {shown} %
      </span>
    </>
  );
}
