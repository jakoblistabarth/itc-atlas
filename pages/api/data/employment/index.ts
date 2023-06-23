import { Employment } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getEmployments from "../../../../lib/data/queries/employment/getEmployments";

/**
 * @swagger
 * /api/data/employment:
 *   get:
 *     description: Returns employment json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Employment[]>
) {
  res.status(200).json(await getEmployments());
}
