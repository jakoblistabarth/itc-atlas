import type { NextApiRequest, NextApiResponse } from "next";
import getProjects from "../../../lib/getProjects";

// QUESTION how to type such data entities?
export type Project = {
  project_id: string;
  projectName: string;
  projectShortName: string;
  countries: string[];
  type: string;
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  res.status(200).json(await getProjects());
}
