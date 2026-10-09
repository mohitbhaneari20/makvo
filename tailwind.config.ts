import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        sunk: "rgb(var(--sunk) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        mute: "rgb(var(--mute) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        ok: "rgb(var(--ok) / <alpha-value>)",
        hi: "rgb(var(--hi) / <alpha-value>)",
        btn: "rgb(var(--btn) / <alpha-value>)",
        "btn-fg": "rgb(var(--btn-fg) / <alpha-value>)",
        // Fixed brand colours (do not flip with theme)
        midnight: "#001F3F",
        praxeti: "#F6F7ED",
        spring: "#DBE64C",
        mantis: "#74C365",
        forest: "#00804C",
        nuit: "#1E488F",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(3rem, 8.4vw, 8rem)", { lineHeight: "0.94", letterSpacing: "-0.045em", fontWeight: "500" }],
        h1: ["clamp(2.25rem, 4.6vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.035em", fontWeight: "500" }],
        h2: ["clamp(1.6rem, 2.6vw, 2.25rem)", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "500" }],
        h3: ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "500" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        small: ["0.8125rem", { lineHeight: "1.5" }],
        caption: ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.06em" }],
      },
      borderRadius: { xs: "6px", sm: "14px", md: "22px", lg: "30px" },
      boxShadow: {
        soft: "0 1px 2px rgb(0 31 63 / 0.05), 0 8px 24px -12px rgb(0 31 63 / 0.16)",
        lift: "0 2px 4px rgb(0 31 63 / 0.05), 0 24px 48px -20px rgb(0 31 63 / 0.3)",
        pop: "0 12px 40px -8px rgb(0 31 63 / 0.3), 0 0 0 1px rgb(0 31 63 / 0.08)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
      },
      animation: { pulseDot: "pulseDot 2s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
