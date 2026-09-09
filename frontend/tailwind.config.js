/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        ember: {
          50: '#fff2ea',
          100: '#ffe0cc',
          200: '#ffbe94',
          300: '#ff9a5c',
          400: '#fb7a30',
          500: '#e8590c',
          600: '#c44607',
          700: '#9c3606',
          800: '#7a2c0a',
          900: '#63250c',
        },
        forge: {
          50: '#f4f6f7',
          100: '#e6eaec',
          200: '#c9d2d6',
          300: '#9fadb4',
          400: '#6d818a',
          500: '#526670',
          600: '#44545c',
          700: '#39464d',
          800: '#2a3338',
          900: '#14161a',
          950: '#0d0e11',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(13,14,17,0.04)',
      },
    },
  },
  plugins: [],
}
