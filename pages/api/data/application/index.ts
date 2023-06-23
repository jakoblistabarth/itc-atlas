import { Application } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getApplications from "../../../../lib/data/queries/application/getApplications";

/**
 * @swagger
 * /api/data/application:
 *   get:
 *     description: Returns application json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Application[]>
) {
  res.status(200).json(await getApplications());
}
