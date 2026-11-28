import { ImageResponse } from "next/og";

/*
 * The favicon, at three sizes.
 *
 * It was 32×32 only. That is right for a tab strip and too small for search:
 * Google shows a site's icon beside its results only when the file is a
 * multiple of 48 px square, so with nothing else on offer every result showed
 * the generic globe. 48 is the smallest it takes, 192 is what Android and a
 * home-screen shortcut ask for, and 32 stays for the tab. /favicon.ico, which
 * crawlers and older browsers ask for without reading the page, is rewritten
 * to the 48 in next.config.mjs.
 *
 * The mark, flat white on the brand blue, drawn from the same path data as
 * components/Logo.tsx — ImageResponse renders SVG elements, so the geometry
 * does not have to be re-traced. At these sizes a gradient would be invisible;
 * a silhouette is what reads.
 */
const SIZES = [32, 48, 192] as const;

export function generateImageMetadata() {
  return SIZES.map((px) => ({
    id: String(px),
    size: { width: px, height: px },
    contentType: "image/png",
  }));
}

export default function Icon({ id }: { id: string }) {
  const px = Number(id) || 32;
  /* The proportions of the 32 px drawing, which was tuned by eye: a 20×18
     mark and a 7 px corner on a 32 px tile. */
  const k = px / 32;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1E40FF",
        borderRadius: Math.round(7 * k),
      }}
    >
      <svg
        width={Math.round(20 * k)}
        height={Math.round(18 * k)}
        viewBox="0 0 114 100"
        fill="#FFFFFF"
      >
        <path d="M0 0 H34 V44 L22 100 H0 Z" />
        <path d="M36 52 L60 0 H114 L67 52 Z" />
        <path d="M67 52 L114 100 H56 L36 52 Z" opacity="0.72" />
      </svg>
    </div>,
    { width: px, height: px },
  );
}
