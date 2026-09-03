import { ImageResponse } from "next/og";

/*
 * The logo, at a size a search engine will accept.
 *
 * The Organization block claims this URL as the company's logo, and Google
 * states a minimum of 112px for that image. The only raster mark the site had
 * was /icon at 32×32 — right for a tab strip, too small to be a logo — and
 * /opengraph-image, which is a 1200×630 social card and is not a logo at all.
 * Passing either would be claiming something the file is not.
 *
 * So this is a third rendering of the same three paths, at 512×512 on the
 * brand blue. Same geometry as components/Logo.tsx and app/icon.tsx, drawn
 * rather than exported, so there is no binary in the repository that can fall
 * out of step with the mark the site actually uses.
 *
 * A route rather than a file in public/ for the same reason: one definition of
 * the geometry, three sizes generated from it.
 */
export const runtime = "nodejs";

const SIZE = 512;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E40FF",
        }}
      >
        <svg width="300" height="263" viewBox="0 0 114 100" fill="#FFFFFF">
          <path d="M0 0 H34 V44 L22 100 H0 Z" />
          <path d="M36 52 L60 0 H114 L67 52 Z" />
          <path d="M67 52 L114 100 H56 L36 52 Z" opacity="0.72" />
        </svg>
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      headers: {
        /* Immutable in practice: the geometry only changes when the brand
           does, and then the whole site changes with it. */
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
  );
}
