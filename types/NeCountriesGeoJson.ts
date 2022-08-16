import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import { CountryProperties } from "./NeTopoJson";

export type NeCountriesGeoJson = FeatureCollection<
  Polygon | MultiPolygon,
  CountryProperties
>;
