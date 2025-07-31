const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "index.js",
      assetModuleFilename: "assets/[hash][ext][query]", // For images/fonts
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: !isProduction, // Fast dev, full type check in prod
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: "css-loader", options: { importLoaders: 1 } },
            "postcss-loader",
          ],
        },
        // Support for SVG as React components (optional)
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: ["@svgr/webpack"],
        },
        // Support for images
        {
          test: /\.(png|jpe?g|gif|webp|ico)$/i,
          type: "asset/resource",
        },
        // Support for fonts
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "index.css",
      }),
    ],
    externals: {
      // Uncomment if WordPress provides React globally:
      // 'react': 'React',
      // 'react-dom': 'ReactDOM',
    },
    optimization: {
      minimize: isProduction,
      splitChunks: { chunks: "all" }, // Recommended for production
    },
    cache: {
      type: "filesystem", // Faster dev rebuilds
    },
    devtool: isProduction ? false : "source-map",
    stats: "minimal", // Cleaner console output; set to "errors-only" for even less
  };
};
module.exports = config;