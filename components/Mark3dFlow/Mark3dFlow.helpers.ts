import type { Position } from "geojson";
import { CurvePath, CubicBezierCurve3, Vector3, Vector2 } from "three";
import longitudeLatitudeToXYZ from "../../lib/helpers/longitudeLatitudeToXYZ";
import { geoEquirectangular } from "d3-geo";

export const getFlowCurve3D = (
  origin: Position,
  destination: Position,
  radius: number,
  arcHeight: number,
) => {
  const proj = geoEquirectangular();
  const o = new Vector2(...(proj([origin[0], origin[1]]) ?? [0, 0]));
  const d = new Vector2(...(proj([destination[0], destination[1]]) ?? [0, 0]));
  const od = new Vector2().subVectors(o, d);
  const m = new Vector2().lerpVectors(o, d, 0.5);
  const controlPoint = m
    .clone()
    .add(od.clone().multiplyScalar(0.25))
    .rotateAround(m, Math.PI / 2);

  const [mx, my] = proj.invert
    ? proj.invert([controlPoint.x, controlPoint.y]) ?? [0, 0]
    : [controlPoint.x, controlPoint.y];
  const start = longitudeLatitudeToXYZ(origin[0], origin[1], radius);
  const end = longitudeLatitudeToXYZ(destination[0], destination[1], radius);
  const mid = longitudeLatitudeToXYZ(mx, my, radius + arcHeight);

  const v = new Vector3().subVectors(end, start);

  const midStartAnchor = mid.clone().add(v.clone().multiplyScalar(-0.5));
  const midEndAnchor = mid.clone().add(v.clone().multiplyScalar(0.5));
  const curveA = new CubicBezierCurve3(start, start, midStartAnchor, mid);
  const curveB = new CubicBezierCurve3(mid, mid, midEndAnchor, end);
  const curve = new CurvePath<Vector3>();
  curve.add(curveA);
  curve.add(curveB);

  return curve;
};
