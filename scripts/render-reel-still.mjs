/*
 * Renders the poster frame for the hero reel.
 *
 *   node scripts/render-reel-still.mjs
 *
 * Same arrangement as scripts/render-hero-still.mjs and for the same reason:
 * the still is what every visitor sees first, and on a phone told to save data
 * it is all they ever see, so it has to be the same picture. It loads
 * lib/reel-scene.mjs — the module components/HeroReel.tsx draws live — with
 * the same lib/reel-view.json, and renders the rail at rest.
 *
 * Re-run it whenever the view, the scene module or the frames change.
 * Chromium does the rendering and the WebP encoding, so there is no native
 * image dependency to install.
 */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(root, "public/reel/reel-still.webp");
const WIDTH = 1200;
const HEIGHT = 900;

const view = JSON.parse(await readFile(join(root, "lib/reel-view.json"), "utf8"));

const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#0a1020}</style>
<script type="importmap">{"imports":{
  "three": "/three/build/three.module.js",
  "three/examples/jsm/": "/three/examples/jsm/"
}}</script>
<script type="module">
import * as THREE from "three";
import { createReelScene } from "/lib/reel-scene.mjs";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(${WIDTH}, ${HEIGHT});
renderer.setClearAlpha(0);
document.body.appendChild(renderer.domElement);

try {
  const reel = await createReelScene(renderer, ${JSON.stringify(view)}, { drifting: false });
  reel.camera.aspect = ${WIDTH} / ${HEIGHT};
  reel.camera.updateProjectionMatrix();
  reel.draw(0);
  window.__png = renderer.domElement.toDataURL("image/webp", 0.88);
} catch (error) {
  window.__error = String(error && error.stack || error);
}
</script>`;

const types = { ".js": "text/javascript", ".mjs": "text/javascript", ".webp": "image/webp" };
const roots = { "/three/": "node_modules", "/lib/": "." };

const server = createServer(async (request, response) => {
  const path = request.url.split("?")[0];
  if (path === "/") return response.writeHead(200, { "content-type": "text/html" }).end(page);

  const prefix = Object.keys(roots).find((p) => path.startsWith(p));
  const file = prefix
    ? join(root, roots[prefix], path.slice(1))
    : join(root, "public", path.slice(1));

  try {
    const body = await readFile(file);
    const type = types[extname(file)] ?? "application/octet-stream";
    response.writeHead(200, { "content-type": type }).end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const tab = await browser.newPage({ viewport: { width: 800, height: 400 } });
tab.on("console", (message) => {
  if (message.type() === "error") console.error("browser:", message.text());
});
await tab.goto(`http://127.0.0.1:${server.address().port}`);
await tab.waitForFunction("window.__png || window.__error", { timeout: 120000 });

const error = await tab.evaluate("window.__error || null");
if (error) throw new Error(error);

const data = Buffer.from((await tab.evaluate("window.__png")).split(",")[1], "base64");
writeFileSync(OUT, data);

await browser.close();
server.close();
console.log(`${OUT} — ${(data.length / 1024).toFixed(1)} kB`);
