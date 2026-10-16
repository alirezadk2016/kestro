import Image from "next/image";

/*
 * The picture in an interior page's header.
 *
 * Every interior page opened as text on navy — a trail, a title, a paragraph
 * — on a site whose front page argues with lit hardware. Where the site
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
  bleed = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  /** e.g. an object-position for a portrait picture in a landscape well. */
  imgClassName?: string;
  /**
   * On a phone, the page's ground rather than a picture in it: first in the
   * header, full width from under the glass bar, 4:3, fading out where the
   * title's glass panel overlaps its foot. The section must be pulled up
   * under the bar (max-md:-mt-[65px] max-md:pt-0) and the text after it must
   * carry .glass-card with a negative top margin. From md, nothing changes.
   */
  bleed?: boolean;
}) {
  const phone = bleed
    ? "under-bar art-bleed max-md:order-first max-md:-mx-4 max-md:mt-0 max-md:aspect-[4/3] sm:max-md:-mx-6"
    : "";
  return (
    <div className={`plate-well overflow-hidden rounded-2xl ${className} ${phone}`}>
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
