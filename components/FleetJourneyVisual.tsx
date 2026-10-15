"use client";

import Image from "next/image";
import { ClipboardList, Boxes, SlidersHorizontal, Truck, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { WebGLRenderer } from "three";
import type { Lang } from "@/lib/i18n";

type FleetScene = {
  camera: { aspect: number; updateProjectionMatrix: () => void };
  draw: (delta?: number, immediate?: boolean) => void;
  setStage: (stage: number) => void;
  setHover: (value: number) => void;
  moving: boolean;
  progress: number;
  dispose: () => void;
};
const icons = [ClipboardList, Boxes, SlidersHorizontal, Truck, RefreshCw];

export default function FleetJourneyVisual({ lang, stages }: { lang: Lang; stages: string[] }) {
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState("poster");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const figure = host.current,
      element = canvas.current;
    const section = figure?.closest<HTMLElement>("[data-fleet-journey]");
    if (!figure || !element || !section) return;
    const steps = [...section.querySelectorAll<HTMLElement>("[data-journey-step]")];
    const desktop = matchMedia("(min-width: 1024px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    let disposed = false,
      loading = false,
      visible = false,
      generation = 0,
      frame = 0;
    let engine: WebGLRenderer | undefined, scene: FleetScene | undefined;
    let stage = 0,
      last = 0;

    function schedule() {
      if (!frame && scene && visible && !document.hidden && desktop.matches && !reduced.matches)
        frame = requestAnimationFrame(draw);
    }
    function draw(time: number) {
      frame = 0;
      if (!scene || !visible || document.hidden) return;
      scene.draw(last ? Math.min((time - last) / 1000, 0.06) : 1 / 60);
      last = time;
      figure!.dataset.sceneProgress = scene.progress.toFixed(3);
      if (scene.moving) schedule();
    }
    function select(index: number) {
      stage = index;
      setActive(index);
      steps.forEach((step, i) => {
        step.dataset.active = String(i === index);
      });
      scene?.setStage(index);
      schedule();
    }
    function resize() {
      if (!engine || !scene) return;
      const bounds = element!.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      engine.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      engine.setSize(bounds.width, bounds.height, false);
      scene.camera.aspect = bounds.width / bounds.height;
      scene.camera.updateProjectionMatrix();
      scene.draw(0, true);
      schedule();
    }
    function stop() {
      generation++;
      cancelAnimationFrame(frame);
      frame = 0;
      scene?.dispose();
      engine?.dispose();
      scene = undefined;
      engine = undefined;
      loading = false;
      last = 0;
      if (!disposed) setState("poster");
    }
    async function start() {
      if (
        disposed ||
        loading ||
        scene ||
        !visible ||
        !desktop.matches ||
        reduced.matches ||
        connection?.saveData
      )
        return;
      loading = true;
      const token = ++generation;
      let nextEngine: WebGLRenderer | undefined, nextScene: FleetScene | undefined;
      try {
        const [THREE, { createFleetJourneyScene }] = await Promise.all([
          import("three"),
          import("@/lib/fleet-journey-scene.mjs"),
        ]);
        if (disposed || token !== generation || !desktop.matches || reduced.matches) return;
        nextEngine = new THREE.WebGLRenderer({ canvas: element!, antialias: true, alpha: true });
        nextEngine.setClearAlpha(0);
        nextScene = (await createFleetJourneyScene(nextEngine)) as unknown as FleetScene;
        if (disposed || token !== generation || !desktop.matches || reduced.matches) {
          nextScene.dispose();
          nextEngine.dispose();
          return;
        }
        if (nextEngine.getContext().isContextLost()) throw new Error("WebGL context unavailable");
        engine = nextEngine;
        scene = nextScene;
        scene.setStage(stage);
        resize();
        setState("ready");
        schedule();
      } catch {
        nextScene?.dispose();
        nextEngine?.dispose();
        if (!disposed && token === generation) setState("fallback");
      } finally {
        if (token === generation) loading = false;
      }
    }
    function preferenceChanged() {
      if (!desktop.matches || reduced.matches || connection?.saveData) stop();
      else void start();
    }
    function visibilityChanged() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        last = 0;
        schedule();
      }
    }
    function pointerMoved(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const bounds = figure!.getBoundingClientRect();
      scene?.setHover(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
      schedule();
    }
    function pointerLeft() {
      scene?.setHover(0);
      schedule();
    }
    function contextLost(event: Event) {
      event.preventDefault();
      stop();
      if (!disposed)
        setState(
          !desktop.matches || reduced.matches || connection?.saveData ? "poster" : "fallback",
        );
    }
    const sectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        void start();
        last = 0;
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    sectionObserver.observe(figure);
    const stepObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) select(steps.indexOf(entry.target as HTMLElement));
      },
      { rootMargin: "-35% 0px -40% 0px" },
    );
    steps.forEach((step) => stepObserver.observe(step));
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(figure);
    desktop.addEventListener("change", preferenceChanged);
    reduced.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    figure.addEventListener("pointermove", pointerMoved);
    figure.addEventListener("pointerleave", pointerLeft);
    element.addEventListener("webglcontextlost", contextLost);
    return () => {
      disposed = true;
      stop();
      sectionObserver.disconnect();
      stepObserver.disconnect();
      resizeObserver.disconnect();
      desktop.removeEventListener("change", preferenceChanged);
      reduced.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      figure.removeEventListener("pointermove", pointerMoved);
      figure.removeEventListener("pointerleave", pointerLeft);
      element.removeEventListener("webglcontextlost", contextLost);
      steps.forEach((step) => delete step.dataset.active);
    };
  }, []);

  return (
    <figure ref={host} className="fleet-journey-visual" data-scene-state={state}>
      <div className="fleet-journey-stage">
        <Image
          src="/cards/fleet-scene.webp"
          width={1536}
          height={1024}
          alt={
            lang === "da"
              ? "Illustration af ens erhvervscomputere i en flådeleverance"
              : "Illustrative business computers in a fleet delivery"
          }
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="fleet-journey-poster"
        />
        <canvas ref={canvas} aria-hidden="true" className="fleet-journey-canvas" />
      </div>
      <figcaption className="fleet-journey-caption">
        <span className="fleet-journey-current" aria-hidden="true">
          {String(active + 1).padStart(2, "0")} / 05
        </span>
        <span>{stages[active]}</span>
      </figcaption>
      <nav
        className="fleet-journey-nav"
        aria-label={lang === "da" ? "Leverancens trin" : "Delivery stages"}
      >
        {stages.map((stage, index) => {
          const Icon = icons[index];
          return (
            <a
              key={stage}
              href={`#fleet-phase-${index + 1}`}
              title={stage}
              aria-label={stage}
              aria-current={active === index ? "step" : undefined}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
            </a>
          );
        })}
      </nav>
    </figure>
  );
}
