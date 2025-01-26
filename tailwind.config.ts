// tailwind.config.js
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Files under `src/`
    "./public/**/*.html",             // Static HTML files
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
    // Safelist classes for the floating chat widget
    "fixed",
    "bottom-4",
    "right-4",
    "z-50",
    "transition-all",
    "duration-300",
    "w-96",
    "h-[500px]",
    "w-20",
    "h-20",
    "bg-white",
    "rounded-lg",
    "shadow-lg",
    "flex",
    "flex-col",
    "overflow-hidden",
    "border",
    "border-gray-200",
    "bg-blue-600",
    "text-white",
    "p-4",
    "justify-between",
    "items-center",
    "cursor-pointer",
    "text-lg",
    "font-semibold",
    "flex-1",
    "overflow-y-auto",
    "p-3",
    "rounded-lg",
    "mb-2",
    "bg-blue-100",
    "bg-green-100",
    "text-gray-800",
    "border-t",
    "space-x-2",
    "flex-grow",
    "p-2",
    "border-gray-300",
    "hover:bg-blue-700",
  ],
  plugins: [
    require('@tailwindcss/forms'),      // For form styling
    require('@tailwindcss/typography'), // For typography utilities
    require('@tailwindcss/aspect-ratio'), // For aspect ratio utilities
  ],
} satisfies Config;