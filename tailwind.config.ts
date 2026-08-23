import type { Config } from "tailwindcss";

/*
 * Ink, paper and one accent.
 *
 * The palette used to be Tailwind's indigo tints under a blue-700 — two hue
 * families pretending to be one ramp, on pure white. Everything read as a
 * default template. This is a deliberate scheme instead: near-black carries
 * the brand, a warm off-white replaces flat white, and a single rust accent
 * does the signalling. Restrained is what Danish B2B actually looks like.
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

        /** One signal colour: workshop rust. Used sparingly, never as fill. */
        accent: {
          50: "#fdf5f0",
          100: "#fae5d8",
          200: "#f3c6ac",
          300: "#e79f77",
          400: "#d97742",
          500: "#c85c26",
          600: "#a8481c",
          700: "#86391a",
          800: "#6a2f1a",
          900: "#552817",
        },

        /*
         * Kept so existing pages keep compiling; brand now points at ink so
         * nothing renders in the old mismatched blue.
         */
        brand: {
          50: "#f4f4f2",
          100: "#e6e6e2",
          200: "#cbcbc5",
          300: "#a5a59c",
          400: "#77776d",
          500: "#3d3d36",
          600: "#1c1c19",
          700: "#121210",
          800: "#0a0a09",
          900: "#0a0a09",
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
