import { ScaleLinear, ScaleOrdinal, ScalePower } from "d3";
import { GeoProjection } from "d3-geo";
import { Appearance } from "./Appearance";
import { MapTheme } from "./MapTheme";

export type MapOptions = {
  bounds: Bounds;
  projection: GeoProjection;
  theme: MapTheme;
  scales: {
    [name: string]:
      | ScaleLinear<number, number>
      | ScalePower<number, number>
      | ScaleOrdinal<string, string>;
  };
  styles: {
    [name: string]: Appearance;
  };
};

export type Bounds = {
  width: number;
  height: number;
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
