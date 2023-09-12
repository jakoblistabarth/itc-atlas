import type { Theme } from "theme-ui";

export const itc_green = "rgb(0, 135, 125)";
export const itc_blue = "rgb(0,35,150)";

export const theme: Theme = {
  colors: {
    text: "#000",
    background: "#fff",
    primary: itc_green,
    secondary: itc_blue,
    muted: "rgb(235, 255, 255)",
  },
  fonts: {
    body: '"Inter Variable", system-ui, sans-serif',
    heading: '"Fraunces Variable", serif',
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
  shadows: [
    "0 0 3px rgba(0,0,0,.2)",
    `
      0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048),
      0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072),
      0 41.8px 33.4px rgba(0, 0, 0, 0.086)
    `,
  ],
  sizes: {
    container: 960,
  },
  text: {
    heading: {
      mb: 2,
      "p + &": {
        mt: 4,
      },
    },
    teaser: {
      fontFamily: "heading",
      fontSize: 4,
      fontStyle: "italic",
      fontWeight: 1,
    },
    paragraph: {
      mt: 2,
      maxWidth: "40em",
      textAlign: "justify",
    },
    kpi: {
      fontSize: 4,
      fontWeight: 1,
    },
  },
  layout: {
    container: {
      pt: 5,
    },
    section: {
      my: 4,
    },
    inlineMap: {
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
  buttons: {
    primary: {
      cursor: "pointer",
      borderRadius: 2,
    },
    muted: {
      cursor: "pointer",
      borderRadius: 2,
      p: 2,
      background: "none",
      color: "text",
      "&:hover": {
        background: "muted",
      },
    },
  },
  cards: {
    primary: {
      transition: "transform .25s",
      p: 3,
      color: "text",
      boxShadow: 0,
      borderRadius: 1,
      background: "white",
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
