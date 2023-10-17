import { GeoProjection, ScaleTime } from "d3";
import { Vector2, Vector3 } from "three";

/**
 * Returns the Cartesian coordinates of a point given as pair of geographic coordinates
 * together with a point in time, given a timeScale and a map projection.
 * @param coordinates Vector2
 * @param dateTime Date
 * @param tScale A scale
 * @param projection A projection
 * @returns A {@link Vector3} holding the Cartesian coordinates of the point.
 */
const longitudeLatitudeTimeToXYZ = (
  coordinates: Vector2,
  dateTime: Date,
  timeScale: ScaleTime<number, number>,
  projection: GeoProjection
) => {
  const y = timeScale(dateTime);
  const [x, z] = projection([coordinates.x, coordinates.y]) ?? [0, 0];
  return new Vector3(x, y, z);
};

export default longitudeLatitudeTimeToXYZ;
