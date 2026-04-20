/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:    '#0a0a0a',
          dark:     '#4a5e3a',
          mid:      '#6b7f57',
          accent:   '#7fa653',
          text:     '#e8e8e8',
          muted:    '#9ca3af',
          surface:  '#111b0e',
          card:     '#141f10',
          border:   '#2a3a22',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
