import Image from "next/image";
import type { Cluster } from "@/lib/guides";

/*
 * Decorative hub artwork: the cluster thumbnails, through next/image for
 * responsive delivery.
 */

/** 840x560 exports from the same masters as the guide covers. */
const plate: Record<Cluster, string> = {
  lifecycle: "/viden/k-lifecycle.webp",
  "buying-condition": "/viden/k-buying.webp",
  "memory-storage": "/viden/k-memory.webp",
  /* No guides sit here today, so it never renders; it takes the neutral one
     rather than a picture of something it is not about. */
  "workplace-hardware": "/cards/cat-monitors.webp",
  "uden-klynge": "/viden/k-other.webp",
};

export function VidenClusterPlate({
  cluster,
  index,
  className = "",
}: {
  cluster: Cluster;
  /** Shown in the index grid only. Inside a cluster the numbers on the right
      count articles, and two different counts in the same glyph read as one. */
  index?: string;
  className?: string;
}) {
  return (
    /* The aspect the SVG used to carry in its viewBox. A div has none of its
       own, and without this the card collapses to nothing before the image
       paints and jumps when it arrives. */
    <div className={`relative aspect-[224/150] w-full overflow-hidden ${className}`}>
      <Image
        src={plate[cluster]}
        alt=""
        fill
        quality={88}
        sizes="(min-width: 1024px) 288px, 46vw"
        className="object-cover"
      />

      {/* Kept as text rather than baked into the render: it stays sharp at any
          size, and the number is the card's position in the index, which the
          picture has no business knowing. */}
      {/* The plate number, on a chip rather than floating on the picture.
          Set straight onto the image it sat at 40% white over whatever the
          drawing happened to put underneath it — legible on one card and
          gone on the next. A chip carries its own ground, so the number
          reads the same on all four. */}
      {index && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 inline-flex items-center bg-ink-50 px-2 py-1 font-mono text-[11px] leading-none text-ink-700 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.10),inset_0_1px_0_0_rgb(255_247_233/0.16)] backdrop-blur-sm"
          style={{ letterSpacing: "0.14em" }}
        >
          {index}
        </span>
      )}
    </div>
  );
}
