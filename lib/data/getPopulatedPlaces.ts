import ne_10m_populated_places from "../../data/topographic/ne_10m_populated_places.json";
import ne_110m_populated_places from "../../data/topographic/ne_110m_populated_places.json";
import { NePopulatedPlaces, NeScales } from "../../types/NeTopoJson";

export default function getRivers(scale?: NeScales): NePopulatedPlaces {
  switch (scale) {
    case "10m":
      return ne_10m_populated_places as unknown as NePopulatedPlaces;
    default:
      return ne_110m_populated_places as unknown as NePopulatedPlaces;
  }
}
