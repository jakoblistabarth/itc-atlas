import * as d3 from "d3";
import type { Point, Feature, FeatureCollection } from "geojson";
import type { AirportProperties } from "../../types/Travels";
import getAirports from "./getAirports";
import getFlights2019 from "./queries/flight2019/getFlights2019";

const getFlightsPerAirport = async () => {
  const flights = await getFlights2019();

  const airports = getAirports().json;
  const allAirports = flights.map((d) => d.airportCodes).flat();

  const count = d3.rollup(
    allAirports,
    (v) => v.length,
    (d) => d
  );

  const features = airports
    .map((d) => {
      const value = count.get(d.iata_code);
      const feature: Feature<Point> = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [d.lon, d.lat],
        },
        properties: { ...d, value: value },
      };
      return feature;
    })
    .filter((d) => d.properties?.value);

  const featureCollection: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: features,
  };

  return featureCollection;
};
export default getFlightsPerAirport;
