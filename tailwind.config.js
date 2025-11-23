/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Removed vivid brand colors to favor a muted paper palette
        paper: {
          duststorm: '#DFD0B9',
          alabaster: '#EDEDE7',
          champagne: '#F3E1D4',
          duststorm2: '#E8D3BE',
          darkvanilla: '#D9C2A6',
        },
      },
      fontFamily: {
        handwritten: ['"Patrick Hand"', '"Indie Flower"', '"Shadows Into Light"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
