/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{ejs,html,js}",
    './public/scripts/**/*.js', 
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: 'hsl(228, 39%, 23%)',
        veryDarkBlue: 'hsl(233, 12%, 13%)',
        darkGray: '#1d1d1d',
        veryLightGray: 'hsl(0, 0%, 80%)',
        coolGray: '#BFCAD0',
        Gunmetal_Gray: "#738580",
        Red_1: "rgb(185 28 28)",


      },
      screens: {
        'sm': '640px',  // Small screens
        'md': '768px',  // Medium screens
        'lg': '1024px', // Large screens
        'xl': '1280px', // Extra Large screens
        '2xl': '1536px', // 2x Extra Large screens
      },
    },
  },
  plugins: [],
}

