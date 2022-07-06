import ne_110m_rivers_lake_centerlines from "../../data/topographic/ne_110m_rivers_lake_centerlines.json";
import ne_10m_rivers_lake_centerlines from "../../data/topographic/ne_10m_rivers_lake_centerlines.json";
import type { Topology } from "topojson-specification";

export default function getRivers(scale?: "10m" | "50m" | "110m"): Topology {
  switch (scale) {
    case "10m":
      return ne_10m_rivers_lake_centerlines;
    case "50m":
      return ne_10m_rivers_lake_centerlines;
    default:
      return ne_110m_rivers_lake_centerlines;
  }
}
