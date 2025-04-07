// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  module.exports = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
        fontWeight: {
          extrabold: '800',
        },
      },
    },
    // asegúrate de tener contenido apuntando a tus archivos JSX
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
  };
  // tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // asegúrate que esto esté bien
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

  
  