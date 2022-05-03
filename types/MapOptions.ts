import { GeoProjection } from "d3-geo";
import { MapTheme } from "./MapTheme";

export type MapOptions = {
  // title?: string,
  // data?: any,
  width: number;
  height: number;
  projection: GeoProjection;
  theme: MapTheme;
};
