import type { NextApiRequest, NextApiResponse } from "next";
import getPopulatedPlaces from "../../../lib/data/getPopulatedPlaces";
import { NePopulatedPlaces } from "../../../types/NeTopoJson";

/**
 * @swagger
 * /api/data/populatedPlacesNE:
 *   get:
 *     description: Returns populatedPlacesNE json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NePopulatedPlaces>
) {
  res.status(200).json(getPopulatedPlaces("10m"));
}
