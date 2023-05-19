import type { NextApiRequest, NextApiResponse } from "next";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../../../../lib/data/queries/country/getCountryWithApplicantCount";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountryWithApplicantCount | { error: string }>
) {
  const { level } = req.query;
  if (Array.isArray(level))
    return res.status(400).json({ error: "Please provide exact 1 level" });
  res.status(200).json(await getCountryWithApplicantCount(level));
}