/*
 * Lifts the hero's background plate out of the supplied artwork.
 *
 * The artwork (design/reference/hero-reference.png) is a mockup of this whole
 * page: the navigation, the headline, both buttons, all four editorial marks
 * and the trust bar are painted into the pixels. Used as-is, every real
 * element on the page would land on top of a painted copy of itself. This
 * removes the type and leaves the room.
 *
 *   node design/reference/extract-scene.mjs \
 *     design/reference/hero-reference.png /tmp/scene-clean.png
 *   node design/reference/build-plate.mjs /tmp/scene-clean.png public/hero/scene.webp
 *
 * Every rectangle below is in the artwork's own 1942x809 pixel coordinates.
 */
import sharp from "sharp";
sharp.cache(false);

const SRC = process.argv[2], OUT = process.argv[3];
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = 3;
const px = Buffer.from(data);
const cl = (v,lo,hi)=>v<lo?lo:v>hi?hi:v;

// --- generic separable morphology on a Float32 tile -------------------------
function morph(buf, rw, rh, r, cmp) {
  const t = new Float32Array(rw*rh*C), o = new Float32Array(rw*rh*C);
  for (let y=0;y<rh;y++) for (let x=0;x<rw;x++) for (let c=0;c<C;c++){
    let m=buf[(y*rw+x)*C+c];
    for(let k=-r;k<=r;k++){ const v=buf[(y*rw+cl(x+k,0,rw-1))*C+c]; if(cmp(v,m))m=v; }
    t[(y*rw+x)*C+c]=m;
  }
  for (let y=0;y<rh;y++) for (let x=0;x<rw;x++) for (let c=0;c<C;c++){
    let m=t[(y*rw+x)*C+c];
    for(let k=-r;k<=r;k++){ const v=t[(cl(y+k,0,rh-1)*rw+x)*C+c]; if(cmp(v,m))m=v; }
    o[(y*rw+x)*C+c]=m;
  }
  return o;
}
const MIN=(a,b)=>a<b, MAX=(a,b)=>a>b;

function blur(buf, rw, rh, b) {
  if (b<=0) return buf;
  const t = new Float32Array(rw*rh*C), o = new Float32Array(rw*rh*C);
  for (let y=0;y<rh;y++) for (let x=0;x<rw;x++) for (let c=0;c<C;c++){
    let s=0,n=0; for(let k=-b;k<=b;k++){ s+=buf[(y*rw+cl(x+k,0,rw-1))*C+c]; n++; }
    t[(y*rw+x)*C+c]=s/n;
  }
  for (let y=0;y<rh;y++) for (let x=0;x<rw;x++) for (let c=0;c<C;c++){
    let s=0,n=0; for(let k=-b;k<=b;k++){ s+=t[(cl(y+k,0,rh-1)*rw+x)*C+c]; n++; }
    o[(y*rw+x)*C+c]=s/n;
  }
  return o;
}

// Coons-patch fill from the tile's own border (used where the painted element
// is a solid shape, which opening cannot remove).
function coons(src, rw, rh) {
  const o = new Float32Array(rw*rh*C);
  for (let y=0;y<rh;y++) for (let x=0;x<rw;x++) for (let c=0;c<C;c++){
    const u = rw>1 ? x/(rw-1) : 0, v = rh>1 ? y/(rh-1) : 0;
    const L=src[(y*rw+0)*C+c], R=src[(y*rw+rw-1)*C+c];
    const T=src[(0*rw+x)*C+c], B=src[((rh-1)*rw+x)*C+c];
    const c00=src[0*C+c], c10=src[(rw-1)*C+c], c01=src[((rh-1)*rw)*C+c], c11=src[((rh-1)*rw+rw-1)*C+c];
    o[(y*rw+x)*C+c] = (1-u)*L+u*R + (1-v)*T+v*B
      - ((1-u)*(1-v)*c00 + u*(1-v)*c10 + (1-u)*v*c01 + u*v*c11);
  }
  return o;
}

function apply(R) {
  const pad = R.mode ? (R.b||2) + 2 : R.r + R.b + 4;
  const x0 = cl(R.x-pad,0,W), y0 = cl(R.y-pad,0,H);
  const x1 = cl(R.x+R.w+pad,0,W), y1 = cl(R.y+R.h+pad,0,H);
  const rw = x1-x0, rh = y1-y0;
  const src = new Float32Array(rw*rh*C);
  for (let y=0;y<rh;y++) for (let x=0;x<rw;x++) for (let c=0;c<C;c++)
    src[(y*rw+x)*C+c] = px[(((y0+y)*W)+(x0+x))*C+c];

  let out;
  if (R.mode === 'patch') {
    // clone a same-shaped tile from an offset that carries the same structure
    out = new Float32Array(rw*rh*C);
    for (let y=0;y<rh;y++) for (let x=0;x<rw;x++) for (let c=0;c<C;c++)
      out[(y*rw+x)*C+c] = px[((cl(y0+y+(R.dy||0),0,H-1))*W + cl(x0+x+(R.dx||0),0,W-1))*C+c];
    out = blur(out, rw, rh, R.b||0);
  }
  else if (R.mode === 'coons') out = blur(coons(src,rw,rh), rw, rh, R.b||2);
  else out = blur(morph(morph(src,rw,rh,R.r,MIN), rw,rh,R.r,MAX), rw,rh,R.b);

  const f = R.f;
  for (let y=0;y<rh;y++) for (let x=0;x<rw;x++){
    const gx=x0+x, gy=y0+y;
    const d = Math.min(Math.min(gx-R.x, R.x+R.w-gx), Math.min(gy-R.y, R.y+R.h-gy));
    let a = cl((d+f)/(2*f),0,1); a = a*a*(3-2*a);
    if (a<=0) continue;
    for(let c=0;c<C;c++){
      const o=src[(y*rw+x)*C+c], v=out[(y*rw+x)*C+c];
      px[((gy*W)+gx)*C+c] = cl(Math.round(o*(1-a)+v*a),0,255);
    }
  }
}

function slabs(name, x, y, w, h, n, b, f) {
  const out = []; const sw = w / n;
  for (let i = 0; i < n; i++)
    out.push({ n: `${name}${i}`, mode: 'coons', x: Math.round(x + i*sw), y, w: Math.ceil(sw), h, b, f });
  return out;
}

/*
 * Two passes, because neither tool alone is enough.
 *
 * Pass 1 is a morphological opening: erode by r, dilate by r. Light strokes
 * thinner than 2r vanish and the ground's own level comes back, which is
 * exactly what removing white type off a photograph needs.
 *
 * Pass 2 is a Coons patch built from the tile's own border. It cannot run
 * first — the border would be cut through a glyph and the fill would smear
 * that glyph across the whole tile — but over an already-opened tile it has
 * clean edges to interpolate between, and it flattens the low-frequency ghost
 * the opening leaves behind where a block of type used to sit.
 */
const regions = [
  { n:'buttons', mode:'coons', x:160, y:486, w:445, h:78, b:6,  f:14 },

  { n:'headline', x:140,  y:150, w:570, h:340, r:17, b:14, f:22 },
  { n:'sub',      x:140,  y:386, w:390, h:96,  r:10, b:8,  f:14 },
  { n:'btn',      x:150,  y:474, w:470, h:100, r:13, b:10, f:16 },
  { n:'people',   x:978,  y:138, w:160, h:122, r:7,  b:5,  f:12 },
  { n:'ittoday',  x:1668, y:138, w:132, h:114, r:7,  b:5,  f:12 },
  { n:'scroll',   x:1836, y:600, w:84,  h:152, r:9,  b:7,  f:12 },
  { n:'trust',    x:92,   y:694, w:1200,h:96,  r:11, b:9,  f:14 },
  { n:'gooditt',  x:1524, y:698, w:240, h:92,  r:9,  b:7,  f:14 },

  ...slabs('h2',   146, 156, 558, 328, 3, 7, 14),
  ...slabs('s2',   146, 392, 378, 84,  2, 6, 12),
  ...slabs('b2',   156, 480, 458, 88,  2, 6, 12),
  ...slabs('p2',   984, 144, 148, 110, 1, 5, 11),
  ...slabs('i2',  1674, 144, 120, 102, 1, 5, 11),
  ...slabs('c2',  1842, 606, 72,  140, 1, 5, 11),
  ...slabs('t2',   100, 700, 1184, 84, 8, 5, 11),
  ...slabs('g2',  1532, 704, 224, 80,  2, 5, 11),
];
for (const R of regions) { apply(R); console.log('done', R.n); }

// --- the navigation band ----------------------------------------------------
// The site's own header sits over this once the hero is pulled up under it, so
// the painted one has to come out the same way the rest of the mockup's type
// did. The quote button is the exception: it is a solid blue slab over a
// diagonal ceiling edge, and neither opening nor interpolation can invent that
// edge back — so it is cloned from a clean stretch of the same ceiling to its
// left, then smoothed.
const navRegions = [
  { n:'cta',    mode:'patch', x:1640, y:10,  w:200, h:74, dx:-252, dy:0, b:2, f:10 },
  { n:'cta2',   x:1640, y:10, w:200, h:74, r:5, b:4, f:9 },
  { n:'logo',   x:104,  y:14, w:160, h:60, r:11, b:9, f:12 },
  { n:'links',  x:352,  y:24, w:548, h:38, r:9,  b:7, f:11 },
  { n:'lang',   x:1518, y:22, w:110, h:56, r:8,  b:6, f:11 },
  ...slabs('logo2',  110, 20, 148, 50, 1, 5, 10),
  ...slabs('links2', 358, 28, 536, 30, 4, 5, 10),
  ...slabs('lang2', 1524, 28, 98,  44, 1, 5, 10),
];
for (const R of navRegions) { apply(R); console.log('nav', R.n); }

await sharp(px, { raw: { width: W, height: H, channels: 3 } }).png().toFile(OUT);
console.log('wrote', OUT);
