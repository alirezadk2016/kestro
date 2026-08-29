/**
 * Turns the photographs in assets/team/ into the ones the site serves.
 *
 * The site never names a photo file in advance. lib/company.ts reads
 * lib/team-photos.json, which this script rewrites from whatever is actually
 * on disk, so a person with no picture yet gets a monogram rather than a
 * broken image — and gets a face the moment the file lands, with no code
 * change.
 *
 *   assets/team/<id>.<jpg|jpeg|png|webp>  ->  public/team/<id>.webp
 *
 * <id> has to match the id in lib/company.ts. Anything else in the folder is
 * reported and skipped, because a photo named after nobody is a photo that
 * silently never appears.
 *
 * Run: node scripts/build-team-photos.mjs
 */
import { createRequire } from "node:module";
import { readdir, mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "assets", "team");
const OUT = path.join(root, "public", "team");
const MAP = path.join(root, "lib", "team-photos.json");

/* Twice the largest slot the cards use (160px), so the picture still holds up
   on a 2x display without shipping a 4000px portrait to a phone. */
const SIZE = 320;
const ACCEPTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** The ids lib/company.ts actually knows about. */
async function knownIds() {
  const source = await readFile(path.join(root, "lib", "company.ts"), "utf8");
  return new Set(Array.from(source.matchAll(/^\s*id: "([^"]+)",$/gm), (m) => m[1]));
}

async function main() {
  const ids = await knownIds();
  let files = [];
  try {
    files = await readdir(SOURCE);
  } catch {
    console.log(`No ${path.relative(root, SOURCE)}/ — nothing to build.`);
  }

  await mkdir(OUT, { recursive: true });
  const map = {};

  for (const file of files.sort()) {
    const ext = path.extname(file).toLowerCase();
    if (!ACCEPTS.has(ext)) continue;

    const id = path.basename(file, ext);
    if (!ids.has(id)) {
      console.warn(
        `  skipped ${file}: no team member with id "${id}" in lib/company.ts ` +
          `(known: ${Array.from(ids).join(", ")})`,
      );
      continue;
    }

    const target = path.join(OUT, `${id}.webp`);
    /* Square, and anchored at the top: a portrait cropped from the centre
       cuts foreheads off, which is exactly the crop a face lands in here. */
    const info = await sharp(path.join(SOURCE, file))
      .rotate()
      .resize(SIZE, SIZE, { fit: "cover", position: "top" })
      .webp({ quality: 82 })
      .toFile(target);

    map[id] = `/team/${id}.webp`;
    console.log(`  ${file} -> public/team/${id}.webp  ${Math.round(info.size / 1024)} kB`);
  }

  await writeFile(MAP, `${JSON.stringify(map, null, 2)}\n`, "utf8");
  const count = Object.keys(map).length;
  console.log(
    count
      ? `lib/team-photos.json: ${count} photo${count === 1 ? "" : "s"}.`
      : "lib/team-photos.json: empty — everyone renders as a monogram.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
