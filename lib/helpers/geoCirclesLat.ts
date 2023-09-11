import type { FeatureCollection, LineString } from "geojson";
import * as d3 from "d3";

const circles: { name: string; latitude: number }[] = [
  { name: "Arctic Circle", latitude: 66.56361 },
  { name: "Tropic of Cancer", latitude: 23.43472 },
  { name: "Tropic of Capricorn", latitude: -23.43472 },
  { name: "Antarctic Circle", latitude: -66.56361 },
];

const geoCirclesLat: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: circles.map((circle) => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: d3
        .range(-180, 180 + 1, 5)
        .map((longitude) => [longitude, circle.latitude]),
    },
    properties: circle,
  })),
};

export default geoCirclesLat;
