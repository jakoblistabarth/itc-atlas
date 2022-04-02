import type { NextApiRequest, NextApiResponse } from "next";
import getProjects from "../../../lib/getProjects";
import { Project } from "../../../types/Project";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  res.status(200).json(await getProjects());
}
