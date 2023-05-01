/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundColor: {
        light: '#f2f2f2',
        dark: '222222'
      },
      colors: {
        'artbot-teal': 'rgb(20,184,166)',
        'text-dark': '#f3f3ef',
        'text-light': '#344c50'
      },
      keyframes: {
        fill: {
          '0%': { width: `0%` },
          '100%': { width: '100%' }
        }
      },
      screens: {
        tablet: '640px',
        adCol: '900px',
        '2xl': '1440px',
        '3xl': '1536px',
        '4xl': '1920px'
      },
      textColor: {
        'artbot-teal': 'rgb(20,184,166)',
        light: '#344c50',
        dark: '#f3f3ef'
      }
    }
  },
  plugins: []
}
