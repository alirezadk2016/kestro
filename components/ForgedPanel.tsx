import Link from "next/link";
import PointerLight from "@/components/PointerLight";

/*
 * The panel with a machined edge: a lit frame holding a sunk face.
 *
 * .plate lights one lip and rings the shape, which is right for a panel that
 * is mostly type. A panel whose subject is an object wants an edge you could
 * run a thumbnail along, and that needs two surfaces at two depths — shadows
 * on one box cannot do it. .forge is the frame, .forge-face is what it holds;
 * both are in globals.css with the reasoning.
 *
 * Given an `href` it becomes one link, tilts, and takes a highlight that
 * tracks the pointer. Without one it is a static panel and none of that
 * applies — a card that does not go anywhere should not lift when you point
 * at it, which is the entire vocabulary of "this is clickable".
 */
export default function ForgedPanel({
  href,
  children,
  className = "",
  faceClassName = "p-4 sm:p-5",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  faceClassName?: string;
}) {
  const face = (
    <span className={`forge-face flex h-full flex-col rounded-[8px] ${faceClassName}`}>
      {children}
    </span>
  );

  if (!href) {
    return (
      <div
        className={`forge forge-rim relative flex h-full flex-col rounded-xl p-[5px] sm:p-[6px] ${className}`}
      >
        {face}
      </div>
    );
  }

  return (
    <PointerLight>
      <Link
        href={href}
        className={`forge forge-rim tile tile-sheen group relative flex h-full flex-col rounded-xl p-[5px] sm:p-[6px] ${className}`}
      >
        {face}
      </Link>
    </PointerLight>
  );
}
