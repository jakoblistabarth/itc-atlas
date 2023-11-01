// eslint-disable-next-line
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.plugins.push(
        new ESLintWebpackPlugin({
          context: "./",
          extensions: ["js", "jsx", "ts", "tsx"],
          exclude: ["node_modules"],
        })
      );
    }
    config.module.rules.push({
      test: /\.svg$/i,
      use: {
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                    collapseGroups: false,
                  },
                },
              },
            ],
          },
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;
