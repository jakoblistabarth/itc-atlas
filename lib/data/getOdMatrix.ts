import * as d3 from "d3";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  LineString,
  Point,
} from "geojson";
import type { FlowPointProperties } from "../../types/OdMatrix";
import { FlowProperties } from "../../types/OdMatrix";
import getAirports from "./getAirports";
import getFlights2019 from "./queries/flight2019/getFlights2019";

type od = {
  origin: string;
  destination: string;
  od: string;
  props: GeoJsonProperties;
};

const getOdMatrix = async (...args: string[]) => {
  const flows = await getODFlows(args[0]);
  const points = getODPoints(flows);
  return {
    flows,
    points,
  };
};

const getODFlows = async (
  departmentId: string,
): Promise<FeatureCollection<LineString, FlowProperties>> => {
  const flights = await getFlights2019(departmentId);
  const airports = getAirports().json;

  const od = flights.reduce((acc: od[], d) => {
    const codes = d.airportCodes;
    const origins = codes.slice(0, -1);
    const routes = origins.map((code, index) => ({
      origin: code,
      destination: codes[index + 1],
      od: code + "-" + codes[index + 1],
      props: d,
    }));
    return [...acc, ...routes];
  }, []);

  const features = d3
    .rollups(
      od,
      (v) => v.length,
      (d) => d.od,
    )
    .sort((a, b) => d3.descending(a[1], b[1]))
    .reduce((acc: Feature<LineString, FlowProperties>[], d) => {
      const [od, value] = d;
      const [origin, destination] = od.split("-");
      const oAirport = airports.find((d) => d.iata_code == origin);
      const dAirport = airports.find((d) => d.iata_code == destination);
      if (!oAirport || !dAirport) return acc;
      const properties: FlowProperties = {
        od: od,
        o: origin,
        d: destination,
        value: value,
      };
      const feature: Feature<LineString, FlowProperties> = {
        type: "Feature",
        properties: properties,
        geometry: {
          type: "LineString",
          coordinates: [
            [oAirport.lon, oAirport.lat],
            [dAirport.lon, dAirport.lat],
          ],
        },
      };
      acc.push(feature);
      return acc;
    }, []);

  return {
    type: "FeatureCollection",
    features: features,
  };
};

function getODPoints(
  flows: FeatureCollection<LineString, FlowProperties>,
): FeatureCollection<Point, FlowPointProperties> {
  const features = flows.features.reduce(
    (points: Feature<Point, FlowPointProperties>[], flow) => {
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
    },
    [],
  );

  return {
    type: "FeatureCollection",
    features,
  };
}

export default getOdMatrix;
