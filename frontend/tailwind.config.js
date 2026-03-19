/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6edf7',
          100: '#b3c8e6',
          200: '#80a3d5',
          300: '#4d7ec4',
          400: '#1a59b3',
          500: '#0B3D91',
          600: '#093174',
          700: '#072557',
          800: '#05193a',
          900: '#020c1d',
        },
        saffron: {
          50: '#fff5e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa31a',
          500: '#FF9933',
          600: '#cc7a29',
          700: '#995c1f',
          800: '#663d14',
          900: '#331f0a',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
