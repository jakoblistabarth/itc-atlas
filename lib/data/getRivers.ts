import ne_110m_rivers_lake_centerlines from "../../data/topographic/ne_110m_rivers_lake_centerlines.json";
import ne_10m_rivers_lake_centerlines from "../../data/topographic/ne_10m_rivers_lake_centerlines.json";
import { NeRivers, NeScales } from "../../types/NeTopoJson";

export default function getRivers(scale?: NeScales): NeRivers {
  switch (scale) {
    case "10m":
      return ne_10m_rivers_lake_centerlines as unknown as NeRivers;
    default:
      return ne_110m_rivers_lake_centerlines as unknown as NeRivers;
  }
}
