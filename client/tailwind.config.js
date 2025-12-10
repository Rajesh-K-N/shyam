/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'peacock-blue': '#004F98',
        'peacock-green': '#00A86B',
        'krishna-gold': '#F4C430',
        'warm-cream': '#FFFDD0',
        'deep-blue': '#002147',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
