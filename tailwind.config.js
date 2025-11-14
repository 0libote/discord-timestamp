/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        '600': '600ms',
        '1000': '1000ms',
        '1200': '1200ms',
        '2400': '2400ms',
      },
      colors: {
        discord: {
          DEFAULT: '#5562f6',
          darker: '#4f5bda', // A darker shade for hover effects
        },
        github: {
          DEFAULT: '#24292E',
          darker: '#181717', // A darker shade for hover effects
        },
        // Custom colors for light and dark themes
        background: {
          light: '#F9FAFB', // Gray 50
          dark: '#111827',  // Gray 900
        },
        text: {
          light: '#111827', // Gray 900
          dark: '#F9FAFB',  // Gray 50
        },
        card: {
          light: '#FFFFFF', // White
          dark: '#1F2937',  // Gray 800
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
