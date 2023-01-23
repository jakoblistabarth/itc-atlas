import { MapTheme } from "../../../types/MapTheme";

const lightgrey = "#f0f0f0";
const darkgrey = "#dcdcdc";
const red = "#f00";

const defaultTheme: MapTheme = {
  fontFamily: "Inter",
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
  scaledPie: {
    fillOpacity: 1,
    stroke: lightgrey,
    strokeWidth: 2,
  },
  flow: {
    stroke: "grey",
    opacity: 0.25,
    markerEnd: "tip",
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
