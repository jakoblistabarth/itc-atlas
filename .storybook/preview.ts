import { ThemeProvider } from "theme-ui";
import { withThemeFromJSXProvider } from "@storybook/addon-styling";
import { theme } from "../styles/theme";
import ITCAtlasTheme from "./ITCAtlasTheme";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/inter/slnt.css";

export const decorators = [
  //TODO: add switcher for theme-ui color modes
  withThemeFromJSXProvider({
    themes: {
      default: theme,
    },
    defaultTheme: "default",
    Provider: ThemeProvider,
  }),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color|fill|stroke)$/i,
      date: /Date$/,
    },
  },
  status: {
    statuses: {
      beta: {
        background: "#ff3438",
        color: "#680002",
        description: "This component is still work in progress",
      },
      stable: {
        background: "#d7ff80",
        color: "#58830f",
        description: "This component is stable",
      },
    },
  },
  docs: {
    theme: ITCAtlasTheme,
    source: {
      excludeDecorators: true,
    },
  },
  options: {
    storySort: {
      order: [
        "Intro",
        "Map Elements",
        ["Marks", "Marks3D", "Labels", "Layouts", "Legends"],
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
