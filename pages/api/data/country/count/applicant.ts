import type { NextApiRequest, NextApiResponse } from "next";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../../../../lib/data/queries/country/getCountryWithApplicantCount";
import { RequestError } from "../../../../../types/RequestError";

/**
 * @swagger
 * /api/data/country/count/applicant:
 *   get:
 *     description: Returns applicant of country json, "level" and "department" is the query parameter, please enter 1 exact level and/or department
 *     parameters:
 *       - in: query
 *         name: level
 *         type: string
 *       - in: query
 *         name: department
 *         type: string
 *     responses:
 *       200:
 *         description: response success
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountryWithApplicantCount | RequestError>,
) {
  const { level, department } = req.query;
  if (Array.isArray(level) || Array.isArray(department))
    return res
      .status(400)
      .json({ error: "Please provide exact 1 level or 1 department" });
  res.status(200).json(await getCountryWithApplicantCount(level, department));
}
