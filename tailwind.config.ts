import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dae6ff",
          200: "#bcd1ff",
          300: "#8eb1ff",
          400: "#5985ff",
          500: "#345dff",
          600: "#1f3df5",
          700: "#192fdb",
          800: "#1a2bb0",
          900: "#1c2b8b",
          950: "#0c1a3a",
        },
        accent: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1f3df5 0%, #06b6d4 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(31,61,245,0.08) 0%, rgba(6,182,212,0.08) 100%)",
        "brand-text-gradient": "linear-gradient(135deg, #1f3df5 0%, #06b6d4 100%)",
      },
      boxShadow: {
        brand: "0 10px 30px -10px rgba(31, 61, 245, 0.45)",
        "brand-sm": "0 4px 14px -4px rgba(31, 61, 245, 0.35)",
      },
      keyframes: {
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "blob-float": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(20px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 200ms ease-out",
        "fade-in-up": "fade-in-up 250ms ease-out",
        shimmer: "shimmer 1.6s linear infinite",
        "blob-float": "blob-float 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
