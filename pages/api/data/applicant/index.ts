import { Applicant } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getApplicants from "../../../../lib/data/queries/applicant/getApplicants";

/**
 * @swagger
 * /api/data/applicant:
 *   get:
 *     description: Returns applicant json
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Applicant[]>
) {
  res.status(200).json(await getApplicants());
}
