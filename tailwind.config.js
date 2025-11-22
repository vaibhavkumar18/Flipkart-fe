/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
         screens: {
        'xxs': {'max': '350px'},   // custom breakpoint
      },
    },
  },
  plugins: [],
}