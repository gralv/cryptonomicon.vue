module.exports = {
  purge: {
    enabled: true,
    content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: {
          75: 'rgb(247, 247, 247)',
        },
      }
    },
  },
  variants:{
    extend:{
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  safelist: [
    {
      //pattern: [/./, /^dark/]
      //greedy: [/^dark/]
    },
  ]
};
