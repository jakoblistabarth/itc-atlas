import type { NextApiRequest, NextApiResponse } from "next";
import getCountryWithProjectCount, {
  CountryWithProjectCount,
} from "../../../../../lib/data/queries/country/getCountryWithProjectCount";

/**
 * @swagger
 * /api/data/country/count/projects:
 *   get:
 *     description: Returns projects of country json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountryWithProjectCount>
) {
  res.status(200).json(await getCountryWithProjectCount());
}
