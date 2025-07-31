// postcss.config.js

// PostCSS configuration for Tailwind CSS and Autoprefixer.
// You can add more plugins (e.g., cssnano) for production optimization.

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // ...(isProduction ? { cssnano: {} } : {}), // Uncomment to add cssnano in production
  },
};
// webpack.config.dev.js