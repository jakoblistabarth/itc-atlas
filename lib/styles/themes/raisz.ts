import { MapTheme } from "../../../types/MapTheme";

const ballPen = "#0065ff";
const oceanblue = "#a5c2db";
const oceanblueDark = "#889fb4";
const red = "#d51d09";

const raisz: MapTheme = {
  hasOutline: true,
  hasShadow: true,
  background: {
    fill: oceanblue,
    gradient: [
      { color: oceanblue, stop: 85 },
      { color: oceanblueDark, stop: 100 },
    ],
  },
  graticule: {
    stroke: ballPen,
    strokeWidth: 0.5,
  },
  graticuleLabel: {
    fontFamily: "Fraunces Variable",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  base: {
    fill: "white",
    stroke: red,
    strokeWidth: 1,
  },
  choropleth: {
    pattern: {
      id: "Dots",
      color: oceanblue,
      patternTransform: {
        angle: 90,
      },
    },
    stroke: red,
    // strokeWidth: 1,
  },
  flow: {
    opacity: 0.4,
    stroke: "rgb(150, 5, 5)",
    arrowShape: "tip",
  },
  symbol: {
    fill: "white",
    fillOpacity: 0.2,
    stroke: red,
    strokeWidth: 1,
  },
  label: {
    fontFamily: "Fraunces Variable",
    fontSize: 8,
  },
};

export default raisz;
