import { MapTheme } from "../../../types/MapTheme";

const green = "#008200";
const oceanblue = "#d3ecea";
const blue = "#669baf";

const bayer: MapTheme = {
  hasOutline: true,
  background: {
    fill: oceanblue,
  },
  graticule: {
    stroke: green,
    strokeWidth: 0.25,
  },
  graticuleLabel: {
    fontFamily: "Inter",
    fontWeight: "normal",
    fontStyle: "italic",
  },
  base: {
    fill: "white",
    stroke: green,
    strokeWidth: 0.5,
  },
  flow: {
    opacity: 0.4,
    stroke: blue,
    markerEnd: "triangle",
  },
  symbol: {
    fill: "white",
    fillOpacity: 0.2,
    stroke: blue,
    strokeWidth: 1,
  },
  label: {
    fontFamily: "Inter",
    fontSize: 8,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  },
};

export default bayer;
