import { GeoProjection, GeoSphere } from "d3-geo";
import * as d3 from "d3";

function getMapHeight(width: number, projection: GeoProjection) {
  const sphere: GeoSphere = { type: "Sphere" };
  const [[x0, y0], [x1, y1]] = d3
    .geoPath(projection.fitWidth(width, sphere))
    .bounds(sphere);
  const dy = Math.ceil(y1 - y0),
    l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
  return dy;
}

export default getMapHeight;
