/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand:      '#5b3ff8',
        'brand-lt': '#ede9ff',
        'brand-dk': '#3a22c7',
        accent:     '#ff6b6b',
        surface:    '#f7f6ff',
        muted:      '#6b6880',
        border:     '#e4e1f5',
        ink:        '#0f0d1a',
      },
      backgroundColor: {
        page: 'var(--page-bg)',
        card: 'var(--card-bg)',
      },
      textColor: {
        ink: 'var(--text-ink)',
        muted: 'var(--text-muted)',
      },
      borderColor: {
        border: 'var(--border-color)',
      },
      boxShadow: {
        brand:       '0 4px 24px rgba(91,63,248,0.10)',
        'brand-lg':  '0 12px 48px rgba(91,63,248,0.16)',
        'brand-btn': '0 6px 20px rgba(91,63,248,0.35)',
        soft:        '0 2px 16px rgba(15,13,26,0.06)',
      },
      keyframes: {
        fadeDown:  { '0%': { opacity: 0, transform: 'translateY(-16px)' }, '100%': { opacity: 1, transform: 'none' } },
        fadeUp:    { '0%': { opacity: 0, transform: 'translateY(16px)'  }, '100%': { opacity: 1, transform: 'none' } },
        heartBeat: { '0%,100%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.35)' }, '60%': { transform: 'scale(1.2)' } },
      },
      animation: {
        'fade-down':   'fadeDown .6s ease both',
        'fade-down-1': 'fadeDown .6s .1s ease both',
        'fade-down-2': 'fadeDown .6s .2s ease both',
        'fade-down-3': 'fadeDown .6s .3s ease both',
        'fade-up':     'fadeUp .6s ease both',
        'heart-beat':  'heartBeat .4s ease',
      },
    }
  },
  plugins: [],
}