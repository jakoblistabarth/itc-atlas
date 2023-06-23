import { Project } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getProjects from "../../../../lib/data/queries/project/getProjects";

/**
 * @swagger
 * /api/data/project:
 *   get:
 *     description: Returns project json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  res.status(200).json(await getProjects());
}
