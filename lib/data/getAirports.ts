import type { Feature, FeatureCollection } from "geojson";
import { AirportProperties } from "../../types/Travels";
import fs from "fs";

export default function getAirports() {
  const rawData = fs.readFileSync("data/topographic/airports.json", "utf-8");
  const airports = JSON.parse(rawData);

  const features: Feature[] = airports.map((d: AirportProperties) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [d.longitude, d.latitude],
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
    geoJSON,
  };
}
