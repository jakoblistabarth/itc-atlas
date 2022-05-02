import csv from "csvtojson";
import type { Feature, FeatureCollection } from "geojson";

export default async function getAirports() {
  const csvFilePath = "./data/airports.csv";
  const airports = await csv({
    checkType: true,
  }).fromFile(csvFilePath);

  const features: Feature[] = airports.map((d) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [d.long, d.lat],
      },
      properties: d,
    };
  });

  const geoJSON: FeatureCollection = {
    type: "FeatureCollection",
    features: features,
  };

  return {
    json: airports,
    geoJSON: geoJSON,
  };
}
