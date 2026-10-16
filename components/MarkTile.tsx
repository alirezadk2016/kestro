import CraftMark, { SpecMark, type CraftMarkName, type SpecMarkName } from "./CraftMark";

/*
 * A mark in its tile. The only way a CraftMark is shown on this site, so the
 * set has one container at three sizes rather than seven hand-rolled ones —
 * see .mark-tile in globals.css.
 *
 *   sm  36px tile, 20px mark — inline beside a line of text
 *   md  44px tile, 24px mark — rows and lists
 *   lg  56px tile, 28px mark — a page's own mark beside its heading
 */
const SIZE = {
  sm: { tile: "h-9 w-9", mark: "h-5 w-5" },
  md: { tile: "h-11 w-11", mark: "h-6 w-6" },
  lg: { tile: "h-14 w-14 rounded-2xl", mark: "h-7 w-7" },
} as const;

type Props = { size?: keyof typeof SIZE; className?: string } & (
  | { name: CraftMarkName; spec?: never }
  | { spec: SpecMarkName; name?: never }
);

export default function MarkTile({ size = "md", className = "", ...props }: Props) {
  const s = SIZE[size];
  return (
    <span aria-hidden="true" className={`mark-tile ${s.tile} ${className}`}>
      {props.spec ? (
        <SpecMark name={props.spec} className={s.mark} />
      ) : (
        <CraftMark name={props.name as CraftMarkName} className={s.mark} />
      )}
    </span>
  );
}
