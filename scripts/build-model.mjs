/*
 * Turns the source laptop scene into the file the site ships.
 *
 * The source is a 1.85 MB Sketchfab export with 110 separate meshes — fine in
 * a 3D viewer, far too heavy for a hero. This pass welds, simplifies and
 * quantises it down to ~840 kB (about 215 kB over the wire, and the browser
 * only fetches it after the page is usable) and lights the display panel, so
 * the laptop reads as a working machine rather than a dead slab on a dark hero.
 *
 * Meshopt compression would take the same model to 43 kB, but its decoder is
 * WebAssembly, and compiling WASM needs 'wasm-unsafe-eval' in the script-src
 * of next.config.mjs. Loosening a reviewed CSP to save bytes on a decorative
 * element is the wrong trade, so this ships plain quantised geometry. If the
 * directive is ever added for another reason, switch --compress to meshopt
 * and give HeroModel a MeshoptDecoder.
 *
 *   node scripts/build-model.mjs
 *
 * Writes public/models/laptop.glb. Re-run scripts/render-hero-still.mjs after,
 * so the poster frame matches what the canvas draws.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SOURCE = join(root, "assets/laptop/scene.gltf");
const OUT = join(root, "public/models/laptop.glb");

/* The one flat quad the model uses for the display. Named in the source
   export; if a future model replaces it, this is the line to update. */
const SCREEN_MATERIAL = "Material.099";
/* A screen on standby, not a lightbulb: enough to separate the panel from the
   navy behind it without turning the laptop into the page's brightest object. */
const SCREEN_EMISSIVE = [0.016, 0.028, 0.072];
const SCREEN_EMISSIVE_STRENGTH = 1;

const work = mkdtempSync(join(tmpdir(), "kestro-model-"));
const staged = join(work, "scene.gltf");
copyFileSync(join(root, "assets/laptop/scene.bin"), join(work, "scene.bin"));

const gltf = JSON.parse(readFileSync(SOURCE, "utf8"));
const screen = gltf.materials.find((m) => m.name === SCREEN_MATERIAL);
if (!screen) throw new Error(`No material named ${SCREEN_MATERIAL} in the source model`);
screen.emissiveFactor = SCREEN_EMISSIVE;
screen.extensions = {
  ...screen.extensions,
  KHR_materials_emissive_strength: {
    emissiveStrength: SCREEN_EMISSIVE_STRENGTH,
  },
};
if (!gltf.extensionsUsed.includes("KHR_materials_emissive_strength")) {
  gltf.extensionsUsed.push("KHR_materials_emissive_strength");
}
writeFileSync(staged, JSON.stringify(gltf));

execFileSync(
  "npx",
  [
    "--yes",
    "@gltf-transform/cli@4",
    "optimize",
    staged,
    OUT,
    "--compress",
    "quantize",
    // Palette mode merges materials into a texture atlas to save draw calls,
    // but GLTFLoader hands embedded images to the browser as blob: URLs, and
    // the site's CSP allows connect-src 'self' only. The source is twelve flat
    // colours with no textures of its own — keeping it that way costs a
    // handful of draw calls, leaves the policy intact, and is smaller anyway.
    "--palette=false",
  ],
  { stdio: "inherit" },
);

console.log(`${OUT} — ${(readFileSync(OUT).length / 1024).toFixed(1)} kB`);
