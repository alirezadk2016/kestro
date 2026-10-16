import sharp from "sharp";
sharp.cache(false);

/*
 * The plate the hero is painted with.
 *
 * The artwork's own navigation band cannot be cleaned: the quote button is a
 * solid slab sitting on a diagonal ceiling edge, and no amount of opening or
 * interpolation puts that edge back — every attempt left a rectangle. So the
 * band is not used. The 81px the site's own header occupies is rebuilt
 * instead, by mirroring the ceiling immediately below it: the header is 82%
 * opaque glass, so what shows through is a fifth of a dark ceiling continuing
 * upward, which is what the eye expects there and what the reference shows.
 */
const SRC = process.argv[2], OUT = process.argv[3];
const NAV = 81, CUT = 90, TARGET_W = 2600;

const meta = await sharp(SRC).metadata();
const body = await sharp(SRC)
  .extract({ left: 0, top: CUT, width: meta.width, height: meta.height - CUT })
  .toBuffer();

const cap = await sharp(body)
  .extract({ left: 0, top: 0, width: meta.width, height: NAV })
  .flip()                      // mirror, so the ceiling reads as continuing
  .modulate({ brightness: 0.86 })
  .blur(3)
  .toBuffer();

const H = NAV + (meta.height - CUT);
// composite and resize are separate passes on purpose: sharp runs resize
// before composite inside one pipeline, which would scale the blank canvas and
// then drop the un-scaled layers into its top-left corner.
const joined = await sharp({ create: { width: meta.width, height: H, channels: 3, background: '#05080f' } })
  .composite([{ input: cap, top: 0, left: 0 }, { input: body, top: NAV, left: 0 }])
  .png()
  .toBuffer();

await sharp(joined)
  .resize({ width: TARGET_W, kernel: 'lanczos3' })
  .webp({ quality: 84, effort: 6 })
  .toFile(OUT);

const m2 = await sharp(OUT).metadata();
console.log(OUT, m2.width + 'x' + m2.height, 'ratio', (m2.width / m2.height).toFixed(4), 'src ratio', (meta.width / H).toFixed(4));
