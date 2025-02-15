/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-surface': '#1E1E1E',
        'dark-border': '#2A2A2A',
        'accent': '#6366F1',
        'accent-light': '#818CF8',
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.37)',
        'inner-glass': 'inset 0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      },
      backdropBlur: {
        'glass': '8px'
      },
      backgroundOpacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65'
      }
    }
  },
  plugins: []
}