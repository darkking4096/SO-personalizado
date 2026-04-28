/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './packages/renderer/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Personalización SO custom palette
        'ps-primary': '#0078D4',
        'ps-secondary': '#50E6FF',
        'ps-accent': '#107C10',
        'ps-danger': '#DA3B01',
        'ps-warning': '#FFB900',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
