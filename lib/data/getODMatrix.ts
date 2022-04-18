import * as d3 from "d3";
import type { Flight } from "../../types/Flight";
import type { ODMatrix } from "../../types/ODMatrix";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import getAirports from "./getAirports";

async function getODMatrix(flights: Flight[]): Promise<ODMatrix> {
  const flows = await getODFlows(flights);
  const points = getODPoints(flows);
  return {
    flows,
    points,
  };
}

async function getODFlows(
  flights: Flight[]
): Promise<FeatureCollection<LineString>> {
  const airports = await (await getAirports()).json;

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

  const features: Feature<LineString>[] = d3
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
        type: "Feature",
        properties: properties,
        geometry: {
          type: "LineString",
          coordinates: [
            [oAirport.long, oAirport.lat],
            [dAirport.long, dAirport.lat],
          ],
        },
      };
    })
    .filter((d) => d);

  return {
    type: "FeatureCollection",
    features: features,
  };
}

function getODPoints(
  flows: FeatureCollection<LineString>
): FeatureCollection<Point> {
  const features = flows.features.reduce((points: Feature<Point>[], flow) => {
    flow.geometry.coordinates.forEach((coordinates, index) => {
      const name = index === 0 ? flow.properties?.o : flow.properties?.d;
      if (!points.map((p) => p.properties?.name).includes(name))
        points.push({
          type: "Feature",
          properties: {
            name,
            value: flow.properties?.value,
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        });
    });
    return points;
  }, []);

  return {
    type: "FeatureCollection",
    features,
  };
}

export default getODMatrix;
