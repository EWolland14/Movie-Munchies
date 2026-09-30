/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#07090e',
          900: '#0d1117',
          850: '#131722',
          800: '#1b2130',
          700: '#273145',
          600: '#3c4b69',
          gold: '#f59e0b',
          crimson: '#e11d48',
          neon: '#06b6d4',
          accent: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-crimson': '0 0 25px -5px rgba(225, 29, 72, 0.35)',
        'glow-accent': '0 0 30px -5px rgba(139, 92, 246, 0.35)',
        'glow-neon': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
