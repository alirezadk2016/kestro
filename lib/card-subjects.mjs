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
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const CHASSIS = { color: 0x0b0e16, metalness: 0.55, roughness: 0.38 };
const DECK = { color: 0x11151f, metalness: 0.25, roughness: 0.58 };
const DARK = { color: 0x070a11, metalness: 0.3, roughness: 0.5 };
const DESK = { color: 0x0a0d15, metalness: 0.12, roughness: 0.72 };

const mat = (o) => new THREE.MeshStandardMaterial(o);

/** A chamfered box. Radius scales with the smallest side so nothing balloons. */
function slab(w, h, d, o = {}) {
  const r = Math.min(w, h, d) * (o.bevel ?? 0.12);
  const g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, 0.04));
  const m = new THREE.Mesh(g, mat({ ...(o.surface ?? CHASSIS) }));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/*
 * A lit display. A flat emissive colour reads as a sticker; a gradient with a
 * hot corner reads as glass with something behind it, which is what a screen
 * is. Drawn once into a canvas and used as the emissive map.
 */
function screen(w, h) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, c.width * 0.75, c.height);
  g.addColorStop(0, "#ccd9ff");
  g.addColorStop(0.18, "#7396f2");
  g.addColorStop(0.46, "#3a5cc4");
  g.addColorStop(1, "#131f48");
  x.fillStyle = g;
  x.fillRect(0, 0, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
  );
  return m;
}

/** A monitor: panel, bezel, neck, foot. */
function monitor() {
  const g = new THREE.Group();
  const W = 1.62;
  const H = 0.98;
  const panel = slab(W, H, 0.052, { bevel: 0.3 });
  panel.position.set(0, 0.86, 0);
  g.add(panel);

  const s = screen(W - 0.07, H - 0.09);
  s.position.set(0, 0.87, 0.028);
  g.add(s);

  const neck = slab(0.13, 0.44, 0.12, { surface: DARK });
  neck.position.set(0, 0.4, -0.03);
  g.add(neck);

  const foot = slab(0.66, 0.035, 0.42, { surface: DARK, bevel: 0.4 });
  foot.position.set(0, 0.2, 0.04);
  g.add(foot);
  return g;
}

/** A tower, seen front-on: chassis, recessed intake, drive bay, power light. */
function tower() {
  const g = new THREE.Group();
  const W = 0.92;
  const H = 1.42;
  const D = 0.74;
  const body = slab(W, H, D, { bevel: 0.09 });
  body.position.set(0, H / 2, 0);
  g.add(body);

  /* The recessed bay. A plain box measured as mush at card size; a well for
     the vents to be light against is what gives the face structure. */
  const well = slab(W - 0.12, 0.72, 0.04, { surface: DARK, bevel: 0.06 });
  well.position.set(0, 0.5, D / 2 - 0.012);
  g.add(well);

  const fin = mat({ color: 0x2a3242, metalness: 0.6, roughness: 0.34 });
  for (let i = 0; i < 9; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(W - 0.2, 0.018, 0.02), fin);
    v.position.set(0, 0.2 + i * 0.072, D / 2 + 0.008);
    v.castShadow = true;
    g.add(v);
  }

  const bay = slab(W - 0.14, 0.14, 0.035, { surface: DARK, bevel: 0.2 });
  bay.position.set(0, 1.06, D / 2 - 0.01);
  g.add(bay);

  const led = new THREE.Mesh(
    new THREE.CircleGeometry(0.028, 24),
    new THREE.MeshBasicMaterial({ color: 0x9fbcff, toneMapped: false }),
  );
  led.position.set(0, 1.24, D / 2 + 0.006);
  g.add(led);
  return g;
}

/** A desk for the fleet room. */
function desk(w) {
  const g = new THREE.Group();
  const top = slab(w, 0.05, 0.62, { surface: DESK, bevel: 0.3 });
  top.position.set(0, 0.58, 0);
  g.add(top);
  for (const x of [-w / 2 + 0.12, w / 2 - 0.12]) {
    for (const z of [-0.22, 0.22]) {
      const leg = slab(0.05, 0.56, 0.05, { surface: DESK, bevel: 0.2 });
      leg.position.set(x, 0.28, z);
      g.add(leg);
    }
  }
  return g;
}

/**
 * @param {string} name
 * @param {{base: THREE.Object3D, lid: THREE.Object3D}} parts  the hero's own model
 * @param {(open: number) => THREE.Object3D} machine  a fresh laptop at a lid angle
 */
export function buildSubject(name, machine) {
  const g = new THREE.Group();

  if (name === "cat-laptops") {
    g.add(machine(1));
    return { object: g, yaw: 0.72, pitch: 0.24, fov: 27, fit: 0.86 };
  }

  if (name === "cat-fleet") {
    /* Five closed machines. The top one is slid out and its lid is cracked
       open, so the stack reads as stock being taken from rather than as a
       pile of boxes. */
    const probe = machine(0);
    const h = new THREE.Box3().setFromObject(probe).getSize(new THREE.Vector3()).y;
    for (let i = 0; i < 5; i++) {
      const top = i === 4;
      const m = machine(top ? 0.12 : 0);
      m.position.set(top ? h * 0.9 : 0, i * h * 1.04, top ? h * 0.7 : 0);
      g.add(m);
    }
    return { object: g, yaw: 0.66, pitch: 0.34, fov: 28, fit: 0.82 };
  }

  if (name === "cat-monitors") {
    g.add(monitor());
    return { object: g, yaw: 0.5, pitch: 0.2, fov: 27, fit: 0.84 };
  }

  if (name === "cat-desktops") {
    g.add(tower());
    return { object: g, yaw: 0.52, pitch: 0.2, fov: 27, fit: 0.94 };
  }

  if (name === "exploded") {
    /* The teardown, to the alt text the page carries: screen, keyboard,
       mainboard, base plate. The lid and the chassis are the machine's own;
       the two plates between are built, because the model is one solid and
       there is nothing inside it to take out. */
    const m = machine(0);
    const box = new THREE.Box3().setFromObject(m);
    const size = box.getSize(new THREE.Vector3());
    const W = size.x * 0.94;
    const D = size.z * 0.9;

    const lidOnly = machine(0);
    lidOnly.children[0].visible = false;
    lidOnly.position.y = 0.92;
    g.add(lidOnly);

    const deck = slab(W, 0.028, D, { surface: DECK, bevel: 0.3 });
    deck.position.y = 0.62;
    g.add(deck);

    const board = slab(W * 0.92, 0.016, D * 0.86, {
      surface: { color: 0x151a24, metalness: 0.35, roughness: 0.52 },
      bevel: 0.3,
    });
    board.position.y = 0.34;
    g.add(board);
    const chip = mat({ color: 0x39435a, metalness: 0.5, roughness: 0.4 });
    for (const [x, z, w, d] of [
      [-0.2, -0.06, 0.22, 0.14],
      [0.1, -0.1, 0.14, 0.09],
      [0.08, 0.07, 0.3, 0.07],
      [-0.24, 0.11, 0.13, 0.06],
    ]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, d), chip);
      c.position.set(x, 0.356, z);
      c.castShadow = true;
      g.add(c);
    }

    const plate = slab(W, 0.022, D, { bevel: 0.3 });
    plate.position.y = 0.06;
    g.add(plate);

    return { object: g, yaw: 0.62, pitch: 0.3, fov: 26, fit: 0.86 };
  }

  if (name === "fleet-scene") {
    /* A room of identical prepared laptops set out on desks — the alt text
       the page already carries. */
    for (let row = 0; row < 3; row++) {
      const d = desk(2.6);
      d.position.set(row * 0.18, 0, -row * 0.92);
      g.add(d);
      for (let n = 0; n < 3; n++) {
        const open = row === 0 && n === 1;
        const m = machine(open ? 1 : 0);
        m.position.set(row * 0.18 + (n - 1) * 0.84, 0.605, -row * 0.92);
        g.add(m);
      }
    }
    return { object: g, yaw: 0.55, pitch: 0.4, fov: 30, fit: 0.97 };
  }

  throw new Error(`unknown subject: ${name}`);
}
