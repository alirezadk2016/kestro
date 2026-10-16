import type { Cluster } from "@/lib/guides";

/*
 * The cluster marks — tier 1 of the visual system.
 *
 * Four drawings, one per cluster, in the language of an engineering document:
 * orthographic, thin stroke, no fill beyond a wash, one implied light source.
 * They carry depth through layering and scale rather than through gradients or
 * shadow, which is what keeps them from reading as decoration.
 *
 * Inline SVG on purpose. It costs about a kilobyte, needs no request, scales to
 * any viewport without a second asset, inherits currentColor so it follows the
 * theme, and — unlike a canvas — is there before JavaScript is. The blueprint's
 * tier 3 (WebGL, ~800 kB measured) would buy nothing here: nothing about a
 * cluster needs rotating.
 *
 * Every mark is aria-hidden. The cluster is named in text beside it; a screen
 * reader gaining "abstract drawing of stacked planes" would be noise.
 */
const marks: Record<Cluster, React.ReactNode> = {
  /* Memory: two boards, one behind the other, notch and contacts implied. */
  "memory-storage": (
    <>
      <rect x="10" y="30" width="76" height="20" className="fill-brand-400/5" />
      <rect x="10" y="30" width="76" height="20" />
      <path d="M44 50v4M52 50v4" />
      <rect x="16" y="35" width="12" height="10" />
      <rect x="34" y="35" width="12" height="10" />
      <rect x="52" y="35" width="12" height="10" />
      <rect x="70" y="35" width="10" height="10" />
      <rect x="18" y="54" width="76" height="20" className="fill-brand-400/10" />
      <rect x="18" y="54" width="76" height="20" />
      <path d="M24 74v3M32 74v3M40 74v3M48 74v3M56 74v3M64 74v3M72 74v3M80 74v3" />
    </>
  ),
  /* Lifecycle: a bar of time, a marked cut-off, and what follows it. */
  lifecycle: (
    <>
      <path d="M8 68h88" />
      <path d="M8 62v12M96 62v12" />
      <rect x="8" y="44" width="40" height="18" className="fill-brand-400/10" />
      <rect x="8" y="44" width="40" height="18" />
      <path d="M56 26v42" className="stroke-brand-300" />
      <path d="M52 30l4-6 4 6" className="stroke-brand-300" />
      <rect x="64" y="44" width="32" height="18" strokeDasharray="3 3" />
      <circle cx="56" cy="68" r="3" className="fill-brand-300 stroke-brand-300" />
    </>
  ),
  /* Workplace: one machine feeding two panels and a line out. */
  "workplace-hardware": (
    <>
      <rect x="10" y="52" width="30" height="18" className="fill-brand-400/5" />
      <rect x="10" y="52" width="30" height="18" />
      <path d="M6 70h38" />
      <rect x="52" y="24" width="40" height="26" className="fill-brand-400/10" />
      <rect x="52" y="24" width="40" height="26" />
      <path d="M72 50v8M62 58h20" />
      <rect x="52" y="62" width="18" height="12" strokeDasharray="3 3" />
      <path d="M40 60h12" className="stroke-brand-300" />
      <path d="M46 44h6a4 4 0 014 4v8" className="stroke-brand-300" />
    </>
  ),
  /* Buying and condition: an object under inspection, one detail enlarged. */
  "buying-condition": (
    <>
      <rect x="12" y="34" width="46" height="32" className="fill-brand-400/5" />
      <rect x="12" y="34" width="46" height="32" />
      <path d="M12 58h46" />
      <circle cx="70" cy="42" r="16" className="fill-brand-400/10" />
      <circle cx="70" cy="42" r="16" className="stroke-brand-300" />
      <path d="M82 54l10 12" className="stroke-brand-300" />
      <path d="M63 42l5 5 9-10" className="stroke-brand-300" />
    </>
  ),
  /* Outside the clusters: an object set aside. */
  "uden-klynge": (
    <>
      <rect x="14" y="38" width="40" height="26" strokeDasharray="3 3" />
      <path d="M62 51h28" strokeDasharray="3 3" />
      <circle cx="90" cy="51" r="3" strokeDasharray="0" />
    </>
  ),
};

export default function ClusterMark({
  cluster,
  className = "",
}: {
  cluster: Cluster;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 104 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {marks[cluster]}
    </svg>
  );
}
