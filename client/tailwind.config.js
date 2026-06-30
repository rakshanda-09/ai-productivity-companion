/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "rgb(var(--color-bg) / <alpha-value>)",
          50: "rgb(var(--color-bg-soft) / <alpha-value>)",
          900: "rgb(var(--color-bg-deep) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          raised: "rgb(var(--color-surface-raised) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
        },
        brand: {
          DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
          dim: "rgb(var(--color-brand-dim) / <alpha-value>)",
          glow: "rgb(var(--color-brand-glow) / <alpha-value>)",
        },
        violet: {
          DEFAULT: "rgb(var(--color-violet) / <alpha-value>)",
        },
        risk: {
          critical: "#FF4D6A",
          high: "#FFA53D",
          medium: "#F0C419",
          safe: "#34D399",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,92,246,0.4), 0 0 24px rgba(139,92,246,0.25)",
        "glow-critical": "0 0 0 1px rgba(255,77,106,0.5), 0 0 24px rgba(255,77,106,0.3)",
      },
      animation: {
        "pulse-slow": "pulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};
