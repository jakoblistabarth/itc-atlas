import { GeoPath } from "d3-geo";
import { FeatureCollection } from "geojson";

/**
 *
 * @param fc A {@link FeatureCollection}
 * @param geoPath A {@link geoPath}
 * @returns An SVG containing the feature-collection's features as individual paths.
 */
const featureCollectionToSVG = (
  fc: FeatureCollection,
  geoPath: GeoPath
): string => {
  const svgPaths = fc.features.map((f) => `<path d="${geoPath(f)}" />`);
  return `<svg xmlns="http://www.w3.org/2000/svg">${svgPaths.join("")}</svg>`;
};

export default featureCollectionToSVG;