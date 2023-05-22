import type { NextApiRequest, NextApiResponse } from "next";
import getPhdsByYearFrom from "../../../../lib/data/queries/phd/getPhdsByYear";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { country } = req.query;
  if (!country || Array.isArray(country))
    res.status(400).json({ error: "Please provide exact 1 country code" });
  else res.status(200).json(await getPhdsByYearFrom(country));
}
