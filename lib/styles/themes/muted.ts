import { MapTheme } from "../../../types/MapTheme";

const lightgrey = "#E7E7E7";
const darkgrey = "#c5c5c5";
const red = "#f00";

const muted: MapTheme = {
  hasOutline: true,
  background: { fill: lightgrey },
  graticule: { stroke: darkgrey, strokeWidth: 0.5 },
  base: {
    fill: "white",
    stroke: lightgrey,
  },
  symbol: {
    stroke: lightgrey,
    strokeWidth: 1,
    fill: red,
  },
};

export default muted;
