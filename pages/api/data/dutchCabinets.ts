import type { NextApiRequest, NextApiResponse } from "next";
import getDutchCabinets from "../../../lib/data/getDutchCabinets";
import { DutchCabinet } from "../../../types/DutchCabinet";

/**
 * @swagger
 * /api/data/dutchCabinets:
 *   get:
 *     description: Returns dutchCabinets json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DutchCabinet[]>
) {
  res.status(200).json(await getDutchCabinets());
}
