import type { NextApiRequest, NextApiResponse } from "next";
import getBTORs from "../../../lib/data/getBTORs";
import { BTOR } from "../../../types/Travels";

type btors = BTOR[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<btors>
) {
  res.status(200).json(await getBTORs());
}
