import type { GeoJSON } from "geojson";
import type { NextApiRequest, NextApiResponse } from "next";
import getAirports from "../../../lib/data/getAirports";

type airportData = {
  json: any; //TODO: add type for airports?
  geoJSON: GeoJSON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<airportData>
) {
  res.status(200).json(await getAirports());
}
