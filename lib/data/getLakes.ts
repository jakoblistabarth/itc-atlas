import lakes_110m from "../../data/geographic/ne_110m_lakes.json";
import lakes_10m from "../../data/geographic/ne_10m_lakes.json";

export default function getLakes(scale?: "10m" | "50m" | "110m") {
  switch (scale) {
    case "10m":
      return lakes_10m;
    case "50m":
      return lakes_10m;
    default:
      return lakes_110m;
  }
}
