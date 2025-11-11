/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          DEFAULT: '#5865F2',
          darker: '#4752C4', // A darker shade for hover effects
        },
        github: {
          DEFAULT: '#181717',
          darker: '#24292E', // A slightly lighter shade for hover effects
        },
        // Custom colors for light and dark themes
        background: {
          light: '#F9FAFB', // Gray 50
          dark: '#1F2937',  // Gray 800
        },
        text: {
          light: '#111827', // Gray 900
          dark: '#F9FAFB',  // Gray 50
        },
        card: {
          light: '#FFFFFF', // White
          dark: '#374151',  // Gray 700
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        'html': {
          '@apply transition-colors duration-500': {},
        },
      });
    },
  ],
}
