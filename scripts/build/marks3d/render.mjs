/*
 * Renders every CraftMark as a real object.
 *
 *   node scripts/build/marks3d/render.mjs [outDir]
 *
 * The reference for the tile grid has a rendered 3D object inside each
 * recessed plate. Modelling twenty-one of those by hand was the obvious plan
 * and it is the wrong one: about six of these marks are things (a cell, a
 * module, a screen, a fan) and the rest are ideas (a value that was set, a
 * promise in writing, a supplier network). A grid where six tiles carry
 * photoreal objects and the other six carry line drawings is less consistent
 * than a grid of line drawings, not more.
 *
 * So the marks themselves are extruded. Every one of them, through the same
 * bevel and the same studio the cards are lit in — which keeps the set a set,
 * keeps the drawing decisions that were made at 24px, and means the thing on
 * the tile is unmistakably the same mark as the one in the list row beside it.
 *
 * SVGLoader turns the strokes into outlines (`pointsToStroke`), so a mark
 * drawn as a 2-unit line becomes a 2-unit-wide solid with a real edge on it —
 * which is what catches the key and makes it read as machined rather than as
 * a picture of a line.
 *
 * Output: public/marks3d/<name>.webp, on a transparent ground, rendered at 4x
 * the largest size the wells use.
 */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const out = process.argv[2] ?? join(root, "public/marks3d");
await mkdir(out, { recursive: true });

const SIZE = 256;

/* The marks, read out of the component so the two cannot drift. Same parse as
   scripts/design/marks-sheet.mjs. */
const src = await readFile(join(root, "components/CraftMark.tsx"), "utf8");
const body = src.slice(src.indexOf("const marks:"), src.indexOf("\n};", src.indexOf("const marks:")));
const marks = [...body.matchAll(/(?:^|\n)\s{2}"?([a-z-]+)"?:\s*\(\s*<>([\s\S]*?)<\/>\s*\),/g)].map(
  ([, name, jsx]) => [
    name,
    jsx
      .replace(/className=/g, "class=")
      .replace(/strokeDasharray=/g, "stroke-dasharray=")
      .replace(/\{([^}]*)\}/g, "$1"),
  ],
);
if (!marks.length) throw new Error("no marks parsed — has the record shape changed?");

const view = JSON.parse(await readFile(join(root, "lib/hero-view.json"), "utf8"));

const page = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}</style>
<script type="importmap">{"imports":{
  "three": "/three/build/three.module.js",
  "three/examples/jsm/": "/three/examples/jsm/"
}}</script>
<script type="module">
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const VIEW = ${JSON.stringify(view)};
const SIZE = ${SIZE};

/* The cards' studio, warmed the same third of the way toward the key and with
   the hero's rim strip capped, for the same reasons written up in
   scripts/build/cards3d/render3d.mjs. One light rig across the whole site. */
function studio() {
  const KEY = new THREE.Color("#fff0d8");
  const s = new THREE.Scene();
  const panels = [
    ...VIEW.studio.map((p) => ({
      ...p,
      intensity: Math.min(p.intensity, 2.2),
      color: "#" + new THREE.Color(p.color).lerp(KEY, 0.55).getHexString(),
    })),
    { position: [0.5, 9, -1], size: [30, 22], color: "#fff0d8", intensity: 0.34 },
  ];
  for (const p of panels) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(p.size[0], p.size[1]),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color).multiplyScalar(p.intensity),
        side: THREE.DoubleSide,
      }),
    );
    m.position.set(...p.position);
    m.lookAt(0, 0, 0);
    s.add(m);
  }
  return s;
}

/* Brushed dark alloy for the body of a mark, and the site's accent for the one
   element that carries the meaning — the same "one accent" rule the flat set
   is drawn to, carried into three dimensions. */
const BODY = { color: 0x39414f, metalness: 0.92, roughness: 0.26 };
const ACCENT = { color: 0x4f6bc4, metalness: 0.8, roughness: 0.22 };

/*
 * Give a flat ribbon side walls.
 *
 * SVGLoader.pointsToStroke widens a stroke into a triangulated ribbon, and a
 * ribbon has no thickness — copying it to two depths gives two parallel plates
 * with a gap you can see straight through, which is what the first pass
 * rendered. It also has no edge, and the edge is the entire point: a bevel
 * catching the key is what separates a machined object from a picture of one.
 *
 * The outline is recoverable from the triangles. An edge shared by two of them
 * is interior; an edge belonging to exactly one is on the boundary. Weld the
 * boundary of the front copy to the boundary of the back copy with a quad each
 * and the ribbon becomes a solid.
 */
function solidify(flat, depth) {
  const pos = flat.attributes.position;
  const n = pos.count;
  const key = (i) => pos.getX(i).toFixed(4) + "," + pos.getY(i).toFixed(4);

  const seen = new Map();
  for (let t = 0; t < n; t += 3) {
    for (let e = 0; e < 3; e++) {
      const a = t + e;
      const b = t + ((e + 1) % 3);
      const ka = key(a);
      const kb = key(b);
      const id = ka < kb ? ka + "|" + kb : kb + "|" + ka;
      const hit = seen.get(id);
      if (hit) hit.count++;
      else seen.set(id, { count: 1, a, b });
    }
  }

  const h = depth / 2;
  const verts = [];
  const push = (i, z) => verts.push(pos.getX(i), pos.getY(i), z);

  for (let t = 0; t < n; t += 3) {
    /* Front, and the back wound the other way so it faces outward. */
    push(t, h);
    push(t + 1, h);
    push(t + 2, h);
    push(t + 2, -h);
    push(t + 1, -h);
    push(t, -h);
  }
  for (const { count, a, b } of seen.values()) {
    if (count !== 1) continue;
    push(a, h);
    push(b, h);
    push(b, -h);
    push(b, -h);
    push(a, -h);
    push(a, h);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  g.computeVertexNormals();
  return g;
}

window.__ready = 0;
window.__render = function (markup) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false });
  renderer.setSize(SIZE, SIZE);
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.replaceChildren(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(studio(), 0.02).texture;
  pmrem.dispose();

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="#000" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter">' +
    markup + '</svg>';
  const data = new SVGLoader().parse(svg);

  const group = new THREE.Group();
  for (const path of data.paths) {
    const accent = /stroke-brand-300|fill-brand-300/.test(path.userData?.node?.getAttribute("class") ?? "");
    const style = path.userData.style;
    const mat = new THREE.MeshStandardMaterial(accent ? ACCENT : BODY);

    const shapes = [];
    /* A filled path becomes its own shapes; a stroked one has to be widened
       into shapes first, which is the whole reason this works on a set drawn
       almost entirely in strokes. */
    if (style.fill && style.fill !== "none") {
      for (const s of SVGLoader.createShapes(path)) shapes.push(s);
    }
    if (style.stroke && style.stroke !== "none") {
      for (const sub of path.subPaths) {
        const pts = sub.getPoints();
        const flat = SVGLoader.pointsToStroke(pts, style);
        if (flat) shapes.push({ __flat: solidify(flat, 1.15) });
      }
    }

    for (const s of shapes) {
      if (s.__flat) {
        group.add(new THREE.Mesh(s.__flat, mat));
        continue;
      }
      const geom = new THREE.ExtrudeGeometry(s, {
        depth: 1.1,
        bevelEnabled: true,
        bevelThickness: 0.16,
        bevelSize: 0.16,
        bevelSegments: 2,
        curveSegments: 12,
      });
      group.add(new THREE.Mesh(geom, mat));
    }
  }

  /* SVG's y runs down and three's runs up. */
  group.scale.y = -1;
  group.traverse((o) => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });

  const wrap = new THREE.Group();
  wrap.add(group);
  const box = new THREE.Box3().setFromObject(group);
  const centre = box.getCenter(new THREE.Vector3());
  group.position.sub(centre);
  scene.add(wrap);

  /* A shallow three-quarter, the same direction the cards are shot from: enough
     to show the extrusion's side wall and the bevel catching the key, not so
     much that a 48px icon turns into a perspective puzzle. */
  wrap.rotation.set(-0.30, -0.36, 0);

  const size = box.getSize(new THREE.Vector3());
  const reach = Math.max(size.x, size.y);

  const key = new THREE.DirectionalLight("#fff2e0", VIEW.lights.key.intensity * 3.2);
  key.position.set(-reach * 1.4, reach * 1.8, reach * 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);

  const kick = new THREE.DirectionalLight("#cfd9f2", VIEW.lights.key.intensity * 2.1);
  kick.position.set(reach * 2.0, reach * 0.8, -reach * 1.8);
  scene.add(kick);

  const fill = new THREE.DirectionalLight("#9fb0cc", 0.5);
  fill.position.set(reach * 0.6, -reach * 1.2, reach * 1.6);
  scene.add(fill);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 500);
  const dist = (reach / Math.sin((26 * Math.PI) / 360)) * 0.62;
  camera.position.set(0, 0, dist);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  renderer.dispose();
  return url;
};
window.__ready = 1;
</script>`;

const types = { ".js": "text/javascript", ".mjs": "text/javascript" };
const server = createServer(async (request, response) => {
  const path = request.url.split("?")[0];
  if (path === "/") return response.writeHead(200, { "content-type": "text/html" }).end(page);
  try {
    const body = await readFile(join(root, "node_modules", path.replace("/three/", "three/")));
    response
      .writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" })
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
const tab = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
tab.on("console", (m) => m.type() === "error" && console.error("browser:", m.text()));
await tab.goto(`http://127.0.0.1:${server.address().port}`);
await tab.waitForFunction("window.__ready", { timeout: 60000 });

let total = 0;
for (const [name, markup] of marks) {
  const url = await tab.evaluate((m) => window.__render(m), markup);
  const png = Buffer.from(url.split(",")[1], "base64");
  const file = join(out, `${name}.webp`);
  await sharp(png).webp({ quality: 90, alphaQuality: 90 }).toFile(file);
  const { size } = await sharp(file).metadata().then(async () => ({
    size: (await readFile(file)).length,
  }));
  total += size;
  console.log(`${name.padEnd(13)} ${(size / 1024).toFixed(1)} kB`);
}
console.log(`\n${marks.length} marks, ${(total / 1024).toFixed(0)} kB total`);

await browser.close();
server.close();
