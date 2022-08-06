/** @type {import('tailwindcss').Config} */
const baseSansFonts = [
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "Open Sans",
  "Helvetica Neue",
  "sans-serif",
];

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: baseSansFonts,
      serif: [
        // "Merriweather",
        // "Nanum Myeongjo",
        // "Playfair Display",
        // "EB Garamond",
        "Noto Serif",
        "sans-serif",
      ],
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
