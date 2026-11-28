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
 * Given an `href` it becomes one link, lifts, and takes a highlight that
 * tracks the pointer. Without one it is a static panel and none of that
 * applies — a card that does not go anywhere should not lift when you point
 * at it, which is the entire vocabulary of "this is clickable".
 *
 * `className` goes on the OUTERMOST element, not on the frame. With an href
 * the frame is wrapped by PointerLight, so a grid class landing on the frame
 * is a class on a child of the grid item and does nothing — which is exactly
 * what happened to the fleet card on the front page: lg:col-span-3 was
 * swallowed, the card took one column of twelve, and its heading wrapped to
 * one word a line. Layout belongs to whatever the parent grid can see.
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
  /* A div, not a span: the face holds headings, paragraphs and lists, and a
     span may only hold phrasing content. Inside the link it is still valid —
     an <a> takes whatever its parent could. */
  const face = (
    <div className={`forge-face flex h-full flex-col rounded-[8px] ${faceClassName}`}>
      {children}
    </div>
  );

  const frame = "forge forge-rim relative flex h-full flex-col rounded-xl p-[5px] sm:p-[6px]";

  if (!href) {
    return <div className={`${frame} ${className}`}>{face}</div>;
  }

  return (
    <PointerLight className={className}>
      <Link href={href} className={`${frame} tile tile-sheen group`}>
        {face}
      </Link>
    </PointerLight>
  );
}
