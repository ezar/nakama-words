/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'op-ocean-dark': '#0a2240',
        'op-gold': '#FFD600',
        'op-red': '#D32F2F',
        'op-parchment': '#FFF8E1',
        'op-ink': '#1A1A1A',
        'op-green': '#00E676',
        'op-cyan': '#00E5FF',
      },
      fontFamily: {
        title: ['Bangers', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        manga: '5px 5px 0 #1A1A1A',
        'manga-sm': '3px 3px 0 #1A1A1A',
      },
    },
  },
  plugins: [],
}
