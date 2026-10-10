import type { Cluster } from "@/lib/guides";

/*
 * The plates — the Viden hub's own graphic language.
 *
 * These were 600 lines of hand-built isometric SVG: planes, slabs, a lit face
 * per visible side, a contact shadow, an ambient glow. That was the right
 * answer while the alternative was flat wireframe, and it is the wrong answer
 * now that there are rendered plates. On a page whose whole subject is
 * machines, a drawing of a machine sits beside a photograph of one and loses.
 *
 * So they are renders, and the drawing code is gone rather than left behind as
 * something to maintain. What is kept is everything that was never the
 * drawing's job: the corner frame, the index number, the aspect the hub lays
 * out against.
 *
 * Backgrounds rather than <img>. These are decoration — every one sits beside
 * text that says the same thing — so the correct alt is the empty one, and a
 * CSS background has no alt to argue about with a checker. They are also
 * pre-sized to what they draw at, so there is nothing for an optimiser to do.
 *
 * Cost: 52 kB for all five, against about 3 kB of inline SVG. Paid once, on one
 * page, for the difference between a diagram of the subject and a picture of it.
 */

/** 224x150 plates, one per cluster, matched to what the cluster is about. */
const plate: Record<Cluster, string> = {
  lifecycle: "/viden/k-lifecycle.webp",
  "buying-condition": "/viden/k-buying.webp",
  "memory-storage": "/viden/k-memory.webp",
  /* No guides sit here today, so it never renders; it takes the neutral one
     rather than a picture of something it is not about. */
  "workplace-hardware": "/viden/k-other.webp",
  "uden-klynge": "/viden/k-other.webp",
};

/**
 * The drawing in the hub's masthead.
 *
 * The render leaves its left third almost black on purpose — that is where the
 * headline sits — so it needs no wash of its own beyond the one the page
 * already lays over it.
 */
export function VidenHeroPlate({
  className = "",
  /**
   * `wash` is the feathered plate that lies behind the masthead on a wide
   * screen. `band` is the same artwork as an actual picture — which is what a
   * phone needs, because at 390px the wash is bg-contain inside a mask that
   * removes three quarters of it, and what arrives is a few diagonal lines at
   * the right edge that read as dirt rather than as a graphic.
   */
  variant = "wash",
}: {
  className?: string;
  variant?: "wash" | "band";
}) {
  /*
   * Feathered, because a rectangle shows.
   *
   * The render's own ground is near-black and so is the hero's, but "near"
   * is not "same": the plate's edges drew a faint vertical seam down the
   * middle of the masthead and a horizontal one across the top, and once
   * seen they read as a pasted-in picture. The page's wash lies over the
   * left of it and does not reach the top or the right.
   *
   * One elliptical mask, not two linear ones. Two mask layers need
   * mask-composite: intersect to behave, and where that is unsupported the
   * default is add — which masks nothing at all and puts the seam back.
   */
  /*
   * Held to the right of the frame, not just faded at its edge.
   *
   * The first ellipse was centred at 62% and reached far enough left that the
   * plate's lit haze sat under the masthead's eyebrow: verify measured
   * rgb(147,174,251) on rgb(67,96,137), 2.96:1 against the 4.5 AA needs. The
   * drawing this replaced was thin strokes on nothing and never lifted the
   * ground under type. A render has a lit background, so it has to stop before
   * the text column rather than be washed over afterwards.
   */
  const feather =
    "radial-gradient(ellipse 58% 80% at 76% 50%, #000 30%, rgba(0,0,0,0.5) 62%, transparent 100%)";

  if (variant === "band") {
    return (
      <div
        aria-hidden="true"
        className={`plate-well bg-cover bg-center bg-no-repeat ${className}`}
        style={{ backgroundImage: "url(/viden/k-hero.webp)" }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`bg-contain bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url(/viden/k-hero.webp)",
        WebkitMaskImage: feather,
        maskImage: feather,
      }}
    />
  );
}

/** The plate on a cluster card in the hub's index. */
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
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${plate[cluster]})` }}
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
          className="pointer-events-none absolute left-3 top-3 inline-flex items-center bg-ink-950/70 px-2 py-1 font-mono text-[11px] leading-none text-paper/70 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.10),inset_0_1px_0_0_rgb(255_247_233/0.16)] backdrop-blur-sm"
          style={{ letterSpacing: "0.14em" }}
        >
          {index}
        </span>
      )}
    </div>
  );
}
