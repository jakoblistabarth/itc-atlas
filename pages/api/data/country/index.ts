import { Country } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getCountryCodes from "../../../../lib/data/queries/country/getCountryCodes";

/**
 * @swagger
 * /api/data/country:
 *   get:
 *     description: Returns country json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Country[]>
) {
  res.status(200).json(await getCountryCodes());
}
