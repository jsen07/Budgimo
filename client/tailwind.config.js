module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Important for CRA (Create React App)
  ],
  theme: {
    extend: {
      fontFamily: {
        hero: ['LeckerliOne', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(-100%)' }, // Fixed typo: 'transforM' => 'transform'
          '100%': { transform: 'translateY(0)' },
        },
        "slide-out": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        fade1: 'fadeIn 1s ease-in-out',
        fade2: 'fadeIn 2s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        "slide-out": "slide-out 0.5s ease-in forwards",
      },
    },
  },
  plugins: [],
};