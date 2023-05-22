import type { NextApiRequest, NextApiResponse } from "next";
import getPhdsByCountryByDepartment from "../../../../lib/data/queries/phd/getPhdsByCountryByDepartment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Awaited<ReturnType<typeof getPhdsByCountryByDepartment>>>
) {
  const graduated = req.query.graduated?.toString() ? true : false;
  res.status(200).json(await getPhdsByCountryByDepartment(graduated));
}
