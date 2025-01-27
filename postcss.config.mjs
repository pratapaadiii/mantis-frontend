/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "tailwindcss/nesting": {}, // Allows modern CSS nesting
    tailwindcss: {},
    autoprefixer: {},          // Adds vendor prefixes for compatibility
  },
};

export default config;
