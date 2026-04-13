/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './App.jsx', './main.jsx', './components/**/*.{js,jsx}', './hooks/**/*.{js,jsx}', './pages/**/*.{js,jsx}', './utils/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.45s ease-out both',
      },
    },
  },
  plugins: [],
}
