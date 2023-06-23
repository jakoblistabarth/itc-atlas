import type { NextApiRequest, NextApiResponse } from "next";
import getBtorsWithRelations, {
  BtorsWithRelations,
} from "../../../../lib/data/queries/btors/getBtors";

/**
 * @swagger
 * /api/data/btor:
 *   get:
 *     description: Returns btor json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BtorsWithRelations>
) {
  res.status(200).json(await getBtorsWithRelations());
}
