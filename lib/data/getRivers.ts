import ne_110m_rivers from "../../data/geographic/ne_110m_rivers.json";
import ne_10m_rivers from "../../data/geographic/ne_10m_rivers.json";

export default function getRivers(scale?: "10m" | "50m" | "110m") {
  switch (scale) {
    case "10m":
      return ne_10m_rivers;
    case "50m":
      return ne_10m_rivers;
    default:
      return ne_110m_rivers;
  }
}
