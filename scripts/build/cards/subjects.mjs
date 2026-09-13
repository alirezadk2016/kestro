/*
 * The six drawings, one per card.
 *
 * Two rules hold across all of them, and both were learned the hard way:
 *
 *   One object per card. The fleet card started as nine machines on a floor
 *   and then as three scattered stacks; at the 330 px the card actually
 *   renders, both read as a pile of glass sheets. The other three cards are
 *   each a single object and this one had to be too.
 *
 *   One blue element per card. Blue is the brand, and the moment it appears
 *   on two things at once it stops pointing at anything. It is the screen on
 *   the laptop and the monitor, the power light on the tower, the machine
 *   being taken off the stack, the panel in the teardown, and the one open
 *   lid in the room.
 *
 * The teardown and the fleet room are drawn to the alt text the page already
 * carries — screen, keyboard, mainboard and base plate; identical prepared
 * laptops set out on desks — rather than the alt text being rewritten to
 * match whatever got drawn.
 */
import { P, box, keyFace, seg, shadow, stack, FACE, EDGE, poly } from "./iso.mjs";

const SCREEN = "url(#screen)";
const BLUE_EDGE = "rgba(126,162,255,0.62)";
const BLUE_FACE = "rgba(46,92,255,0.26)";
const WARM = "rgba(246,238,223,0.62)";

/* An open laptop. The lid hinges at the back edge and leans away from the
   viewer, so its front face reads as the screen. */
function laptop(sx = 0, sy = 0, sz = 0, s = 1) {
  const W = 62 * s,
    D = 40 * s,
    T = 3.2 * s,
    LH = 38 * s,
    TH = 1.6 * s;
  const t = 0.3,
    ct = Math.cos(t),
    st = Math.sin(t);
  const lid = (u, v, off) => [sx + u, sy + T + v * ct + off * st, sz - v * st + off * ct];
  const g = [box(sx, sy, sz, W, T, D)];
  const deck = [
    [6, 8],
    [W - 6, 8],
    [W - 6, D - 8],
    [6, D - 8],
  ].map(([u, w]) => P(sx + u, sy + T + 0.01, sz + w));
  g.push(
    `<polygon points="${poly(deck)}" fill="rgba(52,58,72,0.95)" stroke="${EDGE.dim}" stroke-width="${1.1 * s}"/>`,
  );
  for (let i = 1; i < 4; i++) {
    const w = 8 + ((D - 22) * i) / 4;
    g.push(
      seg([sx + 6, sy + T + 0.02, sz + w], [sx + W - 6, sy + T + 0.02, sz + w], {
        stroke: "rgba(168,192,224,0.22)",
        sw: 1 * s,
      }),
    );
  }
  const pad = [
    [W * 0.34, D - 9.5],
    [W * 0.66, D - 9.5],
    [W * 0.66, D - 2.5],
    [W * 0.34, D - 2.5],
  ].map(([u, w]) => P(sx + u, sy + T + 0.03, sz + w));
  g.push(
    `<polygon points="${poly(pad)}" fill="rgba(80,88,102,0.95)" stroke="rgba(190,210,236,0.30)" stroke-width="${1 * s}"/>`,
  );
  const front = [lid(0, 0, TH), lid(W, 0, TH), lid(W, LH, TH), lid(0, LH, TH)].map((p) => P(...p));
  const top = [lid(0, LH, 0), lid(W, LH, 0), lid(W, LH, TH), lid(0, LH, TH)].map((p) => P(...p));
  const side = [lid(W, 0, 0), lid(W, LH, 0), lid(W, LH, TH), lid(W, 0, TH)].map((p) => P(...p));
  g.push(
    `<polygon points="${poly(side)}" fill="${FACE.fill}" stroke="${EDGE.dim}" stroke-width="${1.4 * s}"/>`,
  );
  g.push(
    `<polygon points="${poly(front)}" fill="rgba(26,34,52,0.97)" stroke="${WARM}" stroke-width="${1.8 * s}"/>`,
  );
  g.push(
    `<polygon points="${poly(top)}" fill="${FACE.top}" stroke="${WARM}" stroke-width="${1.8 * s}"/>`,
  );
  const b = 2.6 * s;
  const glass = [
    lid(b, b, TH + 0.02),
    lid(W - b, b, TH + 0.02),
    lid(W - b, LH - b * 1.9, TH + 0.02),
    lid(b, LH - b * 1.9, TH + 0.02),
  ].map((p) => P(...p));
  g.push(
    `<polygon points="${poly(glass)}" fill="${SCREEN}" stroke="${BLUE_EDGE}" stroke-width="${1.1 * s}"/>`,
  );
  return g.join("");
}

function slab(x, y, z, s, o) {
  return box(x, y, z, 62 * s, 3.4 * s, 40 * s, o);
}

export const SUBJECTS = {
  "cat-laptops": () => shadow(31, 20, 62, 40) + laptop(0, 0, 0, 1),

  /* One tower, drawn properly. The first pass put a second unit behind it and
     the translucent faces let its edges show straight through, so the card
     read as two wireframes passing through each other. A category card is
     330 px wide in the grid: one object, clearly lit, beats two. */
  "cat-desktops": () => {
    const W = 27,
      Hh = 48,
      D = 44;
    const g = [shadow(W / 2, D / 2, W, D)];
    g.push(box(0, 0, 0, W, Hh, D));
    // the ventilated intake, on the warm-key face
    for (let i = 0; i < 8; i++) {
      const y = 5 + i * 2.6;
      g.push(
        seg([3.5, y, D + 0.02], [W - 3.5, y, D + 0.02], {
          stroke: "rgba(206,220,240,0.26)",
          sw: 1.5,
        }),
      );
    }
    // the drive bay seam and the optical slot
    g.push(seg([2.6, 30, D + 0.02], [W - 2.6, 30, D + 0.02], { stroke: WARM, sw: 1.2 }));
    g.push(
      seg([5, 35, D + 0.02], [W - 5, 35, D + 0.02], { stroke: "rgba(206,220,240,0.34)", sw: 2.2 }),
    );
    // the power light
    const d = P(W / 2, 42, D + 0.03);
    g.push(
      `<circle cx="${d[0].toFixed(2)}" cy="${d[1].toFixed(2)}" r="2.4" fill="${BLUE_FACE}" stroke="${BLUE_EDGE}" stroke-width="1.4"/>`,
    );
    // the exhaust grid on the lit top face
    for (let i = 1; i < 5; i++) {
      const z = (D * i) / 5;
      g.push(
        seg([4, Hh + 0.02, z], [W - 4, Hh + 0.02, z], {
          stroke: "rgba(246,238,223,0.24)",
          sw: 1.2,
        }),
      );
    }
    return g.join("");
  },

  "cat-monitors": () => {
    const g = [];
    g.push(box(17, 0, 4, 28, 1.8, 26, { sw: 1.4 })); // foot, forward of the panel
    g.push(box(27.5, 1.6, 5, 7, 15, 7, { sw: 1.4 })); // neck, meeting the panel back
    g.push(box(0, 15.5, 0, 62, 37, 3.2)); // panel
    const b = 2.4;
    g.push(
      keyFace(b, 15.5 + b, 3.22, 62 - 2 * b, 37 - 2 * b, {
        fill: SCREEN,
        stroke: BLUE_EDGE,
        sw: 1.2,
      }),
    );
    return shadow(31, 17, 30, 28) + g.join("");
  },

  /* Fleet: one stack of closed machines. Three scattered stacks put the far
     one on top of the near one at card size and read as a pile of glass
     sheets; the other three cards are each a single object, and this one
     should be too. The top unit is the card's one blue element. */
  "cat-fleet": () => {
    const W = 60,
      D = 40,
      T = 5.0,
      GAP = 1.0,
      N = 5;
    const g = [shadow(W / 2, D / 2, W, D, { scale: 0.98 })];
    for (let i = 0; i < N; i++) {
      const y = i * (T + GAP);
      const top = i === N - 1;
      // The top machine is slid out and powered. A flat blue top face made the
      // card read as a stack of trays with a blue lid, which is not a fleet.
      const ox = top ? 7 : 0,
        oz = top ? 5 : 0;
      g.push(box(ox, y, oz, W, T, D, { sw: top ? 1.8 : 1.5 }));
      g.push(
        seg(
          [ox + 1.2, y + T * 0.4, oz + D + 0.02],
          [ox + W - 1.2, y + T * 0.4, oz + D + 0.02],
          top
            ? { stroke: "rgba(108,150,255,0.85)", sw: 2.2 }
            : { stroke: "rgba(214,226,244,0.34)", sw: 1.2 },
        ),
      );
    }
    return g.join("");
  },

  /* The teardown, drawn to the alt text the page already carries: screen,
     keyboard, mainboard and base plate. Four layers, not five, and each one
     detailed differently — five identical slabs read as a stack of trays. */
  exploded: () => {
    const W = 58,
      D = 38;
    const g = [shadow(W / 2, D / 2 + 3, W, D, { scale: 0.92 })];
    /* The top face of a layer is (W + D) / 2 = 48 units tall on screen. Spaced
       12 apart, each plate buried the one under it and the whole teardown read
       as one thick slab with fringes. Spaced 27, every layer shows most of its
       own face, which is the entire point of an exploded view. */
    const layers = [
      { y: 0, h: 2.6, part: "base" },
      { y: 27, h: 1.5, part: "board" },
      { y: 54, h: 2.9, part: "keys" },
      { y: 81, h: 1.9, part: "screen" },
    ];
    for (const L of layers) {
      g.push(box(0, L.y, 0, W, L.h, D, { sw: 1.5 }));
      const f = L.y + L.h + 0.02;
      const plate = (x1, z1, x2, z2, fill, stroke, sw) =>
        `<polygon points="${poly([P(x1, f, z1), P(x2, f, z1), P(x2, f, z2), P(x1, f, z2)])}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

      if (L.part === "base") {
        g.push(plate(3, 3, W - 3, D - 3, "rgba(56,62,76,0.96)", "rgba(214,226,244,0.26)", 1.2));
        for (const x of [10, W - 10]) {
          for (const z of [8, D - 8]) {
            const c = P(x, f + 0.01, z);
            g.push(
              `<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="1.5" fill="none" stroke="rgba(214,226,244,0.34)" stroke-width="1.1"/>`,
            );
          }
        }
      }
      if (L.part === "board") {
        g.push(
          plate(2.5, 2.5, W - 2.5, D - 2.5, "rgba(42,50,64,0.96)", "rgba(214,226,244,0.24)", 1.1),
        );
        const parts = [
          [8, 8, 22, 20],
          [26, 7, 38, 15],
          [26, 18, 46, 24],
          [8, 24, 20, 31],
          [40, 27, 51, 32],
        ];
        for (const [x1, z1, x2, z2] of parts) {
          g.push(plate(x1, z1, x2, z2, "rgba(94,100,112,0.97)", "rgba(222,232,248,0.40)", 1.1));
        }
        for (let i = 0; i < 6; i++) {
          const z = 6 + i * 5;
          g.push(
            seg([50, f + 0.01, z], [55, f + 0.01, z], { stroke: "rgba(214,226,244,0.30)", sw: 1 }),
          );
        }
      }
      if (L.part === "keys") {
        g.push(plate(5, 6, W - 5, D - 13, "rgba(44,50,64,0.96)", "rgba(214,226,244,0.26)", 1.2));
        for (let i = 1; i < 4; i++) {
          const z = 6 + ((D - 19) * i) / 4;
          g.push(
            seg([5, f + 0.01, z], [W - 5, f + 0.01, z], {
              stroke: "rgba(200,214,238,0.30)",
              sw: 1.1,
            }),
          );
        }
        g.push(
          plate(
            W * 0.34,
            D - 10,
            W * 0.66,
            D - 4,
            "rgba(82,90,104,0.96)",
            "rgba(214,226,244,0.32)",
            1.1,
          ),
        );
      }
      if (L.part === "screen") {
        g.push(plate(3.2, 3.2, W - 3.2, D - 5.5, SCREEN, BLUE_EDGE, 1.2));
      }
    }
    // leaders, on the three corners the eye can follow
    for (let i = 0; i < layers.length - 1; i++) {
      const a = layers[i],
        b = layers[i + 1];
      for (const [x, z, alpha] of [
        [0, D, 0.34],
        [W, D, 0.3],
        [W, 0, 0.18],
      ]) {
        g.push(
          seg([x, a.y + a.h, z], [x, b.y, z], {
            stroke: `rgba(214,226,244,${alpha})`,
            sw: 1,
            dash: "3 4.5",
          }),
        );
      }
    }
    return g.join("");
  },

  /* The fleet room, drawn to its alt text: identical prepared laptops set out
     on desks. The earlier pass drew a warehouse rack, which the alt does not
     describe and a customer does not recognise. Benches recede; one machine
     is open, and it is the card's single blue element. The lower third stays
     empty, because the heading and paragraph sit there. */
  "fleet-scene": () => {
    const BW = 118,
      BD = 30,
      TOP = 2.6,
      LEG = 17;
    const rows = [
      { z: 0, x: 6 },
      { z: 40, x: 0 },
      { z: 80, x: 10 },
    ];
    const out = [];
    for (const r of rows) {
      const g = [shadow(r.x + BW / 2, r.z + BD / 2, BW * 0.72, BD, { scale: 0.9 })];
      // Legs before the top: drawn after, a near leg painted over the surface
      // it is holding up and the desks read as tables floating above sticks.
      for (const lx of [r.x + 5, r.x + BW - 9]) {
        for (const lz of [r.z + 4, r.z + BD - 8]) {
          g.push(box(lx, 0, lz, 4, LEG, 4, { topFill: FACE.key, keyFill: FACE.fill, sw: 1 }));
        }
      }
      g.push(box(r.x, LEG, r.z, BW, TOP, BD, { topFill: FACE.key, keyFill: FACE.fill, sw: 1.3 }));
      for (let n = 0; n < 3; n++) {
        const x = r.x + 8 + n * 36;
        const z = r.z + 6;
        const open = r.z === 80 && n === 1;
        g.push(box(x, LEG + TOP, z, 28, 2.4, 18, { sw: 1.2 }));
        if (open) {
          // the one machine standing open, its panel facing the viewer
          const t = 0.3,
            ct = Math.cos(t),
            st = Math.sin(t);
          const lid = (u, v, off) => [
            x + u,
            LEG + TOP + 2.4 + v * ct + off * st,
            z - v * st + off * ct,
          ];
          const front = [lid(0, 0, 1), lid(28, 0, 1), lid(28, 17, 1), lid(0, 17, 1)].map((q) =>
            P(...q),
          );
          const top = [lid(0, 17, 0), lid(28, 17, 0), lid(28, 17, 1), lid(0, 17, 1)].map((q) =>
            P(...q),
          );
          g.push(
            `<polygon points="${poly(front)}" fill="${SCREEN}" stroke="${BLUE_EDGE}" stroke-width="1.5"/>`,
          );
          g.push(
            `<polygon points="${poly(top)}" fill="${FACE.top}" stroke="${WARM}" stroke-width="1.4"/>`,
          );
        } else {
          g.push(
            seg([x + 1, LEG + TOP + 1.0, z + 18.02], [x + 27, LEG + TOP + 1.0, z + 18.02], {
              stroke: "rgba(214,226,244,0.30)",
              sw: 1.1,
            }),
          );
        }
      }
      out.push({ d: r.z, g: g.join("") });
    }
    return stack(out);
  },
};
