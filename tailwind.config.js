/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],

    theme: {
      extend: {
        colors: {
          'maxim': {
            50: '#fff0fa',
            100: '#ffe4f7',
            200: '#ffc9f0',
            300: '#ff9ce3',
            400: '#ff5fcd',
            500: '#ff30b6',
            600: '#f50d94',
            700: '#e0007c',
            800: '#b00461',
            900: '#920953',
            950: '#5b002f'
          },
          500: '#D41A69',
          600: '#C00052',
          700: '#A00042',
        },
      },
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif']
      }
    },
    plugins: [
      require('tailwindcss-animated'),
      require('autoprefixer'),
      require('tailwindcss')
    ],
  }
