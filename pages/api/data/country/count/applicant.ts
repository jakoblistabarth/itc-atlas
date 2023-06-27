import type { NextApiRequest, NextApiResponse } from "next";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../../../../lib/data/queries/country/getCountryWithApplicantCount";

/**
 * @swagger
 * /api/data/country/count/applicant:
 *   get:
 *     description: Returns applicant of country json, "level" is the query parameter, please enter 1 exact level
 *     parameters:
 *       - in: query
 *         name: level
 *         type: string
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountryWithApplicantCount | { error: string }>
) {
  const { level } = req.query;
  console.log(level);
  if (Array.isArray(level))
    return res.status(400).json({ error: "Please provide exact 1 level" });
  res.status(200).json(await getCountryWithApplicantCount(level));
}
