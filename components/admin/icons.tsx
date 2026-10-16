/**
 * The panel's icons, drawn here rather than installed.
 *
 * An icon package would be a dependency, a bundle and a licence for eleven
 * shapes that never change. These are one stroke width, one grid and one
 * corner treatment, which is the part that actually makes a set look like a
 * set — a mixed-weight pile of icons from three sources is the single fastest
 * way to make an interface look assembled rather than designed.
 *
 * Every one is aria-hidden by default: each sits beside a visible label, so
 * announcing it again would only make a screen reader say everything twice.
 */
type IconProps = { className?: string };

const base = "h-[18px] w-[18px] flex-none";

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? base}
    >
      {children}
    </svg>
  );
}

export const GaugeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 17a9 9 0 1 1 17 0" />
    <path d="m12 13 4-3.5" />
    <circle cx="12" cy="14" r="1.4" />
  </Svg>
);

export const InboxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 13h4l1.5 3h5L16 13h4" />
    <path d="M4.5 13 6 5h12l1.5 8v5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" />
  </Svg>
);

export const PulseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h3.5l2-6 3.5 12 2.5-8 1.5 2H21" />
  </Svg>
);

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" />
  </Svg>
);

export const DeviceIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="12" height="9" rx="1" />
    <path d="M2 17h11" />
    <rect x="16.5" y="9" width="5.5" height="10" rx="1" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </Svg>
);

export const SendIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 4 3.5 10.5l6.5 2.5 2.5 6.5z" />
    <path d="m10 13 10-9" />
  </Svg>
);

export const ArchiveIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="4" rx="1" />
    <path d="M5 8.5v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-10M10 12.5h4" />
  </Svg>
);

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5" />
  </Svg>
);

export const LogoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4" />
    <path d="M15.5 8.5 19 12l-3.5 3.5M19 12H9" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Svg>
);

export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4.5 21 19.5H3z" />
    <path d="M12 10.5v4M12 17.2v.1" />
  </Svg>
);

export const PagesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.5 3.5h7L19 8v11a1 1 0 0 1-1 1H7.5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
    <path d="M14 3.5V8h4.5M9.5 12.5h6M9.5 16h4" />
  </Svg>
);

export const ExitIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V6.5a1 1 0 0 1 .8-1l8-1.6a1 1 0 0 1 1.2 1V20" />
    <path d="M3 20h18M11 12.5v.1" />
  </Svg>
);
