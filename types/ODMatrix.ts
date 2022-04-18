import type { FeatureCollection, LineString, Point } from "geojson";

export type ODMatrix = {
  flows: FeatureCollection<LineString>;
  points: FeatureCollection<Point>;
};
