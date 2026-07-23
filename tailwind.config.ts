import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Astrology/Vastu Theme Colors
        background: "#09090b", // Deep midnight black
        foreground: "#ededed",
        primary: "#8b5cf6", // Deep spiritual purple
        accent: "#f59e0b", // Vastu gold/saffron
        card: "#18181b",
        border: "#27272a",
        destructive: "#ef4444", // For Vastu defects
        success: "#22c55e", // For favorable zones
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
