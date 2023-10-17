/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    fontFamily: {
      sans: '"Inter Variable", system-ui, sans-serif',
      serif: '"Fraunces Variable", serif',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xl: "0",
      },
    },
    extend: {
      colors: {
        "itc-green": {
          DEFAULT: "#00877d", // 700, rgb(0, 135, 125)
          50: "#eefffb",
          100: "#c5fff5",
          200: "#8bffec",
          300: "#4afee3",
          400: "#15ecd2",
          500: "#00d0ba",
          600: "#00a899",
          700: "#00877d",
          800: "#066963",
          900: "#0a5751",
          950: "#003534",
        },
        "itc-blue": {
          DEFAULT: "#002396", // 900, rgb(0, 35, 150)
          50: "#e5f4ff",
          100: "#cfebff",
          200: "#a9d7ff",
          300: "#75b9ff",
          400: "#3f8aff",
          500: "#145aff",
          600: "#0044ff",
          700: "#0045ff",
          800: "#003de3",
          900: "#002396",
          950: "#001466",
        },
      },
    },
  },
  plugins: [],
};
