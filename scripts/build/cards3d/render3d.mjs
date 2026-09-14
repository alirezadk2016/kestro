/*
 * Renders the six card subjects as real 3D, on transparent backgrounds.
 *
 *   node scripts/build/cards3d/render3d.mjs [outDir]
 *
 * The object layer only. The ground, the warm pool it stands in, the floor and
 * the grain are still the artboard's, in scripts/build/cards — so the cards
 * keep the light measured off the hero photograph and gain a subject that is
 * lit rather than drawn.
 *
 * Same harness as scripts/render-hero-still.mjs: a throwaway static server,
 * headless Chromium with SwiftShader, and the browser does the WebGL and the
 * PNG encoding, so there is no native graphics dependency to install.
 */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { writeFileSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const out = process.argv[2] ?? join(root, "public/cards/3d");
mkdirSync(out, { recursive: true });

const view = JSON.parse(await readFile(join(root, "lib/hero-view.json"), "utf8"));

/* Board sizes match scripts/build/cards/boards.mjs, at 2x. */
const BOARDS = {
  "cat-laptops": [2400, 1350],
  "cat-desktops": [2400, 1350],
  "cat-monitors": [2400, 1350],
  "cat-fleet": [2400, 1350],
  exploded: [1800, 2400],
  "fleet-scene": [1800, 2700],
};

const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}</style>
<script type="importmap">{"imports":{
  "three": "/three/build/three.module.js",
  "three/examples/jsm/": "/three/examples/jsm/"
}}</script>
<script type="module">
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { buildSubject } from "/lib/card-subjects.mjs";

const VIEW = ${JSON.stringify(view)};
const BOARDS = ${JSON.stringify(BOARDS)};

/* The same dark studio the hero stands in: unlit emissive panels in a black
   room, turned into reflections by PMREM. Against three's own RoomEnvironment
   a metallic chassis reflects white on every face and the machine turns grey. */
function studio(panels) {
  const s = new THREE.Scene();
  for (const p of panels) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(p.size[0], p.size[1]),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color).multiplyScalar(p.intensity),
        side: THREE.DoubleSide,
      }),
    );
    m.position.set(p.position[0], p.position[1], p.position[2]);
    m.lookAt(0, 0, 0);
    s.add(m);
  }
  return s;
}

window.__render = async function (name) {
  const [W, H] = BOARDS[name];
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = VIEW.exposure * 2.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.replaceChildren(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  /* The hero's studio plus one warm softbox overhead.
   *
   * The fleet card is a stack of five lids, and a lid is the chassis material:
   * blue-black, metalness 0.55. Under the hero's studio — which is all cool
   * panels, because the hero sits on a blue-lit photograph — the only thing
   * those five faces had to reflect was blue, so the brightest pixels in the
   * frame measured cool however warm the key light was. A metal surface shows
   * you the room, not the lamp. This is the room.
   *
   * Gently. At 2.6 it warmed the measurement into the green and turned a
   * blue-black tower brass, which is the whole failure mode of tuning a
   * picture to a number instead of looking at it. */
  const panels = [
    ...VIEW.studio,
    { position: [0.5, 9, 1.5], size: [11, 8], color: "#fff0d8", intensity: 0.95 },
  ];
  const env = pmrem.fromScene(studio(panels), 0.02);
  scene.environment = env.texture;
  pmrem.dispose();

  const loader = new GLTFLoader();
  const [base, lid] = await Promise.all([
    loader.loadAsync("/models/laptop-base.glb"),
    loader.loadAsync("/models/laptop-lid.glb"),
  ]);

  /* A fresh machine at a lid angle: 0 closed, 1 open. The lid is a separate
     file so it can hang off a pivot at the hinge, exactly as the hero does. */
  const [hx, hy] = VIEW.hinge;
  function machine(open) {
    const g = new THREE.Group();
    const b = base.scene.clone(true);
    const l = lid.scene.clone(true);
    const hinge = new THREE.Group();
    hinge.position.set(hx, hy, 0);
    l.position.set(-hx, -hy, 0);
    hinge.add(l);
    /* .z, not .x — the hero hangs the lid on the z axis, and swinging it
       about x sent it down through the base and blew up every bounding box
       that was measured off it. */
    hinge.rotation.z = VIEW.lidClosedRadians * (1 - open);
    g.add(b, hinge);
    g.traverse((o) => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    const box = new THREE.Box3().setFromObject(g);
    g.position.y -= box.min.y;          // stand it on y = 0
    const wrap = new THREE.Group();
    wrap.add(g);
    return wrap;
  }

  const built = buildSubject(name, machine);
  scene.add(built.object);

  /* The contact shadow, and nothing else: ShadowMaterial paints only where
     the light is blocked, so the ground stays transparent and the artboard's
     own floor shows through it. */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ opacity: 0.62 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const box = new THREE.Box3().setFromObject(built.object);
  const centre = box.getCenter(new THREE.Vector3());
  const radius = box.getSize(new THREE.Vector3()).length() / 2;

  const key = new THREE.DirectionalLight("#fff2e0", VIEW.lights.key.intensity * 3.4);
  key.position.set(radius * 2.2, radius * 3.0, radius * 2.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = radius * 12;
  const s = radius * 1.9;
  Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s });
  key.shadow.bias = -0.0009;
  key.shadow.radius = 3;
  key.target.position.copy(centre);
  scene.add(key, key.target);

  /* A warm bounce off the floor the card puts it on, so the underside of a
     chassis is not pure black against a lit plate. */
  const bounce = new THREE.DirectionalLight(0xffe8cc, 0.62);
  bounce.position.set(-radius * 1.6, -radius * 0.8, radius * 2.2);
  scene.add(bounce);

  /* The hero's rim is #8fa8ff at full strength because it is separating a
     machine from a blue-lit photograph. On a card it painted the whole
     chassis blue, and the measured result was that the brightest pixels in
     the frame were cool where the key is warm. Same direction, much less
     colour. */
  const COOL = { "#8fa8ff": "#cdd8fb", "#4a63c8": "#8e9ec8" };
  for (const l of [VIEW.lights.rim, VIEW.lights.fill]) {
    const d = new THREE.DirectionalLight(COOL[l.color] ?? l.color, l.intensity * 0.55);
    d.position.set(l.position[0] * radius, l.position[1] * radius, l.position[2] * radius);
    scene.add(d);
  }

  const camera = new THREE.PerspectiveCamera(built.fov, W / H, 0.01, 500);
  const place = (dist) => {
    camera.position.set(
      centre.x + dist * Math.cos(built.pitch) * Math.sin(built.yaw),
      centre.y + dist * Math.sin(built.pitch),
      centre.z + dist * Math.cos(built.pitch) * Math.cos(built.yaw),
    );
    camera.lookAt(centre);
    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();
  };

  /* Two passes: place the camera far enough to see everything, measure how
     much of the frame the box actually fills, then move in by that ratio. A
     bounding sphere overestimates a flat object badly — the laptop card was
     leaving a third of a 16:9 frame empty on every side. */
  let dist = (radius / Math.sin((built.fov * Math.PI) / 360)) * 1.4;
  for (let pass = 0; pass < 3; pass++) {
    place(dist);
    let mx = 0;
    let my = 0;
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) {
          const v = new THREE.Vector3(x, y, z).project(camera);
          mx = Math.max(mx, Math.abs(v.x));
          my = Math.max(my, Math.abs(v.y));
        }
    dist *= Math.max(mx, my) / (built.fit ?? 0.88);
  }
  place(dist);

  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  renderer.dispose();
  return url;
};
window.__ready = 1;
</script>`;

const types = { ".js": "text/javascript", ".mjs": "text/javascript", ".glb": "model/gltf-binary" };
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
    response
      .writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" })
      .end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const tab = await browser.newPage({ viewport: { width: 900, height: 600 } });
tab.on("console", (m) => {
  if (m.type() === "error") console.error("browser:", m.text());
});
await tab.goto(`http://127.0.0.1:${server.address().port}`);
await tab.waitForFunction("window.__ready", { timeout: 60000 });

for (const name of Object.keys(BOARDS)) {
  const url = await tab.evaluate((n) => window.__render(n), name);
  const data = Buffer.from(url.split(",")[1], "base64");
  const file = join(out, `${name}.png`);
  writeFileSync(file, data);
  console.log(`${name.padEnd(14)} ${(data.length / 1024).toFixed(0)} kB`);
}

await browser.close();
server.close();
