/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // 必須有這行，告訴 Tailwind 掃描 src 裡面的 React 程式碼
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],