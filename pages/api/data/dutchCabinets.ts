import type { NextApiRequest, NextApiResponse } from "next";
import getDutchCabinets from "../../../lib/data/getDutchCabinets";
import { DutchCabinet } from "../../../types/DutchCabinet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DutchCabinet[]>
) {
  res.status(200).json(await getDutchCabinets());
}
