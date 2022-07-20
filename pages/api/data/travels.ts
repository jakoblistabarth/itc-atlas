import type { NextApiRequest, NextApiResponse } from "next";
import getTravels from "../../../lib/data/getTravels";
import { Travel } from "../../../types/Travels";

type travels = Travel[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<travels>
) {
  res.status(200).json(await getTravels());
}
