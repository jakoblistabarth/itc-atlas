import { Phd } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getPhds from "../../../../lib/data/queries/phd/getPhds";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Phd[]>
) {
  res.status(200).json(await getPhds());
}
