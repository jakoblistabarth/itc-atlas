import type { GeoJSON } from "geojson";
import type { NextApiRequest, NextApiResponse } from "next";
import getAirports from "../../../lib/data/getAirports";
import { AirportProperties } from "../../../types/Travels";

/**
 * @swagger
 * /api/data/airport:
 *   get:
 *     description: Returns airport json
 *     responses:
 *       200:
 *         description: response success
 */
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
