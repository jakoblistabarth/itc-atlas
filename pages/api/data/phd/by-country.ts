import type { NextApiRequest, NextApiResponse } from "next";
import getPhdsByCountryByDepartment from "../../../../lib/data/queries/phd/getPhdsByCountryByDepartment";

/**
 * @swagger
 * /api/data/phd/by-country:
 *   get:
 *     description: Returns phd of each country json, "graduated" is the query parameter, please specify the graduated (true of false)
 *     parameters:
 *        - in: query
 *          name: graduated
 *          type: boolean
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Awaited<ReturnType<typeof getPhdsByCountryByDepartment>>>
) {
  const graduated = req.query.graduated?.toString() ? true : false;
  res.status(200).json(await getPhdsByCountryByDepartment(graduated));
}
