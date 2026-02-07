/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5f3',
          100: '#fde9e5',
          200: '#fbd0c7',
          300: '#f7afa0',
          400: '#f18268',
          500: '#e65a3a',
          600: '#c17a6f',
          700: '#a0635a',
          800: '#85534c',
          900: '#6f4843',
        },
        accent: {
          50: '#f4f7f5',
          100: '#e8ede9',
          200: '#d1dbd3',
          300: '#afc2b4',
          400: '#87a38f',
          500: '#6b8e6f',
          600: '#557159',
          700: '#455b48',
          800: '#39493b',
          900: '#303d32',
        }
      }
    },
  },
  plugins: [],
}
