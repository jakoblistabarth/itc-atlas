import Vector2D from "./vector2D";
import type { GeoProjection } from "d3-geo";
import type { Feature, LineString } from "geojson";

const getFlowPoints = (
  flow: Feature<LineString>,
  projection?: GeoProjection,
  bend: number = 0.3
) => {
  const o = flow.geometry.coordinates[0];
  const d = flow.geometry.coordinates[1];
  const a = projection ? projection(o) : o;
  const b = projection ? projection(d) : d;
  if (!a || !b) return;
  const v = new Vector2D(b[0] - a[0], b[1] - a[1]);
  const midPoint = new Vector2D(a[0], a[1]).plus(v.times(0.5));
  const controlPoint = midPoint.plus(v.getNormal().times(bend)).toPoint();
  const vStart = new Vector2D(controlPoint[0] - a[0], controlPoint[1] - a[1]);
  const vEnd = new Vector2D(controlPoint[0] - b[0], controlPoint[1] - b[1]);
  const offset = 3;
  const startPoint = new Vector2D(a[0], a[1])
    .plus(vStart.getUnitVector().times(offset))
    .toPoint();
  const endPoint = new Vector2D(b[0], b[1])
    .plus(vEnd.getUnitVector().times(offset)) // TODO: add more offset based on linewidth (i.e. size of arrowhead)
    .toPoint();
  return [startPoint, controlPoint, endPoint];
};

export default getFlowPoints;
