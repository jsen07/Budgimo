module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Important for CRA (Create React App)
  ],
  safelist: [
    "border-orange-500",
    "border-teal-500",
    "border-violet-500",
    "border-emerald-500",
    "border-rose-500",
    "text-orange-500",
    "text-teal-500",
    "text-violet-500",
    "text-emerald-500",
    "text-rose-500",
  ],
  theme: {
    extend: {
      fontFamily: {
        hero: ["LeckerliOne", "sans-serif"],
        figtree: ["Figtree", "sans-serif"],
        syne: ["Syne", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideIn: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideInBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        slideOutBottom: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        quickFade: "fadeIn 0.2s ease-in",
        fade1: "fadeIn 1s ease-in-out",
        fade2: "fadeIn 2s ease-in-out",
        "slide-in": "slideIn 0.5s ease-out forwards",
        "slide-in-bottom": "slideInBottom 0.5s ease-out forwards",
        "slide-out": "slide-out 0.5s ease-in forwards",
        "slide-out-bottom": "slideOutBottom 0.5s ease-out forwards",
        spin: "spin 2s linear infinite",
      },
    },
  },
  plugins: [],
};
