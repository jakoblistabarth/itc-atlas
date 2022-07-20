import "../styles/globals.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    source: {
      excludeDecorators: true,
    },
  },
};

export const loaders = [
  async () => ({
    countries: await (
      await fetch("http://localhost:3000/api/data/geo/countries")
    ).json(),
  }),
];
