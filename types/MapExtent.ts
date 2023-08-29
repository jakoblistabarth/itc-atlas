import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  GeoGeometryObjects,
} from "d3-geo";

export type MapExtent =
  | GeoGeometryObjects
  | ExtendedFeatureCollection
  | ExtendedFeature;
