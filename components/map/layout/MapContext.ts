import { GeoProjection } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import { createContext } from "react";

type Context = {
  projection: GeoProjection;
  width: number;
  height: number;
};

export const MapContext = createContext<Context>({
  projection: geoBertin1953(),
  width: 600,
  height: 300,
});
