/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050510',
        surface: '#0c0c1a',
        card: '#12122a',
        border: '#23234a',
        react: '#61dafb',
        purple: '#a855f7',
        indigo: '#6366f1',
        pink: '#ec4899',
        green: '#22c55e',
        amber: '#f59e0b',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      keyframes: {
        'spin-slow': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
      },
      animation: {
        'spin-slow': 'spin-slow 20s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      backgroundImage: { 'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))' },
    },
  },
  plugins: [],
}
