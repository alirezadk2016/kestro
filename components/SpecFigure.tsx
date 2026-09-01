import type { Lang } from "@/lib/i18n";

/*
 * The component behind a line in the spec list.
 *
 * A buyer reading "16 GB RAM" is reading a number. This is the part the number
 * is about: a module drawn close enough that the chips, the gold fingers and
 * the notch are all there, tilted in real perspective so it sits in the page
 * rather than on it.
 *
 * Inline SVG and CSS transforms, not WebGL. The homepage is the one page where
 * weight actually costs a customer, three.js is ~800 kB measured, and a canvas
 * would need JavaScript before it drew anything. This draws at any size, ships
 * inside the HTML, and is on screen before hydration — while `perspective` and
 * `rotate3d` give it genuine depth, because the browser composites the tilt on
 * the GPU for free.
 *
 * The gradients are suffixed with the kind rather than being shared, because
 * six of these are in the page at once and an SVG id is document-global: two
 * `#gold` would collapse into one. It also means every figure carries its own
 * defs and nothing depends on which one the browser parsed first.
 *
 * Motion is opt-in: the tilt and the trace pulse are removed entirely under
 * prefers-reduced-motion, and the figure still reads as a drawing of the part.
 */
export type SpecKind = "ram" | "ssd" | "keyboard" | "battery" | "tested" | "warranty";

/* Gold contact fingers along the bottom edge, with the keying notch. */
function fingers(kind: SpecKind, count: number, notchAt: number) {
  const out = [];
  for (let i = 0; i < count; i++) {
    if (i === notchAt || i === notchAt + 1) continue;
    out.push(
      <rect
        key={i}
        x={78 + i * 12.6}
        y={318}
        width={7.4}
        height={26}
        rx={1}
        fill={`url(#gold-${kind})`}
      />,
    );
  }
  return out;
}

/* One package: body, the sheen across its top face, silkscreen, pin-one dot. */
function chip(kind: SpecKind, x: number, y: number, key: string) {
  return (
    <g key={key}>
      <rect x={x} y={y} width={74} height={58} rx={3} fill={`url(#pkg-${kind})`} />
      <rect x={x} y={y} width={74} height={26} rx={3} fill={`url(#sheen-${kind})`} />
      <rect
        x={x}
        y={y}
        width={74}
        height={58}
        rx={3}
        className="fill-none stroke-[#2c3345]"
        strokeWidth={1}
      />
      <rect x={x + 8} y={y + 24} width={44} height={2.4} rx={1} className="fill-white/25" />
      <rect x={x + 8} y={y + 31} width={54} height={2.4} rx={1} className="fill-white/[0.14]" />
      <rect x={x + 8} y={y + 38} width={30} height={2.4} rx={1} className="fill-white/[0.14]" />
      <circle cx={x + 66} cy={y + 50} r={2.4} className="fill-white/25" />
    </g>
  );
}

/* Traces leaving the part, with a node where each one ends. The pulse is a
   stroke-dashoffset animation on a copy of the path, so nothing moves layout. */
function traces(paths: string[]) {
  return (
    <g className="stroke-brand-400" fill="none" strokeWidth={1.6} strokeLinecap="round">
      {paths.map((d) => (
        <path key={d} d={d} className="opacity-40" />
      ))}
      {paths.map((d) => (
        <path
          key={`p${d}`}
          d={d}
          className="spec-trace opacity-80"
          strokeDasharray="22 260"
          pathLength={280}
        />
      ))}
    </g>
  );
}

function node(cx: number, cy: number) {
  return (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={9} className="fill-brand-400/15" />
      <circle cx={cx} cy={cy} r={3.4} className="fill-brand-300" />
    </g>
  );
}

function figure(kind: SpecKind) {
  const pcb = `url(#pcb-${kind})`;

  switch (kind) {
    /* A DIMM, drawn from the contacts up: board, eight packages, SMD parts,
       label, notch. The one the spec list is actually talking about. */
    case "ram":
      return (
        <>
          {traces([
            "M760 150h74a14 14 0 0114 14v52",
            "M770 210h96",
            "M120 372H60a14 14 0 01-14-14v-44",
            "M150 400h-74",
          ])}
          {[node(848, 216), node(866, 210), node(46, 314), node(76, 400)]}

          <g className="spec-part" filter={`url(#drop-${kind})`}>
            <rect x={64} y={196} width={732} height={124} rx={5} fill={pcb} />
            <rect
              x={64}
              y={196}
              width={732}
              height={124}
              rx={5}
              className="fill-none stroke-[#39415a]"
              strokeWidth={1.2}
            />
            {/* Board edge highlight — one light source, upper left. */}
            <path d="M69 196h722" className="stroke-white/25" strokeWidth={1.4} fill="none" />
            <rect x={64} y={316} width={732} height={8} className="fill-[#0a0c12]" />
            {fingers(kind, 56, 22)}
            {/* Keying notch. */}
            <rect x={355} y={310} width={26} height={34} rx={2} className="fill-brand-950" />

            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => chip(kind, 96 + i * 84, 224, `c${i}`))}

            {/* Passives along the top edge. */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <rect
                key={`smd${i}`}
                x={104 + i * 70}
                y={204}
                width={13}
                height={7}
                rx={1}
                className="fill-[#4a5470]"
              />
            ))}

            {/* Label. */}
            <rect x={648} y={228} width={132} height={50} rx={2} className="fill-white/[0.9]" />
            <rect x={658} y={238} width={78} height={5} rx={2} className="fill-brand-950/70" />
            <rect x={658} y={249} width={104} height={4} rx={2} className="fill-brand-950/40" />
            <rect x={658} y={258} width={60} height={4} rx={2} className="fill-brand-950/40" />
          </g>
        </>
      );

    /* An M.2 2280 drive: single-sided, one controller, two NAND packages, the
       half-moon mounting cutout and the M-key notch. */
    case "ssd":
      return (
        <>
          {traces(["M700 176h90a14 14 0 0114 14v44", "M180 372H86a14 14 0 01-14-14v-40"])}
          {[node(818, 234), node(72, 318)]}

          <g className="spec-part" filter={`url(#drop-${kind})`}>
            <rect x={150} y={214} width={600} height={96} rx={4} fill={pcb} />
            <rect
              x={150}
              y={214}
              width={600}
              height={96}
              rx={4}
              className="fill-none stroke-[#39415a]"
              strokeWidth={1.2}
            />
            <path d="M154 214h592" className="stroke-white/25" strokeWidth={1.4} fill="none" />
            {/* Contact edge and M-key notch. */}
            {Array.from({ length: 22 }, (_, i) => (
              <rect
                key={i}
                x={160 + i * 8.4}
                y={214}
                width={4.6}
                height={22}
                fill={`url(#gold-${kind})`}
              />
            ))}
            <rect x={160} y={214} width={9} height={96} className="fill-brand-950" />
            {/* Mounting cutout. */}
            <circle cx={742} cy={262} r={13} className="fill-brand-950" />
            <circle
              cx={742}
              cy={262}
              r={13}
              className="fill-none stroke-[#39415a]"
              strokeWidth={1.2}
            />

            {chip(kind, 232, 232, "ctrl")}
            {chip(kind, 360, 232, "nand1")}
            {chip(kind, 488, 232, "nand2")}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={`s${i}`}
                x={240 + i * 72}
                y={296}
                width={12}
                height={6}
                rx={1}
                className="fill-[#4a5470]"
              />
            ))}
          </g>
        </>
      );

    /* The keys that actually change: æ, ø and å in their Nordic positions. */
    case "keyboard":
      return (
        <>
          {traces(["M726 168h64a14 14 0 0114 14v48", "M172 380H84a14 14 0 01-14-14v-46"])}
          {[node(818, 230), node(70, 320)]}

          <g className="spec-part" filter={`url(#drop-${kind})`}>
            <rect x={120} y={168} width={660} height={218} rx={10} fill={pcb} />
            <rect
              x={120}
              y={168}
              width={660}
              height={218}
              rx={10}
              className="fill-none stroke-[#39415a]"
              strokeWidth={1.2}
            />
            <path d="M130 168h640" className="stroke-white/25" strokeWidth={1.4} fill="none" />
            {[0, 1, 2, 3].map((row) =>
              Array.from({ length: 13 }, (_, col) => {
                const nordic = row === 1 && col > 9;
                return (
                  <g key={`k${row}-${col}`}>
                    <rect
                      x={140 + col * 48 + row * 6}
                      y={186 + row * 48}
                      width={40}
                      height={40}
                      rx={5}
                      className={nordic ? "fill-brand-500/35 stroke-brand-300" : "fill-[#171b26]"}
                      strokeWidth={nordic ? 1.4 : 0}
                    />
                    {/* The lit top face of the keycap, so the row reads as
                        moulded rather than as squares. */}
                    <rect
                      x={140 + col * 48 + row * 6}
                      y={186 + row * 48}
                      width={40}
                      height={16}
                      rx={5}
                      fill={`url(#sheen-${kind})`}
                    />
                  </g>
                );
              }),
            )}
            {/* The three keys the Nordic layout is about. */}
            <g className="fill-brand-100" fontSize="17" fontWeight="600" textAnchor="middle">
              <text x={646} y={218}>
                Æ
              </text>
              <text x={694} y={218}>
                Ø
              </text>
              <text x={742} y={218}>
                Å
              </text>
            </g>
            <rect x={296} y={378} width={230} height={30} rx={5} className="fill-[#171b26]" />
          </g>
        </>
      );

    /* A cell pack with the measured charge drawn as fill, not as a claim. */
    case "battery":
      return (
        <>
          {traces(["M700 158h90a14 14 0 0114 14v56", "M196 386H88a14 14 0 01-14-14v-44"])}
          {[node(818, 228), node(74, 328)]}

          <g className="spec-part" filter={`url(#drop-${kind})`}>
            <rect x={160} y={190} width={600} height={176} rx={10} fill={pcb} />
            <rect
              x={160}
              y={190}
              width={600}
              height={176}
              rx={10}
              className="fill-none stroke-[#39415a]"
              strokeWidth={1.2}
            />
            <path d="M170 190h580" className="stroke-white/25" strokeWidth={1.4} fill="none" />
            {[0, 1, 2].map((i) => (
              <g key={`cell${i}`}>
                <rect
                  x={184 + i * 190}
                  y={212}
                  width={166}
                  height={132}
                  rx={6}
                  className="fill-[#141926]"
                />
                {/* 87% of the cell, which is the figure the row states. */}
                <rect
                  x={184 + i * 190}
                  y={212 + 132 * 0.13}
                  width={166}
                  height={132 * 0.87}
                  rx={6}
                  className="fill-brand-500/30"
                />
                <rect
                  x={184 + i * 190}
                  y={212}
                  width={166}
                  height={44}
                  rx={6}
                  fill={`url(#sheen-${kind})`}
                />
                <rect
                  x={184 + i * 190}
                  y={212}
                  width={166}
                  height={132}
                  rx={6}
                  className="fill-none stroke-[#39415a]"
                  strokeWidth={1}
                />
                <rect
                  x={196 + i * 190}
                  y={198}
                  width={40}
                  height={14}
                  rx={3}
                  className="fill-[#4a5470]"
                />
              </g>
            ))}
          </g>
        </>
      );

    /* The test sheet, with the lines a real one carries. */
    case "tested":
      return (
        <>
          {traces(["M712 172h78a14 14 0 0114 14v46", "M188 384H86a14 14 0 01-14-14v-42"])}
          {[node(818, 232), node(72, 328)]}

          <g className="spec-part" filter={`url(#drop-${kind})`}>
            <rect x={182} y={150} width={520} height={266} rx={8} fill={pcb} />
            <rect
              x={182}
              y={150}
              width={520}
              height={266}
              rx={8}
              className="fill-none stroke-[#39415a]"
              strokeWidth={1.2}
            />
            <path d="M190 150h504" className="stroke-white/25" strokeWidth={1.4} fill="none" />
            <rect x={210} y={178} width={180} height={9} rx={4} className="fill-white/35" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={`l${i}`}>
                <rect
                  x={210}
                  y={214 + i * 32}
                  width={26}
                  height={20}
                  rx={4}
                  className="fill-brand-500/25 stroke-brand-300"
                  strokeWidth={1.2}
                />
                <path
                  d={`M216 ${224 + i * 32}l5 5 9-11`}
                  className="stroke-brand-200"
                  strokeWidth={1.8}
                  fill="none"
                />
                <rect
                  x={250}
                  y={220 + i * 32}
                  width={i % 2 ? 300 : 388}
                  height={6}
                  rx={3}
                  className="fill-white/[0.16]"
                />
              </g>
            ))}
          </g>
        </>
      );

    /* The quote, with the line where the warranty period is written. */
    case "warranty":
      return (
        <>
          {traces(["M712 172h78a14 14 0 0114 14v46", "M188 384H86a14 14 0 01-14-14v-42"])}
          {[node(818, 232), node(72, 328)]}

          <g className="spec-part" filter={`url(#drop-${kind})`}>
            <rect x={196} y={140} width={490} height={290} rx={8} fill={pcb} />
            <rect
              x={196}
              y={140}
              width={490}
              height={290}
              rx={8}
              className="fill-none stroke-[#39415a]"
              strokeWidth={1.2}
            />
            <path d="M204 140h474" className="stroke-white/25" strokeWidth={1.4} fill="none" />
            <rect x={224} y={170} width={150} height={9} rx={4} className="fill-white/35" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={`t${i}`}
                x={224}
                y={204 + i * 24}
                width={i === 4 ? 240 : 434}
                height={6}
                rx={3}
                className="fill-white/[0.14]"
              />
            ))}
            {/* The line that matters, drawn as the one that is filled in. */}
            <rect
              x={224}
              y={330}
              width={434}
              height={44}
              rx={5}
              className="fill-brand-500/20 stroke-brand-300"
              strokeWidth={1.3}
            />
            <rect x={242} y={347} width={126} height={8} rx={4} className="fill-brand-100/80" />
            <rect x={392} y={347} width={72} height={8} rx={4} className="fill-brand-100/45" />
            <rect x={224} y={392} width={300} height={6} rx={3} className="fill-white/[0.14]" />
          </g>
        </>
      );
  }
}

const caption: Record<SpecKind, Record<Lang, string>> = {
  ram: { da: "Modulet, tallet handler om", en: "The module the number is about" },
  ssd: { da: "M.2-drevet i maskinen", en: "The M.2 drive in the machine" },
  keyboard: { da: "Æ, Ø og Å på deres pladser", en: "Æ, Ø and Å where they belong" },
  battery: { da: "Målt kapacitet, ikke skønnet", en: "Measured capacity, not estimated" },
  tested: { da: "Gennemgangen før afsendelse", en: "The check before it ships" },
  warranty: { da: "Perioden, skrevet i tilbuddet", en: "The period, written in the quote" },
};

export default function SpecFigure({ kind, lang }: { kind: SpecKind; lang: Lang }) {
  return (
    <span className="spec-figure pointer-events-none block">
      {/* Cropped tight around the part: the machine is behind this, and a tall
          empty frame would push the drawing into the header on the first row. */}
      <svg
        viewBox="0 108 900 344"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="spec-svg w-full"
      >
        <defs>
          <radialGradient id={`spec-glow-${kind}`} cx="50%" cy="50%" r="52%">
            <stop offset="0%" stopColor="rgb(60,110,255)" stopOpacity="0.4" />
            <stop offset="55%" stopColor="rgb(40,74,190)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="rgb(40,74,190)" stopOpacity="0" />
          </radialGradient>

          {/* Gradients rather than flat fills: one light source from the upper
              left, so the board has a lit edge and the packages have a top
              face. It is what separates a drawing of a part from a part. */}
          <linearGradient id={`pcb-${kind}`} x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor="#1d2433" />
            <stop offset="18%" stopColor="#11151f" />
            <stop offset="100%" stopColor="#070910" />
          </linearGradient>
          <linearGradient id={`pkg-${kind}`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#2a2f3d" />
            <stop offset="22%" stopColor="#14171f" />
            <stop offset="100%" stopColor="#080a0f" />
          </linearGradient>
          <linearGradient id={`gold-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4d98a" />
            <stop offset="35%" stopColor="#d8b25a" />
            <stop offset="100%" stopColor="#8a6c2c" />
          </linearGradient>
          <linearGradient id={`sheen-${kind}`} x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id={`drop-${kind}`} x="-25%" y="-25%" width="150%" height="160%">
            <feDropShadow
              dx="0"
              dy="16"
              stdDeviation="18"
              floodColor="#020510"
              floodOpacity="0.8"
            />
          </filter>
        </defs>

        {/* Its own surface, so the drawing reads as a panel held over the
            machine rather than as lines mixed into the photograph. */}
        <rect
          x="18"
          y="118"
          width="864"
          height="324"
          rx="14"
          className="fill-[#070c1a] stroke-brand-400/30"
          strokeWidth="1.4"
        />
        <rect x="18" y="118" width="864" height="324" rx="14" fill={`url(#spec-glow-${kind})`} />

        {/* Concentric rings, the way a service diagram frames the part it is
            calling out. */}
        <g className="stroke-brand-400/20" fill="none">
          <circle cx="450" cy="272" r="132" />
          <circle cx="450" cy="272" r="172" strokeDasharray="3 9" />
          <circle cx="450" cy="272" r="210" className="stroke-brand-400/10" />
        </g>
        {figure(kind)}
        <text
          x="450"
          y="424"
          textAnchor="middle"
          className="fill-brand-200"
          fontSize="15"
          fontWeight="600"
          letterSpacing="1.6"
        >
          {caption[kind][lang].toUpperCase()}
        </text>
      </svg>
    </span>
  );
}
