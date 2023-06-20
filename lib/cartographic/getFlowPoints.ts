import type { GeoProjection } from "d3-geo";
import type { Feature, LineString } from "geojson";
import { Vector2 } from "three";

const getFlowPoints = (
  flow: Feature<LineString>,
  projection?: GeoProjection,
  bend = 0.3
) => {
  const o = flow.geometry.coordinates[0];
  const d = flow.geometry.coordinates[1];
  const a = projection ? projection([o[0], o[1]]) : o;
  const b = projection ? projection([d[0], d[1]]) : d;
  if (!a || !b) return;

  const av = new Vector2(a[0], a[1]);
  const bv = new Vector2(b[0], b[1]);
  const v = bv.clone().sub(av);
  const m = av.clone().add(v.clone().multiplyScalar(0.5));
  const controlPoint = m
    .clone()
    .add(v.clone().multiplyScalar(bend))
    .rotateAround(m, Math.PI / 2);

  const vStart = controlPoint.clone().sub(av);
  const vEnd = controlPoint.clone().sub(bv);
  const offset = 3;
  const startPoint = av.clone().add(vStart.normalize().multiplyScalar(offset));
  const endPoint = bv.clone().add(vEnd.normalize().multiplyScalar(offset));
  return [startPoint, controlPoint, endPoint].map((v2) => v2.toArray());
};

export default getFlowPoints;
