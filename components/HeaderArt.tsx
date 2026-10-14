import Image from "next/image";

/*
 * The picture in an interior page's header.
 *
 * Every interior page opened as text alone — a trail, a title, a paragraph. Where the site
 * already has the artwork for a page's subject (the category renders, the
 * fleet room, the opened machine), the header shows it: beside the text on a
 * wide screen, and on a phone straight after the lead, so the first screen
 * has the thing the page is about in it. Pages with no artwork get none;
 * nothing is drawn for the occasion.
 *
 * The same well as the front page's pictures (.plate-well), and the image is
 * the header's largest element, so it is loaded eagerly.
 */
export default function HeaderArt({
  src,
  width,
  height,
  alt,
  className = "",
  imgClassName = "",
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  /** e.g. an object-position for a portrait picture in a landscape well. */
  imgClassName?: string;
}) {
  return (
    <div className={`plate-well overflow-hidden rounded-2xl ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={88}
        priority
        sizes="(min-width: 1024px) 480px, 92vw"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
