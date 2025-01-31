import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      // Custom Colors
      colors: {
        primary: {
          DEFAULT: "#2563EB", // Blue for buttons, headers
          light: "#93C5FD",
          dark: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#4B5563", // Gray for text, borders
          light: "#9CA3AF",
          dark: "#1F2937",
        },
        error: {
          DEFAULT: "#EF4444", // Red for errors
          light: "#FCA5A5",
          dark: "#B91C1C",
        },
        success: {
          DEFAULT: "#10B981", // Green for success messages
          light: "#6EE7B7",
          dark: "#047857",
        },
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        green: {
          100: "#D1FAE5",
          200: "#A7F3D0",
          500: "#10B981",
        },
        // Chat-specific colors
        userMessage: "#E0F2FE", // Light blue for user messages
        assistantMessage: "#F0FFF4", // Light green for assistant messages
      },

      // Spacing
      spacing: {
        sidebar: "16rem",
        "chat-header": "3.5rem",
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
        "message-padding": "1rem", // Padding for messages
        "input-padding": "0.75rem", // Padding for input field
        "button-padding": "0.5rem 1rem", // Padding for buttons
      },

      // Border Radius
      borderRadius: {
        "4xl": "2rem",
        code: "0.5rem",
        xl: "1rem",
        lg: "0.5rem",
        message: "0.75rem", // Rounded corners for messages
      },

      // Shadows
      boxShadow: {
        code: "0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)",
        sidebar: "2px 0 8px rgba(0, 0, 0, 0.05)",
        message: "0 2px 4px rgba(0, 0, 0, 0.05)", // Shadow for messages
        button: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // Shadow for buttons
        "chat-window": "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow for chat window
      },

      // Min/Max Height
      minHeight: {
        "input-min": "40px",
        "screen-70": "70vh",
        message: "4rem",
      },
      maxHeight: {
        "input-max": "120px",
        "screen-80": "80vh",
        "messages-container": "calc(100vh - 12rem)",
      },

      // Keyframes
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },

      // Animations
      animation: {
        "dot-animation": "blink 1.4s infinite",
        "slide-in": "slideIn 0.3s ease-out",
        spin: "spin 1s linear infinite",
        bounce: "bounce 1s infinite",
      },

      // Transition Properties
      transitionProperty: {
        width: "width",
        height: "height",
        spacing: "margin, padding",
        transform: "transform",
        shadow: "box-shadow",
        opacity: "opacity",
      },

      // Screens (Breakpoints)
      screens: {
        xs: "480px", // Extra small screens
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },

  // Safelist for Dynamic Classes
  safelist: [
    // Dynamic Color Classes
    {
      pattern:
        /^bg-(blue|green|gray|red)-(50|100|200|500|600|700)$/,
      variants: ["hover", "focus", "active"],
    },
    {
      pattern:
        /^text-(gray|blue|green|red)-(500|600|700|800|900)$/,
      variants: ["hover"],
    },

    // Layout Classes
    {
      pattern:
        /^(w|h|min-h|max-h)-(sidebar|chat-header|screen-70|screen-80)/,
    },

    // Animation Classes
    "animate-spin",
    "animate-slide-in",
    "animate-bounce",

    // Interactive States
    {
      pattern: /^cursor-(pointer|se-resize|not-allowed)/,
    },

    // Position Utilities
    {
      pattern:
        /^(top|bottom|left|right)-([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|50|100)/,
    },

    // Special Cases
    "prose",
    "prose-sm",
    "truncate",
    "whitespace-pre-wrap",
    "z-[999]",
  ],

  // Plugins
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
} satisfies Config;