// C:\Users\qweio\travel-guide\tailwind.config.cjs
module.exports = {
  content: [
    // 確保掃描 index.html
    "./index.html",
    // 📌 確保掃描所有 src/ 子目錄下的 js, ts, jsx, tsx 檔案！
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}