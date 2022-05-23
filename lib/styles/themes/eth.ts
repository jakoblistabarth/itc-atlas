import { MapTheme } from "../../../types/MapTheme";

const petrol = "#5791a4";
const yellow = "#fee999";
const orange = "#d89e60";
const red = "#d51d09";
const anthrazit = "#444";

const eth: MapTheme = {
  fontFamily: "Fraunces",
  hasGraticuleLables: true,
  hasOutline: true,
  hasShadow: false,
  background: {
    fill: petrol,
  },
  graticule: {
    stroke: anthrazit,
    strokeWidth: 0.5,
  },
  graticuleLabel: {
    fontFamily: "Fraunces",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  label: {
    fontFamily: "Inter",
    fontSize: 10,
  },
  base: {
    fill: yellow,
    stroke: petrol,
    strokeWidth: 0.5,
  },
  choropleth: {
    pattern: {
      id: "Lines",
      color: orange,
      patternTransform: {
        angle: 90,
      },
    },
    stroke: orange,
    strokeWidth: 0.5,
  },
  flow: {
    opacity: 0.2,
    stroke: "red",
    markerEnd: "ArrowHead",
  },
  symbol: {
    fill: red,
    fillOpacity: 0.2,
    stroke: red,
    strokeWidth: 2,
  },
};

export default eth;
