import { MapTheme } from "../../../types/MapTheme";

const lightgrey = "#E7E7E7";
const darkgrey = "#c5c5c5";
const red = "#f00";

const muted: MapTheme = {
  hasOutline: true,
  hasShadow: false,
  background: { fill: lightgrey },
  graticule: { stroke: darkgrey, strokeWidth: 0.5 },
  base: {
    fill: "white",
    stroke: lightgrey,
  },
  symbol: {
    stroke: red,
    strokeWidth: 1,
    fill: red,
    fillOpacity: 0.1,
  },
  scaledPie: {
    fillOpacity: 1,
    stroke: lightgrey,
    strokeWidth: 2,
  },
  choropleth: {
    fill: "none",
    stroke: "black",
    strokeWidth: 1,
  },
};

export default muted;
