import { MapTheme } from "../../../types/MapTheme";

const lightgrey = "#f0f0f0";
const darkgrey = "#dcdcdc";

const defaultTheme: MapTheme = {
  fontFamily: "Inter Variable",
  hasOutline: true,
  hasShadow: false,
  background: { fill: lightgrey },
  graticule: { stroke: darkgrey, strokeWidth: 0.5 },
  base: {
    fill: "white",
    stroke: lightgrey,
  },
  symbol: {
    stroke: "black",
    strokeWidth: 1,
    fill: "black",
    fillOpacity: 0.1,
  },
  flow: {
    stroke: "grey",
    opacity: 0.25,
    arrowShape: "tip",
  },
  choropleth: {
    fill: "none",
    stroke: darkgrey,
    strokeWidth: 1,
    pattern: {
      id: "Lines",
      color: darkgrey,
    },
  },
};

export default defaultTheme;
