/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F766E',
          secondary: '#0EA5E9',
          accent: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};
