import "../styles/globals.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color|fill|stroke)$/i,
      date: /Date$/,
    },
  },
  docs: {
    source: {
      excludeDecorators: true,
    },
  },
  options: {
    storySort: {
      order: [
        "Map Elements",
        "Map Layers",
        "Map Types",
        "Charts",
        "Shapes",
        "SummaryTable",
        "UI",
      ],
    },
  },
};
