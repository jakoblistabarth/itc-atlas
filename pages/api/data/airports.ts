import type { GeoJSON } from "geojson";
import type { NextApiRequest, NextApiResponse } from "next";
import getAirports from "../../../lib/data/getAirports";
import { AirportProperties } from "../../../types/Travels";

type airportData = {
  json: AirportProperties[];
  geoJSON: GeoJSON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<airportData>
) {
  res.status(200).json(getAirports());
}
