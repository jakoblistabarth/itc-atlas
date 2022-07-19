import type { ScaleLinear, ScaleOrdinal, ScalePower } from "d3";
import type { GeoProjection } from "d3-geo";
import type { Appearance } from "./Appearance";
import type { MapTheme } from "./MapTheme";

export type MapOptions = {
  bounds: Bounds;
  projection: GeoProjection;
  theme: MapTheme;
  scales?: {
    [name: string]:
      | ScaleLinear<number, number>
      | ScalePower<number, number>
      | ScaleOrdinal<string, string>;
  };
  styles?: {
    [name: string]: Appearance;
  };
};

export type Bounds = {
  width: number;
  height?: number;
  frame?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  mapBody?: {
    width: number;
    height: number;
  };
};
