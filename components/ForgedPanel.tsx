import Link from "next/link";

/*
 * A card: one panel, or one link.
 *
 * It was a lit frame holding a sunk face, with a highlight that followed the
 * pointer and a tilt on hover — the machined language of the dark site. On
 * the light one it is the site's plain panel (.forge in globals.css, the same
 * surface as .plate), and a card that goes somewhere says so with a blue ring
 * and its prompt line, not with movement.
 *
 * Given an `href` it becomes one link. Without one it is a static panel — a
 * card that does not go anywhere should not answer when you point at it.
 *
 * `className` goes on the outermost element, so a grid class lands on the
 * grid item and not on a child of it.
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
    <span className={`forge-face flex h-full flex-col ${faceClassName}`}>{children}</span>
  );

  const frame = "forge relative flex h-full flex-col rounded-xl";

  if (!href) {
    return <div className={`${frame} ${className}`}>{face}</div>;
  }

  return (
    <Link href={href} className={`${frame} tile group ${className}`}>
      {face}
    </Link>
  );
}
