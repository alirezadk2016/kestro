import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f172a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#1d4ed8",
              color: "white",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            K
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "white" }}>Kestro</div>
        </div>

        <div style={{ display: "flex", marginTop: 48, fontSize: 54, fontWeight: 800, color: "white", maxWidth: 900 }}>
          Renoveret IT-hardware til virksomheder
        </div>

        <div style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#94a3b8", maxWidth: 800 }}>
          Testet og klargjort til det nordiske marked
        </div>
      </div>
    ),
    { ...size }
  );
}
