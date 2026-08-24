/*
 * Renders the poster frame for the hero model.
 *
 * The still is what every visitor sees first — the WebGL canvas only replaces
 * it later, and on a phone told to save data it never does. So it has to be
 * the same picture: this script reads lib/hero-view.json, the file the live
 * component reads, and renders the mid-point of the camera's slow sweep. When
 * the canvas fades in, nothing appears to move.
 *
 *   node scripts/render-hero-still.mjs
 *
 * Re-run it whenever hero-view.json or the model changes. Chromium does the
 * rendering (headless WebGL) and the WebP encoding, so there is no native
 * image dependency to install.
 */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(root, "public/models/laptop-still.webp");
const WIDTH = 1200;
const HEIGHT = 900;

const view = JSON.parse(await readFile(join(root, "lib/hero-view.json"), "utf8"));

const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}</style>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
const v = ${JSON.stringify(view)};
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(${WIDTH}, ${HEIGHT});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = v.exposure;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(v.fov, ${WIDTH} / ${HEIGHT}, 0.01, 100);
scene.add(new THREE.HemisphereLight(v.lights.hemisphere.sky, v.lights.hemisphere.ground, v.lights.hemisphere.intensity));
for (const name of ["key", "rim"]) {
  const l = new THREE.DirectionalLight(v.lights[name].color, v.lights[name].intensity);
  l.position.set(...v.lights[name].position);
  scene.add(l);
}
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
loader.load("/models/laptop.glb", (gltf) => {
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  model.position.sub(box.getCenter(new THREE.Vector3()));
  const size = box.getSize(new THREE.Vector3());
  scene.add(model);
  const radius = Math.max(size.x, size.y, size.z) * v.distanceFactor;
  camera.position.set(Math.sin(v.yaw) * radius, v.pitch * radius, Math.cos(v.yaw) * radius);
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  window.__png = renderer.domElement.toDataURL("image/webp", 0.9);
}, undefined, (e) => { window.__error = String(e); });
</script>`;

const types = { ".js": "text/javascript", ".glb": "model/gltf-binary" };
const server = createServer(async (req, res) => {
  const path = req.url.split("?")[0];
  if (path === "/") return res.writeHead(200, { "content-type": "text/html" }).end(page);
  const file = path.startsWith("/three/")
    ? join(root, "node_modules", path.slice(1))
    : join(root, "public", path.slice(1));
  try {
    const body = await readFile(file);
    res
      .writeHead(200, {
        "content-type": types[extname(file)] ?? "application/octet-stream",
      })
      .end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const tab = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
});
await tab.goto(origin);
await tab.waitForFunction("window.__png || window.__error", { timeout: 60000 });
const error = await tab.evaluate("window.__error || null");
if (error) throw new Error(error);
const data = await tab.evaluate("window.__png");
writeFileSync(OUT, Buffer.from(data.split(",")[1], "base64"));
await browser.close();
server.close();
console.log(`${OUT} — ${(Buffer.from(data.split(",")[1], "base64").length / 1024).toFixed(1)} kB`);
