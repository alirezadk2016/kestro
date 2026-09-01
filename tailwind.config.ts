import type { Config } from "tailwindcss";

/*
 * The palette from the brand board.
 *
 * #1E40FF and #3B82F6 are the blues, #0B1426 the dark surface and the text,
 * #6B7280 the secondary text, #F3F4F6 the light neutral. Everything else here
 * is a step between those, so a tint always comes from the identity rather
 * than from a second hue.
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

        /*
         * Cool neutrals, anchored on the two the brand board names: #0B1426
         * for text and dark surfaces, #6B7280 for secondary text. The warm
         * near-black that was here belonged to the older paper-and-ink
         * direction and reads yellow next to the blue.
         */
        ink: {
          50: "#F7F8FA",
          100: "#EFF1F4",
          200: "#E3E6EC",
          300: "#C6CBD4",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1E293B",
          900: "#0B1426",
          950: "#060B16",
        },

        /** The board's light neutral, plus a step either side of it. */
        paper: {
          DEFAULT: "#FFFFFF",
          dim: "#F3F4F6",
          edge: "#E3E6EC",
        },

        /*
         * The brand board's two blues, as a ramp.
         *
         * 600 is #1E40FF, the primary — buttons, the mark, anything that has
         * to be unmistakably Kestro. 500 is #3B82F6, the lighter blue the logo
         * gradient runs to. 950 is #0B1426, the dark surface the whole site
         * sits on. The rest are steps between, so a tint has somewhere to come
         * from without inventing a second hue.
         */
        brand: {
          50: "#EEF2FF",
          100: "#DCE4FE",
          200: "#BECFFD",
          300: "#93AEFB",
          400: "#6690F9",
          500: "#3B82F6",
          600: "#1E40FF",
          700: "#1A36D6",
          800: "#182FA8",
          900: "#16296F",
          950: "#0B1426",
        },
      },
      /* One family, as the brand board specifies. It carries the wordmark
         too, so headings set in it match the logo beside them. */
      fontFamily: {
        /* "Jakarta Fallback" is the metric-matched stand-in defined in
           globals.css. It has to sit between the real face and system-ui in
           every stack, or the page renders in un-adjusted metrics until the
           font loads and then reflows. */
        sans: ["var(--font-sans)", "Jakarta Fallback", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "Jakarta Fallback", "system-ui", "sans-serif"],
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
