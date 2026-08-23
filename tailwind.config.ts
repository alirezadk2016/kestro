import type { Config } from "tailwindcss";

/*
 * Blue, ink and paper.
 *
 * Blue is the brand — it always was, and it belongs to a hardware company in
 * the Nordics. What was wrong before was not the hue but the ramp: indigo
 * tints under a blue-700, on flat screen-white. Here it is one coherent blue,
 * a warm off-white instead of pure white, and a near-black neutral for text.
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        /** Near-black with a warm cast — the primary brand colour. */
        ink: {
          50: "#f4f4f2",
          100: "#e6e6e2",
          200: "#cbcbc5",
          300: "#a5a59c",
          400: "#77776d",
          500: "#55554c",
          600: "#3d3d36",
          700: "#2b2b26",
          800: "#1c1c19",
          900: "#121210",
          950: "#0a0a09",
        },

        /** Warm off-white. Paper, not screen-white. */
        paper: {
          DEFAULT: "#faf9f6",
          dim: "#f2f0eb",
          edge: "#e4e1d9",
        },

        /*
         * One blue, one hue, all the way through. The old ramp mixed indigo
         * tints under a blue-700 — two families pretending to be one, which is
         * what made it look unconsidered. This is a single deep royal blue:
         * 600 carries buttons and marks, 950 is the dark surface, and the
         * light steps are genuinely the same colour with light added.
         */
        brand: {
          50: "#eef2fd",
          100: "#dce4fa",
          200: "#bccbf6",
          300: "#93a9ef",
          400: "#6580e5",
          500: "#4159d9",
          600: "#2843c4",
          700: "#2237a1",
          800: "#203180",
          900: "#1d2b62",
          950: "#111a3c",
        },

        /* Accent points at the brand so highlights stay in the same hue. */
        accent: {
          50: "#eef2fd",
          100: "#dce4fa",
          200: "#bccbf6",
          300: "#93a9ef",
          400: "#6580e5",
          500: "#4159d9",
          600: "#2843c4",
          700: "#2237a1",
          800: "#203180",
          900: "#1d2b62",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.035em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,18,16,0.04), 0 8px 24px -12px rgba(18,18,16,0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
