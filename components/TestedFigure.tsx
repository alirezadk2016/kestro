/*
 * The diagnostic pass, running.
 *
 * The row beside this says the machine was tested and prepared before it was
 * sent. This is that sentence happening: a list of checks, one being run at a
 * time, each one finishing before the next begins, and the whole pass ending
 * with the line that the machine is ready to ship.
 *
 * Every frame of it is CSS. There is no state, no effect and no client bundle
 * — the keyframes are generated from the timings below and emitted with the
 * markup, so the figure animates in a server component and costs nothing to
 * hydrate. It also means the whole thing is one declarative timeline rather
 * than five timers that can fall out of step.
 */

/** Seconds. One item is scanned for ACTIVE and the next starts a STEP later,
    so there is a beat between the check landing and the next scan opening. */
const STEP = 1.15;
const ACTIVE = 0.85;
const HOLD = 1.1;
const FADE = 0.75;

const ITEMS = [
  "Skærm & pixels",
  "Tastatur & trackpad",
  "Porte & forbindelser",
  "Kamera & lyd",
  "Hardware & ydelse",
];

const DONE_AT = ITEMS.length * STEP;
const CYCLE = DONE_AT + HOLD + FADE;
const RESET_AT = DONE_AT + HOLD;

/** A moment on the timeline as a keyframe percentage. */
const at = (seconds: number) => `${((seconds / CYCLE) * 100).toFixed(3)}%`;

/* Geometry, in the figure's own units. The panel keeps the position and size
   the static sheet had, so replacing it moves nothing else in the scene. */
const PANEL = { x: 182, y: 150, w: 520, h: 266 };
const ROW = { top: 206, height: 40, left: 206, right: 678 };
const rowTop = (i: number) => ROW.top + i * ROW.height;

const ACCENT = "#6690F9";
const ACCENT_SOFT = "#3B82F6";

function keyframes(): string {
  const rules: string[] = [];

  ITEMS.forEach((_, i) => {
    const t0 = i * STEP;
    const t1 = t0 + ACTIVE;

    /* The row itself: dim until its turn, lit from the moment it starts. */
    rules.push(`
@keyframes st-row-${i} {
  0%, ${at(t0)} { opacity: 0.55; }
  ${at(t0 + 0.12)}, ${at(RESET_AT)} { opacity: 1; }
  100% { opacity: 0.55; }
}`);

    /* The scanning light, crossing the row once. */
    rules.push(`
@keyframes st-scan-${i} {
  0%, ${at(t0)} { opacity: 0; transform: translateX(0); }
  ${at(t0 + 0.08)} { opacity: 0.85; }
  ${at(t1 - 0.1)} { opacity: 0.85; }
  ${at(t1)} { opacity: 0; transform: translateX(${ROW.right - ROW.left - 60}px); }
  100% { opacity: 0; transform: translateX(0); }
}`);

    /* The glow under the row, brightest for the instant the check lands. */
    rules.push(`
@keyframes st-glow-${i} {
  0%, ${at(t0)} { opacity: 0; }
  ${at(t0 + 0.1)} { opacity: 0.5; }
  ${at(t1)} { opacity: 1; }
  ${at(t1 + 0.25)} { opacity: 0.38; }
  ${at(RESET_AT)} { opacity: 0.38; }
  100% { opacity: 0; }
}`);

    /* The mark: a quick overshoot rather than a fade, so it reads as landing
       rather than as appearing. */
    rules.push(`
@keyframes st-check-${i} {
  0%, ${at(t1)} { opacity: 0; transform: scale(0.55); }
  ${at(t1 + 0.13)} { opacity: 1; transform: scale(1.14); }
  ${at(t1 + 0.26)} { opacity: 1; transform: scale(1); }
  ${at(RESET_AT)} { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1); }
}`);

    /* The three signal dots, only while this row is the one being read. */
    rules.push(`
@keyframes st-dots-${i} {
  0%, ${at(t0)} { opacity: 0; }
  ${at(t0 + 0.1)}, ${at(t1 - 0.05)} { opacity: 1; }
  ${at(t1)}, 100% { opacity: 0; }
}`);
  });

  rules.push(`
@keyframes st-banner {
  0%, ${at(DONE_AT)} { opacity: 0; }
  ${at(DONE_AT + 0.22)} { opacity: 1; }
  ${at(RESET_AT)} { opacity: 1; }
  100% { opacity: 0; }
}`);

  /* The dots' own blink, fast and independent of the pass. */
  rules.push(`
@keyframes st-blink {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}`);

  return rules.join("\n");
}

const css = `
${keyframes()}

/*
 * Nothing moves unless motion is welcome. Without the query the figure resolves
 * to its finished state — every check landed and the ready line showing — which
 * is the thing it is there to say, held still.
 */
.st-row, .st-scan, .st-glow, .st-check, .st-dots, .st-banner { opacity: 1; }
.st-scan { opacity: 0; }
.st-glow { opacity: 0.3; }

@media (prefers-reduced-motion: no-preference) {
  ${ITEMS.map(
    (_, i) => `
  .st-row-${i} { animation: st-row-${i} ${CYCLE}s linear infinite; }
  .st-scan-${i} { animation: st-scan-${i} ${CYCLE}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  .st-glow-${i} { animation: st-glow-${i} ${CYCLE}s ease-out infinite; }
  .st-check-${i} { animation: st-check-${i} ${CYCLE}s cubic-bezier(0.34, 1.4, 0.5, 1) infinite; }
  .st-dots-${i} { animation: st-dots-${i} ${CYCLE}s linear infinite; }`,
  ).join("")}
  .st-banner { animation: st-banner ${CYCLE}s linear infinite; }
  .st-blink { animation: st-blink 1.1s ease-in-out infinite; }
}

/* Scale and translate need a box to be relative to, and on an SVG element the
   default is the whole viewport rather than the shape. */
.st-check, .st-scan { transform-box: fill-box; transform-origin: center; }
`;

export default function TestedFigure() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <defs>
        <linearGradient id="st-scan-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ACCENT_SOFT} stopOpacity="0" />
          <stop offset="70%" stopColor={ACCENT} stopOpacity="0.5" />
          <stop offset="100%" stopColor="#DCE6FF" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="st-glow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ACCENT_SOFT} stopOpacity="0.16" />
          <stop offset="100%" stopColor={ACCENT_SOFT} stopOpacity="0" />
        </linearGradient>
        <clipPath id="st-rows">
          <rect x={ROW.left} y={ROW.top} width={ROW.right - ROW.left} height={ITEMS.length * ROW.height} />
        </clipPath>
      </defs>

      <g className="spec-part" filter={"url(#spec-drop)"}>
        {/* The instrument's own panel, in the same surface and the same thin
            border the other five figures are drawn on. */}
        <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={8} fill="#111726" />
        <rect
          x={PANEL.x}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          rx={8}
          fill="none"
          stroke="#39415a"
          strokeWidth={1.2}
        />
        <path d={`M${PANEL.x + 8} ${PANEL.y}H${PANEL.x + PANEL.w - 8}`} stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth={1.4} fill="none" />

        <text
          x={ROW.left}
          y={182}
          className="fill-brand-200"
          fontSize="14"
          fontWeight="700"
          letterSpacing="2.2"
        >
          SYSTEMTEST
        </text>
        {/* The instrument's own pulse, beside its name. */}
        <g className="st-blink">
          <circle cx={ROW.left + 122} cy={177} r={3.5} fill={ACCENT} />
        </g>

        {/*
         * The line that closes the pass, on the heading row.
         *
         * It was under the last check, one line above the figure's own caption
         * — "KLAR TIL AFSENDELSE" stacked directly on "GENNEMGANGEN FØR
         * AFSENDELSE", two near-identical sentences touching. Up here it reads
         * as the instrument's verdict rather than as a repeat of the label
         * beneath it.
         */}
        <g className="st-banner">
          <text
            x={ROW.right}
            y={182}
            textAnchor="end"
            className="fill-brand-200"
            fontSize="13"
            fontWeight="700"
            letterSpacing="1.8"
          >
            KLAR TIL AFSENDELSE
          </text>
        </g>
        <path d={`M${ROW.left} 194H${ROW.right}`} stroke="#39415a" strokeWidth={1} fill="none" />

        <g clipPath="url(#st-rows)">
          {ITEMS.map((item, i) => {
            const top = rowTop(i);
            const mid = top + ROW.height / 2;
            return (
              <g key={item}>
                {/* The glow under the row being read. */}
                <rect
                  className={`st-glow st-glow-${i}`}
                  x={ROW.left}
                  y={top + 2}
                  width={ROW.right - ROW.left}
                  height={ROW.height - 4}
                  fill="url(#st-glow-grad)"
                />

                <g className={`st-row st-row-${i}`}>
                  {/* The square diagnostic cell on the left. */}
                  <rect
                    x={ROW.left + 2}
                    y={mid - 11}
                    width={22}
                    height={22}
                    rx={4}
                    fill="rgb(59 130 246 / 0.12)"
                    stroke={ACCENT}
                    strokeOpacity="0.55"
                    strokeWidth={1.1}
                  />
                  <rect x={ROW.left + 9} y={mid - 4} width={8} height={8} rx={1.5} fill={ACCENT} fillOpacity="0.75" />

                  <text x={ROW.left + 38} y={mid + 6} className="fill-paper/85" fontSize="19" fontWeight="500">
                    {item}
                  </text>

                  {/* Signal dots while this row is the one being read. */}
                  <g className={`st-dots st-dots-${i}`}>
                    {[0, 1, 2].map((d) => (
                      <circle
                        key={d}
                        cx={ROW.right - 62 + d * 11}
                        cy={mid}
                        r={2.6}
                        fill={ACCENT}
                        opacity={0.3 + d * 0.25}
                      />
                    ))}
                  </g>

                  {/* The mark. Blue, like everything else here. */}
                  <g className={`st-check st-check-${i}`}>
                    <circle cx={ROW.right - 14} cy={mid} r={11} fill="rgb(59 130 246 / 0.16)" stroke={ACCENT} strokeOpacity="0.6" strokeWidth={1.1} />
                    <path
                      d={`M${ROW.right - 19.5} ${mid} l4 4 7.5 -8.5`}
                      stroke="#C9D8FF"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                </g>

                {/* The scanning light crossing the row. */}
                <rect
                  className={`st-scan st-scan-${i}`}
                  x={ROW.left}
                  y={top + 3}
                  width={60}
                  height={ROW.height - 6}
                  fill="url(#st-scan-grad)"
                />

                {i < ITEMS.length - 1 && (
                  <path
                    d={`M${ROW.left} ${top + ROW.height}H${ROW.right}`}
                    stroke="#FFFFFF"
                    strokeOpacity="0.07"
                    strokeWidth={1}
                    fill="none"
                  />
                )}
              </g>
            );
          })}
        </g>

      </g>
    </>
  );
}
