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
/*
 * A bank of ports, cut into a face rather than stuck on it.
 *
 * This is most of the difference between a box and a computer. A real front
 * panel is a dark recess with a lighter tongue inside it and a bright lip
 * along the bottom edge where the pressed steel catches the key — three tones
 * in four millimetres. Drawn as a flat dark rectangle it reads as a sticker;
 * drawn as a well with a lip it reads as a socket, and at 6 px per cm on these
 * cards that lip is the pixel that sells it.
 *
 * `spec` is a list of widths in cm. USB-A is 1.4, USB-C is 0.9, a jack is 0.7.
 */
const PORT_WELL = { color: 0x03050a, metalness: 0.35, roughness: 0.55 };
const PORT_LIP = { color: 0x5b6577, metalness: 0.9, roughness: 0.3 };

function ports(spec, o = {}) {
  const g = new THREE.Group();
  const h = o.h ?? cm(0.8);
  const gap = o.gap ?? cm(0.6);
  const total = spec.reduce((a, w) => a + cm(w), 0) + gap * (spec.length - 1);
  let x = -total / 2;
  const well = mat(PORT_WELL);
  const lip = mat(PORT_LIP);
  for (const w of spec) {
    const width = cm(w);
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(width, h, cm(0.9)), well);
    mouth.position.set(x + width / 2, 0, -cm(0.45));
    g.add(mouth);
    /* The tongue inside a USB-A socket. Only on the wide ones — a USB-C is an
       oval hole and a jack is a round one, and neither has anything in it. */
    if (w > 1.2) {
      const tongue = new THREE.Mesh(new THREE.BoxGeometry(width - cm(0.3), cm(0.22), cm(0.5)), lip);
      tongue.position.set(x + width / 2, -cm(0.1), -cm(0.3));
      g.add(tongue);
    }
    const edge = new THREE.Mesh(new THREE.BoxGeometry(width + cm(0.14), cm(0.1), cm(0.1)), lip);
    edge.position.set(x + width / 2, -h / 2 - cm(0.04), cm(0.02));
    g.add(edge);
    x += width + gap;
  }
  return g;
}

/*
 * A recessed panel: the shadow line that tells you a face is made of parts.
 *
 * A moulded chassis is never one continuous surface. There is a seam where the
 * side panel meets the frame, a step where the bezel sits into the shell. Each
 * is a groove a couple of millimetres deep, and in raking light a groove is a
 * dark line with a bright one beside it. Without them a 27 cm face is a single
 * flat tone however well it is lit — which is exactly what the desktops card
 * was: a navy rectangle with a vent on the end.
 */
function inset(w, h, depth, surface) {
  const g = new THREE.Group();
  const back = slab(w, h, depth, { surface, bevel: 0.05 });
  g.add(back);
  return g;
}

function monitor() {
  const g = new THREE.Group();
  const W = cm(54);
  const H = cm(32.4);
  const lift = cm(13); // panel bottom above the desk

  /*
   * The head, built as a shell with a frame in front of it rather than as one
   * slab with a screen stuck on the outside.
   *
   * It was the second thing: a 1.7 cm box with the glass sitting 0.95 cm proud
   * of its own centre, so the screen was flush with the bezel — or slightly in
   * front of it — and the whole monitor was one flat rectangle with a darker
   * rectangle painted on. Every real panel is set BEHIND its frame, and that
   * step is where a monitor gets its only interesting edge: a thin bright line
   * along the top and left where the key rakes across the lip of the bezel,
   * and a soft shadow down the inside of it.
   */
  const head = new THREE.Group();
  const shell = slab(W, H, cm(1.5), { bevel: 0.3 });
  head.add(shell);

  const s = screen(W - cm(2.0), H - cm(3.6));
  s.position.set(0, cm(0.5), cm(0.55));
  head.add(s);

  /* The frame, four strips standing proud of the glass. The chin is deeper
     than the other three, which is what every monitor made since about 2014
     looks like and is where the stand's weight visually goes. */
  const frame = (w, h, x, y) => {
    const f = slab(w, h, cm(0.9), { surface: DECK, bevel: 0.16 });
    f.position.set(x, y, cm(0.8));
    head.add(f);
  };
  const top = H / 2 - cm(0.45);
  frame(W, cm(0.9), 0, top);
  frame(W, cm(2.4), 0, -H / 2 + cm(1.2));
  frame(cm(0.9), H - cm(1.8), -W / 2 + cm(0.45), cm(0.45));
  frame(cm(0.9), H - cm(1.8), W / 2 - cm(0.45), cm(0.45));

  /* A power light in the chin, off to one side. Dim: it is a standby LED in a
     dark room, not a headlight. */
  const led = new THREE.Mesh(
    new THREE.CircleGeometry(cm(0.16), 16),
    new THREE.MeshBasicMaterial({ color: 0x6f86c8, toneMapped: false }),
  );
  led.position.set(W / 2 - cm(3.2), -H / 2 + cm(1.2), cm(1.3));
  head.add(led);

  head.position.set(0, lift + H / 2, 0);
  /* Tilted back five degrees. A panel at dead vertical is a drawing of a
     monitor; every one on every desk is leaning away from the person. */
  head.rotation.x = -0.09;
  g.add(head);

  /*
   * The arm, with the hole through it.
   *
   * A 6x15x5 block is a block. The one detail that makes a stand read as a
   * stand is the cable pass-through — every business monitor has one, it is
   * the only opening in the piece, and a hole with light behind it is the
   * cheapest silhouette a dark object can be given.
   */
  const neck = slab(cm(7), cm(16), cm(3.4), { surface: DECK, bevel: 0.2 });
  neck.position.set(0, cm(8), -cm(2.2));
  g.add(neck);
  const slot = slab(cm(3.2), cm(2.6), cm(4.4), { surface: DARK, bevel: 0.35 });
  slot.position.set(0, cm(5.4), -cm(2.2));
  g.add(slot);

  /*
   * The foot: a thin plate with a raised pad under the arm, not a 1.6 cm brick.
   *
   * The old one was a rounded box as deep as it was thick, which under a key
   * light is a wedge of solid tone taking up the bottom of the frame. A real
   * stand base is a wide flat blade a few millimetres thick that almost
   * disappears, with the mass gathered where the column meets it.
   */
  const foot = slab(cm(26), cm(0.9), cm(19), { surface: DARK, bevel: 0.45 });
  foot.position.set(0, cm(0.45), cm(1));
  g.add(foot);
  const hub = slab(cm(11), cm(1.6), cm(9), { surface: DECK, bevel: 0.4 });
  hub.position.set(0, cm(1.0), -cm(1.6));
  g.add(hub);
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
    const p = new THREE.Mesh(new THREE.BoxGeometry(cm(1.5), cm(0.7), cm(0.3)), port);
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

/**
 * A small-form-factor tower.
 *
 * This card was the worst of the six and the reason was not the light. The
 * tower was a 10x33x27 rounded box with eleven ribs and a dot on one narrow
 * face, and the camera — turned to fill a 16:9 frame — showed the OTHER face,
 * which had nothing on it at all. A blank navy rectangle 27 cm across. It read
 * as a carton because geometrically that is what it was.
 *
 * Two things fix it, and both are things the real object has:
 *
 *   The side panel is not flat. On every business desktop it is a pressed
 *   sheet let into a frame, so it sits a few millimetres proud with a groove
 *   all the way round and a finger channel at the back edge. That groove is
 *   the only line on the face the camera actually sees, and it is what turns a
 *   rectangle into a panel.
 *
 *   The front is where a computer keeps everything a person touches: a power
 *   button in a recess, four ports in a well, a slot-load bay. Even at the
 *   shallow angle this card shows the front at, that cluster catches the key
 *   and tells the eye what the object is.
 */
function tower() {
  const g = new THREE.Group();
  const W = cm(10);
  const H = cm(33);
  const D = cm(27);
  const body = slab(W, H, D, { bevel: 0.09 });
  body.position.set(0, H / 2, 0);
  g.add(body);

  /*
   * The side panel, both sides, as a plate standing 3 mm off the frame.
   *
   * Set in 1.2 cm from every edge, so what reads is a continuous shadow line
   * around a slightly brighter field — the same trick a picture frame uses,
   * and the reason a car door looks like a door.
   */
  for (const side of [-1, 1]) {
    const skin = slab(cm(0.35), H - cm(2.4), D - cm(2.4), {
      surface: { color: 0x0d1119, metalness: 0.62, roughness: 0.34 },
      bevel: 0.5,
    });
    skin.position.set(side * (W / 2 - cm(0.02)), H / 2, 0);
    g.add(skin);
    /* The finger channel at the back edge, where the panel is pulled off. */
    const grip = slab(cm(0.5), cm(9), cm(1.1), { surface: DARK, bevel: 0.4 });
    grip.position.set(side * (W / 2 - cm(0.1)), H / 2, -D / 2 + cm(2.2));
    g.add(grip);
  }

  /* The front bezel: a plate let into the shell, so the front is a panel with
     an edge rather than the end of a box. */
  const bezel = slab(W - cm(0.7), H - cm(1.2), cm(0.7), { surface: DECK, bevel: 0.12 });
  bezel.position.set(0, H / 2, D / 2 - cm(0.1));
  g.add(bezel);

  /* The intake, cut in rather than stuck on. The first version stood nine
     light bars proud of the face and the card read as a radiator: the
     brightest thing in the frame was a row of white stripes. Vents are dark
     slots in a recess, and what you see of them is the edge catching the key. */
  const well = slab(W - cm(1.6), cm(13), cm(0.6), { surface: DARK, bevel: 0.06 });
  well.position.set(0, cm(8), D / 2 - cm(0.05));
  g.add(well);

  const rib = mat({ color: 0x171d28, metalness: 0.72, roughness: 0.3 });
  for (let i = 0; i < 9; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(W - cm(2.4), cm(0.9), cm(0.35)), rib);
    v.position.set(0, cm(2.8) + i * cm(1.4), D / 2 + cm(0.1));
    v.castShadow = true;
    g.add(v);
  }

  /* Slot-load optical bay: one dark line across the upper front. Obsolete on a
     machine bought new today and present on every one of these, which is the
     point — this is a card about used business hardware. */
  const bay = slab(W - cm(2.2), cm(0.45), cm(0.5), { surface: DARK, bevel: 0.25 });
  bay.position.set(0, cm(28.4), D / 2 + cm(0.15));
  g.add(bay);

  /* The power button: a disc in a recess, with the light in the disc rather
     than floating on the face. */
  const cupRing = slab(cm(3.2), cm(3.2), cm(0.4), { surface: DARK, bevel: 0.45 });
  cupRing.position.set(0, cm(30.6), D / 2 + cm(0.1));
  g.add(cupRing);
  const led = new THREE.Mesh(
    new THREE.RingGeometry(cm(0.62), cm(0.92), 28),
    new THREE.MeshBasicMaterial({ color: 0x8aa6ef, toneMapped: false, side: THREE.DoubleSide }),
  );
  led.position.set(0, cm(30.6), D / 2 + cm(0.33));
  g.add(led);

  /* Front I/O. Two USB-A, a USB-C and a headphone jack, which is what the
     front of a machine of this generation actually carries. */
  const io = ports([1.4, 1.4, 0.9, 0.7], { h: cm(0.75), gap: cm(0.5) });
  io.position.set(0, cm(24.6), D / 2 + cm(0.32));
  g.add(io);

  /* Feet. Nothing in this set floats, and a 33 cm tower sitting dead on the
     stone has no gap under it for the floor to show through. */
  const pad = mat({ color: 0x04060b, metalness: 0.1, roughness: 0.9 });
  for (const fx of [-1, 1])
    for (const fz of [-1, 1]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(cm(1.8), cm(0.6), cm(1.8)), pad);
      f.position.set(fx * (W / 2 - cm(1.6)), cm(0.3), fz * (D / 2 - cm(2.4)));
      g.add(f);
    }
  return g;
}

/**
 * A mini PC: the other half of what the desktops card claims to show.
 *
 * The problem with this object was never the noise map — that was checked and
 * it is not. It is that an 18 cm square lid is one unbroken plane facing a
 * ceiling, and the studio here is emissive panels in a black room, so the lid
 * caught one soft reflection of a softbox across its whole area. A single
 * gradient over a flat field looks like a stain on concrete, and it was the
 * brightest thing on a card whose subject is a near-black tower.
 *
 * Roughness alone does not fix it: take the sheen off entirely and the object
 * goes dead flat, which is the other failure. What fixes it is giving the face
 * something to be interrupted by — a vent field let into the lid and a seam
 * where the cover meets the base, so the reflection is broken into pieces that
 * read as surfaces instead of pooling into one smear.
 */
function miniPc() {
  const g = new THREE.Group();
  const W = cm(18);
  const D = cm(18);
  const Hh = cm(3.6);

  /*
   * envMapIntensity, not roughness, is the knob that matters here.
   *
   * The studio is emissive panels in a black room, fed to the materials as an
   * environment. A horizontal face looks straight up into those panels, so the
   * mini's lid was mirroring the ceiling at full strength while the tower
   * beside it — all vertical faces — saw almost none of it. Roughness spreads
   * that reflection out; it does not make it dimmer. At 0.35 the lid still has
   * a sheen and stops being the brightest thing on a card about the dark
   * object behind it.
   */
  const shell = { metalness: 0.3, roughness: 0.72, envMapIntensity: 0.35 };
  const base = slab(W, Hh * 0.55, D, {
    surface: { ...shell, color: 0x0a0e16 },
    bevel: 0.16,
  });
  base.position.y = Hh * 0.275;
  g.add(base);

  /* The cover, as its own part sitting on the base. The gap between them is
     the seam, and it runs all the way round. */
  const lid = slab(W - cm(0.5), Hh * 0.45, D - cm(0.5), {
    surface: { ...shell, color: 0x0d1119, roughness: 0.78 },
    bevel: 0.2,
  });
  lid.position.y = Hh * 0.78;
  g.add(lid);

  /* The vent field: a shallow recess with ribs, off-centre. Off-centre because
     it is where the fan is, and because a panel centred on its own lid is the
     look of a thing that was drawn rather than made. */
  const field = slab(cm(9), cm(0.3), cm(9), { surface: DARK, bevel: 0.1 });
  field.position.set(cm(2.6), Hh * 0.97, -cm(1.4));
  g.add(field);
  const rib = mat({ color: 0x161c26, metalness: 0.68, roughness: 0.36 });
  for (let i = 0; i < 9; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(cm(8.2), cm(0.16), cm(0.42)), rib);
    v.position.set(cm(2.6), Hh * 1.0, -cm(5.2) + i * cm(0.95));
    g.add(v);
  }

  /* Front face: the same cluster the tower has, at a third of the size. */
  const io = ports([1.4, 0.9, 0.7], { h: cm(0.6), gap: cm(0.45) });
  io.position.set(-cm(1.4), Hh * 0.5, D / 2 + cm(0.2));
  g.add(io);
  const btn = new THREE.Mesh(
    new THREE.RingGeometry(cm(0.34), cm(0.5), 22),
    new THREE.MeshBasicMaterial({ color: 0x8aa6ef, toneMapped: false, side: THREE.DoubleSide }),
  );
  btn.position.set(cm(5.6), Hh * 0.5, D / 2 + cm(0.22));
  g.add(btn);

  const pad = mat({ color: 0x04060b, metalness: 0.1, roughness: 0.9 });
  for (const fx of [-1, 1])
    for (const fz of [-1, 1]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(cm(1.6), cm(0.4), cm(1.6)), pad);
      f.position.set(fx * (W / 2 - cm(2)), cm(0.2), fz * (D / 2 - cm(2)));
      g.add(f);
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
    /* 1.22, not 0.99. The brief's own measurement for this slot: "subject must
       fill ~70% of the width or it is mush" at 290x163 rendered, and at 0.99
       the machine was on about 45% of it with the rest of the frame empty. */
    return { object: g, yaw: 0.72, pitch: 0.24, fov: 27, fit: 1.22 };
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
        m.position.set(col * (LAPTOP.w + cm(6)) + jitter * cm(0.9), i * t, jitter * cm(1.2));
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
    /* Pulled back from 1.52. The card claims a monitor, a keyboard and a dock,
       and all three were in the scene — but at that framing the keyboard was
       sliced in half by the bottom edge and the dock was outside it, so the
       card showed one object and a fragment. A composition that has to be
       cropped to fit is the wrong composition, not the wrong crop. */
    return { object: g, yaw: 0.44, pitch: 0.28, fov: 26, fit: 1.3, lift: 0.05 };
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
    m.position.set(cm(12), 0, cm(15));
    m.rotation.y = -0.38;
    g.add(m);
    /* 1.12, down from 1.3: the mini was being cut in half by the bottom edge,
       and an object sliced by the frame is the difference between a photograph
       and a screenshot of one. */
    return { object: g, yaw: 0.86, pitch: 0.22, fov: 32, fit: 1.12 };
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
        const k = new THREE.Mesh(new THREE.BoxGeometry(cm(1.55), cm(0.4), cm(1.55)), key);
        k.position.set((i - 7.5) * pitch + (row % 2) * cm(0.3), cm(1.6), (row - 3.4) * pitch);
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
        const f = new THREE.Mesh(new THREE.BoxGeometry(cm(4.5), cm(0.5), cm(1.2)), foot);
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
        {
          color: 0xffe6bf,
          intensity: 2600,
          distance: 0,
          decay: 2,
          position: [cm(-30), cm(215), cm(40)],
        },
        {
          color: 0xffe6bf,
          intensity: 1500,
          distance: 0,
          decay: 2,
          position: [cm(120), cm(215), -spacing * 1.2],
        },
      ],
    };
  }

  throw new Error(`unknown subject: ${name}`);
}
