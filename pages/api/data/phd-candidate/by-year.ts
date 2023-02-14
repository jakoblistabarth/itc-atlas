import type { NextApiRequest, NextApiResponse } from "next";
import getPhdCandidatesByYearFrom from "../../../../lib/data/queries/phdCandidate/getPhdCandidatesByYear";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { country } = req.query;
  if (!country || Array.isArray(country))
    res.status(400).json({ error: "Please provide exact 1 country code" });
  else res.status(200).json(await getPhdCandidatesByYearFrom(country));
}
