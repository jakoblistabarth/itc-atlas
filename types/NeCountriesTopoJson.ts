import type { Topology, GeometryCollection } from "topojson-specification";

export type NeCountriesTopoJson = Topology<{
  countries: GeometryCollection<CountryProperties>; //Question: is it correct that it is not possible to define the geometry type of the geometry
  land: GeometryCollection;
}>;

export type CountryProperties = {
  name: string;
  iso3code: string;
};
