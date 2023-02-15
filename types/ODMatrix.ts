import type { FeatureCollection, LineString, Point } from "geojson";
import getOdMatrix from "../lib/data/getOdMatrix";

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

export type OdMatrix = Awaited<ReturnType<typeof getOdMatrix>>;
