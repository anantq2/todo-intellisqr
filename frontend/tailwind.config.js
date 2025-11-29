/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",          // App.tsx aur index.tsx ke liye
    "./pages/**/*.{js,ts,jsx,tsx}",      // Pages folder ke liye
    "./components/**/*.{js,ts,jsx,tsx}", // Components folder ke liye
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}