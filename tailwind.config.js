/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minWidth:{
        'xs': '300px',
      },
      zIndex: {
        '100': '100',
      },
    },
  },
  plugins: [],
}

