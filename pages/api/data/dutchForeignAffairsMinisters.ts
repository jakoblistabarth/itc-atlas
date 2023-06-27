import type { NextApiRequest, NextApiResponse } from "next";
import getDutchForeignAffairsMinisters from "../../../lib/data/getDutchForeignAffairsMinisters";
import { Minister } from "../../../types/Minister";

/**
 * @swagger
 * /api/data/dutchForeignAffairsMinisters:
 *   get:
 *     description: Returns dutchForeignAffairsMinisters json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Minister[]>
) {
  res.status(200).json(await getDutchForeignAffairsMinisters());
}
