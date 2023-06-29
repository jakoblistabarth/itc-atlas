import type { NextApiRequest, NextApiResponse } from "next";
import getOdMatrix from "../../../../lib/data/getOdMatrix";
import { OdMatrix } from "../../../../types/OdMatrix";

/**
 * @swagger
 * /api/data/flight2019/odMatrix:
 *   get:
 *     description: Returns odMatrix json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OdMatrix>
) {
  res.status(200).json(await getOdMatrix());
}
