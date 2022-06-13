import { GeoProjection, GeoSphere } from "d3-geo";
import * as d3 from "d3";
import { Bounds } from "../../types/MapOptions";

function getMapHeight(
  width: number,
  projection: GeoProjection,
  marginBottom: number = 0
) {
  const sphere: GeoSphere = { type: "Sphere" };
  const [[x0, y0], [x1, y1]] = d3
    .geoPath(projection.fitWidth(width, sphere))
    .bounds(sphere);
  const dy = Math.ceil(y1 - y0),
    l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
  return dy + marginBottom;
}

export default getMapHeight;

/**
 * Sets the map bounds based on a bounds object.
 * Also adjusts the provided projection based on the bounds.
 * @param bounds A {@link Bounds} object.
 * @param projection A {@link GeoProjection}.
 * @returns The adjusted {@link GeoProjection}.
 */
export function setMapBounds(bounds: Bounds, projection: GeoProjection) {
  const width =
    bounds.width - ((bounds.frame?.left ?? 0) + (bounds.frame?.right ?? 0));
  if (!bounds.height) {
    const height = getMapHeight(width, projection);
    bounds.mapBody = { width, height };
    bounds.height =
      bounds.mapBody.height +
      (bounds.frame?.top ?? 0) +
      (bounds.frame?.bottom ?? 0);
  } else {
    const height =
      bounds.height - ((bounds.frame?.top ?? 0) + (bounds.frame?.bottom ?? 0));
    bounds.mapBody = { width, height };
    projection.fitSize([bounds.mapBody.width, bounds.mapBody.height], {
      type: "Sphere",
    });
  }
  return projection;
}
