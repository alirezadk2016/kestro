/*
 * Turns the source laptop scene into the files the site ships.
 *
 * The source is a 1.85 MB Sketchfab export with 110 separate meshes — fine in
 * a 3D viewer, far too heavy for a hero. This pass welds, simplifies and
 * quantises it, and lights the display panel so the laptop reads as a working
 * machine rather than a dead slab on a dark hero.
 *
 * It writes two files rather than one, because the lid has to move. The source
 * is a single rigid scene, so the split is made here: every mesh that sits
 * above the chassis is the lid, everything else is the base. The site loads
 * both and hangs the lid off a pivot at the hinge, which is the only way to
 * open and close it without shipping a rigged and animated model.
 *
 *   node scripts/build-model.mjs
 *
 * Writes public/models/laptop-base.glb and public/models/laptop-lid.glb.
 * Re-run scripts/render-hero-still.mjs after, so the poster frame matches.
 *
 * Meshopt compression would take these to a fifth of the size, but its decoder
 * is WebAssembly, and compiling WASM needs 'wasm-unsafe-eval' in the script-src
 * of next.config.mjs. Loosening a reviewed CSP to save bytes on a decorative
 * element is the wrong trade, so this ships plain quantised geometry, which the
 * browser only fetches once the page is already usable.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SOURCE = join(root, "assets/laptop/scene.gltf");
const OUT_DIR = join(root, "public/models");

/* The one flat quad the model uses for the display. Named in the source
   export; if a future model replaces it, this is the line to update. */
const SCREEN_MATERIAL = "Material.099";
/* A screen on standby, not a lightbulb: enough to separate the panel from the
   navy behind it without turning the laptop into the page's brightest object. */
const SCREEN_EMISSIVE = [0.016, 0.028, 0.072];
const SCREEN_EMISSIVE_STRENGTH = 1;

/*
 * Surfaces.
 *
 * The source model is built for a viewer with a bright default environment,
 * and its materials show it: half of them have roughness 0, and the chassis
 * has no metallicFactor at all, which glTF reads as fully metallic. Under a
 * real environment map that combination is a mirror — the lid catches the
 * softbox whole and flares to white as it turns, which is exactly what a
 * laptop shell does not do.
 *
 * So the surfaces are stated here rather than inherited: a dark anodised
 * chassis, matte keycaps, and glass only where there is actually glass. The
 * chassis keeps some metal so its edges still catch a highlight, and its base
 * colour is a deep blue-black, which is both closer to a real machine and the
 * reason the laptop sits in the same family as the rest of the page.
 */
const SURFACES = {
  /* Chassis and lid shell — the largest surface on the model. */
  "Material.007": { metallic: 0.5, roughness: 0.55, color: [0.05, 0.059, 0.094] },
  /* The pane in front of the display. */
  "Material.113": { metallic: 0.35, roughness: 0.16, color: [0.004, 0.006, 0.012] },
  /* The display itself, lit above. */
  "Material.099": { metallic: 0, roughness: 0.18 },
  /* Keycaps. */
  "Material.012": { metallic: 0.05, roughness: 0.52 },
  /* Key legends and the trackpad share one material in the source, so this is
     one value for both. At the source's 17% grey the trackpad reads as a sheet
     of paper dropped on the palm rest against a chassis at 5%; this is dark
     enough to sit on the deck while leaving the legends legible. */
  "Material.044": { metallic: 0, roughness: 0.7, color: [0.105, 0.108, 0.118] },
  "Material.106": { metallic: 0.1, roughness: 0.46, color: [0.075, 0.08, 0.095] },
  /* Vents, hinge caps and the rest of the small dark parts. */
  "Material.105": { metallic: 0.2, roughness: 0.5 },
  "Material.111": { metallic: 0.15, roughness: 0.5 },
  "Material.100": { metallic: 0.5, roughness: 0.44 },
  "Material.101": { metallic: 0, roughness: 0.42 },
  /* The red mark on the palm rest. */
  "Material.112": { metallic: 0.08, roughness: 0.45 },
};

/* Anything not named above still gets a floor on roughness and an explicit
   metallic value, so no surface is left mirror-smooth or accidentally metal. */
const DEFAULT_SURFACE = { metallic: 0, roughness: 0.45 };

/*
 * Everything reaching higher than this is lid. The chassis tops out at 0.52,
 * and although the lid's bottom edge dips to 0.28, its body is far above, so
 * any cut between roughly 0.55 and 1.0 splits the model the same way. The
 * counts are printed on every run, so a source model that does not split
 * cleanly is obvious immediately.
 */
const LID_MIN_HEIGHT = 0.55;

const gltf = JSON.parse(readFileSync(SOURCE, "utf8"));

for (const material of gltf.materials) {
  const surface = SURFACES[material.name];
  const pbr = (material.pbrMetallicRoughness ??= {});

  pbr.metallicFactor = surface?.metallic ?? DEFAULT_SURFACE.metallic;
  pbr.roughnessFactor = Math.max(
    surface?.roughness ?? DEFAULT_SURFACE.roughness,
    surface ? 0 : (pbr.roughnessFactor ?? 0),
  );
  if (surface?.color) pbr.baseColorFactor = [...surface.color, pbr.baseColorFactor?.[3] ?? 1];
}

const screen = gltf.materials.find((m) => m.name === SCREEN_MATERIAL);
if (!screen) throw new Error(`No material named ${SCREEN_MATERIAL} in the source model`);
screen.emissiveFactor = SCREEN_EMISSIVE;
screen.extensions = {
  ...screen.extensions,
  KHR_materials_emissive_strength: { emissiveStrength: SCREEN_EMISSIVE_STRENGTH },
};
if (!gltf.extensionsUsed.includes("KHR_materials_emissive_strength")) {
  gltf.extensionsUsed.push("KHR_materials_emissive_strength");
}

/* --- world transforms, so meshes are classified by where they actually sit --- */

const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

/** Column-major, the layout glTF stores matrices in. */
function localMatrix(node) {
  if (node.matrix) return node.matrix;

  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  const [x, y, z, w] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];

  return [
    (1 - 2 * (y * y + z * z)) * sx,
    2 * (x * y + z * w) * sx,
    2 * (x * z - y * w) * sx,
    0,
    2 * (x * y - z * w) * sy,
    (1 - 2 * (x * x + z * z)) * sy,
    2 * (y * z + x * w) * sy,
    0,
    2 * (x * z + y * w) * sz,
    2 * (y * z - x * w) * sz,
    (1 - 2 * (x * x + y * y)) * sz,
    0,
    tx,
    ty,
    tz,
    1,
  ];
}

function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      for (let k = 0; k < 4; k++) out[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
    }
  }
  return out;
}

function transformPoint(m, [x, y, z]) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

const worldMatrices = new Map();
(function walk(index, parent) {
  const world = multiply(parent, localMatrix(gltf.nodes[index]));
  worldMatrices.set(index, world);
  for (const child of gltf.nodes[index].children ?? []) walk(child, world);
})(gltf.scenes[gltf.scene ?? 0].nodes[0], IDENTITY);

/** World-space bounds of a node's mesh, or null if it has none. */
function boundsOf(index) {
  const node = gltf.nodes[index];
  if (node.mesh === undefined) return null;

  const world = worldMatrices.get(index);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  for (const primitive of gltf.meshes[node.mesh].primitives) {
    const accessor = gltf.accessors[primitive.attributes.POSITION];
    if (!accessor.min) continue;
    for (const x of [accessor.min[0], accessor.max[0]]) {
      for (const y of [accessor.min[1], accessor.max[1]]) {
        for (const z of [accessor.min[2], accessor.max[2]]) {
          const point = transformPoint(world, [x, y, z]);
          for (let k = 0; k < 3; k++) {
            min[k] = Math.min(min[k], point[k]);
            max[k] = Math.max(max[k], point[k]);
          }
        }
      }
    }
  }

  return min[0] === Infinity ? null : { min, max };
}

const lidNodes = [];
const baseNodes = [];
const lidBounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };

for (let i = 0; i < gltf.nodes.length; i++) {
  const bounds = boundsOf(i);
  if (!bounds) continue;

  if (bounds.max[1] > LID_MIN_HEIGHT) {
    lidNodes.push(i);
    for (let k = 0; k < 3; k++) {
      lidBounds.min[k] = Math.min(lidBounds.min[k], bounds.min[k]);
      lidBounds.max[k] = Math.max(lidBounds.max[k], bounds.max[k]);
    }
  } else {
    baseNodes.push(i);
  }
}

if (!lidNodes.length || !baseNodes.length) {
  throw new Error(`Split failed: ${lidNodes.length} lid meshes, ${baseNodes.length} base meshes`);
}

const round = (n) => Number(n.toFixed(3));
console.log(`lid: ${lidNodes.length} meshes, base: ${baseNodes.length} meshes`);
console.log(
  `lid bounds  x ${round(lidBounds.min[0])}..${round(lidBounds.max[0])}` +
    `  y ${round(lidBounds.min[1])}..${round(lidBounds.max[1])}`,
);
console.log("hinge in lib/hero-view.json belongs at the lid's lower back corner");

/* --- write one file per part --- */

const work = mkdtempSync(join(tmpdir(), "kestro-model-"));
copyFileSync(join(root, "assets/laptop/scene.bin"), join(work, "scene.bin"));

/*
 * Both parts keep the whole node tree and simply drop the meshes belonging to
 * the other one. Re-rooting the lid subtree would lose its ancestors'
 * transforms; this way each part flattens into exactly the world position it
 * occupies in the source, so the two files line up when loaded together. The
 * prune pass inside `optimize` then deletes the orphaned meshes and accessors.
 */
function writePart(name, keep) {
  const kept = new Set(keep);
  const part = JSON.parse(JSON.stringify(gltf));
  part.nodes.forEach((node, i) => {
    if (node.mesh !== undefined && !kept.has(i)) delete node.mesh;
  });

  const staged = join(work, `${name}.gltf`);
  writeFileSync(staged, JSON.stringify(part));

  const out = join(OUT_DIR, `laptop-${name}.glb`);
  execFileSync(
    "npx",
    [
      "--yes",
      "@gltf-transform/cli@4",
      "optimize",
      staged,
      out,
      "--compress",
      "quantize",
      // Palette mode merges materials into a texture atlas to save draw calls,
      // but GLTFLoader hands embedded images to the browser as blob: URLs, and
      // the site's CSP allows connect-src 'self' only. The source is twelve
      // flat colours with no textures of its own — keeping it that way costs a
      // handful of draw calls, leaves the policy intact, and is smaller anyway.
      "--palette=false",
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );

  console.log(`${out} — ${(readFileSync(out).length / 1024).toFixed(1)} kB`);
}

writePart("base", baseNodes);
writePart("lid", lidNodes);
