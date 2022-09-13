import type { NextApiRequest, NextApiResponse } from "next";
import getDutchForeignAffairsMinisters from "../../../lib/data/getDutchForeignAffairsMinisters";
import { Minister } from "../../../types/Minister";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Minister[]>
) {
  res.status(200).json(await getDutchForeignAffairsMinisters());
}
