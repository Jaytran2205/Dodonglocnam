import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0b0d",
        surface: "#121214",
        "surface-bright": "#17171a",
        "surface-dim": "#0d0d0f",
        "surface-container-lowest": "#17171a",
        "surface-container-low": "#1c1c1f",
        "surface-container": "#222226",
        "surface-container-high": "#2a2a2e",
        "surface-container-highest": "#34343a",
        "on-background": "#f6f0df",
        "on-surface": "#f6f0df",
        "on-surface-variant": "#cfc3a6",
        outline: "rgba(212, 175, 55, 0.35)",
        "outline-variant": "rgba(212, 175, 55, 0.24)",
        primary: "#d4af37",
        "primary-container": "#3d2a12",
        "on-primary": "#120d08",
        "on-primary-container": "#f9ebc7",
        secondary: "#f1d27c",
        "secondary-container": "#c79d3d",
        "on-secondary": "#120d08",
        tertiary: "#1f1a16",
        "tertiary-container": "#2c241d",
        "on-tertiary": "#f6f0df",
        bordeaux: {
          DEFAULT: "#1c120d",
          hover: "#2a1a14",
          dark: "#100b09",
        },
        gold: {
          DEFAULT: "#d4af37",
          accent: "#f1d27c",
          light: "#f9e7b0",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "'Noto Serif'", "serif"],
        sans: ["var(--font-sans)", "'Inter'", "sans-serif"],
        "display-lg": ["var(--font-serif)", "'Noto Serif'", "serif"],
        "headline-lg": ["var(--font-serif)", "'Noto Serif'", "serif"],
        "headline-md": ["var(--font-serif)", "'Noto Serif'", "serif"],
        "body-lg": ["var(--font-sans)", "'Inter'", "sans-serif"],
        "body-md": ["var(--font-sans)", "'Inter'", "sans-serif"],
        "label-sm": ["var(--font-sans)", "'Inter'", "sans-serif"],
      },
      spacing: {
        gutter: "24px",
        base: "8px",
        sm: "12px",
        md: "24px",
        lg: "48px",
        xl: "80px",
        "container-max": "1280px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      boxShadow: {
        lift: "0 10px 25px -5px rgba(45, 27, 20, 0.08)",
      }
    },
  },
  plugins: [],
};

export default config;