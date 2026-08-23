"use client";

import { useEffect, useRef, useState } from "react";

const STATUS_ROWS = [
  { label: "Funktionstest", value: "Bestået" },
  { label: "RAM", value: "Opgraderet" },
  { label: "Tastatur", value: "Nordisk" },
  { label: "Software", value: "Nulstillet" },
];

const MAX_TILT_DEG = 5;
const MAX_GLOW_OFFSET_PX = 18;

export default function HeroVisual() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glowOffset, setGlowOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [rowsRevealed, setRowsRevealed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    // Reveal the status checklist shortly after mount, like a QA pass ticking in.
    const timer = window.setTimeout(() => setRowsRevealed(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    const px = (e.clientX - bounds.left) / bounds.width - 0.5;
    const py = (e.clientY - bounds.top) / bounds.height - 0.5;

    setTilt({ rx: py * -MAX_TILT_DEG, ry: px * MAX_TILT_DEG });
    setGlowOffset({ x: px * MAX_GLOW_OFFSET_PX * 2, y: py * MAX_GLOW_OFFSET_PX * 2 });
  }

  function handleMouseEnter() {
    if (!reducedMotion) setHovering(true);
  }

  function handleMouseLeave() {
    setHovering(false);
    setTilt({ rx: 0, ry: 0 });
    setGlowOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-md opacity-0 motion-safe:animate-fade-up-delayed motion-reduce:opacity-100 lg:max-w-none"
      style={{ perspective: "1000px" }}
    >
      <div
        className={`absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-brand-100 via-brand-50 to-transparent blur-2xl ${
          hovering ? "" : "motion-safe:animate-glow-drift"
        }`}
        style={
          hovering
            ? {
                transform: `translate(${glowOffset.x}px, ${glowOffset.y}px)`,
                transition: "transform 0.2s ease-out",
              }
            : { transition: "transform 0.6s ease-out" }
        }
      />

      <div
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: hovering ? "transform 0.15s ease-out" : "transform 0.5s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Enhedsstatus</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Klar til levering
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {STATUS_ROWS.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              style={
                reducedMotion
                  ? undefined
                  : {
                      opacity: rowsRevealed ? 1 : 0,
                      transform: rowsRevealed ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity 0.4s ease-out ${i * 0.12}s, transform 0.4s ease-out ${i * 0.12}s`,
                    }
              }
            >
              <span className="text-sm text-slate-500">{row.label}</span>
              <span className="text-sm font-semibold text-slate-900">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-slate-400">Pris vs. nyt udstyr</p>
          <p className="mt-1 text-2xl font-bold">Typisk 40–60% under nyprisen</p>
        </div>
      </div>
    </div>
  );
}
