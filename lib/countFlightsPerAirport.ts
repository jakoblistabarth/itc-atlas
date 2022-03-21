import * as d3 from "d3";

export default function countFlightsPerAirport(flights, airports) {
  const allAirports = flights.map((d) => d.airportCodes).flat();

  const count = d3.rollup(
    allAirports,
    (v) => v.length,
    (d) => d
  );

  console.log(count.get("DAR"));
  console.log(airports[0]);

  const features = airports.map((d) => {
    const value = count.get(d.iata_code);
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [d.long, d.lat],
      },
      properties: { ...d, value: value },
    };
  });

  return {
    type: "FeatureCollection",
    features: features,
  };
}
