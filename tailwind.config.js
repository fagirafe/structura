/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#000000',
          muted: '#666666',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f5f5f5',
          softer: '#f2f2f2',
          card: '#fbfefb',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '32px',
      },
    },
  },
  plugins: [],
};
