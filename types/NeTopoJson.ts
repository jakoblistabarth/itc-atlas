import type { Topology, GeometryCollection } from "topojson-specification";

export type NeScales = "10m" | "50m" | "110m";

export type CountryProperties = {
  NAME_EN: string;
  ADM0_A3_NL: string;
};

export type NeCountriesTopoJson = Topology<{
  ne_admin_0_countries: GeometryCollection<CountryProperties>; //Question: is it correct that it is not possible to define the geometry type of the geometry
}>;

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
