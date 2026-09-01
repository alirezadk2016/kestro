/*
 * Renders the Viden hub's images — real 3D, from the model the site already has.
 *
 *   node scripts/render-viden-stills.mjs
 *
 * The hub had line drawings, which read as diagrams rather than as a product.
 * These are renders of public/models/laptop-*.glb through lib/laptop-scene.mjs
 * — the same geometry, the same studio lighting and the same tone mapping the
 * hero canvas uses — so the section looks like the rest of Kestro rather than
 * like clip art, and so a new model propagates everywhere at once.
 *
 * They are stills on purpose. A WebGL canvas on this page would cost the ~800 kB
 * three.js bundle measured earlier, on a page whose whole job is to send people
 * somewhere else. A rendered WebP is about 30 kB, needs no JavaScript, is there
 * before hydration and cannot shift the layout.
 *
 * Chromium does the rendering (headless WebGL through SwiftShader) and the WebP
 * encoding, so there is no native image dependency. Re-run after any change to
 * the model, the scene module or the poses below.
 */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT_DIR = join(root, "public/viden");

const heroView = JSON.parse(await readFile(join(root, "lib/hero-view.json"), "utf8"));

/*
 * The hub's lighting, not the front page's.
 *
 * hero-view.json is tuned for a canvas sitting over a lit gradient. Reused
 * unchanged on the flat navy of this page the machine renders almost black, so
 * the key and rim are lifted and the exposure with them. The geometry, the
 * environment map and the tone mapping are the front page's, so it is still
 * recognisably the same machine under stronger light.
 */
const base = {
  ...heroView,
  lights: {
    key: { ...heroView.lights.key, intensity: 2.1, position: [4, 6, 5] },
    rim: { ...heroView.lights.rim, color: "#a8bcff", intensity: 3.2 },
    fill: { ...heroView.lights.fill, intensity: 0.55 },
  },
  studio: [
    { position: [2.5, 7, 6], size: [14, 9], color: "#ffffff", intensity: 1.6 },
    { position: [-8, 2.5, 2], size: [1.2, 16], color: "#dbe6ff", intensity: 8.0 },
    { position: [6, 3, -8], size: [10, 7], color: "#7f97ff", intensity: 3.4 },
    { position: [0, -7, 1], size: [16, 16], color: "#1b2547", intensity: 0.6 },
  ],
};

/*
 * One pose per image.
 *
 * yaw and pitch are where the camera stands, distance is a multiple of the
 * model's own size, lid runs 0 open to 1 shut, and lookY moves the aim up or
 * down the machine — without it a close-up of the keyboard puts the keyboard
 * in a corner. Each pose is chosen to say what its cluster is about, so the
 * four read as four different subjects rather than one object turned slightly.
 */
const shots = [
  {
    name: "hero",
    width: 1600,
    height: 900,
    pose: { yaw: 0.72, pitch: 0.24, distance: 2.05, lid: 0.1, lookY: 0.02 },
    exposure: 1.45,
  },
  {
    /* Profile, lid half shut: a machine on its way out. */
    name: "lifecycle",
    width: 900,
    height: 675,
    pose: { yaw: 1.86, pitch: 0.16, distance: 1.95, lid: 0.55, lookY: 0 },
    exposure: 1.4,
  },
  {
    /* Close and high, looking down at the deck the way you would inspect one. */
    name: "buying-condition",
    width: 900,
    height: 675,
    pose: { yaw: 0.34, pitch: 0.62, distance: 1.6, lid: 0.02, lookY: 0.2 },
    exposure: 1.5,
  },
  {
    /* Low and behind, on the underside — where the memory and the drive are. */
    name: "memory-storage",
    width: 900,
    height: 675,
    pose: { yaw: 2.55, pitch: -0.28, distance: 1.75, lid: 0.94, lookY: -0.1 },
    exposure: 1.4,
  },
  {
    /* Far away, small in the frame, dimmer: kept, but not built on. */
    name: "uden-klynge",
    width: 900,
    height: 675,
    pose: { yaw: 1.15, pitch: 0.34, distance: 2.9, lid: 0.42, lookY: 0 },
    exposure: 1.05,
  },
];

const page = (shot) => `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}</style>
<script type="importmap">{"imports":{
  "three": "/three/build/three.module.js",
  "three/examples/jsm/": "/three/examples/jsm/"
}}</script>
<script type="module">
import * as THREE from "three";
import { createLaptopScene } from "/lib/laptop-scene.mjs";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(${shot.width}, ${shot.height});
document.body.appendChild(renderer.domElement);

try {
  /* yaw, pitch and distance are the pose the scene starts in, so they are set
     exactly through the view and need no easing at all. Only lid and lookY have
     to travel, and every frame of that travel is a full software render — 300
     of them at this size stalls on ReadPixels for minutes. At the maximum
     step the easing allows, twenty-six frames put it within a hundred-
     thousandth of the target, which is far below a pixel. */
  const view = ${JSON.stringify({
    ...base,
    exposure: shot.exposure,
    startYaw: shot.pose.yaw,
    pitch: shot.pose.pitch,
    distanceFactor: shot.pose.distance,
  })};
  const laptop = await createLaptopScene(renderer, view, { spin: false });
  laptop.camera.aspect = ${shot.width} / ${shot.height};
  laptop.camera.updateProjectionMatrix();
  laptop.setTarget(${JSON.stringify(shot.pose)});
  for (let i = 0; i <= 26; i++) laptop.draw(i * 0.1);
  window.__png = renderer.domElement.toDataURL("image/webp", 0.9);
} catch (error) {
  window.__error = String(error);
}
</script>`;

const types = { ".js": "text/javascript", ".mjs": "text/javascript", ".glb": "model/gltf-binary" };
const roots = { "/three/": "node_modules", "/lib/": "." };

let current = shots[0];
const server = createServer(async (request, response) => {
  const path = request.url.split("?")[0];
  if (path === "/")
    return response.writeHead(200, { "content-type": "text/html" }).end(page(current));

  const prefix = Object.keys(roots).find((p) => path.startsWith(p));
  const file = prefix
    ? join(root, roots[prefix], path.slice(1))
    : join(root, "public", path.slice(1));

  try {
    const body = await readFile(file);
    response
      .writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" })
      .end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await mkdir(OUT_DIR, { recursive: true });
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

for (const shot of shots) {
  current = shot;
  const tab = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  tab.on("pageerror", (error) => console.error("pageerror:", String(error)));
  tab.setDefaultTimeout(300000);
  await tab.goto(`http://127.0.0.1:${server.address().port}`);
  await tab.waitForFunction("window.__png || window.__error", { timeout: 300000 });

  const error = await tab.evaluate("window.__error || null");
  if (error) throw new Error(`${shot.name}: ${error}`);

  const data = Buffer.from((await tab.evaluate("window.__png")).split(",")[1], "base64");
  const out = join(OUT_DIR, `${shot.name}.webp`);
  writeFileSync(out, data);
  console.log(
    `${shot.name.padEnd(18)} ${shot.width}x${shot.height}  ${(data.length / 1024).toFixed(1)} kB`,
  );
  await tab.close();
}

await browser.close();
server.close();
