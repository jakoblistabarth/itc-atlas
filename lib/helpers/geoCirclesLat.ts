import type { FeatureCollection, LineString } from "geojson";
import * as d3 from "d3";

const circles: { name: string; lat: number }[] = [
  { name: "Arctic Circle", lat: 66.56361 },
  { name: "Tropic of Cancer", lat: 23.43472 },
  { name: "Tropic of Capricorn", lat: -23.43472 },
  { name: "Antarctic Circle", lat: -66.56361 },
];

const geoCirclesLat: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: circles.map((circle) => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: d3.range(-180, 180 + 1, 5).map((lon) => [lon, circle.lat]),
    },
    properties: circle,
  })),
};

export default geoCirclesLat;
