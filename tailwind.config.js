/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#E6F6FF",
          200: "#B3E0FF",
          300: "#80CAFF",
          400: "#4DB4FF",
          500: "#1A9EFF",
          600: "#007ACC",
          700: "#005A99",
          800: "#003766",
          900: "#001A33",
        }
      }
    },
  },
  plugins: [],
}

