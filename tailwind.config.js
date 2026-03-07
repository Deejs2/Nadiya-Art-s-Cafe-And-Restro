/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            display: ['Playfair Display', 'serif'],
            body: ['Inter', 'sans-serif'],
          },
          colors: {
            primary: { DEFAULT: '#d97706', dark: '#b45309', light: '#fbbf24' },
            accent: { DEFAULT: '#059669', light: '#34d399' },
          }
        }
      },
  plugins: [],
}
