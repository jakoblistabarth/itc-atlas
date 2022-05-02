import type { GeoJSON } from "geojson";
import type { NextApiRequest, NextApiResponse } from "next";
import getAirports from "../../../lib/data/getAirports";
import type { Data } from "../../../types/DataFrame";

type airportData = {
  json: Data;
  geoJSON: GeoJSON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<airportData>
) {
  res.status(200).json(await getAirports());
}
