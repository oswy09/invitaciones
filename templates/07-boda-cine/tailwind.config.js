/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        gold: '#C9A84C',
        'gold-light': '#E8CC7A',
        'gold-dark': '#A07C30',
        cream: '#F5EDD8',
        cinema: '#0A0A0A',
      },
    },
  },
  plugins: [],
};
