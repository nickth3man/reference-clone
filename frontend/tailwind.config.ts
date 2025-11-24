// @ts-ignore
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Primary orange accent
        brand: {
          primary: "#ea580c", // orange-600
          secondary: "#f97316", // orange-500
          dark: "#c2410c", // orange-700
          light: "#fb923c", // orange-400
        },
        // Surface colors - Background and container colors
        surface: {
          base: "#ffffff",
          elevated: "#f8fafc", // slate-50
          dark: "#0f172a", // slate-900
          darker: "#1e293b", // slate-800
          overlay: "rgba(15, 23, 42, 0.9)", // slate-900 with opacity
        },
        // Text colors - Typography colors
        text: {
          primary: "#0f172a", // slate-900
          secondary: "#475569", // slate-600
          tertiary: "#64748b", // slate-500
          quaternary: "#94a3b8", // slate-400
          inverse: "#ffffff",
          disabled: "#cbd5e1", // slate-300
        },
        // Border colors - Dividers and outlines
        border: {
          default: "#e2e8f0", // slate-200
          light: "#f1f5f9", // slate-100
          strong: "#cbd5e1", // slate-300
          inverse: "#334155", // slate-700
        },
        // Status colors - Feedback and states
        status: {
          error: "#dc2626", // red-600
          "error-light": "#fee2e2", // red-100
          success: "#16a34a", // green-600
          "success-light": "#dcfce7", // green-100
          warning: "#eab308", // yellow-500
          "warning-light": "#fef9c3", // yellow-100
          info: "#2563eb", // blue-600
          "info-light": "#dbeafe", // blue-100
        },
      },
      spacing: {
        // Semantic spacing tokens
        section: "2rem", // 32px
        "section-sm": "1.5rem", // 24px
        "section-lg": "4rem", // 64px
        "section-xl": "6rem", // 96px
        card: "1.5rem", // 24px
        "card-sm": "1rem", // 16px
        "card-lg": "2rem", // 32px
        gutter: "1rem", // 16px
        "gutter-sm": "0.5rem", // 8px
        "gutter-lg": "1.5rem", // 24px
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Consolas", "monospace"],
      },
      fontSize: {
        // Typography scale with semantic naming
        "display-1": [
          "3.75rem",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" },
        ], // 60px
        "display-2": [
          "3rem",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ], // 48px
        "heading-1": [
          "2.25rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" },
        ], // 36px
        "heading-2": [
          "1.875rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" },
        ], // 30px
        "heading-3": [
          "1.5rem",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" },
        ], // 24px
        "heading-4": [
          "1.25rem",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" },
        ], // 20px
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }], // 18px
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }], // 16px
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }], // 14px
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }], // 12px
      },
      borderRadius: {
        // Consistent border radius scale
        card: "0.75rem", // 12px
        "card-lg": "1rem", // 16px
        "card-xl": "1.5rem", // 24px
      },
      boxShadow: {
        // Card shadows
        "card-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "card-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      transitionDuration: {
        // Standard transition durations
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
