import type { FeatureCollection, LineString } from "geojson";
import * as d3 from "d3";

const geoEquator: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: d3.range(-180, 180 + 1, 5).map((lon) => [lon, 0]),
      },
      properties: {},
    },
  ],
};

export default geoEquator;
