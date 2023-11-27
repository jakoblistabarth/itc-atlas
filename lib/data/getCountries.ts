import ne_110m_countries from "../../data/topographic/ne_110m_admin_0_countries.json";
import ne_50m_countries from "../../data/topographic/ne_50m_admin_0_countries.json";
import ne_10m_countries from "../../data/topographic/ne_10m_admin_0_countries.json";
import { NeCountriesTopoJson, NeScales } from "../../types/NeTopoJson";

export default function getCountries(scale?: NeScales): NeCountriesTopoJson {
  switch (scale) {
    case "10m":
      return ne_10m_countries as unknown as NeCountriesTopoJson;
    case "50m":
      return ne_50m_countries as unknown as NeCountriesTopoJson;
    default:
      return ne_110m_countries as unknown as NeCountriesTopoJson;
  }
}
