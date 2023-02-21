import { PhdCandidate } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getPhdCandidates from "../../../../lib/data/queries/phdCandidate/getPhdCandidates";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhdCandidate[]>
) {
  res.status(200).json(await getPhdCandidates());
}