/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
      colors:{
        'color-teal' : '#77E4C8',
        'color-turq' : '#36C2CE',
        'color-blue' : '#478CCF',
        'color-dark' : '#4535C1'

      }
    },
  },
  plugins: [],
}

