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
        "Annotations",
        "Charts",
        "Shapes",
        "Patterns",
        "SummaryTable",
        "UI",
      ],
    },
  },
};

const ifExists = (controlName: string) => ({
  if: {
    arg: controlName,
    exists: true,
  },
});

const opacityRange = { type: "range", min: 0, max: 1, step: 0.1 };

export const argTypes = {
  strokeWidth: {
    control: { type: "range", min: 0.2, max: 10, step: 0.1 },
    ...ifExists("strokeWidth"),
  },
  angle: {
    control: { type: "range", min: -90, max: 90, step: 0.1 },
    ...ifExists("angle"),
  },
  ...["opacity", "fillOpacity", "strokeOpacity"].reduce((acc, d) => {
    acc[d] = {
      control: opacityRange,
      ...ifExists(d),
    };
    return acc;
  }, {}),
};

console.log(argTypes);
