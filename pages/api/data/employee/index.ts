import { Employee } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getEmployees from "../../../../lib/data/queries/employee/getEmployees";

/**
 * @swagger
 * /api/data/employee:
 *   get:
 *     description: Returns employee json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Employee[]>
) {
  res.status(200).json(await getEmployees());
}
