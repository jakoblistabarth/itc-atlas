import type { NextApiRequest, NextApiResponse } from "next";
import getProjects from "../../../lib/getProjects";

// TODO return only values which are typed here
// TODO> move to types folder
export type Project = {
  projectID: string | undefined; //TODO: make others also undefined
  projectName: string;
  projectShortName: string;
  countries: string[];
  type: string;
  status: string;
  dateStart: string;
  dateEnd: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  res.status(200).json(await getProjects());
}
