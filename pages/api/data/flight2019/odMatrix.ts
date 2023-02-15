import type { NextApiRequest, NextApiResponse } from "next";
import getOdMatrix from "../../../../lib/data/getOdMatrix";
import { OdMatrix } from "../../../../types/OdMatrix";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OdMatrix>
) {
  res.status(200).json(await getOdMatrix());
}
