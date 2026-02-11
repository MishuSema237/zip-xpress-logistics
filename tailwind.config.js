/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'zip-red': {
          500: '#d92626', // Bright red for buttons/highlights
          600: '#b91c1c', // Deep red for primary branding
          700: '#991b1b', // Darker deep red for hover states
          800: '#7f1d1d',
          900: '#450a0a',
        },
        'zip-blue': {
          500: '#3e54c1',
          800: '#1e1b4b', // Deep blue
          900: '#0f172a', // Very dark blue/slate
          950: '#020617',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        marquee: 'marquee 20s linear infinite',
        float: 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}