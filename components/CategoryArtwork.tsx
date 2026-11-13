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
      className={`relative flex aspect-[4/3] flex-none items-center justify-center overflow-hidden ${media.kind === "photo" ? "bg-paper" : "bg-paper-dim"} ${className}`}
    >
      {media.src ? (
        <Image
          src={media.src}
          width={media.width}
          height={media.height}
          alt={media.alt[lang]}
          sizes={sizes}
          priority={priority}
          className={`h-full w-full object-contain ${media.kind === "photo" ? "p-2" : ""}`}
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
