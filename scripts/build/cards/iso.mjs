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

/*
 * The rim light is the whole trick. A mid-grey body with a mid-grey edge is a
 * clay render — which is exactly what the first version of these looked like.
 * A near-black body with a hot cream edge is a product shot. The light does
 * not land on the faces; it catches the edges, and the faces stay dark.
 */
/*
 * Three lights, which is how anything gets photographed. `lit` is the warm
 * key, up and to the left, off the concrete in the hero plate. `mid` is the
 * chamfer between two lit faces. `rim` is the kicker: a cool hard light from
 * behind and right whose only job is to draw the far silhouette so a
 * near-black object separates from a near-black room. Without it the shadow
 * side of every one of these dissolved into the background.
 */
export const EDGE = {
  lit: "rgba(255,243,222,0.92)",
  mid: "rgba(196,206,226,0.34)",
  rim: "rgba(152,190,255,0.52)",
  dim: "rgba(110,138,184,0.20)",
};

/*
 * A rectangular solid.
 *
 * The faces carry no outline of their own. Every edge is drawn separately and
 * weighted by where the light is, which is up and to the left — the hero's
 * key. A box stroked at one value the whole way round is clip art: the tell
 * is that the edge running away from the light is as bright as the edge
 * facing it, which happens in no photograph ever taken.
 *
 * Screen positions of the eight corners, in this projection: A is the top
 * point, C the bottom of the lit face, D the left, B the right. So D-A is the
 * upper-left silhouette and takes the light full on; B-C faces away and is
 * barely there.
 */
export function box(x, y, z, w, h, d, o = {}) {
  const A = [x, y + h, z];
  const B = [x + w, y + h, z];
  const C = [x + w, y + h, z + d];
  const D = [x, y + h, z + d];
  const b0 = [x + w, y, z];
  const c0 = [x + w, y, z + d];
  const d0 = [x, y, z + d];
  const sw = o.sw ?? 1.7;
  const face = (pts, fill) => `<polygon points="${poly(pts.map((p) => P(...p)))}" fill="${fill}"/>`;
  const edge = (p, q, stroke, mul) => seg(p, q, { stroke, sw: sw * mul });
  return [
    face([b0, B, C, c0], o.fill ?? FACE.fill),
    face([d0, D, C, c0], o.keyFill ?? FACE.key),
    face([A, B, C, D], o.topFill ?? FACE.top),
    edge(D, A, EDGE.lit, 1),
    edge(A, B, EDGE.lit, 0.8),
    edge(D, C, EDGE.lit, 0.72),
    edge(B, C, EDGE.rim, 0.7),
    edge(D, d0, EDGE.lit, 0.68),
    edge(C, c0, EDGE.mid, 0.6),
    edge(B, b0, EDGE.rim, 0.6),
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
  /* data-flat marks it as belonging to the floor rather than to the object:
     the reflection strips these out. Mirrored, a contact shadow lands on top
     of the bright edges it is supposed to be reflecting and cancels them,
     which is why the first reflection looked like nothing at all. */
  return `<ellipse data-flat="1" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${(rx * 0.4).toFixed(2)}" fill="url(#contact)"/>`;
}
