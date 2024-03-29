import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  GeoGeometryObjects,
  GeoProjection,
  geoPath,
} from "d3-geo";
import { Bounds } from "../../types/MapOptions";

type Options = {
  marginBottom?: number;
  extent?: GeoGeometryObjects | ExtendedFeature | ExtendedFeatureCollection;
};

/**
 * Get the height of a map based on the projection and the width of the map container.
 * It also scales the give projection according to the width and height!
 * @param width The width of the map (in pixel).
 * @param projection A D3 {@link GeoProjection}
 * @param options Options regarding the map layout (see {@link Options}). Defaults to the world extent and a margin of 0.
 * @returns The height of the map.
 */
const getMapHeight = (
  width: number,
  projection: GeoProjection,
  options?: Options
) => {
  const defaults: Required<Options> = {
    extent: { type: "Sphere" },
    marginBottom: 0,
  };
  const { extent, marginBottom } = { ...defaults, ...options };

  const [[x0, y0], [x1, y1]] = geoPath(
    projection.fitWidth(width, extent)
  ).bounds(extent);
  const dy = Math.ceil(y1 - y0),
    l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
  return dy + marginBottom;
};

export default getMapHeight;

/**
 * Sets the map bounds based on a bounds object.
 * Also adjusts the provided projection based on the bounds.
 * @param bounds A {@link Bounds} object.
 * @param projection A {@link GeoProjection}.
 * @param options {@link Options} for the projection.
 * @returns The adjusted {@link GeoProjection}.
 */
export function setMapBounds(
  bounds: Bounds,
  projection: GeoProjection,
  options?: Options
) {
  const width =
    bounds.width - ((bounds.frame?.left ?? 0) + (bounds.frame?.right ?? 0));
  if (!bounds.height) {
    const height = getMapHeight(width, projection, options);
    bounds.mapBody = { width, height };
    bounds.height =
      bounds.mapBody.height +
      (bounds.frame?.top ?? 0) +
      (bounds.frame?.bottom ?? 0);
  } else {
    const height =
      bounds.height - ((bounds.frame?.top ?? 0) + (bounds.frame?.bottom ?? 0));
    bounds.mapBody = { width, height };
    projection.fitSize(
      [bounds.mapBody.width, bounds.mapBody.height],
      options?.extent ?? {
        type: "Sphere",
      }
    );
  }
  return projection;
}
