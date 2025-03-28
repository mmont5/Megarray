/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00E5BE',
          50: '#E6FFF9',
          100: '#B3FFF0',
          200: '#80FFE7',
          300: '#4DFFDE',
          400: '#1AFFD5',
          500: '#00E5BE',
          600: '#00B294',
          700: '#007F6B',
          800: '#004C40',
          900: '#001A16',
        },
        secondary: {
          DEFAULT: '#4F46E5',
          50: '#EBEAFC',
          100: '#D6D4FA',
          200: '#AEAAF5',
          300: '#867FF0',
          400: '#5D55EB',
          500: '#4F46E5',
          600: '#3F38B8',
          700: '#2F2A8A',
          800: '#1F1C5C',
          900: '#0F0E2E',
        },
        surface: {
          DEFAULT: '#1E293B',
          light: '#334155',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
      },
      boxShadow: {
        'soft': '0 2px 4px 0 rgba(0,0,0,0.05)',
        'medium': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'hard': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};