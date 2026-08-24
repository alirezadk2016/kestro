"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import view from "@/lib/hero-view.json";
import type { Lang } from "@/lib/i18n";

/*
 * The laptop in the hero.
 *
 * Every visitor gets the poster frame first: a 36 kB WebP rendered from this
 * very model, by scripts/render-hero-still.mjs, using the camera in
 * hero-view.json. Nothing here blocks it. The WebGL canvas is an upgrade that
 * loads afterwards and fades in on the same view, so the swap is invisible.
 *
 * The upgrade is skipped — poster frame only, forever — when the visitor asked
 * for less motion, turned on data saver, or is on a low-memory device. A
 * rotating laptop is worth roughly 300 kB of deferred JavaScript on a desk in
 * an office; it is not worth it on a phone on a metered connection.
 */

const alt = {
  da: "Bærbar erhvervscomputer, sat op til nordisk brug",
  en: "Business laptop, set up for Nordic use",
} satisfies Record<Lang, string>;

/** A tab in the background should not be spending the visitor's battery. */
function useIsVisible(ref: React.RefObject<Element>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

function wantsTheUpgrade(reduced: boolean) {
  if (reduced) return false;
  if (typeof navigator === "undefined") return false;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memory === "number" && memory < 4) return false;

  return true;
}

export default function HeroModel({ lang, className }: { lang: Lang; className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const reduced = useReducedMotion();
  const visible = useIsVisible(holder);

  /*
   * Whether the canvas should be drawing right now. The render loop reads it
   * through a ref rather than a dependency, so scrolling the hero out of view
   * pauses the loop instead of tearing down the scene and rebuilding it.
   */
  const drawing = useRef(true);
  drawing.current = visible;

  useEffect(() => {
    if (!wantsTheUpgrade(reduced)) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function start() {
      const [THREE, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
      ]);
      const element = canvas.current;
      if (disposed || !element) return;

      const renderer = new THREE.WebGLRenderer({
        canvas: element,
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setClearAlpha(0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = view.exposure;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(view.fov, 1, 0.01, 100);

      const { hemisphere, key, rim } = view.lights;
      scene.add(new THREE.HemisphereLight(hemisphere.sky, hemisphere.ground, hemisphere.intensity));
      for (const light of [key, rim]) {
        const directional = new THREE.DirectionalLight(light.color, light.intensity);
        directional.position.set(light.position[0], light.position[1], light.position[2]);
        scene.add(directional);
      }

      const gltf = await new GLTFLoader().loadAsync("/models/laptop.glb");
      if (disposed) return;

      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(box.getCenter(new THREE.Vector3()));
      scene.add(model);

      const radius = Math.max(size.x, size.y, size.z) * view.distanceFactor;

      function resize() {
        const box = element!.getBoundingClientRect();
        if (!box.width || !box.height) return;
        // Capped at 2 so a 3× phone screen does not render nine times the pixels.
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(box.width, box.height, false);
        camera.aspect = box.width / box.height;
        camera.updateProjectionMatrix();
      }

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(element);

      let frame = 0;
      const started = performance.now();

      function draw(now: number) {
        frame = requestAnimationFrame(draw);
        if (!drawing.current || document.hidden) return;

        const seconds = (now - started) / 1000;
        const sweep = Math.sin((seconds / view.yawPeriodSeconds) * Math.PI * 2) * view.yawAmplitude;
        const yaw = view.yaw + sweep;

        camera.position.set(Math.sin(yaw) * radius, view.pitch * radius, Math.cos(yaw) * radius);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }

      frame = requestAnimationFrame(draw);
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        scene.traverse((node) => {
          if (!(node instanceof THREE.Mesh)) return;
          node.geometry.dispose();
          for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
            material.dispose();
          }
        });
        renderer.dispose();
      };
    }

    /* Nothing about a decorative laptop should compete with the page becoming
       interactive, so the whole thing waits for an idle moment. */
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void start(), { timeout: 3000 })
      : window.setTimeout(() => void start(), 1200);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      clearTimeout(idle);
      cleanup?.();
    };
  }, [reduced]);

  return (
    <div ref={holder} className={`relative aspect-[4/3] ${className ?? ""}`}>
      {/* Contact shadow. Without something under it the laptop reads as a
          cut-out pasted onto the navy rather than an object standing on a
          surface, and a real shadow pass would cost frames for the same. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] bottom-[8%] h-[14%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(4,8,26,0.55) 0%, rgba(4,8,26,0) 70%)",
        }}
      />
      <Image
        src="/models/laptop-still.webp"
        alt={alt[lang]}
        fill
        priority
        sizes="(min-width: 1024px) 40vw, 90vw"
        className={`object-contain transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
