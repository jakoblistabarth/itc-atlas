import * as d3 from "d3";
import type { GeoProjection } from "d3-geo";
import type { Position, Feature, LineString } from "geojson";

const getGraticuleTextPath = (
  type: "lat" | "lon",
  degree: number,
  projection: GeoProjection
) => {
  const coordinates: Position[] =
    type === "lat"
      ? d3.range(-180, 180 + 1, 2).map((lon) => [lon, degree])
      : d3.range(-90, 90 + 1, 2).map((lat) => [degree, lat]);
  const line: LineString = {
    type: "LineString",
    coordinates,
  };
  const path = d3.geoPath(projection);
  return path(line);
};

export default getGraticuleTextPath;
