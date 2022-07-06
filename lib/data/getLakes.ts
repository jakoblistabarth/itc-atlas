import lakes_110m from "../../data/topographic/ne_110m_lakes.json";
import lakes_10m from "../../data/topographic/ne_10m_lakes.json";
import type { Topology } from "topojson-specification";

export default function getLakes(scale?: "10m" | "50m" | "110m"): Topology {
  switch (scale) {
    case "10m":
      return lakes_10m;
    case "50m":
      return lakes_10m;
    default:
      return lakes_110m;
  }
}
