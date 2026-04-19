/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        floatOrb: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(150px, 100px) scale(1.1)' },
          '100%': { transform: 'translate(-50px, 200px) scale(0.9)' },
        }
      },
      animation: {
        'float-orb': 'floatOrb 25s infinite alternate ease-in-out',
        'float-orb-reverse': 'floatOrb 30s infinite alternate-reverse ease-in-out',
      }
    },
  },
  plugins: [],
}
