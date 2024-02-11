import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Source Sans Pro"', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        green: {
          50: "#EEFFD6",
          100: "#DEFFB3",
          200: "#BAFD68",
          300: "#93F325",
          400: "#69BA12",
          500: "#406D12",
          600: "#3A660A",
          700: "#366105",
          800: "#305601",
          900: "#2B4D00",
          950: "#274200",
        },
      },
    },
  },
  plugins: [],
};
export default config;
