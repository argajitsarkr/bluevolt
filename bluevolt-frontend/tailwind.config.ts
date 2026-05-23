import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F4FCB",
          50: "#EFF4FE",
          100: "#DCE6FC",
          500: "#0F4FCB",
          600: "#0C3FA3",
          700: "#0A337F",
          900: "#061F4D",
        },
        ink: "#0A0A0A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
