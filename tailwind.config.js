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
        discord: '#5865F2',
        // Custom colors for light and dark themes
        primary: {
          light: '#4F46E5', // Indigo 600
          dark: '#818CF8',  // Indigo 300
        },
        secondary: {
          light: '#10B981', // Emerald 500
          dark: '#6EE7B7',  // Emerald 300
        },
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
