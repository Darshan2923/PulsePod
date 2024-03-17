/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custpurple': '#7C0397',
        'cust2purple': '#BE1ADB',
      },

    },
  },
  plugins: [],
}