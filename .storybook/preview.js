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
  async () => {
    const countries = await (
      await fetch(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
        // "/assets/countriesIso.json" // TODO: load file with iso-codes instead from static folder? does not work like this
      )
    ).json();
    return {
      countries,
    };
  },
];
