/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xl: { max: "1280px" },
      lg: { max: "1024px" },
      hero: { max: "900px" },
      md: { max: "768px" },
      sm: { max: "480px" },
      xs: { max: "320px" },
    },
    extend: {
      colors: {
        foreground: "hsl(var(--tw-foreground) / <alpha-value>)",
        background: "hsl(var(--tw-background) / <alpha-value>)",
        primary: "hsl(var(--tw-primary) / <alpha-value>)",
        secondary: "hsl(var(--tw-secondary) / <alpha-value>)",
        accent: "hsl(var(--tw-accent) / <alpha-value>)",
      },

      fontSize: {
        "fs--2": "clamp(0.69rem, calc(0.66rem + 0.18vw), 0.8rem)",
        "fs--1": "clamp(0.83rem, calc(0.78rem + 0.29vw), 1rem)",
        "fs-0": "clamp(1rem, calc(0.91rem + 0.43vw), 1.25rem)",
        "fs-1": "clamp(1.2rem, calc(1.07rem + 0.63vw), 1.56rem)",
        "fs-2": "clamp(1.44rem, calc(1.26rem + 0.89vw), 1.95rem)",
        "fs-3": "clamp(1.73rem, calc(1.48rem + 1.24vw), 2.44rem)",
        "fs-4": "clamp(2.07rem, calc(1.73rem + 1.7vw), 3.05rem)",
        "fs-5": "clamp(2.49rem, calc(2.03rem + 2.31vw), 3.82rem)",
      },
      spacing: {
        "dashboard-content": "var(--dashboard-content-height)",
      },
      minHeight: {
        "dashboard-content": "var(--dashboard-content-height)",
      },
      backgroundImage: {
        "auth-gradient": "url('/assets/auth-bg.svg')",
      },
      zIndex: {
        1: "1",
      },
    },
  },
  plugins: [],
};
