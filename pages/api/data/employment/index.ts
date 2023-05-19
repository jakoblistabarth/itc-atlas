import { Employment } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getEmployments from "../../../../lib/data/queries/employment/getEmployments";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Employment[]>
) {
  res.status(200).json(await getEmployments());
}
