
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hot-pink': '#ff1493',
        'royal-purple': '#6a0dad',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
}
