import { Vector3 } from "three";

/**
 * Returns the Cartesian coordinates of a point given as pair of geographic coordinates,
 * providing the radius of a sphere and an optional offset to this sphere.
 * @param lon The coordinate pair's longitude coordinate.
 * @param lat The coordinate pair's latitude coordinate.
 * @param radius The radius of the sphere used for the conversion.
 * @param offset An offset (from the surface of this sphere).
 * @returns A {@link Vector3} holding the Cartesian coordinates of the point.
 */
const longitudeLatitudeToXYZ = (
  longitude: number,
  latitude: number,
  radius: number,
  offset = 0
) => {
  const phi = (latitude * Math.PI) / 180;
  const theta = ((longitude - 180) * Math.PI) / 180;

  const x = -(radius + offset) * Math.cos(phi) * Math.cos(theta);
  const y = (radius + offset) * Math.sin(phi);
  const z = (radius + offset) * Math.cos(phi) * Math.sin(theta);
  return new Vector3(x, y, z);
};

export default longitudeLatitudeToXYZ;
