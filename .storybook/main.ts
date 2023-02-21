import type { StorybookConfig } from "@storybook/preset-react-webpack";

const config: StorybookConfig = {
  core: {
    builder: "@storybook/builder-webpack5",
  },
  stories: ["../stories/**/*.stories.@(ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-css-modules-preset",
    {
      name: "storybook-addon-swc",
      options: {
        enableSwcMinify: false,
      },
    },
  ],
  staticDirs: ["../public", "../stories/assets", "../data/topographic"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config) => {
    // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    const fileLoaderRule = config.module?.rules?.find(
      (rule) => rule.test && rule.test.test(".svg")
    );
    fileLoaderRule.exclude = /\.svg$/;
    config.module?.rules?.push({
      test: /\.svg$/,
      enforce: "pre",
      loader: require.resolve("@svgr/webpack"),
    });
    return config;
  },
};

export default config;