/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F9F8F3',
          200: '#F0EBE1',
          300: '#E6DCC8',
        },
        primary: {
          50: '#e6eef4',
          100: '#b3cfe0',
          200: '#80b0cc',
          300: '#4d91b8',
          400: '#1a72a4',
          500: '#0A3D62',
          600: '#08314e',
          700: '#06253b',
          800: '#041927',
          900: '#020c14',
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
        indian: {
          green: '#138808',
          'green-light': '#1fa510',
          'green-50': '#e8f5e6',
          'green-100': '#c8e6c0',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'marquee': 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
