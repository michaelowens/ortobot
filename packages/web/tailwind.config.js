module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        '1': 'repeat(1, minmax(150px, 320px))',
        '2': 'repeat(2, minmax(150px, 320px))',
        '3': 'repeat(3, minmax(150px, 320px))',
        '4': 'repeat(4, minmax(150px, 320px))',

        // Complex site-specific column configuration
        footer: '200px minmax(900px, 1fr) 100px',
      },
      minHeight: {
        '48': '12rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
}
