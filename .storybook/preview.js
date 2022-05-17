import "../styles/globals.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// TODO: fix CORS error
export const loaders = [
  async () => ({
    countries: await (
      await fetch("http://localhost:3000/api/data/geo/countries")
    ).json(),
  }),
];
