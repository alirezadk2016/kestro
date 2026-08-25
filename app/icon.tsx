import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/*
 * The favicon.
 *
 * The mark, flat white on the brand blue, drawn from the same path data as
 * components/Logo.tsx — ImageResponse renders SVG elements, so the geometry
 * does not have to be re-traced for the tab strip. At 32 px the gradient would
 * be invisible anyway; a silhouette is what reads.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1E40FF",
        borderRadius: 7,
      }}
    >
      <svg width="20" height="18" viewBox="0 0 114 100" fill="#FFFFFF">
        <path d="M0 0 H34 V44 L22 100 H0 Z" />
        <path d="M36 52 L60 0 H114 L67 52 Z" />
        <path d="M67 52 L114 100 H56 L36 52 Z" opacity="0.72" />
      </svg>
    </div>,
    { ...size },
  );
}
