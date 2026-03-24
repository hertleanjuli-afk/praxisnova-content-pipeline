import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0A0A0A',
          dark: '#060606',
          accent: '#E8472A',
          'accent-hover': '#D63D22',
          card: '#111111',
          'card-hover': '#1A1A1A',
          muted: '#555555',
          'muted-light': '#888888',
          border: '#222222',
        },
      },
    },
  },
  plugins: [],
}
export default config
