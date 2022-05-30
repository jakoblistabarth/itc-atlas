import { Vector3 } from "three";

export const lonLatToXYZ = (
  lon: number,
  lat: number,
  radius: number,
  offset = 0
) => {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lon - 180) * Math.PI) / 180;

  const x = -(radius + offset) * Math.cos(phi) * Math.cos(theta);
  const y = (radius + offset) * Math.sin(phi);
  const z = (radius + offset) * Math.cos(phi) * Math.sin(theta);
  return new Vector3(x, y, z);
};

export default lonLatToXYZ;
