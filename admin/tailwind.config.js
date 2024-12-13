/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        main600: '#1B253C',
        main500: '#202C46',
      },
      colors: {
        main600: '#1B253C',
        main500: '#202C46',
      }
    },
  },
  plugins: []
}