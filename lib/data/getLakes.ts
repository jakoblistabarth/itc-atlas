import lakes_110m from "../../data/topographic/ne_110m_lakes.json";
import lakes_10m from "../../data/topographic/ne_10m_lakes.json";
import type { Topology } from "topojson-specification";

export default function getLakes(scale?: "10m" | "50m" | "110m"): Topology {
  switch (scale) {
    case "110m":
      return lakes_110m as unknown as Topology;
    default:
      return lakes_10m as unknown as Topology;
  }
}
