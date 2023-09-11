import type { StorybookConfig } from "@storybook/preset-react-webpack";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.mdx",
    "../stories/**/*.stories.@(tsx)",
    "../components/**/*.stories.@(tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-styling",
    {
      name: "storybook-addon-swc",
      options: {
        enableSwcMinify: false,
      },
    },
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  staticDirs: ["../public", "../data/topographic"],
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
