/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#050609',
          900: '#08090E',
          850: '#0D0F17',
          800: '#121622',
          700: '#1A2030',
          600: '#262E44',
          500: '#3D4968',
        },
        gala: {
          gold: '#EAB308',
          amber: '#F59E0B',
          glow: '#FDE047',
          bronze: '#B45309',
          champagne: '#FEF08A',
        },
        holo: {
          cyan: '#38BDF8',
          violet: '#818CF8',
          purple: '#C084FC',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        syne: ['Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 35px -5px rgba(234, 179, 8, 0.35)',
        'gold-glow-lg': '0 0 60px -10px rgba(234, 179, 8, 0.5)',
        'holo-glow': '0 0 30px -5px rgba(56, 189, 248, 0.3)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
};
