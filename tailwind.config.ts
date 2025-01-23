import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Files under `src/`
    "./public/**/*.html",            // Static HTML files
  ],
  theme: {
    extend: {
      colors: {
        // Define semantic color tokens for consistent use
        primary: {
          DEFAULT: "#2563EB", // Matches focus:ring-blue-500
          light: "#93C5FD",
          dark: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#4B5563",
          light: "#9CA3AF",
          dark: "#1F2937",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FCA5A5",
          dark: "#B91C1C",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#6EE7B7",
          dark: "#047857",
        },
        // Use CSS variables for dynamic theming support
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      spacing: {
        // Add custom spacing tokens if needed
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      borderRadius: {
        // Add custom border radius
        "4xl": "2rem",
      },
    },
  },
  safelist: [
    // Safelist dynamic classes (if used in JS/TS logic)
    {
      pattern: /^bg-(red|blue|green|yellow)-(100|200|500)$/,
      variants: ["hover", "focus"], // Add relevant variants if needed
    },
  ],
  plugins: [],
} satisfies Config;
