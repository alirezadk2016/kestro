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
import { buildSubject, screenSheen } from "/lib/card-subjects.mjs";

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

/*
 * Six frames from one shoot are not identical, and six frames that ARE
 * identical is a thing the eye notices without being able to name it: the set
 * reads as one file rendered six times rather than as an afternoon's work. A
 * stable hash of the card's name gives each one its own small trim — under a
 * fiftieth of a stop and a couple of percent of white balance, which is less
 * than the drift between two frames on the same roll.
 */
const LIFT = { "fleet-scene": 1.2 };

function shotTrim(name) {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const r = (n) => (((h >>> (n * 8)) & 255) / 255 - 0.5) * 2;
  return {
    /*
     * The jitter above is deliberate and tiny — no two shots in a set come off
     * a real camera at exactly the same stop. LIFT is not that: it is one
     * named shot printed brighter on purpose.
     *
     * fleet-scene is a long bench receding into a dark room, in a portrait
     * frame where the bottom third is covered by a gradient and the heading.
     * The subject is therefore small, far and dark, and check-cards measures
     * it at the size it is actually rendered: 17.1 against a floor of 18, and
     * the checker's own words for it are "subject too small or too dark".
     *
     * It passed before the room light was rebalanced, and it passed for the
     * wrong reason: the tan wash that used to sit over every board put a large
     * bright area in this frame, and a bright area raises the standard
     * deviation whether or not it is on the subject. Taking the wash out took
     * that contrast with it. Putting it back would be buying a number with a
     * haze, which is how these cards got brown in the first place.
     *
     * So the light goes on the bench instead of on the air in front of it.
     */
    exposure: (LIFT[name] ?? 1) * (1 + r(0) * 0.035),
    balance: [1 + r(1) * 0.022, 1 + r(2) * 0.012, 1 - r(1) * 0.022],
  };
}

window.__render = async function (name) {
  const [W, H] = BOARDS[name];
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    /* The depth-of-field pass writes straight (unpremultiplied) RGBA. With the
       context's default premultiplied alpha the browser would divide the
       colour through by alpha again on read-back and every soft edge would
       come out bright. */
    premultipliedAlpha: false,
  });
  renderer.setSize(W, H);
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  /* Kept for reference only: three applies tone mapping and the sRGB
     transfer when it draws to the CANVAS, and this scene is drawn to a render
     target so the depth-of-field pass can read it. Both are done in that
     pass's shader instead, at this same exposure. */
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
     way toward the key and the relative intensities are left alone.

     Better than half, in the end: at a third the chassis edge still came back
     periwinkle at 1:1 — a business laptop the colour of a school folder — and
     what a metal edge shows is this room. */
  const KEY_TINT = new THREE.Color("#fff0d8");
  const panels = [
    /* Capped. The hero's rim strip runs at intensity 5 — a 1.2 x 16 panel that
       is by a long way the brightest thing in this environment, and its job
       there is to separate one machine from a blue-lit photograph. On a card
       the rim comes from a directional light instead, and all that panel does
       is put a hard white shape into any polished surface facing up. */
    ...VIEW.studio.map((p) => ({
      ...p,
      intensity: Math.min(p.intensity, 2.2),
      color: "#" + new THREE.Color(p.color).lerp(KEY_TINT, 0.55).getHexString(),
    })),
    /* Big and soft, not small and hot. A horizontal polished floor
       reflects the ceiling, and the ceiling here is this panel: at 11x8 its
       mirror image was a hard white oval sitting in open frame beside the
       tower, reading as a lamp somebody left in the shot. Same energy spread
       over nine times the area, and the reflection becomes the wide gentle
       falloff a softbox actually gives. */
    { position: [0.5, 9, -1.0], size: [30, 22], color: "#fff0d8", intensity: 0.34 },
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
    /* The same single graze of light the monitor's panel carries. A pure
       mirror facing a dark room comes back pure black, and at 290px a pure
       black panel is a hole punched in the picture rather than glass. Usable
       only now that the quad has UVs. */
    /* Weak on purpose. An emissive map is view-independent, so twelve
       machines on three benches all carried the identical streak across their
       screens — and a dozen identical reflections is the clearest possible
       statement that these are copies of one object. Held down, the
       view-dependent mirror dominates instead, and a screen at a different
       angle to the room shows a different room. */
    emissive: 0xffffff,
    emissiveMap: screenSheen(),
    emissiveIntensity: 0.26,
  });
  const REGRADE = {
    /* Neutral-cool, not blue. At #212636 the blue runs 21 points ahead of
       the red, and under the cool rim that lands as periwinkle: a business
       laptop the colour of a school folder. The hero's own body is #161e25,
       where the same gap is 15 at half the luminance. */
    "Material.007": { color: 0x23262c }, // chassis, from #3f4556
    /* The lid shell, from #5b5c60. Roughness goes up with it: on the fleet
       card six lids lie flat under a steep key, and at the model's own
       polish that is six white rectangles — the one surface in the set where
       the key lands square instead of grazing. */
    "Material.044": { color: 0x212429, roughness: 0.62 },
    "Material.111": { color: 0x33363d }, // trim, from #696969
    "Material.112": { color: 0x1c2029 }, // the vermilion block; see 3 above
  };
  /** UVs for a four-corner quad, from its own edges. */
  function quadUv(geom) {
    const pos = geom.attributes.position;
    if (geom.attributes.uv || pos.count !== 4) return;
    const p = [];
    for (let i = 0; i < 4; i++) p.push(new THREE.Vector3().fromBufferAttribute(pos, i));
    const o = p[0];
    let u = p[1].clone().sub(o);
    let v = p[2].clone().sub(o);
    /* Whichever pair is closest to perpendicular is the quad's own frame. */
    if (Math.abs(u.clone().normalize().dot(v.clone().normalize())) > 0.4) {
      v = p[3].clone().sub(o);
    }
    const lu = u.lengthSq();
    const lv = v.lengthSq();
    const uv = new Float32Array(8);
    for (let i = 0; i < 4; i++) {
      const d = p[i].clone().sub(o);
      uv[i * 2] = d.dot(u) / lu;
      uv[i * 2 + 1] = d.dot(v) / lv;
    }
    geom.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }

  const dress = (root) =>
    root.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const n = o.material.name;
      if (n === "Material.099") {
        /* The panel is a four-vertex quad with no UVs, which is why it has
           only ever been able to be a flat colour or a plain mirror. A quad
           carries its own basis, though: project each corner onto the two edge
           vectors and the UVs follow. It is then the same glass as the
           monitor's, with the same single graze of light across it — and it is
           the largest surface on two of these six cards. */
        quadUv(o.geometry);
        o.material = GLASS;
        return;
      }
      if (!(n in REGRADE)) return;
      /* Object3D.clone shares materials by reference, so a clone must get its
         own before its colour is touched or every machine in the scene
         changes with it. */
      o.material = o.material.clone();
      const { color, ...rest } = REGRADE[n];
      o.material.color.setHex(color);
      Object.assign(o.material, rest);
    });

  /*
   * Surface imperfection.
   *
   * Not one mesh in either GLB carries a UV set — checked, both files, every
   * mesh. That is why every panel in these renders is mathematically uniform:
   * with no UVs there has never been anywhere to hang a roughness map, a
   * normal map, dust or a fingerprint, so the whole object is one polish value
   * from corner to corner. Nothing in the world is. It is the reason the
   * chassis reads as a solid colour rather than as a material, and no amount
   * of relighting fixes it.
   *
   * So the UVs are generated: a box projection, each vertex assigned to the
   * axis its normal points along most, the other two position components
   * becoming u and v. It seams at every corner, which does not matter for
   * noise, and it gives one consistent texel density across parts that were
   * modelled at different scales — a fingerprint on the lid is the same size
   * as one on the palm rest, which is the whole point.
   *
   * At 1 unit = 7 cm, a tile of 2.6 units is about 18 cm, so the 512px map
   * lands roughly three features per millimetre.
   */
  function boxUv(geom, tile) {
    if (geom.attributes.uv) return;
    const pos = geom.attributes.position;
    const nor = geom.attributes.normal;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const ax = Math.abs(nor ? nor.getX(i) : 0);
      const ay = Math.abs(nor ? nor.getY(i) : 1);
      const az = Math.abs(nor ? nor.getZ(i) : 0);
      let u;
      let v;
      if (ax >= ay && ax >= az) { u = z; v = y; }
      else if (ay >= az) { u = x; v = z; }
      else { u = x; v = y; }
      uv[i * 2] = u / tile;
      uv[i * 2 + 1] = v / tile;
    }
    geom.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }

  /* Value noise, four octaves, drawn once. The low octaves are the uneven
     polish a moulded panel actually has; the high one is the grain.
   *
   * Seeded, not Math.random(). The first line of the brief is that this set
   * has to be re-runnable — "if a render has to be redone in six months it
   * must come back matching" — and an unseeded noise map means every run
   * produces a different surface and therefore different measurements. Two
   * consecutive runs of the checker disagreeing by a point is not a change you
   * made; it is the floor moving under you, and it wastes a pass every time. */
  function noiseCanvas(size, octaves, contrast) {
    /* xorshift32, because it only has to be repeatable, not good. */
    let seed = 0x9e3779b9;
    const rand = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const x = c.getContext("2d");
    const img = x.createImageData(size, size);
    const grids = [];
    for (let o = 0; o < octaves; o++) {
      const n = 4 << o;
      const g = new Float32Array(n * n);
      for (let i = 0; i < g.length; i++) g[i] = rand();
      grids.push([n, g]);
    }
    const smooth = (t) => t * t * (3 - 2 * t);
    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        let v = 0;
        let amp = 1;
        let norm = 0;
        for (const [n, g] of grids) {
          const fx = (px / size) * n;
          const fy = (py / size) * n;
          const x0 = Math.floor(fx) % n;
          const y0 = Math.floor(fy) % n;
          const x1 = (x0 + 1) % n;
          const y1 = (y0 + 1) % n;
          const tx = smooth(fx - Math.floor(fx));
          const ty = smooth(fy - Math.floor(fy));
          const a = g[y0 * n + x0] * (1 - tx) + g[y0 * n + x1] * tx;
          const b = g[y1 * n + x0] * (1 - tx) + g[y1 * n + x1] * tx;
          v += (a * (1 - ty) + b * ty) * amp;
          norm += amp;
          amp *= 0.55;
        }
        v /= norm;
        v = 0.5 + (v - 0.5) * contrast;
        const i = (py * size + px) * 4;
        const b = Math.max(0, Math.min(255, Math.round(v * 255)));
        img.data[i] = b;
        img.data[i + 1] = b;
        img.data[i + 2] = b;
        img.data[i + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
    return c;
  }

  /* Height to normal, by central difference. three can shade a normal map
     without a tangent attribute — it derives the frame from screen-space
     derivatives — which is what makes this usable on generated UVs. */
  function toNormal(src, strength) {
    const size = src.width;
    const sx = src.getContext("2d").getImageData(0, 0, size, size).data;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const x = c.getContext("2d");
    const img = x.createImageData(size, size);
    const at = (px, py) =>
      sx[(((py + size) % size) * size + ((px + size) % size)) * 4] / 255;
    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const dx = (at(px + 1, py) - at(px - 1, py)) * strength;
        const dy = (at(px, py + 1) - at(px, py - 1)) * strength;
        const len = Math.sqrt(dx * dx + dy * dy + 1);
        const i = (py * size + px) * 4;
        img.data[i] = Math.round(((-dx / len) * 0.5 + 0.5) * 255);
        img.data[i + 1] = Math.round(((-dy / len) * 0.5 + 0.5) * 255);
        img.data[i + 2] = Math.round((1 / len) * 0.5 * 255 + 127.5);
        img.data[i + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
    return c;
  }

  const grain = noiseCanvas(512, 4, 0.55);
  const ROUGH = new THREE.CanvasTexture(grain);
  const BUMP = new THREE.CanvasTexture(toNormal(grain, 5));
  for (const t of [ROUGH, BUMP]) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  }

  /* Applied to everything standing in the shot, after it is built: the model's
     own panels and the props alike, so a monitor bezel and a laptop lid are
     the same plastic. The screens and the floor are left out — a mirror with
     dust in it reads as a dirty mirror, which is a different picture. */
  /*
   * Edge wear, from the geometry's own normals.
   *
   * These renders are of a company that sells REFURBISHED hardware, and every
   * object in them came out of the box this morning. Nothing about a factory-
   * perfect chassis is honest here and nothing about it is photographic: a
   * used machine is worn where it is handled, and on a chamfered black body
   * that wear is a bright line along every edge — the anodising rubbed back to
   * the metal under it. It is the single clearest signal that an object has a
   * history, and no lighting change substitutes for it.
   *
   * There is no wear map and, on geometry with no UVs worth the name, no way
   * to paint one. But this hardware is boxes with chamfers, and a chamfer has
   * a normal that points between two axes where a face has one that points
   * along one. So "how far is this vertex's normal from the nearest axis" is a
   * curvature mask for free, and it is exact on exactly the shapes this set is
   * made of.
   *
   * Vertex colours multiply, and multiplying cannot brighten. So the material
   * takes the WORN colour and the flat faces are darkened back down to the
   * body colour by their own vertex colour — the inverse of how it reads.
   */
  const WORN = 2.15;
  function wear(geom) {
    if (geom.__worn) return;
    geom.__worn = true;
    const nor = geom.attributes.normal;
    if (!nor) return;
    const n = nor.count;
    const col = new Float32Array(n * 3);
    const flat = 1 / WORN;
    for (let i = 0; i < n; i++) {
      const ax = Math.abs(nor.getX(i));
      const ay = Math.abs(nor.getY(i));
      const az = Math.abs(nor.getZ(i));
      /* 0 on a face, 0.29 on a 45 degree bevel, 0.42 on a corner. */
      const e = 1 - Math.max(ax, ay, az);
      const t = Math.min(1, Math.max(0, (e - 0.04) / 0.22));
      const w = t * t * (3 - 2 * t);
      const v = flat + (1 - flat) * w;
      col[i * 3] = v;
      col[i * 3 + 1] = v;
      col[i * 3 + 2] = v;
    }
    geom.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }

  const weather = (root) =>
    root.traverse((o) => {
      const m = o.isMesh && o.material;
      if (!m || !m.isMeshStandardMaterial) return;
      if (m === GLASS || m.name === "Material.099" || m.name === "screen") return;
      /* 18 cm per repeat. Tried at 1.3 cm, to stop the four-octave cloud
         stretching one tile across a whole lid — and the noise canvas does not
         tile seamlessly, so twenty-five repeats across a 32 cm lid turned into
         a visible diamond grid on the fleet card. Worse than the cloud. */
      boxUv(o.geometry, 2.6);
      wear(o.geometry);
      if (m.__weathered) return;
      m.__weathered = true;
      m.roughnessMap = ROUGH;
      /* roughnessMap multiplies, so the base has to sit at the rough end and
         the map carries it back down; a panel then runs between about 0.7 and
         1.0 of its nominal polish instead of being exactly one number. */
      m.roughness = Math.min(1, m.roughness * 1.18);
      m.normalMap = BUMP;
      m.normalScale = new THREE.Vector2(0.12, 0.12);
      m.vertexColors = true;
      m.color.multiplyScalar(WORN);
      m.needsUpdate = true;
    });

  const built = buildSubject(name, machine, dress);
  weather(built.object);
  scene.add(built.object);

  /* A subject may ask for practicals of its own — a lamp in the scene rather
     than a lamp on the set. Only the fleet room does, and the reason is in
     card-subjects: a directional light is parallel, so it cannot tell a near
     bench from a far one, and without that falloff a room of desks is a
     pattern rather than a room. */
  for (const l of built.lights ?? []) {
    const p = new THREE.PointLight(l.color, l.intensity, l.distance ?? 0, l.decay ?? 2);
    p.position.set(l.position[0], l.position[1], l.position[2]);
    p.castShadow = true;
    p.shadow.mapSize.set(1024, 1024);
    p.shadow.bias = -0.002;
    scene.add(p);
  }


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
  const ramp = (stops) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const x = c.getContext("2d");
    const r = x.createRadialGradient(256, 256, 20, 256, 256, 220);
    for (const [at, col] of stops) r.addColorStop(at, col);
    x.fillStyle = r;
    x.fillRect(0, 0, 512, 512);
    return c;
  };
  /*
   * How far the floor reaches, and it is the reason the set looked hazy.
   *
   * Settled by looking at the alpha channel rather than by counting it, after
   * the bloom had been blamed and tightened to no effect and this ramp had
   * been tightened for another three percent. The plane was radius x 7 — wide
   * enough that its pool filled the lower half of every frame and ran up both
   * sides, which at partial alpha is not a floor, it is fog, sitting over the
   * room the artboard had gone to some trouble to put behind the subject.
   *
   * Two numbers do this, and only one of them is the ramp: the plane is a
   * little over three radii now, and the ramp is gone by half of that. A
   * polished surface in a low-key shot is visible where the object meets it
   * and gone within a foot — the same thing the roughness ramp below says
   * about its reflection.
   */
  const fade = ramp([
    [0, "#a8a8a8"],
    [0.22, "#5e5e5e"],
    [0.52, "#161616"],
    [1, "#000000"],
  ]);
  /*
   * A roughness ramp, and it is the thing that makes this floor behave.
   *
   * A uniformly polished floor is a mirror of the whole room, and this room
   * contains the hero's rim strip — a 1.2 x 16 panel at intensity 5, by a long
   * way the brightest thing in the environment. Mirrored, it lands as a hard
   * white oval in open frame beside the subject and reads as a lamp somebody
   * left in the shot. Moving the key did not touch it and neither did
   * softening the overhead, because it was never either of those: rendering
   * the card with the floor removed is what settled it.
   *
   * Every polished floor in the world behaves this way instead — mirror-sharp
   * where the object meets it, dissolving within a foot or so. So: smooth at
   * the centre, rough by a third of the way out. The object keeps its
   * reflection; the room does not get one.
   */
  const polish = ramp([
    [0, "#3c3c3c"],
    [0.12, "#5c5c5c"],
    [0.34, "#dcdcdc"],
    [1, "#ffffff"],
  ]);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 3.1, radius * 3.1),
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
      roughnessMap: new THREE.CanvasTexture(polish),
      /* Polished, not satin. The lobe width is the whole story here: at 0.26
         the key's mirror image spreads into a lit zone across the bottom-left
         of every card; tightened, it collapses to a point that falls behind
         the subject, and what is left on the floor is the environment and the
         object's own reflection. */
      roughness: 0.62,
      transparent: true,
      alphaMap: new THREE.CanvasTexture(fade),
      /* A horizontal mirror reflects the ceiling, and the ceiling here is the
         warm softbox. At full strength that is a lit pool across the bottom of
         every card, brighter than the product standing in it — the brief wants
         a near-black ground falling to #00040a. Held right down, what is left
         is the sheen and the object's own reflection, which is all it was for. */
      envMapIntensity: 0.32,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(centre.x, box.min.y, centre.z);
  ground.receiveShadow = true;

  /*
   * The reflection is NOT built here, and the reason is worth keeping.
   *
   * It was: a clone of the subject with scale.y = -1 below the floor plane.
   * That is the correct mirror transform for geometry, and it is wrong for
   * light. Flipping y flips the normals with it, so every surface that faced
   * away from the key in the real object faces into it in the copy — the
   * reflection came out BRIGHTER than the thing it was reflecting, and on the
   * fleet card it was a white slab under the stack that took the whole picture
   * with it. Rendering the card with the mirror removed is what settled that,
   * after the floor and then the lights had each been blamed for it.
   *
   * Lighting it correctly would mean mirroring every light and the environment
   * as well. A photograph does not need that: the reflection of the subject is
   * the subject's own image, flipped about the line where it meets the floor.
   * So the baseline goes out with the render and the artboard does the flip,
   * which is exact in brightness by construction.
   */
  scene.add(ground);

  const key = new THREE.DirectionalLight("#fff2e0", VIEW.lights.key.intensity * 6.0);
  /* Camera left and high, which is where the brief puts it — "warm tungsten
     key from camera left raking across the subject". It used to sit on the
     camera's own side, and on a polished floor that means the key's mirror
     image lands in open frame beside the object: a hard white oval that reads
     as lens spill and is the brightest thing on the card. From up and left the
     hotspot falls behind the subject — which needs it BEHIND the subject on
     z as well, or on a card shot from further round it walks back into open
     frame as a hard white oval, and reads as a lamp someone left in the shot. */
  key.position.set(-radius * 2.2, radius * 3.6, -radius * 1.6);
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

  /*
   * The kicker, which is the light this set was missing.
   *
   * These objects are graphite on a near-black ground, and until now the only
   * thing separating them from it was a floor pool bright enough to read as
   * fog. Take the fog away and a black laptop sits on black. The answer is not
   * more ambient — it is the light every product photographer puts behind and
   * to the side of a dark subject: a hard source raking the far edge, drawing
   * one bright line down the silhouette and stopping there.
   *
   * It is also the light the edge wear was drawn for. A rubbed chamfer is only
   * visible when something grazes it, and a key from the front cannot: the two
   * were built for each other, and the card only reads as used hardware with
   * both.
   *
   * Cool, because the brief's fill is blue-hour through glazing and this is
   * that window. Warm key, cool kicker, near-black between them.
   */
  const kicker = new THREE.DirectionalLight("#cfd9f2", VIEW.lights.key.intensity * 3.6);
  kicker.position.set(radius * 2.6, radius * 1.5, -radius * 2.4);
  kicker.target.position.copy(centre);
  scene.add(kicker, kicker.target);

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

  /*
   * Depth of field.
   *
   * The style block at the top of the brief says "100mm macro, f/5.6, shot at
   * desk height", and a 100mm macro at f/5.6 focused on a laptop holds a few
   * centimetres. Every render up to here was sharp from the nearest corner of
   * the frame to the far wall, which no photograph has ever been, and it is
   * the loudest single thing in these pictures saying "rendered".
   *
   * three ships a BokehPass and it is no use here: it writes opaque RGB, and
   * these renders have to come out on a transparent ground for the artboard to
   * composite them. So the blur is done by hand, with two details that matter:
   *
   *  - **Premultiplied accumulation.** Blurring straight RGBA pulls the black
   *    behind transparent pixels into every soft edge, and the subject gets a
   *    dark halo. Colour is accumulated weighted by alpha and divided back out
   *    at the end.
   *  - **Scatter as gather.** A sample only contributes where its own circle
   *    of confusion actually reaches the pixel being written. Without that, a
   *    defocused background bleeds over a subject that is in focus, which
   *    reads as a halo rather than as depth.
   */
  const target = new THREE.WebGLRenderTarget(W, H, {
    samples: 4,
    type: THREE.HalfFloatType,
  });
  target.depthTexture = new THREE.DepthTexture(W, H);
  target.depthTexture.type = THREE.UnsignedIntType;

  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  /* Focus on the subject's own centre, and let the aperture be per-subject:
     a teardown wants most of its layers readable, a single machine can fall
     away hard. */
  const focus = camera.position.distanceTo(centre);
  const trim = shotTrim(name);
  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
      uniforms: {
        tColor: { value: target.texture },
        tDepth: { value: target.depthTexture },
        uNear: { value: camera.near },
        uFar: { value: camera.far },
        uFocus: { value: focus },
        uScale: { value: (built.aperture ?? 1) * 0.42 },
        uMaxPx: { value: Math.max(W, H) * 0.0055 },
        /* 2.35 was set when a floor pool the size of the frame was carrying
           a third of every card's light. With that gone the whole set sat at
           the bottom of the brief's band — means of 26 against a hero of 39 —
           so the exposure that was always notionally right is now actually
           needed. */
        uExposure: { value: VIEW.exposure * 2.8 * trim.exposure },
        uBalance: { value: new THREE.Vector3(...trim.balance) },
        uBloomPx: { value: Math.max(W, H) * 0.009 },
        uBloom: { value: 0.3 },
        uTexel: { value: new THREE.Vector2(1 / W, 1 / H) },
      },
      vertexShader: \`
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      \`,
      fragmentShader: \`
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D tColor;
        uniform sampler2D tDepth;
        uniform float uNear, uFar, uFocus, uScale, uMaxPx, uExposure;
        uniform float uBloomPx, uBloom;
        uniform vec3 uBalance;
        uniform vec2 uTexel;

        float viewZ(vec2 uv) {
          float d = texture2D(tDepth, uv).x * 2.0 - 1.0;
          return (2.0 * uNear * uFar) / (uFar + uNear - d * (uFar - uNear));
        }

        /* Circle of confusion in pixels. Clamped, or a far background turns to
           porridge and takes the room with it. */
        float coc(float z) {
          return min(abs(z - uFocus) / max(z, 0.001) * uScale, 1.0) * uMaxPx;
        }

        /* three applies tone mapping and the sRGB transfer only when it draws
           to the canvas — a render target gets neither. This pass reads a
           linear HDR target, so it has to do both itself, and that is the
           right order anyway: the blur happens in linear light, which is what
           makes a defocused highlight bloom out the way a lens does rather
           than smearing a clipped white. */
        vec3 aces(vec3 c) {
          const mat3 IN = mat3(
            0.59719, 0.07600, 0.02840,
            0.35458, 0.90834, 0.13383,
            0.04823, 0.01566, 0.83777);
          const mat3 OUT = mat3(
             1.60475, -0.10208, -0.00327,
            -0.53108,  1.10813, -0.07276,
            -0.07367, -0.00605,  1.07602);
          c = IN * c;
          vec3 a = c * (c + 0.0245786) - 0.000090537;
          vec3 b = c * (0.983729 * c + 0.432951) + 0.238081;
          return clamp(OUT * (a / b), 0.0, 1.0);
        }

        vec3 srgb(vec3 c) {
          return mix(pow(c, vec3(0.41666)) * 1.055 - 0.055, c * 12.92,
                     step(c, vec3(0.0031308)));
        }

        const int RINGS = 4;
        const int PER = 10;

        void main() {
          float zc = viewZ(vUv);
          float rc = coc(zc);

          vec4 c0 = texture2D(tColor, vUv);
          vec3 sum = c0.rgb * c0.a;
          float aSum = c0.a;
          float wSum = 1.0;

          /* Taps go out to the full aperture every time, not to this pixel's
             own blur radius: a sample contributes where its OWN circle of
             confusion reaches, which is the only way a defocused foreground
             can spread over something sharp behind it. */
          for (int r = 1; r <= RINGS; r++) {
            float rad = uMaxPx * (float(r) / float(RINGS));
            for (int i = 0; i < PER; i++) {
              float a = (float(i) / float(PER)) * 6.2831853 + float(r) * 0.61;
              vec2 uv = vUv + vec2(cos(a), sin(a)) * rad * uTexel;
              float zs = viewZ(uv);
              float w = clamp(coc(zs) - rad + 1.0, 0.0, 1.0);
              /* A sample behind a pixel that is in focus must not bleed onto
                 it — that is a halo, not depth. One in front still may. */
              if (zs > zc) w *= smoothstep(0.0, 1.5, rc);
              vec4 cs = texture2D(tColor, uv);
              sum += cs.rgb * cs.a * w;
              aSum += cs.a * w;
              wSum += w;
            }
          }

          float alpha = aSum / wSum;
          vec3 lin = alpha > 0.0001 ? sum / aSum : vec3(0.0);

          /* Lateral chromatic aberration. The red and blue channels of a real
             lens do not land on the same photosite away from the axis, and the
             error grows with the square of the distance from centre. It is
             under a pixel here and never reads as colour at card size — what
             it removes is the digital perfection of an edge, which is one of
             the things a viewer reads as "rendered" without being able to say
             why. Sampled off the already-defocused colour, so it rides on the
             blur rather than fighting it. */
          vec2 d = vUv - 0.5;
          float r2 = dot(d, d);
          vec2 shift = d * r2 * 0.0065;
          float rr = texture2D(tColor, vUv - shift).r;
          float bb = texture2D(tColor, vUv + shift).b;
          lin = mix(lin, vec3(rr, lin.g, bb), smoothstep(0.02, 0.22, r2) * alpha);

          vec3 lit = lin * uExposure;

          /* Bloom, thresholded in linear light after exposure.
             A highlight on a real lens is not bounded by the object's edge —
             it spills, which is why a chrome bevel in a photograph has a halo
             and the same bevel in a render has a hairline. Only what is
             genuinely brighter than the threshold contributes, so a mid-grey
             panel glows not at all; and where the spill lands outside the
             silhouette it raises alpha, so the glow reaches the artboard
             instead of being clipped to the object. */
          vec3 halo = vec3(0.0);
          float hw = 0.0;
          for (int r = 1; r <= 3; r++) {
            float rad = uBloomPx * (float(r) / 3.0);
            for (int i = 0; i < 8; i++) {
              float a = (float(i) / 8.0) * 6.2831853 + float(r) * 1.13;
              vec4 cs = texture2D(tColor, vUv + vec2(cos(a), sin(a)) * rad * uTexel);
              vec3 e = max(cs.rgb * cs.a * uExposure - 1.35, 0.0);
              float w = 1.0 / float(r);
              halo += e * w;
              hw += w;
            }
          }
          halo = halo / max(hw, 0.001) * uBloom;
          lit += halo;
          /* Tight and weak. A bloom is light added at an edge, not coverage
             added to a frame — at a 48px radius with a 0.8 ceiling this was
             lifting alpha well away from anything bright. (It was NOT the
             cause of the grey wash over these cards, which is what it was
             first blamed for: tightening it moved the frame's faint-alpha
             coverage by 0.0%. The floor was.) */
          float glow = clamp(dot(halo, vec3(0.2126, 0.7152, 0.0722)) * 0.35, 0.0, 0.18);

          /*
           * The grade.
           *
           * ACES and an sRGB transfer is a correct picture and not yet a
           * photograph. Three things every capture has and no renderer gives
           * you for free:
           *
           *  - **A toe.** A lens flares, a sensor has a floor, and a print has
           *    ink: the blacks in a photograph are never zero. Clamping them
           *    to zero is most of what makes a dark render look like a dark
           *    render — the shadows go dead rather than deep.
           *  - **Split tone.** Every film stock and every colourist separates
           *    the ends: shadows toward the cool end, highlights toward the
           *    warm. It is the same separation this set's lighting is built on
           *    — warm key, cool blue-hour fill — carried into the grade, so
           *    the light and the print agree instead of fighting.
           *  - **A shoulder.** Contrast added as a smooth S rather than a
           *    gain, so the midtones firm up without the highlights clipping.
           */
          vec3 g = aces(lit) * uBalance;
          /* Weighted by coverage: a toe belongs under the picture, and the
             bloom's outer spill is not picture — lifting it is how a halo
             turns into fog. */
          g = g + vec3(0.013, 0.015, 0.022) * (1.0 - g) * alpha;
          float lum = dot(g, vec3(0.2126, 0.7152, 0.0722));
          vec3 cool = vec3(0.955, 0.985, 1.055);
          vec3 warm = vec3(1.045, 1.0, 0.945);
          g *= mix(cool, warm, smoothstep(0.10, 0.70, lum));
          g = mix(g, g * g * (3.0 - 2.0 * g), 0.24);

          gl_FragColor = vec4(srgb(clamp(g, 0.0, 1.0)), max(alpha, glow));
        }
      \`,
    }),
  );
  const flat = new THREE.Scene();
  flat.add(quad);
  renderer.render(flat, new THREE.Camera());

  /* Where the subject meets the floor, as a fraction of board height, so the
     artboard knows which line to flip the reflection about. */
  const foot = new THREE.Vector3(centre.x, box.min.y, centre.z).project(camera);
  const baseline = (1 - foot.y) / 2;

  const url = renderer.domElement.toDataURL("image/png");
  target.dispose();
  renderer.dispose();
  return { url, baseline };
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
  const { url, baseline } = await tab.evaluate((n) => window.__render(n), name);
  const data = Buffer.from(url.split(",")[1], "base64");
  const file = join(out, `${name}.png`);
  writeFileSync(file, data);
  writeFileSync(join(out, `${name}.json`), JSON.stringify({ baseline }));
  console.log(
    `${name.padEnd(14)} ${(data.length / 1024).toFixed(0)} kB  baseline ${baseline.toFixed(3)}`,
  );
}

await browser.close();
server.close();
