/**
 * The Kestro mark.
 *
 * Drawn as inline SVG rather than loaded as a file: it is a handful of
 * polygons, it costs no request, it stays sharp at any size, and the tone can
 * be swapped without shipping a second asset.
 *
 * The geometry is a K built from three pieces, the way the brand board reads
 * it — a solid stem, an arm pointing forward, and a fold where the two meet.
 * Every place on the site that shows the mark comes through here, so replacing
 * it with the designer's original vector is one edit to this file.
 */

/** Which way the mark is coloured for the surface it sits on. */
export type LogoTone = "brand" | "light" | "dark";

const VIEW_BOX = "0 0 114 100";

/*
 * Two path shapes and a stem. Kept as constants so the tones below cannot
 * drift apart — a mono variant that traced slightly different geometry would
 * be a second logo.
 */
const STEM = "M0 0 H30 V74 L16 100 H0 Z";
const ARM_UP = "M34 50 L76 0 H114 L62 50 Z";
const ARM_DOWN = "M62 50 L114 100 H76 L34 50 Z";

export default function Logo({
  tone = "brand",
  className,
  title,
}: {
  tone?: LogoTone;
  className?: string;
  /** Give the mark an accessible name when it stands alone. */
  title?: string;
}) {
  /* A unique suffix per instance: two gradients with the same id on one page
     make the second mark render with the first one's colours. */
  const id = `kestro-${tone}`;

  return (
    <svg
      viewBox={VIEW_BOX}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={className}
    >
      {tone === "brand" ? (
        <>
          <defs>
            <linearGradient id={`${id}-stem`} x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0" stopColor="#2563F5" />
              <stop offset="0.48" stopColor="#2563F5" />
              <stop offset="0.48" stopColor="#1B44C9" />
              <stop offset="1" stopColor="#1B44C9" />
            </linearGradient>
            <linearGradient id={`${id}-up`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#1E40FF" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id={`${id}-down`} x1="0.15" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#16307E" />
              <stop offset="0.55" stopColor="#1E40FF" />
              <stop offset="1" stopColor="#2E6BFF" />
            </linearGradient>
          </defs>
          <path d={STEM} fill={`url(#${id}-stem)`} />
          <path d={ARM_UP} fill={`url(#${id}-up)`} />
          <path d={ARM_DOWN} fill={`url(#${id}-down)`} />
        </>
      ) : (
        /*
         * One flat colour, for surfaces the gradient cannot sit on: the brand
         * blue itself, a favicon at 32 px, anywhere it has to read as a
         * silhouette. The fold survives as a slightly transparent lower arm,
         * which keeps the mark from flattening into a plain letter.
         */
        <g fill={tone === "light" ? "#FFFFFF" : "#0B1426"}>
          <path d={STEM} />
          <path d={ARM_UP} />
          <path d={ARM_DOWN} opacity="0.72" />
        </g>
      )}
    </svg>
  );
}

/** The mark and the name together, as it appears in the header and footer. */
export function Wordmark({
  tone = "brand",
  className,
  markClassName = "h-7 w-auto",
}: {
  tone?: LogoTone;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Logo tone={tone} className={markClassName} />
      <span className="font-display text-xl font-extrabold tracking-tight">Kestro</span>
    </span>
  );
}
