// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'main-bg-image': 'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)',
      },
      colors: {
        'main-bg': '#D9AFD9',
      },
      fontFamily: {
        mainfont: ["Montserrat"]
      },
    },
  },
  plugins: [],
}
