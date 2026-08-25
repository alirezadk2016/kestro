import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0B1426",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="62" height="55" viewBox="0 0 114 100">
          <path d="M0 0 H34 V44 L22 100 H0 Z" fill="#1E5BFF" />
          <path d="M36 52 L60 0 H114 L67 52 Z" fill="#2E79FF" />
          <path d="M67 52 L114 100 H56 L36 52 Z" fill="#1E45D8" />
        </svg>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "white" }}>Kestro</div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 48,
          fontSize: 54,
          fontWeight: 800,
          color: "white",
          maxWidth: 900,
        }}
      >
        Renoveret IT-hardware til virksomheder
      </div>

      <div
        style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#94a3b8", maxWidth: 800 }}
      >
        Testet og klargjort til det nordiske marked
      </div>
    </div>,
    { ...size },
  );
}
