import lakes_110m from "../../data/topographic/ne_110m_lakes.json";
import lakes_10m from "../../data/topographic/ne_10m_lakes.json";
import { NeLakes, NeScales } from "../../types/NeTopoJson";

export default function getLakes(scale?: NeScales): NeLakes {
  switch (scale) {
    case "10m":
      return lakes_10m as unknown as NeLakes;
    default:
      return lakes_110m as unknown as NeLakes;
  }
}
