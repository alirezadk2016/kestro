import { PlateDefs, Slab, plane, slabSide, drawings as clusterDrawings } from "./VidenPlate";
import type { Cluster } from "@/lib/guides";

/*
 * The guide plates — one drawing per vejledning.
 *
 * Until now the section had drawings of its *topics* and none of its guides:
 * VidenClusterPlate on the hub index and ClusterMark behind an article's
 * heading, both keyed on cluster. With three guides in "Levetid og udskiftning"
 * and three in "Køb, stand og afhændelse", six of the eight articles shared a
 * picture with at least one other, and the hub's own list of guides had no
 * picture at all. A reader scanning the list had nothing to recognise a guide
 * by except its title.
 *
 * These are the same drawings, one step further down: same isometric 2:1
 * projection, same single lamp above and to the left, same Slab with its
 * opaque base pass, same 224×150 plate, same one accent. Nothing here is a new
 * visual language — it is the existing one applied per article, which is why
 * this file imports its primitives from VidenPlate rather than restating them.
 *
 * What is new is that they run. Each plate is a loop between eight and sixteen
 * seconds: the length of a thought, not the length of a blink. Every one of
 * them animates the single thing its guide is about — a module going into a
 * socket, a balance that genuinely tips both ways, blocks being overwritten —
 * and nothing else moves. A plate that animated its decoration would be a
 * screensaver.
 *
 * All of it is CSS, generated below and emitted once by GuidePlateStyles.
 * There is no state, no effect and no client bundle: these render in a server
 * component, appear with the markup, and cost nothing to hydrate. The whole
 * file adds about four kilobytes of style to a page that already ships the
 * plates' geometry inline.
 *
 * Everything is aria-hidden. Each plate sits beside the guide's own title and
 * summary; a screen reader gaining "isometric parallelogram with contact comb"
 * would be noise.
 */

/* ------------------------------------------------------------------ timing */

/**
 * A moment on a plate's timeline, as a keyframe percentage.
 *
 * Written per plate rather than shared, because the plates do not share a
 * clock: a balance that tips twice needs fourteen seconds and a module going
 * into a socket needs twelve, and forcing both onto one cycle would make one
 * of them wrong. What they do share is the range — 8s to 16s — which is what
 * keeps eight plates on one page from reading as eight different tempos.
 */
const clock = (cycle: number) => (t: number) => `${((t / cycle) * 100).toFixed(2)}%`;

/** Every plate's loop length in seconds, in one place so the range is visible. */
const CYCLE = {
  support: 12,
  process: 13,
  balance: 14,
  socket: 12,
  inspect: 15,
  assembly: 16,
  gates: 12,
  erase: 14,
} as const;

/* ------------------------------------------------------------- the drawings */

/*
 * Geometry note for everything below.
 *
 * plane(x, y, a, b) is an isometric top face whose corners are
 *   back (x, y) · right (x+2a, y+a) · front (x+2a-2b, y+a+b) · left (x-2b, y+b)
 * so a Slab at (x, y, a, b, h) occupies x-2b … x+2a horizontally and
 * y … y+a+b+h vertically. Every figure here is placed by that arithmetic
 * rather than by eye, which is what keeps eight plates sitting on the same
 * ground plane.
 */

/** 01 — Windows 10: the updates that stop at a date. */
function supportPlate(id: string) {
  const machines = [26, 66, 106];

  return (
    <>
      {/* The run of time the fleet stands on. */}
      <g className="opacity-45">
        <line x1="10" y1="113" x2="200" y2="113" />
        <line x1="10" y1="107" x2="10" y2="119" />
        <line x1="200" y1="107" x2="200" y2="119" />
      </g>

      {/* Three machines in support. Left to right, so each covers the one
          behind it — the fade goes through the slab, never around it. */}
      {machines.map((x, i) => (
        <Slab key={x} id={id} x={x} y={82} a={13} b={8} h={10} top={0.1} fade={[0.7, 0.85, 1][i]} />
      ))}

      {/* The updates, arriving along the line and stopping dead at the date.
          Three of them, and then none — which is the whole guide. */}
      <g className="text-brand-300">
        {[0, 1, 2].map((i) => (
          <g key={i} className={`gp-tick gp-tick-${i}`}>
            <path d="M24 54l7 4 -7 4" strokeWidth="1.6" />
          </g>
        ))}
      </g>

      {/* 14 October 2025, as a line rather than a label: the plate carries no
          type, so the date is drawn and the page says it. */}
      <g className="stroke-brand-300">
        <line x1="142" y1="44" x2="142" y2="113" />
        <circle cx="142" cy="113" r="3.5" className="fill-brand-300" />
        <circle cx="142" cy="113" r="9" className="gp-pulse opacity-40" />
      </g>

      {/* What comes after it: still there, no longer covered. */}
      <g className="gp-breathe stroke-brand-300">
        {/* Built from the same plane() and slabSide() the solid machines are,
            rather than from four corners typed in by hand: a ghost drawn on a
            different projection to the objects beside it reads as a mistake. */}
        <polygon points={plane(166, 82, 13, 8)} strokeDasharray="4 3" />
        <polygon points={slabSide(166, 82, 13, 8, 10).left} strokeDasharray="4 3" />
        <polygon points={slabSide(166, 82, 13, 8, 10).right} strokeDasharray="4 3" />
      </g>
    </>
  );
}

/** 02 — Refurbished or used: one machine, and the work that may or may not
    have happened to it. */
function processPlate(id: string) {
  /* Four bars, not four boxes. The first version drew the steps as isometric
     tiles fourteen pixels across, which at the size this plate is actually
     used disappeared into a dashed smudge. What the guide is about has to be
     the most legible thing in the frame. */
  const steps = [30, 44, 58, 72];

  return (
    <>
      {/* Two identical machines. Identical on purpose: the words describe what
          was done to them, not what they are, so the drawing must not put the
          difference in the object. */}
      <Slab id={id} x={42} y={92} a={22} b={10} h={7} top={0.09} fade={0.8} />
      <Slab id={id} x={150} y={92} a={22} b={10} h={7} top={0.11} />

      {/* Over the left one: nothing stated. One line, dashed, and no more. */}
      <g className="gp-unknown">
        <rect x="24" y="58" width="62" height="11" strokeDasharray="4 3" />
        <line x1="52" y1="69" x2="52" y2="88" strokeDasharray="3 4" className="opacity-40" />
      </g>

      {/* Over the right one: four steps of a process, landing one at a time.
          Four because that is how many the guide names — tested, replaced,
          erased, documented — not because four fits. */}
      <g className="opacity-35">
        <line x1="163" y1="81" x2="163" y2="88" />
      </g>
      {steps.map((y, i) => (
        <g key={i}>
          <rect x="132" y={y} width="62" height="11" className="fill-brand-950" stroke="none" />
          <rect x="132" y={y} width="62" height="11" className="opacity-45" />
          <rect
            x="132"
            y={y}
            width="62"
            height="11"
            className={`gp-step gp-step-${i} fill-brand-300/25 stroke-brand-300`}
          />
        </g>
      ))}

      {/* The rule the two stand on, so they read as one comparison. */}
      <line x1="18" y1="140" x2="200" y2="140" className="opacity-20" />
    </>
  );
}

/** 03 — Repair or replace: a balance that tips both ways, because the answer
    does. */
function balancePlate(id: string) {
  return (
    <>
      {/* Level, drawn behind everything: without a reference the tilt is not
          a tilt, it is just a crooked line. */}
      <line x1="30" y1="96" x2="194" y2="96" strokeDasharray="3 5" className="opacity-25" />

      <g className="gp-beam" style={{ transformBox: "view-box", transformOrigin: "112px 96px" }}>
        <line x1="46" y1="96" x2="178" y2="96" className="opacity-80" />
        {/* The part, and the machine. */}
        {/* A part on one side and a whole machine on the other, and they have
            to be told apart at a glance: the first pass drew two boxes of
            nearly the same size, which is a see-saw, not a comparison. */}
        <Slab id={id} x={56} y={80} a={7} b={4} h={5} top={0.12} shadow={false} />
        <Slab id={id} x={146} y={68} a={15} b={8} h={5} top={0.11} shadow={false} />
      </g>

      {/* The pivot: the thing the guide actually supplies — a number to weigh
          against. */}
      <path d="M112 96l-11 26h22z" className="fill-brand-950" stroke="none" />
      <path d="M112 96l-11 26h22z" className="fill-brand-300/20 stroke-brand-300" />

      {/* Which side is currently heavier, said once at the foot of the plate
          rather than by decorating the beam. */}
      <g className="stroke-brand-300">
        <line x1="36" y1="134" x2="76" y2="134" strokeWidth="2.5" className="gp-weigh-left" />
        <line x1="148" y1="134" x2="188" y2="134" strokeWidth="2.5" className="gp-weigh-right" />
      </g>
    </>
  );
}

/** 04 — Upgrading memory: the module going into the socket, and coming back
    out, because that is the part people want to see before they open the
    machine. */
function socketPlate(id: string) {
  /* The socket in the board, and the module that goes into it. They are drawn
     on the same footprint deliberately — that is what "it only fits one way"
     looks like — but not at the same size: the first pass gave the module the
     socket's exact plane, so a seated module was indistinguishable from a
     filled hole and the contact comb, drawn along the top edge, read as the
     teeth of a zip. The module is inset, thicker, and stands proud. */
  const slot = { x: 60, y: 77, a: 20, b: 4 };
  const mod = { x: 62, y: 73, a: 17, b: 3.5, h: 5 };

  /* The module's near edge, where the pins are. Taken off the same plane()
     corners it is drawn with, so the comb cannot drift off the board. */
  const left = { x: mod.x - 2 * mod.b, y: mod.y + mod.b };
  const front = { x: mod.x + 2 * mod.a - 2 * mod.b, y: mod.y + mod.a + mod.b };

  return (
    <>
      <Slab id={id} x={60} y={66} a={36} b={15} h={5} top={0.09} />

      {/* The empty socket: a recess with the board's own contacts in it, so
          the module has something to meet rather than a hole to fall into. */}
      <polygon points={plane(slot.x, slot.y, slot.a, slot.b)} className="fill-brand-950" stroke="none" />
      <polygon points={plane(slot.x, slot.y, slot.a, slot.b)} className="opacity-60" />
      <g className="opacity-30">
        {Array.from({ length: 11 }, (_, i) => {
          const t = 0.06 + i * 0.088;
          const sl = { x: slot.x - 2 * slot.b, y: slot.y + slot.b };
          const sf = { x: slot.x + 2 * slot.a - 2 * slot.b, y: slot.y + slot.a + slot.b };
          const px = sl.x + (sf.x - sl.x) * t;
          const py = sl.y + (sf.y - sl.y) * t;
          return <line key={i} x1={px} y1={py} x2={px + 4} y2={py - 2} strokeWidth="0.9" />;
        })}
      </g>

      {/* The two retaining clips at the ends of the slot, closing once the
          module is down. */}
      <g className="gp-latch stroke-brand-300">
        <line x1="50" y1="79" x2="50" y2="85" strokeWidth="1.8" />
        <line x1="102" y1="99" x2="102" y2="105" strokeWidth="1.8" />
      </g>

      <g className="gp-module">
        <Slab id={id} x={mod.x} y={mod.y} a={mod.a} b={mod.b} h={mod.h} top={0.15} shadow={false} />
        {/* Two DRAM packages, so it is a module and not a shim. */}
        {[0.22, 0.6].map((t) => {
          const ox = mod.x + 2 * mod.a * t - 2 * mod.b * 0.5;
          const oy = mod.y + mod.a * t + mod.b * 0.5;
          return (
            <g key={t}>
              <polygon points={plane(ox, oy, 5, 2.4)} className="fill-brand-400/30" stroke="none" />
              <polygon points={plane(ox, oy, 5, 2.4)} strokeWidth="0.9" className="opacity-70" />
            </g>
          );
        })}

        {/* The pins on the underside of the near edge — the part that has to
            line up, and the reason the accent is spent here. Drawn hanging
            below the edge rather than along the top of it. */}
        <g className="gp-contacts stroke-brand-300">
          {Array.from({ length: 10 }, (_, i) => {
            const t = 0.07 + i * 0.095;
            const px = left.x + (front.x - left.x) * t;
            const py = left.y + (front.y - left.y) * t;
            return <line key={i} x1={px} y1={py + mod.h} x2={px} y2={py + mod.h + 4} strokeWidth="1.1" />;
          })}
        </g>
      </g>
    </>
  );
}

/** 05 — Checking a used laptop: the five places somebody actually looks. */
function inspectPlate(id: string) {
  /* The lid stands on the machine's back edge. Same corners as the base, so
     the hinge is a shared edge rather than two lines that nearly meet. */
  const base = { x: 70, y: 80, a: 32, b: 14 };
  const p0 = { x: base.x, y: base.y };
  const p1 = { x: base.x + 2 * base.a, y: base.y + base.a };
  const lid = 44;
  const face = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p1.x},${p1.y - lid} ${p0.x},${p0.y - lid}`;

  /* Five places somebody actually looks, and where they are on the drawing.
     Small: the loupe is the large circle in this plate, and a checkpoint drawn
     at nearly the same size turned the pair into a face. */
  const marks = [
    { x: 102, y: 74 },
    { x: 102, y: 96 },
    { x: 84, y: 104 },
    { x: 58, y: 104 },
    { x: 102, y: 120 },
  ];

  return (
    <>
      <polygon points={face} className="fill-brand-950" stroke="none" />
      <polygon points={face} fill={`url(#${id}-screen)`} stroke="none" opacity={0.22} />
      <polygon points={face} />
      {/* Something on the screen. An empty parallelogram standing on edge is a
          shape; this has to be a machine that has been used. */}
      <g className="opacity-25">
        <line x1={p0.x + 10} y1={p0.y - lid + 14} x2={p1.x - 12} y2={p1.y - lid + 22} />
        <line x1={p0.x + 10} y1={p0.y - lid + 24} x2={p1.x - 28} y2={p1.y - lid + 27} />
      </g>

      <Slab id={id} x={base.x} y={base.y} a={base.a} b={base.b} h={6} top={0.1} />

      {/* Keys as hatching, the same shorthand the workplace plate uses. */}
      <g className="opacity-20">
        {Array.from({ length: 4 }, (_, i) => (
          <line key={i} x1={54 + i * 11} y1={96 + i * 5.5} x2={82 + i * 11} y2={110 + i * 5.5} />
        ))}
      </g>

      {/* The five checkpoints, each landing as the loupe reaches it. */}
      {marks.map((m, i) => (
        <g key={i} className={`gp-mark gp-mark-${i}`}>
          <circle cx={m.x} cy={m.y} r="2.6" className="fill-brand-300 stroke-brand-300" />
        </g>
      ))}

      {/* The loupe. A ring with nothing in it, so what it is over stays
          visible — a filled disc the size of the checkpoint under it made the
          two read as one object. It travels; it does not blink from place to
          place. */}
      <g className="gp-loupe stroke-brand-300">
        <circle cx="102" cy="74" r="12" className="opacity-95" />
        <circle cx="102" cy="74" r="12" className="fill-brand-300/[0.07]" stroke="none" />
        <line x1="110.5" y1="82.5" x2="118" y2="90" strokeWidth="2.4" className="opacity-95" />
      </g>
    </>
  );
}

/** 06 — Building a PC: the parts coming apart and going back together. */
function assemblyPlate(id: string) {
  const layers = [
    { y: 78, top: 0.14 },
    { y: 84, top: 0.12 },
    { y: 90, top: 0.1 },
    { y: 96, top: 0.09 },
  ];

  return (
    <>
      {/* The ties: only there while the stack is apart, which is what makes it
          an exploded view rather than four things drifting. */}
      <g className="gp-tie opacity-45" strokeDasharray="2 5">
        <line x1="88" y1="30" x2="88" y2="142" />
        <line x1="148" y1="60" x2="148" y2="126" />
      </g>

      {/* Bottom first: each layer has to cover the one under it as they meet. */}
      {[3, 2, 1, 0].map((i) => (
        <g key={i} className={`gp-layer-${i}`}>
          <Slab
            id={id}
            x={88}
            y={layers[i].y}
            a={30}
            b={16}
            h={5}
            top={layers[i].top}
            shadow={i === 3}
          />
        </g>
      ))}

      {/* Where the parts go: three leader dots on the top layer, the same
          annotation the hero plate uses. */}
      <g className="gp-layer-0 text-brand-300">
        <circle cx="88" cy="78" r="3.5" className="fill-brand-300 stroke-brand-300" />
        <circle cx="88" cy="78" r="10" className="opacity-35" />
      </g>
    </>
  );
}

/** 07 — Windows 11 on an older machine: three requirements, checked one at a
    time, and the third left open — because whether a given machine passes is
    exactly what the guide will not answer for you. */
function gatesPlate(id: string) {
  const rows = [48, 78, 108];

  return (
    <>
      <Slab id={id} x={44} y={68} a={20} b={9} h={8} top={0.1} />

      {/* The machine, asking three questions of itself. */}
      <g className="opacity-35">
        <line x1="86" y1="86" x2="94" y2="86" />
        <line x1="94" y1="55" x2="94" y2="115" />
        {rows.map((y) => (
          <line key={y} x1="94" y1={y + 7} x2="100" y2={y + 7} />
        ))}
      </g>

      {rows.map((y, i) => (
        <g key={y}>
          <rect x="100" y={y} width="86" height="14" className="fill-brand-950" stroke="none" />
          <rect x="100" y={y} width="86" height="14" className="opacity-55" />
          {/* Requirement, drawn as a filled span of the bar rather than named:
              the plate carries no type, and the guide names all three. */}
          <rect
            x="106"
            y={y + 5}
            width={[46, 34, 40][i]}
            height="4"
            className="fill-brand-400/25"
            stroke="none"
          />
          <rect x="190" y={y} width="14" height="14" className="fill-brand-950" stroke="none" />
          {i < 2 ? (
            <>
              <rect x="190" y={y} width="14" height="14" className="opacity-55" />
              <rect
                x="190"
                y={y}
                width="14"
                height="14"
                className={`gp-gate gp-gate-${i} fill-brand-300/70 stroke-brand-300`}
              />
            </>
          ) : (
            /* The one that is not settled here. Dashed and unresolved on
               purpose: two machines of the same age answer this differently,
               and a plate that showed three ticks would be making a claim the
               article spends a section refusing to make. */
            <rect
              x="190"
              y={y}
              width="14"
              height="14"
              strokeDasharray="3 2"
              className="gp-open stroke-brand-300"
            />
          )}
        </g>
      ))}

      {/* The pass itself. */}
      <g className="gp-scan text-brand-300">
        <line x1="96" y1="42" x2="208" y2="42" strokeWidth="1.6" className="opacity-90" />
      </g>
    </>
  );
}

/** 08 — Erasing before you sell: the drive being written over, and the report
    that says it was. No red, no cascading characters — this is a documented
    procedure, not a break-in. */
function erasePlate(id: string) {
  const d = { x: 52, y: 52, a: 34, b: 16 };
  /* A point on the drive's top face in its own (u, v) coordinates, so the
     block grid stays on the surface if the slab is ever resized. */
  const on = (u: number, v: number) => ({
    x: d.x + 2 * d.a * u - 2 * d.b * v,
    y: d.y + d.a * u + d.b * v,
  });

  /* Six blocks, not twelve. Twelve of them at the size this plate is used
     stopped being blocks and became hatching — the outlines alone were more
     ink than the drive. */
  const columns = [0, 1, 2];
  const rows = [0, 1];

  return (
    <>
      <Slab id={id} x={d.x} y={d.y} a={d.a} b={d.b} h={7} top={0.09} />

      {/* Twelve blocks. The outlines never move; only what is in them goes. */}
      {columns.map((i) => (
        <g key={i} className={`gp-col gp-col-${i}`}>
          {rows.map((j) => {
            const o = on(0.08 + i * 0.29, 0.1 + j * 0.42);
            return (
              <polygon
                key={j}
                points={plane(o.x, o.y, d.a * 0.245, d.b * 0.35)}
                className="fill-brand-300/30"
                stroke="none"
              />
            );
          })}
        </g>
      ))}
      <g className="opacity-40">
        {columns.map((i) =>
          rows.map((j) => {
            const o = on(0.08 + i * 0.29, 0.1 + j * 0.42);
            return (
              <polygon
                key={`${i}-${j}`}
                points={plane(o.x, o.y, d.a * 0.245, d.b * 0.35)}
                strokeWidth="0.9"
              />
            );
          }),
        )}
      </g>

      {/* The write head, crossing the surface once. */}
      <g className="gp-sweep stroke-brand-300">
        <line
          x1={on(0.02, 0.02).x}
          y1={on(0.02, 0.02).y}
          x2={on(0.02, 0.96).x}
          y2={on(0.02, 0.96).y}
          strokeWidth="1.8"
        />
      </g>

      {/* The report. Flat beside an isometric object, the same way the
          "øvrige" plate sets a sheet next to a part. */}
      <g className="opacity-45">
        <path d="M140 48h44l18 18v48h-62z" strokeDasharray="5 4" />
        <path d="M184 48v18h18" strokeDasharray="5 4" />
        <line x1="150" y1="78" x2="192" y2="78" className="opacity-60" />
        <line x1="150" y1="88" x2="180" y2="88" className="opacity-60" />
      </g>
      {/* Signed off, once the surface is clear. */}
      <g className="gp-stamp text-brand-300">
        <circle cx="171" cy="102" r="11" className="fill-brand-300/15 stroke-brand-300" />
        <path d="M166 102l4 4 7-8" strokeWidth="1.8" fill="none" />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------- wiring */

/**
 * Slug to drawing.
 *
 * Keyed on slug rather than on an index, so adding, removing or reordering a
 * guide cannot silently hand an article somebody else's picture. A slug with
 * no entry falls back to its cluster plate, which is what the section drew
 * before this file existed — a new guide gets a worse drawing, never none.
 */
const plates: Record<string, (id: string) => React.ReactNode> = {
  "windows-10-support-slutter": supportPlate,
  "refurbished-eller-brugt": processPlate,
  "reparere-eller-koebe-ny": balancePlate,
  "opgrader-ram-i-baerbar": socketPlate,
  "tjek-brugt-baerbar-foer-koeb": inspectPlate,
  "samle-din-egen-pc": assemblyPlate,
  "windows-11-paa-aeldre-maskine": gatesPlate,
  "slet-data-foer-du-saelger": erasePlate,
};

export const hasGuidePlate = (slug: string) => slug in plates;

/* ---------------------------------------------------------------------- css */

function keyframes(): string {
  const out: string[] = [];

  /* 01 — support. Three updates arrive, and then the line runs on empty. */
  {
    const at = clock(CYCLE.support);
    [0, 1, 2].forEach((i) => {
      const t0 = i * 1.1;
      out.push(`
@keyframes gp-tick-${i} {
  0%, ${at(t0)} { opacity: 0; transform: translateX(0); }
  ${at(t0 + 0.25)} { opacity: 0.9; }
  ${at(t0 + 1.55)} { opacity: 0.9; }
  ${at(t0 + 2)}, 100% { opacity: 0; transform: translateX(104px); }
}`);
    });
    out.push(`
@keyframes gp-pulse {
  0%, 100% { opacity: 0.15; transform: scale(0.9); }
  50% { opacity: 0.5; transform: scale(1.18); }
}
@keyframes gp-breathe {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.85; }
}`);
  }

  /* 02 — process. Four steps land in order and stay until the loop turns. */
  {
    const at = clock(CYCLE.process);
    [0, 1, 2, 3].forEach((i) => {
      const t0 = 0.7 + i * 1.35;
      out.push(`
@keyframes gp-step-${i} {
  0%, ${at(t0)} { opacity: 0; }
  ${at(t0 + 0.35)} { opacity: 1; }
  ${at(9.8)} { opacity: 1; }
  ${at(10.9)}, 100% { opacity: 0; }
}`);
    });
    out.push(`
@keyframes gp-unknown {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.75; }
}`);
  }

  /* 03 — balance. Both ways, held long enough at each end to be read as an
     answer rather than as a wobble. */
  out.push(`
@keyframes gp-beam {
  0%, 5% { transform: rotate(0deg); }
  24%, 38% { transform: rotate(-6.5deg); }
  59%, 73% { transform: rotate(6.5deg); }
  94%, 100% { transform: rotate(0deg); }
}
@keyframes gp-weigh-left {
  0%, 16% { opacity: 0.2; }
  26%, 36% { opacity: 1; }
  46%, 100% { opacity: 0.2; }
}
@keyframes gp-weigh-right {
  0%, 51% { opacity: 0.2; }
  61%, 71% { opacity: 1; }
  81%, 100% { opacity: 0.2; }
}`);

  /* 04 — socket. In, seated, held, and back out: a demonstration, not a
     teleport back to the start. */
  out.push(`
@keyframes gp-module {
  0%, 6% { transform: translateY(-30px); opacity: 0.5; }
  10% { opacity: 1; }
  26% { transform: translateY(2px); }
  30% { transform: translateY(0); }
  62% { transform: translateY(0); opacity: 1; }
  82% { transform: translateY(-30px); opacity: 0.5; }
  100% { transform: translateY(-30px); opacity: 0.5; }
}
/* The pins are visible while the module is out and hidden once it is in —
   they are inside the socket at that point. Leaving them lit through the hold
   drew a comb of teeth across the board. */
@keyframes gp-contacts {
  0%, 24% { opacity: 0.9; }
  29% { opacity: 1; }
  34%, 62% { opacity: 0.15; }
  72%, 100% { opacity: 0.9; }
}
@keyframes gp-latch {
  0%, 31% { opacity: 0; }
  38%, 64% { opacity: 0.95; }
  76%, 100% { opacity: 0; }
}`);

  /* 05 — inspection. Five stops, each held long enough to look at. */
  {
    const stops = [
      [0, 0],
      [0, 22],
      [-20, 30],
      [-44, 30],
      [-2, 46],
    ];
    const arrive = [0, 14, 31, 48, 65];
    const leave = [8, 25, 42, 59, 76];

    out.push(`
@keyframes gp-loupe {
${stops
  .map(
    ([dx, dy], i) =>
      `  ${arrive[i]}%, ${leave[i]}% { transform: translate(${dx}px, ${dy}px); }`,
  )
  .join("\n")}
  84%, 100% { transform: translate(0, 0); }
}`);

    arrive.forEach((t, i) => {
      out.push(`
@keyframes gp-mark-${i} {
  0%, ${t}% { opacity: 0; transform: scale(0.5); }
  ${t + 3}% { opacity: 1; transform: scale(1); }
  90% { opacity: 1; transform: scale(1); }
  97%, 100% { opacity: 0; transform: scale(1); }
}`);
    });
  }

  /* 06 — assembly. Apart, held, together, held. The slowest plate on the
     page, because it is the one whose whole subject is taking your time. */
  {
    const delta = [-48, -32, -16, 0];
    delta.forEach((dy, i) => {
      out.push(`
@keyframes gp-layer-${i} {
  0%, 6% { transform: translateY(0); }
  34%, 56% { transform: translateY(${dy}px); }
  84%, 100% { transform: translateY(0); }
}`);
    });
    out.push(`
@keyframes gp-tie {
  0%, 14% { opacity: 0; }
  34%, 56% { opacity: 0.45; }
  76%, 100% { opacity: 0; }
}`);
  }

  /* 07 — gates. One pass down the three requirements. */
  out.push(`
@keyframes gp-scan {
  0%, 3% { opacity: 0; transform: translateY(0); }
  7% { opacity: 0.9; }
  42% { opacity: 0.9; }
  47%, 100% { opacity: 0; transform: translateY(84px); }
}
@keyframes gp-gate-0 {
  0%, 12% { opacity: 0; }
  17%, 86% { opacity: 1; }
  94%, 100% { opacity: 0; }
}
@keyframes gp-gate-1 {
  0%, 26% { opacity: 0; }
  31%, 86% { opacity: 1; }
  94%, 100% { opacity: 0; }
}
@keyframes gp-open {
  0%, 40% { opacity: 0.25; }
  47% { opacity: 0.95; }
  60% { opacity: 0.35; }
  73% { opacity: 0.95; }
  86% { opacity: 0.35; }
  94%, 100% { opacity: 0.25; }
}`);

  /* 08 — erase. Column by column, then the report is signed. */
  {
    const at = clock(CYCLE.erase);
    [0, 1, 2].forEach((i) => {
      const t = 0.9 + i * 1.35;
      out.push(`
@keyframes gp-col-${i} {
  0%, ${at(t)} { opacity: 1; }
  ${at(t + 0.45)} { opacity: 0; }
  ${at(12.2)} { opacity: 0; }
  ${at(13.4)}, 100% { opacity: 1; }
}`);
    });
    out.push(`
@keyframes gp-sweep {
  0%, 2% { opacity: 0; transform: translate(0, 0); }
  7% { opacity: 0.95; }
  34% { opacity: 0.95; }
  39%, 100% { opacity: 0; transform: translate(64px, 32px); }
}
@keyframes gp-stamp {
  0%, 39% { opacity: 0; transform: scale(0.6); }
  45% { opacity: 1; transform: scale(1.1); }
  50% { transform: scale(1); }
  88% { opacity: 1; transform: scale(1); }
  96%, 100% { opacity: 0; transform: scale(1); }
}`);
  }

  return out.join("\n");
}

const css = `
${keyframes()}

/*
 * Nothing moves unless motion is welcome.
 *
 * Without the query every plate resolves to the state that carries its
 * meaning: the module seated, the parts apart, the drive clear and the report
 * signed, two requirements met and the third still open. A still plate is a
 * finished drawing, never an empty one.
 */
.gp-tick, .gp-scan, .gp-sweep { opacity: 0; }
.gp-mark, .gp-step, .gp-gate, .gp-stamp, .gp-latch { opacity: 1; }
.gp-open { opacity: 0.35; }
/* Cleared, not full: the still frame has the drive wiped and the report
   signed. Left at its default the blocks stayed filled beside a signed report,
   which is the one pair of statements this plate must not make together. */
.gp-col { opacity: 0; }
.gp-tie { opacity: 0.45; }
.gp-layer-0 { transform: translateY(-48px); }
.gp-layer-1 { transform: translateY(-32px); }
.gp-layer-2 { transform: translateY(-16px); }
.gp-contacts { opacity: 0.15; }
.gp-unknown { opacity: 0.5; }
.gp-breathe { opacity: 0.6; }
.gp-pulse { opacity: 0.25; }
.gp-weigh-left, .gp-weigh-right { opacity: 0.2; }

@media (prefers-reduced-motion: no-preference) {
  .gp-tick-0 { animation: gp-tick-0 ${CYCLE.support}s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .gp-tick-1 { animation: gp-tick-1 ${CYCLE.support}s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .gp-tick-2 { animation: gp-tick-2 ${CYCLE.support}s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .gp-pulse { animation: gp-pulse 3.6s ease-in-out infinite; }
  .gp-breathe { animation: gp-breathe 6.5s ease-in-out infinite; }

  .gp-step-0 { animation: gp-step-0 ${CYCLE.process}s ease-out infinite; }
  .gp-step-1 { animation: gp-step-1 ${CYCLE.process}s ease-out infinite; }
  .gp-step-2 { animation: gp-step-2 ${CYCLE.process}s ease-out infinite; }
  .gp-step-3 { animation: gp-step-3 ${CYCLE.process}s ease-out infinite; }
  .gp-unknown { animation: gp-unknown 4.5s ease-in-out infinite; }

  .gp-beam { animation: gp-beam ${CYCLE.balance}s cubic-bezier(0.45, 0, 0.35, 1) infinite; }
  .gp-weigh-left { animation: gp-weigh-left ${CYCLE.balance}s ease-in-out infinite; }
  .gp-weigh-right { animation: gp-weigh-right ${CYCLE.balance}s ease-in-out infinite; }

  .gp-module { animation: gp-module ${CYCLE.socket}s cubic-bezier(0.4, 0, 0.25, 1) infinite; }
  .gp-contacts { animation: gp-contacts ${CYCLE.socket}s ease-out infinite; }
  .gp-latch { animation: gp-latch ${CYCLE.socket}s ease-out infinite; }

  .gp-loupe { animation: gp-loupe ${CYCLE.inspect}s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
  .gp-mark-0 { animation: gp-mark-0 ${CYCLE.inspect}s cubic-bezier(0.34, 1.35, 0.5, 1) infinite; }
  .gp-mark-1 { animation: gp-mark-1 ${CYCLE.inspect}s cubic-bezier(0.34, 1.35, 0.5, 1) infinite; }
  .gp-mark-2 { animation: gp-mark-2 ${CYCLE.inspect}s cubic-bezier(0.34, 1.35, 0.5, 1) infinite; }
  .gp-mark-3 { animation: gp-mark-3 ${CYCLE.inspect}s cubic-bezier(0.34, 1.35, 0.5, 1) infinite; }
  .gp-mark-4 { animation: gp-mark-4 ${CYCLE.inspect}s cubic-bezier(0.34, 1.35, 0.5, 1) infinite; }

  .gp-layer-0 { animation: gp-layer-0 ${CYCLE.assembly}s cubic-bezier(0.45, 0, 0.35, 1) infinite; }
  .gp-layer-1 { animation: gp-layer-1 ${CYCLE.assembly}s cubic-bezier(0.45, 0, 0.35, 1) infinite; }
  .gp-layer-2 { animation: gp-layer-2 ${CYCLE.assembly}s cubic-bezier(0.45, 0, 0.35, 1) infinite; }
  .gp-layer-3 { animation: gp-layer-3 ${CYCLE.assembly}s cubic-bezier(0.45, 0, 0.35, 1) infinite; }
  .gp-tie { animation: gp-tie ${CYCLE.assembly}s ease-in-out infinite; }

  .gp-scan { animation: gp-scan ${CYCLE.gates}s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .gp-gate-0 { animation: gp-gate-0 ${CYCLE.gates}s ease-out infinite; }
  .gp-gate-1 { animation: gp-gate-1 ${CYCLE.gates}s ease-out infinite; }
  .gp-open { animation: gp-open ${CYCLE.gates}s ease-in-out infinite; }

  .gp-col-0 { animation: gp-col-0 ${CYCLE.erase}s ease-out infinite; }
  .gp-col-1 { animation: gp-col-1 ${CYCLE.erase}s ease-out infinite; }
  .gp-col-2 { animation: gp-col-2 ${CYCLE.erase}s ease-out infinite; }
  .gp-sweep { animation: gp-sweep ${CYCLE.erase}s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .gp-stamp { animation: gp-stamp ${CYCLE.erase}s cubic-bezier(0.34, 1.35, 0.5, 1) infinite; }
}

/* A scale or a translate needs a box to be relative to, and on an SVG element
   the default is the whole viewport rather than the shape. The beam is the one
   exception: it turns about a point in the drawing, not about its own centre. */
.gp-mark, .gp-stamp, .gp-pulse { transform-box: fill-box; transform-origin: center; }
`;

/**
 * The plates' stylesheet, emitted once per page.
 *
 * Kept out of GuidePlate itself because the hub renders eight of them: eight
 * identical copies of four kilobytes of keyframes is thirty kilobytes of HTML
 * to say the same thing eight times. A page that renders a plate renders this
 * beside it.
 */
export function GuidePlateStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export default function GuidePlate({
  slug,
  cluster,
  className = "",
  frame = true,
}: {
  slug: string;
  /** Fallback when a guide has no plate of its own yet. */
  cluster: Cluster;
  className?: string;
  /** The corner frame. On the hub each plate is a drawing in a folder; behind
      an article's heading it is the room the type sits in, and a frame there
      would box off a corner of the page. */
  frame?: boolean;
}) {
  /* One gradient namespace per plate. Two SVGs on one page sharing a gradient
     id is a rendering bug waiting for the second one, and the hub puts eight
     of these in one document. */
  const plateId = `gp-${slug}`;
  const draw = plates[slug] ?? ((id: string) => clusterDrawings[cluster](id));

  return (
    /*
     * `relative` only where the frame needs it.
     *
     * It used to be unconditional, and a caller that positions the plate
     * itself passes `absolute` — two position utilities in the same Tailwind
     * layer, where the stylesheet's order decides and the class attribute's
     * does not. `relative` won, so the drawing behind an article's heading
     * became a block at the top of the section and pushed the heading down a
     * screen. The frame is the only thing that needs a containing block.
     */
    <div className={`${frame ? "relative " : ""}${className}`}>
      {frame && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-white/10"
          style={{
            clipPath:
              "polygon(0 0, 34% 0, 34% 1.5px, 1.5px 1.5px, 1.5px 34%, 0 34%, 0 66%, 1.5px 66%, 1.5px calc(100% - 1.5px), 34% calc(100% - 1.5px), 34% 100%, 0 100%)",
          }}
        />
      )}
      <svg
        viewBox="0 0 224 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        aria-hidden="true"
        focusable="false"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <PlateDefs id={plateId} />
        {/*
         * No glow behind the object.
         *
         * The index plates carry one because each sits alone in its own card
         * with a frame round it, and the light is what fills the card. Eight of
         * these run down one list on the same background, and the gradient's
         * falloff reaches zero inside its own shape — so what filled a card
         * read here as eight soft-edged discs stacked in a column. The row is
         * the room; the drawing does not need to bring its own.
         */}
        {draw(plateId)}
      </svg>
    </div>
  );
}
