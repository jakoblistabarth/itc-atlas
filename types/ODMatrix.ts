import type { FeatureCollection, LineString, Point } from "geojson";

export type FlowProperties = {
  od: string;
  o: string;
  d: string;
  value: number;
};

export type FlowPointProperties = {
  name: string;
  value: number;
};

export type ODMatrix = {
  flows: FeatureCollection<LineString, FlowProperties>;
  points: FeatureCollection<Point>;
};
