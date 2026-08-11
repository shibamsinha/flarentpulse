/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#efeff1',
          200: '#e2e2e6',
          300: '#c9c9d0',
          400: '#9b9ba6',
          500: '#71717f',
          600: '#52525f',
          700: '#3f3f4a',
          800: '#27272e',
          900: '#18181d',
          950: '#0e0e12',
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#5b5bd6',
          600: '#4f46c9',
          700: '#4338a8',
          800: '#372f86',
          900: '#2e296b',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.035em',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(16 17 26 / 0.04), 0 1px 3px 0 rgb(16 17 26 / 0.06)',
        card: '0 1px 2px rgb(16 17 26 / 0.04), 0 8px 24px -12px rgb(16 17 26 / 0.12)',
        lift: '0 2px 4px rgb(16 17 26 / 0.04), 0 18px 40px -18px rgb(16 17 26 / 0.22)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease both',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
}
