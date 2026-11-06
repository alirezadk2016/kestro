import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../../", import.meta.url));
const publicRoot = join(root, "public");
const manifest = join(root, "lib", "admin-media.json");
const imagePattern = /\.(webp|avif|png|jpe?g|svg)$/i;

async function imagePaths(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory())
      paths.push(...(await imagePaths(join(directory, entry.name), relative)));
    else if (entry.isFile() && imagePattern.test(entry.name)) paths.push(relative);
  }
  return paths.sort();
}

export async function currentMediaIndex() {
  const paths = await imagePaths(publicRoot);
  const images = [];
  for (const relative of paths) {
    const filename = join(publicRoot, ...relative.split("/"));
    const [info, file] = await Promise.all([sharp(filename).metadata(), stat(filename)]);
    if (!info.width || !info.height) throw new Error(`Missing image dimensions: ${relative}`);
    images.push({
      src: `/${relative}`,
      width: info.width,
      height: info.height,
      bytes: file.size,
      format: info.format === "heif" ? "avif" : info.format,
    });
  }
  return images;
}

export async function verifyMediaIndex() {
  const saved = JSON.parse(await readFile(manifest, "utf8"));
  const current = await currentMediaIndex();
  if (JSON.stringify(saved) !== JSON.stringify(current))
    throw new Error(
      "Media inventory is stale. Run node scripts/build/admin-media.mjs and commit lib/admin-media.json.",
    );
  return current.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--check")) {
    console.log(`media: ${await verifyMediaIndex()} image files match the inventory`);
  } else {
    const images = await currentMediaIndex();
    await writeFile(manifest, `${JSON.stringify(images, null, 2)}\n`);
    console.log(`media: indexed ${images.length} image files`);
  }
}
