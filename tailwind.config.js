/** Colores vinculados a variables CSS para soportar tema claro/oscuro (ver src/styles/index.css). */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: token('void'),
          800: token('void-800'),
          700: token('void-700'),
          600: token('void-600'),
          500: token('void-500'),
        },
        accent: { DEFAULT: '#00B9F9', 300: token('accent-300'), 600: '#0090D0' },
        brand: { DEFAULT: '#0057D3', 300: token('brand-300'), 600: '#0A7AE6' },
        frost: { DEFAULT: token('frost'), 200: token('frost-200'), 400: token('frost-400'), 600: token('frost-600') },
        ink: token('ink'),
        line: 'var(--line)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
