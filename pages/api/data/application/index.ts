import { Application } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import getApplications from "../../../../lib/data/getApplications";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Application[]>
) {
  res.status(200).json(await getApplications());
}
