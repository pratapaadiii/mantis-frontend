import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Include all source files
    "./public/**/*.html",             // Include static HTML files
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
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
        blue: {
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        green: {
          100: "#D1FAE5",
        },
        gray: {
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          500: "#6B7280",
          700: "#374151",
          800: "#1F2937",
        },
      },
      spacing: {
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      borderRadius: {
        "4xl": "2rem",
        code: "0.5rem", // New addition
      },
      boxShadow: {
        code: "0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)", // New addition
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "dot-animation": "blink 1.4s infinite",
      },
    },
  },
  safelist: [
    {
      pattern: /^bg-(blue|green|gray)-(100|500|600|700)$/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /^text-(gray|blue|green)-(500|700|800)$/,
      variants: ["hover"],
    },
    {
      pattern: /^border-(gray)-(200|300)$/,
    },
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
    "pb-8",
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
    "whitespace-pre-wrap",
    "focus:outline-none",
    "focus:border-blue-500",
    "focus:ring-2",
    "focus:ring-blue-200",
    "dot-animation",
    "delay-200",
    "delay-400",
    "bg-gradient-to-r",
    "from-blue-600",
    "to-blue-500",
    "hover:from-blue-700",
    "hover:to-blue-600",
    "rounded-xl",
    "shadow-md",
    "prose",
    "prose-sm",
    "p-4", // New addition
    "rounded-code", // New addition
    "shadow-code", // New addition
  ],
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
} satisfies Config;