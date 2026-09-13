/*
 * The axonometric drawing kit the six card artworks are built from.
 *
 * Every card on the site used to be a bought render: brighter than the hero
 * photograph, lit blue from every direction where the hero's key light is
 * warm, and carrying almost no local contrast at the size it actually
 * renders. None of that is a matter of taste — scripts/build/check-cards.mjs
 * measures all three. Drawing the artwork instead of buying it means the
 * light can be matched to the plate on purpose, and it means the artwork is
 * a file in the repository that can be re-rendered rather than an asset
 * nobody can reproduce.
 *
 * The projection is a true isometric: x runs down to the right, z down to
 * the left, y straight up. The viewer stands at (1, 1, 1), which is what
 * decides both which faces are visible and what has to be drawn first.
 */
const C = Math.cos(Math.PI / 6);
const Sn = Math.sin(Math.PI / 6);

export const P = (x, y, z) => [(x - z) * C, (x + z) * Sn - y];

const pt = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
export const poly = (pts) => pts.map(pt).join(" ");

/*
 * Each face is a gradient rather than one flat value, and all three are
 * near-opaque.
 *
 * Opaque because solids have to occlude: drawn translucent, a four-layer
 * teardown and a room of desks let every hidden edge through and the artwork
 * read as wireframe soup. Gradients because a flat fill turns an axonometric
 * drawing into a clay render — a plane reads as modelled only when the light
 * falls off across it.
 *
 * The three ramps are the hero's own light, measured off the plate: a warm
 * lit top, a warm key side, a cool shadow side. They are defined in the
 * artboard's <defs>, in boards.mjs.
 */
export const FACE = { top: "url(#lit)", key: "url(#keyf)", fill: "url(#fillf)" };
export const EDGE = { lit: "rgba(246,238,223,0.62)", dim: "rgba(146,172,204,0.30)" };

/* A rectangular solid: the three faces the viewer can see, back to front. */
export function box(x, y, z, w, h, d, o = {}) {
  const top = [P(x, y + h, z), P(x + w, y + h, z), P(x + w, y + h, z + d), P(x, y + h, z + d)];
  const key = [P(x, y, z + d), P(x, y + h, z + d), P(x + w, y + h, z + d), P(x + w, y, z + d)];
  const fil = [P(x + w, y, z), P(x + w, y + h, z), P(x + w, y + h, z + d), P(x + w, y, z + d)];
  const sw = o.sw ?? 1.7;
  return [
    `<polygon points="${poly(fil)}" fill="${o.fill ?? FACE.fill}" stroke="${EDGE.dim}" stroke-width="${sw * 0.8}"/>`,
    `<polygon points="${poly(key)}" fill="${o.keyFill ?? FACE.key}" stroke="${EDGE.lit}" stroke-width="${sw}"/>`,
    `<polygon points="${poly(top)}" fill="${o.topFill ?? FACE.top}" stroke="${EDGE.lit}" stroke-width="${sw}"/>`,
  ].join("");
}

/* The +z face on its own, for screens and panels. */
export function keyFace(x, y, z, w, h, o = {}) {
  const f = [P(x, y, z), P(x, y + h, z), P(x + w, y + h, z), P(x + w, y, z)];
  return `<polygon points="${poly(f)}" fill="${o.fill}" stroke="${o.stroke ?? "none"}" stroke-width="${o.sw ?? 1}"/>`;
}

/* A line in model space. */
export function seg(a, b, o = {}) {
  const [x1, y1] = P(...a);
  const [x2, y2] = P(...b);
  return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${o.stroke ?? EDGE.dim}" stroke-width="${o.sw ?? 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`;
}

/*
 * Painter's order. The viewer stands at (1, 1, 1), so a solid is nearer the
 * eye the larger its x + z. Anything drawn out of that order reads as two
 * transparent boxes passing through each other, which is exactly what the
 * first pass at the fleet card looked like.
 */
export function stack(items) {
  return items
    .slice()
    .sort((a, b) => (a.d ?? 0) - (b.d ?? 0))
    .map((i) => i.g)
    .join("");
}

/*
 * The contact shadow. Without it every object floats a centimetre above its
 * own ground and the card reads as pasted together — which was the single
 * loudest tell on the artwork this replaces.
 */
export function shadow(cx, cz, w, d, o = {}) {
  const [x, y] = P(cx, 0, cz);
  const rx = (w + d) * 0.46 * (o.scale ?? 1);
  return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${(rx * 0.4).toFixed(2)}" fill="url(#contact)"/>`;
}
