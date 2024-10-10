/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Update this based on your file structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"],
  },
  safelist: [
    // Safelist all the classes generated by your `statusClass` function
    {
      pattern: /-(yellow|blue|green|red|purple|gray|pink|indigo|teal)-500$/, // Safelist valid colors
    }
  ],
}

