import type { Position } from "geojson";
import { CubicBezierCurve3, Vector3 } from "three";
import lonLatToXYZ from "./lonLatToXYZ";
import { toDegree, toRadians } from "./angles";

const getFlowCurve3D = (
  origin: Position,
  destination: Position,
  radius: number = 1
) => {
  // λ is longitude, where 	φ is latitude
  const lambda1 = toRadians(origin[0]);
  const lambda2 = toRadians(destination[0]);
  const phi1 = toRadians(origin[1]);
  const phi2 = toRadians(destination[1]);

  const Bx = Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  const By = Math.cos(phi2) * Math.sin(lambda2 - lambda1);
  const phiM = Math.atan2(
    Math.sin(phi1) + Math.sin(phi2),
    Math.sqrt((Math.cos(phi1) + Bx) * (Math.cos(phi1) + Bx) + By * By)
  );
  const lambdaM = lambda1 + Math.atan2(By, Math.cos(phi1) + Bx);
  const m = [toDegree(lambdaM), toDegree(phiM)];

  const o3 = lonLatToXYZ(origin[0], origin[1], radius);
  const d3 = lonLatToXYZ(destination[0], destination[1], radius);
  const m3 = lonLatToXYZ(m[0], m[1], radius + radius * 0.25);

  const c1 = o3.clone().add(m3.clone().sub(o3).multiplyScalar(0.5));
  const c2 = d3.clone().add(m3.clone().sub(d3).multiplyScalar(0.5));

  const curve = new CubicBezierCurve3(o3, c1, c2, d3);

  return { curve, vertices: [o3, c1, c2, d3] };
};

export default getFlowCurve3D;
