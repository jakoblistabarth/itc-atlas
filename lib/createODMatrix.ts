import * as d3 from "d3";
import { Flight } from "../types/Flight";

export default function createODMatrix(flights: Flight[], airports) {
  const od = flights.reduce((acc: [], d) => {
    const codes = d.airportCodes;
    const origins = codes.slice(0, -1);
    const routes = origins.map((code, index) => ({
      origin: code,
      destination: codes[index + 1],
      od: code + "-" + codes[index + 1],
      props: d,
    }));
    acc.push(routes);
    return acc.flat();
  }, []);

  const odGeoJSON = d3
    .rollups(
      od,
      (v) => v.length,
      (d) => d.od
    )
    .sort((a, b) => d3.descending(a[1], b[1]))
    .map((d) => {
      const [od, value] = d;
      const [origin, destination] = od.split("-");
      const properties = {
        od: od,
        o: origin,
        d: destination,
        value: value,
      };
      const oAirport = airports.find((d) => d.iata_code == origin);
      const dAirport = airports.find((d) => d.iata_code == destination);
      if (!oAirport || !dAirport) return;
      return {
        type: "LineString",
        coordinates: [
          [oAirport.long, oAirport.lat],
          [dAirport.long, dAirport.lat],
        ],
        properties: properties,
      };
    })
    .filter((d) => d);

  return odGeoJSON;
  //   if (showAMS) ? odGeoJSON : odGeoJSON.filter(d => d.properties.o !== "AMS" && d.properties.d !== "AMS");
}
