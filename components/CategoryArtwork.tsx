import Image from "next/image";
import { categoryMedia } from "@/lib/category-media";
import type { Lang } from "@/lib/i18n";
import MarkTile from "./MarkTile";

/** A consistent frame, preserving the entire device and the source's real identity. */
export default function CategoryArtwork({
  slug,
  lang,
  priority = false,
  sizes = "(min-width: 1024px) 24vw, 46vw",
  className = "",
}: {
  slug: string;
  lang: Lang;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const media = categoryMedia[slug];
  return (
    <div
      data-category-artwork={media.kind}
      className={`product-well relative flex aspect-[4/3] flex-none items-center justify-center overflow-hidden ${className}`}
    >
      {media.src ? (
        <Image
          src={media.src}
          width={media.width}
          height={media.height}
          alt={media.alt[lang]}
          sizes={sizes}
          priority={priority}
          /* A photo's white studio ground multiplies into the same pale well
             the drawings stand on. The drawings carry their own margin inside
             the SVG; a photo is cut close to the device, so it gets the same
             margin here, or a laptop and a dock fill their frames edge to
             edge while the monitor beside them stands back. */
          /* brightness lifts a studio ground of 252–254 to pure white first,
             so the multiply leaves no faint rectangle around the device. */
          className={`h-full w-full object-contain ${media.kind === "photo" ? "mix-blend-multiply brightness-[1.025]" : ""}`}
          style={media.kind === "photo" ? { padding: `${media.pad ?? 9}%` } : undefined}
        />
      ) : (
        <div role="img" aria-label={media.alt[lang]}>
          <MarkTile
            name={media.mark!}
            size="lg"
            className="!h-24 !w-24 !border-ink-200 !bg-paper !bg-none !shadow-none sm:!h-28 sm:!w-28 [&>svg]:!h-16 [&>svg]:!w-16 [&>svg]:text-ink-800 [&_.stroke-brand-300]:!stroke-brand-600"
          />
        </div>
      )}
    </div>
  );
}
