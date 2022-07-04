import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";

export type NeCountriesGeoJson = FeatureCollection<
  Polygon | MultiPolygon,
  CountryProperties
>;

type CountryProperties = {
  name: string;
  iso3code: string;
};
