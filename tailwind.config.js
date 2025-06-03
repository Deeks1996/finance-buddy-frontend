/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    boxShadow: {
        neumorphic: '8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff',
      },
  }
  },
  plugins: [],
}
