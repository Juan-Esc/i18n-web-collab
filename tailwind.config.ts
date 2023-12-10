import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["night"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
  }
} satisfies Config

