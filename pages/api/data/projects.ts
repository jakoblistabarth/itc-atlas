import type { NextApiRequest, NextApiResponse } from "next";
import getProjects from "../../../lib/getProjects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(await getProjects());
}
