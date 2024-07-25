/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',   
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './out/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
        keyframes: {
          'slide-in-r': {
            '0%': {
              opacity: '0',
              transform: 'translateX(100%)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateX(0)'
            },
          },
          'slide-in-l': {
            '0%': {
              opacity: '0',
              transform: 'translateX(-100%)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateX(0)'
            },
          },
          'slide-out-r': {
            '0%': {
              opacity: '1',
              transform: 'translateX(0)'
            },
            '100%': {
              opacity: '0',
              transform: 'translateX(100%)'
            },
          },
          'slide-out-l': {
            '0%': {
              opacity: '1',
              transform: 'translateX(0)'
            },
            '100%': {
              opacity: '0',
              transform: 'translateX(-100%)'
            },
          }
        },
        animation: {
          'slide-in-r': 'slide-in-r var(--animation-duration, 0.5s) ease-out forwards var(--animation-delay, 0s)',
          'slide-in-l': 'slide-in-l var(--animation-duration, 0.5s) ease-out forwards var(--animation-delay, 0s)',
          'slide-out-r': 'slide-out-r var(--animation-duration, 0.5s) ease-out forwards var(--animation-delay, 0s)',
          'slide-out-l': 'slide-out-l var(--animation-duration, 0.5s) ease-out forwards var(--animation-delay, 0s)'
        },
      colors: {
        'white': '#ffffff',
        'black': '#000000',
        'blue': '#1fb6ff',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'grey-dark': '#273444',
        'grey': '#8492a6',
        'gray': '#8492a6',
        'grey-light': '#d3dce6',
        'grey-dark': '#CCCCCC',
        'clear': '#00000000',
        'transparent': '#00000000',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      left: {
        '1/5': '20%',
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      blur: { 
        'none': '0px',
        'xsm': '3px',
        'sm': '6px',
        'md': '9px',
        'lg': '12px',
        'xlg': '15px',
      },
      backdropBlur: {
        'none': '0px',
        'xsm': '3px',
        'sm': '6px',
        'md': '9px',
        'lg': '12px',
        'xlg': '15px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        'sm-md': ['0.9375rem', '1.375rem'], // 15px with a line height of 22px
        'md-lg': ['1.0625rem', '1.625rem'],  // 17px with a line height of 26px
     },
    }
  },
}

