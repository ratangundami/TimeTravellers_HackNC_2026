/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          500: '#2076ff',
          600: '#185fcd',
          900: '#0f2a55'
        },
        ink: '#0f172a'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.08)',
        card: '0 2px 14px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
