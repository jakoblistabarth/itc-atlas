import type { NextApiRequest, NextApiResponse } from "next";
import getPhdCandidates from "../../../lib/data/getPhdCandidates";
import { PhdCandidate } from "../../../types/PhdCandidate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhdCandidate[]>
) {
  res.status(200).json(await getPhdCandidates());
}
