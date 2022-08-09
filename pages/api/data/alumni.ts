import type { NextApiRequest, NextApiResponse } from "next";
import getAlumni from "../../../lib/data/getAlumni";
import { Alumni } from "../../../types/Alumni";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Alumni[]>
) {
  res.status(200).json(await getAlumni());
}
