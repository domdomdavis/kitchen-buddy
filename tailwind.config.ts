import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "media",
  variants: ["dark", "dark-hover", "dark-group-hover", "dark-even", "dark-odd"],
} satisfies Config;
