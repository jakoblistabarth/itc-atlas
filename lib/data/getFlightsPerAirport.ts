import * as d3 from "d3";
import type { Point, Feature, FeatureCollection } from "geojson";
import type { AirportProperties } from "../../types/Travels";
import getAirports from "./getAirports";
import getFlights2019 from "./queries/flight2019/getFlights2019";

export type AirportPropertiesWithCount = AirportProperties & {
  value: number;
};

const getFlightsPerAirport = async () => {
  const flights = await getFlights2019();

  const airports = getAirports().json;
  const allAirports = flights.map((d) => d.airportCodes).flat();

  const count = d3.rollup(
    allAirports,
    (v) => v.length,
    (d) => d,
  );

  const features = airports
    .map((d) => {
      const value = count.get(d.iataCode);
      const feature: Feature<Point, AirportPropertiesWithCount> = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [d.longitude, d.latitude],
        },
        properties: { ...d, value: value ?? 0 },
      };
      return feature;
    })
    .filter((d) => d.properties?.value);

  const featureCollection: FeatureCollection<
    Point,
    AirportPropertiesWithCount
  > = {
    type: "FeatureCollection",
    features: features,
  };

  return featureCollection;
};
export default getFlightsPerAirport;
