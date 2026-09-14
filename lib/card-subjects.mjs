/*
 * The six card subjects, as real geometry.
 *
 * The first version of these artworks was drawn — flat isometric polygons with
 * strokes on them. It measured well and it still read as a diagram, because a
 * drawing has no material: nothing on it is reflecting a room. The comment in
 * lib/laptop-scene.mjs already said what the difference is, about the hero's
 * own model — "metal with nothing to reflect renders as flat grey however many
 * lights are pointed at it — this is the difference between a diagram and a
 * product shot."
 *
 * So the cards are rendered rather than drawn, in the same studio, off the
 * same laptop the hero uses where the subject is a laptop. Everything else is
 * built here with chamfered edges and the same PBR values, because a hard 90°
 * corner is the other thing that says "not a photograph": real edges catch a
 * highlight, and the highlight is what tells the eye how big something is.
 *
 * ## The scale, measured rather than assumed
 *
 * The hero's laptop measures 2.945 x 0.537 x 4.61 with its WIDTH on z and its
 * DEPTH on x. Read as a 14" business machine — 32 cm wide, 21 cm deep, 3.8 cm
 * thick at the lid, 22.5 cm tall with the screen up — all four numbers agree
 * on one unit: **1 unit = 7 cm**.
 *
 * Every prop here used to be sized at "about one unit", and that is not a
 * matter of taste, it is why the pictures were wrong. A 2.6-unit desk is 18 cm
 * across, so the fleet room rendered as a single laptop lying on a plate; a
 * 1.62-unit monitor is an 11 cm screen, narrower than the laptop beside it.
 * Props are dimensioned in centimetres now and converted once.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/** Centimetres to scene units. See the note above: the model sets this. */
const cm = (n) => n / 7;

/** The machine, for anything that has to stand next to it. */
const LAPTOP = { w: 4.61, d: 2.945, closed: 0.537, open: 3.216 };

const CHASSIS = { color: 0x0b0e16, metalness: 0.55, roughness: 0.38 };
const DECK = { color: 0x11151f, metalness: 0.25, roughness: 0.58 };
const DARK = { color: 0x070a11, metalness: 0.3, roughness: 0.5 };
const BOARD = { color: 0x13202a, metalness: 0.32, roughness: 0.55 };
const COPPER = { color: 0x9a6438, metalness: 0.92, roughness: 0.3 };
const ALLOY = { color: 0x6d7688, metalness: 0.85, roughness: 0.28 };
/* The hero's stone desk, sampled: #1e2938. A near-black desk in a near-black
   room gives a bench of laptops nothing to sit on — and measured inside its
   own silhouette the fleet room came back at 14.4, the one card in the set
   that really was mush rather than a dark subject diluted by a dark board.
   Honed rather than matte, so the tops carry the key down the room. */
const STONE = { color: 0x1c2532, metalness: 0.12, roughness: 0.5 };

const mat = (o) => new THREE.MeshStandardMaterial(o);

/** A chamfered box. Radius scales with the smallest side so nothing balloons. */
function slab(w, h, d, o = {}) {
  const r = Math.min(w, h, d) * (o.bevel ?? 0.12);
  const g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, 0.045));
  const m = new THREE.Mesh(g, mat({ ...(o.surface ?? CHASSIS) }));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/*
 * A display that is switched off, which is what every screen on this site is.
 *
 * It used to be a bright blue gradient painted into a canvas, and at card size
 * that is a flat saturated rectangle — the single loudest thing in these
 * pictures saying "3D render". A dark screen in a lit room is not black and it
 * is not blue: it is a mirror with a slight green-black cast, and the thing it
 * reflects is the same studio that is lighting the chassis. Near-black,
 * almost fully metallic, almost smooth. The same treatment render3d.mjs gives
 * the model's own panel, so the laptop cards and the monitor card agree.
 */
const GLASS = { color: 0x03050c, metalness: 0.96, roughness: 0.05, envMapIntensity: 2.6 };

/*
 * A pure mirror on a plane facing a dark room comes back pure black, and at
 * 290px a pure black panel is a hole punched in the picture rather than glass.
 * Real glass carries one soft band where a light source grazes it. The model's
 * own panel cannot have this — four vertices, no usable UVs, one texel — but a
 * PlaneGeometry has UVs, so the monitor gets it: a single off-axis sweep at a
 * few percent, cool at the top where the window is and warm low down where the
 * key is, which is the same light the chassis is standing in.
 */
export function screenSheen() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const x = c.getContext("2d");
  x.fillStyle = "#000000";
  x.fillRect(0, 0, c.width, c.height);
  const g = x.createLinearGradient(c.width * 0.15, 0, c.width * 0.78, c.height);
  g.addColorStop(0, "#10182b");
  g.addColorStop(0.22, "#222b3c");
  g.addColorStop(0.34, "#0a0f1a");
  g.addColorStop(0.82, "#05070d");
  g.addColorStop(1, "#0d0b08");
  x.fillStyle = g;
  x.fillRect(0, 0, c.width, c.height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function screen(w, h) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    /* Named, so render3d's imperfection pass leaves it alone: a roughness
       map and a normal map on a mirror is frosted glass, which is a different
       object. */
    mat({
      ...GLASS,
      name: "screen",
      emissive: 0xffffff,
      emissiveMap: screenSheen(),
      /* Stronger than the laptop's, and for a reason rather than for the
         number: this panel is 54 cm of glass standing upright in a lit room
         and it is half the card. A 14" screen lying back at 20 degrees shows
         the ceiling; this one shows the window. */
      emissiveIntensity: 0.5,
    }),
  );
  m.receiveShadow = true;
  return m;
}

/** A 24" widescreen monitor: panel, bezel, neck, foot. */
function monitor() {
  const g = new THREE.Group();
  const W = cm(54);
  const H = cm(32.4);
  const lift = cm(13); // panel bottom above the desk

  const panel = slab(W, H, cm(1.7), { bevel: 0.3 });
  panel.position.set(0, lift + H / 2, 0);
  g.add(panel);

  const s = screen(W - cm(1.4), H - cm(2.2));
  s.position.set(0, lift + H / 2, cm(0.95));
  g.add(s);

  const neck = slab(cm(6), cm(15), cm(5), { surface: DARK });
  neck.position.set(0, cm(7.5), -cm(2));
  g.add(neck);

  const foot = slab(cm(24), cm(1.6), cm(18), { surface: DARK, bevel: 0.4 });
  foot.position.set(0, cm(0.8), cm(1));
  g.add(foot);
  return g;
}

/** A full-size keyboard, with keys — a bare slab is not a keyboard. */
function keyboard() {
  const g = new THREE.Group();
  const W = cm(44);
  const D = cm(14.2);
  const body = slab(W, cm(1.8), D, { surface: DECK, bevel: 0.25 });
  body.position.y = cm(0.9);
  g.add(body);

  const key = mat({ color: 0x080b12, metalness: 0.2, roughness: 0.62 });
  const pitch = cm(1.85);
  const cap = cm(1.55);
  for (let row = 0; row < 5; row++) {
    /* Staggered, and the bottom row is one bar: a perfect grid is the tell. */
    const n = row === 4 ? 1 : 20;
    const w = row === 4 ? pitch * 9 : cap;
    for (let i = 0; i < n; i++) {
      const k = new THREE.Mesh(new THREE.BoxGeometry(w, cm(0.35), cap), key);
      const x = row === 4 ? 0 : (i - (n - 1) / 2) * pitch + (row % 2) * cm(0.3);
      k.position.set(x, cm(1.92), (row - 2) * pitch);
      k.castShadow = true;
      g.add(k);
    }
  }
  return g;
}

/** A docking station: a flat brick with a row of ports down one side. */
function dock() {
  const g = new THREE.Group();
  const body = slab(cm(19), cm(2.6), cm(8.6), { surface: DARK, bevel: 0.2 });
  body.position.y = cm(1.3);
  g.add(body);
  const port = mat({ color: 0x05070c, metalness: 0.4, roughness: 0.45 });
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(
      new THREE.BoxGeometry(cm(1.5), cm(0.7), cm(0.3)),
      port,
    );
    p.position.set((i - 2) * cm(3), cm(1.4), cm(4.3));
    g.add(p);
  }
  const led = new THREE.Mesh(
    new THREE.CircleGeometry(cm(0.22), 20),
    new THREE.MeshBasicMaterial({ color: 0x8fb0ff, toneMapped: false }),
  );
  led.position.set(cm(8), cm(1.4), cm(4.35));
  g.add(led);
  return g;
}

/** A small-form-factor tower, seen front-on: chassis, intake, bay, power light. */
function tower() {
  const g = new THREE.Group();
  const W = cm(10);
  const H = cm(33);
  const D = cm(27);
  const body = slab(W, H, D, { bevel: 0.09 });
  body.position.set(0, H / 2, 0);
  g.add(body);

  /* The intake, cut in rather than stuck on. The first version stood nine
     light bars proud of the face and the card read as a radiator: the
     brightest thing in the frame was a row of white stripes. Vents are dark
     slots in a recess, and what you see of them is the edge catching the key. */
  const well = slab(W - cm(1.6), cm(15), cm(0.6), { surface: DARK, bevel: 0.06 });
  well.position.set(0, cm(9), D / 2 - cm(0.25));
  g.add(well);

  const rib = mat({ color: 0x171d28, metalness: 0.72, roughness: 0.3 });
  for (let i = 0; i < 11; i++) {
    const v = new THREE.Mesh(
      new THREE.BoxGeometry(W - cm(2.4), cm(0.9), cm(0.35)),
      rib,
    );
    v.position.set(0, cm(2.6) + i * cm(1.3), D / 2 - cm(0.1));
    v.castShadow = true;
    g.add(v);
  }

  const bay = slab(W - cm(1.8), cm(2.2), cm(0.5), { surface: DARK, bevel: 0.2 });
  bay.position.set(0, cm(27), D / 2 - cm(0.2));
  g.add(bay);

  const led = new THREE.Mesh(
    new THREE.CircleGeometry(cm(0.3), 24),
    new THREE.MeshBasicMaterial({ color: 0x9fbcff, toneMapped: false }),
  );
  led.position.set(0, cm(30.4), D / 2 + cm(0.05));
  g.add(led);
  return g;
}

/** A mini PC: the other half of what the desktops card claims to show. */
function miniPc() {
  const g = new THREE.Group();
  /* Matte, not the chassis polish. A 4 cm box is nearly all top face, and a
     top face at metalness 0.55 / roughness 0.38 under a warm overhead is a
     mirror of the softbox: the mini came back as the brightest thing in the
     set, standing in front of a near-black tower. */
  const body = slab(cm(18), cm(3.6), cm(18), {
    surface: { color: 0x0c1019, metalness: 0.28, roughness: 0.68 },
    bevel: 0.14,
  });
  body.position.y = cm(1.8);
  g.add(body);
  /* Nothing on the top face. It is a 4 cm-thick box lying under a warm
     overhead, so anything patterned up there takes the key square on and the
     card reads as a drain grate — which is the same way the tower's vents
     failed the first time, recorded in the brief as "the card read as a
     radiator". The mini is the small dark object in this picture; its job is
     to be small and dark. */
  const port = mat({ color: 0x05070c, metalness: 0.4, roughness: 0.45 });
  for (let i = 0; i < 4; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(cm(1.4), cm(0.7), cm(0.3)), port);
    p.position.set((i - 1.5) * cm(2.6), cm(1.9), cm(9));
    g.add(p);
  }
  return g;
}

/** A 160x80 desk for the fleet room. */
function desk() {
  const g = new THREE.Group();
  const W = cm(160);
  const D = cm(80);
  const h = cm(74);
  const top = slab(W, cm(3), D, { surface: STONE, bevel: 0.3 });
  top.position.y = h;
  g.add(top);
  /* Four legs, not two end panels. A 64 cm-deep panel in near-black is a
     slab, and three benches of them fill the lower half of a portrait frame
     with solid dark shapes — the room stops reading as a room. Legs let the
     space under the benches carry back. */
  for (const x of [-W / 2 + cm(9), W / 2 - cm(9)])
    for (const z of [-D / 2 + cm(9), D / 2 - cm(9)]) {
      const leg = slab(cm(5), h, cm(5), { surface: DARK, bevel: 0.2 });
      leg.position.set(x, h / 2, z);
      g.add(leg);
    }
  return g;
}

/**
 * Turn a machine so its width runs along x, like every prop here.
 * The model carries its width on z; left alone, a "row" of laptops recedes
 * away from the camera instead of running across the frame.
 */
function across(m) {
  m.rotation.y = -Math.PI / 2;
  return m;
}

/**
 * @param {string} name
 * @param {(open: number) => THREE.Object3D} machine  a fresh laptop at a lid angle
 * @param {(root: THREE.Object3D) => void} dressScreens  swaps the model's panel for glass
 */
export function buildSubject(name, machine, dressScreens = () => {}) {
  const g = new THREE.Group();
  const lit = (m) => (dressScreens(m), m);

  if (name === "cat-laptops") {
    g.add(lit(machine(1)));
    return { object: g, yaw: 0.72, pitch: 0.24, fov: 27, fit: 0.99 };
  }

  if (name === "cat-fleet") {
    /* "En række ens bærbare computere klargjort til levering" — a row of
       identical laptops prepared for delivery. Six closed machines in two
       columns of three, which is how prepared stock actually stands, with the
       top of the near column cracked open because a stack being worked from
       reads as a business and a sealed pile reads as a warehouse photo.

       Each machine is nudged a couple of millimetres and a fraction of a
       degree off its neighbour. A perfectly aligned array is the single
       clearest tell that nobody's hands were involved. */
    const t = LAPTOP.closed + cm(0.4);
    for (let col = 0; col < 2; col++) {
      for (let i = 0; i < 3; i++) {
        const top = col === 0 && i === 2;
        const m = across(lit(machine(top ? 0.14 : 0)));
        const jitter = ((col * 3 + i) % 3) - 1;
        m.position.set(
          col * (LAPTOP.w + cm(6)) + jitter * cm(0.9),
          i * t,
          jitter * cm(1.2),
        );
        m.rotation.y += jitter * 0.011;
        g.add(m);
      }
    }
    return { object: g, yaw: 0.6, pitch: 0.26, fov: 28, fit: 0.98 };
  }

  if (name === "cat-monitors") {
    /* "Bredformatskærm med tastatur og en dockingstation" — the card claims
       three objects and used to show one. */
    g.add(monitor());
    const k = keyboard();
    k.position.set(-cm(3), 0, cm(23));
    g.add(k);
    const d = dock();
    d.position.set(cm(26), 0, cm(19));
    d.rotation.y = -0.22;
    g.add(d);
    return { object: g, yaw: 0.44, pitch: 0.28, fov: 26, fit: 1.52, lift: 0.14 };
  }

  if (name === "cat-desktops") {
    /* "Stationær computer og en mini-pc side om side" — both, side by side. */
    /* A narrow column in a 16:9 frame is mush — the brief already records the
       tower measuring 14.3 that way. The pair has to span the frame, so the
       mini sits well out to the side and a good deal nearer the camera, and
       the camera comes down to desk height rather than looking over the top. */
    /* Two objects staged as one mass, not two things at opposite ends of the
       frame. A 33 cm tower beside a 4 cm mini is mostly air however the
       bounding box is fitted: spread them and the box fills the card while
       the objects inside it shrink — measured, 43 cm apart put the subject on
       16.6% of the pixels and 60 cm apart put it on 14.6%. So the mini comes
       in close and well forward instead, where perspective makes it large and
       it overlaps the tower's foot. The brief already records this tower
       failing once as "a narrow column in a 16:9 frame". */
    const t = tower();
    t.position.set(-cm(6), 0, -cm(3));
    g.add(t);
    const m = miniPc();
    m.position.set(cm(11), 0, cm(21));
    m.rotation.y = -0.38;
    g.add(m);
    return { object: g, yaw: 0.86, pitch: 0.22, fov: 32, fit: 1.3 };
  }

  if (name === "exploded") {
    /* "En bærbar computer skilt ad i lag: skærm, tastatur, bundkort og
       bundplade" — four layers, and the picture has to contain four things a
       reader can name.

       The lid layer is the machine's own screen assembly with its base
       hidden. The previous version hid `wrap.children[0]`, which is the group
       holding BOTH halves, so the top layer of a teardown card was invisible
       and the card showed two bare plates. The base is one level deeper. */
    const W = LAPTOP.w * 0.97;
    const D = LAPTOP.d * 0.94;
    const gap = cm(7); // 7 cm of air; at 164px rendered, less than that merges

    /* Flipped, because a closed lid has its screen face DOWN: left alone, the
       top layer of a teardown card is the blank back of a lid, and the alt
       text says "skærm". */
    const lidOnly = across(lit(machine(0)));
    lidOnly.children[0].children[0].visible = false; // the base half
    const lidLayer = new THREE.Group();
    lidLayer.add(lidOnly);
    lidLayer.rotation.x = Math.PI;
    lidLayer.position.y = gap * 3;
    g.add(lidLayer);

    /* The keyboard deck: keys and a trackpad, not a plate. */
    const deckL = new THREE.Group();
    deckL.position.y = gap * 2;
    const deck = slab(W, cm(1.4), D, { surface: DECK, bevel: 0.3 });
    deck.position.y = cm(0.7);
    deckL.add(deck);
    const key = mat({ color: 0x080b12, metalness: 0.2, roughness: 0.62 });
    const pitch = cm(1.85);
    for (let row = 0; row < 5; row++) {
      for (let i = 0; i < 16; i++) {
        const k = new THREE.Mesh(
          new THREE.BoxGeometry(cm(1.55), cm(0.4), cm(1.55)),
          key,
        );
        k.position.set(
          (i - 7.5) * pitch + (row % 2) * cm(0.3),
          cm(1.6),
          (row - 3.4) * pitch,
        );
        k.castShadow = true;
        deckL.add(k);
      }
    }
    const pad = slab(cm(10.5), cm(0.25), cm(6.5), { surface: DARK, bevel: 0.2 });
    pad.position.set(0, cm(1.5), D / 2 - cm(5.5));
    deckL.add(pad);
    g.add(deckL);

    /* The mainboard: a heat pipe, a fan, two memory modules, a few packages.
       At 164px wide these have to be large and light against a dark board or
       "mainboard" is a word the alt text uses about a grey rectangle. */
    const boardL = new THREE.Group();
    boardL.position.y = gap;
    const board = slab(W * 0.93, cm(0.9), D * 0.88, { surface: BOARD, bevel: 0.3 });
    boardL.add(board);

    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(cm(0.5), cm(0.5), W * 0.62, 16),
      mat({ ...COPPER }),
    );
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-cm(1), cm(0.9), -D * 0.2);
    pipe.castShadow = true;
    boardL.add(pipe);

    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(cm(3.1), cm(3.1), cm(0.8), 28),
      mat({ ...ALLOY }),
    );
    fan.position.set(W * 0.34, cm(0.9), -D * 0.2);
    fan.castShadow = true;
    boardL.add(fan);
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(cm(0.9), cm(0.9), cm(1.1), 20),
      mat({ ...DARK }),
    );
    hub.position.set(W * 0.34, cm(1.1), -D * 0.2);
    boardL.add(hub);

    for (const z of [D * 0.16, D * 0.29]) {
      const dimm = slab(W * 0.34, cm(0.5), cm(2.6), { surface: ALLOY, bevel: 0.25 });
      dimm.position.set(-W * 0.16, cm(0.8), z);
      boardL.add(dimm);
    }

    const pkg = mat({ color: 0x2a3243, metalness: 0.45, roughness: 0.42 });
    for (const [x, z, w, d] of [
      [W * 0.05, -D * 0.02, cm(3.4), cm(3.4)],
      [W * 0.3, D * 0.24, cm(2.2), cm(1.6)],
      [-W * 0.36, -D * 0.3, cm(1.8), cm(1.8)],
    ]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(w, cm(0.55), d), pkg);
      c.position.set(x, cm(0.72), z);
      c.castShadow = true;
      boardL.add(c);
    }
    g.add(boardL);

    /* The base plate: feet and a vent grille, so the bottom layer is the
       underside of a laptop rather than a fourth rectangle. */
    const plateL = new THREE.Group();
    const plate = slab(W, cm(1.1), D, { bevel: 0.3 });
    plateL.add(plate);
    const foot = mat({ color: 0x05070c, metalness: 0.1, roughness: 0.8 });
    for (const x of [-W / 2 + cm(3), W / 2 - cm(3)])
      for (const z of [-D / 2 + cm(2.5), D / 2 - cm(2.5)]) {
        const f = new THREE.Mesh(
          new THREE.BoxGeometry(cm(4.5), cm(0.5), cm(1.2)),
          foot,
        );
        f.position.set(x < 0 ? x + cm(1) : x - cm(1), -cm(0.6), z);
        plateL.add(f);
      }
    const slot = mat({ color: 0x04060b, metalness: 0.3, roughness: 0.5 });
    for (let i = 0; i < 9; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(cm(9), cm(0.2), cm(0.45)), slot);
      s.position.set(cm(4), cm(0.5), (i - 4) * cm(1.1));
      plateL.add(s);
    }
    g.add(plateL);

    return { object: g, yaw: 0.62, pitch: 0.3, fov: 26, fit: 0.98 };
  }

  if (name === "fleet-scene") {
    /* "Et lokale med ens klargjorte bærbare computere stillet op på borde" —
       three benches receding, four machines each, lids up and screens dark.
       At the old scale a desk was 18 cm wide and a machine 32, so the room
       was one laptop resting on a plate. */
    /* Four benches, and the first one is IN FRONT of the camera's focal plane,
       cropped by the bottom edge. Three benches all beyond the focus left the
       lower 45% of a 2:3 frame empty, which is what the contrast check was
       reading as mush — and a room photographed with nothing in the near field
       is a room seen through a window. A foreground the lens throws out of
       focus is the oldest depth cue there is, and it costs nothing here
       because the defocus is real. */
    const spacing = cm(130);
    for (let row = -1; row < 3; row++) {
      const d = desk();
      d.position.set(row * cm(14), 0, -row * spacing);
      g.add(d);
      for (let n = 0; n < 4; n++) {
        const m = across(lit(machine(1)));
        const jitter = ((row + n) % 3) - 1;
        m.position.set(
          row * cm(14) + (n - 1.5) * cm(37) + jitter * cm(1.5),
          cm(75.5),
          -row * spacing + jitter * cm(2),
        );
        m.rotation.y += jitter * 0.03;
        g.add(m);
      }
    }
    /*
     * Two practicals hanging over the benches.
     *
     * Every other card is lit by directional light, which is parallel and so
     * falls on a near bench and a far one identically — and measured inside
     * its own silhouette this room came back at 14.4 against a threshold of
     * 18: not a dark subject diluted by a dark board, which is the other five,
     * but genuinely no tonal range. Four benches all the same value is not a
     * room, it is a pattern. A lamp in a room obeys the inverse square, and
     * that falloff IS the depth: the near bench reads, the third one is half
     * gone, the fourth is a suggestion.
     */
    return {
      object: g,
      yaw: 0.5,
      pitch: 0.2,
      fov: 34,
      fit: 1.8,
      lift: 0.24,
      lights: [
        { color: 0xffe6bf, intensity: 2600, distance: 0, decay: 2, position: [cm(-30), cm(215), cm(40)] },
        { color: 0xffe6bf, intensity: 1500, distance: 0, decay: 2, position: [cm(120), cm(215), -spacing * 1.2] },
      ],
    };
  }

  throw new Error(`unknown subject: ${name}`);
}
