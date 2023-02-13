import type { NextApiRequest, NextApiResponse } from "next";
import getProjects from "../../../lib/data/queries/project/getProjects";
import { Project } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  res.status(200).json(await getProjects());
}
