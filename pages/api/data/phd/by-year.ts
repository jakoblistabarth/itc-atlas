import type { NextApiRequest, NextApiResponse } from "next";
import getPhdsByYearFrom from "../../../../lib/data/queries/phd/getPhdsByYear";

/**
 * @swagger
 * /api/data/phd/by-year:
 *   get:
 *     description: Returns phd of each year json, "country" is the query parameter, please specify the country
 *     parameters:
 *        - in: query
 *          name: country
 *          type: string
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { country } = req.query;
  if (!country || Array.isArray(country))
    res.status(400).json({ error: "Please provide exact 1 country code" });
  else res.status(200).json(await getPhdsByYearFrom(country));
}
