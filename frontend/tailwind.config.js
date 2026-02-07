/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0b5fff',
          600: '#0847cc',
          700: '#1e40af',
        },
        brand: {
          brown: '#8b4b44',
          'brown-dark': '#6b2e2b',
        }
      },
    },
  },
  plugins: [],
}
