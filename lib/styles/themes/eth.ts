import { MapTheme } from "../../../types/MapTheme";

const petrol = "#5791a4";
const yellow = "#fee999";
const orange = "#d89e60";
const red = "#d51d09";
const anthrazit = "#444";

const eth: MapTheme = {
  hasGraticuleLables: true,
  hasOutline: true,
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
  symbol: {
    fill: red,
    fillOpacity: 0.2,
    stroke: red,
    strokeWidth: 2,
  },
};

export default eth;
