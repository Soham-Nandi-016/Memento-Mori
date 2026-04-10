/** @type {import('tailwindcss').Config} */

/* ─── Stitch Design DNA — project/903551207934110541 ─── */
const stitch = {
  /* Surfaces */
  background:        "#0c1324",
  surface:           "#0c1324",
  surfaceLowest:     "#070d1f",
  surfaceLow:        "#151b2d",
  surfaceContainer:  "#191f31",
  surfaceHigh:       "#23293c",
  surfaceHighest:    "#2e3447",
  surfaceVariant:    "#2e3447",
  surfaceBright:     "#33394c",
  /* Primary (Electric Cyan — Logic) */
  primary:           "#dbfcff",
  primaryContainer:  "#00f0ff",
  primaryFixed:      "#7df4ff",
  primaryFixedDim:   "#00dbe9",
  onPrimary:         "#00363a",
  surfaceTint:       "#00dbe9",
  /* Secondary (Violet — Soul) */
  secondary:         "#e9b3ff",
  secondaryContainer:"#7d01b1",
  onSecondary:       "#510074",
  onSecondaryContainer: "#e5a9ff",
  /* Tertiary */
  tertiary:          "#f4f5ff",
  tertiaryContainer: "#c8daff",
  /* Text */
  onSurface:         "#dce1fb",
  onSurfaceVariant:  "#b9cacb",
  onBackground:      "#dce1fb",
  /* Outline */
  outline:           "#849495",
  outlineVariant:    "#3b494b",
  /* Error */
  error:             "#ffb4ab",
  errorContainer:    "#93000a",
  /* Overrides */
  accentCyan:        "#00F0FF",
  accentViolet:      "#BF5AF2",
  accentBlue:        "#0A84FF",
  neutralDeep:       "#020617",
};

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: stitch,
      fontFamily: {
        sans:  ["Inter",           "system-ui", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
        label: ["Space Grotesk",   "sans-serif"],
      },
      borderRadius: {
        /* Stitch roundness: ROUND_EIGHT — xl = 24px */
        xl2: "1.5rem",   /* 24px — major containers (mandatory) */
        xl:  "1rem",
        lg:  "0.5rem",
        sm:  "0.25rem",
      },
      boxShadow: {
        /* Stitch elevation spec */
        float:      "0 20px 40px -10px rgba(0, 219, 233, 0.08)",
        "glow-cyan": "0 0 28px rgba(0, 240, 255, 0.30), 0 8px 20px rgba(0, 240, 255, 0.12)",
        "glow-violet": "0 0 28px rgba(191, 90, 242, 0.25), 0 8px 20px rgba(191, 90, 242, 0.10)",
        glass:      "inset 0 0 0 1px rgba(59, 73, 75, 0.15)",
      },
      backdropBlur: { xl2: "24px" },
      animation: {
        "float":     "float-up 7s ease-in-out infinite",
        "node":      "node-breathe 3.5s ease-in-out infinite",
        "scanline":  "scanline-drift 10s linear infinite",
      },
      keyframes: {
        "float-up": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "node-breathe": {
          "0%, 100%": { transform: "scale(1)",    opacity: "0.7" },
          "50%":      { transform: "scale(1.06)", opacity: "1"   },
        },
        "scanline-drift": {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};
