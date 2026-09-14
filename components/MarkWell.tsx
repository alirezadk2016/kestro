import { type CraftMarkName } from "@/components/CraftMark";

/*
 * A mark as a rendered object, in the recess it is cut into.
 *
 * scripts/build/marks3d renders every CraftMark through the cards' own studio
 * — extruded, given side walls, lit by the same warm key and cool kicker. The
 * well is .well in globals.css: a raised edge is lit at the top and dark at
 * the bottom, so a sunk one is the other way up, and reversing those two lines
 * is the whole illusion.
 *
 * ## Why there is a size floor, and why it is 44
 *
 * Measured against a ladder at 28/36/44/56/72px, these are mush at 28, start
 * to read at 44 and are good at 56. A 3D icon in a small plate is strictly
 * WORSE than a flat one — more pixels spent on perspective and shading, fewer
 * on the shape that carries the meaning. So this component only exists at one
 * size, and anywhere that cannot give it 44px keeps CraftMark instead. The
 * list rows on /saelg-til-os are that case and they are right to.
 *
 * Shipping a 3D mark at 28 because it is "more 3D" would be the same mistake
 * the flat set made when it was composed at 96 and deployed at 24, which its
 * own header already records. Once was enough.
 *
 * Decorative: everywhere this is used, the thing it marks is named in words
 * immediately beside it.
 */
export default function MarkWell({
  mark,
  className = "",
}: {
  mark: CraftMarkName;
  className?: string;
}) {
  return (
    <span
      className={`well flex h-16 w-16 flex-none items-center justify-center rounded-xl sm:h-[72px] sm:w-[72px] ${className}`}
    >
      <img
        src={`/marks3d/${mark}.webp`}
        alt=""
        width={52}
        height={52}
        loading="lazy"
        decoding="async"
        className="h-11 w-11 sm:h-[52px] sm:w-[52px]"
      />
    </span>
  );
}
