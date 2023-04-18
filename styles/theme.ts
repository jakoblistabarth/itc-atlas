import type { Theme } from "theme-ui";

export const itc_green = "#00877C";
export const itc_blue = "#002395";

export const theme: Theme = {
  colors: {
    text: "#000",
    background: "#fff",
    primary: itc_green,
    secondary: itc_blue,
    muted: "rgb(240, 255, 255)",
  },
  fonts: {
    body: '"Inter", system-ui, sans-serif',
    heading: '"Fraunces", serif',
    monospace: "Menlo, monospace",
  },
  fontSizes: [10, 14, 16, 20, 24, 32, 48, 64],
  fontWeights: {
    body: 400,
    heading: 400,
    heavy: 900,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  letterSpacings: {
    body: "normal",
    caps: "0.2em",
  },
  radii: [0, 2, 5, 10, 40],
  shadows: ["0 0 3px rgba(0,0,0,.2)"],
  sizes: {
    container: 960,
  },
  text: {
    heading: {
      mb: 2,
    },
    teaser: {
      fontFamily: "Fraunces",
      fontSize: 3,
      fontStyle: "italic",
    },
    paragraph: {
      mt: 2,
      maxWidth: "40em",
    },
  },
  layout: {
    container: {
      pt: 5,
    },
    section: {
      my: 4,
    },
    canvasStage: {
      height: "500px",
      boxShadow: 0,
      borderRadius: 2,
      my: 2,
    },
  },
  grids: {
    navigation: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gridGap: 3,
      mt: 2,
      mb: 4,
    },
  },
  cards: {
    primary: {
      transition: "transform .25s",
      p: 3,
      color: "text",
      boxShadow: 0,
      borderRadius: 1,
    },
  },
  styles: {
    root: {
      // uses the theme values provided above
      fontFamily: "body",
      fontWeight: "body",
    },
    a: {
      textDecoration: "none",
      color: "primary",
      "&:hover": {
        color: "secondary",
      },
    },
  },
};
