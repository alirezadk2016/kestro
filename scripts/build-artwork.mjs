import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "assets", "artwork");
const manifest = JSON.parse(await readFile(path.join(sourceDir, "manifest.json"), "utf8"));
const group = process.argv[2];

for (const asset of manifest.exports.filter((asset) => !group || asset.group === group)) {
  const source = path.join(sourceDir, `${asset.source}.png`);
  const target = path.join(root, "public", asset.output);
  const metadata = await sharp(source).metadata();
  let image = sharp(source).rotate();

  if (asset.crop) {
    const [x, y, width, height] = asset.crop;
    image = image.extract({
      left: Math.round(x * metadata.width),
      top: Math.round(y * metadata.height),
      width: Math.floor(width * metadata.width),
      height: Math.floor(height * metadata.height),
    });
  }

  image = image.resize(asset.width, asset.height, {
    fit: "cover",
    position: asset.position ?? "centre",
    withoutEnlargement: true,
  });
  const encoded = asset.output.endsWith(".avif")
    ? image.avif({ quality: asset.avifQuality ?? 65, effort: 6, chromaSubsampling: "4:4:4" })
    : image.webp({ quality: asset.quality ?? 88, effort: 6, smartSubsample: true });

  await mkdir(path.dirname(target), { recursive: true });
  const info = await encoded.toFile(target);
  if (info.width !== asset.width || info.height !== asset.height) {
    throw new Error(`${asset.output}: source is too small for ${asset.width}x${asset.height}`);
  }
  console.log(`${asset.output}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} kB`);
}

if (!group || group === "hero") {
  const placeholder = await sharp(path.join(root, "public", "hero", "scene-mobile.webp"))
    .resize(32, 31)
    .blur(2)
    .webp({ quality: 40 })
    .toBuffer();
  await writeFile(
    path.join(root, "lib", "artwork-placeholders.json"),
    `${JSON.stringify({ heroMobile: `data:image/webp;base64,${placeholder.toString("base64")}` }, null, 2)}\n`,
  );
}
