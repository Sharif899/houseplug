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
        brand: {
          50:  "#F0FAF4",
          100: "#D6F0E3",
          200: "#AADEC6",
          300: "#6FC5A0",
          400: "#2DA870",
          500: "#1A6B45",
          600: "#0D4A2F",
          700: "#093621",
          800: "#062416",
          900: "#03120B",
        },
        gold: {
          300: "#FAD07A",
          400: "#F5A623",
          500: "#E8970F",
          600: "#D4880A",
        },
      },
      fontFamily: {
        sans: ["'Poppins'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:       "0 2px 12px rgba(13,74,47,0.08)",
        "card-hover":"0 8px 32px rgba(13,74,47,0.14)",
        search:     "0 4px 24px rgba(13,74,47,0.10)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
