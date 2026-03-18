/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nairobi: {
          primary: '#006400', // Deep Kenya Green
          secondary: '#CC0000', // Kenya Red
          accent: '#FFD700', // Gold/Yellow
        }
      }
    },
  },
  plugins: [],
}