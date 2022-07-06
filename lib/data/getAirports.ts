import csv from "csvtojson";
import type { Feature, FeatureCollection } from "geojson";
import { AirportProperties } from "../../types/Travels";

export default async function getAirports() {
  // file containing only major airports derived from https://datahub.io/core/airport-codes
  const csvFilePath = "./data/static/airports.csv";
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
    json: airports as AirportProperties[],
    geoJSON: geoJSON,
  };
}
