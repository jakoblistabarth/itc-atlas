import type {
  Topology,
  GeometryCollection,
  Polygon,
  MultiPolygon,
} from "topojson-specification";

export type NeScales = "10m" | "50m" | "110m";

export type CountryProperties = {
  NAME_EN: string;
  NAME_NL: string;
  ADM0_A3_NL: string;
  ADM0_A3: string;
  ADM0_ISO: string;
  ADM0_UN: string;
};

export interface NeCountriesTopoJson extends Topology {
  objects: {
    ne_admin_0_countries: {
      type: "GeometryCollection";
      geometries: (
        | MultiPolygon<CountryProperties>
        | Polygon<CountryProperties>
      )[];
    };
  };
}

export type NeTopoProperties = {
  name_en: string;
  name_alt: string;
  featurecla: string;
};

export type NeLakes = Topology<{
  ne_lakes: GeometryCollection<NeTopoProperties>;
}>;

export type NeRivers = Topology<{
  ne_rivers_lake_centerlines: GeometryCollection<NeTopoProperties>;
}>;

export type NePopulatedPlacesProperties = {
  NAME_EN: string;
  NAME_NL: string;
  NAMEPAR: string;
  ISO_A2: string;
  ADM0_A3: string;
  LATITUDE: number;
  LONGITUDE: number;
};

export type NePopulatedPlaces = Topology<{
  ne_populated_places: GeometryCollection<NePopulatedPlacesProperties>;
}>;
