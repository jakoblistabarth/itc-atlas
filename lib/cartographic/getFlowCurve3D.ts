import type { Position } from "geojson";
import { CurvePath, CubicBezierCurve3, Vector3 } from "three";
import lonLatToXYZ from "./lonLatToXYZ";

const getFlowCurve3D = (
  origin: Position,
  destination: Position,
  radius: number,
  arcHeight: number
) => {
  const start = lonLatToXYZ(origin[0], origin[1], radius);
  const end = lonLatToXYZ(destination[0], destination[1], radius);

  // @credits: https://github.com/bwlewis/rthreejs/blob/master/inst/htmlwidgets/globe.js

  const dist = start.clone().sub(end).length();
  const mid = start.clone().lerp(end, 0.5);
  const midLength = mid.length();
  mid.normalize();
  mid.multiplyScalar(midLength + dist * arcHeight);
  const normal = new Vector3().subVectors(start, end).normalize();

  const distanceHalf = dist * 0.5;
  const startAnchor = start;
  const midStartAnchor = mid
    .clone()
    .add(normal.clone().multiplyScalar(distanceHalf));
  const midEndAnchor = mid
    .clone()
    .add(normal.clone().multiplyScalar(-distanceHalf));
  const endAnchor = end;
  const splineCurveA = new CubicBezierCurve3(
    start,
    startAnchor,
    midStartAnchor,
    mid
  );
  const splineCurveB = new CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
  const curve = new CurvePath();
  curve.add(splineCurveA);
  curve.add(splineCurveB);

  return curve;
};

export default getFlowCurve3D;
