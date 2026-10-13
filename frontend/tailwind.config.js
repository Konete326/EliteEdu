/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0e5e61',
          hover: '#0a4b4e',
          soft: '#e2f0ef',
          dark: '#5cc2ba'
        },
        accent: {
          DEFAULT: '#e3a52b',
          soft: '#fcf0d6',
          ink: '#3b2600',
          dark: '#efb342'
        },
        bg: {
          DEFAULT: '#f2f5f6',
          dark: '#000000'
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f6f8f9',
          dark: '#0e0e0e',
          'secondary-dark': '#171717'
        },
        ink: {
          DEFAULT: '#15222b',
          sub: '#3a4853',
          muted: '#5c6a75',
          faint: '#a3adb5',
          dark: '#f3f4f6',
          'sub-dark': '#d1d5db',
          'muted-dark': '#9ca3af'
        },
        line: {
          DEFAULT: '#e2e7eb',
          secondary: '#cfd7dd',
          dark: '#262626'
        },
        good: {
          DEFAULT: '#17703f',
          soft: '#e1f3e8',
          dark: '#6ad19a'
        },
        warn: {
          DEFAULT: '#8a5300',
          soft: '#fcefd3',
          dark: '#f1c060'
        },
        bad: {
          DEFAULT: '#b1261d',
          soft: '#fbe5e2',
          dark: '#f39388'
        },
        info: {
          DEFAULT: '#1d5c9b',
          soft: '#e3edf9',
          dark: '#8ab9ee'
        }
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
