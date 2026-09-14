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
  /* The hero's panels are all cool, because the hero sits on a blue-lit
     photograph and only has to separate one machine from it. On a card the
     chassis is dark metal, so nearly every bright pixel in the frame is a
     reflection of this room rather than a lit face — which is why the
     highlights measured blue however warm the key was set. A metal surface
     shows you the room, not the lamp, so the room is warmed a third of the
     way toward the key and the relative intensities are left alone. */
  const KEY_TINT = new THREE.Color("#fff0d8");
  const panels = [
    ...VIEW.studio.map((p) => ({
      ...p,
      color: "#" + new THREE.Color(p.color).lerp(KEY_TINT, 0.34).getHexString(),
    })),
    { position: [0.5, 9, 1.5], size: [11, 8], color: "#fff0d8", intensity: 1.0 },
  ];
  const env = pmrem.fromScene(studio(panels), 0.02);
  scene.environment = env.texture;
  scene.environmentIntensity = 1.0;
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

  /*
   * The model's own materials, re-graded for a card.
   *
   * Three findings, from dumping every material in both GLBs rather than
   * guessing at why the renders looked like toys:
   *
   * 1. **The display is a four-vertex quad carrying emissive #222f4c.** In the
   *    hero — one machine, dark room, low exposure — that reads as a screen on
   *    standby. On a card it is a flat blue rectangle, and a flat blue
   *    rectangle is the loudest thing in a picture saying "3D render". An
   *    earlier fix painted a gradient into a canvas and used it as an emissive
   *    map, and it changed nothing: four vertices with no usable UVs sample
   *    one texel, so the gradient arrived as a single flat colour. A mirror
   *    needs no UVs. Near-black, almost fully metallic, almost smooth — what
   *    it shows is the studio, which is the same room lighting the chassis.
   *    That is what a switched-off screen does in a product photograph.
   *
   * 2. **The chassis ships at #3f4556 and the lid shell at #5b5c60.** Those
   *    are mid-slate, and the hero gets away with them because the hero is
   *    exposed three stops darker. Sampled off a card, the body came back at
   *    #535566 against the hero's own laptop body at #161e25 — nearly three
   *    times the luminance. That is a clay render, and the brief already says
   *    why it matters: "a mid-grey body with a mid-grey edge is a clay render,
   *    a near-black body with a hot cream edge is a product shot." The colours
   *    come down; the key light does not, so the edges keep the highlight.
   *
   * 3. **Material.112 is #e7371b** — a saturated vermilion block on the right
   *    of the palm rest, and at card size the most saturated thing in the
   *    frame, repeated six times on the fleet card. A red mark in that
   *    position on a squared black business laptop is a maker's cue, and the
   *    footer of this site states that Kestro is not affiliated with Lenovo,
   *    HP, Dell, Apple or Microsoft. The brief names the red nub as a negative
   *    for exactly this reason. It goes to chassis dark.
   */
  const GLASS = new THREE.MeshStandardMaterial({
    name: "Material.099",
    color: 0x03050c,
    metalness: 0.96,
    roughness: 0.05,
    envMapIntensity: 2.6,
  });
  const REGRADE = {
    "Material.007": { color: 0x212636 }, // chassis, from #3f4556
    /* The lid shell, from #5b5c60. Roughness goes up with it: on the fleet
       card six lids lie flat under a steep key, and at the model's own
       polish that is six white rectangles — the one surface in the set where
       the key lands square instead of grazing. */
    "Material.044": { color: 0x22252d, roughness: 0.62 },
    "Material.111": { color: 0x33363d }, // trim, from #696969
    "Material.112": { color: 0x1c2029 }, // the vermilion block; see 3 above
  };
  const dress = (root) =>
    root.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const n = o.material.name;
      if (n === "Material.099") return void (o.material = GLASS);
      if (!(n in REGRADE)) return;
      /* Object3D.clone shares materials by reference, so a clone must get its
         own before its colour is touched or every machine in the scene
         changes with it. */
      o.material = o.material.clone();
      const { color, ...rest } = REGRADE[n];
      o.material.color.setHex(color);
      Object.assign(o.material, rest);
    });

  const built = buildSubject(name, machine, dress);
  scene.add(built.object);


  const box = new THREE.Box3().setFromObject(built.object);
  const centre = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const radius = size.length() / 2;
  /* Aim above the middle, so the subject sits low in the frame with its feet
     near the artboard's floor line instead of hanging in the vertical centre.
     Dead centre is the void look, and it is also what hides the contact
     shadow: at the centre of a 16:9 frame there is no ground under the object
     for the shadow to land on where the eye is looking. */
  centre.y += size.y * (built.lift ?? 0.14);

  /*
   * A floor, not a shadow catcher.
   *
   * This was a ShadowMaterial — it paints only where the light is blocked,
   * leaving the ground transparent so the artboard's own floor shows through.
   * That is tidy and it is why every subject floated: a dark shadow falling on
   * a dark gradient is invisible, so there was nothing under the object saying
   * it was standing on anything. "Nothing floats" is a rule in the brief, and
   * the brief's own account of the drawings says what fixes it — "a stage, a
   * floor and a reflection … the reflection is the cheapest thing that
   * separates a product shot from a diagram". The 3D pass dropped it.
   *
   * So: a real surface, near-black and slightly polished, which picks up the
   * studio and carries a soft reflection of whatever is standing on it. Its
   * alpha is a radial ramp, opaque under the subject and gone by the edge of
   * the frame, so the artboard's hero crop still reads as the room beyond.
   */
  const fade = document.createElement("canvas");
  fade.width = 512;
  fade.height = 512;
  {
    const x = fade.getContext("2d");
    const r = x.createRadialGradient(256, 256, 20, 256, 256, 220);
    r.addColorStop(0, "#b4b4b4");
    r.addColorStop(0.42, "#6e6e6e");
    r.addColorStop(1, "#000000");
    x.fillStyle = r;
    x.fillRect(0, 0, 512, 512);
  }
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 7, radius * 7),
    new THREE.MeshStandardMaterial({
      /* Dark and polished, not dark and matte. At roughness 0.42 the key's
         lobe spreads across the whole plane and the card comes back as a
         product on a white studio sweep, which is the opposite of the light
         this set is graded to. Glossy, and what it returns is a tight
         specular streak plus a reflection of whatever is standing on it. */
      /* Fully metallic, so there is no diffuse term at all. A part-metal floor
         under a 6x key comes back as a lit pool across the bottom of the card,
         brighter than the product standing in it, and no amount of tuning the
         roughness fixes that — the diffuse lobe is the problem. For a metal
         the specular is tinted by the base colour, and this base colour is
         near-black, so the key leaves a sheen rather than a spill. */
      color: 0x0b0e15,
      metalness: 1.0,
      /* Polished, not satin. The lobe width is the whole story here: at 0.26
         the key's mirror image spreads into a lit zone across the bottom-left
         of every card; tightened, it collapses to a point that falls behind
         the subject, and what is left on the floor is the environment and the
         object's own reflection. */
      roughness: 0.075,
      transparent: true,
      alphaMap: new THREE.CanvasTexture(fade),
      /* A horizontal mirror reflects the ceiling, and the ceiling here is the
         warm softbox. At full strength that is a lit pool across the bottom of
         every card, brighter than the product standing in it — the brief wants
         a near-black ground falling to #00040a. Held right down, what is left
         is the sheen and the object's own reflection, which is all it was for. */
      envMapIntensity: 0.42,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(centre.x, box.min.y, centre.z);
  ground.receiveShadow = true;

  /*
   * The reflection, as the brief describes it for the drawings: "the drawing
   * mirrored about its own foot and faded out … the cheapest thing that
   * separates a product shot from a diagram."
   *
   * A PMREM environment map contains the studio and nothing else, so a
   * polished floor under this scene reflects the room but never the object
   * standing on it. A mirrored copy below the floor plane is what puts the
   * object back into its own reflection, and the floor's alpha ramp is what
   * fades it out. It casts and receives nothing — it is an image, not a thing.
   */
  const mirror = built.object.clone(true);
  mirror.scale.y = -1;
  mirror.position.y = box.min.y * 2;
  mirror.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.material = o.material.clone();
    o.material.color.multiplyScalar(0.45);
    if (o.material.emissiveIntensity) o.material.emissiveIntensity *= 0.4;
  });
  /* Inverting one axis flips the winding, so front faces point away. */
  mirror.traverse((o) => {
    if (o.isMesh) o.material.side = THREE.BackSide;
  });
  scene.add(mirror, ground);

  const key = new THREE.DirectionalLight("#fff2e0", VIEW.lights.key.intensity * 6.0);
  /* Camera left and high, which is where the brief puts it — "warm tungsten
     key from camera left raking across the subject". It used to sit on the
     camera's own side, and on a polished floor that means the key's mirror
     image lands in open frame beside the object: a hard white oval that reads
     as lens spill and is the brightest thing on the card. From up and left the
     hotspot falls behind the subject. */
  key.position.set(-radius * 2.4, radius * 3.8, radius * 0.2);
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
  const COOL = { "#8fa8ff": "#dfe0dc", "#4a63c8": "#9a9c9c" };
  for (const l of [VIEW.lights.rim, VIEW.lights.fill]) {
    const d = new THREE.DirectionalLight(COOL[l.color] ?? l.color, l.intensity * 0.62);
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
