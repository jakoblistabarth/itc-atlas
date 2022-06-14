import { MapTheme } from "../../../types/MapTheme";

const lightgrey = "#E7E7E7";
const darkgrey = "#c5c5c5";
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
    stroke: "black",
    strokeWidth: 1,
  },
};

export default defaultTheme;