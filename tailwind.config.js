/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
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
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: "translateX(-2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
