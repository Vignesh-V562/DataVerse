/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        dv: {
          bg: '#141414',
          sidebar: '#1a1c1a',
          card: '#1e201e',
          elevated: '#252725',
          input: '#1a1c1a',
        },
        // Primary accent — Sage green
        sage: {
          300: '#7aab91',
          400: '#6b9d82',
          500: '#5b8a72',
          600: '#4a7a63',
          700: '#3a5c4a',
          800: '#2e4a3a',
          900: '#243d30',
        },
        // Secondary accent — Coral
        coral: {
          400: '#e07a73',
          500: '#d4655e',
          600: '#c0524b',
          700: '#a8433d',
        },
        // Text hierarchy
        txt: {
          primary: '#e8e4de',
          secondary: '#8a8680',
          tertiary: '#5a5854',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'dv': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'dv-lg': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'sage-glow': '0 0 20px rgba(91, 138, 114, 0.15)',
      },
    },
  },
  plugins: [],
}
