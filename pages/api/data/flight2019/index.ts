import { Flight2019 } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getFlights2019 from "../../../../lib/data/queries/flight2019/getFlights2019";

/**
 * @swagger
 * /api/data/flight2019:
 *   get:
 *     description: Returns flight2019 json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Flight2019[]>
) {
  res.status(200).json(await getFlights2019());
}
