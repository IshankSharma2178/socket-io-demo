/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-green": "#39ff14",
        "neon-pink": "#ff007f",
        "neon-blue": "#00ffff",
        "neon-purple": "#9d00ff",
        "neon-yellow": "#fdfd96",
      },
    },
  },
  plugins: [],
};
