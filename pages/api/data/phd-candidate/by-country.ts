import type { NextApiRequest, NextApiResponse } from "next";
import getPhdCandidatesByCountryByDepartment from "../../../../lib/data/queries/phdCandidate/getPhdCandidatesByCountryByDepartment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Awaited<ReturnType<typeof getPhdCandidatesByCountryByDepartment>>
  >
) {
  const graduated = req.query.graduated?.toString() ? true : false;
  res.status(200).json(await getPhdCandidatesByCountryByDepartment(graduated));
}
